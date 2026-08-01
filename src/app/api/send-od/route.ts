import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getMailer, getFromEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, college, department, eventTitle } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Recipient email from request body
    const recipientEmail = email;
    const emailSubject = `On Duty (OD) Approval for Yuvenza - ${eventTitle || 'General Registration'}`;
    const emailBody = `
Dear ${name},

This email serves as your official On Duty (OD) approval for participating in Yuvenza '26.

Participant Details:
- Name: ${name}
- College: ${college || 'N/A'}
- Department: ${department || 'N/A'}
- Event Registered: ${eventTitle || 'General Fest Entry'}
- Date of Event: August 21, 2026
- Venue: Yuvenza Main Campus

Please find the official OD Letter attached as a PDF to this email. You may present this to your respective department coordinators or HOD to claim your attendance.

We look forward to seeing you at the biggest youth festival of the year!

Best regards,
The Yuvenza Organizing Committee
Yuvenza '26
    `.trim();

    // 1. Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const { width, height } = page.getSize();
    const margin = 50;

    // Header
    page.drawText('YUVENZA 2026', {
      x: width / 2 - 120,
      y: height - 80,
      size: 20,
      font: timesRomanBold,
      color: rgb(0.1, 0.1, 0.4),
    });

    page.drawText('OFFICIAL ON DUTY (OD) PERMISSION LETTER', {
      x: width / 2 - 140,
      y: height - 110,
      size: 14,
      font: timesRomanBold,
    });

    page.drawLine({
      start: { x: margin, y: height - 125 },
      end: { x: width - margin, y: height - 125 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Content
    const dateText = `Date: ${new Date().toLocaleDateString()}`;
    page.drawText(dateText, { x: width - margin - 100, y: height - 160, size: 12, font: timesRomanFont });

    page.drawText('To Whom It May Concern,', { x: margin, y: height - 190, size: 12, font: timesRomanBold });

    const paragraph1 = `This is to certify that ${name}, a student of ${department || 'the respective department'} at ${college || 'the respective institution'}, has officially registered to participate in the upcoming Yuvenza '26.`;
    page.drawText(paragraph1, {
      x: margin,
      y: height - 230,
      size: 12,
      font: timesRomanFont,
      maxWidth: width - margin * 2,
      lineHeight: 18,
    });

    const paragraph2 = `The student is scheduled to attend the "${eventTitle || 'General Fest Entry'}" event on August 21, 2026 at the Yuvenza Main Campus. We kindly request you to grant them On Duty (OD) permission / attendance exemption for the aforementioned date to enable their participation in this national-level technical and cultural symposium.`;
    page.drawText(paragraph2, {
      x: margin,
      y: height - 290,
      size: 12,
      font: timesRomanFont,
      maxWidth: width - margin * 2,
      lineHeight: 18,
    });

    // Details Box
    const boxY = height - 420;
    page.drawRectangle({
      x: margin, y: boxY, width: width - margin * 2, height: 100,
      borderColor: rgb(0, 0, 0), borderWidth: 1,
    });
    
    page.drawText(`Participant Name:  ${name}`, { x: margin + 15, y: boxY + 70, size: 12, font: timesRomanBold });
    page.drawText(`Institution:       ${college || 'N/A'}`, { x: margin + 15, y: boxY + 45, size: 12, font: timesRomanFont });
    page.drawText(`Event:             ${eventTitle || 'General Fest Entry'}`, { x: margin + 15, y: boxY + 20, size: 12, font: timesRomanFont });

    // Signature
    page.drawText('Sincerely,', { x: margin, y: boxY - 60, size: 12, font: timesRomanFont });
    page.drawText('Yuvenza Organizing Committee', { x: margin, y: boxY - 100, size: 12, font: timesRomanBold });
    page.drawText('Yuvenza \'26', { x: margin, y: boxY - 120, size: 12, font: timesRomanFont });

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    // 2. Send Email (Nodemailer)
    const mailer = getMailer();
    await mailer.sendMail({
      from: getFromEmail(),
      to: recipientEmail,
      subject: emailSubject,
      text: emailBody,
      attachments: [
        {
          filename: `OD_Letter_${name.replace(/\s+/g, '_')}.pdf`,
          content: Buffer.from(pdfBytes),
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'OD email with PDF attachment sent successfully.'
    });

  } catch (error: any) {
    console.error('Error sending OD communication:', error);
    return NextResponse.json({ error: error.message || 'Failed to send OD' }, { status: 500 });
  }
}

