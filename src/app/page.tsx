// src/app/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Login from "../components/Login";
import Player from "../components/Player";

const Home = () => {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  return (
    <div className={styles.container}>
      <h1>Spotify Visualizer</h1>
      {!accessToken ? (
        <Login />
      ) : (
        <Player accessToken={accessToken} />
      )}
    </div>
  );
};

export default Home;
