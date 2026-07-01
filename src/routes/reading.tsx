import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import masqotImg from "../masqot.png";
import { LC } from "../lib/trail-data";

export const Route = createFileRoute("/reading")({
  head: () => ({
    meta: [
      { title: "The Reading — The Resilience Trail" },
      { name: "description", content: "The Trailkeeper reads your stones. Thirty-five max." },
    ],
  }),
  component: ReadingPage,
});

/* ─── Score helpers ───────────────────────────────────────────────────────── */

const SCORE_KEYS = [
  "trail-score-1",
  "trail-score-2",
  "trail-score-3",
  "trail-score-4",
  "trail-score-5",
  "trail-score-6",
  "trail-score-7",
];

function loadTotal(): number {
  return SCORE_KEYS.reduce((sum, key) => {
    const v = parseInt(sessionStorage.getItem(key) ?? "0", 10);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
}

/* ─── Band content ────────────────────────────────────────────────────────── */

type Band = {
  range: string;
  action: string;
  lines: string[];
  accent: string;
  tint: string;
};

function getBand(total: number): Band {
  if (total >= 30) return {
    range: "30–35",
    action: "(nods, mildly impressed)",
    lines: [
      "Alright, look at you. Foundations are solid — this is maintenance mode, not damage control.",
      "Don't get smug about it. Steady isn't the same as finished. Keep walking it the way you have been.",
    ],
    accent: LC.darkGreen,
    tint: LC.pastelSage,
  };
  if (total >= 22) return {
    range: "22–29",
    action: "(turns a few stones over)",
    lines: [
      "Decent walking, mostly. A couple waypoints are dragging the rest down — you felt it back there, don't pretend you didn't.",
      "Pick one. Not all seven, one. That's how ground actually shifts, not through some heroic overhaul that lasts eleven days.",
    ],
    accent: LC.green,
    tint: LC.pastelGreen,
  };
  if (total >= 15) return {
    range: "15–21",
    action: "(sets the stones down)",
    lines: [
      "Plenty of room here, more opportunity than disaster. Don't try to rebuild your whole life by Monday.",
      "Grab the nearest waypoint and take one honest step toward it. That's the entire method. Anyone selling you more than that is lying.",
    ],
    accent: LC.teal,
    tint: LC.pastelTeal,
  };
  return {
    range: "Below 15",
    action: "(meets your eyes, no judgment, no pity either)",
    lines: [
      "This is a starting line, not a life sentence. Pick one or two waypoints — that's it, one or two — and put your attention there.",
      "Real ground gets built one repeated, unglamorous step at a time. Everyone standing at a strong trailhead started exactly where you're standing right now.",
    ],
    accent: LC.orange,
    tint: LC.pastelOrange,
  };
}

/* ─── Waypoint breakdown ──────────────────────────────────────────────────── */

const WAYPOINT_LABELS = [
  { key: "trail-score-1", name: "The Orchard",       subtitle: "Nutrition" },
  { key: "trail-score-2", name: "The Long Night",     subtitle: "Sleep" },
  { key: "trail-score-3", name: "The Storm Shelter",  subtitle: "Stress Management" },
  { key: "trail-score-4", name: "The Still River",    subtitle: "Emotional Wellbeing" },
  { key: "trail-score-5", name: "The Climb",          subtitle: "Movement & Physical Function" },
  { key: "trail-score-6", name: "The Clearing",       subtitle: "Environmental Awareness" },
  { key: "trail-score-7", name: "The Campfire",       subtitle: "Relationships & Social Wellbeing" },
];

/* ─── Page ────────────────────────────────────────────────────────────────── */

function ReadingPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"counting" | "band" | "outro">("counting");
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [bandRevealed, setBandRevealed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const total = loadTotal();
  const band = getBand(total);

  // Scores per waypoint for the breakdown
  const waypointScores = WAYPOINT_LABELS.map(({ key, name, subtitle }) => ({
    name,
    subtitle,
    score: parseInt(sessionStorage.getItem(key) ?? "0", 10) || 0,
  }));

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Count-up animation for total
  useEffect(() => {
    if (phase !== "counting") return;
    let current = 0;
    const step = Math.max(1, Math.floor(total / 28));
    const interval = setInterval(() => {
      current = Math.min(current + step, total);
      setDisplayedTotal(current);
      if (current >= total) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [phase, total]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [phase, bandRevealed]);

  return (
    <div style={{
      minHeight: "100dvh",
      background: `linear-gradient(160deg, ${band.tint} 0%, ${LC.offWhite} 50%, ${band.tint}55 100%)`,
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gridTemplateRows: "100dvh",
      overflow: "hidden",
      fontFamily: "'League Spartan', sans-serif",
    }}>

      {/* ── LEFT ── */}
      <div style={{ position: "relative" }}>
        <ScrollFade accent={band.accent} />
        <div style={{
          overflowY: "auto",
          height: "100dvh",
          padding: "3rem 2.5rem 6rem 3rem",
          display: "flex",
          flexDirection: "column",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: LC.mutedInk, marginBottom: "0.5rem" }}>
            The Trail · Final Reading
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 700, color: band.accent, letterSpacing: "-0.025em", margin: "0 0 1rem" }}>
            The Reading
          </h1>
          <p style={{
            fontSize: "1rem", color: LC.mutedInk, lineHeight: 1.7,
            fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
            maxWidth: "520px", margin: "0 0 1.5rem",
            paddingLeft: "1rem", borderLeft: `2px solid ${LC.ruleLine}`,
          }}>
            The Trailkeeper dumps the pouch of stones onto a flat rock and starts sorting, quiet for a second.
          </p>
          <div style={{ height: "1px", background: LC.ruleLine }} />
        </div>

        {/* Trailkeeper opening line */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <img src={masqotImg} alt="The Trailkeeper" style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: `2px solid ${band.accent}`, flexShrink: 0 }} />
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: LC.mutedInk }}>
              — The Trailkeeper
            </div>
          </div>
          <div style={{ paddingLeft: "52px" }}>
            <div style={{
              background: "white", border: `1px solid ${LC.ruleLine}`,
              borderRadius: "4px 18px 18px 18px",
              padding: "1rem 1.25rem",
              fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
              fontSize: "clamp(1rem, 2vw, 1.2rem)", color: LC.ink, lineHeight: 1.65,
              maxWidth: "520px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              Thirty-five stones, max. Let's see what you've actually been carrying.
            </div>
          </div>
        </div>

        {/* ── Score tally ── */}
        <div style={{
          background: band.tint, border: `1px solid ${band.accent}30`,
          borderRadius: "16px", padding: "1.75rem 2rem", marginBottom: "2rem",
          maxWidth: "520px",
        }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: LC.mutedInk, marginBottom: "0.75rem" }}>
            Total stones carried
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <span style={{
              fontSize: "clamp(4rem, 10vw, 6rem)", fontWeight: 700,
              color: band.accent, lineHeight: 1,
              transition: "color 0.3s",
            }}>
              {phase === "counting" ? displayedTotal : total}
            </span>
            <span style={{ fontSize: "1.5rem", color: LC.mutedInk, fontWeight: 400 }}>/35</span>
          </div>

          {/* Waypoint breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {waypointScores.map(({ name, subtitle, score }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ flex: "0 0 140px" }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 600, color: LC.ink, letterSpacing: "0.02em" }}>{name}</div>
                  <div style={{ fontSize: "0.55rem", color: LC.mutedInk, letterSpacing: "0.05em" }}>{subtitle}</div>
                </div>
                <div style={{ flex: 1, height: "4px", background: `${band.accent}20`, borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    width: `${(score / 5) * 100}%`,
                    background: band.accent,
                    transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                  }} />
                </div>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: band.accent, width: "28px", textAlign: "right" }}>
                  {score}
                </div>
              </div>
            ))}
          </div>

          {phase === "counting" && (
            <button
              type="button"
              onClick={() => { setPhase("band"); setBandRevealed(true); }}
              style={{ ...ctaStyle(band.accent), marginTop: "1.5rem" }}
            >
              Read the stones →
            </button>
          )}
        </div>

        {/* ── Band response ── */}
        {(phase === "band" || phase === "outro") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <img src={masqotImg} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: `2px solid ${band.accent}`, flexShrink: 0 }} />
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: LC.mutedInk }}>
                — The Trailkeeper
              </div>
            </div>

            <div style={{ paddingLeft: "44px", display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "520px" }}>
              {/* action beat */}
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                fontSize: "0.85rem", color: LC.mutedInk,
              }}>
                {band.action}
              </div>
              {/* speech lines */}
              {band.lines.map((line, i) => (
                <div key={i} style={{
                  background: "white", border: `1px solid ${LC.ruleLine}`,
                  borderRadius: "4px 18px 18px 18px",
                  padding: "1rem 1.25rem",
                  fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)", color: LC.ink, lineHeight: 1.65,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  {line}
                </div>
              ))}
            </div>

            {phase === "band" && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setPhase("outro")} style={ctaStyle(band.accent)}>
                  Keep going →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Outro ── */}
        {phase === "outro" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <img src={masqotImg} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: `2px solid ${band.accent}`, flexShrink: 0 }} />
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: LC.mutedInk }}>
                — The Trailkeeper
              </div>
            </div>

            <div style={{ paddingLeft: "44px", display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "520px" }}>
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                fontSize: "0.85rem", color: LC.mutedInk,
              }}>
                (hands the pouch of stones back to you)
              </div>
              {[
                "Keep 'em. You'll be back — next season, next year, whenever the ground starts feeling unfamiliar under your feet again.",
                "Trail'll still be here. I'll still be here. Probably still cursing too much.",
              ].map((line, i) => (
                <div key={i} style={{
                  background: band.tint, border: `1px solid ${LC.ruleLine}`,
                  borderRadius: "4px 18px 18px 18px",
                  padding: "1rem 1.25rem",
                  fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)", color: LC.ink, lineHeight: 1.65,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  {line}
                </div>
              ))}

              {/* Fire burns low */}
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                fontSize: "0.8rem", color: LC.mutedInk, marginTop: "0.25rem",
                letterSpacing: "0.02em",
              }}>
                (fire burns low; fade out)
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => {
                  SCORE_KEYS.forEach((k) => sessionStorage.removeItem(k));
                  sessionStorage.removeItem("trail-ready");
                  navigate({ to: "/intro" });
                }}
                style={ctaStyle(band.accent)}
              >
                Walk the trail again →
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
        </div>{/* end inner scroll */}
      </div>{/* end scroll wrapper */}

      {/* ── RIGHT: mascot ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${band.tint} 0%, ${band.tint}66 100%)`,
        borderLeft: `1px solid ${LC.ruleLine}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "320px", height: "200px",
          background: `radial-gradient(ellipse, ${band.accent}22 0%, transparent 70%)`,
          filter: "blur(24px)", pointerEvents: "none",
        }} />
        <img
          src={masqotImg}
          alt="The Trailkeeper"
          style={{
            width: "100%", maxWidth: "340px", height: "auto",
            objectFit: "contain", objectPosition: "bottom",
            filter: `drop-shadow(0 8px 32px ${band.accent}30) drop-shadow(0 2px 8px rgba(14,80,70,0.10))`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s ease 0.5s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s",
            position: "relative", zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}

function ctaStyle(accent: string): React.CSSProperties {
  return {
    background: accent, color: "white", border: "none",
    borderRadius: "9999px", padding: "0.85rem 2.2rem",
    fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.07em",
    cursor: "pointer", fontFamily: "'League Spartan', sans-serif",
    boxShadow: `0 3px 16px ${accent}40`, transition: "all 0.2s",
  };
}

function ScrollFade({ accent }: { accent: string }) {
  return (
    <>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "80px",
        background: "linear-gradient(to bottom, rgba(250,250,248,0.95) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 10,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
        background: "linear-gradient(to top, rgba(250,250,248,0.98) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 10,
      }} />
      <div style={{
        position: "absolute", bottom: "1.5rem", left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 11,
        animation: "scrollChevronBob 2s ease-in-out infinite",
      }}>
        <div style={{ width: "20px", height: "10px", position: "relative", opacity: 0.35 }}>
          <div style={{
            position: "absolute", left: 0, top: "50%",
            width: "12px", height: "2px", background: accent,
            borderRadius: "1px",
            transform: "rotate(35deg) translateY(-50%)",
            transformOrigin: "right center",
          }} />
          <div style={{
            position: "absolute", right: 0, top: "50%",
            width: "12px", height: "2px", background: accent,
            borderRadius: "1px",
            transform: "rotate(-35deg) translateY(-50%)",
            transformOrigin: "left center",
          }} />
        </div>
      </div>
      <style>{`
        @keyframes scrollChevronBob {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          50%       { transform: translateX(-50%) translateY(5px); opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
