import { NextRequest, NextResponse } from 'next/server';
import { findRhymes } from '@/lib/rhyme';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word } = body;

    if (!word || typeof word !== 'string') {
      return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
    }

    const rhymes = findRhymes(word);

    return NextResponse.json({ rhymes });
  } catch (error) {
    console.error('Failed to find rhymes:', error);
    return NextResponse.json({ error: 'Failed to find rhymes' }, { status: 500 });
  }
}
