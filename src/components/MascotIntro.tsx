import { useEffect, useRef, useState } from "react";
import masqotImg from "../masqot.png";

/* ─── Brand palette ───────────────────────────────────────────────────────── */

const LC = {
  offWhite:    "#fafaf8",
  ink:         "#16201d",
  mutedInk:    "#5b6a65",
  ruleLine:    "#e6e6e2",
  darkGreen:   "#0e5046",
  teal:        "#66c3b7",
  green:       "#99cf16",
  pastelOrange:"#ffdfb4",
  pastelGreen: "#e2f0c4",
  pastelTeal:  "#d4efec",
  pastelSage:  "#b6c8c6",
};

/* ─── Script ──────────────────────────────────────────────────────────────── */

const MAIN_LINES = [
  "You made it. Took you long enough — though to be fair, most people put this off for years. Something about staring your own habits in the face tends to get postponed indefinitely.",
  "(looks up, finally)",
  "Here's the deal. Seven waypoints. At each one I'm gonna ask you five questions, and you're gonna hand me a stone — one through five — for each. I don't care how you compare to anyone else. I care whether you're lying to me, and more importantly, whether you're lying to yourself.",
  "(stands, cracks his back)",
  "At the end I'll give you a reading. Not a verdict. Nobody's failing this. Some people are just further from the trailhead than others.",
];

const WHY_LINES = [
  "Prevention. Simple as that. Nobody wakes up one day and falls apart — it's a thousand small skipped meals, blown-off nights of sleep, swallowed feelings, all compounding quietly until one day the bill's due.",
  "This trail's just here to catch the drift before it catches you. That's the whole pitch.",
  "Alright. Let's move.",
];

/* ─── Types ───────────────────────────────────────────────────────────────── */

type FlowState =
  | { kind: "main"; index: number }
  | { kind: "choice" }
  | { kind: "why"; index: number };

/* ─── Component ───────────────────────────────────────────────────────────── */

interface MascotIntroProps {
  onDone: () => void;
}

