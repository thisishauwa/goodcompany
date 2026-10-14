import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { dataUrl, filename = 'Good-Company-Community-Guidelines.pdf', contentType } = await request.json();

    if (!dataUrl || typeof dataUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid file data' }, { status: 400 });
    }

    const isPdf = filename.toLowerCase().endsWith('.pdf') || (contentType && contentType.includes('pdf')) || dataUrl.startsWith('data:application/pdf');
    const resolvedType = contentType || (isPdf ? 'application/pdf' : 'image/png');

    let buffer: Buffer;
    if (dataUrl.includes('base64,')) {
      const base64Data = dataUrl.split('base64,')[1];
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      buffer = Buffer.from(dataUrl);
    }

    const cleanFilename = isPdf
      ? (filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`)
      : (filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': resolvedType,
        'Content-Disposition': `attachment; filename="${cleanFilename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Error in /api/download:', err);
    return NextResponse.json({ error: 'Failed to process file download' }, { status: 500 });
  }
}
