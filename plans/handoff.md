# Handoff Document — Youssef Eslam Portfolio Project
**Session Date:** August 2026  
**Prepared for:** Youssef Eslam Hussein  
**Contact:** yousef.islam.hussein@gmail.com

---

## 1. Who You Are — Quick Profile

| Field | Detail |
|---|---|
| **Full Name** | Youssef Eslam Hussein |
| **Field** | Software & Web Developer |
| **University** | Arab Academy for Science and Technology (AASTMT) — Computer Engineering, graduating 2028 |
| **Based** | Alexandria, Egypt + Saudi Arabia |
| **Brand alias** | XIXYA · 29 |
| **Primary stack** | React, Next.js, TypeScript, SQL/NoSQL, PostgreSQL, MongoDB |
| **Secondary stack** | Python, C++, ROS 2, Raspberry Pi, AWS, Vercel, Git |

### Your Socials
| Platform | Link / Handle |
|---|---|
| Email | yousef.islam.hussein@gmail.com |
| Website | https://youssef-eslam29.vercel.app/ |
| GitHub | https://github.com/YoussefEslam29 |
| LinkedIn | https://www.linkedin.com/in/youssef-eslam-hussein-240142205/ |
| Instagram | @xixya_29 |
| X / Twitter | @XIXYA_29 |
| Facebook | yousef.carti |
| 🇪🇬 Phone | +20 102 386 0655 |
| 🇸🇦 Phone | +966 56 133 1159 |

---

## 2. What Was Done This Session

### 2.1 Portfolio Plan (`youssef_eslam_portfolio_plan.md`)
A full non-technical plan was created covering:
- **Goal:** Attract both full-time employers AND freelance clients
- **Hero section:** Realistic 3D animated version of Youssef (still pending — needs photo)
- **Skills section:** Visual showcase of JS/TS, React/Next.js, Databases
- **Projects section:** Spotlight cards for each project (CashBack Motors, EVE Robot, Alexandria Barber Booking, Bus Management System, SIC/XE Assembler, Bean Plant Classifier)
- **Certificates section:** Card grid with lightbox viewer
- **CV download button:** PDF accessible from hero and contact sections
- **Update system:** Private admin panel + GitHub pinned repos sync
- **Contact section:** All socials + message form
- **Brand:** Deep purple + black palette, geometric owl logo, XIXYA identity

### 2.2 Certificates Plan (`certificates_plan.md`)
A dedicated plan for the certificates section covering:
- All 5 certificates documented with issuer, date, type, and filename
- Layout: card grid with thumbnail + lightbox modal on click
- File naming convention for `/public/certificates/` folder
- Admin panel flow for adding new certificates without code
- Future slots: AWS Cloud Practitioner, ECPC ranking, Coursera completions
- Decision: CV shown as a **Download button only** (not embedded)

#### Certificates Documented
| # | Certificate | Issuer | Date |
|---|---|---|---|
| 1 | Cybersecurity Vigilance Expedition 2024 | IEEE Alex SB | 2024 |
| 2 | Data Analysis & Visualization (60hrs, Grade: Excellent) | ICTHub Egypt | Feb 2026 |
| 3 | IEEE AAST Cloudify Event | IEEE AAST SB | Feb 2025 |
| 4 | IEEE AAST VGM Event | IEEE AAST SB | Mar 2025 |
| 5 | Robotics: From Zero to Hero 2024 | IEEE AAST AlexSB + Makers | 2024 |

### 2.3 Business Card
A full two-sided professional business card was designed and exported.

**Front side contains:**
- Name: YOUSSEF ESLAM (white + purple accent)
- Title: Software & Web Developer
- Tagline: React · Next.js · TypeScript · Databases
- Email, website, both phone numbers with flag emojis
- Owl logo (right panel, centered, no text underneath)

**Back side contains:**
- All social links (GitHub, LinkedIn, Instagram, X, Facebook)
- Contact info (email, website, both phones)
- QR code linking to https://youssef-eslam29.vercel.app/
- Caption: "Software & Web Developer / Egypt · Saudi Arabia"

