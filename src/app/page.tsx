"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SpotifyWebApi from "spotify-web-api-js";
import Visualizer from "../components/Visualizer";
import styles from "../styles/Home.module.css";

const spotifyApi = new SpotifyWebApi();

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("access_token");

    if (token) {
      setAccessToken(token);
      spotifyApi.setAccessToken(token);

      // Remove the token from the URL after setting it
      const url = new URL(window.location.href);
      url.searchParams.delete("access_token");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    if (accessToken) {
      getDeviceId();
    }
  }, [accessToken]);

  const getDeviceId = () => {
    spotifyApi.getMyDevices().then(
      (data) => {
        const devices = data.devices;
        if (devices.length > 0) {
          setDeviceId(devices[0].id);
        } else {
          console.error("No devices found");
        }
      },
      (err) => {
        console.error("Error fetching devices", err);
      }
    );
  };

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const scopes = "user-read-playback-state user-modify-playback-state";
    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const handlePlay = () => {
    if (accessToken && trackId && deviceId) {
      spotifyApi
        .play({ device_id: deviceId, uris: [`spotify:track:${trackId}`] })
        .then(
          () => {
            console.log("Track is playing");
          },
          (err) => {
            console.error("Error playing track", err);
          }
        );
    } else {
      console.error("Missing access token, track ID, or device ID");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Spotify Visualizer</h1>
      {!accessToken ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter Spotify Track ID"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
          />
          <button onClick={handlePlay}>Play</button>
          <Visualizer />
        </>
      )}
    </div>
  );
};

export default Home;
