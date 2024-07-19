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
  const [albumImage, setAlbumImage] = useState<string>("");
  const [trackName, setTrackName] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      const onSpotifyWebPlaybackSDKReady = () => {
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

          const currentTrack = state.track_window.current_track;
          if (currentTrack && currentTrack.album && currentTrack.album.images.length > 0) {
            setAlbumImage(currentTrack.album.images[0].url);
            setTrackName(currentTrack.name);
            setArtistName(currentTrack.artists.map((artist: any) => artist.name).join(", "));
          }

          player.getCurrentState().then(state => { 
            if (!state) {
              console.error('User is not playing music through the Web Playback SDK');
            }
          });
        });

        player.connect();
        setPlayer(player);
      };

      window.onSpotifyWebPlaybackSDKReady = onSpotifyWebPlaybackSDKReady;

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && trackId && deviceId) {
      handlePlay();
    }
  }, [trackId, deviceId, accessToken]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        player.getCurrentState().then(state => {
          if (!state) return;
          setProgress(state.position);
          setDuration(state.duration);
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, player]);

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={styles.playerContainer}>
      <Search accessToken={accessToken} onTrackSelect={handleTrackSelect} />
      <div className={`${styles.playbackBar} ${isFullscreen ? styles.fullscreen : ''}`}>
        <div className={styles.controls}>
          {trackId ? (
            <>
              <img src={albumImage} alt="Album cover" className={styles.albumImage} />
              {isPlaying ? (
                <button onClick={handlePause}>Pause</button>
              ) : (
                <button onClick={handleResume}>Play</button>
              )}
              <div className={styles.progress}>
                <span>{formatTime(progress)} / {formatTime(duration)}</span>
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
          <button onClick={toggleFullscreen} className={styles.fullscreenToggle}>
            ▲
          </button>
        </div>
        {isFullscreen && (
          <div className={styles.fullscreenContent}>
            <div className={styles.leftContent}>
              <img src={albumImage} alt="Album cover" className={styles.fullscreenAlbumImage} />
              <h2>{trackName}</h2>
              <h3>{artistName}</h3>
              <div className={styles.fullscreenProgress}>
                <span>{formatTime(progress)} / {formatTime(duration)}</span>
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
            </div>
            <div className={styles.rightContent}>
              {/* 가사 표시 부분 */}
              <h2>가사</h2>
              <p>가사 내용이 여기에 표시됩니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
