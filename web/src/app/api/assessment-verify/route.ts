import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Verification endpoint removed.' }, { status: 410 });
}
