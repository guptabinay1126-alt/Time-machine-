import { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  speedFactor?: number; // 1 for normal, >1 for quantum jump/wormhole warp
  mode?: "idle" | "vortex";
}

export default function ParticleBackground({ speedFactor = 1, mode = "idle" }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize particles
    const particleCount = mode === "vortex" ? 220 : 120;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      color: string;
      angle?: number;
      distance?: number;
      spinSpeed?: number;
    }> = [];

    const colors = [
      "rgba(59, 130, 246,",  // Neon Blue
      "rgba(139, 92, 246,",  // Purple
      "rgba(236, 72, 153,",  // Pink
      "rgba(6, 182, 212,"    // Cyan
    ];

    const createParticle = (initRandom = true) => {
      const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      if (mode === "vortex") {
        // Vortex particles orbit a central attractor
        const maxDist = Math.max(width, height) * 0.8;
        return {
          x: width / 2,
          y: height / 2,
          size: Math.random() * 2 + 1,
          speedX: 0,
          speedY: 0,
          alpha: Math.random() * 0.8 + 0.2,
          color: colorPrefix,
          angle: Math.random() * Math.PI * 2,
          distance: initRandom ? Math.random() * maxDist : maxDist,
          spinSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
        };
      } else {
        // Linear drifting stars
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.5,
          speedX: (Math.random() * 0.6 - 0.3) * speedFactor,
          speedY: (Math.random() * 0.4 + 0.1) * speedFactor,
          alpha: Math.random() * 0.7 + 0.1,
          color: colorPrefix
        };
      }
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Draw frame
    const draw = () => {
      // Create a fading tail trail for speed visual effects during vortex jumps
      if (mode === "vortex") {
        ctx.fillStyle = "rgba(10, 10, 18, 0.2)"; // Trailing black
      } else {
        ctx.fillStyle = "rgba(5, 5, 10, 0.15)";
      }
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mode === "vortex") {
          // Orbit update
          if (p.angle !== undefined && p.distance !== undefined && p.spinSpeed !== undefined) {
            p.angle += p.spinSpeed * speedFactor;
            // Draw particles closer to center to represent gravitational pull
            p.distance -= 1.8 * speedFactor;

            p.x = centerX + Math.cos(p.angle) * p.distance;
            p.y = centerY + Math.sin(p.angle) * p.distance;

            // Fade in as they travel, then disappear when very close to center
            if (p.distance < 10) {
              Object.assign(p, createParticle(false));
              p.distance = Math.max(width, height) * (0.4 + Math.random() * 0.4);
            }
          }
        } else {
          // Linear update
          p.x += p.speedX * speedFactor;
          p.y += p.speedY * speedFactor;

          if (p.y > height || p.x < 0 || p.x > width) {
            Object.assign(p, createParticle(false));
            p.y = 0;
            p.x = Math.random() * width;
          }
        }

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Subtly pulsate star light
        p.alpha += (Math.random() * 0.1 - 0.05);
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.9) p.alpha = 0.9;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [speedFactor, mode]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" id="particle-canvas" />;
}
