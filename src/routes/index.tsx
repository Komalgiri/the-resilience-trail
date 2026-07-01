import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Resilience Trail — Luke Coutinho" },
      { name: "description", content: "Seven waypoints. Thirty-five stones. One honest look at how you're actually walking." },
    ],
  }),
  component: TrailGame,
});

/* ---------- content ---------- */

type Waypoint = {
  id: string;
  name: string;
  subtitle: string;
  color: "orange" | "green" | "teal" | "darkgreen";
  stage: string;
  intro: string;
  questions: string[];
  outro: string;
};

const WAYPOINTS: Waypoint[] = [
  {
    id: "orchard",
    name: "The Orchard",
    subtitle: "Nutrition",
    color: "green",
    stage: "Rows of trees. Some heavy with fruit. Some empty. The ground is soft, littered with what fell and rotted.",
    intro: "This is where you eat. Not where you post about eating. Answer for the last month, not the last good week.",
    questions: [
      "Most of what you ate this month came from actual plants, not from a factory.",
      "You drink water because you're thirsty, not because an app told you.",
      "You stop eating when you're full, not when the plate is empty.",
      "Sugar and ultra-processed stuff shows up rarely, not as a food group.",
      "You know what a real meal looks like and you cook one for yourself most weeks.",
    ],
    outro: "Alright. Pick up your stones. The trees don't judge. I don't either. The body keeps its own ledger.",
  },
  {
    id: "long-night",
    name: "The Long Night",
    subtitle: "Sleep",
    color: "darkgreen",
    stage: "The sky drops fast here. A cold, quiet dark. No moon. Just breath and the sound of your own ribs.",
    intro: "This is sleep. The real thing. Not the six-hour brag. Answer for how you actually spend the dark.",
    questions: [
      "You get seven to nine hours most nights without needing a chemical assist.",
      "You fall asleep in under twenty minutes and don't wake up staring at the ceiling at 3 a.m.",
      "You wake up feeling like a person, not like someone dug you up.",
      "The phone stays out of the bed. The bed is for sleeping and one other thing.",
      "Your sleep and wake times are roughly the same, even on weekends.",
    ],
    outro: "The dark isn't your enemy. It's the only free medicine you're going to get. Walk on.",
  },
  {
    id: "storm-shelter",
    name: "The Storm Shelter",
    subtitle: "Stress Management",
    color: "teal",
    stage: "A low stone hut, roof half torn off. Wind outside. Inside, a single bench and a kettle. You choose to sit or you don't.",
    intro: "Stress isn't the storm. It's what you do while it's happening. Answer for how you handle the weather.",
    questions: [
      "When pressure builds, you notice it in your body before it wrecks the day.",
      "You have at least one thing that actually calms you down. Not scrolling. Not drinking.",
      "You can say no without a three-paragraph apology.",
      "You take real breaks in the day, not just breaks from one screen to another screen.",
      "You know what's yours to fix and what isn't, and you mostly stay in your lane.",
    ],
    outro: "The storm passes. It always does. Whether you're standing or crawling when it clears is on you.",
  },
  {
    id: "still-river",
    name: "The Still River",
    subtitle: "Emotional Wellbeing",
    color: "teal",
    stage: "Slow black water. So flat it holds the sky. If you lean over it, it holds your face too. Whether you want it to or not.",
    intro: "This one asks you to look. Most people won't. You can lie to the stones but the water already knows.",
    questions: [
      "You can name what you're feeling without needing a diagnosis or a hashtag.",
      "You let yourself feel bad without immediately trying to fix it or numb it.",
      "You have at least one person you can be completely honest with.",
      "You're not carrying a grudge that's older than your last passport.",
      "You laugh, actually laugh, at least a few times a week.",
    ],
    outro: "Good. Whatever you saw in there, it's information, not a verdict. Keep moving.",
  },
  {
    id: "climb",
    name: "The Climb",
    subtitle: "Movement and Physical Function",
    color: "orange",
    stage: "The trail tilts up. Loose rock. Your calves start talking. Your lungs join in a minute later.",
    intro: "The body was built to move. Not to be optimised. Just moved. Answer for the last month.",
    questions: [
      "You move on purpose most days. Walk, lift, stretch, something.",
      "You can carry your own groceries up a flight of stairs without a rest at the top.",
      "You can get up off the floor without using your hands. Or you're honest that you can't.",
      "You don't sit for more than an hour without your body reminding you to stand.",
      "You've done something in the last week that made you sweat and breathe hard.",
    ],
    outro: "Bodies rust in place. Yours included. Pick up the stones and keep walking.",
  },
  {
    id: "clearing",
    name: "The Clearing",
    subtitle: "Environmental Awareness",
    color: "green",
    stage: "The trees open up. Sun on grass. Somewhere far off, a plastic bag caught in a branch is doing its slow, ugly dance.",
    intro: "This is where you notice you live somewhere. That the air, the room, the light — all of it — is part of the deal.",
    questions: [
      "You get sunlight on your skin most days, not just through a car window.",
      "The room you sleep in is dark, quiet, and not full of your unfinished laundry.",
      "You know roughly what's in the air, water, and products you use every day.",
      "You go outside — actual outside, with dirt and weather — at least a few times a week.",
      "Your space feels like a place you live in, not a storage unit you happen to sleep in.",
    ],
    outro: "The room shapes the person in it. Change the room, change the odds. Onwards.",
  },
  {
    id: "campfire",
    name: "The Campfire",
    subtitle: "Relationships and Social Wellbeing",
    color: "orange",
    stage: "A small fire. Two logs pulled up close. One is empty. Whether that bothers you is the whole question.",
    intro: "Last one. This is people. The ones you chose and the ones you inherited. Answer honest.",
    questions: [
      "You have at least two people who would show up at 2 a.m. and you'd let them.",
      "You give more than you take, but not so much you disappear.",
      "You've had a real face-to-face conversation this week that wasn't about logistics.",
      "You can be alone without it feeling like punishment.",
      "The people around you actually make you a bit better, not a bit smaller.",
    ],
    outro: "Fire's dying down. That's fine. You know the way back from here.",
  },
];

