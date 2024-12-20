import { NextResponse } from 'next/server';
import { rateTree } from '@/models/TreeOperations';

export async function POST(
  request: Request,
  { params }: { params: { treeid: string } }
) {
  try {
    const { username, rating } = await request.json();
    if (!username || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid input: username and rating are required' },
        { status: 400 }
      );
    }
    await rateTree(params.treeid, username, rating);
    return NextResponse.json({ message: 'Rating submitted successfully' });
  } catch (e) {
    console.error('Error submitting rating:', e);
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
  }
}