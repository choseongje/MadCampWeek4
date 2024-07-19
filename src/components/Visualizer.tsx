import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Visualizer.module.css";

const Visualizer = ({ audioFile }: { audioFile: File }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    const audioElement = new Audio(URL.createObjectURL(audioFile));
    audioRef.current = audioElement;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    sourceRef.current = source;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      const drawVisualizer = () => {
        requestAnimationFrame(drawVisualizer);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
          ctx.fillRect(
            x,
            canvas.height - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }
      };

      drawVisualizer();
    }

    audioElement.play();
    setIsPlaying(true);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={styles.visualizerContainer}>
      <div className={styles.controls}>
        <button className={styles.button} onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width="600"
        height="300"
      />
    </div>
  );
};

export default Visualizer;
