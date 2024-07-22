import { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import styles from "../styles/Search.module.css";

const spotifyApi = new SpotifyWebApi();

const Search = ({
  accessToken,
  onTrackSelect,
  onAddToQueue,
}: {
  accessToken: string;
  onTrackSelect: (trackId: string) => void;
  onAddToQueue: (track: any) => void;
}) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      spotifyApi.searchTracks(e.target.value).then((res) => {
        setSearchResults(res.tracks.items);
      });
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search for a track"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      <div className={styles.resultsContainer}>
        {searchResults.map((track) => (
          <div key={track.id} className={styles.trackItem}>
            <img
              src={track.album.images[0].url}
              alt={track.name}
              className={styles.trackImage}
            />
            <p>{track.name}</p>
            <button onClick={() => onTrackSelect(track.id)}>Play</button>
            <button onClick={() => onAddToQueue(track)}>Add to Queue</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
