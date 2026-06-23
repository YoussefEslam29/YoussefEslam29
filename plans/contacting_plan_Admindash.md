# Contact System Overhaul — Firebase Firestore + FCM Push + Email Notifications

## Overview

Replace the broken EmailJS contact system with a reliable Firebase-powered pipeline:

1. **Visitor submits contact form** → message saved to **Firebase Firestore**
2. **Admin Dashboard** gets a new standalone page at `/admin/messages` → shows all messages
3. **You receive a push notification** on your mobile via **Firebase Cloud Messaging (FCM)**
4. **You receive an email** via **Nodemailer + Gmail App Password** (no third-party relay)

EmailJS is **completely removed**.

---

## Architecture Diagram

```
[Visitor]
   │
   │ POST /api/contact
   ▼
[Next.js API Route — /api/contact/route.js]
   │
   ├──► Save message to Firestore (collection: "messages")
   │
   ├──► Send FCM push notification to your phone (via Firebase Admin SDK)
   │
   └──► Send email via Nodemailer → Gmail (yousef.islam.hussein@gmail.com)

[You — Admin]
   │
   │ Visit /admin/messages (password protected)
   ▼
[Messages Page — reads Firestore via API]
   └──► Shows all messages: name, email, subject, business sector, message, timestamp
        └──► Mark as Read | Delete | Reply (mailto link)
```

---

## Decisions (Confirmed During Planning)

- ✅ Firebase: Brand-new project will be created from scratch
- ✅ Notifications: Both push (FCM on mobile) AND email (Gmail via Nodemailer)
- ✅ Messages UI: Separate standalone page at `/admin/messages`
- ✅ EmailJS: Completely removed — Firebase Firestore is the only storage system

---

## Phase 1 — Firebase Setup (Manual Steps — You Do These First)

### 1A. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it: `youssef-portfolio` (or `xixya-portfolio`)
3. Disable Google Analytics → Click "Create project"

### 1B. Set Up Firestore Database

1. Firebase console sidebar → Firestore Database → "Create database"
2. Choose "Start in test mode"
3. Region: `europe-west1` (closest to Egypt/Saudi Arabia)
4. Click "Done"

### 1C. Get Firebase Web App Config (Client-Side)

1. Firebase console → Project Settings → "General" tab
2. Under "Your apps" → "Add app" → Web icon
3. App nickname: `portfolio-web` → "Register app"
4. Copy the `firebaseConfig` object → save for `.env.local`

### 1D. Get Firebase Admin SDK Service Account (Server-Side)

1. Firebase console → Project Settings → "Service accounts" tab
2. Click "Generate new private key" → confirm → a `.json` file downloads
3. **Keep this file SECRET — never commit to git**
4. Extract `project_id`, `client_email`, and `private_key` for `.env.local`

### 1E. FCM Token for Your Phone (One-Time Setup)

The first time you open `/admin/messages` from your phone:
- A "Get my FCM Token" button will appear
- Tap it → copy the token shown
- Paste it into `.env.local` as `FCM_DEVICE_TOKEN`

### 1F. Firestore Security Rules

In Firebase console → Firestore → Rules tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read, write: if false; // Admin SDK bypasses this
    }
  }
}
```

---

## Phase 2 — Gmail App Password Setup (Manual Step)

1. Go to https://myaccount.google.com/security
2. Ensure 2-Step Verification is ON for yousef.islam.hussein@gmail.com
3. Go to https://myaccount.google.com/apppasswords
4. Create: App = Mail, Device = Portfolio Website
5. Copy the 16-character password → add to `.env.local` as `GMAIL_APP_PASSWORD`

---

## Updated .env.local (After Setup)

```env
# MongoDB (keep for other APIs)
MONGODB_URI=

# Firebase Admin SDK (server-side — NEVER expose to browser)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web SDK (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# FCM Push Notification
FCM_DEVICE_TOKEN=your-phone-fcm-token-here

# Gmail (Nodemailer — replaces EmailJS)
GMAIL_USER=yousef.islam.hussein@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
NOTIFICATION_EMAIL=yousef.islam.hussein@gmail.com

# Admin Panel
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=xixya2024

# NextAuth
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

NOTE: The FIREBASE_PRIVATE_KEY must keep literal \n sequences (not actual newlines).
Paste it exactly as it appears in the downloaded service account JSON, in double quotes.

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `.env.local` | MODIFY | Remove EmailJS vars, add Firebase + Gmail |
| `src/lib/firebase-admin.js` | NEW | Server-side Firebase Admin SDK singleton |
| `src/lib/firebase-client.js` | NEW | Client-side Firebase SDK singleton |
| `src/app/api/contact/route.js` | MODIFY | Full rewrite: Firestore + FCM + Nodemailer |
| `src/app/api/messages/route.js` | NEW | GET all messages |
| `src/app/api/messages/[id]/route.js` | NEW | PATCH (mark read) + DELETE |
| `src/app/admin/messages/page.js` | NEW | Messages inbox page at /admin/messages |
| `src/app/admin/messages/messages.module.css` | NEW | Styles for messages page |
| `src/app/admin/page.js` | MODIFY | Add Messages link in sidebar |
| `package.json` | MODIFY | Remove @emailjs/browser, add firebase-admin + firebase + nodemailer |

---

## Messages Page Features (/admin/messages)

- Password protected (same sessionStorage auth as /admin)
- Shows all messages from Firestore, newest first
- Each message card shows: name, email, subject, business sector, timestamp, full message
- Red badge for unread messages, grey for read
- Buttons per message: [Reply] [Mark Read] [Delete]
- Reply opens mailto: link with pre-filled email
- Unread count shown in page title and sidebar badge
- Auto-refresh every 30 seconds + manual refresh button

---

## Contact.js Changes

No structural changes needed. The form already POSTs to /api/contact.
The switch from EmailJS to Firebase is invisible to the visitor.
The success/error messages stay the same.

---

## npm Changes

Remove:
  npm uninstall @emailjs/browser

Install:
  npm install firebase-admin firebase nodemailer

---

## Verification Checklist

- [ ] Firebase project created
- [ ] Firestore database created (europe-west1)
- [ ] Firebase Web App registered + config copied to .env.local
- [ ] Service account JSON generated + keys added to .env.local
- [ ] Gmail App Password created + added to .env.local
- [ ] npm packages updated (firebase-admin, firebase, nodemailer installed; @emailjs/browser removed)
- [ ] Submit contact form → message appears in Firestore console
- [ ] Submit contact form → email received in Gmail
- [ ] Submit contact form → FCM push notification received on phone
- [ ] /admin/messages requires login
- [ ] Messages shown correctly, newest first
- [ ] Mark as Read works
- [ ] Delete works
- [ ] Sidebar in /admin shows Messages link with unread badge
- [ ] plans/WEBSITE_STATUS.md updated to reflect fixes

---

*Created: June 23, 2026 | Youssef Eslam Hussein Portfolio*
*Part of the YoussefEslam29 website plans folder*
