// src/components/Player.tsx

import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Search from "./Search";

const spotifyApi = new SpotifyWebApi();

const Player = ({ accessToken }: { accessToken: string }) => {
  const [trackId, setTrackId] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);

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

  useEffect(() => {
    if (accessToken && trackId && deviceId) {
      handlePlay();
    }
  }, [trackId, deviceId, accessToken]);

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

  const handleTrackSelect = (selectedTrackId: string) => {
    setTrackId(selectedTrackId);
  };

  return (
    <div>
      <Search accessToken={accessToken} onTrackSelect={handleTrackSelect} />
      <div>
        <input
          type="text"
          placeholder="Enter Spotify Track ID"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
        />
        <button onClick={handlePlay}>Play</button>
      </div>
    </div>
  );
};

export default Player;
