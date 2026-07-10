import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8080";

const FLAGS = {
  Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Australia: "🇦🇺", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", "United States": "🇺🇸", Italy: "🇮🇹",
  Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸", Austria: "🇦🇹",
  "United Kingdom": "🇬🇧", Hungary: "🇭🇺", Belgium: "🇧🇪",
  Netherlands: "🇳🇱", Singapore: "🇸🇬", Azerbaijan: "🇦🇿",
  Mexico: "🇲🇽", Brazil: "🇧🇷", UAE: "🇦🇪", France: "🇫🇷",
  Germany: "🇩🇪", India: "🇮🇳", "United Arab Emirates": "🇦🇪",
};

const PALETTES = [
  ["#e10600", "#ff4d00"], ["#003b6f", "#0077c8"], ["#006f3c", "#00a550"],
  ["#4b0082", "#7b2fbe"], ["#8b4513", "#d2691e"], ["#1a1a6e", "#4040c8"],
];

function TrackSVG({ color }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.85 }}>
      <path d="M20 95 Q20 20 80 20 L140 20 Q175 20 175 50 Q175 70 155 70 L100 70 Q85 70 85 85 Q85 100 100 100 L160 100 Q180 100 180 80"
        stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 95 Q20 20 80 20 L140 20 Q175 20 175 50 Q175 70 155 70 L100 70 Q85 70 85 85 Q85 100 100 100 L160 100 Q180 100 180 80"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="4 8" opacity="0.35" />
      <circle cx="20" cy="95" r="5" fill="#e10600" />
      <circle cx="20" cy="95" r="9" stroke="#e10600" strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  );
}

