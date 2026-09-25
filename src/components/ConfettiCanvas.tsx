import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ConfettiRef {
  fire: () => void;
}

export const ConfettiCanvas = forwardRef<ConfettiRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotSpeed: number;
    opacity: number;
    shape: 'rect' | 'circle' | 'heart';
  }>>([]);
  const animIdRef = useRef<number | null>(null);

  const colors = [
    '#e11d48', // rose red
    '#b91c1c', // deep red
    '#fda4af', // soft pink
    '#f43f5e', // vivid pink
    '#fbbf24', // celebratory gold
    '#ffffff', // white
    '#f472b6', // carnation pink
  ];

  const triggerConfetti = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    // Spawn 140 particles
    const newParticles = [];
    for (let i = 0; i < 150; i++) {
      const shapeType: 'rect' | 'circle' | 'heart' = i % 3 === 0 ? 'heart' : i % 2 === 0 ? 'rect' : 'circle';
      newParticles.push({
        x: w / 2 + (Math.random() - 0.5) * 200,
        y: h / 2 - 100 + (Math.random() - 0.5) * 100,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 18,
        speedY: (Math.random() - 0.7) * 18,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: shapeType
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];

    if (!animIdRef.current) {
      animate();
    }
  };

  useImperativeHandle(ref, () => ({
    fire: triggerConfetti
  }));

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    const d = size / 2;
    ctx.moveTo(0, d / 4);
    ctx.bezierCurveTo(d / 2, -d / 2, d, 0, 0, d);
    ctx.bezierCurveTo(-d, 0, -d / 2, -d / 2, 0, d / 4);
    ctx.fill();
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const activeParticles = [];

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.35; // gravity
      p.speedX *= 0.98; // drag
      p.rotation += p.rotSpeed;
      p.opacity -= 0.007;

      if (p.opacity > 0 && p.y < canvas.height + 50) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);

        if (p.shape === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
        activeParticles.push(p);
      }
    }

    particlesRef.current = activeParticles;

    if (particlesRef.current.length > 0) {
      animIdRef.current = requestAnimationFrame(animate);
    } else {
      animIdRef.current = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

ConfettiCanvas.displayName = 'ConfettiCanvas';
