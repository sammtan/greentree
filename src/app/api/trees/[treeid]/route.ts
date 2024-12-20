import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

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