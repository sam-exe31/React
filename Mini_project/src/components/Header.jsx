import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
 
const NAV_ITEMS = [
  { id: "home",     label: "Home" },
  { id: "drivers",  label: "Drivers" },
  { id: "circuits", label: "Circuits" },
  { id: "races",    label: "Races" },
];
 
export default function Header({ activePage, navigate }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  return (
    <>
      <motion.header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          transition: "all 0.35s ease",
          background: scrolled
            ? "rgba(8,8,16,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(225,6,0,0.15)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          {/* Logo */}
          <motion.div
            style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
            onClick={() => navigate("home")}
            whileHover={{ scale: 1.02 }}
          >
            {/* Apex badge */}
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #e10600, #7a0300)",
              borderRadius: "6px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 700, color: "#fff",
              letterSpacing: "0.05em",
              boxShadow: "0 0 16px rgba(225,6,0,0.4)",
              flexShrink: 0,
            }}>
              HF
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{
                fontSize: "18px", fontWeight: 700,
                color: "#fff", letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                Horizonfrost
              </span>
              <span style={{
                fontSize: "10px", letterSpacing: "0.35em",
                color: "#e10600", textTransform: "uppercase", fontWeight: 600,
              }}>
                Races by sam
              </span>
            </div>
          </motion.div>
 
          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
               className="desktop-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={activePage === item.id}
                onClick={() => navigate(item.id)}
              />
            ))}
          </nav>
 
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent", border: "none",
              cursor: "pointer", padding: "8px",
              display: "none", flexDirection: "column",
              gap: "5px", alignItems: "center",
            }}
            className="hamburger"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: "22px", height: "2px",
                background: "#fff", borderRadius: "2px",
                transition: "all 0.3s",
              }} />
            ))}
          </button>
        </div>
      </motion.header>
 
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            style={{
              position: "fixed", top: "70px", left: 0, right: 0,
              background: "rgba(8,8,16,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(225,6,0,0.2)",
              zIndex: 999, padding: "1rem 2rem 1.5rem",
              fontFamily: "'Rajdhani', sans-serif",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => { navigate(item.id); setMenuOpen(false); }}
                style={{
                  padding: "0.85rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontSize: "16px", fontWeight: 600,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: activePage === item.id ? "#e10600" : "#fff",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
 
function NavLink({ item, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      style={{
        background: "transparent", border: "none",
        cursor: "pointer", padding: "0.45rem 1rem",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "13px", fontWeight: 600,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: active ? "#e10600" : "rgba(255,255,255,0.65)",
        position: "relative",
        transition: "color 0.2s",
      }}
      whileHover={{ color: "#fff" }}
    >
      {item.label}
      {active && (
        <motion.div
          layoutId="nav-underline"
          style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: "60%", height: "2px",
            background: "linear-gradient(90deg, transparent, #e10600, transparent)",
            borderRadius: "2px",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </motion.button>
  );
}