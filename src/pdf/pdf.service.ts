import { Injectable } from '@nestjs/common';
// import * as PDFDocument from 'pdfkit';
import * as PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

@Injectable()
export class PdfService {
  async createLabReport(body: any) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4' });
      doc.fillColor('#000080');
      this.addPageBorder(doc, '#000080', 2, 580, 830);
      this.generateHeader(doc);
      this.generateCustomerInformation(doc, body);
      this.generateTable(doc, body);
      // Save the PDF to a file
      const fileName = 'lab_report.pdf';
      const filePath = `./${fileName}`;
      const stream = doc.pipe(createWriteStream(filePath));
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (error) => reject(error));
      doc.end();
    });
  }
  generateHeader(doc: any) {
    doc
      .fillColor('#000080')
      .fontSize(15)
      .font('Helvetica')
      .text('SAI PATHOLOGY CENTRE', 100, 30, { align: 'center' })
      .fontSize(10)
      .moveDown()
      .text('Mosaboni No. 3', { align: 'center' })
      .text('email: xyz@gmail.com', { align: 'center' })
      .text('Phone No. : 1234567890 / 2345678901', { align: 'center' })
      .moveDown();
  }

  generateCustomerInformation(doc, invoice) {
    doc
      .fillColor('#000080')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('LAB REPORT', { align: 'center' });

    this.generateHr(doc, 130);

    const customerInformationTop = 145;

    doc
      .fontSize(10)
      .text('Name of the patient: ', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(`${invoice.name || '____'}`, 150, customerInformationTop)
      .font('Helvetica-Bold')
      .text('Age: ', 300, customerInformationTop)
      .font('Helvetica-Bold')
      .text(`${invoice.age || '____'}`, 330, customerInformationTop)
      .text('Date of Receipt:', 50, customerInformationTop + 15)
      .text(
        `${invoice.dayOfSample || '____'}/${invoice.monthOfSample || '____'}/${
          invoice.yearOfSample || '____'
        }`,
        150,
        customerInformationTop + 15,
      )
      .text('Date of Report:', 300, customerInformationTop + 15)
      .text(this.formatDate(new Date()), 380, customerInformationTop + 15)
      .text('Reffered by Dr:', 50, customerInformationTop + 30)
      .text(`${invoice.refDoctor || '____'}`, 150, customerInformationTop + 30)
      .moveDown();

    this.generateHr(doc, 200);
  }

  generateTable(doc, invoice: any) {
    let invoiceTableTop = 220;
    doc.font('Helvetica');
    doc
      .fontSize(10)
      .text('1. Haemoglobin(Salhi): ', 50, invoiceTableTop)
      .font('Helvetica')
      .text(`${invoice.haemoglobin || '____'} (gms%)`, 185, invoiceTableTop)
      .font('Helvetica')
      .text('2. Total count of:', 50, invoiceTableTop + 20);
    this.generateTableRow(
      doc,
      invoiceTableTop + 40,
      'Erythrocytes (RBC):',
      'Leucocytes (WBC):',
      'Plateletes:',
      '',
      '',
      10,
    );
    doc.font('Helvetica');
    this.generateTableRow(
      doc,
      invoiceTableTop + 60,
      `${invoice.erythrocytes || '____'} /Cumm`,
      `${invoice.leucocytes || '____'} /Cumm`,
      `${invoice.plateletes || '____'} /Cumm`,
      '',
      '',
      10,
    );
    doc
      .font('Helvetica')
      .text('3. Differential count of leucocytes:', 50, invoiceTableTop + 80);
    this.generateTableRow(
      doc,
      invoiceTableTop + 100,
      'Neutrophils',
      'Lymphocytes',
      'Monocytes',
      'Eosinophils',
      'Basophils',
      10,
    );
    doc.font('Helvetica');
    this.generateTableRow(
      doc,
      invoiceTableTop + 120,
      '(40%-70%)',
      '(40%-70%)',
      '(40%-70%)',
      '(40%-70%)',
      '(40%-70%)',
      9,
    );
    doc.font('Helvetica');
    this.generateTableRow(
      doc,
      invoiceTableTop + 140,
      `${invoice.neutrophils || '____'} %`,
      `${invoice.lymphocytes || '____'} %`,
      `${invoice.monocytes || '____'} %`,
      `${invoice.eosinophils || '____'} %`,
      `${invoice.basophils || '____'} %`,
      10,
    );
    doc
      .text('4. Parasites (MP/MF):', 50, invoiceTableTop + 160)
      .font('Helvetica')
      .text(
        `Slide: ${invoice.parasiteSlide || '____'}`,
        60,
        invoiceTableTop + 180,
      )
      .text(
        `Cassatte: ${invoice.parasitesCassatte || '____'}`,
        60,
        invoiceTableTop + 200,
      )
      .font('Helvetica')
      .text('5. Erythocytes sedimentation rate:', 50, invoiceTableTop + 220)
      .font('Helvetica')
      .text(
        `Westergen Method: 1st Hour ${invoice.westergenMethod || '____'} mm`,
        60,
        invoiceTableTop + 240,
      )
      .font('Helvetica')
      .text(
        `6. B.T. Min ${invoice.btMin || '____'} Sec ${
          invoice.btSec || '____'
        } mm`,
        50,
        invoiceTableTop + 260,
      )
      .text(
        `C.T. Min ${invoice.ctMin || '____'} Sec ${invoice.ctSec || '____'} mm`,
        60,
        invoiceTableTop + 280,
      )
      .text('7. Blood Grouping: ', 50, invoiceTableTop + 300)
      .font('Helvetica')
      .text(
        `(a) ABO Blood Group: ${invoice.ABOBloodGroup || '____'}`,
        60,
        invoiceTableTop + 320,
      )
      .text(
        `(b) Rh (Anti-D): ${invoice.RhAntiD || '____'}`,
        60,
        invoiceTableTop + 340,
      )
      .font('Helvetica')
      .text('8. Widal Test:', 50, invoiceTableTop + 360);
    this.generateVrWidal(doc, 60);
    this.generateVrWidal(doc, 240);
    this.generateVrWidal(doc, 90);
    this.generateVrWidal(doc, 120);
    this.generateVrWidal(doc, 150);
    this.generateVrWidal(doc, 180);
    this.generateVrWidal(doc, 210);
    this.generateHrWidal(doc, invoiceTableTop + 370);
    this.generateHrWidal(doc, invoiceTableTop + 390);
    this.generateHrWidal(doc, invoiceTableTop + 410);
    this.generateHrWidal(doc, invoiceTableTop + 430);
    this.generateHrWidal(doc, invoiceTableTop + 450);
    this.generateHrWidal(doc, invoiceTableTop + 470);

    //widal test table
    doc.text('1/20', 95, invoiceTableTop + 375);
    doc.text('1/40', 125, invoiceTableTop + 375);
    doc.text('1/80', 155, invoiceTableTop + 375);
    doc.text('1/160', 183, invoiceTableTop + 375);
    doc.text('1/320', 213, invoiceTableTop + 375);

    doc.text('TO', 70, invoiceTableTop + 400);
    doc.text('TH', 70, invoiceTableTop + 420);
    doc.text('AH', 70, invoiceTableTop + 440);
    doc.text('BH', 70, invoiceTableTop + 460);

    doc
      .text(
        `9. V.D.R.L. test: ${invoice.vdrlTest || '____'}`,
        50,
        invoiceTableTop + 490,
      )
      .text(
        `10. R.A. test: ${invoice.raTest || '____'}`,
        50,
        invoiceTableTop + 510,
      )
      .text(
        `11. HCV (Anti): ${invoice.hcvTest || '____'}`,
        50,
        invoiceTableTop + 530,
      );

    doc.addPage();
    this.generateHeader(doc);
    doc
      .fillColor('#000080')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('LAB REPORT', { align: 'center' });
    this.generateHr(doc, 130);
    this.addPageBorder(doc, '#000080', 2, 580, 830);

    invoiceTableTop = 145;
    doc.fontSize(10);
    doc
      .fillColor('#000080')
      .fontSize(10)
      .font('Helvetica')
      .text(
        `12. HIV-I & II test: ${invoice.hiv1n2 || '____'}`,
        50,
        invoiceTableTop,
      )
      .text(
        `13. HBs Ag test: ${invoice.hbsAgTest || '____'}`,
        50,
        invoiceTableTop + 20,
      )
      .text('14. Blood Sugar/Glucose: ', 50, invoiceTableTop + 40);
    this.generateTableRow(
      doc,
      invoiceTableTop + 60,
      'Fasting (A/P)',
      'Post Prandial',
      'Random (R)',
      '',
      '',
      10,
    );
    doc.font('Helvetica');
    this.generateTableRow(
      doc,
      invoiceTableTop + 80,
      '(60-110mg%)',
      '(Up to-150mg%)',
      '(60-150mg%)',
      '',
      '',
      9,
    );
    this.generateTableRow(
      doc,
      invoiceTableTop + 100,
      `${invoice.bloodSugarFasting || '____'} mg%`,
      `${invoice.bloodSugarPostPrandial || '____'} mg%`,
      `${invoice.bloodSugarRandom || '____'} mg%`,
      '',
      '',
      10,
    );
    doc
      .font('Helvetica')
      .text(
        `15. Blood Urea: ${invoice.bloodUrea || '____'} mg% (15-40mg%)`,
        50,
        invoiceTableTop + 120,
      )
      .text(
        `16. Serum Creatinine: ${
          invoice.serumCreatinine || '____'
        } mg% (0.5-1.5mg%)`,
        50,
        invoiceTableTop + 140,
      )
      .text(
        `17. Serum Cholestrol: ${
          invoice.serumCholestrol || '____'
        } mg% (100-200mg%)`,
        50,
        invoiceTableTop + 160,
      )
      .text(
        `18. Serum Uric Acid: ${invoice.serumUricAcid || '____'} mg% (2-7mg%)`,
        50,
        invoiceTableTop + 180,
      )
      .text(
        `19. Serum Calcium: ${invoice.serumCalcium || '____'} mg% (8-10mg%)`,
        50,
        invoiceTableTop + 200,
      )
      .text('20. Serum Bilirubin:', 50, invoiceTableTop + 220)
      .text(
        `(a) Total Bilirubin ${
          invoice.serumBilirubinTotal || '____'
        } mg% (0.1-1.0mg%)`,
        60,
        invoiceTableTop + 240,
      )
      .text(
        `(b) Direct Bilirubin ${
          invoice.serumBilirubinDirect || '____'
        } mg% (0.1-0.2mg%)`,
        60,
        invoiceTableTop + 260,
      )
      .text(
        `(c) Indirect Bilirubin ${
          invoice.serumBilirubinIndirect || '____'
        } mg%)`,
        60,
        invoiceTableTop + 280,
      )
      .text(
        `21. S.G.O.T ${invoice.sgot || '____'} (8-401U/L)`,
        50,
        invoiceTableTop + 300,
      )
      .text(
        `22. S.G.P.T ${invoice.sgpt || '____'} (Upto-401U/L)`,
        50,
        invoiceTableTop + 320,
      )
      .text(
        `23. Alkaline Phosphates ${
          invoice.alkalinePhosphates || '____'
        } (Upto-280U/L)`,
        50,
        invoiceTableTop + 340,
      )
      .text(
        `24. (a) Sodium ${invoice.sodium || '____'} (135-155)(mol/l)`,
        50,
        invoiceTableTop + 360,
      )
      .text(
        `(b) Potassium ${invoice.potassium || '____'} (3.5-5.0)(mol/l)`,
        60,
        invoiceTableTop + 380,
      )
      .text('25. Sputum for AFB', 50, invoiceTableTop + 400)
      .text(
        `26. Mauntox Test ${invoice.mauntox || '____'}`,
        50,
        invoiceTableTop + 420,
      )
      .text('Sign of the Tech.', 420, 650);
  }

  generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        'Payment is due within 15 days. Thank you for your business.',
        50,
        780,
        { align: 'center', width: 500 },
      );
  }

  generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal,
    fontsize,
  ) {
    doc
      .fontSize(fontsize)
      .text(item, 60, y)
      .text(description, 180, y)
      .text(unitCost, 260, y, { width: 90, align: 'right' })
      .text(quantity, 350, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  generateHrWidal(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(60, y)
      .lineTo(240, y)
      .stroke();
  }
  generateVrWidal(doc, x) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(x, 590)
      .lineTo(x, 690)
      .stroke();
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }

  addPageBorder(doc, borderColor, borderWidth, pageWidth, pageHeight) {
    doc.lineWidth(borderWidth);
    doc.strokeColor(borderColor);

    // Draw top border
    doc.moveTo(15, 15).lineTo(pageWidth, 15).stroke();

    // Draw right border
    doc.moveTo(pageWidth, 15).lineTo(pageWidth, pageHeight).stroke();

    // Draw bottom border
    doc.moveTo(pageWidth, pageHeight).lineTo(15, pageHeight).stroke();

    // Draw left border
    doc.moveTo(15, pageHeight).lineTo(15, 15).stroke();
  }
}
