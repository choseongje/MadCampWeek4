import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import styles from "../styles/Playlist.module.css";

const spotifyApi = new SpotifyWebApi();

const Playlist = ({ accessToken, onSetQueue }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getUserPlaylists().then(
        (data) => {
          setPlaylists(data.items);
        },
        (err) => {
          console.error("Error fetching playlists", err);
        }
      );
    }
  }, [accessToken]);

  const handlePlayPlaylist = (playlistId) => {
    spotifyApi.getPlaylistTracks(playlistId).then(
      (data) => {
        const tracks = data.items.map((item) => item.track);
        onSetQueue(tracks);
      },
      (err) => {
        console.error("Error fetching playlist tracks", err);
      }
    );
  };

  return (
    <div className={styles.playlistContainer}>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className={styles.playlistItem}
          onClick={() => handlePlayPlaylist(playlist.id)}
        >
          <img src={playlist.images[0]?.url} alt={playlist.name} />
          <p className={styles.playlistName}>{playlist.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Playlist;
