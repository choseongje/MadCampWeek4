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
      const expiresIn = new Date().getTime() + 3600 * 1000; // Assuming token is valid for 1 hour
      localStorage.setItem("spotify_access_token", token);
      localStorage.setItem("spotify_token_expires_in", expiresIn.toString());

      // Remove the token from the URL after setting it
      const url = new URL(window.location.href);
      url.searchParams.delete("access_token");
      window.history.replaceState({}, document.title, url.toString());
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      const expiresIn = localStorage.getItem("spotify_token_expires_in");
      if (storedToken && expiresIn && new Date().getTime() < Number(expiresIn)) {
        setAccessToken(storedToken);
      } else {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expires_in");
      }
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
