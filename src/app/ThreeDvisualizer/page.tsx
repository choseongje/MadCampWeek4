"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ThreeDVisualizer from "../../components/ThreeDVisualizer";
import styles from "../../styles/ThreeDVisualizerPage.module.css";
import Image from "next/image";
import Logo from "../../../public/YaOng4.png";

const ThreeDVisualizerPage: React.FC = () => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <Image
        src={Logo}
        alt="Logo"
        className={styles.logo}
        onClick={handleLogoClick}
        width={80} // 원하는 width 값 설정
        height={80} // 원하는 height 값 설정
      />
      <h1 className={styles.header}>3D Visualizer</h1>
      <ThreeDVisualizer />
    </div>
  );
};

export default ThreeDVisualizerPage;
