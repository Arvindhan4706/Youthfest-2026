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

    // Generate PDF Ticket (Landscape: 850x400)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([850, 400]);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();
    const splitX = 630;

    // Colors
    const neonMagenta = rgb(0.9, 0.1, 0.6);
    const neonCyan = rgb(0.1, 0.8, 1.0);
    const white = rgb(1, 1, 1);
    const lightGray = rgb(0.7, 0.7, 0.7);

    // Background
    page.drawRectangle({
      x: 0, y: 0, width, height,
      color: rgb(0.02, 0.02, 0.02), // Very dark background
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

    // --- SPINE (Left Edge) ---
    page.drawText('BE PART SOMETHING EXTRAORDINARY', { 
      x: 25, y: height - 120, size: 10, font: helvetica, color: lightGray, rotate: degrees(90) 
    });
    
    // Pink X marks
    page.drawText('X', { x: 20, y: height - 40, size: 16, font: helveticaBold, color: neonMagenta });
    page.drawText('X', { x: 20, y: 30, size: 16, font: helveticaBold, color: neonMagenta });

    // Thin separator line
    page.drawLine({ start: { x: 45, y: 30 }, end: { x: 45, y: height - 30 }, thickness: 1, color: rgb(0.2, 0.2, 0.2) });

    // --- MAIN BODY ---

    // Top Left Header
    const headerX = 70;
    if (yuvenzaLogoImage) {
      const yDims = yuvenzaLogoImage.scale(1.0);
      const scaleFactor = 40 / yDims.height;
      page.drawImage(yuvenzaLogoImage, {
        x: headerX, y: height - 60,
        width: yDims.width * scaleFactor, height: yDims.height * scaleFactor,
      });
    }

    page.drawText('YUVENZA PRESENTS', { x: headerX + 50, y: height - 40, size: 12, font: helveticaBold, color: neonMagenta });
    page.drawText(event.toUpperCase(), { x: headerX + 50, y: height - 58, size: 12, font: helveticaBold, color: white });

    // Center Huge Text
    page.drawText('\'26', { x: headerX, y: height - 130, size: 50, font: helveticaBold, color: neonMagenta });
    
    let fontSize = 90;
    let textWidth = helveticaBold.widthOfTextAtSize('YOUTHFEST', fontSize);
    while (textWidth > splitX - headerX - 40 && fontSize > 30) {
      fontSize -= 2;
      textWidth = helveticaBold.widthOfTextAtSize('YOUTHFEST', fontSize);
    }
    page.drawText('YOUTHFEST', { x: headerX, y: height - 210, size: fontSize, font: helveticaBold, color: neonCyan });

    // Tagline Box
    page.drawRectangle({
      x: headerX, y: height - 260, width: 220, height: 25,
      borderColor: neonCyan, borderWidth: 1
    });
    page.drawText('UNITE. CREATE. INSPIRE.', { x: headerX + 15, y: height - 253, size: 12, font: helveticaBold, color: white });

    // Bottom Columns
    const botY = 70;
    page.drawText('DATE', { x: headerX, y: botY, size: 10, font: helvetica, color: lightGray });
    page.drawText((date || '10TH OCTOBER 2026').toUpperCase(), { x: headerX, y: botY - 15, size: 12, font: helveticaBold, color: neonMagenta });

    page.drawText('TIME', { x: headerX + 130, y: botY, size: 10, font: helvetica, color: lightGray });
    page.drawText('9:30 PM - 5:00 AM', { x: headerX + 130, y: botY - 15, size: 12, font: helveticaBold, color: neonMagenta });

    page.drawText('VENUE', { x: headerX + 270, y: botY, size: 10, font: helvetica, color: lightGray });
    page.drawText('CHENNAI INSTITUTE OF TECHNOLOGY', { x: headerX + 270, y: botY - 15, size: 12, font: helveticaBold, color: neonCyan });

    // Website Footer
    page.drawText('W W W . Y O U T H F E S T 2 6 . C O M', { x: headerX, y: 20, size: 9, font: helvetica, color: lightGray });


    // --- TEAR-OFF LINE & NOTCHES ---
    page.drawLine({
      start: { x: splitX, y: 0 },
      end: { x: splitX, y: height },
      thickness: 2,
      color: lightGray,
      dashArray: [6, 6],
    });

    // Ticket Notch (Top & Bottom)
    page.drawCircle({ x: splitX, y: height, size: 15, color: white });
    page.drawCircle({ x: splitX, y: 0, size: 15, color: white });


    // --- TEAR-OFF STUB ---
    const stubX = splitX + 40;
    
    // VIP PASS
    page.drawText('VIP PASS', { x: stubX + 15, y: height - 70, size: 30, font: helveticaBold, color: neonMagenta });
    page.drawText('-   ALL ACCESS   -', { x: stubX + 22, y: height - 100, size: 12, font: helveticaBold, color: white });

    // Embed QR Code
    const qrImageBytes = Buffer.from(base64Data, 'base64');
    let qrImage;
    try {
      qrImage = await pdfDoc.embedPng(qrImageBytes);
    } catch (e) {
      qrImage = await pdfDoc.embedJpg(qrImageBytes);
    }
    
    const qrDims = qrImage.scale(0.65);
    const qrY = height - 260;
    
    // White box for QR code to ensure it's scannable on dark background
    page.drawRectangle({
      x: stubX - 5, y: qrY - 5, width: qrDims.width + 10, height: qrDims.height + 10,
      color: white,
    });
    
    page.drawImage(qrImage, {
      x: stubX, y: qrY, width: qrDims.width, height: qrDims.height,
    });

    // Admit One Box
    page.drawRectangle({
      x: stubX, y: 50, width: 140, height: 50,
      borderColor: neonMagenta, borderWidth: 2
    });
    page.drawText('ADMIT ONE', { x: stubX + 40, y: 80, size: 10, font: helvetica, color: white });
    
    let nameSize = 14;
    let nameWidth = helveticaBold.widthOfTextAtSize(name.toUpperCase(), nameSize);
    while(nameWidth > 130 && nameSize > 8) {
      nameSize -= 1;
      nameWidth = helveticaBold.widthOfTextAtSize(name.toUpperCase(), nameSize);
    }
    page.drawText(name.toUpperCase(), { x: stubX + 70 - nameWidth/2, y: 62, size: nameSize, font: helveticaBold, color: neonCyan });

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
