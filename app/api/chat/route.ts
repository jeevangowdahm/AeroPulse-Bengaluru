export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { askAzureOpenAI, AzureOpenAIMessage } from '@/lib/ai/azureOpenAI';

export async function POST(request: Request) {
  try {
    const { query, messages: inputMessages, station_name, current_aqi, custom_api_key } = await request.json();
    const station = station_name || 'Silk Board Junction';
    const aqi = current_aqi || 186;

    const systemPrompt = `You are AeroBot, an interactive AI environmental assistant specializing in the Bengaluru Urban Region.
You are assisting a user asking about air quality, weather, traffic, health, and commute advice in Bengaluru.
Current context: User is inspecting ${station} with current AQI ${aqi}.
Guidelines:
- Ground your answers in Bengaluru landmarks (Cubbon Park, Lalbagh, Outer Ring Road, Silk Board, Peenya, KR Puram, Whitefield).
- Explain meteorological concepts like nocturnal temperature inversion, planetary boundary layer height, and wind dispersion in plain terms.
- Reference empirical source apportionment studies (CSTEP / KSPCB): Transport exhaust (39.9%), Road dust (51.1% PM10), Construction silt, Industrial boilers.
- Offer actionable public health & commute advice (e.g. Namma Metro vs 2-wheeler, HEPA filters, indoor plants like Snake Plant/Areca Palm).
- Maintain multi-turn conversational context naturally and respond interactively.
- DO NOT provide clinical disease diagnoses or substitute for a medical doctor.`;

    let messagesPayload: AzureOpenAIMessage[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(inputMessages) && inputMessages.length > 0) {
      const formattedHistory: AzureOpenAIMessage[] = inputMessages
        .filter((m: any) => m && m.content && (m.role === 'user' || m.role === 'assistant'))
        .map((m: any) => ({
          role: m.role as 'user' | 'assistant',
          content: String(m.content)
        }));
      messagesPayload.push(...formattedHistory);
    } else if (query && String(query).trim().length > 0) {
      messagesPayload.push({ role: 'user', content: String(query).trim() });
    } else {
      messagesPayload.push({ role: 'user', content: "Hello AeroBot, tell me about Bengaluru air quality today." });
    }

    const aiResult = await askAzureOpenAI(messagesPayload, custom_api_key);

    return NextResponse.json({
      response: aiResult.response,
      station_name: station,
      current_aqi: aqi,
      source: aiResult.source
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chat service error' }, { status: 500 });
  }
}

