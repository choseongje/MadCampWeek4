'use client';

import React from 'react';
import ThreeDVisualizer from '../../components/ThreeDVisualizer';
import styles from '../../styles/Home.module.css';

const ThreeDVisualizerPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>3D Visualizer</h1>
      <ThreeDVisualizer />
    </div>
  );
};

export default ThreeDVisualizerPage;
