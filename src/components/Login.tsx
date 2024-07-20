import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";

const spotifyApi = new SpotifyWebApi();

const Login = () => {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const scopes =
      "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";
    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const fetchUserProfile = async (accessToken: string) => {
    spotifyApi.setAccessToken(accessToken);
    try {
      const response = await spotifyApi.getMe();
      const { id, email, display_name, country, followers, images, product } = response;
      const profileImageUrl = images && images.length > 0 ? images[0].url : null;
      await axios.post('http://172.10.7.88:80/saveUser', { 
        id, 
        email, 
        display_name, 
        country, 
        followers: followers.total, 
        profile_image_url: profileImageUrl, 
        product 
      });
      console.log("User profile saved:", response);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((acc, item) => {
        if (item) {
          const parts = item.split("=");
          acc[parts[0]] = decodeURIComponent(parts[1]);
        }
        return acc;
      }, {} as Record<string, string>);

    if (hash.access_token) {
      fetchUserProfile(hash.access_token);
    }
  }, []);

  return (
    <div>
      <h2>Please login to continue</h2>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;
