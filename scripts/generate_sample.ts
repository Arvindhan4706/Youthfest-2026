import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

async function generateSample() {
  const name = "Arvindhan";
  const event = "Hackathon 2026";
  const venue = "Chennai Institute Of Technology";
  const date = "August 12, 2026";

  // Generate QR
  const qrDataUrl = await QRCode.toDataURL("sample-qr-code-data");
  const base64Data = qrDataUrl.split(';base64,').pop()!;

  // Generate PDF Ticket
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const { width, height } = page.getSize();
  const margin = 50;

  // Load Yuvenza Logo
  const logoPath = path.join(process.cwd(), 'public', 'yuvenzalogo.png');
  let logoImage;
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    logoImage = await pdfDoc.embedPng(logoBytes);
  }

  // Watermark
  if (logoImage) {
    const watermarkDims = logoImage.scale(0.8);
    page.drawImage(logoImage, {
      x: width / 2 - watermarkDims.width / 2,
      y: height / 2 - watermarkDims.height / 2,
      width: watermarkDims.width,
      height: watermarkDims.height,
      opacity: 0.1, // Watermark opacity
    });
  }

  // Header Logo (Top Right)
  if (logoImage) {
    const headerLogoDims = logoImage.scale(0.2); // Smaller scale for top right
    page.drawImage(logoImage, {
      x: width - margin - headerLogoDims.width,
      y: height - margin - headerLogoDims.height + 10,
      width: headerLogoDims.width,
      height: headerLogoDims.height,
    });
  }

  // Header
  page.drawText('YUVENZA \'26', { x: margin, y: height - 80, size: 28, font: timesRomanBold, color: rgb(0.31, 0.27, 0.90) });
  page.drawText('OFFICIAL VITALITY PASS', { x: margin, y: height - 110, size: 16, font: timesRomanBold });

  page.drawLine({
    start: { x: margin, y: height - 125 },
    end: { x: width - margin, y: height - 125 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Event Details
  page.drawText(`Event: ${event}`, { x: margin, y: height - 160, size: 18, font: timesRomanBold });
  page.drawText(`Participant: ${name}`, { x: margin, y: height - 190, size: 14, font: timesRomanFont });
  page.drawText(`Date: ${date}`, { x: margin, y: height - 215, size: 14, font: timesRomanFont });
  page.drawText(`Venue: ${venue}`, { x: margin, y: height - 240, size: 14, font: timesRomanFont });

  // Embed QR Code
  const qrImageBytes = Buffer.from(base64Data, 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrDims = qrImage.scale(0.8);
  const qrX = width - margin - qrDims.width - 20;
  const qrY = height - 260;
  
  page.drawRectangle({
    x: qrX - 10, y: qrY - 10, width: qrDims.width + 20, height: qrDims.height + 20,
    borderColor: rgb(0, 0, 0), borderWidth: 1,
  });
  
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrDims.width,
    height: qrDims.height,
  });
  
  page.drawText('Scan for Entry', { x: qrX + qrDims.width / 2 - 40, y: qrY - 25, size: 12, font: timesRomanBold });

  page.drawLine({
    start: { x: margin, y: height - 320 },
    end: { x: width - margin, y: height - 320 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Footer
  page.drawText('Please present this digital pass at the registration desk for seamless entry.', { x: margin, y: height - 350, size: 12, font: timesRomanFont, color: rgb(0.4, 0.4, 0.4) });
  page.drawText('Valid only for the registered participant.', { x: margin, y: height - 370, size: 12, font: timesRomanFont, color: rgb(0.4, 0.4, 0.4) });

  const pdfBytes = await pdfDoc.save();
  
  const outputPath = 'd:\\Class 12\\Youthfest 2026\\sample_ticket.pdf';
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Saved sample to ${outputPath}`);
}

generateSample();
