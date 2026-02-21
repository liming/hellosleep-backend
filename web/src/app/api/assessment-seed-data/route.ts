import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Seed data endpoint removed. Use shared/data JSON files directly.' }, { status: 410 });
}
