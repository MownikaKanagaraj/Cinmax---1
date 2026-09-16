'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight, PartyPopper } from 'lucide-react';

export interface GrandPaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  pointsEarned?: number;
}

function CanvasPartyPopperConfetti() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();

    const width = canvas.width;
    const height = canvas.height;

    // CINMAX Azure Luxe Confetti Palette
    const colors = ['#C5A880', '#D4AF37', '#002754', '#0A3D78', '#FFF8E7', '#FFFFFF', '#F59E0B'];
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      gravity: number;
      drag: number;
      shape: 'rect' | 'circle' | 'star';
    }

    const particles: Particle[] = [];

    // Helper to launch a burst from a specific popper origin
    const launchBurst = (originX: number, originY: number, angleDegMin: number, angleDegMax: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angleRad = ((Math.random() * (angleDegMax - angleDegMin) + angleDegMin) * Math.PI) / 180;
        const speed = Math.random() * 18 + 12; // High initial cannon velocity
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angleRad) * speed,
          vy: Math.sin(angleRad) * speed,
          size: Math.random() * 9 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 16,
          opacity: 1,
          gravity: 0.28,
          drag: 0.97,
          shape: Math.random() > 0.3 ? 'rect' : Math.random() > 0.5 ? 'star' : 'circle',
        });
      }
    };

    // 1. Initial Double-Popper Explosion (Bottom-Left & Bottom-Right)
    launchBurst(40, height - 40, -75, -25, 75); // Left Popper shooting up-right
    launchBurst(width - 40, height - 40, -155, -105, 75); // Right Popper shooting up-left

    // 2. Secondary Burst after 350ms
    const timer1 = setTimeout(() => {
      launchBurst(60, height - 40, -70, -30, 50);
      launchBurst(width - 60, height - 40, -150, -110, 50);
    }, 350);

    // 3. Center Victory Wave after 750ms
    const timer2 = setTimeout(() => {
      launchBurst(width / 2, height * 0.35, 0, 360, 60);
    }, 750);

    const startTime = Date.now();
    const duration = 4500;

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration && particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / duration);

        if (p.opacity <= 0 || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(0, 0, 5, p.size, p.size / 2);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', updateSize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updateSize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-30"
    />
  );
}

