"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface WarpBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
  starCount?: number;
}

export const WarpBackground = ({
  children,
  className = "",
  speed = 4,
  starCount = 300,
}: WarpBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars: { x: number; y: number; z: number; rx: number; ry: number }[] = [];

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w - w / 2,
        y: Math.random() * h - h / 2,
        z: Math.random() * w,
        rx: 0,
        ry: 0,
      });
    }

    let animationFrameId: number;
    let cx = w / 2;
    let cy = h / 2;

    const render = () => {
      // Create trailing effect by filling with low opacity
      ctx.fillStyle =
        resolvedTheme === "light"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < starCount; i++) {
        const star = stars[i];

        star.z -= speed;

        if (star.z <= 0) {
          star.x = Math.random() * w - w / 2;
          star.y = Math.random() * h - h / 2;
          star.z = w;
        }

        const x = (star.x / star.z) * w + cx;
        const y = (star.y / star.z) * w + cy;

        // Size gets larger as it gets closer
        const size = (1 - star.z / w) * 3;
        const opacity = 1 - star.z / w;

        // Determine color based on theme
        const color = resolvedTheme === "light" ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, Math.max(0.1, size), 0, Math.PI * 2);
        ctx.fill();

        // Draw trail lines
        if (star.rx !== 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(star.rx, star.ry);
          ctx.strokeStyle = resolvedTheme === "light" ? `rgba(0, 0, 0, ${opacity * 0.5})` : `rgba(255, 255, 255, ${opacity * 0.5})`;
          ctx.lineWidth = Math.max(0.1, size * 0.5);
          ctx.stroke();
        }

        star.rx = x;
        star.ry = y;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w / 2;
      cy = h / 2;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [resolvedTheme, speed, starCount]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-60 pointer-events-none"
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
