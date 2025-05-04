// app/api/parse-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          error:
            'Unsupported file type. Only PDF, DOCX, and TXT files are allowed.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error:
            'File too large. Please upload a file smaller than 10MB.',
        },
        { status: 413 } // 413 Payload Too Large
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';

    if (extension === 'pdf') {
      const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (extension === 'docx') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (extension === 'txt') {
      text = new TextDecoder().decode(buffer);
    }

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract enough text. Please paste manually.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error('Resume parse error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
