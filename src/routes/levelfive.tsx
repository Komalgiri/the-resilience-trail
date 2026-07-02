import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import masqotImg from "../masqot.png";
import { LC } from "../lib/trail-data";
import { loadVoice, speakLine, stopTTS } from "../lib/tts";

export const Route = createFileRoute("/levelfive")({
  head: () => ({
    meta: [
      { title: "The Climb — The Resilience Trail" },
      { name: "description", content: "Waypoint 5: Movement & Physical Function. Five questions. Drop a stone." },
    ],
  }),
  component: LevelFivePage,
});

/* ─── Script ──────────────────────────────────────────────────────────────── */

const ACCENT = "#99cf16"; // green
const TINT   = "#e2f0c4"; // pastel green

const STAGE =
  "The trail steepens for the first time. Not brutal. Just enough that you notice your own legs are involved.";

const INTRO_LINES = [
  "(already a few steps ahead, not even winded)",
  "Not racing you. Just want to know — does your body still do what you ask of it without filing a complaint?",
];

const QUESTIONS = [
  "Are you physically active most days of the week, or is \"active\" a memory from a few years back?",
  "Real strength, mobility, and endurance — or the illusion of fitness held up by good lighting?",
  "How much of your day is spent sitting, if you're being honest?",
  "Can you handle your daily life comfortably and independently, or are you already negotiating with your own joints?",
  "Is movement something you build in on purpose, or something that happens to you by accident twice a month?",
];

const OUTRO_ACTION = "(waits at the top, offers a hand — take it or don't)";
const OUTRO_SPEECH =
  "Movement was never just exercise. It's the lease you're paying on being able to move your own body twenty years from now. Every stone back there is a payment, one way or another.";

/* ─── Page ────────────────────────────────────────────────────────────────── */

function LevelFivePage() {
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

  useEffect(() => { loadVoice(); }, []);

  useEffect(() => {
    if (phase !== "questions") {
      stopTTS();
      return;
    }
    speakLine(QUESTIONS[activeQ]);
  }, [phase, activeQ]);

  useEffect(() => () => stopTTS(), []);

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
            Waypoint 5 · Movement &amp; Physical Function
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 700, color: ACCENT, letterSpacing: "-0.025em", margin: "0 0 1rem" }}>
            The Climb
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
                    onClick={() => { sessionStorage.setItem("trail-score-5", String(avg)); navigate({ to: "/levelsix" }); }}
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
            filter: `drop-shadow(0 8px 32px rgba(153,207,22,0.18)) drop-shadow(0 2px 8px rgba(14,80,70,0.10))`,
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

/* ─── Steps ahead animation ──────────────────────────────────────────────── */
// Figure walking briskly — already a few strides ahead, relaxed posture.

function StepsAhead({ accent }: { accent: string }) {
  return (
    <div style={{ marginTop: "1.1rem", userSelect: "none" }}>
      <style>{`
        @keyframes sa-stride {
          0%,100% { transform: translateX(0px);  }
          50%     { transform: translateX(6px);   }
        }
        @keyframes sa-legF {
          0%,100% { transform: rotate(28deg);  }
          50%     { transform: rotate(-22deg); }
        }
        @keyframes sa-legB {
          0%,100% { transform: rotate(-22deg); }
          50%     { transform: rotate(28deg);  }
        }
        @keyframes sa-armF {
          0%,100% { transform: rotate(-22deg); }
          50%     { transform: rotate(22deg);  }
        }
        @keyframes sa-armB {
          0%,100% { transform: rotate(22deg);  }
          50%     { transform: rotate(-22deg); }
        }
        @keyframes sa-bob {
          0%,100% { transform: translateY(0px);  }
          25%,75% { transform: translateY(-2px); }
        }
      `}</style>

      <svg width="200" height="72" viewBox="0 0 200 72" fill="none" aria-hidden="true"
        style={{ display: "block", margin: "0 auto", overflow: "visible" }}>

        {/* Ground line */}
        <line x1="20" y1="66" x2="180" y2="66" stroke="#c8d8b0" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        {/* Footstep dots behind figure */}
        <circle cx="52" cy="67" r="2" fill={accent} opacity="0.3"/>
        <circle cx="68" cy="67" r="2" fill={accent} opacity="0.2"/>
        <circle cx="84" cy="67" r="1.5" fill={accent} opacity="0.12"/>

        {/* ── Walking figure — centre ~x130 ── */}
        <g style={{ animation: "sa-bob 0.55s ease-in-out infinite", transformOrigin: "130px 66px" }}>

          {/* Back arm */}
          <g style={{ animation: "sa-armB 0.55s ease-in-out infinite", transformOrigin: "130px 36px" }}>
            <path d="M130 36 L120 50" stroke="#1a3d38" strokeWidth="2.8" strokeLinecap="round"/>
          </g>

          {/* Back leg */}
          <g style={{ animation: "sa-legB 0.55s ease-in-out infinite", transformOrigin: "130px 52px" }}>
            <path d="M130 52 L122 66" stroke="#1a3d38" strokeWidth="3" strokeLinecap="round"/>
          </g>

          {/* Torso */}
          <path d="M130 26 C130 26 129 33 130 38 C130.5 42 130 47 130 52"
            stroke="#0e5046" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

          {/* Front leg */}
          <g style={{ animation: "sa-legF 0.55s ease-in-out infinite", transformOrigin: "130px 52px" }}>
            <path d="M130 52 L138 66" stroke="#0e5046" strokeWidth="3.2" strokeLinecap="round"/>
          </g>

          {/* Front arm */}
          <g style={{ animation: "sa-armF 0.55s ease-in-out infinite", transformOrigin: "130px 36px" }}>
            <path d="M130 36 L140 49" stroke="#0e5046" strokeWidth="2.8" strokeLinecap="round"/>
          </g>

          {/* Head */}
          <circle cx="130" cy="20" r="7" fill="#f2dfc8" stroke="#b8956a" strokeWidth="1.1"/>
          {/* Hair */}
          <path d="M123 18 C123 12 137 12 137 18" fill="#3d2b1a"/>
          {/* Eye — looking forward */}
          <ellipse cx="133" cy="20" rx="1.1" ry="1.3" fill="#1a0f00"/>
          {/* Slight smile */}
          <path d="M130 23 Q132 24.5 134 23" stroke="#b8956a" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        </g>

        {/* Motion lines ahead of figure */}
        <line x1="148" y1="38" x2="162" y2="38" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <line x1="150" y1="44" x2="160" y2="44" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.35"/>
        <line x1="152" y1="50" x2="159" y2="50" stroke={accent} strokeWidth="0.7" strokeLinecap="round" opacity="0.2"/>
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

  useEffect(() => { loadVoice(); }, []);
  useEffect(() => () => stopTTS(), []);

  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true), 80);
    const t2 = setTimeout(() => setMascotIn(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const line = lines[lineIndex];
    setDisplayedText("");
    speakLine(line);
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
    if (isLast) { stopTTS(); onDone(); return; }
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
          maxWidth: "520px", boxShadow: "0 4px 24px rgba(153,207,22,0.08)",
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
          {/* Steps ahead animation — shown on the action beat */}
          {isAction && displayedText.length > 10 && (
            <StepsAhead accent={accent} />
          )}
        </div>
        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
          {isLast ? (
            <button type="button" onClick={(e) => { e.stopPropagation(); stopTTS(); onDone(); }} style={{
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
          filter: `drop-shadow(0 8px 32px rgba(153,207,22,0.15)) drop-shadow(0 2px 8px rgba(14,80,70,0.10))`,
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
