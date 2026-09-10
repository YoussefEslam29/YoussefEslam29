import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Privacy Policy | Youssef Eslam Hussein",
  description:
    "What data this site collects, why it is collected, who it is shared with, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "9 September 2026";

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <Link href="/" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          Back to the site
        </Link>

        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

        <div className={styles.body}>
          <p>
            This site is the personal portfolio of Youssef Eslam Hussein. This
            page describes exactly what it collects, why, and who else receives
            it. If anything here is unclear, email{" "}
            <a href="mailto:yousef.islam.hussein@gmail.com">
              yousef.islam.hussein@gmail.com
            </a>{" "}
            and ask.
          </p>

          <h2>What this site collects</h2>

          <h3>The contact form</h3>
          <p>
            The contact form is the only place this site asks you for personal
            information. When you submit it, these are collected:
          </p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>The subject line you enter</li>
            <li>The business sector you select</li>
            <li>The message you write</li>
          </ul>
          <p>
            Nothing else asks for or records personal information. There is no
            account system, no newsletter signup, and no comment section.
          </p>

          <h3>Analytics and tracking</h3>
          <p>
            This site runs <strong>no analytics and no advertising</strong>. It
            sets no tracking cookies and does not build a profile of you or
            share one with anyone. The only cookie it can set is a sign-in
            cookie for the private admin area, which is used by the site owner
            and is never set for ordinary visitors.
          </p>

          <h2>What happens to a message you send</h2>
          <p>When you submit the contact form, three things happen:</p>
          <ul>
            <li>
              The message is stored in <strong>Google Firestore</strong> so the
              site owner can read and reply to it.
            </li>
            <li>
              A push notification is sent to the site owner&apos;s own device
              through <strong>Firebase Cloud Messaging</strong>, containing your
              name, email address, the subject, and the first 100 characters of
              your message.
            </li>
            <li>
              A copy is emailed to the site owner through <strong>Gmail</strong>
              , with your address as the reply-to address so a reply reaches
              you.
            </li>
          </ul>
          <p>
            Messages are read only by Youssef Eslam Hussein. They are not sold,
            rented, published, or passed to anyone beyond the providers below.
          </p>

          <h2>Service providers</h2>
          <ul>
            <li>
              <strong>Vercel</strong> hosts the site. Like any web host, its
              servers process your IP address and browser user-agent to deliver
              pages, and keep them briefly in request logs.
            </li>
            <li>
              <strong>Google Firebase</strong> stores contact form messages and
              delivers the notification.
            </li>
            <li>
              <strong>Google Gmail</strong> delivers the notification email.
            </li>
            <li>
              <strong>Google Fonts</strong> serves the typefaces. Your browser
              requests them from Google servers, so Google receives your IP
              address on every page load, whether or not you use the form.
            </li>
            <li>
              <strong>GitHub</strong> supplies the repository details shown in
              the projects section. Your browser calls the public GitHub API
              directly, so GitHub receives your IP address when that section
              loads.
            </li>
          </ul>

          <h2>How long data is kept</h2>
          <p>
            Contact form messages are kept for as long as they are useful for
            correspondence, and are deleted on request. Hosting and email logs
            follow the retention schedules of Vercel and Google, which this site
            does not control.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask for a copy of any personal data this site holds about
            you, ask for it to be corrected, or ask for it to be deleted. Email{" "}
            <a href="mailto:yousef.islam.hussein@gmail.com">
              yousef.islam.hussein@gmail.com
            </a>
            . Because the only data held is what you typed into the contact
            form, these requests are usually straightforward to fulfil.
          </p>
          <p>
            If you are in the European Economic Area or the United Kingdom, you
            also have the right to object to processing and to complain to your
            local data protection authority.
          </p>

          <h2>Children</h2>
          <p>
            This site is not directed at children and does not knowingly collect
            information from anyone under 16.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If what the site collects changes, this page is updated and the date
            at the top changes with it.
          </p>

          <h2>Contact</h2>
          <p>
            Youssef Eslam Hussein.{" "}
            <a href="mailto:yousef.islam.hussein@gmail.com">
              yousef.islam.hussein@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
