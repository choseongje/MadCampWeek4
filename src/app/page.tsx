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
  const [player, setPlayer] = useState<any>(null);

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
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("initialization_error", ({ message }) => {
          console.error("Failed to initialize", message);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error("Failed to authenticate", message);
        });

        player.addListener("account_error", ({ message }) => {
          console.error("Failed to validate Spotify account", message);
        });

        player.addListener("playback_error", ({ message }) => {
          console.error("Failed to perform playback", message);
        });

        player.connect();
        setPlayer(player);
      };
    }
  }, [accessToken]);

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const scopes =
      "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";
    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const handlePlay = () => {
    if (accessToken && trackId && deviceId) {
      spotifyApi.transferMyPlayback([deviceId]).then(() => {
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
      });
    } else {
      console.error("Missing access token, track ID, or player");
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
