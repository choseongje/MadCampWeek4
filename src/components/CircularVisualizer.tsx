import React, { useEffect, useRef } from "react";
import styles from "../styles/Visualizer.module.css";

const CircularVisualizer = ({
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

          // 배경색 설정
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#000000"; // 검정색 배경
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const radius = Math.min(canvas.width, canvas.height) / 4;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          const startIdx = Math.floor(bufferLength * 0.05); // 맨 앞 5% 잘라냄
          const endIdx = Math.floor(bufferLength * 0.85); // 맨 뒤 15% 잘라냄
          const visualLength = endIdx - startIdx; // 시각화할 데이터 길이

          for (let i = startIdx; i < endIdx; i++) {
            const angle = ((i - startIdx) / visualLength) * Math.PI * 2;
            const barHeight = dataArray[i] / 2;

            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);

            const red =
              (barHeight + 25 * ((i - startIdx) / visualLength)) % 256;
            const green = (250 * ((i - startIdx) / visualLength)) % 256;
            const blue = 50;

            ctx.strokeStyle = `rgb(${red},${green},${blue})`;
            ctx.lineWidth = 8; // 막대의 두께
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
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

export default CircularVisualizer;
