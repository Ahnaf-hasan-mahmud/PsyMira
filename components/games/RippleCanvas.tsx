"use client";
import React, { useRef, useEffect } from "react";

interface RippleCanvasProps {
  onSessionComplete?: () => void;
}

const RIPPLE_COLORS = ['#7ca5d4', '#5a9daa', '#a78bfa', '#8bb8cc'];

export default function RippleCanvas({ onSessionComplete }: RippleCanvasProps) {
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
    let taps = 0;

    type Ripple = { x: number; y: number; radius: number; maxRadius: number; opacity: number; color: string };
    let ripples: Ripple[] = [];
    let colorIndex = 0;

    let audioCtx: AudioContext | null = null;
    const playRippleSound = () => {
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
      // Water drip: fast frequency sweep UP
      osc.frequency.setValueAtTime(300 + Math.random() * 100, t);
      osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 200, t + 0.1);
      
      // Percussive volume envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(t);
      osc.stop(t + 0.15);
    };

    const draw = () => {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#e8f0f8');
      grad.addColorStop(1, '#d0e4f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Ambient shimmer
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        for (let j = 0; j < width; j += 10) {
          const y = i + Math.sin(j * 0.01 + frameCount * 0.02) * 5;
          if (j === 0) ctx.moveTo(j, y);
          else ctx.lineTo(j, y);
        }
        ctx.stroke();
      }

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1.5;
        r.opacity = Math.max(0, 0.6 * (1 - r.radius / r.maxRadius));

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = r.opacity;
        ctx.lineWidth = 2 + (r.radius / r.maxRadius) * 2;
        ctx.stroke();

        if (r.opacity <= 0) ripples.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      frameCount++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const addRipple = (x: number, y: number) => {
      ripples.push({
        x, y,
        radius: 0,
        maxRadius: 150 + Math.random() * 100,
        opacity: 0.6,
        color: RIPPLE_COLORS[colorIndex % RIPPLE_COLORS.length]
      });
      colorIndex++;
      taps++;
      playRippleSound();
      if (taps >= 20 && !sessionCompleteFired.current) {
        sessionCompleteFired.current = true;
        onSessionComplete?.();
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        addRipple(e.changedTouches[i].clientX - rect.left, e.changedTouches[i].clientY - rect.top);
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
