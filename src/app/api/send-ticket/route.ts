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
    
    try {
      if (fs.existsSync(yuvenzaLogoPath)) {
        yuvenzaLogoImage = await pdfDoc.embedPng(fs.readFileSync(yuvenzaLogoPath));
      }
      if (fs.existsSync(eventLogoPath)) {
        eventLogoImage = await pdfDoc.embedPng(fs.readFileSync(eventLogoPath));
      }
    } catch (e) {
      console.warn("Failed to load logo images", e);
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
    
    let fontSize = 65;
    let textWidth = helveticaBold.widthOfTextAtSize(event.toUpperCase(), fontSize);
    while (textWidth > splitX - 60 && fontSize > 20) {
      fontSize -= 2;
      textWidth = helveticaBold.widthOfTextAtSize(event.toUpperCase(), fontSize);
    }
    page.drawText(event.toUpperCase(), { x: 30, y: height - 190, size: fontSize, font: helveticaBold, color: rgb(1, 1, 1) });

    // Bottom Details
    page.drawText('DATE', { x: 30, y: 80, size: 10, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
    page.drawText((date || 'AUGUST 12, 2026').toUpperCase(), { x: 30, y: 60, size: 14, font: helveticaBold, color: rgb(0.2, 0.6, 1) });
    
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
    page.drawText((date || 'AUGUST 12, 2026').toUpperCase(), { 
      x: splitX + 60, y: height - 60, 
      size: 10, font: helvetica, color: rgb(1, 1, 1),
      rotate: degrees(-90) 
    });

    // Embed QR Code
    const qrImageBytes = Buffer.from(base64Data, 'base64');
    let qrImage;
    try {
      qrImage = await pdfDoc.embedPng(qrImageBytes);
    } catch (e) {
      qrImage = await pdfDoc.embedJpg(qrImageBytes);
    }
    
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
