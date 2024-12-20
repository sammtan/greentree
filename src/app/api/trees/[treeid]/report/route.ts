import { NextResponse } from 'next/server';
import { reportTree } from '@/models/TreeOperations';

export async function POST(
  request: Request,
  { params }: { params: { treeid: string } }
) {
  try {
    const { username, description } = await request.json();
    if (!username || !description?.trim()) {
      return NextResponse.json(
        { error: 'Invalid input: username and description are required' },
        { status: 400 }
      );
    }
    await reportTree(params.treeid, username, description);
    return NextResponse.json({ message: 'Report submitted successfully' });
  } catch (e) {
    console.error('Error submitting report:', e);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}