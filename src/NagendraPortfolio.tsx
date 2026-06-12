// Nagendra Verma — Portfolio
// EmailJS — messages go to nagendrayounger@gmail.com
// Uses your Gmail app password via EmailJS service (no backend needed)

import { useState, useEffect, useRef } from "react"
import emailjs from "@emailjs/browser"

// ── Inline styles (no external CSS files) ──────────────────────────────

const C = {
  navy: "#0A0F1E",
  slate: "#0F1628",
  card: "#111827",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  purple: "#8B5CF6",
  white: "#F0F4FF",
  muted: "#8B9CC8",
  border: "rgba(59,130,246,0.15)",
}

const S: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    background: C.navy,
    color: C.white,
    overflowX: "hidden",
    minHeight: "100vh",
    scrollBehavior: "smooth",
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
    height: 64,
    background: "rgba(10,15,30,0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${C.border}`,
  },
  navLogo: {
    fontFamily: "'Syne', 'Inter', sans-serif",
    fontWeight: 800,
    fontSize: "1.1rem",
    background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    cursor: "pointer",
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
    background: "rgba(15,22,40,0.98)",
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    zIndex: 200,
  },
  dropItem: {
    display: "block",
    width: "100%",
    padding: "9px 14px",
    fontSize: "0.82rem",
    color: C.muted,
    cursor: "pointer",
    borderRadius: 8,
    background: "none",
    border: "none",
    textAlign: "left" as const,
    transition: "background 0.15s, color 0.15s",
  },
  navCta: {
    padding: "8px 20px",
    background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "0.82rem",
    color: "#fff",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  // HERO
  hero: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "80px 5% 0",
    position: "relative" as const,
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute" as const,
    inset: 0,
    background: `radial-gradient(ellipse 80% 60% at 60% 40%, rgba(59,130,246,0.08) 0%, transparent 70%),
                 radial-gradient(ellipse 50% 50% at 80% 80%, rgba(6,182,212,0.06) 0%, transparent 60%)`,
    pointerEvents: "none" as const,
  },
  gridLines: {
    position: "absolute" as const,
    inset: 0,
    backgroundImage: `linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)`,
    backgroundSize: "60px 60px",
    pointerEvents: "none" as const,
  },
  heroInner: {
    position: "relative" as const,
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 80,
    alignItems: "center",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid rgba(6,182,212,0.3)",
    background: "rgba(6,182,212,0.08)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.78rem",
    color: C.cyan,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: C.cyan,
    animation: "pulse 2s infinite",
  },
  heroTitle: {
    fontFamily: "'Syne', 'Inter', sans-serif",
    fontSize: "clamp(2.4rem,5vw,4rem)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    marginBottom: 20,
  },
  heroSub: {
    fontSize: "1rem",
    color: C.muted,
    lineHeight: 1.7,
    marginBottom: 36,
    maxWidth: 460,
  },
  heroActions: { display: "flex", gap: 14, flexWrap: "wrap" as const },
  btnPrimary: {
    padding: "13px 28px",
    borderRadius: 10,
    background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.2s",
  },
  btnOutline: {
    padding: "13px 28px",
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: "transparent",
    color: C.white,
    fontWeight: 600,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "border-color 0.2s, transform 0.2s",
  },
  heroStats: {
    display: "flex",
    gap: 32,
    marginTop: 48,
    paddingTop: 32,
    borderTop: `1px solid ${C.border}`,
  },
  statVal: {
    fontFamily: "'Syne','Inter',sans-serif",
    fontSize: "1.8rem",
    fontWeight: 800,
    color: C.cyan,
  },
  statLbl: { fontSize: "0.78rem", color: C.muted, marginTop: 2 },
  // PHOTO
  photoOuter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  photoFrame: { position: "relative" as const, width: 300, height: 300 },
  photoImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover" as const,
    objectPosition: "top",
    border: `3px solid ${C.slate}`,
    position: "relative" as const,
    zIndex: 1,
  },
  photoRing: {
    position: "absolute" as const,
    inset: -16,
    borderRadius: "50%",
    border: `2px solid ${C.blue}`,
    opacity: 0.6,
    animation: "spin 8s linear infinite",
  },
  photoRing2: {
    position: "absolute" as const,
    inset: -28,
    borderRadius: "50%",
    border: `1px dashed rgba(59,130,246,0.2)`,
    animation: "spin 20s linear infinite reverse",
  },
  floatingTag: {
    position: "absolute" as const,
    background: "rgba(20,25,41,0.92)",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "8px 14px",
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "0.72rem",
    color: C.cyan,
    whiteSpace: "nowrap" as const,
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },
  // SECTIONS
  section: { padding: "96px 5%" },
  sectionAlt: { padding: "96px 5%", background: C.slate },
  sectionInner: { maxWidth: 1200, margin: "0 auto" },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "0.75rem",
    color: C.cyan,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "'Syne','Inter',sans-serif",
    fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: 16,
  },
  sectionDesc: {
    color: C.muted,
    fontSize: "0.97rem",
    lineHeight: 1.7,
    maxWidth: 500,
  },
  // CARDS
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 24,
    transition: "border-color 0.2s, transform 0.2s",
  },
  // FORM
  formInput: {
    width: "100%",
    padding: "12px 16px",
    background: C.navy,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    color: C.white,
    fontFamily: "'Inter',sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
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

// ── Keyframes injected once ────────────────────────────────────────────────

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
      @keyframes float1{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes float2{ 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(4px)} }
      @keyframes fadeUp{ from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #0A0F1E; }
      ::-webkit-scrollbar-thumb { background: #3B82F6; border-radius: 2px; }
    `
    document.head.appendChild(style)
  }, [])
  return null
}

// ── Scroll-reveal hook ─────────────────────────────────────────────────────

function useReveal() {
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
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(28px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    },
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

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
      <button style={{ ...S.navLink, color: C.muted }}>{label} ▾</button>
      {open && (
        <div style={S.dropdown}>
          {items.map((it) => (
            <button
              key={it.id}
              style={S.dropItem}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = C.border
                ;(e.target as HTMLElement).style.color = C.cyan
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "none"
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

function Tag({
  label,
  color = "blue",
}: {
  label: string
  color?: "blue" | "cyan" | "purple" | "green"
}) {
  const colors = {
    blue: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: C.blue },
    cyan: { bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)", text: C.cyan },
    purple: { bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)", text: C.purple },
    green: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#22C55E" },
  }
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 6,
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
  const [hov, setHov] = useState(false)
  const bgColors: Record<string, string> = {
    blue: "59,130,246",
    cyan: "6,182,212",
    purple: "139,92,246",
    green: "34,197,94",
  }
  return (
    <div
      style={{
        ...S.card,
        borderColor: hov ? C.blue : C.border,
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            background: `rgba(${bgColors[color]},0.15)`,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontFamily: "'Syne','Inter',sans-serif",
            fontWeight: 700,
            fontSize: "0.97rem",
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
    </div>
  )
}

function ProjCard({
  badge,
  title,
  desc,
  tags,
  period,
}: {
  badge: string
  title: string
  desc: string
  tags: { label: string; color: "blue" | "cyan" | "purple" | "green" }[]
  period: string
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{
        ...S.card,
        borderRadius: 20,
        padding: 28,
        borderColor: hov ? C.blue : C.border,
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 24px 48px rgba(0,0,0,0.4)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg,${C.blue},${C.cyan})`,
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s",
        }}
      />
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 6,
          marginBottom: 16,
          background: "rgba(6,182,212,0.1)",
          border: "1px solid rgba(6,182,212,0.2)",
          fontSize: "0.72rem",
          fontFamily: "'JetBrains Mono',monospace",
          color: C.cyan,
        }}
      >
        {badge}
      </div>
      <div
        style={{
          fontFamily: "'Syne','Inter',sans-serif",
          fontWeight: 800,
          fontSize: "1.1rem",
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "0.87rem",
          color: C.muted,
          lineHeight: 1.7,
          marginBottom: 20,
        }}
      >
        {desc}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          marginBottom: 20,
        }}
      >
        {tags.map((t) => (
          <Tag key={t.label} label={t.label} color={t.color} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
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
        <span
          style={{
            fontSize: "0.8rem",
            color: C.blue,
            fontWeight: 500,
          }}
        >
          View Details →
        </span>
      </div>
    </div>
  )
}

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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 22px",
        borderRadius: 14,
        background: C.card,
        border: `1px solid ${hov ? C.blue : C.border}`,
        textDecoration: "none",
        color: C.white,
        transition: "all 0.2s",
        transform: hov ? "translateX(4px)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          background: iconBg,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: "0.78rem",
            color: C.muted,
            marginBottom: 2,
          }}
        >
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

