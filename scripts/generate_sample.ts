import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

async function generateSample() {
  const name = "Arvindhan";
  const event = "Hackathon 2026";
  const date = "August 12, 2026";
  const venue = "Chennai Institute Of Technology";

  // Generate QR
  const qrDataUrl = await QRCode.toDataURL("sample-qr-code-data");
  const base64Data = qrDataUrl.split(';base64,').pop()!;

  // Generate PDF Ticket (Landscape: 850x350)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([850, 350]);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const splitX = 620;

  // Background
  page.drawRectangle({
    x: 0, y: 0, width, height,
    color: rgb(0.05, 0.05, 0.08), // Dark premium color
  });

  // Load Logos
  const yuvenzaLogoPath = path.join(process.cwd(), 'public', 'yuvenzalogo.png');
  const eventLogoPath = path.join(process.cwd(), 'public', 'eventlogo.png');
  
  let yuvenzaLogoImage;
  let eventLogoImage;
  
  if (fs.existsSync(yuvenzaLogoPath)) {
    yuvenzaLogoImage = await pdfDoc.embedPng(fs.readFileSync(yuvenzaLogoPath));
  }
  if (fs.existsSync(eventLogoPath)) {
    eventLogoImage = await pdfDoc.embedPng(fs.readFileSync(eventLogoPath));
  }

  // Watermark (eventlogo in center of left panel)
  if (eventLogoImage) {
    const wDims = eventLogoImage.scale(1.0);
    const scaleFactor = Math.min(300 / wDims.width, 300 / wDims.height);
    const scaledWidth = wDims.width * scaleFactor;
    const scaledHeight = wDims.height * scaleFactor;
    
    page.drawImage(eventLogoImage, {
      x: splitX / 2 - scaledWidth / 2,
      y: height / 2 - scaledHeight / 2,
      width: scaledWidth,
      height: scaledHeight,
      opacity: 0.1,
    });
  }

  // --- LEFT PANEL (Main Stub) ---

  // Top Left branding
  page.drawText('YUVENZA \'26', { x: 30, y: height - 40, size: 14, font: helveticaBold, color: rgb(0.2, 0.6, 1) });
  page.drawText('CHENNAI INSTITUTE OF TECHNOLOGY', { x: 30, y: height - 60, size: 10, font: helvetica, color: rgb(1, 1, 1) });

  // Center Huge Text
  page.drawText('EVENT', { x: 30, y: height - 130, size: 18, font: helveticaBold, color: rgb(1, 1, 1) });
  
  // Make event name MASSIVE (Scale font size based on length to fit, but max 60)
  let fontSize = 65;
  let textWidth = helveticaBold.widthOfTextAtSize(event.toUpperCase(), fontSize);
  while (textWidth > splitX - 60 && fontSize > 20) {
    fontSize -= 2;
    textWidth = helveticaBold.widthOfTextAtSize(event.toUpperCase(), fontSize);
  }
  page.drawText(event.toUpperCase(), { x: 30, y: height - 190, size: fontSize, font: helveticaBold, color: rgb(1, 1, 1) });

  // Bottom Details
  page.drawText('DATE', { x: 30, y: 80, size: 10, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
  page.drawText(date.toUpperCase(), { x: 30, y: 60, size: 14, font: helveticaBold, color: rgb(0.2, 0.6, 1) });
  
  page.drawText('PARTICIPANT', { x: 200, y: 80, size: 10, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
  page.drawText(name.toUpperCase(), { x: 200, y: 60, size: 14, font: helveticaBold, color: rgb(1, 1, 1) });
  
  // White admission box
  page.drawRectangle({
    x: 430, y: 50, width: 150, height: 50,
    borderColor: rgb(1, 1, 1), borderWidth: 2
  });
  page.drawText('ADMIT ONE', { x: 468, y: 78, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  page.drawText('VIP ACCESS', { x: 465, y: 60, size: 12, font: helveticaBold, color: rgb(0.2, 0.6, 1) });

  // --- SEPARATOR ---
  page.drawLine({
    start: { x: splitX, y: 0 },
    end: { x: splitX, y: height },
    thickness: 2,
    color: rgb(0.8, 0.8, 0.8),
    dashArray: [5, 5],
  });

  // --- RIGHT PANEL (Tear-off Stub) ---

  // Top Text
  page.drawText('VITALITY PASS', { x: splitX + 50, y: height - 40, size: 16, font: helveticaBold, color: rgb(1, 1, 1) });

  // Rotated Event Name
  page.drawText(event.toUpperCase(), { 
    x: splitX + 40, y: height - 60, 
    size: 20, font: helveticaBold, color: rgb(0.2, 0.6, 1),
    rotate: degrees(-90) 
  });
  page.drawText(date.toUpperCase(), { 
    x: splitX + 60, y: height - 60, 
    size: 10, font: helvetica, color: rgb(1, 1, 1),
    rotate: degrees(-90) 
  });

  // Embed QR Code
  const qrImageBytes = Buffer.from(base64Data, 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrDims = qrImage.scale(0.5); // Smaller for the side
  const qrX = splitX + 80;
  const qrY = height / 2 - (qrDims.height / 2);
  
  // White box for QR code to ensure it's scannable on dark background
  page.drawRectangle({
    x: qrX - 5, y: qrY - 5, width: qrDims.width + 10, height: qrDims.height + 10,
    color: rgb(1, 1, 1),
  });
  
  page.drawImage(qrImage, {
    x: qrX, y: qrY, width: qrDims.width, height: qrDims.height,
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), 'sample_ticket_dark.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Saved sample to ${outputPath}`);
}

generateSample();
