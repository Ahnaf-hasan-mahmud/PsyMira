"use client";
import React, { useRef, useEffect } from "react";

interface SandCanvasProps {
  activeColor: string;
  onSessionComplete?: () => void;
}

export default function SandCanvas({ activeColor, onSessionComplete }: SandCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionCompleteFired = useRef(false);
  const activeColorRef = useRef(activeColor);

  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

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
    
    const CELL_SIZE = 4;
    let cols = Math.floor(width / CELL_SIZE);
    let rows = Math.floor(height / CELL_SIZE);
    let grid: (string | null)[][] = Array(cols).fill(null).map(() => Array(rows).fill(null));

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        canvas.width = width;
        canvas.height = height;
        const newCols = Math.floor(width / CELL_SIZE);
        const newRows = Math.floor(height / CELL_SIZE);
        const newGrid = Array(newCols).fill(null).map(() => Array(newRows).fill(null));
        for (let x = 0; x < Math.min(cols, newCols); x++) {
          for (let y = 0; y < Math.min(rows, newRows); y++) {
            newGrid[x][newRows - rows + y] = grid[x][y];
          }
        }
        cols = newCols;
        rows = newRows;
        grid = newGrid;
      }
    });
    observer.observe(container);

    let animationId: number;
    let grainsPlaced = 0;
    let isDrawing = false;
    let isClearing = false;
    let clearAlpha = 0;

    let audio: HTMLAudioElement | null = null;
    let targetVolume = 0;

    const initAudio = () => {
      if (!audio) {
        audio = new Audio('/audio/sand.mp3');
        audio.loop = true;
        audio.volume = 0;
        // Start playing on first user interaction, and never pause it to avoid browser autoplay issues
        audio.play().catch(e => console.log('Audio play failed', e));
      }
    };

    const adjustBrightness = (hex: string, percent: number) => {
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      r = Math.min(255, Math.max(0, r + (r * percent) / 100));
      g = Math.min(255, Math.max(0, g + (g * percent) / 100));
      b = Math.min(255, Math.max(0, b + (b * percent) / 100));
      return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    };

    const addSand = (x: number, y: number) => {
      const cx = Math.floor(x / CELL_SIZE);
      const cy = Math.floor(y / CELL_SIZE);
      const radius = 3;
      let added = 0;
      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          if (i * i + j * j <= radius * radius) {
            const nx = cx + i;
            const ny = cy + j;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny] === null) {
              if (Math.random() > 0.3) {
                const variation = (Math.random() - 0.5) * 20;
                grid[nx][ny] = adjustBrightness(activeColorRef.current, variation);
                added++;
              }
            }
          }
        }
      }
      grainsPlaced += added;
      if (grainsPlaced >= 500 && !sessionCompleteFired.current) {
        sessionCompleteFired.current = true;
        onSessionComplete?.();
      }
    };

    const draw = () => {
      let didSandMove = false;

      if (isClearing) {
        clearAlpha += 0.05;
        if (clearAlpha >= 1) {
          grid = Array(cols).fill(null).map(() => Array(rows).fill(null));
          isClearing = false;
          clearAlpha = 0;
        }
      }

      for (let y = rows - 2; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          if (grid[x][y] !== null) {
            if (grid[x][y + 1] === null) {
              grid[x][y + 1] = grid[x][y];
              grid[x][y] = null;
              didSandMove = true;
            } else {
              const leftClear = x > 0 && grid[x - 1][y + 1] === null;
              const rightClear = x < cols - 1 && grid[x + 1][y + 1] === null;
              if (leftClear && rightClear) {
                if (Math.random() > 0.5) {
                  grid[x - 1][y + 1] = grid[x][y];
                } else {
                  grid[x + 1][y + 1] = grid[x][y];
                }
                grid[x][y] = null;
                didSandMove = true;
              } else if (leftClear) {
                grid[x - 1][y + 1] = grid[x][y];
                grid[x][y] = null;
                didSandMove = true;
              } else if (rightClear) {
                grid[x + 1][y + 1] = grid[x][y];
                grid[x][y] = null;
                didSandMove = true;
              }
            }
          }
        }
      }

      // Update sound volume based on activity
      if (isDrawing) {
        targetVolume = 1.0;
      } else {
        targetVolume = 0;
      }

      if (audio) {
        if (audio.volume < targetVolume) {
          audio.volume = Math.min(targetVolume, audio.volume + 0.05); // fade in fast
        } else if (audio.volume > targetVolume) {
          audio.volume = Math.max(targetVolume, audio.volume - 0.02); // fade out a bit slower
        }
      }

      ctx.clearRect(0, 0, width, height);
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          if (grid[x][y] !== null) {
            ctx.fillStyle = grid[x][y]!;
            if (isClearing) {
              ctx.globalAlpha = 1 - clearAlpha;
            } else {
              ctx.globalAlpha = 1;
            }
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      initAudio();
      isDrawing = true;
      handlePointerMove(e);
    };
    const handlePointerUp = () => {
      isDrawing = false;
    };
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      if (e.type.startsWith('touch')) e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      let ex, ey;
      if ('touches' in e) {
        ex = e.touches[0].clientX - rect.left;
        ey = e.touches[0].clientY - rect.top;
      } else {
        ex = (e as MouseEvent).clientX - rect.left;
        ey = (e as MouseEvent).clientY - rect.top;
      }
      addSand(ex, ey);
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });

    (canvas as any)._triggerClear = () => { isClearing = true; };

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handlePointerUp);
      canvas.removeEventListener('touchmove', handlePointerMove);
      if (audio) {
        audio.pause();
        audio = null;
      }
    };
  }, [onSessionComplete]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <button 
        style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', cursor: 'pointer', zIndex: 10 }}
        onClick={() => {
          if (canvasRef.current && (canvasRef.current as any)._triggerClear) {
            (canvasRef.current as any)._triggerClear();
          }
        }}
      >
        Clear
      </button>
    </div>
  );
}
