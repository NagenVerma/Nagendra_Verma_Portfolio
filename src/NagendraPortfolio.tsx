// Nagendra Verma — Portfolio (3D / next-level edition)
// EmailJS — messages go to nagendrayounger@gmail.com
// Pure CSS + Canvas 3D: particle field, follower cursor, mouse-parallax hero,
// mouse-tracked 3D tilt cards, magnetic buttons, aurora glass UI. No new deps.

import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"
import emailjs from "@emailjs/browser"

// ── Palette ────────────────────────────────────────────────────────────────

const C = {
  navy: "#05070F",
  slate: "#0A0F1E",
  card: "#0E1424",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  purple: "#8B5CF6",
  pink: "#EC4899",
  white: "#F0F4FF",
  muted: "#8B9CC8",
  border: "rgba(99,140,255,0.16)",
}

const S: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    background: C.navy,
    color: C.white,
    overflowX: "hidden",
    minHeight: "100vh",
    position: "relative",
  },
  // NAV
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    height: 66,
    background: "rgba(5,7,15,0.55)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    borderBottom: `1px solid ${C.border}`,
  },
  navLogo: {
    fontFamily: "'Syne', 'Inter', sans-serif",
    fontWeight: 800,
    fontSize: "1.15rem",
    background: `linear-gradient(135deg,${C.blue},${C.cyan},${C.purple})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navItem: { position: "relative" },
  navLink: {
    display: "block",
    padding: "8px 16px",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: C.muted,
    cursor: "pointer",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
    background: "none",
    border: "none",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    background: "rgba(10,15,30,0.92)",
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: 8,
    minWidth: 190,
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    zIndex: 200,
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  },
  dropItem: {
    display: "block",
    width: "100%",
    padding: "9px 14px",
    fontSize: "0.82rem",
    color: C.muted,
    cursor: "pointer",
    borderRadius: 9,
    background: "none",
    border: "none",
    textAlign: "left" as const,
    transition: "background 0.15s, color 0.15s",
  },
  navCta: {
    padding: "9px 22px",
    background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "0.82rem",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(6,182,212,0.35)",
  },
  // HERO
  hero: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "90px 5% 40px",
    position: "relative" as const,
    overflow: "hidden",
    perspective: "1400px",
  },
  heroInner: {
    position: "relative" as const,
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: 60,
    alignItems: "center",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
    transformStyle: "preserve-3d" as const,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 16px",
    borderRadius: 30,
    border: "1px solid rgba(6,182,212,0.35)",
    background: "rgba(6,182,212,0.08)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.78rem",
    color: C.cyan,
    marginBottom: 26,
    backdropFilter: "blur(8px)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: C.cyan,
    boxShadow: `0 0 10px ${C.cyan}`,
    animation: "pulse 2s infinite",
  },
  heroTitle: {
    fontFamily: "'Syne', 'Inter', sans-serif",
    fontSize: "clamp(2.6rem,5.4vw,4.4rem)",
    fontWeight: 800,
    lineHeight: 1.02,
    letterSpacing: "-0.02em",
    marginBottom: 22,
  },
  heroSub: {
    fontSize: "1.02rem",
    color: C.muted,
    lineHeight: 1.75,
    marginBottom: 36,
    maxWidth: 480,
  },
  heroActions: { display: "flex", gap: 14, flexWrap: "wrap" as const },
  btnPrimary: {
    padding: "14px 30px",
    borderRadius: 12,
    background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.92rem",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(6,182,212,0.35)",
  },
  btnOutline: {
    padding: "14px 30px",
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    background: "rgba(255,255,255,0.02)",
    color: C.white,
    fontWeight: 600,
    fontSize: "0.92rem",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  },
  heroStats: {
    display: "flex",
    gap: 36,
    marginTop: 50,
    paddingTop: 34,
    borderTop: `1px solid ${C.border}`,
  },
  statVal: {
    fontFamily: "'Syne','Inter',sans-serif",
    fontSize: "1.9rem",
    fontWeight: 800,
    background: `linear-gradient(135deg,${C.cyan},${C.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statLbl: { fontSize: "0.78rem", color: C.muted, marginTop: 2 },
  // SECTIONS
  section: { padding: "104px 5%", position: "relative", zIndex: 2 },
  sectionAlt: {
    padding: "104px 5%",
    background: "rgba(10,15,30,0.5)",
    position: "relative",
    zIndex: 2,
  },
  sectionInner: { maxWidth: 1200, margin: "0 auto" },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "0.75rem",
    color: C.cyan,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "'Syne','Inter',sans-serif",
    fontSize: "clamp(1.9rem,3.6vw,3rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: 16,
  },
  sectionDesc: {
    color: C.muted,
    fontSize: "0.98rem",
    lineHeight: 1.7,
    maxWidth: 500,
  },
  // GLASS CARD base
  glass: {
    background:
      "linear-gradient(160deg, rgba(20,28,48,0.7), rgba(10,15,30,0.55))",
    border: `1px solid ${C.border}`,
    borderRadius: 18,
    padding: 24,
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  },
  formInput: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(5,7,15,0.6)",
    border: `1px solid ${C.border}`,
    borderRadius: 11,
    color: C.white,
    fontFamily: "'Inter',sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  },
  formLabel: {
    display: "block",
    fontSize: "0.78rem",
    color: C.muted,
    marginBottom: 6,
    fontFamily: "'JetBrains Mono',monospace",
  },
}

// ── Global styles + keyframes ────────────────────────────────────────────────

function InjectStyles() {
  useEffect(() => {
    const id = "nv-portfolio-styles"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id = id
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes spin  { to{transform:rotate(360deg)} }
      @keyframes float1{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes float2{ 0%,100%{transform:translateY(-6px)} 50%{transform:translateY(8px)} }
      @keyframes floatOrb{ 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-26px,0)} }
      @keyframes auroraMove{
        0%{transform:translate(0,0) scale(1)}
        33%{transform:translate(6%,-4%) scale(1.15)}
        66%{transform:translate(-5%,5%) scale(0.92)}
        100%{transform:translate(0,0) scale(1)}
      }
      @keyframes shine{ 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
      @keyframes gridDrift{ from{background-position:0 0} to{background-position:60px 60px} }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: ${C.navy}; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #05070F; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(${C.blue},${C.cyan}); border-radius: 3px; }
      @media (hover:hover) and (pointer:fine){ * { cursor: none; } }
      @media (max-width: 860px){
        .nv-hero-inner{ grid-template-columns: 1fr !important; gap: 40px !important; text-align:center; }
        .nv-hero-photo{ order: -1; }
        .nv-two-col{ grid-template-columns: 1fr !important; gap: 40px !important; }
        .nv-hero-stats{ justify-content:center; }
        .nv-cursor, .nv-cursor-dot { display:none !important; }
      }
    `
    document.head.appendChild(style)
  }, [])
  return null
}

// ── Scroll-reveal hook ───────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(34px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) ${delay}s`,
    } as React.CSSProperties,
  }
}

// ── 3D tilt hook — mouse-tracked rotateX/rotateY with glare ─────────────────

function useTilt(max = 12) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      setT({
        rx: (0.5 - py) * max * 2,
        ry: (px - 0.5) * max * 2,
        gx: px * 100,
        gy: py * 100,
        active: true,
      })
    },
    [max]
  )
  const onLeave = useCallback(
    () => setT({ rx: 0, ry: 0, gx: 50, gy: 50, active: false }),
    []
  )

  const transform = `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateY(${
    t.active ? -6 : 0
  }px) scale(${t.active ? 1.02 : 1})`

  return { ref, onMove, onLeave, transform, glare: t }
}

