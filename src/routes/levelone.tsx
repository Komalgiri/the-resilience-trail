import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import masqotImg from "../masqot.png";
import { LC } from "../lib/trail-data";

export const Route = createFileRoute("/levelone")({
  head: () => ({
    meta: [
      { title: "The Orchard — The Resilience Trail" },
      { name: "description", content: "Waypoint 1: Nutrition. Five questions. Drop a stone." },
    ],
  }),
  component: LevelOnePage,
});

/* ─── Script ──────────────────────────────────────────────────────────────── */

const ACCENT = "#99cf16";  // olive green
const TINT   = "#e2f0c4";  // pastel green

const INTRO_LINES = [
  "Welcome to the Orchard — where we find out what you've actually been putting in your body, not what you tell people at dinner parties.",
  "(picks up an apple, doesn't eat it, tosses it hand to hand)",
  "Five questions. Give me a number, and don't overthink it.",
];

const QUESTIONS = [
  "Do you eat mostly whole, minimally processed food, or is your diet basically a chemistry experiment?",
  "Getting enough fibre — vegetables, fruit, legumes, nuts, seeds — or are you allergic to anything that grew in dirt?",
  "Anything resembling consistent meal timing, or is \"lunch\" a rumour you've heard about?",
  "Do you actually drink water, or remember you're a carbon-based organism around 4pm and panic-chug something?",
  "Do the foods you reach for on autopilot support your metabolic health, more often than not?",
];

const OUTRO =
  "Nobody eats perfectly, and if you're chasing perfect you've already lost the plot. This isn't about willpower theater. It's about the pattern underneath the takeout nights — whether it's built to carry you for decades or just held together with duct tape and caffeine.\n\nKeep walking.";

/* ─── Page ────────────────────────────────────────────────────────────────── */

