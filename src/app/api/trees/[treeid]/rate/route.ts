import { NextResponse } from 'next/server';
import { rateTree } from '@/models/TreeOperations';

export async function POST(request: Request, { params }: { params: { treeId: string } }) {
    try {
        const { rating } = await request.json();
        await rateTree(params.treeId, Number(rating));
        return NextResponse.json({ message: 'Rating submitted successfully' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
    }
}