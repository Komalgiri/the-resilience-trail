import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import masqotImg from "../masqot.png";
import { LC } from "../lib/trail-data";

export const Route = createFileRoute("/levelfour")({
  head: () => ({
    meta: [
      { title: "The Still River — The Resilience Trail" },
      { name: "description", content: "Waypoint 4: Emotional Wellbeing. Five questions. Drop a stone." },
    ],
  }),
  component: LevelFourPage,
});

/* ─── Script ──────────────────────────────────────────────────────────────── */

const ACCENT = "#0e5046"; // dark green
const TINT   = "#b6c8c6"; // pastel sage

const STAGE =
  "The trail opens onto slow water. Calm, not because nothing's under the surface, but because it's had time to settle.";

const INTRO_LINES = [
  "(crouches at the bank, doesn't touch the water)",
  "Quieter waypoint. I'm not asking if you feel good — feelings come and go, that's not the metric.",
  "I'm asking if you know what you're feeling, and whether you handle it like an adult once you do.",
];

const QUESTIONS = [
  "Are you actually tuned in to your own emotional state, or do you find out you're furious three days later?",
  "When something hard hits, do you process it in ways that are actually good for you?",
  "Are you hauling around anything unresolved right now — something you've just never put down?",
  "Do you give yourself any grace when things are rough, or is self-flagellation your whole coping strategy?",
  "Do you ask for support when you need it, or wait for someone to notice you're drowning?",
];

const OUTRO_ACTION = "(still watching the water)";
const OUTRO_SPEECH =
  "Emotional wellbeing was never about not having hard feelings. It's whether you can carry them without dumping them on the next person who crosses your path. That's the entire skill. Most people never learn it.";

/* ─── Page ────────────────────────────────────────────────────────────────── */

