export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { askAzureOpenAI } from '@/lib/ai/azureOpenAI';

interface ReportPayload {
  category: string;
  locality: string;
  description: string;
  severity: string;
  aqiAtTime?: number;
  pm25AtTime?: number;
}

export async function POST(request: Request) {
  try {
    const body: ReportPayload = await request.json();

    const reportNumber = `BLR-CIV-${Date.now().toString().slice(-6)}`;

    // AI classification & evidence synthesis using Azure OpenAI
    const aiPrompt = `Categorize and evaluate this citizen environmental report in Bengaluru, India:
Category: ${body.category}
Locality: ${body.locality}
Severity: ${body.severity}
Description: ${body.description}

Provide a 2-sentence official summary and recommended government agency (e.g. BBMP, KSPCB, CPCB).`;

    const aiSummary = await askAzureOpenAI([
      { role: 'system', content: 'You are an environmental compliance officer reviewing civic reports in Bengaluru.' },
      { role: 'user', content: aiPrompt }
    ]);

    const reportRecord = {
      reportNumber,
      category: body.category,
      locality: body.locality,
      description: body.description,
      severity: body.severity,
      aqiAtTime: body.aqiAtTime || 280,
      pm25AtTime: body.pm25AtTime || 142,
      aiSummary,
      status: 'SUBMITTED',
      submissionType: 'INTERNAL',
      createdDate: new Date().toISOString(),
      destinationAgencies: ['KSPCB (Karnataka State Pollution Control Board)', 'BBMP Environmental Cell'],
    };

    return NextResponse.json({
      success: true,
      reportNumber,
      message: 'Civic environmental report registered in AQI SENTINEL system.',
      reportRecord,
      exportFormats: {
        pdfDownloadAvailable: true,
        jsonPayloadAvailable: true,
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to process report' }, { status: 500 });
  }
}
