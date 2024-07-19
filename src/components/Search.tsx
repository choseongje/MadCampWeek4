// src/components/Search.tsx

import { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

interface SearchProps {
  accessToken: string;
  onTrackSelect: (trackId: string) => void;
}

const Search = ({ accessToken, onTrackSelect }: SearchProps) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.searchTracks(query).then(
      (data) => {
        setResults(data.tracks.items);
      },
      (err) => {
        console.error("Error searching tracks", err);
      }
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map((track) => (
          <div key={track.id}>
            <img src={track.album.images[0]?.url} alt={track.name} width="50" />
            <div>{track.name}</div>
            <div>{track.artists[0].name}</div>
            <button onClick={() => onTrackSelect(track.id)}>Play</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
