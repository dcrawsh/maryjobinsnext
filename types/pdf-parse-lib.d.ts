declare module 'pdf-parse/lib/pdf-parse.js' {
  import { Buffer } from 'buffer';

  export interface PdfParseData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    textAsBuffer: Buffer;
  }

  export interface PdfParseOptions {
    pagerender?: (pageData: any) => Promise<string>;
    max?: number;
    version?: string;
    verbosity?: boolean;
    password?: string;
    useWorker?: boolean;
  }

  const pdfParse: (
    data: Buffer | Uint8Array | ArrayBuffer,
    options?: PdfParseOptions
  ) => Promise<PdfParseData>;

  export default pdfParse;
}
