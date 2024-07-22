import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Playlist.module.css";

const Playlist = ({
  accessToken,
  onSetQueue,
}: {
  accessToken: string;
  onSetQueue: any;
}) => {
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPlaylists(response.data.items);
      } catch (error) {
        console.error("Error fetching playlists", error);
      }
    };

    if (accessToken) {
      fetchPlaylists();
    }
  }, [accessToken]);

  const handlePlayPlaylist = async (playlistId: string) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onSetQueue(response.data.items.map((item: any) => item.track));
    } catch (error) {
      console.error("Error fetching playlist tracks", error);
    }
  };

  return (
    <div className={styles.playlistContainer}>
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={styles.playlistItem}
            onClick={() => handlePlayPlaylist(playlist.id)}
          >
            <img
              src={playlist.images[0]?.url || ""}
              alt={playlist.name}
              className={styles.playlistImage}
            />
            <div className={styles.playlistDetails}>
              <p className={styles.playlistName}>{playlist.name}</p>
              <p className={styles.playlistTracks}>
                {playlist.tracks.total} tracks
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default Playlist;
