# FIX_EMAIL.md — Contact Form Email Delivery Fix

## Problem Summary

Two issues exist with the current contact form setup:

1. **Emails are not being received** — When someone submits the contact form on the website, the message does NOT reach `yousef.islam.hussein@gmail.com`.
2. **Manual dashboard check required** — To read messages, the EmailJS dashboard must be opened manually instead of receiving them directly in Gmail.

---

## ✅ Steps Already Done

| # | Step | Status |
|---|------|--------|
| 1 | Installed `@emailjs/browser` package | ✅ Done |
| 2 | Created EmailJS account and set up a service (`service_9381lyc`) | ✅ Done |
| 3 | Created an EmailJS email template (`template_jpqe0vq`) | ✅ Done |
| 4 | Added EmailJS credentials to `.env.local` | ✅ Done |
| 5 | Wrote server-side API route (`/api/contact/route.js`) that calls EmailJS REST API | ✅ Done |
| 6 | Connected the contact form (`Contact.js`) to the API route | ✅ Done |

---

## ❌ Root Causes of the Problem

### Cause 1 — EmailJS Service is NOT linked to Gmail

EmailJS works by routing emails through a **connected email service**. The service ID `service_9381lyc` must be connected to your **Gmail account** (`yousef.islam.hussein@gmail.com`) inside the EmailJS dashboard. If the service was created but Gmail was never authorized/linked, no emails will be sent.

### Cause 2 — Email Template has no `To Email` field configured

The EmailJS template must have the **"To Email"** field set to `{{to_email}}` (or hardcoded to your Gmail). If this field is missing or misconfigured in the template editor, EmailJS accepts the request but silently fails to deliver.

### Cause 3 — Private Key usage (optional but risky)

The code sends `accessToken` (your EmailJS private key) with every request. If the private key is wrong or expired, the API rejects the email silently.

### Cause 4 — No Gmail notification configured inside EmailJS

EmailJS stores messages in its dashboard by default. To **forward them to Gmail**, the connected Gmail service must be the destination. This requires the service to be set up with Gmail as the sender/receiver via OAuth.

---

## 🔧 Steps To Fix

### Step 1 — Fix the EmailJS Gmail Service Connection

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and log in.
2. Navigate to **Email Services** in the left sidebar.
3. Find your service (`service_9381lyc`) and click on it.
4. Check the **Email Service Provider** — it must say **Gmail**.
5. If it is NOT Gmail, click **Add New Service** → choose **Gmail** → click **Connect Account** → authorize your Google account (`yousef.islam.hussein@gmail.com`).
6. Click **Test Service** — you should receive a test email in Gmail. If not, re-authorize.

> ⚠️ **Important**: The Gmail OAuth authorization can expire. Re-authorize if needed.

---

### Step 2 — Fix the Email Template

1. In EmailJS dashboard, go to **Email Templates**.
2. Open your template (`template_jpqe0vq`).
3. Make sure the template fields match **exactly** what the code sends:

| Template Variable | Value Sent by Code |
|---|---|
| `{{from_name}}` | Sender's name |
| `{{from_email}}` | Sender's email |
| `{{subject}}` | Email subject |
| `{{business_sector}}` | Business sector selected |
| `{{message}}` | The message body |
| `{{to_email}}` | `yousef.islam.hussein@gmail.com` |

4. In the template settings, set **"To Email"** to: `{{to_email}}` OR hardcode it to `yousef.islam.hussein@gmail.com`.
5. Set **"From Name"** to: `{{from_name}}`.
6. Set **"Reply To"** to: `{{from_email}}` — this lets you reply directly to the person who contacted you.
7. Save the template and click **Test Template** to verify.

---

### Step 3 — Remove the Private Key (Simplify & Fix)

The current code sends an `accessToken` (private key) which can cause silent failures. The recommended approach for server-side API calls is to use only the **Public Key**.

In [`src/app/api/contact/route.js`](../src/app/api/contact/route.js), the payload currently looks like:

```js
// CURRENT (risky — private key causes issues)
if (privateKey && !isPlaceholder(privateKey)) {
  payload.accessToken = privateKey;
}
```

**Fix**: Remove the private key from the payload entirely. EmailJS server-side API works fine with just `service_id`, `template_id`, and `user_id` (public key).

---

### Step 4 — Test the Full Flow

1. Run the dev server: `npm run dev`
2. Open `http://localhost:3000` and go to the **Contact** section.
3. Fill out the form and click **Send Message**.
4. Check your Gmail inbox (`yousef.islam.hussein@gmail.com`) — the email should arrive within 1–2 minutes.
5. Check spam/junk folder if not in inbox.

---

### Step 5 — Deploy with Updated Environment Variables

When deploying (Vercel, Netlify, etc.):

1. Add all environment variables from `.env.local` to the hosting platform's **Environment Variables** settings.
2. The key ones are:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
3. Redeploy after adding variables.

---

## 🔄 Alternative: Switch to Nodemailer + Gmail App Password (Optional)

If EmailJS continues to be problematic, a more direct and reliable solution is to use **Nodemailer** with a **Gmail App Password**. This sends email directly from your Gmail account without any third-party service.

### Why this is more reliable:
- Emails land directly in Gmail — no dashboard needed.
- No third-party service limits (EmailJS free tier = 200 emails/month).
- Full control over email formatting.

### How to set it up:
1. Generate a Gmail App Password at: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Install nodemailer: `npm install nodemailer`
3. Replace the EmailJS API call in `route.js` with a Nodemailer transporter.

> This is a backup plan — try fixing EmailJS first (Steps 1–4 above).

---

## 📋 Summary Checklist

- [ ] Re-authorize Gmail in EmailJS service dashboard
- [ ] Fix email template: set `To Email`, `Reply To`, and verify all `{{variables}}`
- [ ] Remove private key (`accessToken`) from API payload
- [ ] Test locally — confirm email arrives in Gmail
- [ ] Add env vars to hosting platform
- [ ] Redeploy and test on production

---

*Created: 2026-06-13 | File: `plans/FIX_EMAIL.md`*
