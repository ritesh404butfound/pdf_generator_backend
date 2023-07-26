import { Body, Controller, Post, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}
  @Post('create')
  async createPdf(@Body() labReport: any, @Res() response) {
    try {
      const filePath = await this.pdfService.createLabReport(labReport);
      response.download(filePath, 'lab_report.pdf');
    } catch (error) {
      response.status(500).json({ message: 'Failed to generate lab report' });
    }
  }
}
