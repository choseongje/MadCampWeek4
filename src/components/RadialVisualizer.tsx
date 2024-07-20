import React, { useEffect, useRef } from "react";
import styles from "../styles/Visualizer.module.css";

const RadialVisualizer = ({
  audioFile,
  isPlaying,
  onPlayPause,
}: {
  audioFile: File;
  isPlaying: boolean;
  onPlayPause: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

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
    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const drawVisualizer = () => {
          if (!audioContextRef.current) return;
          requestAnimationFrame(drawVisualizer);

          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 150;

          const startIdx = Math.floor(bufferLength * 0.05); // 맨 앞 5% 잘라냄
          const endIdx = Math.floor(bufferLength * 0.85); // 맨 뒤 15% 잘라냄
          const visualLength = endIdx - startIdx; // 시각화할 데이터 길이

          for (let i = startIdx; i < endIdx; i++) {
            const value = dataArray[i];
            const percent = value / 256;
            const height = canvas.height * percent;
            const offset = canvas.height - height - 1;

            const angle = ((i - startIdx) / visualLength) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * (radius + height);
            const y = centerY + Math.sin(angle) * (radius + height);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `rgb(${value}, 50, 50)`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        };

        drawVisualizer();
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioFile]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className={styles.visualizerContainer}>
      <div className={styles.controls}>
        <button className={styles.button} onClick={onPlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width="600"
        height="600"
      />
    </div>
  );
};

export default RadialVisualizer;
