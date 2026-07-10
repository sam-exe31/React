import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8080";

const SX = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #080810 0%, #0f0f1a 50%, #160404 100%)",
    color: "#fff",
    fontFamily: "'Rajdhani', sans-serif",
    paddingTop: "70px",
  },
  bgGrid: {
    position: "fixed", inset: 0,
    backgroundImage: "linear-gradient(rgba(225,6,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none", zIndex: 0,
  },
  inner: { maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1 },
  headerRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "2.5rem",
    flexWrap: "wrap", gap: "1rem",
  },
  eyebrow: { fontSize: "11px", letterSpacing: "0.35em", color: "#e10600", textTransform: "uppercase", fontWeight: 600 },
  title: {
    fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700,
    letterSpacing: "0.05em", textTransform: "uppercase",
    background: "linear-gradient(90deg, #fff 60%, #555)", margin: 0,
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  addBtn: {
    background: "linear-gradient(135deg, #e10600, #7a0300)",
    color: "#fff", border: "none", borderRadius: "8px",
    padding: "0.65rem 1.4rem", fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase",
    cursor: "pointer", display: "flex", alignItems: "center",
    gap: "0.5rem", boxShadow: "0 0 20px rgba(225,6,0,0.3)",
  },
  tabs: { display: "flex", gap: "0", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  tab: {
    background: "transparent", border: "none", color: "rgba(255,255,255,0.4)",
    fontSize: "13px", fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
    cursor: "pointer", padding: "0.75rem 1.5rem", position: "relative",
    transition: "color 0.2s",
  },
  tabActive: { color: "#fff" },
  tabLine: {
    position: "absolute", bottom: "-1px", left: 0, right: 0,
    height: "2px", background: "#e10600",
  },
  // Schedule grid
  scheduleGrid: { display: "flex", flexDirection: "column", gap: "1rem" },
  raceCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px", padding: "1.25rem 1.5rem",
    display: "grid",
    gridTemplateColumns: "60px 1fr auto",
    gap: "1.25rem", alignItems: "center",
    transition: "all 0.25s",
  },
  roundBadge: {
    background: "rgba(225,6,0,0.1)", border: "1px solid rgba(225,6,0,0.2)",
    borderRadius: "8px", padding: "0.5rem",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  roundNum: { fontSize: "1.3rem", fontWeight: 700, color: "#e10600", lineHeight: 1 },
  roundLbl: { fontSize: "9px", letterSpacing: "0.2em", color: "rgba(225,6,0,0.6)", textTransform: "uppercase" },
  raceName: { fontSize: "1rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.3rem" },
  raceMeta: { fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" },
  dateChip: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px", padding: "0.35rem 0.75rem",
    fontSize: "12px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)",
    textAlign: "center", whiteSpace: "nowrap",
  },
  // Results table
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)", padding: "0.75rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.07)", textAlign: "left",
    fontWeight: 600,
  },
  td: {
    padding: "1rem", fontSize: "14px", letterSpacing: "0.05em",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.75)",
  },
  posBadge: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: "28px", height: "28px", borderRadius: "50%",
    fontSize: "12px", fontWeight: 700,
  },
  empty: { textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "13px" },
  // Modal shared
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)", zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
  },
  modal: {
    background: "linear-gradient(135deg, rgba(15,15,26,0.98), rgba(26,5,5,0.98))",
    border: "1px solid rgba(225,6,0,0.2)", borderRadius: "16px",
    padding: "2rem", width: "100%", maxWidth: "500px",
    boxShadow: "0 0 60px rgba(225,6,0,0.15)",
    position: "relative",
  },
  label: { fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.3rem", display: "block" },
  input: {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
    padding: "0.65rem 0.9rem", color: "#fff", fontSize: "14px",
    fontFamily: "'Rajdhani', sans-serif", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  submitBtn: {
    background: "linear-gradient(135deg, #e10600, #7a0300)",
    border: "none", color: "#fff", borderRadius: "8px",
    padding: "0.6rem 1.4rem", fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
    cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em",
    boxShadow: "0 0 16px rgba(225,6,0,0.3)",
  },
  cancelBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.5)", borderRadius: "8px",
    padding: "0.6rem 1.2rem", fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif", cursor: "pointer",
    textTransform: "uppercase", letterSpacing: "0.1em",
  },
  toast: {
    position: "fixed", bottom: "2rem", right: "2rem",
    background: "linear-gradient(135deg, #0d4f3c, #052518)",
    border: "1px solid rgba(29,158,117,0.4)", color: "#5dcaa5",
    borderRadius: "10px", padding: "0.75rem 1.25rem",
    fontSize: "13px", fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: "0.08em", zIndex: 200,
  },
};

