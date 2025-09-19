import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('records');

    // Parse query params
    const { searchParams } = new URL(req.url);
    const filter = {};

    // Special handling for patientId parameter
    const patientId = searchParams.get('patientId');
    if (patientId) {
      filter.patientId = isNaN(Number(patientId)) ? patientId : Number(patientId);
    }

    // Process other parameters
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'patientId') { // Skip patientId as we've already handled it
        filter[key] = isNaN(Number(value)) ? value : Number(value);
      }
    }

    const records = await collection.find(filter).toArray();
    return new Response(JSON.stringify(records), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch records', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('records');
    const data = await req.json();
    const result = await collection.insertOne(data);
    return new Response(JSON.stringify({ insertedId: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create record', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('records');
    const data = await req.json();
    const { id, ...update } = data;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id for update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await collection.updateOne(
      { id: isNaN(Number(id)) ? id : Number(id) },
      { $set: update }
    );
    return new Response(JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update record', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('records');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id for delete' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await collection.deleteOne({ id: isNaN(Number(id)) ? id : Number(id) });
    return new Response(JSON.stringify({ deletedCount: result.deletedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete record', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
