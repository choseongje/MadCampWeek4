"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Login from "../components/Login";
import Styles from "../styles/Quadrant.module.css";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
    router.push("/"); // 로그인 페이지로 리디렉션
  };

  return (
    <div className={Styles.container}>
      <Image
        src="/YaOng4.png"
        alt="Logo"
        className={Styles.logo}
        width={80}
        height={80}
        onClick={() => router.push("/")}
      />
      {!accessToken ? (
        <Login />
      ) : (
        <>
          <button className={Styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
          <div
            className={`${Styles.quadrant} ${Styles.quadrant1}`}
            onClick={() => router.push("/player")}
          >
            <div className={Styles.quadrantText}>플레이어</div>
          </div>
          <div
            className={`${Styles.quadrant} ${Styles.quadrant2}`}
            onClick={() => router.push("/community")}
          >
            <div className={Styles.quadrantText}>커뮤니티</div>
          </div>
          <div
            className={`${Styles.quadrant} ${Styles.quadrant3}`}
            onClick={() => router.push("/visualizer")}
          >
            <div className={Styles.quadrantText}>2D 비주얼라이저</div>
          </div>
          <div
            className={`${Styles.quadrant} ${Styles.quadrant4}`}
            onClick={() => router.push("/ThreeDvisualizer")}
          >
            <div className={Styles.quadrantText}>3D 비주얼라이저</div>
          </div>
        </>
      )}
    </div>
  );
}
