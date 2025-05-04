// types/pdf-parse/index.d.ts
import { Buffer } from "buffer";

declare module "pdf-parse" {
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

  function pdfParse(
    data: Buffer | Uint8Array | ArrayBuffer,
    options?: PdfParseOptions
  ): Promise<PdfParseData>;

  export default pdfParse;
}
