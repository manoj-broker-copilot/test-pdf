import { Injectable } from "@nestjs/common";
import { PdfService } from "./infrastructure/pdf/pdf.service";

@Injectable()
export class AppService {
  constructor(private readonly pdfService: PdfService) {}
  getHello(): string {
    return "Server is running v3...";
  }

  async generatePdf(): Promise<Buffer> {
    return await this.pdfService.generateTestPDF();
  }
}