export function GrandPaymentSuccessModal({
  isOpen,
  onClose,
  orderNumber,
  pointsEarned = 0,
}: GrandPaymentSuccessModalProps) {
  const [showCheck, setShowCheck] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowCheck(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowCheck(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="grand-success-title"
      className="fixed inset-0 z-[100000] w-screen h-screen bg-[#040C18]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-300"
    >
      {/* Full-Screen Party Popper Confetti Canvas */}
      <CanvasPartyPopperConfetti />

      {/* Decorative Bottom Left Party Popper Cannon Icon */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 p-3 rounded-full bg-[#002754]/80 border border-[#C5A880]/50 shadow-2xl backdrop-blur-md text-[#C5A880] animate-pulse">
        <PartyPopper className="w-8 h-8 text-[#C5A880] animate-bounce" />
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#C5A880] pr-1">
          CINMAX CELEBRATION
        </span>
      </div>

      {/* Decorative Bottom Right Party Popper Cannon Icon */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 p-3 rounded-full bg-[#002754]/80 border border-[#C5A880]/50 shadow-2xl backdrop-blur-md text-[#C5A880] animate-pulse">
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#C5A880] pl-1">
          CINMAX CELEBRATION
        </span>
        <PartyPopper className="w-8 h-8 text-[#C5A880] animate-bounce" />
      </div>

      {/* Single Clean Centered Luxury Success Glass Panel (No outer wrappers/clipping) */}
      <div className="relative w-full max-w-[420px] max-h-[88vh] bg-gradient-to-b from-[#0A192F]/95 via-[#002754]/95 to-[#071324]/95 text-white border-2 border-[#C5A880]/60 shadow-[0_30px_90px_rgba(0,39,84,0.7)] rounded-[32px] overflow-hidden flex flex-col items-center animate-in zoom-in-95 fade-in duration-400 ease-out z-40 my-auto">
        
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#002754] via-[#C5A880] to-[#002754] flex-shrink-0" />

        {/* Scrollable Panel Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center space-y-5 w-full">
          
          {/* 1. SUCCESS EMBLEM & ANIMATED CHECK MARK */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 mx-auto flex items-center justify-center pt-2">
            <div className="absolute inset-0 rounded-full bg-[#C5A880]/25 animate-ping duration-1000 opacity-70 pointer-events-none" />
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#002754] text-[#C5A880] flex items-center justify-center shadow-2xl border-2 border-[#C5A880] ring-4 ring-[#C5A880]/20">
              <svg
                className="w-9 h-9 sm:w-10 sm:h-10 text-[#C5A880]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  style={{
                    strokeDasharray: 30,
                    strokeDashoffset: showCheck ? 0 : 30,
                    transition: 'stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </svg>
            </div>
            {/* Gold Sparkle Accents */}
            <Sparkles className="absolute -top-1 right-0 w-5 h-5 text-[#C5A880] animate-bounce duration-1000" />
            <Sparkles className="absolute bottom-0 -left-1 w-4 h-4 text-[#C5A880] opacity-90" />
          </div>

          {/* 2. COPY HIERARCHY */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-extrabold uppercase tracking-widest border border-[#C5A880]/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              ORDER CONFIRMED
            </div>

            <h2
              id="grand-success-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight pt-1"
            >
              Thank You for Choosing <br />
              <span className="text-[#C5A880]">CINMAX</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-[300px] mx-auto leading-relaxed">
              Your order has been placed successfully.
            </p>

            <p className="text-xs sm:text-sm text-[#C5A880] font-serif italic font-semibold pt-1">
              Your CINMAX journey continues...
            </p>
          </div>

          {/* 3. LOYALTY POINTS CREDITED BADGE */}
          {pointsEarned > 0 && (
            <div className="p-4 rounded-2xl bg-[#002754]/80 border border-[#C5A880]/40 shadow-lg flex items-center justify-between text-left transition-all hover:border-[#C5A880]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C5A880] text-[#002754] flex items-center justify-center shadow-md flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-[#C5A880] uppercase tracking-wider">
                    Loyalty Reward Credited
                  </h4>
                  <p className="text-[10px] text-slate-300 font-medium">
                    1 Point = ₹1 discount on future orders
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span className="block font-mono font-black text-lg sm:text-xl text-emerald-400">
                  +{pointsEarned}
                </span>
                <span className="text-[9px] font-extrabold text-[#C5A880] uppercase tracking-widest block">
                  PTS EARNED
                </span>
              </div>
            </div>
          )}

          {/* 4. ORDER REF & MICROCOPY */}
          <div className="text-xs space-y-1 pt-1">
            <p className="font-mono font-bold text-xs text-[#C5A880] bg-[#C5A880]/15 py-1.5 px-4 rounded-xl inline-block border border-[#C5A880]/30 shadow-inner">
              Order Ref: #{orderNumber}
            </p>
            <p className="text-[9px] font-extrabold tracking-widest uppercase text-slate-400 pt-1 block">
              KEEP PURCHASING WITH CINMAX
            </p>
          </div>
        </div>

        {/* 5. STICKY FOOTER ACTION BUTTONS */}
        <div className="p-5 sm:p-6 border-t border-[#C5A880]/20 bg-[#040C18]/90 w-full flex flex-col sm:flex-row gap-3 flex-shrink-0 z-10">
          <Link
            href="/orders"
            onClick={onClose}
            className="flex-1 bg-[#C5A880] hover:bg-[#D4AF37] text-[#002754] font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 border border-[#C5A880] active:scale-[0.98] min-h-[48px]"
          >
            <span className="font-extrabold">View Order</span>
            <ArrowRight className="w-4 h-4 text-[#002754]" />
          </Link>

          <Link
            href="/shop"
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all border border-white/30 flex items-center justify-center gap-2 active:scale-[0.98] min-h-[48px]"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
            <span>Keep Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