**Design details:**
- Colors: `#0c0b14` background, `#a855f7` purple accent, white text
- Purple gradient stripe top/bottom: `#5b21b6 → #a855f7 → #c084fc`
- Dot grid background pattern
- **Sharp 90° corners** (no border radius)
- QR code embedded as pure SVG path (no external library — always renders)
- Logo embedded as base64 PNG (no broken image risk in PDF)

**Final version:** `youssef_eslam_business_card_v6.pdf` + `.html`

---

## 3. Files Delivered

| File | What It Is |
|---|---|
| `youssef_eslam_portfolio_plan.md` | Full non-technical portfolio website plan |
| `certificates_plan.md` | Certificates section plan with all cert details |
| `youssef_eslam_business_card_v6.pdf` | ✅ Final business card — print-ready PDF |
| `youssef_eslam_business_card_v6.html` | ✅ Final business card — HTML source |
| `logo_owl_only.png` | Owl icon cropped, brightened, transparent bg — for website use |
| `logo_full_transparent.png` | Full logo (owl + name), transparent bg, brightened |
| `logo_full_bright.png` | Full logo brightened on white bg |
| `youssef_eslam_logo_bright.png` | Brightened version of the small logo PNG |

> **Best logo file to use on dark backgrounds:** `logo_owl_only.png`  
> **Best logo file to use on light/white backgrounds:** `logo_full_bright.png`

---

## 4. What Is Still Pending

### 4.1 🔴 3D Avatar (Not Started — Needs Your Photo)
The hero section of your portfolio requires a realistic 3D version of you. This was planned but not executed because a face photo was never uploaded.

**What you need to do:**
- Upload a clear, front-facing photo of yourself (good lighting, no heavy filters)
- The session can then generate or guide the creation of a 3D character based on your likeness
- Tools to explore: Ready Player Me, Avaturn, or a custom Three.js scene

### 4.2 🟡 Website Build (Not Started)
The full portfolio website has been fully planned but not built yet. The next step is to start building it. Recommended stack based on your skills:
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **3D:** Three.js or React Three Fiber (for the hero animation)
- **CMS / Admin:** A simple custom admin page or Notion/Sanity as a headless CMS
- **GitHub sync:** GitHub API to pull pinned repositories automatically
- **Deployment:** Vercel (you already have a Vercel URL live)

### 4.3 🟡 Domain Name (Not Confirmed)
It was recommended to register a `.dev` domain early. Suggested options:
- `youssefeslam.dev`
- `youssef.dev`
- `xixya.dev`

Check availability and register before someone else does.

---

## 5. Brand Guidelines (For Developer Handoff)

| Token | Value |
|---|---|
| Primary bg | `#0c0b14` |
| Secondary bg | `#12101c` |
| Border | `#2e1f50` |
| Purple primary | `#a855f7` |
| Purple dark | `#7c3aed` / `#6d28d9` |
| Purple deeper | `#5b21b6` |
| Purple darkest | `#4c1d95` |
| Pink accent | `#c084fc` |
| Text primary | `#ffffff` |
| Text secondary | `#d4c5e8` |
| Text muted | `#8b6ab0` |
| Gradient | `linear-gradient(90deg, #5b21b6, #a855f7, #c084fc)` |
| Border radius | `0px` (sharp, 90° edges throughout) |
| Font | `'Segoe UI', system-ui, sans-serif` |
| Logo | Geometric owl in purple/black triangles |

---

## 6. Printing the Business Card

1. Open `youssef_eslam_business_card_v6.pdf` or `.html` in a browser
2. Print → set paper to **A4 Landscape**
3. Enable **"Print background graphics"**
4. Scale: **Fit to page**
5. Save as PDF or send directly to print shop
6. Standard business card size is **85 × 54mm** — ask the print shop to cut from the layout

---

*Handoff prepared at end of session — Youssef Eslam Hussein Portfolio Project, August 2026*
