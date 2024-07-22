"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BasicVisualizer from "../../components/BasicVisualizer";
import CircularVisualizer from "../../components/CircularVisualizer";
import WaveformVisualizer from "../../components/WaveformVisualizer";
import RadialVisualizer from "../../components/RadialVisualizer";
import Login from "../../components/Login";
import styles from "../../styles/Home.module.css";

export default function PlayerPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [visualizerType, setVisualizerType] = useState<
    "basic" | "circular" | "waveform" | "radial"
  >("basic");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudioFile(event.target.files[0]);
    }
  };

  const handleVisualizerChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setVisualizerType(
      event.target.value as "basic" | "circular" | "waveform" | "radial"
    );
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Spotify Visualizer</h1>
      <div>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <select
          onChange={handleVisualizerChange}
          value={visualizerType}
          className={styles.select}
        >
          <option value="basic">Basic Visualizer</option>
          <option value="circular">Circular Visualizer</option>
          <option value="waveform">Waveform Visualizer</option>
          <option value="radial">Radial Visualizer</option>
        </select>
        {audioFile && visualizerType === "basic" && (
          <BasicVisualizer
            audioFile={audioFile}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        )}
        {audioFile && visualizerType === "circular" && (
          <CircularVisualizer
            audioFile={audioFile}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        )}
        {audioFile && visualizerType === "waveform" && (
          <WaveformVisualizer
            audioFile={audioFile}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        )}
        {audioFile && visualizerType === "radial" && (
          <RadialVisualizer
            audioFile={audioFile}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        )}
      </div>
    </div>
  );
}
