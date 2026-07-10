import { motion } from "framer-motion";
 
const FOOTER_LINKS = {
  Navigate: [
    { label: "Home",     page: "home" },
    { label: "Drivers",  page: "drivers" },
    { label: "Circuits", page: "circuits" },
    { label: "Races",    page: "races" },
  ],
  Data: [
    { label: "Race Results",   page: "races" },
    { label: "Race Schedule",  page: "races" },
    { label: "Circuit Guide",  page: "circuits" },
    { label: "Driver Profiles",page: "drivers" },
  ],
};
 
export default function Footer({ navigate }) {
  const year = new Date().getFullYear();
 
  return (
    <footer style={{
      background: "linear-gradient(180deg, #080810 0%, #05050d 100%)",
      borderTop: "1px solid rgba(225,6,0,0.12)",
      fontFamily: "'Rajdhani', sans-serif",
      color: "#fff",
      paddingTop: "3.5rem",
    }}>
      {/* Red top bar */}
      <div style={{
        height: "3px",
        background: "linear-gradient(90deg, transparent 0%, #e10600 30%, #ff4500 60%, transparent 100%)",
        marginBottom: "3.5rem",
      }} />
 
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 2rem 3rem",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "3rem",
      }}
        className="footer-grid"
      >
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <div style={{
              width: "40px", height: "40px",
              background: "linear-gradient(135deg, #e10600, #7a0300)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px", fontWeight: 700, color: "#fff",
              boxShadow: "0 0 20px rgba(225,6,0,0.35)",
            }}>HF</div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Horizonfrost
              </div>
              <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#e10600", textTransform: "uppercase" }}>
                Races
              </div>
            </div>
          </div>
          <p style={{
            fontSize: "14px", lineHeight: 1.7,
            color: "rgba(255,255,255,0.35)",
            maxWidth: "300px", letterSpacing: "0.03em",
          }}>
            The ultimate motorsport data platform. Track every lap, every driver, every circuit — in one place.
          </p>
 
          {/* Decorative speed lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "1.5rem" }}>
            {[100, 70, 45].map((w, i) => (
              <div key={i} style={{
                height: "2px", width: `${w}px`,
                background: i === 0
                  ? "#e10600"
                  : `rgba(225,6,0,${0.4 - i * 0.1})`,
                borderRadius: "2px",
              }} />
            ))}
          </div>
        </div>
 
        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section}>
            <div style={{
              fontSize: "11px", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#e10600",
              fontWeight: 600, marginBottom: "1.25rem",
            }}>
              {section}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {links.map((link) => (
                <li key={link.label}>
                  <motion.span
                    onClick={() => navigate(link.page)}
                    style={{
                      fontSize: "14px", letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.45)",
                      cursor: "pointer", transition: "color 0.2s",
                      display: "inline-block",
                    }}
                    whileHover={{ color: "#fff", x: 4 }}
                  >
                    {link.label}
                  </motion.span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
 
      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "1.25rem 2rem",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}>
        <span style={{
          fontSize: "11px", letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.2)",
          textTransform: "uppercase",
        }}>
          © {year} Horizonfrost Races · All rights reserved
        </span>
        <span style={{
          fontSize: "11px", letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.15)",
          textTransform: "uppercase",
        }}>
          Built for speed ⬡
        </span>
      </div>
 
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
 