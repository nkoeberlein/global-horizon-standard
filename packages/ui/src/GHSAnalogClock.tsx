import { useEffect, useRef, useCallback } from 'react';
import { getGHSDate } from 'ghs-time';

interface GHSAnalogClockProps {
  size?: number;
}

const DIAL_LABELS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Warm organic palette
const COLORS = {
  face: '#faf9f6',
  faceInner: '#f4f2ed',
  rim: '#e8e4db',
  rimDark: '#d4cfc4',
  tick: '#b0a898',
  tickMajor: '#7a7265',
  label: '#4a4035',
  dayHand: '#3d3830',
  beatHand: '#c8903a',
  beatHandGlow: 'rgba(200, 144, 58, 0.25)',
  centerDot: '#c8903a',
  centerDotInner: '#faf9f6',
  shadow: 'rgba(60, 50, 35, 0.15)',
};

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function GHSAnalogClock({ size = 280 }: GHSAnalogClockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = size * dpr;
    const h = size * dpr;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.44; // outer dial radius
    const faceR = size * 0.46;

    // --- Outer rim / shadow ---
    ctx.save();
    const rimGrad = ctx.createRadialGradient(cx, cy - R * 0.1, R * 0.5, cx, cy, faceR + 4);
    rimGrad.addColorStop(0, COLORS.face);
    rimGrad.addColorStop(1, COLORS.rimDark);
    ctx.beginPath();
    ctx.arc(cx, cy, faceR + 4, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.shadowColor = COLORS.shadow;
    ctx.shadowBlur = size * 0.06;
    ctx.shadowOffsetY = size * 0.015;
    ctx.fill();
    ctx.restore();

    // --- Clock face ---
    const faceGrad = ctx.createRadialGradient(cx, cy - R * 0.2, R * 0.05, cx, cy, faceR);
    faceGrad.addColorStop(0, '#fffef9');
    faceGrad.addColorStop(1, COLORS.faceInner);
    ctx.beginPath();
    ctx.arc(cx, cy, faceR, 0, Math.PI * 2);
    ctx.fillStyle = faceGrad;
    ctx.fill();

    // Subtle inner ring
    ctx.beginPath();
    ctx.arc(cx, cy, faceR, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.rim;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // --- Tick marks ---
    for (let i = 0; i < 100; i++) {
      const angleDeg = (i / 100) * 360;
      const isMajor = i % 10 === 0;
      const isSemi = i % 5 === 0 && !isMajor;
      const tickOuter = R;
      const tickInner = isMajor ? R * 0.82 : isSemi ? R * 0.88 : R * 0.93;
      const rad = ((angleDeg - 90) * Math.PI) / 180;

      const x1 = cx + tickOuter * Math.cos(rad);
      const y1 = cy + tickOuter * Math.sin(rad);
      const x2 = cx + tickInner * Math.cos(rad);
      const y2 = cy + tickInner * Math.sin(rad);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor ? COLORS.tickMajor : COLORS.tick;
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.stroke();
    }

    // --- Dial labels (0–9) ---
    const labelR = R * 0.7;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize = size * 0.07;
    ctx.font = `300 ${fontSize}px 'Georgia', serif`;
    ctx.fillStyle = COLORS.label;

    for (let i = 0; i < 10; i++) {
      const angleDeg = (i / 10) * 360;
      const pos = polarToXY(cx, cy, labelR, angleDeg);
      ctx.fillText(DIAL_LABELS[i], pos.x, pos.y);
    }

    // --- Compute beat values ---
    const ghsDate = getGHSDate();
    const beatsFloat = parseFloat(ghsDate.beatsLong.substring(1)); // 0–999.99
    const dayAngleDeg = (beatsFloat / 1000) * 360;
    const beatAngleDeg = ((beatsFloat % 100) / 100) * 360;

    // --- Day hand (thick, warm charcoal) ---
    const dayHandLen = R * 0.52;
    const dayHandBase = R * 0.12;
    const dayRad = ((dayAngleDeg - 90) * Math.PI) / 180;
    const dayTip = { x: cx + dayHandLen * Math.cos(dayRad), y: cy + dayHandLen * Math.sin(dayRad) };
    const dayTail = { x: cx - dayHandBase * Math.cos(dayRad), y: cy - dayHandBase * Math.sin(dayRad) };

    ctx.save();
    ctx.lineCap = 'round';
    // Day hand shadow
    ctx.shadowColor = 'rgba(60,50,35,0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.moveTo(dayTail.x, dayTail.y);
    ctx.lineTo(dayTip.x, dayTip.y);
    ctx.strokeStyle = COLORS.dayHand;
    ctx.lineWidth = size * 0.03;
    ctx.stroke();
    ctx.restore();

    // --- Beat hand (thin, amber) ---
    const beatHandLen = R * 0.78;
    const beatHandBase = R * 0.18;
    const beatRad = ((beatAngleDeg - 90) * Math.PI) / 180;
    const beatTip = { x: cx + beatHandLen * Math.cos(beatRad), y: cy + beatHandLen * Math.sin(beatRad) };
    const beatTail = { x: cx - beatHandBase * Math.cos(beatRad), y: cy - beatHandBase * Math.sin(beatRad) };

    ctx.save();
    ctx.lineCap = 'round';
    // Glow
    ctx.shadowColor = COLORS.beatHandGlow;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(beatTail.x, beatTail.y);
    ctx.lineTo(beatTip.x, beatTip.y);
    ctx.strokeStyle = COLORS.beatHand;
    ctx.lineWidth = size * 0.012;
    ctx.stroke();
    ctx.restore();

    // --- Center cap ---
    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.045, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.centerDot;
    ctx.fill();
    // Inner dot
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.022, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.centerDotInner;
    ctx.fill();
  }, [size]);

  useEffect(() => {
    let running = true;

    function frame() {
      if (!running) return;
      draw();
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block' }}
      aria-label="GHS Analog Clock"
    />
  );
}
