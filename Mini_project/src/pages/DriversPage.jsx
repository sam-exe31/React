import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2 } from 'lucide-react'; // Make sure Edit2 is imported!

const API_BASE = "http://localhost:8080";

const QUOTES = [
  "To finish first, first you must finish.",
  "Winning is not everything, but wanting to win is.",
  "Speed has never killed anyone. Suddenly becoming stationary, that's what gets you.",
  "A racing car is an animal with a thousand adjustments.",
  "Every champion was once a contender who refused to give up.",
  "The race is not always to the swift, but to those who keep going.",
];

const FLAG_MAP = {
  British: "🇬🇧", Dutch: "🇳🇱", Monégasque: "🇲🇨", Spanish: "🇪🇸",
  Mexican: "🇲🇽", Australian: "🇦🇺", German: "🇩🇪", Finnish: "🇫🇮",
  French: "🇫🇷", Canadian: "🇨🇦", Japanese: "🇯🇵", Chinese: "🇨🇳",
  Thai: "🇹🇭", American: "🇺🇸", Danish: "🇩🇰", Italian: "🇮🇹",
  Indian: "🇮🇳", Brazilian: "🇧🇷", Austrian: "🇦🇹",
};

const AVATAR_COLORS = [
  ["#e10600", "#7a0300"], ["#1e3a5f", "#0a1628"], ["#0d4f3c", "#052518"],
  ["#4a1060", "#1e0528"], ["#1a4a6e", "#0a2035"], ["#5c2c0a", "#2a1205"],
];

