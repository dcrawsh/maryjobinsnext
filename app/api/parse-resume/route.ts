import { NextRequest, NextResponse } from 'next/server';
import ResumeParser from 'simple-resume-parser';
import fs from 'fs';
import os from 'os';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert ArrayBuffer to Uint8Array so TS is happy
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // Write to a temp file
    const tmpDir = os.tmpdir();
    const tmpPath = path.join(tmpDir, file.name);
    fs.writeFileSync(tmpPath, uint8);

    // Parse the resume
    const parser = new ResumeParser(tmpPath);
    const data = await parser.parseToJSON();

    // Clean up
    fs.unlinkSync(tmpPath);

    // Return extracted text
    return NextResponse.json({ text: JSON.stringify(data, null, 2) });
  } catch (err: any) {
    console.error('parse-resume error:', err);
    return NextResponse.json(
      { error: err.message || 'Parsing failed' },
      { status: 500 }
    );
  }
}
