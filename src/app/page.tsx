"use client";

import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Spotify Visualizer</h1>
      <div className={styles.tabBar}>
        <Link href="/player" className={styles.tabButton}>
          플레이어
        </Link>
        <Link href="/community" className={styles.tabButton}>
          커뮤니티
        </Link>
      </div>
    </div>
  );
}