function LevelOnePage() {
  const navigate = useNavigate();
  const [mascotDone, setMascotDone] = useState(false);
  const [phase, setPhase] = useState<"intro" | "questions" | "outro">("intro");
  const [stones, setStones] = useState<number[]>(Array(5).fill(0));
  const [activeQ, setActiveQ] = useState(0);
  const [visible, setVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeQ, phase]);

  function selectStone(qi: number, v: number) {
    const next = [...stones];
    next[qi] = v;
    setStones(next);
    if (qi < QUESTIONS.length - 1) {
      setActiveQ(qi + 1);
    }
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80);
  }

  const allAnswered = stones.every((s) => s > 0);
  const avg = allAnswered
    ? Math.round(stones.reduce((a, b) => a + b, 0) / stones.length)
    : 0;

  if (!mascotDone) {
    return <LevelMascotIntro lines={INTRO_LINES} accent={ACCENT} tint={TINT} onDone={() => setMascotDone(true)} />;
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: `linear-gradient(160deg, ${LC.pastelGreen} 0%, ${LC.offWhite} 50%, ${TINT} 100%)`,
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gridTemplateRows: "100dvh",
      overflow: "hidden",
      fontFamily: "'League Spartan', sans-serif",
    }}>

      {/* ── LEFT: dialogue + Q&A ── */}
      <div style={{ position: "relative" }}>
        <ScrollFade accent={ACCENT} />
        <div style={{
          overflowY: "auto",
          height: "100dvh",
          padding: "3rem 2.5rem 6rem 3rem",
          display: "flex",
          flexDirection: "column",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>

        {/* Scene header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: LC.mutedInk, marginBottom: "0.4rem" }}>
            Waypoint 1 · Nutrition
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700,
            color: ACCENT, letterSpacing: "-0.025em", margin: "0 0 0.5rem",
          }}>
            The Orchard
          </h1>
          <p style={{
            fontSize: "0.85rem", color: LC.mutedInk, lineHeight: 1.65,
            fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
            maxWidth: "480px", margin: 0,
          }}>
            Fog thins into rows of half-wild fruit trees. Something's always ripening. Something's always rotting.
          </p>
          <div style={{ height: "1px", background: LC.ruleLine, marginTop: "1.25rem" }} />
        </div>

        {/* Intro speech */}
        <div style={{ marginBottom: "2rem" }}>
          <SpeakerLabel />
          {INTRO_LINES.map((line, i) => {
            const isAction = line.startsWith("(");
            return (
              <div key={i} style={{
                marginBottom: "0.75rem",
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: isAction ? "normal" : "italic",
                fontSize: isAction ? "0.9rem" : "1.2rem",
                color: isAction ? LC.mutedInk : LC.ink,
                lineHeight: 1.6,
                maxWidth: "520px",
              }}>
                {line}
              </div>
            );
          })}
        </div>

        {/* Q&A thread / outro */}
        {phase === "intro" && (
          <button
            type="button"
            onClick={() => setPhase("questions")}
            style={ctaStyle(ACCENT)}
          >
            Begin Questions →
          </button>
        )}

        {(phase === "questions" || phase === "outro") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Counter */}
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: LC.mutedInk }}>
              Question {Math.min(activeQ + 1, 5)} of 5
            </div>

            {QUESTIONS.map((q, qi) => {
              const answered = stones[qi] > 0;
              const isCurrent = qi === activeQ && phase === "questions";
              const committed = answered && !isCurrent;

              return (
                <div key={qi} style={{ opacity: committed ? 0.55 : 1, transition: "opacity 0.25s ease" }}>
                  {/* Question bubble */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <img src={masqotImg} alt="" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${ACCENT}`, marginTop: "2px" }} />
                    <div style={{
                      background: committed ? LC.offWhite : "white",
                      border: `1px solid ${LC.ruleLine}`,
                      borderRadius: "4px 14px 14px 14px",
                      padding: committed ? "0.5rem 0.75rem" : "0.85rem 1.1rem",
                      fontSize: committed ? "0.8rem" : "0.95rem",
                      color: LC.ink, lineHeight: 1.55, maxWidth: "85%",
                      transition: "all 0.25s ease",
                      fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                    }}>
                      <span style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: LC.mutedInk, display: "block", marginBottom: "0.3rem", fontStyle: "normal", fontFamily: "'League Spartan', sans-serif" }}>
                        0{qi + 1}
                      </span>
                      {q}
                    </div>
                  </div>

                  {/* Reply bubble */}
                  {answered && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.25rem" }}>
                      <div style={{
                        background: TINT, border: `1px solid ${ACCENT}50`,
                        borderRadius: "14px 4px 14px 14px",
                        padding: committed ? "0.35rem 0.65rem" : "0.55rem 0.9rem",
                        fontSize: committed ? "0.75rem" : "0.85rem",
                        fontWeight: 600, color: ACCENT, maxWidth: "55%",
                        transition: "all 0.25s ease",
                      }}>
                        Stone {stones[qi]}
                      </div>
                    </div>
                  )}

                  {/* Stone row — active only */}
                  {isCurrent && (
                    <div style={{ paddingLeft: "38px", marginTop: "0.6rem" }}>
                      <StoneRow value={stones[qi]} onSelect={(v) => selectStone(qi, v)} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Drop stones button */}
            {phase === "questions" && allAnswered && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setPhase("outro")} style={ctaStyle(ACCENT)}>
                  Drop the stones →
                </button>
              </div>
            )}

            {/* Outro */}
            {phase === "outro" && (
              <div style={{ marginTop: "1rem" }}>
                {/* Score card */}
                <div style={{
                  background: TINT, border: `1px solid ${ACCENT}30`,
                  borderRadius: "12px", padding: "1.25rem 1.75rem", marginBottom: "1.75rem",
                }}>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: LC.mutedInk, marginBottom: "0.5rem" }}>
                    Stones dropped
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                    <span style={{ fontSize: "3.5rem", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{avg}</span>
                    <span style={{ fontSize: "1.1rem", color: LC.mutedInk }}>/5</span>
                  </div>
                  <div style={{ fontSize: "0.6rem", color: LC.mutedInk, marginTop: "0.4rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {avg >= 4 ? "Solid" : avg === 3 ? "Getting by" : avg === 2 ? "Struggling" : "Needs work"}
                  </div>
                </div>

                {/* Outro speech */}
                <SpeakerLabel />
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <img src={masqotImg} alt="" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${ACCENT}`, marginTop: "2px" }} />
                    <div style={{
                      background: TINT, border: `1px solid ${LC.ruleLine}`,
                      borderRadius: "4px 14px 14px 14px",
                      padding: "0.9rem 1.1rem", maxWidth: "500px",
                    }}>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: LC.ink, lineHeight: 1.65 }}>
                        <p style={{ margin: "0 0 0.6rem" }}>
                          (drops the apple back in the grass, uneaten)
                        </p>
                        {OUTRO.split("\n\n").map((para, i) => (
                          <p key={i} style={{ margin: i === 0 ? "0 0 0.6rem" : 0, fontStyle: i === 0 ? "italic" : "italic" }}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                  <button type="button" onClick={() => {
                    sessionStorage.setItem("trail-ready", "1");
                    sessionStorage.setItem("trail-score-1", String(avg));
                    navigate({ to: "/leveltwo" });
                  }} style={ctaStyle(ACCENT)}>
                    Walk on →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
        </div>{/* end inner scroll div */}
      </div>{/* end scroll wrapper */}

      {/* ── RIGHT: full mascot — slides in from right ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${TINT} 0%, ${LC.pastelGreen} 100%)`,
        borderLeft: `1px solid ${LC.ruleLine}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1)",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "320px", height: "200px",
          background: `radial-gradient(ellipse, ${ACCENT}22 0%, transparent 70%)`,
          filter: "blur(24px)",
          pointerEvents: "none",
        }} />

        {/* Mascot full-body */}
        <img
          src={masqotImg}
          alt="The Trailkeeper"
          style={{
            width: "100%",
            maxWidth: "340px",
            height: "auto",
            objectFit: "contain",
            objectPosition: "bottom",
            filter: `drop-shadow(0 8px 32px rgba(14,80,70,0.15)) drop-shadow(0 2px 8px rgba(14,80,70,0.10))`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s ease 0.5s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s",
            position: "relative", zIndex: 1,
          }}
        />
      </div>

      <style>{`
        @media (max-width: 767px) {
          /* Stack on mobile: mascot hidden, full-width content */
          .levelone-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Shared sub-components ───────────────────────────────────────────────── */

function ScrollFade({ accent }: { accent: string }) {
  return (
    <>
      {/* Top fade */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "80px",
        background: "linear-gradient(to bottom, rgba(250,250,248,0.95) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 10,
      }} />
      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
        background: "linear-gradient(to top, rgba(250,250,248,0.98) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 10,
      }} />
      {/* Scroll chevron */}
      <div style={{
        position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 11, display: "flex", flexDirection: "column",
        alignItems: "center", gap: "3px",
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
          50% { transform: translateX(-50%) translateY(5px); opacity: 0.6; }
        }
      `}</style>
    </>
  );
}

function SpeakerLabel() {
  return (
    <div style={{
      fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase",
      color: LC.mutedInk, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem",
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ACCENT }} />
      The Trailkeeper
    </div>
  );
}

function StoneRow({ value, onSelect }: { value: number; onSelect: (v: number) => void }) {
  const [justDropped, setJustDropped] = useState<number | null>(null);

  function handleSelect(n: number) {
    setJustDropped(n);
    onSelect(n);
    setTimeout(() => setJustDropped(null), 500);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: LC.mutedInk, width: "70px" }}>
        Needs work
      </span>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const sel = value === n;
          const dropping = justDropped === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => handleSelect(n)}
              aria-label={`Stone ${n}`}
              style={{
                width: "64px", height: "64px", borderRadius: "50%",
                border: `2px solid ${sel ? ACCENT : LC.ruleLine}`,
                background: sel ? ACCENT : "white",
                color: sel ? "white" : LC.mutedInk,
                fontSize: "1.2rem", fontWeight: 700, cursor: "pointer",
                transform: dropping ? "scale(0.82) translateY(6px)" : sel ? "scale(1.1)" : "scale(1)",
                transition: dropping ? "transform 0.12s ease" : "all 0.18s ease",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: sel ? `0 4px 16px ${ACCENT}40` : "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <span style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: LC.mutedInk }}>
        Solid
      </span>
    </div>
  );
}

function ctaStyle(accent: string): React.CSSProperties {
  return {
    background: accent,
    color: "white",
    border: "none",
    borderRadius: "9999px",
    padding: "0.7rem 1.8rem",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.07em",
    cursor: "pointer",
    fontFamily: "'League Spartan', sans-serif",
    boxShadow: `0 3px 16px ${accent}40`,
    transition: "all 0.2s",
  };
}

/* ─── Level mascot intro overlay ─────────────────────────────────────────── */

interface LevelMascotIntroProps {
  lines: string[];
  accent: string;
  tint: string;
  onDone: () => void;
}

function LevelMascotIntro({ lines, accent, tint, onDone }: LevelMascotIntroProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [entered, setEntered] = useState(false);
  const [mascotIn, setMascotIn] = useState(false);
  const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Entrance: content fades in first, then mascot slides from right
  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true), 80);
    const t2 = setTimeout(() => setMascotIn(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Typewriter
  useEffect(() => {
    const line = lines[lineIndex];
    setDisplayedText("");
    let i = 0;
    function tick() {
      if (i <= line.length) {
        setDisplayedText(line.slice(0, i));
        i++;
        charTimerRef.current = setTimeout(tick, 22);
      }
    }
    tick();
    return () => { if (charTimerRef.current) clearTimeout(charTimerRef.current); };
  }, [lineIndex, lines]);

  const isAction = lines[lineIndex].startsWith("(");
  const isLast = lineIndex >= lines.length - 1;

  function advance() {
    if (isLast) { onDone(); return; }
    setLineIndex((i) => i + 1);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        overflow: "hidden",
        background: `linear-gradient(160deg, ${tint} 0%, #fafaf8 45%, ${tint}88 100%)`,
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gridTemplateRows: "100dvh",
        fontFamily: "'League Spartan', sans-serif",
      }}
      onClick={advance}
    >
      {/* LEFT: speech panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "3rem 2.5rem 3rem 3rem",
          opacity: entered ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {/* Speaker label */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accent }} />
          <span style={{
            fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#5b6a65", fontFamily: "'League Spartan', sans-serif",
          }}>
            The Trailkeeper
          </span>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
          {lines.map((_, i) => (
            <div key={i} style={{
              width: i === lineIndex ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i < lineIndex ? accent : i === lineIndex ? accent : "#e6e6e2",
              opacity: i < lineIndex ? 0.5 : 1,
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* Speech bubble */}
        <div style={{
          background: "#fafaf8",
          border: "1px solid #e6e6e2",
          borderRadius: "16px 16px 16px 4px",
          padding: "1.5rem 1.75rem",
          maxWidth: "520px",
          boxShadow: "0 4px 24px rgba(14,80,70,0.08)",
          position: "relative",
          minHeight: "100px",
          cursor: "pointer",
        }}>
          <p style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontStyle: isAction ? "normal" : "italic",
            fontSize: isAction ? "0.85rem" : "clamp(1rem, 2.2vw, 1.2rem)",
            color: isAction ? "#5b6a65" : "#16201d",
            lineHeight: 1.65,
            margin: 0,
          }}>
            {displayedText}
            <span style={{
              display: "inline-block", width: "2px", height: "1.1em",
              background: accent, marginLeft: "2px", verticalAlign: "middle",
              opacity: displayedText.length < lines[lineIndex].length ? 1 : 0,
              animation: "levelCursorBlink 0.7s step-end infinite",
            }} />
          </p>
        </div>

        {/* Tap hint / Done button */}
        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
          {isLast ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDone(); }}
              style={{
                background: accent, color: "white", border: "none",
                borderRadius: "9999px", padding: "0.65rem 1.5rem",
                fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.07em",
                cursor: "pointer", fontFamily: "'League Spartan', sans-serif",
                boxShadow: `0 3px 16px ${accent}40`,
              }}
            >
              Let's go →
            </button>
          ) : (
            <span style={{
              fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#5b6a65",
            }}>
              tap to continue
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: mascot slides in from the right */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${tint} 0%, ${tint}55 100%)`,
        borderLeft: "1px solid #e6e6e2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        transform: mascotIn ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "320px", height: "200px",
          background: `radial-gradient(ellipse, ${accent}22 0%, transparent 70%)`,
          filter: "blur(24px)",
          pointerEvents: "none",
        }} />
        <img
          src={masqotImg}
          alt="The Trailkeeper"
          style={{
            width: "100%",
            maxWidth: "340px",
            height: "auto",
            objectFit: "contain",
            objectPosition: "bottom",
            filter: `drop-shadow(0 8px 32px rgba(14,80,70,0.15)) drop-shadow(0 2px 8px rgba(14,80,70,0.10))`,
            position: "relative", zIndex: 1,
          }}
        />
      </div>

      <style>{`
        @keyframes levelCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
