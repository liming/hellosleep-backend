import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '129351e37e797fa8e6df55665346b4b876375b77771c5810347c0f1c8379417655ef3ef4eb10b4458710ca42aac25d29da3df203f601c40efcb637cba80a5db4a8c835f6f124c1312b01f1f0d2cbe4bce871935bc0485acf22c53f983e84efa807e2a0fc93fcb04242a7cd8b9fe7d2c98b27ba2998108838e49098fff40a00c5';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward all query parameters to Strapi
    const queryString = searchParams.toString();
    const strapiUrl = `${STRAPI_URL}/api/articles${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(strapiUrl, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Articles API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
