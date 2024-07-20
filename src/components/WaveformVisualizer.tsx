import React, { useEffect, useRef } from "react";
import styles from "../styles/Visualizer.module.css";

const WaveformVisualizer = ({
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
    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;
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

          analyser.getByteTimeDomainData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgb(0, 255, 0)";

          ctx.beginPath();

          const sliceWidth = (canvas.width * 1.0) / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
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

export default WaveformVisualizer;
