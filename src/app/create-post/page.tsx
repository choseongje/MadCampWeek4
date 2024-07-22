"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableBox from "../../components/DraggableBox";
import ColorPicker from "../../components/ColorPicker";
import SearchTrack from "../../components/SearchTrack";
import styles from "../../styles/CreatePost.module.css";
import 'react-resizable/css/styles.css'; // 리사이즈 핸들 스타일 포함

interface Box {
  id: number;
  left: number;
  top: number;
  width: number; // 필수 항목으로 수정
  height: number; // 필수 항목으로 수정
  color?: string;
  text?: string;
  track?: {
    albumImage: string;
    artistName: string;
    trackName: string;
  };
}

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Box[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [backgroundDescription, setBackgroundDescription] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("spotify_access_token");
      console.log("Access Token:", token);
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (boardRef.current) {
      const { offsetWidth, offsetHeight } = boardRef.current;
      setBoardSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    const post = { title, content, backgroundImage };

    console.log("Submitting post:", post); // 디버그 용도로 추가

    fetch("http://172.10.7.88:80/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((response) => response.json())
      .then((data) => {
        router.push("/community");
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  const addBox = () => {
    const newBox = {
      id: Date.now(),
      left: 50,
      top: 50,
      width: 200,
      height: 200,
      color: "lightblue",
      text: "새 글 상자",
    };
    setContent((prevContent) => [...prevContent, newBox]);
    setSelectedBox(newBox.id);
  };

  const moveBox = (id: number, left: number, top: number) => {
    setContent((prevContent) =>
      prevContent.map((box) =>
        box.id === id ? { ...box, left, top } : box
      )
    );
  };

  const resizeBox = (id: number, width: number, height: number) => {
    console.log(`Resizing box ${id} to width ${width} and height ${height}`); // 디버그 메시지 추가
    setContent((prevContent) =>
      prevContent.map((box) =>
        box.id === id ? { ...box, width, height } : box
      )
    );
  };

  const changeColor = (color: string) => {
    if (selectedBox !== null) {
      setContent((prevContent) =>
        prevContent.map((box) =>
          box.id === selectedBox ? { ...box, color } : box
        )
      );
    }
  };

  const handleTrackSelect = (track) => {
    const newBox = {
      id: Date.now(),
      left: 50,
      top: 50,
      width: 200,
      height: 200,
      color: "lightblue",
      track: {
        albumImage: track.album.images[0].url,
        artistName: track.artists[0].name,
        trackName: track.name,
      },
    };
    setContent((prevContent) => [...prevContent, newBox]);
    setSelectedBox(newBox.id);
  };

  const handleTextChange = (id: number, text: string) => {
    setContent((prevContent) =>
      prevContent.map((box) =>
        box.id === id ? { ...box, text } : box
      )
    );
  };

  const generateBackground = () => {
    fetch("http://172.10.7.88:80/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: backgroundDescription }),
    })
      .then((response) => response.json())
      .then((data) => {
        setBackgroundImage(data.imageUrl);
      })
      .catch((error) => console.error("Error generating image:", error));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1 className={styles.header}>게시물 작성</h1>
        <div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="title">제목</label>
            <input
              className={styles.input}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <button type="button" className={styles.button} onClick={addBox}>글 상자 추가</button>
          {selectedBox && <ColorPicker onChange={changeColor} />}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="backgroundDescription">배경 묘사</label>
            <input
              className={styles.input}
              type="text"
              id="backgroundDescription"
              value={backgroundDescription}
              onChange={(e) => setBackgroundDescription(e.target.value)}
            />
            <button type="button" className={styles.button} onClick={generateBackground}>배경 생성</button>
          </div>
          <div
            className={styles.board}
            ref={boardRef}
          >
            {content.map((box) => (
              <DraggableBox
                key={box.id}
                {...box}
                onMove={moveBox}
                onResize={resizeBox}
                onClick={() => setSelectedBox(box.id)}
                onTextChange={handleTextChange}
              />
            ))}
          </div>
          <button type="button" className={styles.submitButton} onClick={handleSubmit}>작성하기</button>
        </div>
        {accessToken ? (
          <SearchTrack accessToken={accessToken} onTrackSelect={handleTrackSelect} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </DndProvider>
  );
}