const SX = {
  page: { minHeight: "100vh", paddingTop: "70px", background: "linear-gradient(135deg, #080810, #0f0f1a 50%, #160404)", color: "#fff", fontFamily: "'Rajdhani', sans-serif" },
  bgGrid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(225,6,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  inner: { maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1 },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" },
  eyebrow: { fontSize: "11px", letterSpacing: "0.35em", color: "#e10600", textTransform: "uppercase", fontWeight: 600 },
  title: { fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", margin: 0, background: "linear-gradient(90deg, #fff 60%, #555)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  addBtn: { background: "linear-gradient(135deg, #e10600, #7a0300)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.65rem 1.4rem", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 0 20px rgba(225,6,0,0.3)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.75rem" },
  cardScene: { perspective: "1000px", height: "340px", cursor: "pointer" },
  empty: { textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "13px", gridColumn: "1/-1" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  modal: { background: "linear-gradient(135deg, rgba(15,15,26,0.98), rgba(26,5,5,0.98))", border: "1px solid rgba(225,6,0,0.2)", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "480px", boxShadow: "0 0 60px rgba(225,6,0,0.15)", position: "relative" },
  label: { fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.3rem", display: "block" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#fff", fontSize: "14px", fontFamily: "'Rajdhani', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  submitBtn: { background: "linear-gradient(135deg, #e10600, #7a0300)", border: "none", color: "#fff", borderRadius: "8px", padding: "0.6rem 1.4rem", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" },
  cancelBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "0.6rem 1.2rem", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" },
  toast: { position: "fixed", bottom: "2rem", right: "2rem", background: "linear-gradient(135deg, #0d4f3c, #052518)", border: "1px solid rgba(29,158,117,0.4)", color: "#5dcaa5", borderRadius: "10px", padding: "0.75rem 1.25rem", fontSize: "13px", letterSpacing: "0.08em", zIndex: 200 },
};

const iF = (e) => (e.target.style.borderColor = "rgba(225,6,0,0.5)");
const iB = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

function CircuitCard({ circuit, index }) {
  const [hovered, setHovered] = useState(false);
  const [top, mid] = PALETTES[index % PALETTES.length];
  const flag = FLAGS[circuit.country] || "🏁";

  return (
    <motion.div style={SX.cardScene}
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}>
      <div style={{
        width: "100%", height: "100%", position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "rotateY(180deg)" : "rotateY(0deg)",
        borderRadius: "16px",
      }}>
        {/* FRONT */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          borderRadius: "16px", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          <div style={{ height: "170px", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${top}18, ${mid}10)` }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${top}22, transparent 70%)` }} />
            <TrackSVG color={top} />
          </div>
          <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.2, marginBottom: "0.4rem", marginTop: "0.75rem" }}>{circuit.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              <span style={{ fontSize: "16px" }}>{flag}</span><span>{circuit.country}</span>
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.5rem" }}>↻ Hover to reveal</div>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)", borderRadius: "16px", overflow: "hidden",
          border: "1px solid rgba(225,6,0,0.15)",
          background: "linear-gradient(135deg, rgba(20,5,5,0.98), rgba(10,10,20,0.98))",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "2rem", textAlign: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${top}15, transparent 60%)`, pointerEvents: "none" }} />
          <div style={{ ...SX.eyebrow, marginBottom: "0.5rem", position: "relative" }}>{flag} {circuit.country}</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.5rem", position: "relative", lineHeight: 1.2 }}>{circuit.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", marginBottom: "1.5rem", position: "relative" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "0.6rem 1rem" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "2px" }}>Track Length</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#e10600" }}>{circuit.lengthKm ? `${circuit.lengthKm} km` : "—"}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "0.6rem 1rem" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "2px" }}>Location</div>
              <div style={{ fontSize: "1rem", fontWeight: 600 }}>{circuit.location || "—"}</div>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); alert(`Viewing: ${circuit.name}`); }}
            style={{ background: "linear-gradient(135deg, #e10600, #7a0300)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.65rem 1.5rem", fontSize: "12px", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", position: "relative", boxShadow: "0 0 20px rgba(225,6,0,0.3)" }}>
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AddCircuitModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", location: "", country: "", lengthKm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim()) { setError("Circuit name is required."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/circuits`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, location: form.location || null, country: form.country || null, lengthKm: form.lengthKm ? parseFloat(form.lengthKm) : null }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <motion.div style={SX.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div style={SX.modal} initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "14px" }}>✕</button>
        <div style={{ ...SX.eyebrow, marginBottom: "0.4rem" }}>Horizonfrost Races</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Add Circuit</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Register a track to the calendar</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div><label style={SX.label}>Circuit Name *</label><input style={SX.input} name="name" value={form.name} onChange={set} placeholder="e.g. Bahrain International Circuit" onFocus={iF} onBlur={iB} /></div>
          <div style={SX.row2}>
            <div><label style={SX.label}>City / Location</label><input style={SX.input} name="location" value={form.location} onChange={set} placeholder="e.g. Sakhir" onFocus={iF} onBlur={iB} /></div>
            <div><label style={SX.label}>Country</label><input style={SX.input} name="country" value={form.country} onChange={set} placeholder="e.g. Bahrain" onFocus={iF} onBlur={iB} /></div>
          </div>
          <div><label style={SX.label}>Track Length (km)</label><input style={SX.input} name="lengthKm" type="number" step="0.001" value={form.lengthKm} onChange={set} placeholder="e.g. 5.412" onFocus={iF} onBlur={iB} /></div>
        </div>
        {error && <p style={{ color: "#e10600", fontSize: "12px", marginBottom: "0.75rem" }}>⚠ {error}</p>}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={SX.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={SX.submitBtn} onClick={submit} disabled={loading}>{loading ? "Saving…" : "Add Circuit"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CircuitsPage() {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const fetchCircuits = async () => {
    try { const r = await fetch(`${API_BASE}/api/circuits`); setCircuits(await r.json()); }
    catch { /* handled by empty state */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCircuits(); }, []);

  const handleSuccess = () => { setShowModal(false); showToast("✓ Circuit added to the calendar!"); fetchCircuits(); };

  return (
    <div style={SX.page}>
      <div style={SX.bgGrid} />
      <div style={SX.inner}>
        <div style={SX.headerRow}>
          <div>
            <div style={SX.eyebrow}>Race Calendar</div>
            <h1 style={SX.title}>Circuit Grid</h1>
          </div>
          <motion.button style={SX.addBtn}
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(225,6,0,0.5)" }}
            whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)}>
            <span style={{ fontSize: "16px" }}>+</span> Add Circuit
          </motion.button>
        </div>

        {loading ? (
          <div style={SX.grid}><div style={SX.empty}><motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>Loading circuits…</motion.div></div></div>
        ) : (
          <div style={SX.grid}>
            {circuits.length === 0
              ? <div style={SX.empty}>No circuits on the calendar yet. Add your first circuit above.</div>
              : circuits.map((c, i) => <CircuitCard key={c.circuitId || i} circuit={c} index={i} />)
            }
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <AddCircuitModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div style={SX.toast} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}