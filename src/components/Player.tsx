import { useEffect, useState, useRef } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import Search from "./Search";
import Playlist from "./Playlist";
import styles from "../styles/Player.module.css";

const spotifyApi = new SpotifyWebApi();

const Player = ({ accessToken }: { accessToken: string }) => {
  const [trackId, setTrackId] = useState<string>("");
  const [currentTrackId, setCurrentTrackId] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [albumImage, setAlbumImage] = useState<string>("");
  const [trackName, setTrackName] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lyrics, setLyrics] = useState<string>("");
  const [translatedLyrics, setTranslatedLyrics] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "lyrics" | "translatedLyrics" | "queue" | "playlist"
  >("lyrics");
  const [queue, setQueue] = useState<any[]>([]);
  
  const previousTrackId = useRef<string>("");

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      console.log("Access token set:", accessToken);

      if (!window.onSpotifyWebPlaybackSDKReady) {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
          if (!player) {
            const newPlayer = new Spotify.Player({
              name: "Web Playback SDK",
              getOAuthToken: (cb) => {
                cb(accessToken);
              },
              volume: 0.5,
            });

            newPlayer.addListener("ready", ({ device_id }) => {
              console.log("Ready with Device ID", device_id);
              setDeviceId(device_id);
            });

            newPlayer.addListener("not_ready", ({ device_id }) => {
              console.log("Device ID has gone offline", device_id);
            });

            newPlayer.addListener("initialization_error", ({ message }) => {
              console.error("Failed to initialize", message);
            });

            newPlayer.addListener("authentication_error", ({ message }) => {
              console.error("Failed to authenticate", message);
            });

            newPlayer.addListener("account_error", ({ message }) => {
              console.error("Failed to validate Spotify account", message);
            });

            newPlayer.addListener("playback_error", ({ message }) => {
              console.error("Failed to perform playback", message);
            });

            newPlayer.addListener("player_state_changed", (state) => {
              if (!state) {
                return;
              }

              setIsPlaying(!state.paused);
              setDuration(state.duration);
              setProgress(state.position);

              const currentTrack = state.track_window.current_track;
              if (currentTrack && currentTrack.id !== previousTrackId.current) {
                console.log("Current track info:", currentTrack);
                setAlbumImage(currentTrack.album.images[0].url);
                setTrackName(currentTrack.name);
                setArtistName(
                  currentTrack.artists.map((artist: any) => artist.name).join(", ")
                );
                setCurrentTrackId(currentTrack.id);
                previousTrackId.current = currentTrack.id;
              }
            });

            newPlayer.connect();
            setPlayer(newPlayer);
          }
        };
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && trackId && deviceId) {
      handlePlay();
    }
  }, [trackId, deviceId, accessToken]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && player) {
      interval = setInterval(() => {
        player.getCurrentState().then((state) => {
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

  useEffect(() => {
    if (currentTrackId) {
      fetchLyrics(trackName, artistName, "ko"); // 번역할 언어 설정
    }
  }, [currentTrackId]);

  const handlePlay = () => {
    if (accessToken && trackId && deviceId) {
      console.log("Playing track with ID:", trackId);
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
      console.log("Pausing track");
      player.pause().then(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleResume = () => {
    if (player) {
      console.log("Resuming track");
      player.resume().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleTrackSelect = (selectedTrackId: string) => {
    console.log("Selected track ID:", selectedTrackId);
    setTrackId(selectedTrackId);
  };

  const handleAddToQueue = (track: any) => {
    setQueue((prevQueue) => [...prevQueue, track]);
  };

  const handleQueueTrackPlay = (trackId: string) => {
    setTrackId(trackId);
  };

  const handleRemoveFromQueue = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index));
  };

  const toggleFullscreen = () => {
    console.log("Toggling fullscreen mode");
    setIsFullscreen(!isFullscreen);
  };

  const fetchLyrics = async (
    trackName: string,
    artistName: string,
    targetLang: string
  ) => {
    console.log("Fetching lyrics for:", trackName, artistName);
    try {
      const response = await axios.get("http://172.10.7.88:80/lyrics", {
        params: {
          track: trackName,
          artist: artistName,
          targetLang,
        },
      });
      console.log("Lyrics response:", response.data);
      setLyrics(response.data.original || "가사를 찾을 수 없습니다.");
      setTranslatedLyrics(
        response.data.translated || "번역된 가사를 찾을 수 없습니다."
      );
    } catch (error) {
      console.error("Error fetching lyrics", error);
      setLyrics("가사를 찾을 수 없습니다.");
      setTranslatedLyrics("번역된 가사를 찾을 수 없습니다.");
    }
  };

  // 사용자 ID 가져오기
  const getUserId = async (accessToken: string): Promise<string> => {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.id;
  };

  // 플레이리스트 생성
  const createPlaylist = async (
    accessToken: string,
    userId: string,
    playlistName: string
  ): Promise<string> => {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        description: "Playlist created from queue",
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.id;
  };

  // 트랙들을 플레이리스트에 추가
  const addTracksToPlaylist = async (
    accessToken: string,
    playlistId: string,
    trackUris: string[]
  ): Promise<void> => {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  // 재생 대기 목록을 플레이리스트로 저장하는 함수
  const saveQueueAsPlaylist = async () => {
    if (!accessToken || queue.length === 0) return;

    try {
      const userId = await getUserId(accessToken);
      const playlistId = await createPlaylist(
        accessToken,
        userId,
        "New Playlist from Queue"
      );

      await addTracksToPlaylist(
        accessToken,
        playlistId,
        queue.map((track) => track.uri)
      );
      alert("플레이리스트가 성공적으로 생성되었습니다!");
    } catch (error) {
      console.error("플레이리스트 생성 중 오류가 발생했습니다:", error);
      console.error(
        "오류 내용:",
        error.response ? error.response.data : error.message
      );
      alert("플레이리스트 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.playerContainer}>
      <Search
        accessToken={accessToken}
        onTrackSelect={handleTrackSelect}
        onAddToQueue={handleAddToQueue}
      />
      <div
        className={`${styles.playbackBar} ${
          isFullscreen ? styles.fullscreen : ""
        }`}
      >
        <div className={styles.controls}>
          {trackId ? (
            <>
              <img
                src={albumImage}
                alt="Album cover"
                className={styles.albumImage}
              />
              {isPlaying ? (
                <button onClick={handlePause}>Pause</button>
              ) : (
                <button onClick={handleResume}>Play</button>
              )}
              <div className={styles.progress}>
                <span>
                  {formatTime(progress)} / {formatTime(duration)}
                </span>
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
          <button
            onClick={toggleFullscreen}
            className={styles.fullscreenToggle}
          >
            {isFullscreen ? "▼" : "▲"}
          </button>
        </div>
        {isFullscreen && (
          <div className={styles.fullscreenContent}>
            <div className={styles.leftContent}>
              <img
                src={albumImage}
                alt="Album cover"
                className={styles.fullscreenAlbumImage}
              />
              <h2>{trackName}</h2>
              <h3>{artistName}</h3>
              <div className={styles.fullscreenProgress}>
                <span>
                  {formatTime(progress)} / {formatTime(duration)}
                </span>
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
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${
                    activeTab === "lyrics" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("lyrics")}
                >
                  가사
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "translatedLyrics" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("translatedLyrics")}
                >
                  번역된 가사
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "queue" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("queue")}
                >
                  재생 대기 목록
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "playlist" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("playlist")}
                >
                  플레이리스트
                </button>
              </div>
              <div className={styles.scrollableContent}>
                {activeTab === "lyrics" && (
                  <pre className={styles.lyrics}>{lyrics}</pre>
                )}
                {activeTab === "translatedLyrics" && (
                  <pre className={styles.lyrics}>{translatedLyrics}</pre>
                )}
                {activeTab === "queue" && (
                  <div className={styles.queue}>
                    {queue.length > 0 ? (
                      queue.map((track, index) => (
                        <div
                          key={index}
                          className={styles.queueItem}
                          onClick={() => handleQueueTrackPlay(track.id)}
                        >
                          <img
                            src={track.album.images[0].url}
                            alt="Album cover"
                            className={styles.queueAlbumImage}
                          />
                          <div className={styles.queueDetails}>
                            <p className={styles.queueTrackName}>
                              {track.name}
                            </p>
                            <p className={styles.queueArtistName}>
                              {track.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleRemoveFromQueue(index, e)}
                            className={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>재생 대기 목록이 비어 있습니다.</p>
                    )}
                  </div>
                )}
                {activeTab === "playlist" && (
                  <div className={styles.playlistTab}>
                    <Playlist accessToken={accessToken} onSetQueue={setQueue} />
                    <button
                      className={styles.saveButton}
                      onClick={saveQueueAsPlaylist}
                    >
                      재생 대기 목록을 플레이리스트로 저장
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
