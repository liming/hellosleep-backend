import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const strapiUrl = `${STRAPI_URL}/api/categories${queryString ? `?${queryString}` : ''}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (API_TOKEN) headers.Authorization = `Bearer ${API_TOKEN}`;

    const response = await fetch(strapiUrl, { headers, cache: 'no-store' });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch categories', detail: text },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch categories', detail: error?.message || 'unknown' },
      { status: 500 }
    );
  }
}
