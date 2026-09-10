import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Terms and Conditions | Youssef Eslam Hussein",
  description:
    "The terms that apply to using this site, its content, and the contact form.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "9 September 2026";

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <Link href="/" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          Back to the site
        </Link>

        <h1 className={styles.title}>Terms and Conditions</h1>
        <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

        <div className={styles.body}>
          <p>
            This site is the personal portfolio of Youssef Eslam Hussein. By
            using it you accept the terms below. They are short and there is
            nothing hidden in them.
          </p>

          <h2>What this site is</h2>
          <p>
            A portfolio: a description of its owner background, skills,
            projects, and certificates, together with a way to get in touch. It
            does not sell anything and takes no payment.
          </p>

          <h2>Content and ownership</h2>
          <p>
            The text, design, code, images, and project descriptions on this
            site belong to Youssef Eslam Hussein unless stated otherwise. You
            are welcome to read the site, link to it, and quote short passages
            with attribution. You may not republish it wholesale or present it
            as your own work.
          </p>
          <p>
            Third-party names, logos, and trademarks that appear here, including
            those of the organisations that issued the certificates shown,
            belong to their respective owners and are used only to identify
            them.
          </p>

          <h2>The CV download</h2>
          <p>
            The CV offered for download is provided so that potential employers
            and clients can evaluate the owner for work. Please do not
            redistribute it, publish it, or add it to a database or mailing list
            without permission.
          </p>

          <h2>Accuracy</h2>
          <p>
            The site is kept accurate to the best of its owner knowledge, but it
            is provided as is, with no warranty that it is complete, current, or
            free of errors. Parts of the projects section are drawn live from
            the public GitHub API and reflect whatever that API returns at the
            time you load the page.
          </p>

          <h2>External links</h2>
          <p>
            This site links to other places, including GitHub, LinkedIn, and
            other social platforms. Those sites are not under its owner control,
            and he is not responsible for their content or their privacy
            practices.
          </p>

          <h2>Using the contact form</h2>
          <p>
            Please use the contact form for genuine enquiries. Do not use it to
            send unsolicited advertising, abusive content, or anything unlawful.
            Messages that do are deleted. What happens to a message you send is
            described in the <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            Sending a message does not create a contract or any obligation to
            reply, and no client relationship begins until it is agreed
            separately in writing.
          </p>

          <h2>Availability</h2>
          <p>
            The site is offered without any guarantee of uptime. It may be
            offline, changed, or withdrawn at any time without notice.
          </p>

          <h2>Liability</h2>
          <p>
            To the extent the law allows, Youssef Eslam Hussein is not liable
            for any loss arising from your use of this site or from reliance on
            anything published on it. Nothing here limits liability where the
            law does not permit it to be limited.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the Arab Republic of Egypt.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            These terms may be updated. The date at the top of this page shows
            when they last changed.
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