const SX = {
  page: {
    minHeight: "100vh", paddingTop: "70px",
    background: "linear-gradient(135deg, #080810 0%, #0f0f1a 50%, #160404 100%)",
    color: "#fff", fontFamily: "'Rajdhani', sans-serif",
  },
  bgGrid: {
    position: "fixed", inset: 0,
    backgroundImage: "linear-gradient(rgba(225,6,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0,
  },
  inner: { maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1 },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" },
  eyebrow: { fontSize: "11px", letterSpacing: "0.35em", color: "#e10600", textTransform: "uppercase", fontWeight: 600 },
  title: {
    fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "0.05em",
    textTransform: "uppercase", margin: 0,
    background: "linear-gradient(90deg, #fff 60%, #555)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  addBtn: {
    background: "linear-gradient(135deg, #e10600, #7a0300)", color: "#fff",
    border: "none", borderRadius: "8px", padding: "0.65rem 1.4rem",
    fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "0.5rem",
    boxShadow: "0 0 20px rgba(225,6,0,0.3)",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" },
  card: {
    borderRadius: "16px", overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  },
  cardImg: { width: "100%", height: "190px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  avatar: {
    width: "88px", height: "88px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "2.1rem", fontWeight: 700, letterSpacing: "0.05em",
    border: "2px solid rgba(255,255,255,0.15)",
    boxShadow: "0 0 30px rgba(225,6,0,0.2)", zIndex: 1, position: "relative",
  },
  redLine: { position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #e10600, transparent)" },
  cardBody: { padding: "1.25rem", position: "relative" },
  driverName: { fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem", lineHeight: 1.1 },
  natRow: { display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "12px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.6rem" },
  teamTag: {
    display: "inline-block", background: "rgba(225,6,0,0.1)", border: "1px solid rgba(225,6,0,0.2)",
    color: "#e10600", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
    borderRadius: "4px", padding: "2px 8px", marginBottom: "0.6rem",
  },
  quote: { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem", fontSize: "11.5px", color: "rgba(255,255,255,0.4)", fontStyle: "italic", lineHeight: 1.55 },
  empty: { textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "13px", gridColumn: "1/-1" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  modal: { background: "linear-gradient(135deg, rgba(15,15,26,0.98), rgba(26,5,5,0.98))", border: "1px solid rgba(225,6,0,0.2)", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "480px", boxShadow: "0 0 60px rgba(225,6,0,0.15)", position: "relative" },
  label: { fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.3rem", display: "block" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#fff", fontSize: "14px", fontFamily: "'Rajdhani', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  submitBtn: { background: "linear-gradient(135deg, #e10600, #7a0300)", border: "none", color: "#fff", borderRadius: "8px", padding: "0.6rem 1.4rem", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", boxShadow: "0 0 16px rgba(225,6,0,0.3)" },
  cancelBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "0.6rem 1.2rem", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" },
  toast: { position: "fixed", bottom: "2rem", right: "2rem", background: "linear-gradient(135deg, #0d4f3c, #052518)", border: "1px solid rgba(29,158,117,0.4)", color: "#5dcaa5", borderRadius: "10px", padding: "0.75rem 1.25rem", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em", zIndex: 200 },
  errToast: { position: "fixed", bottom: "2rem", right: "2rem", background: "linear-gradient(135deg, #4a0a0a, #1e0404)", border: "1px solid rgba(225,6,0,0.4)", color: "#e10600", borderRadius: "10px", padding: "0.75rem 1.25rem", fontSize: "13px", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em", zIndex: 200 },
  iconBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', backdropFilter: 'blur(5px)' }
};

const iF = (e) => (e.target.style.borderColor = "rgba(225,6,0,0.5)");
const iB = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

function DriverCard({ driver, index, constructors, onDelete, onEdit }) {
  const cp = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const team = constructors.find((c) => c.constructorId === (driver.constructorId || driver.constructor?.constructorId));
  
  return (
    <motion.div style={SX.card}
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.025, boxShadow: "0 12px 48px rgba(225,6,0,0.15), 0 0 0 1px rgba(225,6,0,0.2)" }}>
      <div style={{ ...SX.cardImg, background: `linear-gradient(135deg, ${cp[0]}22, ${cp[1]}44)` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${cp[0]}33, transparent 70%)` }} />
        <div style={{ ...SX.avatar, background: `linear-gradient(135deg, ${cp[0]}, ${cp[1]})` }}>
          {driver.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div style={SX.redLine} />
        
        {/* Buttons Container */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
          
          {/* Edit Button */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onEdit(driver); }}
            style={SX.iconBtn}
            whileHover={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', scale: 1.1 }}
            whileTap={{ scale: 0.9 }}>
            <Edit2 size={14} />
          </motion.button>

          {/* Delete Button */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onDelete(driver.driver_id); }}
            style={SX.iconBtn}
            whileHover={{ background: 'rgba(225,6,0,0.15)', borderColor: 'rgba(225,6,0,0.4)', color: '#e10600', scale: 1.1, boxShadow: '0 0 15px rgba(225,6,0,0.2)' }}
            whileTap={{ scale: 0.9 }}>
            <Trash2 size={14} />
          </motion.button>

        </div>
      </div>
      <div style={SX.cardBody}>
        {team && <span style={SX.teamTag}>{team.name}</span>}
        <div style={SX.driverName}>{driver.name}</div>
        <div style={SX.natRow}>
          <span style={{ fontSize: "16px" }}>{FLAG_MAP[driver.nationality] || "🏁"}</span>
          <span>{driver.nationality || "Unknown"}</span>
        </div>
        <div style={SX.quote}>"{QUOTES[index % QUOTES.length]}"</div>
      </div>
    </motion.div>
  );
}

// ---- NEW: Simple Edit Modal ----
function EditDriverModal({ driver, onClose, onSuccess }) {
  const [name, setName] = useState(driver.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name.trim()) { setError("Driver name is required."); return; }
    setLoading(true); setError("");
    try {
      // We send a PUT request to update the driver.
      // We pass the existing driver data but with the newly typed name.
      const res = await fetch(`${API_BASE}/api/drivers/${driver.driver_id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...driver, name: name }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <motion.div style={SX.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div style={SX.modal} initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "14px" }}>✕</button>
        <div style={{ ...SX.eyebrow, marginBottom: "0.4rem" }}>Horizonfrost Races</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Edit Driver</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Update driver information</div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={SX.label}>Driver Name *</label>
            <input style={SX.input} value={name} onChange={(e) => setName(e.target.value)} onFocus={iF} onBlur={iB} />
          </div>
        </div>

        {error && <p style={{ color: "#e10600", fontSize: "12px", marginBottom: "0.75rem" }}>⚠ {error}</p>}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={SX.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={SX.submitBtn} onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save Changes"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- ORIGINAL Add Modal ----
function AddDriverModal({ onClose, onSuccess, constructors }) {
  const [form, setForm] = useState({ name: "", nationality: "", dob: "", constructor_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim()) { setError("Driver name is required."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/drivers`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, nationality: form.nationality || null, dob: form.dob || null, constructorId: form.constructor_id ? parseInt(form.constructor_id) : null }),
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
        <div style={{ fontSize: "1.4rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Add Driver</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Register a new driver to the grid</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div><label style={SX.label}>Driver Name *</label><input style={SX.input} name="name" value={form.name} onChange={set} placeholder="e.g. Max Verstappen" onFocus={iF} onBlur={iB} /></div>
          <div><label style={SX.label}>Nationality</label><input style={SX.input} name="nationality" value={form.nationality} onChange={set} placeholder="e.g. Dutch" onFocus={iF} onBlur={iB} /></div>
          <div><label style={SX.label}>Date of Birth</label><input style={{ ...SX.input, colorScheme: "dark" }} name="dob" type="date" value={form.dob} onChange={set} onFocus={iF} onBlur={iB} /></div>
          <div>
            <label style={SX.label}>Constructor (Team)</label>
            <select style={{ ...SX.input, colorScheme: "dark" }} name="constructor_id" value={form.constructor_id} onChange={set} onFocus={iF} onBlur={iB}>
              <option value="" style={{background:"#0f0f1a",color:"#fff"}}>— No Team —</option>
              {constructors.map((c) => {
                 const cid = c.constructor_id || c.constructorId;
                 return <option style={{background:"#0f0f1a",color:"#fff"}} key={cid} value={cid}>{c.name}</option>;
              })}
            </select>
          </div>
        </div>
        {error && <p style={{ color: "#e10600", fontSize: "12px", marginBottom: "0.75rem" }}>⚠ {error}</p>}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={SX.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={SX.submitBtn} onClick={submit} disabled={loading}>{loading ? "Saving…" : "Add Driver"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers]         = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null); // Track which driver we are editing
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm("Retire this driver from the grid?")) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/drivers/${driverId}`, { method: 'DELETE' });
      if (response.ok) {
        showToast("Driver retired successfully!");
        fetchDrivers(); 
      } else {
        showToast("Error deleting driver", "err");
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };
  
  const fetchDrivers = async () => {
    try { const r = await fetch(`${API_BASE}/api/drivers`); setDrivers(await r.json()); }
    catch { showToast("Could not load drivers.", "err"); }
    finally { setLoading(false); }
  };
  
  const fetchConstructors = async () => {
    try { const r = await fetch(`${API_BASE}/api/constructors`); setConstructors(await r.json()); }
    catch { /* non-critical */ }
  };
  
  useEffect(() => { fetchDrivers(); fetchConstructors(); }, []);

  const handleAddSuccess = () => { setShowAddModal(false); showToast("✓ Driver added to the grid!"); fetchDrivers(); };
  const handleEditSuccess = () => { setEditingDriver(null); showToast("✓ Driver updated!"); fetchDrivers(); };

  return (
    <div style={SX.page}>
      <div style={SX.bgGrid} />
      <div style={SX.inner}>
        <div style={SX.headerRow}>
          <div>
            <div style={SX.eyebrow}>Season Grid</div>
            <h1 style={SX.title}>Driver Dashboard</h1>
          </div>
          <motion.button style={SX.addBtn}
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(225,6,0,0.5)" }}
            whileTap={{ scale: 0.97 }} onClick={() => setShowAddModal(true)}>
            <span style={{ fontSize: "16px" }}>+</span> Add Driver
          </motion.button>
        </div>

        {loading ? (
          <div style={SX.grid}>
            <div style={SX.empty}>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>Loading grid…</motion.div>
            </div>
          </div>
        ) : (
          <div style={SX.grid}>
            {drivers.length === 0
              ? <div style={SX.empty}>No drivers on the grid yet. Add your first driver above.</div>
              : drivers.map((d, i) => {
                  const safeKey = d.driver_id || i;
                  return (
                    <DriverCard 
                      key={safeKey} 
                      driver={d} 
                      index={i} 
                      constructors={constructors} 
                      onDelete={handleDeleteDriver}
                      onEdit={(driverToEdit) => setEditingDriver(driverToEdit)} // Pass the driver to state when clicked
                    />
                  );
                })
            }
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && <AddDriverModal onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} constructors={constructors} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {editingDriver && <EditDriverModal driver={editingDriver} onClose={() => setEditingDriver(null)} onSuccess={handleEditSuccess} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div style={toast.type === "err" ? SX.errToast : SX.toast}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}