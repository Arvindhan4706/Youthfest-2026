const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const fs = require('fs');

async function generateTicket() {
  const selectedEventTicket = "Youthfest 2026 Grand Finale";
  const userName = "Arvindhan";
  const userEmail = "arvindhan@youthfest2026.com";
  const ticketId = "YUV26-FIN-XYZ123";

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 300]);
  
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Draw background
  page.drawRectangle({ x: 0, y: 0, width: 600, height: 300, color: rgb(0.02, 0.0, 0.1) });
  
  // Draw Ticket Header
  page.drawText("YUVENZA '26 VITALITY PASS", { x: 30, y: 250, size: 20, font, color: rgb(0.1, 0.9, 0.9) });
  
  // Draw Event Name
  page.drawText(selectedEventTicket, { x: 30, y: 200, size: 24, font, color: rgb(1, 1, 1) });
  
  // Draw Visitor Details
  page.drawText(`Visitor: ${userName}`, { x: 30, y: 150, size: 14, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
  page.drawText(`Email: ${userEmail}`, { x: 30, y: 130, size: 12, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
  page.drawText(`Ticket ID: ${ticketId}`, { x: 30, y: 110, size: 12, font: normalFont, color: rgb(0.6, 0.3, 0.9) });
  
  // Generate QR Code locally
  const qrData = userEmail + '|' + selectedEventTicket;
  
  try {
    const localQrDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });
    const base64Data = localQrDataUrl.split(',')[1];
    const qrImageBytes = Buffer.from(base64Data, 'base64');
    
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    page.drawImage(qrImage, { x: 420, y: 75, width: 150, height: 150 });
    page.drawText("SCAN AT ENTRANCE", { x: 435, y: 55, size: 12, font, color: rgb(1, 1, 1) });
  } catch (err) {
    console.warn('Could not embed QR code in PDF', err);
  }
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('d:\\Class 12\\Youthfest 2026\\public\\my_ticket_sample.pdf', pdfBytes);
  console.log('Sample ticket saved to public/my_ticket_sample.pdf');
}

generateTicket().catch(console.error);
