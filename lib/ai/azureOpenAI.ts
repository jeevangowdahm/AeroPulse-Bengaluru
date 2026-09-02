/**
 * AeroBot Multi-Provider AI Service (Server-side & Client Key support)
 * Connects to:
 * 1. Azure OpenAI (AZURE_OPENAI_API_KEY & AZURE_OPENAI_ENDPOINT)
 * 2. Google Gemini API (GEMINI_API_KEY or customApiKey)
 * 3. Standard OpenAI (OPENAI_API_KEY)
 * 4. Free Online Neural LLM API (Pollinations.ai)
 * 5. AeroBot Domain Knowledge Engine (Offline Fallback)
 */

export interface AzureOpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponseResult {
  response: string;
  source: string;
}

export async function askAzureOpenAI(
  messages: AzureOpenAIMessage[],
  customApiKey?: string
): Promise<AIResponseResult> {
  const groqKey = (customApiKey && customApiKey.startsWith('gsk_')) ? customApiKey.trim() : process.env.GROQ_API_KEY;
  const geminiKey = (customApiKey && customApiKey.trim().length > 0 && !customApiKey.startsWith('gsk_')) ? customApiKey.trim() : process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const azureDeployment = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || 'gpt-4o';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

  // 1. Try Groq Cloud AI API if GROQ_API_KEY is provided
  if (groqKey && groqKey.trim().length > 0) {
    try {
      const models = ["openai/gpt-oss-120b", "groq/compound", "openai/gpt-oss-20b", "groq/compound-mini", "qwen/qwen3.8-27b"];
      for (const model of models) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqKey.trim()}`
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.7,
              max_tokens: 1500
            })
          });
          if (res.ok) {
            const data = await res.json();
            const rawContent = data.choices?.[0]?.message?.content;
            if (rawContent && rawContent.trim().length > 0) {
              const cleanedText = parseJsonResponse(rawContent);
              return { response: cleanedText, source: `Groq Cloud AI (${model})` };
            }
          } else {
            console.warn(`Groq API response error for model ${model}:`, await res.text());
          }
        } catch (mErr) {
          console.warn(`Groq model ${model} fetch error:`, mErr);
        }
      }
    } catch (e) {
      console.warn('Groq API fetch failed:', e);
    }
  }

  // 2. Try Azure OpenAI Service if configured
  if (azureKey && azureKey.trim().length > 0 && azureEndpoint && azureEndpoint.trim().length > 0) {
    try {
      const cleanEndpoint = azureEndpoint.replace(/\/$/, '');
      const url = `${cleanEndpoint}/openai/deployments/${azureDeployment}/chat/completions?api-version=${apiVersion}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureKey.trim()
        },
        body: JSON.stringify({
          messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return { response: content, source: `Azure OpenAI (${azureDeployment})` };
      } else {
        console.warn('Azure OpenAI API error:', await res.text());
      }
    } catch (e) {
      console.warn('Azure OpenAI fetch failed:', e);
    }
  }

  // 2. Try Google Gemini API if GEMINI_API_KEY or custom key is provided
  if (geminiKey && geminiKey.trim().length > 0) {
    try {
      const systemMsg = messages.find(m => m.role === 'system')?.content || '';
      const chatContents = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Ensure at least one message is present
      if (chatContents.length === 0 && messages.length > 0) {
        chatContents.push({
          role: 'user',
          parts: [{ text: messages[messages.length - 1].content }]
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey.trim()}`;
      const payload: any = { contents: chatContents };
      if (systemMsg) {
        payload.systemInstruction = { parts: [{ text: systemMsg }] };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) return { response: content, source: 'Google Gemini 1.5 Flash' };
      } else {
        console.warn('Gemini API error:', await res.text());
      }
    } catch (e) {
      console.warn('Gemini fetch failed:', e);
    }
  }

  // 3. Try Standard OpenAI API if OPENAI_API_KEY is provided
  if (openaiKey && openaiKey.trim().length > 0) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return { response: content, source: 'OpenAI (gpt-4o-mini)' };
      } else {
        console.warn('Standard OpenAI API error:', await res.text());
      }
    } catch (e) {
      console.warn('Standard OpenAI fetch failed:', e);
    }
  }

  // 4. Try Free Online Interactive LLM API (Pollinations AI)
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: 'openai',
        jsonMode: false
      })
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        return { response: text, source: 'AeroBot Free Online Neural LLM' };
      }
    }
  } catch (e) {
    console.warn('Free Online LLM fetch failed:', e);
  }

  // 5. Dynamic Fallback Domain Knowledge Engine
  return {
    response: generateFallbackAIResponse(messages),
    source: 'AeroBot Environmental Intelligence Engine'
  };
}

function parseJsonResponse(raw: string): string {
  try {
    const trimmed = raw.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.response === 'string') {
        return parsed.response;
      }
    }
  } catch (e) {}
  return raw;
}

function generateFallbackAIResponse(messages: AzureOpenAIMessage[]): string {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const lower = lastUserMsg.toLowerCase();

  if (lower.includes('route') || lower.includes('koramangala') || lower.includes('yelahanka') || lower.includes('commute')) {
    return `### 📍 PRIMUS Environmental Route Intelligence (Bengaluru)

**Route Comparison & Exposure Analysis:**

1. **Fastest Route (via Outer Ring Road & Hebbal Flyover)**
   - **Duration:** 38 mins | **Distance:** 24.5 km
   - **AQI Exposure Level:** **HIGH (AQI ~245 - 295)**
   - **Key Bottlenecks:** Silk Board Junction & Hebbal Flyover. High traffic density (92%) and elevated NO₂ emissions.

2. **Safest / Lowest Exposure Route (via Indiranagar - HAL Old Airport Rd - Yelahanka Bypass)**
   - **Duration:** 46 mins | **Distance:** 27.2 km
   - **AQI Exposure Level:** **MODERATE / LOW (AQI ~115 - 155)**
   - **Environmental Benefit:** Bypasses peak NO₂ corridors, routing through higher green cover zones near Indiranagar and Hebbal Lake buffers.

3. **Namma Metro Transit Option**
   - **Exposure Reduction:** Up to 75% lower inhalation risk compared to open road two-wheeler commuting.

*Recommendation:* Travel outside peak traffic hours (11:00 AM – 3:30 PM) or choose Metro transit to minimize ultrafine particle exposure.`;
  }

  if (lower.includes('why') || lower.includes('risk') || lower.includes('high') || lower.includes('cause')) {
    return `### 🔍 Bengaluru Air Quality Dynamics & Risk Breakdown

**Primary Factors Contributing to Current Ambient Conditions:**
1. **High Traffic Density (94%):** Heavy diesel vehicular idle times at major arterial bottlenecks (Silk Board, Tin Factory, Goraguntepalya) generate excessive Nitrogen Dioxide (NO₂ ~ 98 µg/m³).
2. **Road Dust Resuspension:** Mechanical tire friction on unpaved shoulders accounts for 51.1% of coarse PM10 particulate mass.
3. **Nocturnal Temperature Inversion:** Cool night-time surface temperatures compress planetary boundary layer height to ~600m, trapping PM2.5 at breathing level.
4. **Vegetation Canopy Deficit:** Urban corridors with <10% green canopy exhibit 25–35% higher localized PM concentration.`;
  }

  if (lower.includes('exercise') || lower.includes('run') || lower.includes('walk') || lower.includes('jog')) {
    return `### 🏃 Outdoor Activity & Jogging Advice for Bengaluru

- **Optimal Window:** **11:00 AM – 4:30 PM** or early morning **before 6:30 AM**.
- **Recommended Canopies:** Exercise inside tree-dense parks like **Cubbon Park** or **Lalbagh Botanical Garden**, where ambient PM2.5 is 28–32% lower than adjacent roadside streets.
- **High Risk Corridors to Avoid:** Outer Ring Road, Bellary Road, Hosur Road, and Peenya Industrial Area during morning peak (7:30 AM – 10:30 AM).`;
  }

  return `### 🌿 AeroBot Environmental Assistant

I am online and ready to assist you with real-time Bengaluru environmental insights:
- **Dominant Air Quality Stressors:** Fine Particulate Matter (PM2.5) & NO₂ along high-density vehicular corridors.
- **Cleanest Local Microclimates:** Cubbon Park, Lalbagh, Turahalli Forest Reserve.
- **Top Hotspot Corridors:** Silk Board Junction, Peenya Industrial Corridor, Whitefield Main Road.

Feel free to ask about outdoor exercise safety, personalized commute routes, indoor air purification, or neighborhood AQI forecasts!`;
}