function LevelFourPage() {
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
    if (qi < QUESTIONS.length - 1) setActiveQ(qi + 1);
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
      background: `linear-gradient(160deg, ${TINT} 0%, ${LC.offWhite} 50%, ${TINT}66 100%)`,
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gridTemplateRows: "100dvh",
      overflow: "hidden",
      fontFamily: "'League Spartan', sans-serif",
    }}>

      {/* ── LEFT: dialogue + Q&A ── */}
      <div style={{ position: "relative" }}>
        {/* Scroll fade overlay — sits over the scrollable column, doesn't block interaction */}
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
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: LC.mutedInk, marginBottom: "0.5rem" }}>
            Waypoint 4 · Emotional Wellbeing
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 700, color: ACCENT, letterSpacing: "-0.025em", margin: "0 0 1rem" }}>
            The Still River
          </h1>
          <p style={{
            fontSize: "1rem", color: LC.mutedInk, lineHeight: 1.7,
            fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
            maxWidth: "520px", margin: "0 0 1.5rem",
            paddingLeft: "1rem", borderLeft: `2px solid ${LC.ruleLine}`,
          }}>
            {STAGE}
          </p>
          <div style={{ height: "1px", background: LC.ruleLine }} />
        </div>

        {/* Intro speech bubbles */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <img src={masqotImg} alt="The Trailkeeper" style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: `2px solid ${ACCENT}`, flexShrink: 0 }} />
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: LC.mutedInk }}>
              — The Trailkeeper
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", paddingLeft: "52px" }}>
            {INTRO_LINES.map((line, i) => {
              const isAction = line.startsWith("(");
              return (
                <div key={i} style={{
                  background: isAction ? "transparent" : "white",
                  border: isAction ? "none" : `1px solid ${LC.ruleLine}`,
                  borderRadius: "4px 18px 18px 18px",
                  padding: isAction ? "0.25rem 0" : "1rem 1.25rem",
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: isAction ? "0.9rem" : "clamp(1.1rem, 2.2vw, 1.35rem)",
                  color: isAction ? LC.mutedInk : LC.ink,
                  lineHeight: 1.65,
                  maxWidth: "520px",
                  boxShadow: isAction ? "none" : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>

        {/* Begin button */}
        {phase === "intro" && (
          <button type="button" onClick={() => setPhase("questions")} style={ctaStyle(ACCENT)}>
            Begin Questions →
          </button>
        )}

        {/* Q&A thread */}
        {(phase === "questions" || phase === "outro") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: LC.mutedInk }}>
              Question {Math.min(activeQ + 1, 5)} of 5
            </div>

            {QUESTIONS.map((q, qi) => {
              const answered = stones[qi] > 0;
              const isCurrent = qi === activeQ && phase === "questions";
              const committed = answered && !isCurrent;

              return (
                <div key={qi} style={{ opacity: committed ? 0.55 : 1, transition: "opacity 0.25s ease" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <img src={masqotImg} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${ACCENT}`, marginTop: "2px" }} />
                    <div style={{
                      background: committed ? LC.offWhite : "white",
                      border: `1px solid ${LC.ruleLine}`,
                      borderRadius: "4px 14px 14px 14px",
                      padding: committed ? "0.6rem 0.9rem" : "1rem 1.25rem",
                      fontSize: committed ? "1rem" : "1.2rem",
                      color: LC.ink, lineHeight: 1.6, maxWidth: "85%",
                      transition: "all 0.25s ease",
                      fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
                    }}>
                      <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: LC.mutedInk, display: "block", marginBottom: "0.35rem", fontStyle: "normal", fontFamily: "'League Spartan', sans-serif" }}>
                        0{qi + 1}
                      </span>
                      {q}
                    </div>
                  </div>

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

                  {isCurrent && (
                    <div style={{ paddingLeft: "38px", marginTop: "0.6rem" }}>
                      <StoneRow value={stones[qi]} onSelect={(v) => selectStone(qi, v)} />
                    </div>
                  )}
                </div>
              );
            })}

            {phase === "questions" && allAnswered && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setPhase("outro")} style={ctaStyle(ACCENT)}>
                  Drop the stones →
                </button>
              </div>
            )}

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
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <img src={masqotImg} alt="" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${ACCENT}`, marginTop: "2px" }} />
                  <div style={{
                    background: TINT, border: `1px solid ${LC.ruleLine}`,
                    borderRadius: "4px 14px 14px 14px",
                    padding: "0.9rem 1.1rem", maxWidth: "500px",
                  }}>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: LC.mutedInk, marginBottom: "0.5rem" }}>
                      {OUTRO_ACTION}
                    </div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: LC.ink, lineHeight: 1.65 }}>
                      {OUTRO_SPEECH}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => { sessionStorage.setItem("trail-score-4", String(avg)); navigate({ to: "/levelfive" }); }}
                    style={ctaStyle(ACCENT)}
                  >
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

      {/* ── RIGHT: mascot slides in from right ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${TINT} 0%, ${TINT}66 100%)`,
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
          background: `radial-gradient(ellipse, ${ACCENT}22 0%, transparent 70%)`,
          filter: "blur(24px)", pointerEvents: "none",
        }} />
        <img
          src={masqotImg}
          alt="The Trailkeeper"
          style={{
            width: "100%", maxWidth: "340px", height: "auto",
            objectFit: "contain", objectPosition: "bottom",
            filter: `drop-shadow(0 8px 32px rgba(14,80,70,0.18)) drop-shadow(0 2px 8px rgba(14,80,70,0.10))`,
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

/* ─── Sub-components ──────────────────────────────────────────────────────── */

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
      color: LC.mutedInk, marginBottom: "0.75rem",
      display: "flex", alignItems: "center", gap: "0.5rem",
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
            <button key={n} type="button" onClick={() => handleSelect(n)} aria-label={`Stone ${n}`} style={{
              width: "64px", height: "64px", borderRadius: "50%",
              border: `2px solid ${sel ? ACCENT : LC.ruleLine}`,
              background: sel ? ACCENT : "white",
              color: sel ? "white" : LC.mutedInk,
              fontSize: "1.2rem", fontWeight: 700, cursor: "pointer",
              transform: dropping ? "scale(0.82) translateY(6px)" : sel ? "scale(1.1)" : "scale(1)",
              transition: dropping ? "transform 0.12s ease" : "all 0.18s ease",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: sel ? `0 4px 16px ${ACCENT}40` : "0 2px 6px rgba(0,0,0,0.06)",
            }}>
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
    background: accent, color: "white", border: "none",
    borderRadius: "9999px", padding: "0.85rem 2.2rem",
    fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.07em",
    cursor: "pointer", fontFamily: "'League Spartan', sans-serif",
    boxShadow: `0 3px 16px ${accent}40`, transition: "all 0.2s",
  };
}

/* ─── Crouch at bank animation ───────────────────────────────────────────── */

function CrouchAtBank({ accent }: { accent: string }) {
  return (
    <div style={{
      marginTop: "1.1rem",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      height: "90px",
      position: "relative",
      userSelect: "none",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes cb-ripple1 {
          0%   { r: 4;  opacity: 0.55; }
          100% { r: 22; opacity: 0; }
        }
        @keyframes cb-ripple2 {
          0%   { r: 4;  opacity: 0.4; }
          100% { r: 18; opacity: 0; }
        }
        @keyframes cb-ripple3 {
          0%   { r: 3;  opacity: 0.3; }
          100% { r: 14; opacity: 0; }
        }
        @keyframes cb-body {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-1.5px); }
        }
        @keyframes cb-hand {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(2px) rotate(4deg); }
          60%     { transform: translateY(2px) rotate(4deg); }
        }
      `}</style>

      <svg
        width="220" height="90"
        viewBox="0 0 220 90"
        fill="none"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        {/* ── Water surface ── */}
        {/* Bank / ground */}
        <path d="M0 72 Q55 68 110 70 Q165 72 220 70 L220 90 L0 90 Z"
          fill="#b6c8c6" opacity="0.45"/>
        {/* Water */}
        <path d="M60 74 Q90 70 110 72 Q130 74 160 71 L165 90 L55 90 Z"
          fill="#66c3b7" opacity="0.35"/>
        {/* Water shimmer lines */}
        <path d="M70 77 Q90 75 105 76" stroke="white" strokeWidth="1" opacity="0.5" strokeLinecap="round"/>
        <path d="M112 78 Q128 76 145 77" stroke="white" strokeWidth="0.8" opacity="0.4" strokeLinecap="round"/>

        {/* ── Ripples (concentric, staggered) — near where hand hovers ── */}
        <circle cx="108" cy="72" fill="none" stroke={accent} strokeWidth="1.2">
          <animate attributeName="r" values="3;22" dur="2s" repeatCount="indefinite" begin="0s"/>
          <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" begin="0s"/>
        </circle>
        <circle cx="108" cy="72" fill="none" stroke={accent} strokeWidth="1">
          <animate attributeName="r" values="3;16" dur="2s" repeatCount="indefinite" begin="0.55s"/>
          <animate attributeName="opacity" values="0.4;0" dur="2s" repeatCount="indefinite" begin="0.55s"/>
        </circle>
        <circle cx="108" cy="72" fill="none" stroke={accent} strokeWidth="0.8">
          <animate attributeName="r" values="2;10" dur="2s" repeatCount="indefinite" begin="1.1s"/>
          <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" begin="1.1s"/>
        </circle>

        {/* ── Figure crouched at bank ── */}
        <g style={{ animation: "cb-body 3.5s ease-in-out infinite" }}>

          {/* Back leg (further) */}
          <path d="M96 56 L88 66 L84 72" stroke="#2d5a52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Back foot */}
          <path d="M84 72 L79 73" stroke="#2d5a52" strokeWidth="2.5" strokeLinecap="round"/>

          {/* Torso — leaning forward */}
          <path d="M100 38 C100 38 97 44 95 50 C93 55 94 58 96 60"
            stroke="#1a3d38" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

          {/* Front leg (closer) */}
          <path d="M96 60 L100 68 L104 73" stroke="#1a3d38" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Front foot */}
          <path d="M104 73 L110 74" stroke="#1a3d38" strokeWidth="3" strokeLinecap="round"/>

          {/* Upper arm */}
          <path d="M97 44 C101 48 105 54 107 60"
            stroke="#1a3d38" strokeWidth="3" strokeLinecap="round" fill="none"
            style={{ animation: "cb-hand 3.5s ease-in-out infinite", transformOrigin: "97px 44px" }}
          />
          {/* Forearm / hand hovering over water — NOT touching */}
          <path d="M107 60 C108 63 109 66 109 70"
            stroke="#1a3d38" strokeWidth="2.5" strokeLinecap="round" fill="none"
            style={{ animation: "cb-hand 3.5s ease-in-out infinite", transformOrigin: "107px 60px" }}
          />
          {/* Hand fingertips — open, hovering ~2px above water */}
          <circle cx="108" cy="70" r="2.2" fill="#f2dfc8" stroke="#b8956a" strokeWidth="0.9"/>
          <circle cx="111" cy="69.5" r="1.8" fill="#f2dfc8" stroke="#b8956a" strokeWidth="0.9"/>
          <circle cx="105.5" cy="69.5" r="1.8" fill="#f2dfc8" stroke="#b8956a" strokeWidth="0.9"/>

          {/* Head */}
          <circle cx="101" cy="33" r="7.5" fill="#f2dfc8" stroke="#b8956a" strokeWidth="1.2"/>
          {/* Hair */}
          <path d="M94 31 C94 24 108 24 108 31" fill="#3d2b1a" stroke="none"/>
          {/* Eye — looking down at water */}
          <ellipse cx="104" cy="34" rx="1.2" ry="1.5" fill="#1a0f00" transform="rotate(10 104 34)"/>
          {/* Nose */}
          <path d="M105.5 36 Q107 37 106 38" stroke="#b8956a" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
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

  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true), 80);
    const t2 = setTimeout(() => setMascotIn(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
        position: "fixed", inset: 0, zIndex: 9998, overflow: "hidden",
        background: `linear-gradient(160deg, ${tint} 0%, #fafaf8 45%, ${tint}88 100%)`,
        display: "grid", gridTemplateColumns: "1fr 380px", gridTemplateRows: "100dvh",
        fontFamily: "'League Spartan', sans-serif",
      }}
      onClick={advance}
    >
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "3rem 2.5rem 3rem 3rem",
        opacity: entered ? 1 : 0, transition: "opacity 0.6s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accent }} />
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#5b6a65" }}>
            The Trailkeeper
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
          {lines.map((_, i) => (
            <div key={i} style={{
              width: i === lineIndex ? "20px" : "6px", height: "6px", borderRadius: "3px",
              background: i <= lineIndex ? accent : "#e6e6e2",
              opacity: i < lineIndex ? 0.5 : 1, transition: "all 0.3s",
            }} />
          ))}
        </div>
        <div style={{
          background: "#fafaf8", border: "1px solid #e6e6e2",
          borderRadius: "16px 16px 16px 4px", padding: "1.5rem 1.75rem",
          maxWidth: "520px", boxShadow: "0 4px 24px rgba(14,80,70,0.08)",
          minHeight: "100px", cursor: "pointer",
        }}>
          <p style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontStyle: isAction ? "normal" : "italic",
            fontSize: isAction ? "0.85rem" : "clamp(1rem, 2.2vw, 1.2rem)",
            color: isAction ? "#5b6a65" : "#16201d", lineHeight: 1.65, margin: 0,
          }}>
            {displayedText}
            <span style={{
              display: "inline-block", width: "2px", height: "1.1em",
              background: accent, marginLeft: "2px", verticalAlign: "middle",
              opacity: displayedText.length < lines[lineIndex].length ? 1 : 0,
              animation: "levelCursorBlink 0.7s step-end infinite",
            }} />
          </p>

          {/* Crouch at bank animation — shown on the action beat line */}
          {isAction && displayedText.length > 10 && (
            <CrouchAtBank accent={accent} />
          )}
        </div>
        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
          {isLast ? (
            <button type="button" onClick={(e) => { e.stopPropagation(); onDone(); }} style={{
              background: accent, color: "white", border: "none",
              borderRadius: "9999px", padding: "0.65rem 1.5rem",
              fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.07em",
              cursor: "pointer", fontFamily: "'League Spartan', sans-serif",
              boxShadow: `0 3px 16px ${accent}40`,
            }}>
              Let's go →
            </button>
          ) : (
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5b6a65" }}>
              tap to continue
            </span>
          )}
        </div>
      </div>

      <div style={{
        position: "relative", overflow: "hidden",
        background: `linear-gradient(180deg, ${tint} 0%, ${tint}55 100%)`,
        borderLeft: "1px solid #e6e6e2",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
        transform: mascotIn ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "320px", height: "200px",
          background: `radial-gradient(ellipse, ${accent}22 0%, transparent 70%)`,
          filter: "blur(24px)", pointerEvents: "none",
        }} />
        <img src={masqotImg} alt="The Trailkeeper" style={{
          width: "100%", maxWidth: "340px", height: "auto",
          objectFit: "contain", objectPosition: "bottom",
          filter: `drop-shadow(0 8px 32px rgba(14,80,70,0.15)) drop-shadow(0 2px 8px rgba(14,80,70,0.10))`,
          position: "relative", zIndex: 1,
        }} />
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
