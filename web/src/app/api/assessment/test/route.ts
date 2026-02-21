import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Assessment test endpoint removed. Use assessment.ts directly.' }, { status: 410 });
}
