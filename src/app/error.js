"use client";

import { useEffect } from "react";
import styles from "./status.module.css";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Surfaces in the Vercel runtime logs rather than only the browser console.
    console.error("Unhandled error rendering the page:", error);
  }, [error]);

  return (
    <main className={styles.page}>
      <div className="container">
        <p className={`mono ${styles.code}`}>ERROR</p>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.text}>
          This part of the site failed to load. Trying again usually fixes it.
          If it keeps happening, email yousef.islam.hussein@gmail.com.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
