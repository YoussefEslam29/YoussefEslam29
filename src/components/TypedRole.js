"use client";
import { useTypingEffect } from "@/lib/animations";
import { useMediaQuery } from "@/lib/mobile";
import styles from "./Hero.module.css";

const TYPED_STRINGS = [
  "Software & Web Developer",
  "Cloud Architecture Enthusiast",
  "Robotics Builder",
  "Full-Stack Engineer",
];

// Its own component, so only this span re-renders on every keystroke rather
// than the whole hero.
function Typing() {
  const text = useTypingEffect(TYPED_STRINGS, 70, 35, 2200);
  return text;
}

export default function TypedRole() {
  // Visitors who asked for reduced motion get the first role, standing still
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <>
      {reduced ? TYPED_STRINGS[0] : <Typing />}
      <span className={styles.cursor} />
    </>
  );
}
