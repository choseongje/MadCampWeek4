import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import styles from "../styles/Login.module.css";

const spotifyApi = new SpotifyWebApi();

const Login = () => {
  const router = useRouter();

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const scopes =
      "playlist-read-private playlist-modify-private playlist-modify-public streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(redirectUri ?? "")}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_token_expires_in");
    router.push("/");
    window.location.reload();
  };

  const fetchUserProfile = async (accessToken: string) => {
    spotifyApi.setAccessToken(accessToken);
    try {
      const response = await spotifyApi.getMe();
      const { id, email, display_name, country, followers, images, product } =
        response;
      const profileImageUrl =
        images && images.length > 0 ? images[0].url : null;
      await axios.post("http://172.10.7.88:80/saveUser", {
        id,
        email,
        display_name,
        country,
        followers: followers?.total ?? 0,
        profile_image_url: profileImageUrl,
        product,
      });
      console.log("User profile saved:", response);
      router.push("/");
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const checkTokenExpiry = () => {
    const expiresIn = localStorage.getItem("spotify_token_expires_in");
    if (!expiresIn) return false;
    return new Date().getTime() < Number(expiresIn);
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

    if (hash.access_token && hash.expires_in) {
      const expiresIn = new Date().getTime() + Number(hash.expires_in) * 1000;
      localStorage.setItem("spotify_access_token", hash.access_token);
      localStorage.setItem("spotify_token_expires_in", expiresIn.toString());
      fetchUserProfile(hash.access_token);
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      if (storedToken && checkTokenExpiry()) {
        fetchUserProfile(storedToken);
      } else {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expires_in");
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Please login to continue</h2>
      <button className={styles.button} onClick={handleLogin}>
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
