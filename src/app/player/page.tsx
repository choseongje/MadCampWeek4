"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Player from "../../components/Player";
import styles from "../../styles/Home.module.css";

export default function PlayerPage() {
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

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Spotify Visualizer</h1>
      <div>
        <Player accessToken={accessToken} />
      </div>
    </div>
  );
}
