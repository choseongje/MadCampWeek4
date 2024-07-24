"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const Callback = () => {
  const router = useRouter();

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
      router.replace(`/?access_token=${hash.access_token}`);
    } else {
      router.replace("/");
    }
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;
