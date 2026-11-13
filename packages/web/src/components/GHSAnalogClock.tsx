import { getGHSDate } from 'ghs-time';
import { useCallback, useEffect, useRef } from 'react';

interface GHSAnalogClockProps {
  size?: number;
}

const DIAL_LABELS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Warm archival horological palette
const COLORS = {
  face: '#fdfbf7',
  faceInner: '#f7f4ee',
  rim: '#e5ded2',
  rimDark: '#d6cec0',
  tick: '#b8b0a2',
  tickMajor: '#5e554a',
  label: '#1f1b16',
  dayHand: '#1f1b16',
  beatHand: '#b57924',
  centerDot: '#b57924',
  centerDotInner: '#fdfbf7',
};

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// The beat hand only moves visibly about once per second — a 100 ms repaint
// interval is indistinguishable from a 60 fps rAF loop and far cheaper.
const REDRAW_INTERVAL_MS = 100;

export function GHSAnalogClock({ size = 248 }: GHSAnalogClockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.44;
    const faceR = size * 0.46;

    // --- Outer case ring ---
    ctx.beginPath();
    ctx.arc(cx, cy, faceR + 3, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.rim;
    ctx.fill();

    // --- Clock face ---
    ctx.beginPath();
    ctx.arc(cx, cy, faceR, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.face;
    ctx.fill();

    // Hairline inner bezel
    ctx.beginPath();
    ctx.arc(cx, cy, faceR, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.rimDark;
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Tick marks (100 divisions) ---
    for (let i = 0; i < 100; i++) {
      const angleDeg = (i / 100) * 360;
      const isMajor = i % 10 === 0;
      const isSemi = i % 5 === 0 && !isMajor;
      const tickOuter = R;
      const tickInner = isMajor ? R * 0.83 : isSemi ? R * 0.89 : R * 0.93;
      const rad = ((angleDeg - 90) * Math.PI) / 180;

      const x1 = cx + tickOuter * Math.cos(rad);
      const y1 = cy + tickOuter * Math.sin(rad);
      const x2 = cx + tickInner * Math.cos(rad);
      const y2 = cy + tickInner * Math.sin(rad);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor ? COLORS.tickMajor : COLORS.tick;
      ctx.lineWidth = isMajor ? 1.75 : 1;
      ctx.stroke();
    }

    // --- Dial labels (0–9) ---
    const labelR = R * 0.7;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize = Math.round(size * 0.068);
    ctx.font = `400 ${fontSize}px "JetBrains Mono", monospace`;
    ctx.fillStyle = COLORS.label;

    for (let i = 0; i < 10; i++) {
      const angleDeg = (i / 10) * 360;
      const pos = polarToXY(cx, cy, labelR, angleDeg);
      ctx.fillText(DIAL_LABELS[i], pos.x, pos.y);
    }

    // --- Compute beat values ---
    const { beatsExact } = getGHSDate();
    const dayAngleDeg = (beatsExact / 1000) * 360;
    const beatAngleDeg = ((beatsExact % 100) / 100) * 360;

    // --- Day hand (1,000 beats / rev) ---
    const dayHandLen = R * 0.52;
    const dayHandBase = R * 0.12;
    const dayRad = ((dayAngleDeg - 90) * Math.PI) / 180;
    const dayTip = { x: cx + dayHandLen * Math.cos(dayRad), y: cy + dayHandLen * Math.sin(dayRad) };
    const dayTail = {
      x: cx - dayHandBase * Math.cos(dayRad),
      y: cy - dayHandBase * Math.sin(dayRad),
    };

    ctx.save();
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(dayTail.x, dayTail.y);
    ctx.lineTo(dayTip.x, dayTip.y);
    ctx.strokeStyle = COLORS.dayHand;
    ctx.lineWidth = size * 0.026;
    ctx.stroke();
    ctx.restore();

    // --- Beat hand (100 beats / rev, brass accent) ---
    const beatHandLen = R * 0.78;
    const beatHandBase = R * 0.18;
    const beatRad = ((beatAngleDeg - 90) * Math.PI) / 180;
    const beatTip = {
      x: cx + beatHandLen * Math.cos(beatRad),
      y: cy + beatHandLen * Math.sin(beatRad),
    };
    const beatTail = {
      x: cx - beatHandBase * Math.cos(beatRad),
      y: cy - beatHandBase * Math.sin(beatRad),
    };

    ctx.save();
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(beatTail.x, beatTail.y);
    ctx.lineTo(beatTip.x, beatTip.y);
    ctx.strokeStyle = COLORS.beatHand;
    ctx.lineWidth = size * 0.012;
    ctx.stroke();
    ctx.restore();

    // --- Center cap ---
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.038, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.centerDot;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.016, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.centerDotInner;
    ctx.fill();
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    draw();
  }, [size, draw]);

  useEffect(() => {
    const timer = setInterval(draw, REDRAW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [draw]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} aria-label="GHS Analog Clock" />;
}
