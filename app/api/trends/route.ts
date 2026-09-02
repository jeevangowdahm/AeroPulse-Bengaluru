export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') || '7D';

  const data = [];
  const now = new Date();

  if (timeframe === '7D') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      data.push({
        date: days[d.getDay()],
        full_date: d.toISOString().split('T')[0],
        aqi: Math.round(145 + Math.sin(i) * 35),
        pm2_5: Number((65 + Math.sin(i) * 20).toFixed(1)),
        pm10: Number((130 + Math.sin(i) * 40).toFixed(1)),
        no2: Number((48 + Math.cos(i) * 15).toFixed(1))
      });
    }
  } else if (timeframe === '30D') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      data.push({
        date: `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`,
        full_date: d.toISOString().split('T')[0],
        aqi: Math.round(135 + Math.sin(i * 0.4) * 45),
        pm2_5: Number((60 + Math.sin(i * 0.4) * 24).toFixed(1)),
        pm10: Number((120 + Math.sin(i * 0.4) * 45).toFixed(1)),
        no2: Number((44 + Math.cos(i * 0.4) * 16).toFixed(1))
      });
    }
  } else {
    // 1Y / Monthly
    const months = ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'];
    const monthlyAqi = [142, 178, 205, 218, 185, 140, 115, 95, 62, 58, 64, 88];
    months.forEach((m, idx) => {
      data.push({
        date: m,
        full_date: m,
        aqi: monthlyAqi[idx],
        pm2_5: Math.round(monthlyAqi[idx] * 0.48),
        pm10: Math.round(monthlyAqi[idx] * 0.95),
        no2: Math.round(monthlyAqi[idx] * 0.32)
      });
    });
  }

  return NextResponse.json({
    timeframe,
    data
  });
}
