import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

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