import React, { useEffect, useRef } from "react";
import styles from "../styles/Visualizer.module.css";

const BasicVisualizer = ({
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

    const sampleRate = audioContext.sampleRate;
    const nyquist = sampleRate / 2;

    // 로그 스케일 주파수 범위 계산
    const minFreq = 20; // 최소 주파수
    const maxFreq = nyquist; // 최대 주파수
    const frequencyScale = Array.from(
      { length: bufferLength },
      (_, i) => minFreq * Math.pow(maxFreq / minFreq, i / bufferLength)
    );

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

          const barWidth = canvas.width / bufferLength;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // 선명한 색상 팔레트 적용
            const red = barHeight + 25 * (i / bufferLength);
            const green = 250 * (i / bufferLength);
            const blue = 50;

            ctx.fillStyle = `rgb(${red},${green},${blue})`;
            ctx.fillRect(
              x,
              canvas.height - (barHeight / 255) * canvas.height,
              barWidth,
              (barHeight / 255) * canvas.height
            );

            x += barWidth;
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
        height="300"
      />
    </div>
  );
};

export default BasicVisualizer;
