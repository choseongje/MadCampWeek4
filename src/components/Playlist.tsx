import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import styles from "../styles/Playlist.module.css";

const spotifyApi = new SpotifyWebApi();

const Playlist = ({
  accessToken,
  onSetQueue,
}: {
  accessToken: string;
  onSetQueue: (tracks: any[]) => void;
}) => {
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      fetchPlaylists();
    }
  }, [accessToken]);

  const fetchPlaylists = async () => {
    try {
      const response = await spotifyApi.getUserPlaylists();
      console.log("Playlists:", response);
      setPlaylists(response.items);
    } catch (error) {
      console.error("Error fetching playlists", error);
    }
  };

  const fetchPlaylistTracks = async (playlistId: string) => {
    try {
      const response = await spotifyApi.getPlaylistTracks(playlistId);
      return response.items.map((item: any) => item.track);
    } catch (error) {
      console.error("Error fetching playlist tracks", error);
      return [];
    }
  };

  const handlePlayPlaylist = async (playlistId: string) => {
    const tracks = await fetchPlaylistTracks(playlistId);
    onSetQueue(tracks);
  };

  return (
    <div className={styles.playlistContainer}>
      <h2>Your Playlists</h2>
      <div className={styles.playlists}>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={styles.playlistItem}
            onClick={() => handlePlayPlaylist(playlist.id)}
          >
            <img
              src={playlist.images[0]?.url}
              alt="Playlist cover"
              className={styles.playlistImage}
            />
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
