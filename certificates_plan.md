# Certificates Section Plan
## Youssef Eslam Hussein — Portfolio Website

---

## Goal

Display all of Youssef's certificates and achievements in a dedicated section of the portfolio website. This section should instantly build trust with employers and clients by proving real-world participation, training, and accomplishments — backed by official documents.

---

## What Certificates We Have

Based on uploaded documents and CV, here is the full list:

### 1. IEEE Alex SB — Cybersecurity Vigilance Expedition 2024
- **Issued by:** IEEE Alex SB
- **Type:** Certificate of Appreciation
- **For:** Attendance at the IEEE Alex SB Cybersecurity Vigilance Expedition 2024
- **File:** `CVE-Attendance-Certificate_Data_Set_50.jpg`

### 2. ICTHub Egypt — Data Analysis & Visualization
- **Issued by:** ICTHub Egypt for Technology and Training
- **Type:** Certificate of Achievement
- **For:** Completing practical on-the-job training in Data Analysis & Visualization
- **Duration:** 24/1/2026 – 12/2/2026 (60 practical training hours)
- **Grade:** Excellent
- **File:** `data_certificate.jpeg`

### 3. IEEE AAST — Cloudify Event
- **Issued by:** IEEE AAST Student Branch
- **Type:** Certificate of Achievement
- **For:** Attendance and participation in the IEEE AAST Cloudify Event
- **Date:** February 2025
- **File:** `Youssef_Eslam_hussein_CLOUDIFY.png`

### 4. IEEE AAST — VGM Event
- **Issued by:** IEEE AAST Student Branch
- **Type:** Certificate of Achievement
- **For:** Attendance and participation in the IEEE AAST VGM Event
- **Date:** March 2025
- **File:** `Youssef_Eslam_hussein_VGM.png`

### 5. IEEE AAST AlexSB — Robotics: From Zero to Hero 2024
- **Issued by:** IEEE AAST AlexSB & Makers
- **Type:** Certificate of Appreciation
- **For:** Participation and completion of the Robotics: From Zero to Hero 2024 program
- **File:** (5th certificate image uploaded)

### 6. Resume / CV (Optional Display)
- **File:** `YOUSSEF_ESLAM.pdf`
- Can be offered as a downloadable PDF button on the site

---

## How It Will Look on the Website

### Section Name
**"Achievements & Certificates"** or simply **"Certificates"**

### Layout
- A clean horizontal scrollable card row OR a 2–3 column grid
- Each certificate gets its own card with:
  - A thumbnail preview of the certificate image
  - The certificate title (bold)
  - The issuing organization (smaller text)
  - The date
  - A **"View"** button that opens the full image in a lightbox modal
- Cards use the brand colors: deep purple, black, white text

### Resume Button
- A standalone **"Download My CV"** button placed above or below the certificates grid
- Links directly to the PDF
- Styled with the brand purple + owl logo accent

### Section Header
- Title: `Achievements & Certificates`
- Subtitle: `Official recognitions from IEEE, ICTHub, and more`

---

## Grouping / Categories (Optional Enhancement)

If more certificates are added in the future, they can be grouped into tabs:

| Tab Name | What Goes Here |
|---|---|
| **Training & Courses** | ICTHub Data Analysis, any future Udemy/Coursera certs |
| **IEEE & Events** | Cybersecurity, Cloudify, VGM, Robotics |
| **Competition & Achievements** | ECPC, hackathons, future awards |

---

## Update Flow (Admin Panel)

When Youssef wants to add a new certificate:
1. Log into the private admin panel on the website
2. Click **"Add Certificate"**
3. Fill in: Title, Issuing Org, Date, Category, upload image file
4. Click Save → it appears live on the site instantly

No developer needed. No code changes required.

---

## Resume Section Decision

| Option | Recommendation |
|---|---|
| Show full CV inline | ❌ Too much — keep the site clean |
| Show a PDF download button | ✅ Clean, professional, one click |
| Show key highlights from CV in the About/Skills section | ✅ Better for engagement |

**Decision: Add a "Download CV" button in the hero/about section AND in the contact section. Do not embed the full PDF.**

---

## Files to Prepare

Before building this section, make sure all certificate images are:
- [ ] High resolution (already look good from uploads)
- [ ] Renamed clearly: `cert_ieee_cybersecurity_2024.jpg`, `cert_icthub_data_2026.jpeg`, etc.
- [ ] Stored in a `/public/certificates/` folder in the project
- [ ] The PDF CV stored at `/public/resume/youssef_eslam_cv.pdf`

---

## Future Certificates to Add (Placeholders)

As Youssef grows, these slots are ready to fill:
- AWS Cloud Practitioner (planned — already in AWS Community Core Team)
- Any Coursera / freeCodeCamp completions
- ECPC competition ranking certificate
- Any freelance client testimonials or project awards

---

*Plan section for: Youssef Eslam Hussein Portfolio Website*
*Created: June 2026*
