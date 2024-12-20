import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
        const treeData = await request.json();
        const client = await clientPromise;
        const db = client.db("greentree");
        const result = await db.collection('trees').insertOne(treeData);
        return NextResponse.json({ id: result.insertedId });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to add tree' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("greentree");
        const trees = await db.collection('trees').find({ isActive: true }).toArray();

        // console.log('Fetched trees:', trees); // Tambahkan ini untuk debugging

        return NextResponse.json(trees);
    } catch (e) {
        console.error('Error fetching trees:', e);
        return NextResponse.json({ error: 'Failed to fetch trees' }, { status: 500 });
    }
}