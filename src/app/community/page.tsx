"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Community.module.css";
import Image from "next/image";
import Logo from "../../../public/YaOng4.png";

interface Post {
  id: number;
  title: string;
  content: Box[];
}

interface Box {
  id: number;
  left: number;
  top: number;
  color: string;
  text: string;
  track?: {
    albumImage: string;
    artistName: string;
    trackName: string;
  };
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://172.10.7.88:80/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handlePostClick = (
    event: React.MouseEvent<HTMLDivElement>,
    id: number
  ) => {
    const element = event.currentTarget as HTMLDivElement;
    const rect = element.getBoundingClientRect();
    const { top, left, width, height } = rect;

    // Create a clone of the element
    const clone = element.cloneNode(true) as HTMLDivElement;

    // Set the clone's position and dimensions to match the original element
    clone.style.position = "absolute";
    clone.style.top = `${
      top - element.parentElement!.getBoundingClientRect().top
    }px`;
    clone.style.left = `${
      left - element.parentElement!.getBoundingClientRect().left
    }px`;
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    clone.style.margin = "0";
    clone.style.zIndex = "1000";

    // Add the clone to the parent element
    element.parentElement!.appendChild(clone);

    // Apply the animation class to the clone
    clone.classList.add(styles["fall-away"]);

    // Make the original element transparent
    element.classList.add(styles["transparent"]);

    clone.addEventListener("animationend", () => {
      clone.remove();
      router.push(`/community/${id}`);
    });
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <Image
        src={Logo}
        alt="Logo"
        className={styles.logo}
        onClick={handleLogoClick}
        width={80} // 원하는 width 값 설정
        height={80} // 원하는 height 값 설정
      />
      <h1 className={styles.header}>커뮤니티</h1>
      <button
        className={styles.button}
        onClick={() => router.push("/create-post")}
      >
        +
      </button>
      <div className={styles.posts}>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.post}
            onClick={(event) => handlePostClick(event, post.id)}
          >
            <h2 className={styles.postTitle}>{post.title}</h2>
            <div className={styles.postContent}>
              {post.content
                .filter((box) => box.track)
                .map((box) => (
                  <div
                    key={box.id}
                    className={styles.box}
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                  >
                    {box.track && (
                      <div className={styles.trackInfo}>
                        <img
                          src={box.track.albumImage}
                          alt="Album Cover"
                          className={styles.albumCover}
                        />
                        <div>
                          <p className={styles.trackName}>
                            {box.track.trackName}
                          </p>
                          <p className={styles.artistName}>
                            {box.track.artistName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
