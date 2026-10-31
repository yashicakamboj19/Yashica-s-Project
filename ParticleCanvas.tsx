import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ParticleCanvasHandle {
  triggerChoreExplosion: (x?: number, y?: number, text?: string) => void;
  triggerHitSparks: (x: number, y: number, color?: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  shape: 'circle' | 'square' | 'spark' | 'ring';
  rotation: number;
  rotationSpeed: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  scale: number;
}

const NEON_COLORS = [
  '#22D3EE', // Cyan
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#A855F7', // Purple
  '#FBBF24', // Amber
  '#38BDF8', // Sky
  '#34D399', // Mint
  '#FFFFFF'  // White highlight
];

export const ParticleCanvas = forwardRef<ParticleCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Render & update particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.shape === 'ring') {
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.stroke();
          p.size += 1.8;
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'spark') {
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Render floating texts (e.g. +POINTS, CHORE COMPLETE)
      const texts = floatingTextsRef.current;
      for (let i = texts.length - 1; i >= 0; i--) {
        const t = texts[i];
        t.y += t.vy;
        t.alpha -= 0.015;
        t.scale = Math.min(1.4, t.scale + 0.01);

        if (t.alpha <= 0) {
          texts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        ctx.globalAlpha = Math.max(0, t.alpha);
        ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = t.color;
        ctx.textAlign = 'center';
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 15;
        ctx.fillText(t.text, 0, 0);
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    triggerChoreExplosion(customX?: number, customY?: number, text?: string) {
      const centerX = customX ?? window.innerWidth * 0.65;
      const centerY = customY ?? window.innerHeight * 0.35;

      // Spawn 120-150 particles in a multi-wave radial burst
      const count = 140;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
        const shapeRand = Math.random();

        let shape: 'circle' | 'square' | 'spark' | 'ring' = 'circle';
        if (shapeRand > 0.75) shape = 'spark';
        else if (shapeRand > 0.5) shape = 'square';
        else if (shapeRand > 0.45) shape = 'ring';

        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: Math.random() * 7 + 3,
          color,
          alpha: 1,
          decay: Math.random() * 0.012 + 0.008,
          gravity: 0.18,
          shape,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2
        });
      }

      // Add expanding cyber shockwave rings
      for (let r = 0; r < 3; r++) {
        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx: 0,
          vy: 0,
          size: 15 + r * 10,
          color: r === 0 ? '#22D3EE' : r === 1 ? '#10B981' : '#F43F5E',
          alpha: 0.9,
          decay: 0.02,
          gravity: 0,
          shape: 'ring',
          rotation: 0,
          rotationSpeed: 0
        });
      }

      // Floating celebratory notification
      floatingTextsRef.current.push({
        x: centerX,
        y: centerY - 20,
        text: text || '⚡ CHORE AUTOMATED! +2,500 PTS',
        color: '#22D3EE',
        alpha: 1,
        vy: -1.6,
        scale: 0.8
      });
    },

    triggerHitSparks(x: number, y: number, color?: string) {
      const hitColor = color || '#38BDF8';
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1.5,
          color: Math.random() > 0.4 ? hitColor : '#FFFFFF',
          alpha: 1,
          decay: Math.random() * 0.04 + 0.03,
          gravity: 0.06,
          shape: 'circle',
          rotation: 0,
          rotationSpeed: 0
        });
      }
    }
  }));

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ display: 'block' }}
    />
  );
});

ParticleCanvas.displayName = 'ParticleCanvas';