// ── EmailJS — initialized once, then sends via the SDK ──────────────────
// Public key is set in your EmailJS dashboard: ARW68QPGWvlp0XDwP

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

// ── Contact Form ───────────────────────────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  )

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

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 32,
      }}
    >
      <div
        style={{
          fontFamily: "'Syne','Inter',sans-serif",
          fontWeight: 700,
          fontSize: "1.1rem",
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
          placeholder="Your name"
          style={S.formInput}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.formLabel}>email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          placeholder="Tell me about your project..."
          rows={4}
          style={{ ...S.formInput, resize: "vertical", height: 100 }}
        />
      </div>

      <button
        onClick={submit}
        disabled={status === "sending"}
        style={{
          width: "100%",
          padding: 13,
          borderRadius: 10,
          background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
          border: "none",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: status === "sending" ? "wait" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
        }}
      >
        {status === "sending" ? "Sending…" : "Send Message →"}
      </button>

      {status === "ok" && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 16px",
            borderRadius: 10,
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
            borderRadius: 10,
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

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function NagendraPortfolio() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  const r1 = useReveal(),
    r2 = useReveal(),
    r3 = useReveal()
  const r4 = useReveal(),
    r5 = useReveal(),
    r6 = useReveal()
  const r7 = useReveal(),
    r8 = useReveal()

  return (
    <div style={S.root}>
      <InjectStyles />

      {/* ── NAV ── */}
      <nav style={S.nav}>
        <div style={S.navLogo} onClick={() => scrollTo("hero")}>
          NV
        </div>
        <ul style={S.navLinks}>
          <li style={S.navItem}>
            <button
              style={S.navLink}
              onClick={() => scrollTo("hero")}
            >
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
            <button
              style={S.navLink}
              onClick={() => scrollTo("contact")}
            >
              Contact
            </button>
          </li>
        </ul>
        <button style={S.navCta} onClick={() => scrollTo("contact")}>
          Hire Me
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.gridLines} />
        <div style={S.heroInner}>
          <div>
            <div style={S.badge}>
              <span
                style={{
                  ...S.dot,
                  animation: "pulse 2s infinite",
                }}
              />
              Available for opportunities
            </div>
            <h1 style={S.heroTitle}>
              Nagendra
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg,${C.blue},${C.cyan})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Verma
              </span>
            </h1>
            <p style={S.heroSub}>
              Full Stack Java Developer crafting scalable,
              cloud-native systems. Specialized in Spring Boot,
              microservices, and enterprise-grade platforms that
              handle real-world complexity at scale.
            </p>
            <div style={S.heroActions}>
              <button
                style={S.btnPrimary}
                onClick={() => scrollTo("projects")}
              >
                View My Work →
              </button>
              <button
                style={S.btnOutline}
                onClick={() => scrollTo("contact")}
              >
                Get in Touch
              </button>
            </div>
            <div style={S.heroStats}>
              {[
                ["3+", "Major Projects"],
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
          <div style={S.photoOuter}>
            <div style={S.photoFrame}>
              <div
                style={{
                  ...S.photoRing,
                  animation: "spin 8s linear infinite",
                }}
              />
              <div
                style={{
                  ...S.photoRing2,
                  animation:
                    "spin 20s linear infinite reverse",
                }}
              />
              <img
                src="https://res.cloudinary.com/dle4xx8gm/image/upload/v1781023556/Screenshot_2026-06-09_221259_mfy22u.png"
                alt="Nagendra Verma"
                style={S.photoImg}
              />
              <div
                style={{
                  ...S.floatingTag,
                  bottom: -10,
                  right: -40,
                  animation: "float1 4s ease-in-out infinite",
                }}
              >
                ⚡ Spring Boot
              </div>
              <div
                style={{
                  ...S.floatingTag,
                  top: 10,
                  left: -55,
                  animation: "float2 5s ease-in-out infinite",
                }}
              >
                ☁️ AWS + Docker
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={S.sectionAlt}>
        <div style={S.sectionInner}>
          <div
            ref={r1.ref}
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
                <span
                  style={{
                    width: 24,
                    height: 1,
                    background: C.cyan,
                    display: "block",
                  }}
                />
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
              <p
                style={{
                  color: C.muted,
                  lineHeight: 1.8,
                  marginBottom: 14,
                  fontSize: "0.95rem",
                }}
              >
                I'm a{" "}
                <strong style={{ color: C.white }}>
                  Full Stack Java Developer
                </strong>{" "}
                currently working at{" "}
                <strong style={{ color: C.white }}>
                  Techxplore IT Solutions
                </strong>
                , designing and building production-grade
                systems for government and institutional clients
                across India.
              </p>
              <p
                style={{
                  color: C.muted,
                  lineHeight: 1.8,
                  marginBottom: 14,
                  fontSize: "0.95rem",
                }}
              >
                My work spans the full engineering spectrum —
                from architecting{" "}
                <strong style={{ color: C.white }}>
                  multi-tenant Spring Boot backends
                </strong>{" "}
                with JWT security, to React frontends, to
                containerized deployments on AWS.
              </p>
              <p
                style={{
                  color: C.muted,
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >
                I believe great software comes from deeply
                understanding the problem. Whether it's a
                biometric auth flow or an offline exam platform,
                I think systems-first.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {[
                {
                  title: "🏢 Current Role",
                  sub: "Techxplore IT Solutions",
                  desc: "Software Development Engineer · June 2025 – Present",
                },
                {
                  title: "🎓 Education",
                  sub: "MCA — Mangalayatan University",
                  desc: "2023–2025 · CGPA 8.3 · Aligarh, UP",
                },
                {
                  title: "📍 Location",
                  sub: "Lucknow, Uttar Pradesh",
                  desc: "Open to remote & on-site roles across India",
                },
                {
                  title: "💡 Approach",
                  sub: "Systems-first engineering",
                  desc: "Architecture, security, performance — then code. Every time.",
                },
              ].map((c) => (
                <div key={c.title} style={S.card}>
                  <div
                    style={{
                      fontFamily:
                        "'Syne','Inter',sans-serif",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontFamily:
                        "'JetBrains Mono',monospace",
                      fontSize: "0.8rem",
                      color: C.cyan,
                      marginBottom: 6,
                    }}
                  >
                    {c.sub}
                  </div>
                  <div
                    style={{
                      fontSize: "0.83rem",
                      color: C.muted,
                    }}
                  >
                    {c.desc}
                  </div>
                </div>
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
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: C.cyan,
                  display: "block",
                }}
              />
              Tech Stack
            </div>
            <h2 style={S.sectionTitle}>
              Skills &amp; Technologies
            </h2>
            <p style={S.sectionDesc}>
              A curated stack built through production experience,
              not just tutorials.
            </p>
          </div>
          <div
            ref={r3.ref}
            style={{
              ...r3.style,
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(260px,1fr))",
              gap: 18,
              marginTop: 52,
            }}
          >
            <SkillCard
              icon="☕"
              title="Languages"
              color="blue"
              tags={["Java", "JavaScript", "SQL", "C / C++"]}
            />
            <SkillCard
              icon="🔧"
              title="Backend / APIs"
              color="cyan"
              tags={[
                "Spring Boot",
                "Spring Security",
                "Spring Data JPA",
                "Hibernate",
                "REST APIs",
                "JWT / OAuth2",
                "Keycloak",
              ]}
            />
            <SkillCard
              icon="🏗️"
              title="Architecture"
              color="purple"
              tags={[
                "Microservices",
                "Modular Monolith",
                "Multi-Tenant",
                "Event-Driven",
              ]}
            />
            <SkillCard
              icon="☁️"
              title="Cloud & DevOps"
              color="green"
              tags={[
                "AWS EC2",
                "AWS S3",
                "AWS SES",
                "AWS STS",
                "Docker",
                "Kubernetes",
                "CI/CD",
                "GitHub Actions",
              ]}
            />
            <SkillCard
              icon="🗄️"
              title="Databases & Messaging"
              color="blue"
              tags={[
                "PostgreSQL",
                "MySQL",
                "MongoDB",
                "Redis",
                "RabbitMQ",
                "Kafka",
              ]}
            />
            <SkillCard
              icon="🧪"
              title="Testing & Tools"
              color="cyan"
              tags={[
                "JUnit5",
                "Mockito",
                "Maven",
                "Git",
                "Postman",
                "IntelliJ IDEA",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={S.sectionAlt}>
        <div style={S.sectionInner}>
          <div ref={r4.ref} style={r4.style}>
            <div style={S.eyebrow}>
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: C.cyan,
                  display: "block",
                }}
              />
              Projects
            </div>
            <h2 style={S.sectionTitle}>Selected Work</h2>
            <p style={S.sectionDesc}>
              Production systems built for real clients, handling
              real scale.
            </p>
          </div>
          <div
            ref={r5.ref}
            style={{
              ...r5.style,
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(340px,1fr))",
              gap: 22,
              marginTop: 52,
            }}
          >
            <ProjCard
              badge="🏢 TechXplore IT Solutions"
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
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: C.cyan,
                  display: "block",
                }}
              />
              Experience
            </div>
            <h2 style={S.sectionTitle}>Work History</h2>
          </div>
          <div
            ref={r7.ref}
            style={{
              ...r7.style,
              marginTop: 52,
              position: "relative",
              paddingLeft: 80,
            }}
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
              }}
            >
              💼
            </div>
            <div
              style={{ ...S.card, borderRadius: 16, padding: 28 }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "0.78rem",
                  color: C.cyan,
                  marginBottom: 4,
                }}
              >
                TECHXPLORE IT SOLUTIONS
              </div>
              <div
                style={{
                  fontFamily: "'Syne','Inter',sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  marginBottom: 6,
                }}
              >
                Software Development Engineer
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: C.muted,
                  marginBottom: 18,
                }}
              >
                June 2025 – Present · Lucknow, India
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  "Led backend architecture transformation — migrated microservices to modular monolith and moved Hive/Presto workloads to AWS EMR, reducing operational costs by over 94%.",
                  "Developed asynchronous email notification systems using Spring Boot, RabbitMQ, and AWS SES with retry and dead-letter queue handling.",
                  "Designed secure REST APIs with JWT/OAuth2 authentication and role-based authorization.",
                  "Built scalable backend modules for user management, booking workflows, support systems, and provider payments.",
                  "Improved application performance using Redis caching and asynchronous processing.",
                  "Implemented database migration strategies using Liquibase and PostgreSQL.",
                  "Containerized applications with Docker and Kubernetes to support CI/CD deployments.",
                ].map((pt, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: "0.88rem",
                      color: C.muted,
                      lineHeight: 1.6,
                    }}
                  >
                    <span
                      style={{
                        color: C.cyan,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      ▹
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" style={S.sectionAlt}>
        <div style={S.sectionInner}>
          <div ref={r8.ref} style={r8.style}>
            <div style={S.eyebrow}>
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: C.cyan,
                  display: "block",
                }}
              />
              Education
            </div>
            <h2 style={S.sectionTitle}>Academic Background</h2>
            <div
              style={{
                ...S.card,
                borderRadius: 20,
                padding: 36,
                maxWidth: 560,
                marginTop: 48,
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  flexShrink: 0,
                  background: `linear-gradient(135deg,rgba(59,130,246,0.2),rgba(6,182,212,0.2))`,
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
                <div
                  style={{
                    fontFamily: "'Syne','Inter',sans-serif",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    marginBottom: 4,
                  }}
                >
                  Master of Computer Applications (MCA)
                </div>
                <div
                  style={{
                    fontFamily:
                      "'JetBrains Mono',monospace",
                    fontSize: "0.82rem",
                    color: C.cyan,
                    marginBottom: 6,
                  }}
                >
                  Mangalayatan University, Aligarh
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: C.muted,
                  }}
                >
                  2023 – 2025 · Aligarh, Uttar Pradesh, India
                </div>
                <div
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    padding: "4px 12px",
                    borderRadius: 6,
                    background: "rgba(6,182,212,0.1)",
                    border: "1px solid rgba(6,182,212,0.2)",
                    fontFamily:
                      "'JetBrains Mono',monospace",
                    fontSize: "0.8rem",
                    color: C.cyan,
                  }}
                >
                  CGPA: 8.3 / 10
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.eyebrow}>
            <span
              style={{
                width: 24,
                height: 1,
                background: C.cyan,
                display: "block",
              }}
            />
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
            Open to full-time roles, freelance projects, and
            interesting engineering challenges.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 52,
              alignItems: "start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <ContactLink
                icon="📧"
                label="Email"
                value="nagendrayounger@gmail.com"
                href="mailto:nagendrayounger@gmail.com"
                iconBg="rgba(59,130,246,0.15)"
              />
              <ContactLink
                icon="📱"
                label="Phone"
                value="+91 91514 05069"
                href="tel:+919151405069"
                iconBg="rgba(6,182,212,0.15)"
              />
              <ContactLink
                icon="💼"
                label="LinkedIn"
                value="linkedin.com/in/nagendra-verma"
                href="https://linkedin.com/in/nagendra-verma-8a60372b2/"
                iconBg="rgba(139,92,246,0.15)"
              />
              <ContactLink
                icon="🐙"
                label="GitHub"
                value="github.com/nagenDev"
                href="https://github.com/nagenDev"
                iconBg="rgba(34,197,94,0.15)"
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: C.slate,
          borderTop: `1px solid ${C.border}`,
          padding: "36px 5%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne','Inter',sans-serif",
            fontSize: "1.2rem",
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
          Full Stack Java Developer · Lucknow, India · Built with ♥
          and Spring Boot
        </p>
      </footer>
    </div>
  )
}
