import { NextResponse } from 'next/server';
import { getMailer, getFromEmail } from '@/lib/mailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, event, venue, date, qrDataUrl } = body;

    if (!name || !email || !event || !qrDataUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    // Load Logos
    const yuvenzaLogoPath = path.join(process.cwd(), 'public', 'yuvenzalogo.png');
    const eventLogoPath = path.join(process.cwd(), 'public', 'eventlogo.png');
    
    let yuvenzaLogoImage;
    let eventLogoImage;
    
    try {
      if (fs.existsSync(yuvenzaLogoPath)) {
        const yuvenzaLogoBytes = fs.readFileSync(yuvenzaLogoPath);
        yuvenzaLogoImage = await pdfDoc.embedPng(yuvenzaLogoBytes);
      }
      if (fs.existsSync(eventLogoPath)) {
        const eventLogoBytes = fs.readFileSync(eventLogoPath);
        eventLogoImage = await pdfDoc.embedPng(eventLogoBytes);
      }
    } catch (e) {
      console.warn("Failed to load logo images", e);
    }

    // Watermark (eventlogo in center)
    if (eventLogoImage) {
      const wDims = eventLogoImage.scale(1.0);
      // Scale to fit nicely in center if too big
      const scaleFactor = Math.min(300 / wDims.width, 300 / wDims.height);
      const scaledWidth = wDims.width * scaleFactor;
      const scaledHeight = wDims.height * scaleFactor;
      
      page.drawImage(eventLogoImage, {
        x: width / 2 - scaledWidth / 2,
        y: height / 2 - scaledHeight / 2,
        width: scaledWidth,
        height: scaledHeight,
        opacity: 0.15, // Watermark effect
      });
    }

    // Header - Left
    page.drawText('YUVENZA \'26', { x: margin, y: height - 80, size: 28, font: timesRomanBold, color: rgb(0, 0, 0) }); // Black text
    page.drawText('OFFICIAL VITALITY PASS', { x: margin, y: height - 110, size: 16, font: timesRomanBold, color: rgb(0, 0, 0) });

    // Header - Right (yuvenzalogo)
    if (yuvenzaLogoImage) {
      const yDims = yuvenzaLogoImage.scale(1.0);
      // Scale down to fit in header (e.g. max height 60)
      const scaleFactor = 60 / yDims.height;
      const scaledWidth = yDims.width * scaleFactor;
      const scaledHeight = yDims.height * scaleFactor;
      
      page.drawImage(yuvenzaLogoImage, {
        x: width - margin - scaledWidth,
        y: height - 50 - scaledHeight,
        width: scaledWidth,
        height: scaledHeight,
      });
    }

    page.drawLine({
      start: { x: margin, y: height - 125 },
      end: { x: width - margin, y: height - 125 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Event Details
    page.drawText(`Event: ${event}`, { x: margin, y: height - 160, size: 18, font: timesRomanBold });
    page.drawText(`Participant: ${name}`, { x: margin, y: height - 190, size: 14, font: timesRomanFont });
    page.drawText(`Date: ${date || 'August 21, 2026'}`, { x: margin, y: height - 215, size: 14, font: timesRomanFont });
    page.drawText(`Venue: Chennai Institute Of Technology`, { x: margin, y: height - 240, size: 14, font: timesRomanFont });

    // Embed QR Code
    const qrImageBytes = Buffer.from(base64Data, 'base64');
    let qrImage;
    try {
      qrImage = await pdfDoc.embedPng(qrImageBytes);
    } catch (e) {
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
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date || 'August 21, 2026'}</p>
            <p style="margin: 5px 0;"><strong>Venue:</strong> ${venue || 'Yuvenza Main Campus'}</p>
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

