import { NextResponse } from 'next/server';
import { getMailer, getFromEmail } from '@/lib/mailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, event, venue, date, qrDataUrl } = body;

    if (!name || !email || !event || !qrDataUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure qrDataUrl is a valid base64 string
    const base64Data = qrDataUrl.split(';base64,').pop();
    if (!base64Data) {
      throw new Error("Invalid QR code data");
    }

    // Generate PDF Ticket
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const { width, height } = page.getSize();
    const margin = 50;

    // Load Yuvenza Logo (Watermark)
    const logoPath = path.join(process.cwd(), 'public', 'yuvenzalogo.png');
    let logoImage;
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
    }

    // Load Event Logo (Thumbnail Top Right)
    const eventLogoPath = path.join(process.cwd(), 'public', 'eventlogo.png');
    let eventLogoImage;
    if (fs.existsSync(eventLogoPath)) {
      const eventLogoBytes = fs.readFileSync(eventLogoPath);
      eventLogoImage = await pdfDoc.embedPng(eventLogoBytes);
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

    // Header Logo (eventlogo) Top Right
    if (eventLogoImage) {
      const headerLogoDims = eventLogoImage.scale(0.2); // Smaller scale for top right
      page.drawImage(eventLogoImage, {
        x: width - margin - headerLogoDims.width,
        y: height - margin - headerLogoDims.height,
        width: headerLogoDims.width,
        height: headerLogoDims.height,
      });
    }

    // Header (Changed color to BLACK)
    page.drawText('YUVENZA \'26', { x: margin, y: height - 80, size: 28, font: timesRomanBold, color: rgb(0, 0, 0) });
    page.drawText('OFFICIAL VITALITY PASS', { x: margin, y: height - 110, size: 16, font: timesRomanBold, color: rgb(0, 0, 0) });

    page.drawLine({
      start: { x: margin, y: height - 125 },
      end: { x: width - margin, y: height - 125 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Event Details
    page.drawText(`Event: ${event}`, { x: margin, y: height - 160, size: 18, font: timesRomanBold, color: rgb(0, 0, 0) });
    page.drawText(`Participant: ${name}`, { x: margin, y: height - 190, size: 14, font: timesRomanFont, color: rgb(0, 0, 0) });
    page.drawText(`Date: ${date || 'August 12, 2026'}`, { x: margin, y: height - 215, size: 14, font: timesRomanFont, color: rgb(0, 0, 0) });
    page.drawText(`Venue: Chennai Institute Of Technology`, { x: margin, y: height - 240, size: 14, font: timesRomanFont, color: rgb(0, 0, 0) });

    // Embed QR Code
    const qrImageBytes = Buffer.from(base64Data, 'base64');
    let qrImage;
    try {
      qrImage = await pdfDoc.embedPng(qrImageBytes);
    } catch (e) {
      // Fallback if the dataURL happens to be a JPEG
      qrImage = await pdfDoc.embedJpg(qrImageBytes);
    }
    
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
    
    page.drawText('Scan for Entry', { x: qrX + qrDims.width / 2 - 40, y: qrY - 25, size: 12, font: timesRomanBold, color: rgb(0, 0, 0) });

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

    const mailOptions = {
      from: getFromEmail(),
      to: email,
      subject: `Your Yuvenza '26 Vitality Pass: ${event}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4F46E5;">Yuvenza '26</h1>
            <h2>Vitality Pass</h2>
          </div>
          
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your registration for <strong>${event}</strong> is confirmed! Attached is your official printable PDF Vitality Pass.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Event:</strong> ${event}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date || 'August 12, 2026'}</p>
            <p style="margin: 5px 0;"><strong>Venue:</strong> Chennai Institute Of Technology</p>
          </div>
          
          <p><strong>IMPORTANT:</strong> Please download and present the attached PDF pass at the registration desk for seamless entry.</p>
          
          <p>See you there!</p>
          <p>The Yuvenza Organizing Committee</p>
        </div>
      `,
      attachments: [
        {
          filename: `Yuvenza_Pass_${event.replace(/\s+/g, '_')}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf'
        }
      ]
    };

    const mailer = getMailer();
    await mailer.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Ticket email sent successfully.' });
  } catch (error: any) {
    console.error('Error sending ticket:', error);
    return NextResponse.json({ error: error.message || 'Failed to send ticket' }, { status: 500 });
  }
}