/* ---------- component ---------- */

type Phase =
  | { kind: "trailhead"; expanded: boolean }
  | { kind: "waypoint"; index: number }
  | { kind: "outro"; index: number }
  | { kind: "reading" };

type Answers = Record<string, number[]>; // waypoint.id -> array[5] of 1..5 or 0

function TrailGame() {
  const [phase, setPhase] = useState<Phase>({ kind: "trailhead", expanded: false });
  const [answers, setAnswers] = useState<Answers>({});

  const waypointAverages = useMemo(() => {
    return WAYPOINTS.map((w) => {
      const arr = answers[w.id];
      if (!arr || arr.length !== 5 || arr.some((n) => !n)) return 0;
      const avg = arr.reduce((a, b) => a + b, 0) / 5;
      return Math.round(avg);
    });
  }, [answers]);

  const total = waypointAverages.reduce((a, b) => a + b, 0);

  function setAnswer(wpId: string, qIdx: number, value: number) {
    setAnswers((prev) => {
      const arr = prev[wpId] ? [...prev[wpId]] : Array(5).fill(0);
      arr[qIdx] = value;
      return { ...prev, [wpId]: arr };
    });
  }

  function allAnswered(wpId: string) {
    const arr = answers[wpId];
    return arr && arr.length === 5 && arr.every((n) => n >= 1);
  }

  function begin() {
    setPhase({ kind: "waypoint", index: 0 });
  }

  function advanceFromWaypoint(i: number) {
    setPhase({ kind: "outro", index: i });
  }

  function advanceFromOutro(i: number) {
    if (i + 1 < WAYPOINTS.length) setPhase({ kind: "waypoint", index: i + 1 });
    else setPhase({ kind: "reading" });
  }

  function reset() {
    setAnswers({});
    setPhase({ kind: "trailhead", expanded: false });
  }

  return (
    <div className="min-h-screen w-full">
      <TopBar phase={phase} averages={waypointAverages} />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-10 md:pt-16">
        {phase.kind === "trailhead" && (
          <Trailhead
            expanded={phase.expanded}
            onToggle={() => setPhase({ kind: "trailhead", expanded: !phase.expanded })}
            onBegin={begin}
          />
        )}

        {phase.kind === "waypoint" && (
          <WaypointView
            waypoint={WAYPOINTS[phase.index]}
            index={phase.index}
            answers={answers[WAYPOINTS[phase.index].id] || Array(5).fill(0)}
            onAnswer={(qi, v) => setAnswer(WAYPOINTS[phase.index].id, qi, v)}
            canAdvance={!!allAnswered(WAYPOINTS[phase.index].id)}
            onAdvance={() => advanceFromWaypoint(phase.index)}
          />
        )}

        {phase.kind === "outro" && (
          <OutroView
            waypoint={WAYPOINTS[phase.index]}
            index={phase.index}
            average={waypointAverages[phase.index]}
            onAdvance={() => advanceFromOutro(phase.index)}
          />
        )}

        {phase.kind === "reading" && (
          <Reading total={total} averages={waypointAverages} onReset={reset} />
        )}
      </main>
    </div>
  );
}

