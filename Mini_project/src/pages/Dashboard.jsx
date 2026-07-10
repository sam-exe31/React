import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8080";

// High-quality Unsplash race / F1 images (free, no auth needed)
const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    tag: "The Grid Awaits",
    headline: "Where Champions\nAre Forged",
    sub: "Every race. Every driver. Every circuit.",
  },
  {
    img: "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=1600&q=80",
    tag: "Pure Speed",
    headline: "Feel the\nApex Rush",
    sub: "Precision. Power. Perfection.",
  },
  {
    img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1600&q=80",
    tag: "Race Day",
    headline: "Lights Out &\nAway We Go",
    sub: "Track every lap. Every result.",
  },
];

// Race car showcase images
const RACECAR_GALLERY = [
  {
    img: "https://images.unsplash.com/photo-1612839897893-04b17c55f1e1?w=800&q=80",
    caption: "Pit Lane Precision",
  },
  {
    img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
    caption: "Full Throttle",
  },
  {
    img: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80",
    caption: "Circuit Mastery",
  },
  {
    img: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&q=80",
    caption: "Apex Hunting",
  },
];

const FEATURES = [
  { icon: "⬡", label: "Drivers",  desc: "Full grid profiles with nationality, team & career data.", page: "drivers" },
  { icon: "◈", label: "Circuits", desc: "Every track — length, location, country & layout.", page: "circuits" },
  { icon: "◉", label: "Races",    desc: "Full calendar, results history & grid positions.", page: "races" },
];

const SX = {
  page: {
    background: "#080810",
    color: "#fff",
    fontFamily: "'Rajdhani', 'Barlow Condensed', sans-serif",
    overflowX: "hidden",
  },
  // HERO
  hero: {
    position: "relative",
    height: "100vh",
    minHeight: "600px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "opacity 1s ease",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(8,8,16,0.88) 40%, rgba(8,8,16,0.4) 100%), linear-gradient(to top, rgba(8,8,16,0.8) 0%, transparent 40%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1400px",
    width: "100%",
    padding: "0 2rem",
    paddingTop: "70px",
  },
  heroEyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    letterSpacing: "0.35em",
    color: "#e10600",
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: "1.25rem",
    background: "rgba(225,6,0,0.08)",
    border: "1px solid rgba(225,6,0,0.2)",
    padding: "6px 14px",
    borderRadius: "4px",
  },
  heroDot: {
    width: "6px", height: "6px",
    borderRadius: "50%",
    background: "#e10600",
    animation: "pulse 1.5s infinite",
  },
  heroTitle: {
    fontSize: "clamp(3rem, 8vw, 7rem)",
    fontWeight: 700,
    lineHeight: 0.95,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    whiteSpace: "pre-line",
    marginBottom: "1.5rem",
  },
  heroSub: {
    fontSize: "clamp(13px, 2vw, 17px)",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: "2.5rem",
  },
  heroCta: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  ctaPrimary: {
    background: "linear-gradient(135deg, #e10600, #7a0300)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.85rem 2rem",
    fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(225,6,0,0.35)",
  },
  ctaSecondary: {
    background: "transparent",
    color: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "8px",
    padding: "0.85rem 2rem",
    fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  // Slide dots
  slideDots: {
    position: "absolute",
    bottom: "2.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    zIndex: 3,
  },
  // Stats bar
  statsBar: {
    background: "rgba(225,6,0,0.06)",
    borderTop: "1px solid rgba(225,6,0,0.15)",
    borderBottom: "1px solid rgba(225,6,0,0.08)",
    padding: "1.25rem 2rem",
    display: "flex",
    justifyContent: "center",
    gap: "0",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 3rem",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },
  statVal: { fontSize: "2rem", fontWeight: 700, color: "#e10600", letterSpacing: "0.04em" },
  statLbl: { fontSize: "10px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" },
  // Gallery
  section: { maxWidth: "1400px", margin: "0 auto", padding: "5rem 2rem" },
  sectionEye: {
    fontSize: "11px", letterSpacing: "0.35em", color: "#e10600",
    textTransform: "uppercase", fontWeight: 600, marginBottom: "0.5rem",
  },
  sectionTitle: {
    fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
    fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: "2.5rem",
    background: "linear-gradient(90deg, #fff 60%, #555)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.25rem",
  },
  galleryCard: {
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    aspectRatio: "16/10",
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
  },
  galleryImg: {
    width: "100%", height: "100%",
    objectFit: "cover",
    transition: "transform 0.6s ease",
    display: "block",
  },
  galleryCaption: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    background: "linear-gradient(transparent, rgba(8,8,16,0.9))",
    padding: "2rem 1rem 0.75rem",
    fontSize: "12px", letterSpacing: "0.15em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.7)",
  },
  // Features
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
  },
  featureCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "2rem",
    cursor: "pointer",
    transition: "all 0.3s",
    backdropFilter: "blur(12px)",
  },
  featureIcon: {
    fontSize: "2rem", color: "#e10600",
    marginBottom: "1rem",
    display: "block",
  },
  featureLabel: {
    fontSize: "1.3rem", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.1em",
    marginBottom: "0.5rem",
  },
  featureDesc: {
    fontSize: "13px", color: "rgba(255,255,255,0.4)",
    lineHeight: 1.65, letterSpacing: "0.04em",
  },
  featureArrow: {
    display: "inline-block",
    marginTop: "1.25rem",
    fontSize: "12px", letterSpacing: "0.18em",
    textTransform: "uppercase", color: "#e10600",
  },
};

