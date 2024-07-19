import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Visualizer.module.css";

const Visualizer = ({ audioFile }: { audioFile: File }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequencyScale, setFrequencyScale] = useState<number[]>([]);

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

    setFrequencyScale(frequencyScale);

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

            // 주파수 대역에 따라 색상 변경 (예: 저주파수, 중주파수, 고주파수)
            if (i < bufferLength / 3) {
              ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`; // 저주파수
            } else if (i < (2 * bufferLength) / 3) {
              ctx.fillStyle = `rgb(50, ${barHeight + 100}, 50)`; // 중주파수
            } else {
              ctx.fillStyle = `rgb(50, 50, ${barHeight + 100})`; // 고주파수
            }

            ctx.fillRect(
              x,
              canvas.height - barHeight / 2,
              barWidth,
              barHeight / 2
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
      <div>
        {frequencyScale.map((freq, index) => (
          <div key={index}>
            Bin {index}: {freq.toFixed(2)} Hz
          </div>
        ))}
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