// ── Magnetic wrapper — element drifts toward the cursor ─────────────────────

function Magnetic({
  children,
  strength = 0.35,
  style,
}: {
  children: React.ReactNode
  strength?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [d, setD] = useState({ x: 0, y: 0 })
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        setD({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        })
      }}
      onMouseLeave={() => setD({ x: 0, y: 0 })}
      style={{
        display: "inline-block",
        transform: `translate(${d.x}px, ${d.y}px)`,
        transition: "transform 0.25s cubic-bezier(0.2,0.8,0.2,1)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Follower cursor (glow ring + dot) ────────────────────────────────────────

function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return
    let rx = 0, ry = 0, x = 0, y = 0
    let raf = 0
    const move = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (dot.current)
        dot.current.style.transform = `translate(${x - 3}px,${y - 3}px)`
      const t = e.target as HTMLElement
      const interactive = t.closest("button,a,input,textarea,[data-hov]")
      if (ring.current)
        ring.current.style.setProperty(
          "--s",
          interactive ? "2.2" : "1"
        )
    }
    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (ring.current)
        ring.current.style.transform = `translate(${rx - 18}px,${ry - 18}px) scale(var(--s,1))`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener("mousemove", move)
    loop()
    return () => {
      window.removeEventListener("mousemove", move)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <>
      <div
        ref={ring}
        className="nv-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `1.5px solid ${C.cyan}`,
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
          transition: "transform 0.06s linear",
          boxShadow: `0 0 22px rgba(6,182,212,0.5)`,
        }}
      />
      <div
        ref={dot}
        className="nv-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: C.white,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  )
}

// ── Particle constellation canvas (fixed, full-page background) ─────────────

function ParticleField() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    let w = (cv.width = window.innerWidth)
    let h = (cv.height = window.innerHeight)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const COUNT = Math.min(90, Math.floor((w * h) / 18000))
    const mouse = { x: -999, y: -999 }
    type P = { x: number; y: number; vx: number; vy: number; r: number }
    const pts: P[] = Array.from({ length: COUNT }, (_, i) => ({
      x: ((i * 9301 + 49297) % 233280) / 233280 * w,
      y: ((i * 49297 + 9301) % 233280) / 233280 * h,
      vx: (((i * 7 + 3) % 10) / 10 - 0.5) * 0.35,
      vy: (((i * 13 + 5) % 10) / 10 - 0.5) * 0.35,
      r: 0.8 + ((i * 17) % 10) / 10 * 1.4,
    }))
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onResize = () => {
      w = cv.width = window.innerWidth
      h = cv.height = window.innerHeight
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("resize", onResize)

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        // gentle mouse attraction
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 160) {
          p.x += (dx / dist) * 0.4
          p.y += (dy / dist) * 0.4
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(120,170,255,0.55)"
        ctx.fill()
      }
      // links
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(80,140,255,${0.14 * (1 - d / 120)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("resize", onResize)
    }
  }, [])
  return (
    <canvas
      ref={canvas}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />
  )
}

