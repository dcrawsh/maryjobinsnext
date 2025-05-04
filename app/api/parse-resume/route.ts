import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Import correctly to avoid triggering the default test script
    const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
    const result = await pdfParse(buffer);

    return NextResponse.json({ text: result.text });
  } catch (err: any) {
    console.error('PDF parse error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
