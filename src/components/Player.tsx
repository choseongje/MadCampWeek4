// src/components/Player.tsx

import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Search from "./Search";
import styles from "../styles/Player.module.css"; // 스타일 파일 임포트

const spotifyApi = new SpotifyWebApi();

const Player = ({ accessToken }: { accessToken: string }) => {
  const [trackId, setTrackId] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

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

        player.addListener('player_state_changed', (state) => {
          if (!state) {
            return;
          }

          setIsPlaying(!state.paused);
          setDuration(state.duration);
          setProgress(state.position);

          player.getCurrentState().then(state => { 
            if (!state) {
              console.error('User is not playing music through the Web Playback SDK');
            }
          });
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
              setIsPlaying(true);
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

  const handlePause = () => {
    if (player) {
      player.pause().then(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleResume = () => {
    if (player) {
      player.resume().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleTrackSelect = (selectedTrackId: string) => {
    setTrackId(selectedTrackId);
  };

  return (
    <div className={styles.playerContainer}>
      <Search accessToken={accessToken} onTrackSelect={handleTrackSelect} />
      <div className={`${styles.playbackBar} ${isPlaying ? styles.show : ''}`}>
        <div className={styles.controls}>
          {trackId ? (
            <>
              {isPlaying ? (
                <button onClick={handlePause}>Pause</button>
              ) : (
                <button onClick={handleResume}>Play</button>
              )}
              <div className={styles.progress}>
                <span>{Math.floor(progress / 1000)} / {Math.floor(duration / 1000)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={progress}
                  onChange={(e) => {
                    const newProgress = Number(e.target.value);
                    setProgress(newProgress);
                    player.seek(newProgress);
                  }}
                />
              </div>
            </>
          ) : (
            <div>정보가 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