export function MascotIntro({ onDone }: MascotIntroProps) {
  const [flow, setFlow]               = useState<FlowState>({ kind: "main", index: 0 });
  const [displayedText, setDisplayedText] = useState("");
  const [entered, setEntered]         = useState(false);
  const [mascotIn, setMascotIn]       = useState(false);
  const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true), 100);
    const t2 = setTimeout(() => setMascotIn(true), 320);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const currentLine: string | null = (() => {
    if (flow.kind === "main") return MAIN_LINES[flow.index];
    if (flow.kind === "why")  return WHY_LINES[flow.index];
    return null;
  })();

  // Typewriter
  useEffect(() => {
    if (currentLine === null) return;
    setDisplayedText("");
    let i = 0;
    function tick() {
      if (i <= currentLine!.length) {
        setDisplayedText(currentLine!.slice(0, i));
        i++;
        charTimerRef.current = setTimeout(tick, 18);
      }
    }
    tick();
    return () => { if (charTimerRef.current) clearTimeout(charTimerRef.current); };
  }, [currentLine]);

  function handleTap() {
    if (currentLine && displayedText.length < currentLine.length) {
      if (charTimerRef.current) clearTimeout(charTimerRef.current);
      setDisplayedText(currentLine);
      return;
    }
    advance();
  }

  function advance() {
    if (flow.kind === "main") {
      const next = flow.index + 1;
      setFlow(next >= MAIN_LINES.length ? { kind: "choice" } : { kind: "main", index: next });
      return;
    }
    if (flow.kind === "why") {
      const next = flow.index + 1;
      if (next >= WHY_LINES.length) { onDone(); return; }
      setFlow({ kind: "why", index: next });
    }
  }

  const isAction = currentLine?.startsWith("(") ?? false;
  const typing   = currentLine !== null && displayedText.length < currentLine.length;

  const currentDot =
    flow.kind === "main"   ? flow.index :
    flow.kind === "choice" ? MAIN_LINES.length :
    MAIN_LINES.length + 1 + flow.index;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9998, overflow: "hidden",
        fontFamily: "'League Spartan', sans-serif",
        // Four pastel bands blending top-to-bottom, all brand colours
        background: `linear-gradient(
          160deg,
          ${LC.pastelSage}   0%,
          ${LC.pastelTeal}  28%,
          ${LC.pastelGreen} 60%,
          ${LC.pastelOrange}88 100%
        )`,
      }}
      onClick={flow.kind === "choice" ? undefined : handleTap}
    >

      {/* ── Subtle texture dot ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(14,80,70,0.035) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* ── Mascot — right side, bottom-anchored ── */}
      <img
        src={masqotImg}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          right: "2%",
          height: "88%",
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom right",
          opacity: mascotIn ? 1 : 0,
          transform: mascotIn ? "translateY(0)" : "translateY(56px)",
          transition: "opacity 0.8s ease 0.15s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.15s",
          pointerEvents: "none",
          userSelect: "none",
          filter: "drop-shadow(0 20px 48px rgba(14,80,70,0.18)) drop-shadow(0 4px 12px rgba(14,80,70,0.10))",
        }}
      />

      {/* ── Soft left vignette so text reads over the mascot ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(
          90deg,
          ${LC.pastelSage}cc 0%,
          ${LC.pastelTeal}88 38%,
          transparent 65%
        )`,
      }} />

      {/* ── Top bar ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "2.5rem 3rem",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(-14px)",
        transition: "opacity 0.6s ease 0.2s, transform 0.7s ease 0.2s",
      }}>
        <div style={{
          fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase",
          color: LC.mutedInk, marginBottom: "0.4rem",
        }}>
          Luke Coutinho presents
        </div>
        <div style={{
          fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)", fontWeight: 700,
          color: LC.darkGreen, letterSpacing: "-0.025em",
          fontFamily: "'Fraunces', Georgia, serif",
        }}>
          The Resilience Trail
        </div>
        <div style={{ fontSize: "0.7rem", color: LC.mutedInk, letterSpacing: "0.1em", marginTop: "0.3rem" }}>
          Seven waypoints · 35 stones · ~10 minutes
        </div>
        <div style={{ height: "1px", background: LC.ruleLine, marginTop: "1.25rem", maxWidth: "340px" }} />
      </div>

      {/* ── Bottom dialog panel ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        padding: "0 3rem 3.5rem",
        maxWidth: "580px",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease 0.35s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s",
      }}>

        {/* Speaker label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: LC.darkGreen }} />
          <span style={{
            fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase",
            color: LC.mutedInk,
          }}>
            The Trailkeeper
          </span>
        </div>

        {/* Progress pips */}
        <div style={{ display: "flex", gap: "5px", marginBottom: "1rem" }}>
          {Array.from({ length: MAIN_LINES.length + 1 }).map((_, i) => (
            <div key={i} style={{
              width: i === currentDot ? "22px" : "6px",
              height: "5px", borderRadius: "3px",
              background: i < currentDot
                ? LC.teal
                : i === currentDot
                  ? LC.darkGreen
                  : LC.ruleLine,
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* ── Choice screen ── */}
        {flow.kind === "choice" && (
          <div>
            <div style={{
              background: LC.offWhite,
              border: `1px solid ${LC.ruleLine}`,
              borderRadius: "4px 18px 18px 18px",
              padding: "1.4rem 1.6rem",
              marginBottom: "1.25rem",
              boxShadow: "0 4px 20px rgba(14,80,70,0.08)",
            }}>
              <p style={{
                fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
                color: LC.ink, lineHeight: 1.65, margin: 0,
              }}>
                Ready to go, or you got questions first?
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={onDone}
                style={{
                  background: LC.darkGreen, color: LC.offWhite, border: "none",
                  borderRadius: "9999px", padding: "0.9rem 2.2rem",
                  fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.06em",
                  cursor: "pointer", fontFamily: "'League Spartan', sans-serif",
                  boxShadow: "0 4px 20px rgba(14,80,70,0.28)", transition: "all 0.2s",
                }}
              >
                Begin the Trail →
              </button>
              <button
                type="button"
                onClick={() => setFlow({ kind: "why", index: 0 })}
                style={{
                  background: "transparent", color: LC.mutedInk,
                  border: `1.5px solid ${LC.ruleLine}`,
                  borderRadius: "9999px", padding: "0.9rem 2.2rem",
                  fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.04em",
                  cursor: "pointer", fontFamily: "'League Spartan', sans-serif",
                  transition: "all 0.2s",
                  backdropFilter: "blur(8px)",
                }}
              >
                What is this for?
              </button>
            </div>
          </div>
        )}

        {/* ── Normal speech bubble ── */}
        {flow.kind !== "choice" && currentLine !== null && (
          <div>
            <div style={{
              background: isAction ? "transparent" : LC.offWhite,
              border: isAction ? "none" : `1px solid ${LC.ruleLine}`,
              borderRadius: isAction ? "0" : "4px 18px 18px 18px",
              padding: isAction ? "0.2rem 0" : "1.4rem 1.6rem",
              minHeight: isAction ? "auto" : "88px",
              boxShadow: isAction ? "none" : "0 4px 20px rgba(14,80,70,0.07)",
            }}>
              <p style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: isAction ? "normal" : "italic",
                fontSize: isAction ? "0.85rem" : "clamp(1.05rem, 2.2vw, 1.3rem)",
                color: isAction ? LC.mutedInk : LC.ink,
                lineHeight: 1.7, margin: 0,
              }}>
                {displayedText}
                <span style={{
                  display: "inline-block", width: "2px", height: "1.1em",
                  background: LC.darkGreen, marginLeft: "2px", verticalAlign: "middle",
                  opacity: typing ? 1 : 0,
                  animation: "mascotCursorBlink 0.7s step-end infinite",
                }} />
              </p>
            </div>

            {!typing && (
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                <span style={{
                  fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase",
                  color: LC.mutedInk,
                }}>
                  tap to continue
                </span>
              </div>
            )}
          </div>
        )}

        {/* Why branch — last line CTA */}
        {flow.kind === "why" && flow.index === WHY_LINES.length - 1 && !typing && (
          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDone(); }}
              style={{
                background: LC.darkGreen, color: LC.offWhite, border: "none",
                borderRadius: "9999px", padding: "0.9rem 2.2rem",
                fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em",
                cursor: "pointer", fontFamily: "'League Spartan', sans-serif",
                boxShadow: "0 4px 20px rgba(14,80,70,0.28)",
              }}
            >
              Alright. Let's move →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes mascotCursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
