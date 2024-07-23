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

  const handlePostClick = (id: number) => {
    router.push(`/community/${id}`);
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
        게시물 작성하기
      </button>
      <div className={styles.posts}>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.post}
            onClick={() => handlePostClick(post.id)}
          >
            <h2 className={styles.postTitle}>{post.title}</h2>
            <div className={styles.postContent}>
              {post.content
                .filter((box) => box.track)
                .map((box) => (
                  <div
                    key={box.id}
                    className={styles.box}
                    style={{ backgroundColor: box.color }}
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
