export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { askAzureOpenAI } from '@/lib/ai/azureOpenAI';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are PRIMUS (Pollution Risk & Intelligent Mobility Utility System), an environmental AI assistant exclusively specialized in Bengaluru, India.
Always maintain context of Bengaluru's geography, hotspots (Silk Board, Peenya, Hebbal, Whitefield, Majestic), safe zones (Cubbon Park, Yelahanka, Jayanagar), traffic corridors, and KSPCB/CPCB standards.
Provide authoritative, actionable environmental guidance.`;

    const reply = await askAzureOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ]);

    return NextResponse.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Primus AI processing failed' }, { status: 500 });
  }
}
