import { generateSentences } from '@/ai/flows/generate-sentences';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();

    if (!word || typeof word !== 'string') {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    const result = await generateSentences({ word });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating sentences:', error);
    // It's better to return a generic error message to the user
    return NextResponse.json({ error: 'Failed to generate sentences. Please try again later.' }, { status: 500 });
  }
}
