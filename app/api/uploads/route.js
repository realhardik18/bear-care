import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const uploadsCollection = db.collection('uploads');

    const data = await req.json();
    const { date, type, items, filename } = data;

    if (!date || !type || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid upload data. Required: date, type, and items array' },
        { status: 400 }
      );
    }

    // Validate type is either "patient" or "record"
    if (type !== 'patient' && type !== 'record') {
      return NextResponse.json(
        { error: 'Type must be either "patient" or "record"' },
        { status: 400 }
      );
    }

    // Save upload metadata
    const uploadRecord = {
      date,
      type,
      filename: filename || 'unknown.json', // Store the original filename
      itemCount: items.length,
      status: 'processing',
      createdAt: new Date()
    };

    const uploadResult = await uploadsCollection.insertOne(uploadRecord);

    // Process items based on type
    let processedItems = 0;
    let failedItems = 0;

    // Determine the endpoint URL based on type
    const endpointUrl = type === 'patient' ? '/api/patients' : '/api/records';

    // Process each item by sending it to the appropriate API endpoint
    for (const item of items) {
      try {
        // Create a new Request to the appropriate endpoint
        const apiUrl = new URL(endpointUrl, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').toString();

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          processedItems++;
        } else {
          failedItems++;
          console.error(`Failed to process item: ${JSON.stringify(item)}`);
        }
      } catch (error) {
        failedItems++;
        console.error(`Error processing item: ${error.message}`);
      }
    }

    // Update the upload record with the results
    await uploadsCollection.updateOne(
      { _id: uploadResult.insertedId },
      {
        $set: {
          status: failedItems === 0 ? 'completed' : 'completed_with_errors',
          processedItems,
          failedItems,
          completedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      uploadId: uploadResult.insertedId,
      processedItems,
      failedItems,
      totalItems: items.length,
      type,
      filename: uploadRecord.filename
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process upload',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('uploads');

    // Get the most recent uploads first
    const uploads = await collection.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json(uploads, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch uploads',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
