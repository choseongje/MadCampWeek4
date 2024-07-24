'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from '../styles/ThreeDVisualizerPage.module.css';

const ThreeDVisualizer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const wavesRef = useRef<THREE.Mesh[]>([]);

  const THRESHOLD = 150; // 세기 역치
  const WAVE_DURATION = 5000; // 물결파 지속 시간 (밀리초)

  // 오디오 파일이 업로드되면 처리하는 함수
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const reader = new FileReader();

      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        context.decodeAudioData(arrayBuffer, (buffer) => {
          setBuffer(buffer);
          const audioSource = context.createBufferSource();
          audioSource.buffer = buffer;

          const analyserNode = context.createAnalyser();
          analyserNode.fftSize = 32768; // 큰 fftSize로 설정

          audioSource.connect(analyserNode);
          analyserNode.connect(context.destination);

          setAudioContext(context);
          setAnalyser(analyserNode);
          setSource(audioSource);
        });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // 오디오 재생 및 중지 토글 함수
  const togglePlayPause = () => {
    if (audioContext && buffer) {
      if (isPlaying) {
        if (source) {
          source.stop();
          setCurrentTime(audioContext.currentTime - currentTime);
        }
        setIsPlaying(false);
      } else {
        const newSource = audioContext.createBufferSource();
        newSource.buffer = buffer;
        newSource.connect(analyser);
        analyser.connect(audioContext.destination);
        newSource.start(0, currentTime);
        setSource(newSource);
        setIsPlaying(true);
      }
    }
  };

  // 오디오 컨텍스트와 분석기가 준비되면 3D 장면을 설정하고 애니메이션을 시작하는 useEffect
  useEffect(() => {
    if (audioContext && analyser) {
      const mount = mountRef.current;
      if (!mount) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      mount.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);

      // 카메라 초기 위치 설정
      camera.position.set(0, 150, 250);
      camera.lookAt(0, 0, 0);

      // 물결파 생성 함수
      const createWave = (height: number) => {
        const geometry = new THREE.CylinderGeometry(50, 50, height, 64, 1, true);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            color1: { value: new THREE.Color(0x0000ff) }, // 파란색
            color2: { value: new THREE.Color(0xffffff) }, // 흰색
          },
          vertexShader: `
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec3 vPosition;
            void main() {
              float height = (vPosition.y + 50.0) / 100.0;
              gl_FragColor = vec4(mix(color1, color2, height), 1.0);
            }
          `,
          side: THREE.DoubleSide,
          wireframe: false, // 와이어프레임 모드
        });
        const wave = new THREE.Mesh(geometry, material);
        wave.position.set(0, height / 2, 0); // 원기둥의 중심을 설정
        scene.add(wave);
        wavesRef.current.push(wave);

        // 일정 시간이 지나면 물결파 제거
        setTimeout(() => {
          scene.remove(wave);
          wave.geometry.dispose();
          (wave.material as THREE.Material).dispose();
          wavesRef.current = wavesRef.current.filter((w) => w !== wave);
        }, WAVE_DURATION);
      };

      // 애니메이션 함수
      const animate = () => {
        requestAnimationFrame(animate);

        if (analyser) {
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);

          // 60Hz에서 180Hz 범위 추출
          const sampleRate = audioContext.sampleRate;
          const lowerIndex = Math.floor(60 / (sampleRate / analyser.fftSize));
          const upperIndex = Math.ceil(180 / (sampleRate / analyser.fftSize));
          const frequencyData = dataArray.slice(lowerIndex, upperIndex);

          // 주파수 데이터의 평균 세기 계산
          const avgFrequency = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

          // 세기가 역치를 넘으면 새로운 물결파 생성
          if (avgFrequency > THRESHOLD) {
            const height = Math.pow(avgFrequency / 50, 2) * 5; // 주파수 데이터에 따라 높이를 더 극적으로 설정
            createWave(height);
          }

          // 물결파 확장
          wavesRef.current.forEach((wave) => {
            const scale = wave.scale.x + 0.05;
            wave.scale.set(scale, 1, scale); // X 및 Z축으로 확장
          });
        }

        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        // Clean up renderer and context
        renderer.dispose();
        mount.removeChild(renderer.domElement);
        
        // Stop the audio context and source if playing
        if (audioContext && audioContext.state !== 'closed') {
          audioContext.close();
        }
        if (source && isPlaying) {
          source.stop();
        }
      };
    }
  }, [audioContext, analyser]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.fileInputWrapper}>
          <label className={styles.fileInputButton}>
            {fileName || 'Choose File'}
            <input
              className={styles.fileInput}
              type="file"
              accept="audio/mp3"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <button className={styles.playButton} onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className={styles.visualizer} ref={mountRef} />
    </div>
  );
};

export default ThreeDVisualizer;
