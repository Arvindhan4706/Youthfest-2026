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

    // 1. Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const { width, height } = page.getSize();
    const margin = 50;

    // Header
    const title1 = 'YUVENZA 2026';
    const title1Width = timesRomanBold.widthOfTextAtSize(title1, 20);
    page.drawText(title1, {
      x: (width - title1Width) / 2,
      y: height - 80,
      size: 20,
      font: timesRomanBold,
      color: rgb(0.1, 0.1, 0.4),
    });

    const title2 = 'OFFICIAL ON DUTY (OD) PERMISSION LETTER';
    const title2Width = timesRomanBold.widthOfTextAtSize(title2, 14);
    page.drawText(title2, {
      x: (width - title2Width) / 2,
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
    const dateTextWidth = timesRomanFont.widthOfTextAtSize(dateText, 12);
    page.drawText(dateText, { x: width - margin - dateTextWidth, y: height - 160, size: 12, font: timesRomanFont });

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
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #00f0ff; padding-bottom: 20px;">
            <h1 style="color: #8b5cf6; margin-bottom: 5px; font-size: 28px; font-weight: 900; letter-spacing: 2px;">YUVENZA '26</h1>
            <h2 style="color: #64748b; margin-top: 0; font-weight: 600; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">Official OD Approval</h2>
          </div>
          
          <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 16px;">This email serves as your official <strong>On Duty (OD) approval</strong> for participating in Yuvenza '26.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; font-size: 18px;">Participant Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr><td style="padding: 8px 0; color: #64748b; width: 130px;">Name:</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Institution:</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${college || 'N/A'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Department:</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${department || 'N/A'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Event:</td><td style="padding: 8px 0; font-weight: 700; color: #8b5cf6;">${eventTitle || 'General Fest Entry'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Date:</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">August 21, 2026</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Venue:</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">Yuvenza Main Campus</td></tr>
            </table>
          </div>
          
          <p style="font-size: 16px;">Please find your official OD Letter attached as a PDF to this email. You may present this to your respective department coordinators or HOD to claim your attendance exemption.</p>
          
          <div style="margin-top: 40px; text-align: center; background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
            <p style="color: #475569; margin: 0; font-size: 15px;">We look forward to seeing you at the biggest youth festival of the year!</p>
            <p style="margin-top: 15px; margin-bottom: 0; font-weight: bold; color: #0f172a; font-size: 16px;">The Yuvenza Organizing Committee</p>
          </div>
        </div>
      `,
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
