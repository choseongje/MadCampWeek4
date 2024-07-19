import { useEffect, useRef } from "react";

const Visualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      const drawVisualizer = () => {
        if (!canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Example visualizer: drawing random rectangles
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            50,
            50
          );
        }

        requestAnimationFrame(drawVisualizer);
      };

      drawVisualizer();
    }
  }, []);

  return <canvas ref={canvasRef} id="visualizer" width="600" height="300" />;
};

export default Visualizer;
