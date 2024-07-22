"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Login from "../components/Login";
import styles from "../styles/Home.module.css";

export default function Home() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("access_token");
    if (token) {
      setAccessToken(token);
      const expiresIn = new Date().getTime() + 3600 * 1000; // Assuming token is valid for 1 hour
      localStorage.setItem("spotify_access_token", token);
      localStorage.setItem("spotify_token_expires_in", expiresIn.toString());

      // URL에서 토큰 제거
      const url = new URL(window.location.href);
      url.searchParams.delete("access_token");
      window.history.replaceState({}, document.title, url.toString());
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      const expiresIn = localStorage.getItem("spotify_token_expires_in");
      if (
        storedToken &&
        expiresIn &&
        new Date().getTime() < Number(expiresIn)
      ) {
        setAccessToken(storedToken);
      } else {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expires_in");
      }
    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_token_expires_in");
    setAccessToken(null);
    window.location.reload(); // 페이지를 새로 고쳐 토큰을 완전히 제거합니다
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Spotify Visualizer</h1>
      {!accessToken ? (
        <Login />
      ) : (
        <div className={styles.container}>
          <div className={styles.tabBar}>
            <Link href="/player" className={styles.tabButton}>
              플레이어
            </Link>
            <Link href="/community" className={styles.tabButton}>
              커뮤니티
            </Link>
            <Link href="/visualizer" className={styles.tabButton}>
              비주얼라이저
            </Link>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
