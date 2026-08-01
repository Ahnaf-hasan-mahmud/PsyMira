"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./ColoringCanvas.module.css";
import ColorPalette from "./ColorPalette";

import { COLORING_PAGES, COLORING_PALETTE } from "@/lib/coloringData";

interface ColoringCanvasProps {
  onSessionComplete?: () => void;
}

type Tool = 'fill' | 'solid' | 'marker' | 'airbrush';

export default function ColoringCanvas({ onSessionComplete }: ColoringCanvasProps) {
  const [mode, setMode] = useState<'select' | 'color'>('select');
  const [pageIndex, setPageIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(COLORING_PALETTE[0]);
  const [showModal, setShowModal] = useState(false);
  
  const [tool, setTool] = useState<Tool>('fill');
  const [brushSize, setBrushSize] = useState(20);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [completedRegions, setCompletedRegions] = useState<Set<string>>(new Set());
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{x: number, y: number} | null>(null);
  const sessionCompleteFired = useRef(false);

  const currentPage = COLORING_PAGES[pageIndex];

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, 400, 400);
    }
    setCompletedRegions(new Set());
    setSelectedRegion(null);
  };

  useEffect(() => {
    handleReset();
    setShowModal(false);
    sessionCompleteFired.current = false;
  }, [pageIndex]);

  const checkCompletion = (hitRegion: string) => {
    setCompletedRegions(prev => {
      const next = new Set(prev);
      next.add(hitRegion);
      if (next.size >= currentPage.regions.length && !sessionCompleteFired.current) {
        sessionCompleteFired.current = true;
        onSessionComplete?.();
        setTimeout(() => setShowModal(true), 500);
      }
      return next;
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Hit test
    let hitRegion = null;
    for (let i = currentPage.regions.length - 1; i >= 0; i--) {
      const region = currentPage.regions[i];
      const path = new Path2D(region.d || (region as any).path);
      if (ctx.isPointInPath(path, x, y)) {
        hitRegion = region.id;
        break;
      }
    }

    if (!hitRegion) {
      setSelectedRegion(null);
      return;
    }

    checkCompletion(hitRegion);
    setSelectedRegion(hitRegion);

    if (tool === 'fill') {
      const regionData = currentPage.regions.find(r => r.id === hitRegion);
      if (regionData) {
        const path = new Path2D(regionData.d || (regionData as any).path);
        ctx.save();
        ctx.fillStyle = activeColor;
        ctx.fill(path);
        ctx.restore();
      }
    } else {
      isDrawing.current = true;
      lastPos.current = { x, y };
      drawStroke(x, y, x, y, hitRegion, ctx);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !selectedRegion || tool === 'fill') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    drawStroke(lastPos.current!.x, lastPos.current!.y, x, y, selectedRegion, ctx);
    lastPos.current = { x, y };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = false;
    lastPos.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const drawStroke = (x1: number, y1: number, x2: number, y2: number, regionId: string, ctx: CanvasRenderingContext2D) => {
    const region = currentPage.regions.find(r => r.id === regionId);
    if (!region) return;
    const path = new Path2D(region.d || (region as any).path);

    ctx.save();
    ctx.clip(path);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = brushSize;

    if (tool === 'solid') {
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    } else if (tool === 'marker') {
      ctx.globalAlpha = 0.15;
      ctx.shadowBlur = 0;
    } else if (tool === 'airbrush') {
      ctx.globalAlpha = 0.05;
      ctx.shadowBlur = brushSize;
      ctx.shadowColor = activeColor;
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.restore();
  };

  if (mode === 'select') {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', color: 'var(--text)', marginBottom: '8px' }}>Select an Outline</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Choose a design to start coloring</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          {COLORING_PAGES.map((page, idx) => (
            <motion.button
              key={page.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer'
              }}
              onClick={() => {
                setPageIndex(idx);
                setMode('color');
              }}
            >
              <span style={{ fontSize: '48px' }}>{page.emoji}</span>
              <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>{page.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const renderToolBtn = (t: Tool, icon: string, label: string) => (
    <button
      onClick={() => setTool(t)}
      style={{
        padding: '8px 16px',
        borderRadius: '12px',
        border: tool === t ? '2px solid var(--primary)' : '1px solid var(--border)',
        background: tool === t ? 'rgba(167, 139, 250, 0.1)' : 'var(--card)',
        color: tool === t ? 'var(--primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 'bold',
        transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span> {label}
    </button>
  );

  return (
    <div className={styles.container}>
      <div className={styles.controlsRow}>
        <button 
          onClick={() => setMode('select')}
          style={{ padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <div style={{ flex: 1 }} />
        <ColorPalette colors={COLORING_PALETTE} active={activeColor} onChange={setActiveColor} />
        <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'var(--bg)', borderRadius: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {renderToolBtn('fill', '🪣', 'Fill')}
        {renderToolBtn('solid', '🖌️', 'Solid')}
        {renderToolBtn('marker', '🖍️', 'Marker')}
        {renderToolBtn('airbrush', '💨', 'Airbrush')}
        
        {tool !== 'fill' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Size</span>
            <input 
              type="range" 
              min="5" max="50" 
              value={brushSize} 
              onChange={e => setBrushSize(parseInt(e.target.value))}
              style={{ width: '100px', accentColor: 'var(--primary)' }}
            />
          </div>
        )}
      </div>

      <div className={styles.svgContainer} style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', aspectRatio: '1/1' }}>
        <canvas 
          ref={canvasRef}
          width={400} 
          height={400} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'crosshair', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" className={styles.svg} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
          {currentPage.regions.map((region: any) => (
            <path
              key={region.id}
              d={region.d || region.path}
              stroke={selectedRegion === region.id ? "var(--primary)" : "var(--text-tertiary)"}
              strokeWidth={selectedRegion === region.id ? 3 : 1.5}
              fill="none"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
          ))}
        </svg>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ background: 'var(--card)', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)', maxWidth: '400px' }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '12px' }}>Masterpiece Complete!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '18px' }}>
              Beautiful work! You've successfully completed this design.
            </p>
            <div style={{ display: 'inline-block', background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', fontSize: '20px', marginBottom: '32px' }}>
              +15 XP Earned
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Keep Looking
              </button>
              <button 
                onClick={() => { setShowModal(false); setMode('select'); }}
                style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Choose Another
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
