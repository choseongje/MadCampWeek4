// src/app/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Visualizer from "../components/Visualizer";
import Login from "../components/Login";
import Player from "../components/Player";
import styles from "../styles/Home.module.css";

export default function Home() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    const token = searchParams.get("access_token");
    if (token) {
      setAccessToken(token);

      // Remove the token from the URL after setting it
      const url = new URL(window.location.href);
      url.searchParams.delete("access_token");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [searchParams]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudioFile(event.target.files[0]);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Spotify Visualizer</h1>
      {!accessToken ? (
        <Login />
      ) : (
        <div>
          <Player accessToken={accessToken} />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {audioFile && <Visualizer audioFile={audioFile} />}
        </div>
      )}
    </div>
  );
}
