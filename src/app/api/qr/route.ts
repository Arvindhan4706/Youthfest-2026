import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get('data');

  if (!data) {
    return new NextResponse('Missing data parameter', { status: 400 });
  }

  try {
    // Generate QR using quickchart.io, which is highly reliable and fast
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(data)}&size=300&margin=1`;
    const response = await fetch(qrUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch QR code: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('QR Generation Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