function posBg(pos) {
  if (pos === 1) return { background: "rgba(255,215,0,0.15)", color: "#ffd700" };
  if (pos === 2) return { background: "rgba(192,192,192,0.15)", color: "#c0c0c0" };
  if (pos === 3) return { background: "rgba(205,127,50,0.15)", color: "#cd7f32" };
  return { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" };
}

function inputFocus(e) { e.target.style.borderColor = "rgba(225,6,0,0.5)"; }
function inputBlur(e)  { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }

// ── ADD RACE MODAL ──────────────────────────────────────────
function AddRaceModal({ onClose, onSuccess, circuits }) {
  const [form, setForm] = useState({ year: "", round: "", circuit_id: "", race_date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.year || !form.round) { setError("Year and Round are required."); return; }
    setLoading(true); setError("");
    try {
      const payload = {
        year: parseInt(form.year),
        round: parseInt(form.round),
        circuitId: form.circuit_id ? parseInt(form.circuit_id) : null,
        raceDate: form.race_date || null,
      };
      const res = await fetch(`${API_BASE}/api/races`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <motion.div style={SX.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div style={SX.modal}
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "14px" }}>✕</button>
        <div style={{ ...SX.eyebrow, marginBottom: "0.4rem" }}>Horizonfrost Races</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Add Race</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Add a race to the calendar</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={SX.row2}>
            <div>
              <label style={SX.label}>Season Year *</label>
              <input style={SX.input} name="year" type="number" placeholder="2025" value={form.year} onChange={set} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={SX.label}>Round *</label>
              <input style={SX.input} name="round" type="number" placeholder="1" value={form.round} onChange={set} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
          </div>
          <div>
            <label style={SX.label}>Circuit</label>
            <select style={{ ...SX.input, colorScheme: "dark" }} name="circuit_id" value={form.circuit_id} onChange={set} onFocus={inputFocus} onBlur={inputBlur}>
              <option value="">— Select Circuit —</option>
              {circuits.map((c) => <option style={{background:"#0f0f1a",color:"#fff"}} key={c.circuitId} value={c.circuitId}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={SX.label}>Race Date</label>
            <input style={{ ...SX.input, colorScheme: "dark" }} name="race_date" type="date" value={form.race_date} onChange={set} onFocus={inputFocus} onBlur={inputBlur} />
          </div>
        </div>

        {error && <p style={{ color: "#e10600", fontSize: "12px", marginBottom: "0.75rem" }}>⚠ {error}</p>}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={SX.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={SX.submitBtn} onClick={submit} disabled={loading}>{loading ? "Saving…" : "Add Race"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────
export default function RacesPage() {
  const [tab, setTab]           = useState("schedule");
  const [races, setRaces]       = useState([]);
  const [results, setResults]   = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const fetchRaces = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/races`);
      setRaces(await r.json());
    } catch { /* handled by empty state */ }
    finally { setLoading(false); }
  };

  const fetchResults = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/race-results`);
      setResults(await r.json());
    } catch { /* ok */ }
  };

  const fetchCircuits = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/circuits`);
      setCircuits(await r.json());
    } catch { /* ok */ }
  };

  useEffect(() => { fetchRaces(); fetchResults(); fetchCircuits(); }, []);

  const handleSuccess = () => { setShowModal(false); showToast("✓ Race added to the calendar!"); fetchRaces(); };

  return (
    <div style={SX.page}>
      <div style={SX.bgGrid} />
      <div style={SX.inner}>
        {/* Header */}
        <div style={SX.headerRow}>
          <div>
            <div style={SX.eyebrow}>Season Data</div>
            <h1 style={SX.title}>Races</h1>
          </div>
          <motion.button style={SX.addBtn}
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(225,6,0,0.5)" }}
            whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)}>
            <span style={{ fontSize: "16px" }}>+</span> Add Race
          </motion.button>
        </div>

        {/* Tabs */}
        <div style={SX.tabs}>
          {[{ id: "schedule", label: "Race Schedule" }, { id: "results", label: "Results History" }].map((t) => (
            <button key={t.id} style={{ ...SX.tab, ...(tab === t.id ? SX.tabActive : {}) }} onClick={() => setTab(t.id)}>
              {t.label}
              {tab === t.id && <motion.div layoutId="tab-line" style={SX.tabLine} />}
            </button>
          ))}
        </div>

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          loading ? (
            <div style={SX.empty}>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>Loading races…</motion.div>
            </div>
          ) : races.length === 0 ? (
            <div style={SX.empty}>No races scheduled yet. Add your first race above.</div>
          ) : (
            <div style={SX.scheduleGrid}>
              {[...races].sort((a, b) => a.round - b.round).map((race, i) => {
                const circuit = circuits.find((c) => c.circuitId === (race.circuitId || race.circuit?.circuitId));
                return (
                  <motion.div key={race.raceId || i} style={SX.raceCard}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    whileHover={{ background: "rgba(225,6,0,0.04)", borderColor: "rgba(225,6,0,0.18)" }}>
                    <div style={SX.roundBadge}>
                      <span style={SX.roundNum}>{race.round}</span>
                      <span style={SX.roundLbl}>Round</span>
                    </div>
                    <div>
                      <div style={SX.raceName}>{circuit ? circuit.name : `Race Round ${race.round}`}</div>
                      <div style={SX.raceMeta}>
                        {circuit ? `${circuit.location}, ${circuit.country}` : "—"} &nbsp;·&nbsp; Season {race.year}
                      </div>
                    </div>
                    <div style={SX.dateChip}>
                      {race.raceDate ? new Date(race.raceDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "TBC"}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        )}

        {/* RESULTS TAB */}
        {tab === "results" && (
          results.length === 0 ? (
            <div style={SX.empty}>No results logged yet.</div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
              <table style={SX.table}>
                <thead>
                  <tr>
                    {["Pos", "Driver", "Race", "Grid", "Points"].map((h) => (
                      <th key={h} style={SX.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.resultId || i} style={{ transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(225,6,0,0.04)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={SX.td}>
                        <span style={{ ...SX.posBadge, ...posBg(r.finishingPosition) }}>
                          {r.finishingPosition ?? "—"}
                        </span>
                      </td>
                      <td style={SX.td}>{r.driver?.name || `Driver #${r.driverId}`}</td>
                      <td style={SX.td}>{r.race ? `Round ${r.race.round} · ${r.race.year}` : `Race #${r.raceId}`}</td>
                      <td style={{ ...SX.td, color: "rgba(255,255,255,0.4)" }}>{r.gridPosition ?? "—"}</td>
                      <td style={{ ...SX.td, color: "#e10600", fontWeight: 600 }}>{r.points ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )
        )}
      </div>

      <AnimatePresence>
        {showModal && <AddRaceModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} circuits={circuits} />}
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