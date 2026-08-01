"use client";
import React, { useRef, useEffect } from "react";

interface BubbleCanvasProps {
  onSessionComplete?: () => void;
}

const BUBBLE_COLORS = ['#f8b4c8', '#a8d8e8', '#c4b5fd', '#f9e4a0', '#b8e6b8', '#dbb5f0', '#f7c6a3'];

export default function BubbleCanvas({ onSessionComplete }: BubbleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionCompleteFired = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        canvas.width = width;
        canvas.height = height;
      }
    });
    observer.observe(container);

    let animationId: number;
    let frameCount = 0;
    let pops = 0;

    type Bubble = { x: number; y: number; r: number; color: string; speed: number; offset: number; state: 'normal' | 'popping' | 'dead'; scale: number; opacity: number };
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };

    let bubbles: Bubble[] = [];
    let particles: Particle[] = [];

    let audioCtx: AudioContext | null = null;
    const playPopSound = () => {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      // Start high, drop fast to simulate a liquid drop/pop
      osc.frequency.setValueAtTime(600 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.1);
      
      // Quick sharp volume envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(t);
      osc.stop(t + 0.1);
    };

    const spawnBubble = () => {
      if (bubbles.filter(b => b.state === 'normal').length >= 15) return;
      bubbles.push({
        x: Math.random() * width,
        y: height + 60,
        r: 20 + Math.random() * 40,
        color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        state: 'normal',
        scale: 1,
        opacity: 1
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (b.state === 'dead') continue;

        ctx.save();
        const wobble = Math.sin(frameCount * 0.05 + b.offset) * 5;
        ctx.translate(b.x + wobble, b.y);
        ctx.scale(b.scale, b.scale);

        ctx.beginPath();
        ctx.arc(0, 0, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.opacity;
        ctx.fill();
        ctx.closePath();

        // Highlight
        ctx.beginPath();
        ctx.arc(-b.r * 0.3, -b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();
        ctx.closePath();

        ctx.restore();

        if (b.state === 'normal') {
          b.y -= b.speed;
          if (b.y < -b.r) b.state = 'dead';
        } else if (b.state === 'popping') {
          b.scale += 0.05;
          b.opacity -= 0.1;
          if (b.opacity <= 0) b.state = 'dead';
        }
      }

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fill();
        ctx.closePath();

        if (p.life <= 0) particles.splice(i, 1);
      }

      bubbles = bubbles.filter(b => b.state !== 'dead');

      frameCount++;
      if (frameCount % Math.floor(40 + Math.random() * 20) === 0) spawnBubble();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleInteraction = (ex: number, ey: number) => {
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (b.state === 'normal') {
          const dx = b.x - ex;
          const dy = b.y - ey;
          if (dx * dx + dy * dy <= b.r * b.r) {
            b.state = 'popping';
            pops++;
            playPopSound();
            // Particles
            for (let j = 0; j < 8; j++) {
              const angle = (Math.PI * 2 * j) / 8;
              particles.push({
                x: b.x, y: b.y,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                life: 30, maxLife: 30,
                color: b.color
              });
            }
            if (pops >= 25 && !sessionCompleteFired.current) {
              sessionCompleteFired.current = true;
              onSessionComplete?.();
            }
            break;
          }
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      handleInteraction(e.clientX - rect.left, e.clientY - rect.top);
    };
    
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        handleInteraction(e.changedTouches[i].clientX - rect.left, e.changedTouches[i].clientY - rect.top);
      }
    };

    canvas.addEventListener('mousedown', onClick);
    canvas.addEventListener('touchstart', onTouch, { passive: false });

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      canvas.removeEventListener('mousedown', onClick);
      canvas.removeEventListener('touchstart', onTouch);
      if (audioCtx) {
        audioCtx.close().catch(console.error);
      }
    };
  }, [onSessionComplete]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
