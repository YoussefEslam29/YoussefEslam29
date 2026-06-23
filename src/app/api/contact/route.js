import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, subject, businessSector, message } = await request.json();

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contactMessage = {
      name,
      email,
      subject,
      businessSector: businessSector || "Not specified",
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Firestore
    let docRef;
    try {
      docRef = await adminDb.collection("messages").add(contactMessage);
    } catch (dbError) {
      console.error("Failed to save message to Firestore:", dbError);
      return NextResponse.json(
        { error: "Failed to save message", details: dbError.message },
        { status: 500 }
      );
    }

    // 2. Send FCM push notification (non-blocking — don't fail the request if this fails)
    const fcmToken = process.env.FCM_DEVICE_TOKEN;
    if (fcmToken) {
      try {
        await adminMessaging.send({
          token: fcmToken,
          notification: {
            title: `📩 New message from ${name}`,
            body: `${subject} — ${message.substring(0, 100)}`,
          },
          data: {
            messageId: docRef.id,
            from: name,
            email,
          },
        });
      } catch (fcmError) {
        console.warn("FCM notification failed (non-critical):", fcmError.message);
      }
    }

    // 3. Send email via Nodemailer (non-blocking — don't fail the request if this fails)
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const notificationEmail = process.env.NOTIFICATION_EMAIL || gmailUser;

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${gmailUser}>`,
          to: notificationEmail,
          replyTo: email,
          subject: `[Portfolio] New message: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
                📩 New Contact Message
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #555; width: 140px;">From:</td>
                  <td style="padding: 8px;">${name}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #555;">Subject:</td>
                  <td style="padding: 8px;">${subject}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 8px; font-weight: bold; color: #555;">Business Sector:</td>
                  <td style="padding: 8px;">${businessSector || "Not specified"}</td>
                </tr>
              </table>
              <div style="background: #f3f0ff; border-left: 4px solid #7c3aed; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #999; font-size: 12px;">
                View all messages in your
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/messages">Admin Dashboard →</a>
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.warn("Email notification failed (non-critical):", emailError.message);
      }
    }

    return NextResponse.json({ success: true, messageId: docRef.id });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
