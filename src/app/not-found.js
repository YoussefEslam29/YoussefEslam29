import Link from "next/link";
import styles from "./status.module.css";

export const metadata = {
  title: "Page not found | Youssef Eslam Hussein",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className="container">
        <p className={`mono ${styles.code}`}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          That address does not exist on this site. It may have been moved, or
          the link may be mistyped.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
