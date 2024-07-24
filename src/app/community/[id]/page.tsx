"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableBox from "../../../components/DraggableBox";
import styles from "../../../styles/PostDetail.module.css";

interface Box {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  color?: string;
  text?: string;
  track?: {
    albumImage: string;
    artistName: string;
    trackName: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: Box[];
  backgroundImage: string | null;
}

const PostDetail: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      fetch(`http://172.10.7.88:80/posts/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data))
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const backgroundStyle = post.backgroundImage
    ? { backgroundImage: `url(${post.backgroundImage})` }
    : { backgroundColor: '#fffacd' }; // 기본 배경 설정

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container} style={backgroundStyle}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.board}>
          {post.content.map((box) => (
            <DraggableBox
              key={box.id}
              {...box}
              onMove={() => {}}
              onResize={() => {}}
              onClick={() => {}}
              onTextChange={() => {}}
              isDraggable={false} // 드래그 불가
              isResizable={false} // 리사이즈 불가
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default PostDetail;