/* ---------- top bar / progress ring ---------- */

function TopBar({ phase, averages }: { phase: Phase; averages: number[] }) {
  const currentIndex =
    phase.kind === "waypoint" ? phase.index :
    phase.kind === "outro" ? phase.index :
    phase.kind === "reading" ? WAYPOINTS.length - 1 :
    -1;

  return (
    <header className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-6 pt-8">
      <div className="flex items-center gap-3">
        <CircleOfLife averages={averages} current={currentIndex} size={44} />
        <div className="leading-tight">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Luke Coutinho
          </div>
          <div className="text-sm font-semibold">The Resilience Trail</div>
        </div>
      </div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Adult Cut
      </div>
    </header>
  );
}

function CircleOfLife({
  averages,
  current,
  size = 220,
}: {
  averages: number[];
  current: number;
  size?: number;
}) {
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const segCount = WAYPOINTS.length;
  const gap = 0.02; // radians
  const segAngle = (Math.PI * 2) / segCount;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {WAYPOINTS.map((w, i) => {
        const startAngle = -Math.PI / 2 + i * segAngle + gap / 2;
        const endAngle = startAngle + segAngle - gap;
        const filled = averages[i] > 0;
        const isCurrent = i === current;
        const fillFrac = filled ? averages[i] / 5 : 0;

        const trackPath = arcPath(cx, cy, r, startAngle, endAngle);
        const fillEnd = startAngle + (endAngle - startAngle) * fillFrac;
        const fillPath = fillFrac > 0 ? arcPath(cx, cy, r, startAngle, fillEnd) : null;

        return (
          <g key={w.id}>
            <path
              d={trackPath}
              fill="none"
              stroke={isCurrent ? `var(--color-${w.color})` : "var(--color-border)"}
              strokeOpacity={isCurrent && !filled ? 0.4 : 1}
              strokeWidth={size > 100 ? 5 : 3}
              strokeLinecap="round"
            />
            {fillPath && (
              <path
                d={fillPath}
                fill="none"
                stroke={`var(--color-${w.color})`}
                strokeWidth={size > 100 ? 5 : 3}
                strokeLinecap="round"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/* ---------- trailhead ---------- */

function Trailhead({
  expanded,
  onToggle,
  onBegin,
}: {
  expanded: boolean;
  onToggle: () => void;
  onBegin: () => void;
}) {
  return (
    <section className="mt-10 md:mt-16">
      <StageDirection>
        A dirt path begins where the road ends. Someone has left a small leather pouch on a flat stone.
        Inside: five smooth pebbles, numbered.
      </StageDirection>

      <SpeakerTag>The Trailkeeper</SpeakerTag>
      <Voice>
        <p>You made it. Good. Sit for a second, I'm not going to sell you anything.</p>
        <p>
          Seven waypoints. Five questions each. At every question, you drop a stone — one to five.
          One means it's a mess. Five means you've got it handled. Three means you're fine, and you're allowed to be fine.
        </p>
        <p>
          No one's watching except you. Lie if you want. The stones will still weigh what they weigh.
        </p>
      </Voice>

      {expanded && (
        <>
          <Hairline />
          <SpeakerTag>The Trailkeeper</SpeakerTag>
          <Voice>
            <p>
              What's it for. Fair. It's not a diagnosis. It's a look at where you're actually walking,
              across the seven bits of a life that decide whether the body holds up.
            </p>
            <p>
              Eating. Sleeping. Stress. Feelings. Moving. Where you live. Who's around you. That's it.
              Prevention isn't a supplement. It's noticing before the wheels come off.
            </p>
            <p>Now. Same question. Ready or not?</p>
          </Voice>
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <PrimaryButton color="darkgreen" onClick={onBegin}>
          Begin the trail
        </PrimaryButton>
        <SecondaryButton onClick={onToggle}>
          {expanded ? "Alright, let's go" : "Ask what this is for"}
        </SecondaryButton>
      </div>
    </section>
  );
}

/* ---------- waypoint ---------- */

function WaypointView({
  waypoint,
  index,
  answers,
  onAnswer,
  canAdvance,
  onAdvance,
}: {
  waypoint: Waypoint;
  index: number;
  answers: number[];
  onAnswer: (qi: number, v: number) => void;
  canAdvance: boolean;
  onAdvance: () => void;
}) {
  return (
    <section className="mt-8">
      <WaypointHeader waypoint={waypoint} index={index} />

      <StageDirection>{waypoint.stage}</StageDirection>

      <SpeakerTag>The Trailkeeper</SpeakerTag>
      <Voice>
        <p>{waypoint.intro}</p>
      </Voice>

      <div className="mt-10 space-y-8">
        {waypoint.questions.map((q, qi) => (
          <QuestionBlock
            key={qi}
            index={qi}
            question={q}
            value={answers[qi]}
            color={waypoint.color}
            onSelect={(v) => onAnswer(qi, v)}
          />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-end">
        <PrimaryButton color={waypoint.color} disabled={!canAdvance} onClick={onAdvance}>
          Drop the stones
        </PrimaryButton>
      </div>
    </section>
  );
}

function WaypointHeader({ waypoint, index }: { waypoint: Waypoint; index: number }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        Waypoint {index + 1} of 7 · {waypoint.subtitle}
      </div>
      <h1
        className="mt-2 text-4xl md:text-5xl font-semibold"
        style={{ color: `var(--color-${waypoint.color})` }}
      >
        {waypoint.name}
      </h1>
      <Hairline className="mt-6" />
    </div>
  );
}

function QuestionBlock({
  index,
  question,
  value,
  color,
  onSelect,
}: {
  index: number;
  question: string;
  value: number;
  color: Waypoint["color"];
  onSelect: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex gap-4">
        <div
          className="mt-0.5 shrink-0 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          style={{ width: "1.5rem" }}
        >
          0{index + 1}
        </div>
        <p className="text-base md:text-lg leading-relaxed">{question}</p>
      </div>
      <div className="mt-4 pl-10">
        <StoneSelector value={value} color={color} onSelect={onSelect} />
      </div>
    </div>
  );
}

function StoneSelector({
  value,
  color,
  onSelect,
}: {
  value: number;
  color: Waypoint["color"];
  onSelect: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground w-16">
        Needs work
      </span>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onSelect(n)}
              aria-label={`Stone ${n}`}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all"
              style={{
                borderColor: selected ? `var(--color-${color})` : "var(--color-border)",
                background: selected ? `var(--color-${color})` : "transparent",
                color: selected ? "white" : "var(--color-muted-foreground)",
                transform: selected ? "scale(1.05)" : "scale(1)",
              }}
            >
              <span className="text-sm font-medium">{n}</span>
            </button>
          );
        })}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground w-16 text-right">
        Solid
      </span>
    </div>
  );
}

/* ---------- outro ---------- */

function OutroView({
  waypoint,
  index,
  average,
  onAdvance,
}: {
  waypoint: Waypoint;
  index: number;
  average: number;
  onAdvance: () => void;
}) {
  const isLast = index === WAYPOINTS.length - 1;
  return (
    <section className="mt-10">
      <WaypointHeader waypoint={waypoint} index={index} />

      <div
        className="rounded-lg p-6 md:p-8"
        style={{ background: `var(--color-${waypoint.color}-tint)` }}
      >
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Stones dropped
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="text-6xl font-semibold"
            style={{ color: `var(--color-${waypoint.color})` }}
          >
            {average}
          </span>
          <span className="text-lg text-muted-foreground">/ 5</span>
        </div>
      </div>

      <SpeakerTag className="mt-8">The Trailkeeper</SpeakerTag>
      <Voice>
        <p>{waypoint.outro}</p>
      </Voice>

      <div className="mt-10 flex justify-end">
        <PrimaryButton color={waypoint.color} onClick={onAdvance}>
          {isLast ? "The Reading" : "Walk on"}
        </PrimaryButton>
      </div>
    </section>
  );
}

/* ---------- reading (closing) ---------- */

function Reading({
  total,
  averages,
  onReset,
}: {
  total: number;
  averages: number[];
  onReset: () => void;
}) {
  const band = getBand(total);

  return (
    <section className="mt-8">
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        The Reading
      </div>
      <h1 className="mt-2 text-4xl md:text-5xl font-semibold">Thirty-five stones, weighed.</h1>
      <Hairline className="mt-6" />

      <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-10">
        <CircleOfLife averages={averages} current={-1} size={220} />
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Your total
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className="text-7xl font-semibold"
              style={{ color: `var(--color-${band.color})` }}
            >
              {total}
            </span>
            <span className="text-2xl text-muted-foreground">/ 35</span>
          </div>
          <div
            className="mt-2 text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: `var(--color-${band.color})` }}
          >
            {band.label}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-7 gap-2">
        {WAYPOINTS.map((w, i) => (
          <div key={w.id} className="text-center">
            <div
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
              style={{
                background: `var(--color-${w.color}-tint)`,
                color: `var(--color-${w.color})`,
              }}
            >
              {averages[i]}
            </div>
            <div className="mt-2 text-[9px] uppercase tracking-[0.15em] text-muted-foreground leading-tight">
              {w.subtitle}
            </div>
          </div>
        ))}
      </div>

      <SpeakerTag className="mt-12">The Trailkeeper</SpeakerTag>
      <Voice>
        {band.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </Voice>

      <Hairline className="mt-10" />

      <SpeakerTag className="mt-8">The Trailkeeper</SpeakerTag>
      <Voice>
        <p>Here. Take the pouch back. The stones are yours now.</p>
        <p>Trail's still here next season. So am I. Come back when the weather changes.</p>
      </Voice>

      <div className="mt-10 flex justify-end">
        <SecondaryButton onClick={onReset}>Walk it again</SecondaryButton>
      </div>
    </section>
  );
}

function getBand(total: number): {
  label: string;
  color: Waypoint["color"];
  lines: string[];
} {
  if (total >= 30) {
    return {
      label: "Foundations solid",
      color: "darkgreen",
      lines: [
        "Alright. That's a person who's actually been paying attention.",
        "Foundations are solid. This isn't the moment to add ten new things — it's the moment to not lose what you've got. Maintenance is boring. Maintenance is the whole game.",
        "One tune-up. Pick the lowest stone on the ring and give it a quiet nudge. Don't announce it. Just do it.",
      ],
    };
  }
  if (total >= 22) {
    return {
      label: "Decent walking",
      color: "green",
      lines: [
        "Decent walking. Not a disaster, not a poster.",
        "You've got a couple of waypoints doing the heavy lifting and one or two dragging the rest down like a wet coat. You know which ones. The ring told you.",
        "Grab the draggiest one. Just that one. Give it a real month. Not a week of theatrics — a month of ordinary. Then come back.",
      ],
    };
  }
  if (total >= 15) {
    return {
      label: "Plenty of room",
      color: "teal",
      lines: [
        "Plenty of room. That's not an insult, it's a map.",
        "The good news about being here is the return on any honest effort is enormous. You are not chasing decimals. You are chasing whole stones.",
        "Pick the nearest waypoint. The one that's most in your face right now. Start there. One habit. Small enough to be embarrassing. Do it anyway.",
      ],
    };
  }
  return {
    label: "Starting line",
    color: "orange",
    lines: [
      "This is a starting line. Not a life sentence. Read that again.",
      "Somewhere along the way, a lot of small things slid. That happens. It's not a moral failure. It is, however, information you don't get to ignore anymore.",
      "Pick one waypoint. Maybe two, if you're feeling honest. The tiniest, most repeatable thing you can do inside it. Do it for a month before you touch anything else. That's the deal.",
    ],
  };
}

/* ---------- shared UI ---------- */

function StageDirection({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-sm text-muted-foreground leading-relaxed max-w-xl">
      {children}
    </p>
  );
}

function SpeakerTag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 ${className}`}>
      — {children}
    </div>
  );
}

function Voice({ children }: { children: React.ReactNode }) {
  return (
    <div className="voice text-lg md:text-xl text-foreground space-y-4 max-w-xl">
      {children}
    </div>
  );
}

function Hairline({ className = "" }: { className?: string }) {
  return <div className={`hairline ${className}`} />;
}

function PrimaryButton({
  children,
  onClick,
  color = "darkgreen",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: Waypoint["color"];
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all disabled:cursor-not-allowed"
      style={{
        background: disabled ? "var(--color-border)" : `var(--color-${color})`,
        color: disabled ? "var(--color-muted-foreground)" : "white",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children} →
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium tracking-wide text-foreground transition-all hover:bg-muted"
    >
      {children}
    </button>
  );
}
