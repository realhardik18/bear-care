import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const patientsCollection = db.collection('patients');

    // Get the patient data from the request
    const patientData = await req.json();

    // Ensure the patient has an ID
    if (!patientData.id) {
      return NextResponse.json(
        { error: 'Patient data must include an id field' },
        { status: 400 }
      );
    }

    // Insert or update the patient record
    const result = await patientsCollection.updateOne(
      { id: patientData.id },
      { $set: patientData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      patientId: patientData.id,
      operation: result.upsertedCount > 0 ? 'created' : 'updated'
    }, { status: 200 });

  } catch (error) {
    console.error('Patient API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process patient data',
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
    const patientsCollection = db.collection('patients');

    // Get query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const search = url.searchParams.get('search');

    // If a search term is provided, search by name or id
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchQuery = {
        $or: [
          { name: { $regex: searchRegex } },
          { id: isNaN(Number(search)) ? search : Number(search) }
        ]
      };

      const patients = await patientsCollection.find(searchQuery)
        .limit(10)
        .toArray();

      return NextResponse.json(patients, { status: 200 });
    }

    // If an ID is provided, return that specific patient
    if (id) {
      const patientId = isNaN(Number(id)) ? id : Number(id);
      const patient = await patientsCollection.findOne({ id: patientId });
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
      return NextResponse.json(patient, { status: 200 });
    }

    // Otherwise, return all patients (with pagination)
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const page = parseInt(url.searchParams.get('page') || '0');
    const skip = page * limit;

    const patients = await patientsCollection.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch patients',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
