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

    const recipientEmail = email;
    const emailSubject = `On-Duty (OD) Permission Request: YOUTHFEST 2026 - ${name}`;

    // 1. Generate PDF Letter
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const { width, height } = page.getSize();
    const margin = 50;

    // Header
    const mainTitle = 'YUVENZA - YOUTHFEST 2026';
    const mainTitleWidth = timesRomanBold.widthOfTextAtSize(mainTitle, 20);
    page.drawText(mainTitle, {
      x: (width - mainTitleWidth) / 2,
      y: height - 60,
      size: 20,
      font: timesRomanBold,
      color: rgb(0.1, 0.1, 0.4),
    });

    const subTitle = 'ON-DUTY (OD) PERMISSION REQUEST';
    const subTitleWidth = timesRomanBold.widthOfTextAtSize(subTitle, 13);
    page.drawText(subTitle, {
      x: (width - subTitleWidth) / 2,
      y: height - 85,
      size: 13,
      font: timesRomanBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawLine({
      start: { x: margin, y: height - 98 },
      end: { x: width - margin, y: height - 98 },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    let currentY = height - 125;

    // Date & Venue
    page.drawText('Date: Friday, 21 August 2026', { x: margin, y: currentY, size: 11, font: timesRomanBold });
    currentY -= 18;
    page.drawText('Venue: Chennai Institute of Technology', { x: margin, y: currentY, size: 11, font: timesRomanBold });
    currentY -= 30;

    // Salutation
    page.drawText('Dear Authorities / Department Heads,', { x: margin, y: currentY, size: 11, font: timesRomanBold });
    currentY -= 24;

    // Body Paragraph
    const p1 = `YUVENZA - The Youth Club of Chennai Institute of Technology is hosting our flagship annual event, YOUTHFEST 2026, on Friday, 21 August 2026. We kindly request that registered students from your institution/department be granted On-Duty (OD) permission for the day to participate in their respective events and workshops.`;
    page.drawText(p1, {
      x: margin,
      y: currentY,
      size: 11,
      font: timesRomanFont,
      maxWidth: width - margin * 2,
      lineHeight: 16,
    });
    currentY -= 65;

    // Student Details (Clean list, no box)
    page.drawText('Registered Student Details:', { x: margin, y: currentY, size: 11, font: timesRomanBold });
    currentY -= 18;
    page.drawText(`* Student Name: ${name}`, { x: margin + 10, y: currentY, size: 10.5, font: timesRomanFont });
    currentY -= 16;
    page.drawText(`* Institution: ${college || 'N/A'}`, { x: margin + 10, y: currentY, size: 10.5, font: timesRomanFont });
    currentY -= 16;
    page.drawText(`* Department: ${department || 'N/A'}`, { x: margin + 10, y: currentY, size: 10.5, font: timesRomanFont });
    currentY -= 16;
    page.drawText(`* Event / Workshop: ${eventTitle || 'General Fest Entry'}`, { x: margin + 10, y: currentY, size: 10.5, font: timesRomanFont });
    currentY -= 30;

    // Instructions for Participants
    page.drawText('Instructions for Participants', { x: margin, y: currentY, size: 11, font: timesRomanBold });
    currentY -= 18;
    page.drawText('To ensure a smooth experience, participating students are advised to:', { x: margin, y: currentY, size: 10.5, font: timesRomanFont });
    currentY -= 18;
    page.drawText('* Report on Time: Arrive at the designated venue according to the event schedule.', { x: margin + 10, y: currentY, size: 10.5, font: timesRomanFont, maxWidth: width - margin * 2 - 10, lineHeight: 15 });
    currentY -= 20;
    page.drawText('* Bring Valid ID: Carry a physical, valid College ID card at all times.', { x: margin + 10, y: currentY, size: 10.5, font: timesRomanFont, maxWidth: width - margin * 2 - 10, lineHeight: 15 });
    currentY -= 20;
    page.drawText('* Follow Guidelines: Adhere strictly to the rules and instructions set by the event organizers.', { x: margin + 10, y: currentY, size: 10.5, font: timesRomanFont, maxWidth: width - margin * 2 - 10, lineHeight: 15 });
    currentY -= 35;

    // Warm Regards section
    page.drawText('Warm Regards,', { x: margin, y: currentY, size: 11, font: timesRomanBold });
    currentY -= 18;
    const closingText = `We are excited to welcome talented students across institutions to collaborate, showcase their skills, and make YOUTHFEST 2026 a memorable success. Thank you for supporting your students' participation.`;
    page.drawText(closingText, {
      x: margin,
      y: currentY,
      size: 10.5,
      font: timesRomanFont,
      maxWidth: width - margin * 2,
      lineHeight: 15,
    });
    currentY -= 45;

    // Sign off
    page.drawText('Organizing Committee', { x: margin, y: currentY, size: 11, font: timesRomanBold });
    currentY -= 16;
    page.drawText('YUVENZA - Youth Club', { x: margin, y: currentY, size: 10.5, font: timesRomanFont });
    currentY -= 16;
    page.drawText('Chennai Institute of Technology', { x: margin, y: currentY, size: 10.5, font: timesRomanFont });

    const pdfBytes = await pdfDoc.save();

    // 2. Send HTML Email (No container box)
    const mailer = getMailer();
    await mailer.sendMail({
      from: getFromEmail(),
      to: recipientEmail,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <h2 style="color: #1e1b4b; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; font-size: 22px;">
            On-Duty (OD) Permission Request: YOUTHFEST 2026
          </h2>
          
          <p style="font-size: 14px; margin-bottom: 4px;"><strong>Date:</strong> Friday, 21 August 2026</p>
          <p style="font-size: 14px; margin-top: 0;"><strong>Venue:</strong> Chennai Institute of Technology</p>
          
          <p style="font-size: 15px; font-weight: bold; margin-top: 20px;">Dear Authorities / Department Heads,</p>
          
          <p style="font-size: 14px;">
            YUVENZA &ndash; The Youth Club of Chennai Institute of Technology is hosting our flagship annual event, <strong>YOUTHFEST 2026</strong>, on <strong>Friday, 21 August 2026</strong>.
          </p>
          <p style="font-size: 14px;">
            We kindly request that registered students from your institution/department be granted On-Duty (OD) permission for the day to participate in their respective events and workshops.
          </p>

          <div style="margin: 20px 0; padding: 5px 0;">
            <p style="font-size: 15px; font-weight: bold; margin-bottom: 8px;">Registered Student Details:</p>
            <ul style="list-style-type: none; padding-left: 0; margin: 0; font-size: 14px; line-height: 1.8;">
              <li><strong>Student Name:</strong> ${name}</li>
              <li><strong>Institution:</strong> ${college || 'N/A'}</li>
              <li><strong>Department:</strong> ${department || 'N/A'}</li>
              <li><strong>Event / Workshop:</strong> ${eventTitle || 'General Fest Entry'}</li>
            </ul>
          </div>

          <p style="font-size: 15px; font-weight: bold; margin-top: 20px; margin-bottom: 8px;">Instructions for Participants</p>
          <p style="font-size: 14px; margin-top: 0;">To ensure a smooth experience, participating students are advised to:</p>
          <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">
            <li><strong>Report on Time:</strong> Arrive at the designated venue according to the event schedule.</li>
            <li><strong>Bring Valid ID:</strong> Carry a physical, valid College ID card at all times.</li>
            <li><strong>Follow Guidelines:</strong> Adhere strictly to the rules and instructions set by the event organizers.</li>
          </ul>

          <p style="font-size: 15px; font-weight: bold; margin-top: 25px; margin-bottom: 4px;">Warm Regards,</p>
          <p style="font-size: 14px; margin-top: 0;">
            We are excited to welcome talented students across institutions to collaborate, showcase their skills, and make YOUTHFEST 2026 a memorable success. Thank you for supporting your students' participation.
          </p>

          <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 14px;">
            <p style="font-weight: bold; margin: 0;">Organizing Committee</p>
            <p style="margin: 2px 0;">YUVENZA &ndash; Youth Club</p>
            <p style="margin: 0; color: #64748b;">Chennai Institute of Technology</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `OD_Permission_Letter_${name.replace(/\s+/g, '_')}.pdf`,
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
