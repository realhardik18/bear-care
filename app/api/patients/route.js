import clientPromise from '@/lib/mongodb';

// GET: fetch all or by id (number)
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('patients');
    const { searchParams } = new URL(req.url);
    const filter = {};
    if (searchParams.has('id')) {
      filter.id = Number(searchParams.get('id'));
    }
    const patients = await collection.find(filter).toArray();
    return new Response(JSON.stringify(patients), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch patients', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// POST: create new patient
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('patients');
    const data = await req.json();
    // Ensure id is a number
    if (data.id) data.id = Number(data.id);
    const result = await collection.insertOne(data);
    return new Response(JSON.stringify({ insertedId: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create patient', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// PUT: update patient by id
export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('patients');
    const data = await req.json();
    const { id, ...update } = data;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id for update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await collection.updateOne(
      { id: Number(id) },
      { $set: update }
    );
    return new Response(JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update patient', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// DELETE: delete patient by id
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bear_care');
    const collection = db.collection('patients');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id for delete' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const result = await collection.deleteOne({ id: Number(id) });
    return new Response(JSON.stringify({ deletedCount: result.deletedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete patient', details: process.env.NODE_ENV === 'development' ? error.message : undefined }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
