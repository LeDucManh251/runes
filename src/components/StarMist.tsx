import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

/**
 * Nền hạt sáng trôi nhẹ, chỉ dùng trong tab Tiên đoán. Tự dừng vòng lặp vẽ khi
 * tab trình duyệt bị ẩn (document.hidden) hoặc khi component unmount, để không
 * tốn CPU/pin trên các thiết bị yếu khi người dùng không nhìn vào nó.
 */
function StarMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrameId = 0;
    let isRunning = true;

    const resize = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };

    const createParticles = () => {
      particles = Array.from({ length: 26 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        vy: 0.08 + Math.random() * 0.18,
        vx: (Math.random() - 0.5) * 0.08,
        a: 0.15 + Math.random() * 0.5
      }));
    };

    const draw = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(136, 192, 208, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      draw();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

export default StarMist;