// ── Aurora blobs + grid backdrop (fixed) ─────────────────────────────────────

function Backdrop() {
  const blob = (
    color: string,
    size: number,
    top: string,
    left: string,
    dur: number,
    delay = 0
  ): React.CSSProperties => ({
    position: "absolute",
    top,
    left,
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
    filter: "blur(60px)",
    animation: `auroraMove ${dur}s ease-in-out ${delay}s infinite`,
    willChange: "transform",
  })
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(99,140,255,0.045) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(99,140,255,0.045) 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "gridDrift 24s linear infinite",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)",
        }}
      />
      <div style={blob("rgba(59,130,246,0.30)", 520, "-6%", "-4%", 22)} />
      <div style={blob("rgba(6,182,212,0.24)", 460, "40%", "62%", 26, 3)} />
      <div style={blob("rgba(139,92,246,0.22)", 480, "68%", "8%", 30, 6)} />
      <div style={blob("rgba(236,72,153,0.14)", 380, "10%", "70%", 28, 2)} />
    </div>
  )
}

// ── NavDropdown ──────────────────────────────────────────────────────────────

function NavDropdown({
  label,
  items,
  onNav,
}: {
  label: string
  items: { icon: string; text: string; id: string }[]
  onNav: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <li
      style={S.navItem}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button style={{ ...S.navLink, color: open ? C.cyan : C.muted }}>
        {label} ▾
      </button>
      {open && (
        <div style={S.dropdown}>
          {items.map((it) => (
            <button
              key={it.id + it.text}
              style={S.dropItem}
              data-hov
              onMouseEnter={(e) => {
                ;(e.target as HTMLElement).style.background =
                  "rgba(99,140,255,0.12)"
                ;(e.target as HTMLElement).style.color = C.cyan
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLElement).style.background = "none"
                ;(e.target as HTMLElement).style.color = C.muted
              }}
              onClick={() => {
                onNav(it.id)
                setOpen(false)
              }}
            >
              {it.icon} {it.text}
            </button>
          ))}
        </div>
      )}
    </li>
  )
}

// ── Tag ──────────────────────────────────────────────────────────────────────

function Tag({
  label,
  color = "blue",
}: {
  label: string
  color?: "blue" | "cyan" | "purple" | "green"
}) {
  const colors = {
    blue: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.28)", text: "#93B4FF" },
    cyan: { bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.28)", text: C.cyan },
    purple: { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.28)", text: "#B79CFF" },
    green: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.28)", text: "#5FE59A" },
  }
  return (
    <span
      style={{
        padding: "4px 11px",
        borderRadius: 7,
        fontSize: "0.73rem",
        fontFamily: "'JetBrains Mono',monospace",
        background: colors[color].bg,
        border: `1px solid ${colors[color].border}`,
        color: colors[color].text,
      }}
    >
      {label}
    </span>
  )
}

// ── Tilt-enabled glass card shell with glare ────────────────────────────────

function TiltCard({
  children,
  style,
  accent = C.blue,
  max = 10,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  accent?: string
  max?: number
}) {
  const tilt = useTilt(max)
  return (
    <div
      ref={tilt.ref}
      data-hov
      onMouseMove={tilt.onMove}
      onMouseLeave={tilt.onLeave}
      style={{
        ...S.glass,
        transform: tilt.transform,
        transition: "transform 0.15s ease, border-color 0.25s, box-shadow 0.25s",
        borderColor: tilt.glare.active ? accent : C.border,
        boxShadow: tilt.glare.active
          ? `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${accent}22`
          : "0 10px 30px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* glare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          opacity: tilt.glare.active ? 1 : 0,
          transition: "opacity 0.25s",
          background: `radial-gradient(340px circle at ${tilt.glare.gx}% ${tilt.glare.gy}%, ${accent}20, transparent 60%)`,
        }}
      />
      <div style={{ position: "relative", transform: "translateZ(30px)" }}>
        {children}
      </div>
    </div>
  )
}

// ── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({
  icon,
  title,
  tags,
  color,
}: {
  icon: string
  title: string
  tags: string[]
  color: "blue" | "cyan" | "purple" | "green"
}) {
  const accents = {
    blue: C.blue,
    cyan: C.cyan,
    purple: C.purple,
    green: "#22C55E",
  }
  const bgColors: Record<string, string> = {
    blue: "59,130,246",
    cyan: "6,182,212",
    purple: "139,92,246",
    green: "34,197,94",
  }
  return (
    <TiltCard accent={accents[color]} max={12}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            background: `rgba(${bgColors[color]},0.18)`,
            border: `1px solid rgba(${bgColors[color]},0.35)`,
            boxShadow: `0 8px 20px rgba(${bgColors[color]},0.2)`,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontFamily: "'Syne','Inter',sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {tags.map((t) => (
          <Tag key={t} label={t} color={color} />
        ))}
      </div>
    </TiltCard>
  )
}

