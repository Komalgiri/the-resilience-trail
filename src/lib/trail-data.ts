/* ─── LC Brand Palette ────────────────────────────────────────────────────── */

export const LC = {
  offWhite: "#fafaf8",
  ink: "#16201d",
  mutedInk: "#5b6a65",
  ruleLine: "#e6e6e2",
  orange: "#ff8f00",
  green: "#99cf16",
  teal: "#66c3b7",
  darkGreen: "#0e5046",
  pastelOrange: "#ffdfb4",
  pastelGreen: "#e2f0c4",
  pastelTeal: "#d4efec",
  pastelSage: "#b6c8c6",
} as const;

/* ─── Types ───────────────────────────────────────────────────────────────── */

export type WaypointColor = "orange" | "green" | "teal" | "darkgreen";

export type Waypoint = {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: WaypointColor;
  stage: string;
  intro: string;
  questions: string[];
  outro: string;
};

export type Phase =
  | { kind: "trailhead"; expanded: boolean }
  | { kind: "waypoint"; index: number }
  | { kind: "outro"; index: number }
  | { kind: "reading" };

export type Answers = Record<string, number[]>;

/* ─── Color maps ──────────────────────────────────────────────────────────── */

export const COLOR_HEX: Record<WaypointColor, string> = {
  orange: LC.orange,
  green: LC.green,
  teal: LC.teal,
  darkgreen: LC.darkGreen,
};

export const TINT_HEX: Record<WaypointColor, string> = {
  orange: LC.pastelOrange,
  green: LC.pastelGreen,
  teal: LC.pastelTeal,
  darkgreen: LC.pastelSage,
};

/* ─── Waypoint content ────────────────────────────────────────────────────── */

export const WAYPOINTS: Waypoint[] = [
  {
    id: "orchard", name: "The Orchard", subtitle: "Nutrition", icon: "🌿", color: "green",
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
    id: "long-night", name: "The Long Night", subtitle: "Sleep", icon: "🌙", color: "orange",
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
    id: "storm-shelter", name: "The Storm Shelter", subtitle: "Stress Management", icon: "⛺", color: "teal",
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
    id: "still-river", name: "The Still River", subtitle: "Emotional Wellbeing", icon: "🌊", color: "darkgreen",
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
    id: "climb", name: "The Climb", subtitle: "Movement & Physical Function", icon: "⛰️", color: "green",
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
    id: "clearing", name: "The Clearing", subtitle: "Environmental Awareness", icon: "☀️", color: "orange",
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
    id: "campfire", name: "The Campfire", subtitle: "Relationships & Social Wellbeing", icon: "🔥", color: "teal",
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

/* ─── Band helper ─────────────────────────────────────────────────────────── */

export function getBand(total: number): { label: string; color: WaypointColor; lines: string[] } {
  if (total >= 30) return {
    label: "Foundations solid", color: "darkgreen",
    lines: ["Alright. That's a person who's actually been paying attention.", "Foundations are solid. This isn't the moment to add ten new things — it's the moment to not lose what you've got. Maintenance is boring. Maintenance is the whole game.", "One tune-up. Pick the lowest stone on the ring and give it a quiet nudge. Don't announce it. Just do it."],
  };
  if (total >= 22) return {
    label: "Decent walking", color: "green",
    lines: ["Decent walking. Not a disaster, not a poster.", "You've got a couple of waypoints doing the heavy lifting and one or two dragging the rest down like a wet coat. You know which ones. The ring told you.", "Grab the draggiest one. Just that one. Give it a real month. Not a week of theatrics — a month of ordinary. Then come back."],
  };
  if (total >= 15) return {
    label: "Plenty of room", color: "teal",
    lines: ["Plenty of room. That's not an insult, it's a map.", "The good news about being here is the return on any honest effort is enormous. You are not chasing decimals. You are chasing whole stones.", "Pick the nearest waypoint. The one that's most in your face right now. Start there. One habit. Small enough to be embarrassing. Do it anyway."],
  };
  return {
    label: "Starting line", color: "orange",
    lines: ["This is a starting line. Not a life sentence. Read that again.", "Somewhere along the way, a lot of small things slid. That happens. It's not a moral failure. It is, however, information you don't get to ignore anymore.", "Pick one waypoint. Maybe two, if you're feeling honest. The tiniest, most repeatable thing you can do inside it. Do it for a month before you touch anything else. That's the deal."],
  };
}
