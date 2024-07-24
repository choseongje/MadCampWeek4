declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady?: () => void; // 선택적 속성으로 변경
  }
}
