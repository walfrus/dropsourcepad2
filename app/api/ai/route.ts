import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, mood } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    // Stubbed AI suggestions - in production this would call an actual AI service
    const suggestions = [
      `"${text}" - try adding more emotion here`,
      `Consider rhyming "${text}" with something that fits the mood`,
      `"${text}" could be expanded to create more imagery`,
    ];

    // Filter by mood if provided
    if (mood) {
      // In a real implementation, you'd filter suggestions based on mood
      // For now, just return the base suggestions
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Failed to get AI suggestions:', error);
    return NextResponse.json({ error: 'Failed to get AI suggestions' }, { status: 500 });
  }
}
