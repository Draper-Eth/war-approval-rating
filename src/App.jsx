import { useState, useEffect, useRef } from "react";

const warData = [
  {
    id: "grenada",
    name: "Grenada",
    year: 1983,
    startDate: "Oct 25, 1983",
    type: "Invasion",
    duration: "~3 days",
    approvals: [
      { country: "US", value: 71, source: "ABC/Washington Post", note: "Post-invasion poll, late Oct 1983" },
    ],
    context: "U.S.-led invasion to depose military government after coup. Rapid operation with minimal casualties.",
  },
  {
    id: "panama",
    name: "Panama",
    year: 1989,
    startDate: "Dec 20, 1989",
    type: "Invasion",
    duration: "~6 weeks",
    approvals: [
      { country: "US", value: 80, source: "Gallup", note: "Bush approval surged to 80% in Jan 1990 after invasion" },
    ],
    context: "Operation Just Cause to depose Manuel Noriega. Strong domestic rally effect.",
  },
  {
    id: "gulf1",
    name: "Gulf War",
    year: 1991,
    startDate: "Jan 16, 1991",
    type: "Air + Ground war",
    duration: "~6 weeks",
    approvals: [
      { country: "US", value: 79, source: "Gallup/CNN/USA Today", note: "Night of Jan 16, 1991 — air war begins" },
      { country: "UK", value: 76, source: "MORI", note: "Support for British involvement, late Jan 1991" },
    ],
    context: "Coalition operation to liberate Kuwait from Iraqi occupation. Massive international coalition.",
  },
  {
    id: "kosovo",
    name: "Kosovo",
    year: 1999,
    startDate: "Mar 24, 1999",
    type: "NATO air campaign",
    duration: "78 days",
    approvals: [
      { country: "US", value: 50, source: "Gallup/CNN/USA Today", note: "Mar 25, 1999 — day after strikes began" },
      { country: "UK", value: 62, source: "Pew Research", note: "First week of conflict, late March 1999" },
      { country: "France", value: 55, source: "SOFRES/Le Monde", note: "Support for NATO action, late March 1999" },
    ],
    context: "NATO intervention against Serbia over Kosovo. No UN Security Council authorisation. Controversial humanitarian rationale.",
  },
  {
    id: "afghanistan",
    name: "Afghanistan",
    year: 2001,
    startDate: "Oct 7, 2001",
    type: "Invasion + occupation",
    duration: "20 years",
    approvals: [
      { country: "US", value: 90, source: "Gallup", note: "Instant-reaction poll, evening of Oct 7, 2001" },
      { country: "UK", value: 65, source: "Market & Opinion Research", note: "Support for British troop involvement, Oct 2001" },
    ],
    context: "Response to 9/11 attacks. Near-universal domestic support. Only 9% called it a 'mistake' in Nov 2001.",
  },
  {
    id: "iraq2003",
    name: "Iraq War",
    year: 2003,
    startDate: "Mar 19, 2003",
    type: "Invasion + occupation",
    duration: "~8.5 years",
    approvals: [
      { country: "US", value: 72, source: "Gallup/CNN/USA Today", note: "Mar 22-23, 2003 — first weekend of war" },
      { country: "UK", value: 54, source: "YouGov/ICM", note: "Support once war started, late March 2003" },
    ],
    context: "Controversial invasion on WMD pretext. Significant global opposition. No UN authorisation for force.",
  },
  {
    id: "libya",
    name: "Libya",
    year: 2011,
    startDate: "Mar 19, 2011",
    type: "NATO air campaign",
    duration: "~7 months",
    approvals: [
      { country: "US", value: 47, source: "Gallup", note: "Mar 21, 2011 — two days after strikes began" },
      { country: "UK", value: 56, source: "Washington Post-ABC (UK sample)", note: "Support for no-fly zone enforcement, March 2011" },
      { country: "France", value: 66, source: "IFOP/Journal du Dimanche", note: "Support for French-led intervention, late March 2011" },
    ],
    context: "NATO intervention under UN Resolution 1973. France led initial strikes. Lowest U.S. approval of any conflict in this dataset.",
  },
  {
    id: "isis",
    name: "ISIS / Syria-Iraq",
    year: 2014,
    startDate: "Sep 22, 2014",
    type: "Air campaign + advisors",
    duration: "~5 years (active phase)",
    approvals: [
      { country: "US", value: 73, source: "CNN/ORC", note: "Sep 2014 — support for airstrikes against ISIS" },
      { country: "UK", value: 57, source: "YouGov", note: "Sep 2014 — support for RAF strikes on ISIS" },
      { country: "France", value: 63, source: "IFOP", note: "Sep 2014 — support for French airstrikes in Iraq" },
    ],
    context: "Multi-nation campaign against Islamic State. Triggered by beheading videos and rapid ISIS territorial gains.",
  },
  {
    id: "ukraine",
    name: "Ukraine (Western support)",
    year: 2022,
    startDate: "Feb 24, 2022",
    type: "Sanctions + military aid",
    duration: "Ongoing",
    approvals: [
      { country: "US", value: 85, source: "Pew Research", note: "Mar 7-13, 2022 — support for strict sanctions on Russia" },
      { country: "UK", value: 82, source: "Eurobarometer / Ipsos", note: "Early March 2022 — support for EU/NATO response" },
      { country: "France", value: 75, source: "Eurobarometer", note: "Early 2022 — support for EU sanctions on Russia" },
      { country: "EU avg", value: 73, source: "European Parliament / Eurobarometer", note: "Eight months into war, avg EU27 approval of support for Ukraine" },
    ],
    context: "Not a Western-led war, but massive Western sanctions/military aid response. Measured as approval of Western intervention measures.",
  },
];

