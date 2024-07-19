// src/components/Login.tsx

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
  
    return <button onClick={handleLogin}>Login with Spotify</button>;
  };
  
  export default Login;
  