export default function Dashboard({ navigate }) {
  const [slide, setSlide] = useState(0);
  const [stats, setStats] = useState({ drivers: "—", circuits: "—", races: "—" });
  const intervalRef = useRef(null);

  // Auto-rotate hero slides
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Fetch counts
  useEffect(() => {
    const fetchCount = async (endpoint) => {
      try {
        const r = await fetch(`${API_BASE}/api/${endpoint}`);
        const d = await r.json();
        return Array.isArray(d) ? d.length : "—";
      } catch { return "—"; }
    };
    Promise.all([
      fetchCount("drivers"),
      fetchCount("circuits"),
      fetchCount("races"),
    ]).then(([d, c, r]) => setStats({ drivers: d, circuits: c, races: r }));
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div style={SX.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .gallery-card:hover img { transform: scale(1.07); }
        .feature-card:hover {
          background: rgba(225,6,0,0.06) !important;
          border-color: rgba(225,6,0,0.2) !important;
          transform: translateY(-4px);
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={SX.hero}>
        {/* Background image crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            style={{
              ...SX.heroBg,
              backgroundImage: `url(${current.img})`,
            }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <div style={SX.heroOverlay} />

        {/* Animated grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: "linear-gradient(rgba(225,6,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        <div style={SX.heroContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <div style={SX.heroEyebrow}>
                <div style={SX.heroDot} />
                {current.tag}
              </div>
              <h1 style={SX.heroTitle}>{current.headline}</h1>
              <p style={SX.heroSub}>{current.sub}</p>
              <div style={SX.heroCta}>
                <motion.button
                  style={SX.ctaPrimary}
                  whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(225,6,0,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("drivers")}
                >
                  View Drivers
                </motion.button>
                <motion.button
                  style={SX.ctaSecondary}
                  whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("races")}
                >
                  Race Schedule
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide dots */}
        <div style={SX.slideDots}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === slide ? "#e10600" : "rgba(255,255,255,0.25)",
                border: "none", cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Corner brand watermark */}
        <div style={{
          position: "absolute", top: "90px", right: "2rem",
          zIndex: 2, textAlign: "right",
          display: "flex", flexDirection: "column", alignItems: "flex-end",
        }}>
          <div style={{
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            fontWeight: 700, lineHeight: 1,
            textTransform: "uppercase", letterSpacing: "0.05em",
            color: "rgba(255,255,255,0.04)",
            userSelect: "none",
          }}>
            APEX
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <motion.div
        style={SX.statsBar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { val: stats.drivers,  lbl: "Drivers on Grid" },
          { val: stats.circuits, lbl: "Active Circuits" },
          { val: stats.races,    lbl: "Races Logged" },
          { val: "1",            lbl: "Season" },
        ].map((s, i) => (
          <div key={i} style={{ ...SX.statItem, borderRight: i === 3 ? "none" : SX.statItem.borderRight }}>
            <span style={SX.statVal}>{s.val}</span>
            <span style={SX.statLbl}>{s.lbl}</span>
          </div>
        ))}
      </motion.div>

      {/* ── RACE CAR GALLERY ── */}
      <section style={SX.section}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={SX.sectionEye}>Motorsport Gallery</div>
          <div style={SX.sectionTitle}>Race Car Showcase</div>
        </motion.div>

        <div style={SX.galleryGrid}>
          {RACECAR_GALLERY.map((item, i) => (
            <motion.div
              key={i}
              className="gallery-card"
              style={SX.galleryCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <img
                src={item.img}
                alt={item.caption}
                style={SX.galleryImg}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.style.background = "linear-gradient(135deg,#1a0505,#0a0a1a)";
                }}
              />
              <div style={SX.galleryCaption}>{item.caption}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section style={{ ...SX.section, paddingTop: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={SX.sectionEye}>Explore</div>
          <div style={SX.sectionTitle}>Everything In One Place</div>
        </motion.div>

        <div style={SX.featureGrid}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              style={SX.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(f.page)}
            >
              <span style={SX.featureIcon}>{f.icon}</span>
              <div style={SX.featureLabel}>{f.label}</div>
              <div style={SX.featureDesc}>{f.desc}</div>
              <div style={SX.featureArrow}>Explore {f.label} →</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section style={{
        margin: "0 2rem 5rem",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(225,6,0,0.12), rgba(122,3,0,0.08))",
        border: "1px solid rgba(225,6,0,0.18)",
        padding: "3.5rem 3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem",
        maxWidth: "1360px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#e10600", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Ready?
          </div>
          <div style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Start Tracking Your Season
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <motion.button
            style={SX.ctaPrimary}
            whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(225,6,0,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("drivers")}
          >
            Add Drivers
          </motion.button>
          <motion.button
            style={SX.ctaSecondary}
            whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("circuits")}
          >
            Add Circits
          </motion.button>
        </div>
      </section>
    </div>
  );
}