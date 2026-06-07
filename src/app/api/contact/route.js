import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { name, email, subject, businessSector, message } = await request.json();

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare message object
    const contactMessage = {
      name,
      email,
      subject,
      businessSector: businessSector || "Not specified",
      message,
      createdAt: new Date(),
    };

    // 1. Try to save to MongoDB as a backup if configured
    let savedToDb = false;
    try {
      const collection = await getCollection("messages");
      if (collection) {
        await collection.insertOne(contactMessage);
        savedToDb = true;
      }
    } catch (dbError) {
      console.error("Failed to save contact message to MongoDB:", dbError);
    }

    // 2. Send email via EmailJS API securely
    const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY || process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY;

    let emailSent = false;
    let emailError = null;

    const isPlaceholder = (key) => !key || key.includes("YOUR_") || key.includes("your_");

    if (isPlaceholder(serviceId) || isPlaceholder(templateId) || isPlaceholder(publicKey)) {
      console.warn("EmailJS credentials are not configured or are using placeholders. Skipping email send.");
      emailError = "EmailJS credentials not configured";
    } else {
      try {
        const payload = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: name,
            from_email: email,
            subject: subject,
            business_sector: businessSector || "Not specified",
            message: message,
            to_email: "yousef.islam.hussein@gmail.com",
          },
        };

        if (privateKey && !isPlaceholder(privateKey)) {
          payload.accessToken = privateKey;
        }

        const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok || res.status === 200) {
          emailSent = true;
        } else {
          const text = await res.text();
          console.error("EmailJS API error response:", text);
          emailError = `EmailJS error: ${text}`;
        }
      } catch (err) {
        console.error("Failed to send email via EmailJS:", err);
        emailError = err.message;
      }
    }

    // Respond back to the user
    // If either DB is saved or Email is sent, we treat it as success
    if (emailSent || savedToDb) {
      return NextResponse.json({
        success: true,
        savedToDb,
        emailSent,
        warning: emailError ? "Email failed to send but message was saved" : null
      });
    }

    // If both failed (e.g. DB not configured and Email failed)
    return NextResponse.json({
      error: "Failed to process message",
      details: emailError || "Database not configured and EmailJS failed"
    }, { status: 500 });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
