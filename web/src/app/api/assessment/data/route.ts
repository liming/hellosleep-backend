import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Assessment data API removed. Data is now static.' }, { status: 410 });
}