// ── ProjCard ─────────────────────────────────────────────────────────────────

function ProjCard({
  badge,
  title,
  desc,
  tags,
  period,
  accent = "cyan",
  flag,
}: {
  badge: string
  title: string
  desc: string
  tags: { label: string; color: "blue" | "cyan" | "purple" | "green" }[]
  period: string
  accent?: "blue" | "cyan" | "purple" | "green"
  flag?: string
}) {
  const accents = { blue: C.blue, cyan: C.cyan, purple: C.purple, green: "#22C55E" }
  return (
    <TiltCard
      accent={accents[accent]}
      max={9}
      style={{ borderRadius: 22, padding: 28 }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg,${accents[accent]},${C.cyan},transparent)`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 11px",
            borderRadius: 7,
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.25)",
            fontSize: "0.72rem",
            fontFamily: "'JetBrains Mono',monospace",
            color: C.cyan,
          }}
        >
          {badge}
        </span>
        {flag && (
          <span
            style={{
              padding: "4px 11px",
              borderRadius: 7,
              background: "rgba(236,72,153,0.1)",
              border: "1px solid rgba(236,72,153,0.28)",
              fontSize: "0.72rem",
              fontFamily: "'JetBrains Mono',monospace",
              color: "#F9A8D4",
            }}
          >
            {flag}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: "'Syne','Inter',sans-serif",
          fontWeight: 800,
          fontSize: "1.15rem",
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div
        style={{ fontSize: "0.88rem", color: C.muted, lineHeight: 1.7, marginBottom: 20 }}
      >
        {desc}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
        {tags.map((t) => (
          <Tag key={t.label} label={t.label} color={t.color} />
        ))}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "0.72rem",
            color: C.muted,
          }}
        >
          {period}
        </span>
        <span style={{ fontSize: "0.8rem", color: C.cyan, fontWeight: 600 }}>
          View Details →
        </span>
      </div>
    </TiltCard>
  )
}

// ── ContactLink ──────────────────────────────────────────────────────────────

function ContactLink({
  icon,
  label,
  value,
  href,
  iconBg,
}: {
  icon: string
  label: string
  value: string
  href: string
  iconBg: string
}) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-hov
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 22px",
        borderRadius: 15,
        ...S.glass,
        borderColor: hov ? C.cyan : C.border,
        textDecoration: "none",
        color: C.white,
        transition: "all 0.25s",
        transform: hov ? "translateX(6px)" : "none",
        boxShadow: hov ? `0 14px 34px rgba(6,182,212,0.2)` : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.15rem",
          background: iconBg,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.78rem", color: C.muted, marginBottom: 2 }}>
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Syne','Inter',sans-serif",
            fontWeight: 600,
            fontSize: "0.92rem",
          }}
        >
          {value}
        </div>
      </div>
    </a>
  )
}

// ── EmailJS ──────────────────────────────────────────────────────────────────

emailjs.init("ARW68QPGWvlp0XDwP")

async function sendEmail(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  try {
    const res = await emailjs.send("service_x9jvj28", "template_sf86ezf", {
      from_name: name,
      from_email: email,
      message: message,
      to_email: "nagendrayounger@gmail.com",
    })
    return res.status === 200
  } catch (err) {
    console.error("EmailJS error:", err)
    return false
  }
}

// ── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle")

  const submit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("err")
      return
    }
    setStatus("sending")
    const ok = await sendEmail(name, email, message)
    setStatus(ok ? "ok" : "err")
    if (ok) {
      setName("")
      setEmail("")
      setMessage("")
    }
  }

  const focusRing = (e: React.FocusEvent<HTMLElement>) => {
    e.target.style.borderColor = C.cyan
    e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.15)"
  }
  const blurRing = (e: React.FocusEvent<HTMLElement>) => {
    e.target.style.borderColor = C.border
    e.target.style.boxShadow = "none"
  }

  return (
    <div style={{ ...S.glass, borderRadius: 22, padding: 32 }}>
      <div
        style={{
          fontFamily: "'Syne','Inter',sans-serif",
          fontWeight: 700,
          fontSize: "1.15rem",
          marginBottom: 20,
        }}
      >
        Send a message
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={S.formLabel}>name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={focusRing}
          onBlur={blurRing}
          placeholder="Your name"
          style={S.formInput}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.formLabel}>email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={focusRing}
          onBlur={blurRing}
          placeholder="your@email.com"
          type="email"
          style={S.formInput}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={S.formLabel}>message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={focusRing}
          onBlur={blurRing}
          placeholder="Tell me about your project..."
          rows={4}
          style={{ ...S.formInput, resize: "vertical", height: 100 }}
        />
      </div>

      <button
        onClick={submit}
        disabled={status === "sending"}
        data-hov
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
          border: "none",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.92rem",
          cursor: status === "sending" ? "wait" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
          boxShadow: "0 10px 26px rgba(6,182,212,0.3)",
        }}
      >
        {status === "sending" ? "Sending…" : "Send Message →"}
      </button>

      {status === "ok" && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 16px",
            borderRadius: 11,
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22C55E",
            fontSize: "0.87rem",
            textAlign: "center",
          }}
        >
          ✅ Message sent! Nagendra will reply shortly.
        </div>
      )}
      {status === "err" && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 16px",
            borderRadius: 11,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#EF4444",
            fontSize: "0.87rem",
            textAlign: "center",
          }}
        >
          {!name.trim() || !email.trim() || !message.trim()
            ? "⚠️ Please fill in all fields."
            : "❌ Send failed. Please email directly: nagendrayounger@gmail.com"}
        </div>
      )}
    </div>
  )
}

// ── Hero photo with 3D depth + floating orbs ────────────────────────────────

function HeroPhoto({ px, py }: { px: number; py: number }) {
  return (
    <div className="nv-hero-photo" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: 320,
          height: 320,
          transformStyle: "preserve-3d",
          transform: `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {/* glow disc */}
        <div
          style={{
            position: "absolute",
            inset: -30,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(6,182,212,0.35), transparent 65%)`,
            filter: "blur(30px)",
            transform: "translateZ(-60px)",
          }}
        />
        {/* rotating rings */}
        <div
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: "50%",
            border: `2px solid rgba(6,182,212,0.5)`,
            animation: "spin 10s linear infinite",
            transform: "translateZ(-20px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -34,
            borderRadius: "50%",
            border: `1px dashed rgba(139,92,246,0.35)`,
            animation: "spin 24s linear infinite reverse",
            transform: "translateZ(-40px)",
          }}
        />
        <img
          src="https://res.cloudinary.com/dle4xx8gm/image/upload/v1781023556/Screenshot_2026-06-09_221259_mfy22u.png"
          alt="Nagendra Verma"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "top",
            border: `3px solid rgba(99,140,255,0.4)`,
            position: "relative",
            zIndex: 1,
            boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
            transform: "translateZ(40px)",
          }}
        />
        {/* floating tech chips */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: -46,
            background: "rgba(14,20,36,0.85)",
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "9px 15px",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "0.74rem",
            color: C.cyan,
            whiteSpace: "nowrap",
            backdropFilter: "blur(10px)",
            zIndex: 3,
            transform: "translateZ(80px)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
            animation: "float1 4s ease-in-out infinite",
          }}
        >
          ⚡ Spring Boot
        </div>
        <div
          style={{
            position: "absolute",
            top: 14,
            left: -62,
            background: "rgba(14,20,36,0.85)",
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "9px 15px",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "0.74rem",
            color: "#B79CFF",
            whiteSpace: "nowrap",
            backdropFilter: "blur(10px)",
            zIndex: 3,
            transform: "translateZ(70px)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
            animation: "float2 5s ease-in-out infinite",
          }}
        >
          ☁️ AWS + Docker
        </div>
        <div
          style={{
            position: "absolute",
            top: -26,
            right: 30,
            background: "rgba(14,20,36,0.85)",
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "8px 14px",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "0.72rem",
            color: "#5FE59A",
            whiteSpace: "nowrap",
            backdropFilter: "blur(10px)",
            zIndex: 3,
            transform: "translateZ(90px)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
            animation: "floatOrb 6s ease-in-out infinite",
          }}
        >
          🗺️ CADOps
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function NagendraPortfolio() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  // hero mouse parallax
  const [par, setPar] = useState({ x: 0, y: 0 })
  const onHeroMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setPar({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    })
  }

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal()
  const r4 = useReveal(), r5 = useReveal(), r6 = useReveal()
  const r7 = useReveal(), r8 = useReveal()

  return (
    <div style={S.root}>
      <InjectStyles />
      <Backdrop />
      <ParticleField />
      <Cursor />

      {/* ── NAV ── */}
      <nav style={S.nav}>
        <div style={S.navLogo} data-hov onClick={() => scrollTo("hero")}>
          NV
        </div>
        <ul style={S.navLinks}>
          <li style={S.navItem}>
            <button style={S.navLink} data-hov onClick={() => scrollTo("hero")}>
              Home
            </button>
          </li>
          <NavDropdown
            label="About"
            onNav={scrollTo}
            items={[
              { icon: "👤", text: "Profile", id: "about" },
              { icon: "🎓", text: "Education", id: "education" },
            ]}
          />
          <NavDropdown
            label="Work"
            onNav={scrollTo}
            items={[
              { icon: "💼", text: "Experience", id: "experience" },
              { icon: "🚀", text: "Projects", id: "projects" },
            ]}
          />
          <NavDropdown
            label="Skills"
            onNav={scrollTo}
            items={[
              { icon: "⚡", text: "Tech Stack", id: "skills" },
              { icon: "🛠️", text: "Tools & Infra", id: "skills" },
            ]}
          />
          <li style={S.navItem}>
            <button style={S.navLink} data-hov onClick={() => scrollTo("contact")}>
              Contact
            </button>
          </li>
        </ul>
        <Magnetic strength={0.4}>
          <button style={S.navCta} data-hov onClick={() => scrollTo("contact")}>
            Hire Me
          </button>
        </Magnetic>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={S.hero} onMouseMove={onHeroMove}>
        <div
          className="nv-hero-inner"
          style={{
            ...S.heroInner,
            transform: `translate3d(${par.x * -18}px, ${par.y * -18}px, 0)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div style={{ transform: `translate3d(${par.x * 14}px, ${par.y * 14}px, 0)` }}>
            <div style={S.badge}>
              <span style={S.dot} />
              Available for opportunities
            </div>
            <h1 style={S.heroTitle}>
              Nagendra
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg,${C.blue},${C.cyan},${C.purple},${C.cyan},${C.blue})`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shine 6s linear infinite",
                }}
              >
                Verma
              </span>
            </h1>
            <p style={S.heroSub}>
              Full Stack Java Developer crafting scalable, cloud-native systems.
              Specialized in Spring Boot, microservices, and enterprise-grade
              platforms that handle real-world complexity at scale.
            </p>
            <div style={S.heroActions}>
              <Magnetic strength={0.3}>
                <button style={S.btnPrimary} data-hov onClick={() => scrollTo("projects")}>
                  View My Work →
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button style={S.btnOutline} data-hov onClick={() => scrollTo("contact")}>
                  Get in Touch
                </button>
              </Magnetic>
            </div>
            <div className="nv-hero-stats" style={S.heroStats}>
              {[
                ["4+", "Major Projects"],
                ["8.3", "CGPA (MCA)"],
                ["10+", "Technologies"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div style={S.statVal}>{v}</div>
                  <div style={S.statLbl}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroPhoto px={par.x} py={par.y} />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={S.sectionAlt}>
        <div style={S.sectionInner}>
          <div
            ref={r1.ref}
            className="nv-two-col"
            style={{
              ...r1.style,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div>
              <div style={S.eyebrow}>
                <span style={{ width: 24, height: 1, background: C.cyan, display: "block" }} />
                About Me
              </div>
              <h2 style={S.sectionTitle}>
                Building systems that{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  actually scale
                </span>
              </h2>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 14, fontSize: "0.95rem" }}>
                I'm a <strong style={{ color: C.white }}>Full Stack Java Developer</strong>{" "}
                currently working at <strong style={{ color: C.white }}>Techxplore IT Solutions</strong>,
                designing and building production-grade systems for government and
                institutional clients across India and the US.
              </p>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 14, fontSize: "0.95rem" }}>
                My work spans the full engineering spectrum — from architecting{" "}
                <strong style={{ color: C.white }}>multi-tenant Spring Boot backends</strong> with
                JWT security, to React frontends, to containerized deployments on AWS.
              </p>
              <p style={{ color: C.muted, lineHeight: 1.8, fontSize: "0.95rem" }}>
                I believe great software comes from deeply understanding the problem.
                Whether it's a biometric auth flow or a geo-optimized routing engine,
                I think systems-first.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "🏢 Current Role", sub: "Techxplore IT Solutions", desc: "Software Development Engineer · June 2025 – Present", accent: C.blue },
                { title: "🎓 Education", sub: "MCA — Mangalayatan University", desc: "2023–2025 · CGPA 8.3 · Aligarh, UP", accent: C.cyan },
                { title: "📍 Location", sub: "Lucknow, Uttar Pradesh", desc: "Open to remote & on-site roles across India", accent: C.purple },
                { title: "💡 Approach", sub: "Systems-first engineering", desc: "Architecture, security, performance — then code. Every time.", accent: "#22C55E" },
              ].map((c) => (
                <TiltCard key={c.title} accent={c.accent} max={8}>
                  <div style={{ fontFamily: "'Syne','Inter',sans-serif", fontWeight: 700, marginBottom: 4 }}>
                    {c.title}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", color: C.cyan, marginBottom: 6 }}>
                    {c.sub}
                  </div>
                  <div style={{ fontSize: "0.83rem", color: C.muted }}>{c.desc}</div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={S.section}>
        <div style={S.sectionInner}>
          <div ref={r2.ref} style={r2.style}>
            <div style={S.eyebrow}>
              <span style={{ width: 24, height: 1, background: C.cyan, display: "block" }} />
              Tech Stack
            </div>
            <h2 style={S.sectionTitle}>Skills &amp; Technologies</h2>
            <p style={S.sectionDesc}>
              A curated stack built through production experience, not just tutorials.
            </p>
          </div>
          <div
            ref={r3.ref}
            style={{
              ...r3.style,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: 18,
              marginTop: 52,
            }}
          >
            <SkillCard icon="☕" title="Languages" color="blue" tags={["Java", "JavaScript", "TypeScript", "SQL", "C / C++"]} />
            <SkillCard icon="🔧" title="Backend / APIs" color="cyan" tags={["Spring Boot", "Spring Security", "Spring Data JPA", "Hibernate", "REST APIs", "JWT / OAuth2", "Keycloak"]} />
            <SkillCard icon="🏗️" title="Architecture" color="purple" tags={["Microservices", "Modular Monolith", "Multi-Tenant", "Event-Driven"]} />
            <SkillCard icon="☁️" title="Cloud & DevOps" color="green" tags={["AWS EC2", "AWS S3", "AWS SES", "AWS STS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"]} />
            <SkillCard icon="🗄️" title="Databases & Messaging" color="blue" tags={["PostgreSQL", "MySQL", "MongoDB", "Redis", "RabbitMQ", "Kafka", "Flyway"]} />
            <SkillCard icon="🧪" title="Testing & Tools" color="cyan" tags={["JUnit5", "Mockito", "Maven", "Git", "Postman", "Vite", "IntelliJ IDEA"]} />
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={S.sectionAlt}>
        <div style={S.sectionInner}>
          <div ref={r4.ref} style={r4.style}>
            <div style={S.eyebrow}>
              <span style={{ width: 24, height: 1, background: C.cyan, display: "block" }} />
              Projects
            </div>
            <h2 style={S.sectionTitle}>Selected Work</h2>
            <p style={S.sectionDesc}>
              Production systems built for real clients, handling real scale.
            </p>
          </div>
          <div
            ref={r5.ref}
            style={{
              ...r5.style,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
              gap: 22,
              marginTop: 52,
            }}
          >
            <ProjCard
              badge="🏢 TechXplore IT Solutions"
              flag="🇺🇸 US Government"
              accent="purple"
              title="CADOps — Case Management & Route Automation Platform"
              desc="Field operations platform that automates case assignment and route planning at scale. Geo-clusters cases into service regions, optimizes and sequences field routes, and publishes them to field agents — with configurable per-field timing, audit trails, and one-click route publishing for dispatch teams."
              tags={[
                { label: "Spring Boot", color: "cyan" },
                { label: "Java", color: "blue" },
                { label: "PostgreSQL", color: "blue" },
                { label: "Flyway", color: "green" },
                { label: "React", color: "cyan" },
                { label: "TypeScript", color: "blue" },
                { label: "Vite", color: "purple" },
              ]}
              period="Jan 2026 – Present"
            />
            <ProjCard
              badge="🏢 TechXplore IT Solutions"
              accent="cyan"
              title="Pan-India Offline Examination Management Platform"
              desc="Secure offline exam platform for government and institutional exams. Covers candidate management, centre operations, room allocation, invigilator assignment, attendance tracking, and tamper-proof question paper distribution."
              tags={[
                { label: "Spring Boot", color: "cyan" },
                { label: "PostgreSQL", color: "blue" },
                { label: "AWS S3/SES", color: "green" },
                { label: "RabbitMQ", color: "purple" },
                { label: "Redis", color: "blue" },
                { label: "JWT", color: "cyan" },
              ]}
              period="Jan 2026 – Present"
            />
            <ProjCard
              badge="🏢 TechXplore IT Solutions"
              accent="blue"
              title="Biometric Verification & Candidate Authentication System"
              desc="Fraud-proof candidate identity validation integrated with the exam platform. Supports offline biometric workflows, real-time matching, controlled access enforcement, and async audit logging via RabbitMQ."
              tags={[
                { label: "Spring Boot", color: "cyan" },
                { label: "Biometric APIs", color: "blue" },
                { label: "AWS S3", color: "green" },
                { label: "RabbitMQ", color: "purple" },
                { label: "Redis", color: "blue" },
                { label: "Docker", color: "green" },
              ]}
              period="Jan 2026 – Present"
            />
            <ProjCard
              badge="🏢 TechXplore IT Solutions"
              accent="green"
              title="Fixie — Service Marketplace Platform"
              desc="Full-stack backend for a service marketplace: user onboarding, booking workflows, provider operations, and payments. Led migration from microservices to modular monolith, cutting costs by over 94%."
              tags={[
                { label: "Spring Boot", color: "cyan" },
                { label: "RabbitMQ", color: "purple" },
                { label: "Redis", color: "blue" },
                { label: "Kubernetes", color: "green" },
                { label: "GitHub Actions", color: "green" },
                { label: "AWS", color: "green" },
              ]}
              period="Jun 2025 – Present"
            />
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={S.section}>
        <div style={S.sectionInner}>
          <div ref={r6.ref} style={r6.style}>
            <div style={S.eyebrow}>
              <span style={{ width: 24, height: 1, background: C.cyan, display: "block" }} />
              Experience
            </div>
            <h2 style={S.sectionTitle}>Work History</h2>
          </div>
          <div
            ref={r7.ref}
            style={{ ...r7.style, marginTop: 52, position: "relative", paddingLeft: 80 }}
          >
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 0,
                bottom: 0,
                width: 2,
                background: `linear-gradient(to bottom,${C.blue},${C.cyan},transparent)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: C.card,
                border: `2px solid ${C.blue}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                zIndex: 1,
                boxShadow: `0 0 24px rgba(59,130,246,0.5)`,
              }}
            >
              💼
            </div>
            <TiltCard accent={C.blue} max={5} style={{ borderRadius: 18, padding: 28 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.78rem", color: C.cyan, marginBottom: 4 }}>
                TECHXPLORE IT SOLUTIONS
              </div>
              <div style={{ fontFamily: "'Syne','Inter',sans-serif", fontWeight: 800, fontSize: "1.15rem", marginBottom: 6 }}>
                Software Development Engineer
              </div>
              <div style={{ fontSize: "0.8rem", color: C.muted, marginBottom: 18 }}>
                June 2025 – Present · Lucknow, India
              </div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Built CADOps, a US-government field-operations platform that geo-clusters cases into service regions and auto-optimizes field agent routes with audit trails and one-click dispatch publishing.",
                  "Led backend architecture transformation — migrated microservices to modular monolith and moved Hive/Presto workloads to AWS EMR, reducing operational costs by over 94%.",
                  "Developed asynchronous email notification systems using Spring Boot, RabbitMQ, and AWS SES with retry and dead-letter queue handling.",
                  "Designed secure REST APIs with JWT/OAuth2 authentication and role-based authorization.",
                  "Built scalable backend modules for user management, booking workflows, support systems, and provider payments.",
                  "Improved application performance using Redis caching and asynchronous processing.",
                  "Implemented database migration strategies using Flyway/Liquibase and PostgreSQL.",
                  "Containerized applications with Docker and Kubernetes to support CI/CD deployments.",
                ].map((pt, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: "0.88rem", color: C.muted, lineHeight: 1.6 }}>
                    <span style={{ color: C.cyan, flexShrink: 0, marginTop: 1 }}>▹</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" style={S.sectionAlt}>
        <div style={S.sectionInner}>
          <div ref={r8.ref} style={r8.style}>
            <div style={S.eyebrow}>
              <span style={{ width: 24, height: 1, background: C.cyan, display: "block" }} />
              Education
            </div>
            <h2 style={S.sectionTitle}>Academic Background</h2>
            <div style={{ maxWidth: 560, marginTop: 48 }}>
              <TiltCard accent={C.cyan} max={7} style={{ borderRadius: 22, padding: 36 }}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 15,
                      flexShrink: 0,
                      background: `linear-gradient(135deg,rgba(59,130,246,0.25),rgba(6,182,212,0.25))`,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                    }}
                  >
                    🎓
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne','Inter',sans-serif", fontWeight: 800, fontSize: "1.08rem", marginBottom: 4 }}>
                      Master of Computer Applications (MCA)
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.82rem", color: C.cyan, marginBottom: 6 }}>
                      Mangalayatan University, Aligarh
                    </div>
                    <div style={{ fontSize: "0.82rem", color: C.muted }}>
                      2023 – 2025 · Aligarh, Uttar Pradesh, India
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        marginTop: 12,
                        padding: "4px 12px",
                        borderRadius: 7,
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.25)",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "0.8rem",
                        color: C.cyan,
                      }}
                    >
                      CGPA: 8.3 / 10
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.eyebrow}>
            <span style={{ width: 24, height: 1, background: C.cyan, display: "block" }} />
            Contact
          </div>
          <h2 style={S.sectionTitle}>
            Let's build something{" "}
            <span
              style={{
                background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              great together
            </span>
          </h2>
          <p style={{ ...S.sectionDesc, marginBottom: 52 }}>
            Open to full-time roles, freelance projects, and interesting
            engineering challenges.
          </p>
          <div
            className="nv-two-col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "start" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ContactLink icon="📧" label="Email" value="nagendrayounger@gmail.com" href="mailto:nagendrayounger@gmail.com" iconBg="rgba(59,130,246,0.15)" />
              <ContactLink icon="📱" label="Phone" value="+91 91514 05069" href="tel:+919151405069" iconBg="rgba(6,182,212,0.15)" />
              <ContactLink icon="💼" label="LinkedIn" value="linkedin.com/in/nagendra-verma" href="https://linkedin.com/in/nagendra-verma-8a60372b2/" iconBg="rgba(139,92,246,0.15)" />
              <ContactLink icon="🐙" label="GitHub" value="github.com/nagenDev" href="https://github.com/nagenDev" iconBg="rgba(34,197,94,0.15)" />
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "rgba(10,15,30,0.6)",
          borderTop: `1px solid ${C.border}`,
          padding: "40px 5%",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: "'Syne','Inter',sans-serif",
            fontSize: "1.3rem",
            fontWeight: 800,
            background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}
        >
          Nagendra Verma
        </div>
        <p style={{ fontSize: "0.82rem", color: C.muted }}>
          Full Stack Java Developer · Lucknow, India · Built with ♥ and Spring Boot
        </p>
      </footer>
    </div>
  )
}