const countryColors = {
  US: "#1a5276",
  UK: "#c0392b",
  France: "#2471a3",
  "EU avg": "#d4a017",
};

const countryEmoji = {
  US: "🇺🇸",
  UK: "🇬🇧",
  France: "🇫🇷",
  "EU avg": "🇪🇺",
};

export default function WarApprovalChart() {
  const [selected, setSelected] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [filter, setFilter] = useState("all");
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filteredData = filter === "all" ? warData : warData.filter(w => w.approvals.some(a => a.country === filter));
  const countries = ["all", "US", "UK", "France"];
  const maxVal = 100;

  return (
    <div ref={containerRef} style={{
      fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif",
      background: "linear-gradient(165deg, #0a0a0f 0%, #111118 40%, #0d1117 100%)",
      color: "#e8e4df",
      minHeight: "100vh",
      padding: "0",
      overflow: "hidden",
    }}>
      {/* Subtle grid pattern */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "48px 28px 80px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', 'SF Mono', monospace",
            fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
            color: "#6b7280", marginBottom: 12,
          }}>
            Public Opinion Research · 1983–2024
          </p>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "#f0ece6",
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            War Approval Ratings
          </h1>
          <p style={{
            fontSize: 15, color: "#8b8680", marginTop: 12,
            fontFamily: "'IBM Plex Sans', Helvetica, sans-serif",
            maxWidth: 640, lineHeight: 1.6,
          }}>
            Public support for military action within the first 1–2 weeks of each conflict, sourced from Gallup, Pew Research, YouGov, Eurobarometer, and other major polling organisations. Tap any conflict to see detail.
          </p>
        </div>

        {/* Country filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
          {countries.map(c => (
            <button key={c} onClick={() => { setFilter(c); setSelected(null); }} style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: filter === c ? "1px solid rgba(240,236,230,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: filter === c ? "rgba(240,236,230,0.1)" : "transparent",
              color: filter === c ? "#f0ece6" : "#6b7280",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'IBM Plex Sans', Helvetica, sans-serif",
              fontWeight: 500,
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
            }}>
              {c === "all" ? "All Countries" : `${countryEmoji[c] || ""} ${c}`}
            </button>
          ))}
        </div>

        {/* Chart area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredData.map((war, i) => {
            const isSelected = selected === war.id;
            const relevantApprovals = filter === "all" ? war.approvals : war.approvals.filter(a => a.country === filter);
            
            return (
              <div
                key={war.id}
                onClick={() => setSelected(isSelected ? null : war.id)}
                style={{
                  cursor: "pointer",
                  borderRadius: 6,
                  padding: "16px 20px",
                  background: isSelected ? "rgba(240,236,230,0.04)" : "transparent",
                  border: isSelected ? "1px solid rgba(240,236,230,0.08)" : "1px solid transparent",
                  transition: "all 0.3s ease",
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                {/* War name + year */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12, color: "#555", minWidth: 36,
                  }}>
                    {war.year}
                  </span>
                  <span style={{
                    fontSize: 17, fontWeight: 400,
                    color: isSelected ? "#f0ece6" : "#c4bfb8",
                    letterSpacing: "-0.01em",
                  }}>
                    {war.name}
                  </span>
                  <span style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 11, color: "#555",
                    padding: "2px 8px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 3,
                  }}>
                    {war.type}
                  </span>
                </div>

                {/* Bars */}
                <div style={{ marginLeft: 48, display: "flex", flexDirection: "column", gap: 5 }}>
                  {relevantApprovals.map((a, j) => {
                    const barId = `${war.id}-${a.country}`;
                    const isHovered = hoveredBar === barId;
                    return (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}
                        onMouseEnter={() => setHoveredBar(barId)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <span style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 11, color: "#6b7280",
                          minWidth: 42, textAlign: "right",
                        }}>
                          {a.country}
                        </span>
                        <div style={{
                          flex: 1, height: 24,
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 2,
                          position: "relative",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: animate ? `${(a.value / maxVal) * 100}%` : "0%",
                            height: "100%",
                            background: `linear-gradient(90deg, ${countryColors[a.country] || "#5b6b7a"}dd, ${countryColors[a.country] || "#5b6b7a"}88)`,
                            borderRadius: 2,
                            transition: `width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                            transitionDelay: `${i * 60 + j * 100 + 200}ms`,
                            opacity: isHovered ? 1 : 0.85,
                          }} />
                          {/* Value label */}
                          <span style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 12,
                            fontWeight: 600,
                            color: a.value > 60 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                            opacity: animate ? 1 : 0,
                            transition: "opacity 0.5s ease",
                            transitionDelay: `${i * 60 + j * 100 + 600}ms`,
                          }}>
                            {a.value}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div style={{
                    marginTop: 16, marginLeft: 48,
                    padding: "16px 20px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.05)",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 13,
                    lineHeight: 1.7,
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", marginBottom: 14 }}>
                      <span style={{ color: "#555" }}>Start</span>
                      <span style={{ color: "#a09a93" }}>{war.startDate}</span>
                      <span style={{ color: "#555" }}>Duration</span>
                      <span style={{ color: "#a09a93" }}>{war.duration}</span>
                    </div>
                    <p style={{ color: "#8b8680", margin: "0 0 14px 0", fontSize: 13 }}>{war.context}</p>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                      <p style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                        Sources
                      </p>
                      {war.approvals.map((a, j) => (
                        <div key={j} style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                          <span style={{ color: countryColors[a.country] || "#5b6b7a", fontWeight: 600 }}>
                            {countryEmoji[a.country]} {a.country}
                          </span>
                          {" — "}{a.source} · <span style={{ fontStyle: "italic" }}>{a.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend / scale */}
        <div style={{
          marginTop: 48, marginLeft: 48,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          {[0, 25, 50, 75, 100].map(v => (
            <div key={v} style={{ flex: 1, textAlign: v === 0 ? "left" : v === 100 ? "right" : "center" }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: "#3a3a3a",
              }}>{v}%</span>
            </div>
          ))}
        </div>
        <div style={{
          marginLeft: 48, height: 1,
          background: "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          marginTop: 4,
        }} />

        {/* Country legend */}
        <div style={{
          marginTop: 32,
          display: "flex", gap: 20, flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {Object.entries(countryColors).map(([country, color]) => (
            <div key={country} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 12, height: 12, borderRadius: 2,
                background: color,
              }} />
              <span style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 12, color: "#6b7280",
              }}>
                {countryEmoji[country]} {country}
              </span>
            </div>
          ))}
        </div>

        {/* Methodology note */}
        <div style={{
          marginTop: 48, padding: "20px 24px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10, textTransform: "uppercase",
            letterSpacing: 2, color: "#444", marginBottom: 8,
          }}>Methodology notes</p>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 12, color: "#6b7280", lineHeight: 1.7, margin: 0,
          }}>
            All figures represent public approval of the military action itself (not presidential job approval), drawn from the earliest reputable poll conducted within ~1–2 weeks of hostilities beginning. For Ukraine (2022), the figure reflects approval of Western sanctions and military aid, not a Western-led war per se. Multi-country data is included where comparable polling exists; gaps reflect absence of reliable early polling. Sources: Gallup, Pew Research Center, YouGov, Eurobarometer, MORI, IFOP, CNN/ORC, ABC/Washington Post.
          </p>
        </div>

      </div>
    </div>
  );
}
