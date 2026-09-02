export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  const safeFilename = path.basename(filename);

  const candidatePaths = [
    path.join(process.cwd(), 'aeropulse', 'backend', 'app', 'data', safeFilename),
    path.join(process.cwd(), 'public', 'data', safeFilename)
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      const fileBuffer = fs.readFileSync(p);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeFilename}"`
        }
      });
    }
  }

  // Fallback if file not yet generated
  const fallbackCsv = `id,name,value,timestamp\n1,Bengaluru Sample Telemetry,100,${new Date().toISOString()}\n`;
  return new NextResponse(fallbackCsv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeFilename}"`
    }
  });
}
