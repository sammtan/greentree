import { NextResponse } from 'next/server';
import { reportTree } from '@/models/TreeOperations';

export async function POST(request: Request, { params }: { params: { treeId: string } }) {
    try {
        const { description } = await request.json();
        await reportTree(params.treeId, description);
        return NextResponse.json({ message: 'Report submitted successfully' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
    }
}