import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────── DRILL DATA WITH INTENSITY ─────────────────────────── */
// Each drill has: name, sets, reps (or duration in sec), intensity (1-3), tip
const SCHEDULE: Day[] = [
  {
    id:"mon", label:"Monday", short:"MON", venue:"Garden", venueIcon:"🌳",
    theme:"Ball Control + Conditioning", color:"#F97316", accent:"#FED7AA",
    sections:[
      { id:"mon-wu", title:"Warm-up", duration:10, icon:"🔥", category:"WARMUP",
        drills:[
          { name:"Light jog", sets:1, reps:"5 min", intensity:1, tip:"Breathe through nose, relax shoulders" },
          { name:"Dynamic stretching", sets:2, reps:"10 reps each", intensity:1, tip:"Arm circles, leg swings, torso twists" },
          { name:"Ankle circles", sets:2, reps:"10 each direction", intensity:1, tip:"Full range of motion, slow and controlled" },
          { name:"Hip openers", sets:2, reps:"10 each side", intensity:1, tip:"Keep core tight, knee tracks over toe" },
        ]},
      { id:"mon-h", title:"Handles", duration:20, icon:"🏀", category:"SKILL",
        drills:[
          { name:"Pound dribbles", sets:3, reps:"30 sec", intensity:2, tip:"Stay low, fingertip control, eyes up" },
          { name:"Weak hand", sets:3, reps:"30 sec", intensity:2, tip:"Non-dominant hand only — don't rush" },
          { name:"Crossovers", sets:3, reps:"20 reps", intensity:2, tip:"Low and tight, protect the ball" },
          { name:"Between legs", sets:3, reps:"20 reps", intensity:2, tip:"Stable base, quick transfer" },
          { name:"In & Out", sets:3, reps:"20 reps", intensity:2, tip:"Sell the fake with your shoulder" },
          { name:"Retreat dribble", sets:3, reps:"10 reps", intensity:3, tip:"Explosive push back, maintain control" },
        ]},
      { id:"mon-ma", title:"Movement Attacks", duration:10, icon:"⚡", category:"SKILL",
        drills:[
          { name:"Hesitation → attack", sets:4, reps:"5 each side", intensity:3, tip:"Freeze the defender, explode on 4th step" },
          { name:"Crossover → attack", sets:4, reps:"5 each side", intensity:3, tip:"Low crossover, gather fast, finish strong" },
          { name:"In & Out → attack", sets:4, reps:"5 each side", intensity:3, tip:"Sell the in-out, attack the open lane" },
        ]},
      { id:"mon-co", title:"Conditioning", duration:15, icon:"💨", category:"CONDITIONING",
        drills:[
          { name:"Shuttle runs", sets:5, reps:"1 length", intensity:3, tip:"Touch the line, sprint back — no jogging" },
          { name:"Defensive slides", sets:4, reps:"30 sec", intensity:3, tip:"Wide stance, stay low, don't cross feet" },
          { name:"Sprint-backpedal", sets:6, reps:"1 length", intensity:3, tip:"Full sprint out, controlled backpedal back" },
        ]},
      { id:"mon-hw", title:"Home Workout", duration:null, icon:"🏠", category:"STRENGTH",
        drills:[
          { name:"Push-ups", sets:3, reps:"15 reps", intensity:2, tip:"Full range, elbows at 45°, controlled descent" },
          { name:"Squats", sets:3, reps:"20 reps", intensity:2, tip:"Feet shoulder-width, knees track toes" },
          { name:"Plank", sets:3, reps:"45 sec", intensity:2, tip:"Neutral spine, squeeze glutes + core" },
        ]},
    ]},
  {
    id:"tue", label:"Tuesday", short:"TUE", venue:"Garden", venueIcon:"🌳",
    theme:"Finishing Mechanics", color:"#8B5CF6", accent:"#EDE9FE",
    sections:[
      { id:"tue-tt", title:"Triple Threat", duration:10, icon:"🎯", category:"SKILL",
        drills:[
          { name:"Jab step", sets:3, reps:"10 each side", intensity:2, tip:"Sharp jab, read defender's feet" },
          { name:"Shot fake", sets:3, reps:"10 reps", intensity:2, tip:"Ball goes UP, make it believable" },
          { name:"Rip through", sets:3, reps:"10 each side", intensity:2, tip:"Protect ball low, swing through defender" },
          { name:"Front pivot", sets:3, reps:"10 each side", intensity:1, tip:"Pivot foot planted, stay balanced" },
          { name:"Reverse pivot", sets:3, reps:"10 each side", intensity:1, tip:"Drop step, protect ball on hip" },
        ]},
      { id:"tue-gp", title:"Gather Package", duration:20, icon:"👣", category:"SKILL",
        note:"70% 1-2 Gather · 30% Hop Gather. Master basics before advanced.",
        drills:[
          { name:"1-2 Gather (right)", sets:4, reps:"8 reps", intensity:2, tip:"Right foot lands first, 1-2 rhythm, extend through rim" },
          { name:"1-2 Gather (left)", sets:4, reps:"8 reps", intensity:2, tip:"Left foot lands first, mirror the motion" },
          { name:"Hop Gather (right)", sets:3, reps:"6 reps", intensity:3, tip:"Both feet land together, stay balanced at gather" },
          { name:"Hop Gather (left)", sets:3, reps:"6 reps", intensity:3, tip:"Keep hips low through gather, don't stand up" },
          { name:"Consistency reps", sets:2, reps:"10 reps mix", intensity:2, tip:"Mix both — let your body choose naturally" },
        ]},
      { id:"tue-ff", title:"Finishing Footwork", duration:15, icon:"🦶", category:"SKILL",
        drills:[
          { name:"Euro step (right)", sets:3, reps:"6 reps", intensity:3, tip:"Big step left, transfer right, protect ball low" },
          { name:"Euro step (left)", sets:3, reps:"6 reps", intensity:3, tip:"Big step right, transfer left, finish with control" },
          { name:"Reverse layup", sets:3, reps:"8 reps", intensity:2, tip:"Use the backboard, shield with body" },
          { name:"Floater footwork", sets:3, reps:"8 reps", intensity:3, tip:"Short gather, release early, soft touch" },
        ]},
      { id:"tue-df", title:"Decision Finishes", duration:10, icon:"🧠", category:"IQ",
        note:"Visualize a real defender. Make actual decisions — don't just go through motions.",
        drills:[
          { name:"Imagine help — Finish", sets:3, reps:"5 reps", intensity:2, tip:"Defender comes late — attack the rim hard" },
          { name:"Imagine help — Reverse", sets:3, reps:"5 reps", intensity:2, tip:"Defender cuts off lane — reverse under" },
          { name:"Imagine help — Floater", sets:3, reps:"5 reps", intensity:3, tip:"Big is in paint — release before contact zone" },
          { name:"Random read drill", sets:2, reps:"10 reps", intensity:3, tip:"Pick randomly each rep, react, don't pre-plan" },
        ]},
    ]},
  {
    id:"wed", label:"Wednesday", short:"WED", venue:"Court", venueIcon:"🏟️",
    theme:"Shooting Day", color:"#10B981", accent:"#D1FAE5",
    hasGame:true,
    sections:[
      { id:"wed-fs", title:"Form Shooting", duration:null, icon:"🎯", category:"SHOOTING", target:50,
        drills:[
          { name:"1-foot makes", sets:2, reps:"10 makes", intensity:1, tip:"Elbow in, wrist snap, follow through held" },
          { name:"3-foot makes", sets:2, reps:"10 makes", intensity:1, tip:"Same form, slightly more leg" },
          { name:"5-foot makes", sets:2, reps:"15 makes", intensity:2, tip:"Feet shoulder-width, balanced landing" },
          { name:"7-foot makes", sets:1, reps:"15 makes", intensity:2, tip:"Add arc, don't muscle it" },
        ]},
      { id:"wed-ss", title:"Spot Shooting", duration:null, icon:"📍", category:"SHOOTING", target:50,
        drills:[
          { name:"Right corner", sets:1, reps:"10 makes", intensity:2, tip:"Catch ready, no extra dribble" },
          { name:"Right wing", sets:1, reps:"10 makes", intensity:2, tip:"Square up on catch" },
          { name:"Top of key", sets:1, reps:"10 makes", intensity:2, tip:"Balanced, straight line to rim" },
          { name:"Left wing", sets:1, reps:"10 makes", intensity:2, tip:"Step into it, same release point" },
          { name:"Left corner", sets:1, reps:"10 makes", intensity:2, tip:"Don't fade left — stay straight" },
        ]},
      { id:"wed-fin", title:"Finishing", duration:null, icon:"🏀", category:"SKILL",
        drills:[
          { name:"Right hand layup", sets:3, reps:"10 makes", intensity:2, tip:"2-step gather, high off glass" },
          { name:"Left hand layup", sets:3, reps:"10 makes", intensity:2, tip:"Non-dominant — slow it down first" },
          { name:"Reverse layup", sets:3, reps:"8 makes", intensity:2, tip:"Use the board, keep body between defender and ball" },
          { name:"Floater", sets:3, reps:"8 makes", intensity:3, tip:"Release before paint, soft fingertip touch" },
        ]},
      { id:"wed-ft", title:"Free Throws", duration:null, icon:"🎳", category:"SHOOTING", target:50,
        drills:[
          { name:"Routine FTs", sets:5, reps:"10 attempts", intensity:1, tip:"Same routine every shot — bounces, breath, shoot" },
        ]},
    ]},
  {
    id:"thu", label:"Thursday", short:"THU", venue:"Home", venueIcon:"🧘",
    theme:"Recovery + IQ", color:"#06B6D4", accent:"#CFFAFE",
    isRecovery:true,
    sections:[
      { id:"thu-lh", title:"Light Handles", duration:15, icon:"🔄", category:"SKILL",
        drills:[
          { name:"Easy crossovers", sets:2, reps:"2 min", intensity:1, tip:"No effort — just feel the ball, stay loose" },
          { name:"Figure 8s", sets:2, reps:"2 min", intensity:1, tip:"Slow and controlled, focus on grip" },
          { name:"Low dribbles", sets:2, reps:"1 min", intensity:1, tip:"Just staying warm — zero intensity today" },
        ]},
      { id:"thu-mob", title:"Mobility", duration:20, icon:"🧘", category:"RECOVERY",
        drills:[
          { name:"Hip flexor stretch", sets:2, reps:"60 sec each", intensity:1, tip:"Posterior pelvic tilt, don't arch low back" },
          { name:"Hamstring stretch", sets:2, reps:"60 sec each", intensity:1, tip:"Hinge at hips, not low back" },
          { name:"Ankle mobility", sets:2, reps:"15 circles each", intensity:1, tip:"Full range of motion, trace a big circle" },
          { name:"Thoracic rotation", sets:2, reps:"10 each side", intensity:1, tip:"Rotate upper back only, hips stay square" },
        ]},
      { id:"thu-film", title:"Film Study", duration:30, icon:"📺", category:"IQ",
        note:"Focus: pace, pickup timing, body control.",
        drills:[
          { name:"Watch Jalen Brunson", sets:1, reps:"15 min", intensity:1, tip:"Study his pace changes and pickup foot" },
          { name:"Watch SGA", sets:1, reps:"15 min", intensity:1, tip:"Study body lean, off-hand protection, floater release" },
        ]},
    ]},
  {
    id:"fri", label:"Friday", short:"FRI", venue:"Garden", venueIcon:"🌳",
    theme:"Attack Day", color:"#EAB308", accent:"#FEF9C3",
    sections:[
      { id:"fri-hr", title:"Handles Review", duration:10, icon:"🏀", category:"SKILL",
        drills:[
          { name:"All Monday handles", sets:2, reps:"20 sec each", intensity:2, tip:"Review — faster and cleaner than Monday" },
        ]},
      { id:"fri-ac", title:"Attack Combos", duration:15, icon:"⚡", category:"SKILL",
        drills:[
          { name:"Hesitation combo", sets:4, reps:"5 each side", intensity:3, tip:"Hesi + crossover + attack — one smooth motion" },
          { name:"Crossover combo", sets:4, reps:"5 each side", intensity:3, tip:"Cross + between legs + finish" },
          { name:"In & Out combo", sets:4, reps:"5 each side", intensity:3, tip:"In-out + spin + floater" },
        ]},
      { id:"fri-vd", title:"Virtual Defender", duration:15, icon:"👻", category:"IQ",
        note:"Imagine real defenders. Make real reads. No mindless reps.",
        drills:[
          { name:"Read: Pull-up mid", sets:3, reps:"8 reps", intensity:3, tip:"Defender goes under — stop and pop" },
          { name:"Read: Reattack", sets:3, reps:"8 reps", intensity:3, tip:"Defender overplays — counter-dribble reattack" },
          { name:"Read: Pivot + shot", sets:3, reps:"8 reps", intensity:2, tip:"Defender lunges — pivot away, create space" },
        ]},
      { id:"fri-co", title:"Conditioning", duration:15, icon:"💨", category:"CONDITIONING",
        drills:[
          { name:"Shuttle runs", sets:5, reps:"1 length", intensity:3, tip:"Push pace each set, rest 30s between" },
          { name:"Defensive slides", sets:4, reps:"30 sec", intensity:3, tip:"Stay low the entire time" },
          { name:"Sprint-backpedal", sets:6, reps:"1 length", intensity:3, tip:"Game speed — every rep" },
        ]},
      { id:"fri-hw", title:"Home Workout", duration:null, icon:"🏠", category:"STRENGTH",
        note:"Y-T-W: Upper back = better posture + ball protection. Don't skip.",
        drills:[
          { name:"Push-ups", sets:3, reps:"15 reps", intensity:2, tip:"Full range, chest to floor" },
          { name:"Squats", sets:3, reps:"20 reps", intensity:2, tip:"Deep squat, pause at bottom" },
          { name:"Plank", sets:3, reps:"45 sec", intensity:2, tip:"Squeeze everything, breathe through it" },
          { name:"Y-T-W Raises", sets:3, reps:"10 reps each", intensity:2, tip:"Light weight or bodyweight — squeeze at top of each position" },
        ]},
    ]},
  {
    id:"sat", label:"Saturday", short:"SAT", venue:"Court", venueIcon:"🏟️",
    theme:"Team Selection Simulation", color:"#EF4444", accent:"#FEE2E2",
    hasGame:true, isBigDay:true,
    sections:[
      { id:"sat-sh", title:"Shooting Warm-up", duration:15, icon:"🎯", category:"SHOOTING",
        drills:[
          { name:"Form shots", sets:2, reps:"10 makes", intensity:1, tip:"Lock in form before adding pace" },
          { name:"Mid-range spots", sets:3, reps:"8 makes each", intensity:2, tip:"3 spots — right elbow, top, left elbow" },
          { name:"Pull-up mid", sets:3, reps:"6 makes each", intensity:3, tip:"1 dribble pull-up — game speed" },
        ]},
      { id:"sat-fin", title:"Finishing Warm-up", duration:15, icon:"🏀", category:"SKILL",
        drills:[
          { name:"1-2 gather finishes", sets:3, reps:"8 makes", intensity:2, tip:"Both sides — clean and automatic" },
          { name:"Hop gather", sets:3, reps:"6 makes", intensity:3, tip:"Balanced, don't rush the release" },
          { name:"Euro step", sets:3, reps:"6 makes", intensity:3, tip:"Full speed — simulate coming off a screen" },
          { name:"Floater (both sides)", sets:3, reps:"8 makes", intensity:3, tip:"High release, arc over imaginary big" },
        ]},
    ]},
];

const PHASES: Record<PhaseKey, Phase> = {
  1:{ label:"Phase 1", period:"June", target:11, dribbles:4, color:"#F97316", bg:"#431407" },
  2:{ label:"Phase 2", period:"July+", target:21, dribbles:3, color:"#EF4444", bg:"#450A0A" },
};

const IQ_GOALS = [
  { text:"Handle full-court pressure without panic", icon:"💪" },
  { text:"Finish through contact with either hand", icon:"🏀" },
  { text:"Execute 1-2 gather automatically", icon:"👣" },
  { text:"Stay conditioned for 40-minute intensity", icon:"💨" },
  { text:"Make simple decisions fast under pressure", icon:"⚡" },
  { text:"Defend hard every possession", icon:"🛡️" },
  { text:"Zero bad turnovers per game", icon:"🔒" },
  { text:"Floater from both sides of the rim", icon:"🎯" },
];

const CATEGORY_COLORS = {
  WARMUP:"#F97316", SKILL:"#8B5CF6", SHOOTING:"#10B981",
  CONDITIONING:"#EF4444", STRENGTH:"#F59E0B", RECOVERY:"#06B6D4", IQ:"#3B82F6"
};

type Category = keyof typeof CATEGORY_COLORS;
type Drill = {
  name: string;
  sets: number;
  reps: string;
  intensity: 1 | 2 | 3;
  tip: string;
  _sectionId?: string;
};
type Section = {
  id: string;
  title: string;
  duration: number | null;
  icon: string;
  category: Category;
  drills: Drill[];
  note?: string;
  target?: number;
};
type Day = {
  id: string;
  label: string;
  short: string;
  venue: string;
  venueIcon: string;
  theme: string;
  color: string;
  accent: string;
  sections: Section[];
  hasGame?: boolean;
  isRecovery?: boolean;
  isBigDay?: boolean;
};
type PhaseKey = 1 | 2;
type Phase = { label: string; period: string; target: number; dribbles: number; color: string; bg: string; };

type CompletedDrills = Record<string, boolean>;
type CompletedGoals = Record<string, boolean>;

type ActiveDrill = Drill & { _sectionId?: string };

type PlayEvent = "make" | "miss" | "bad" | "forced";

type LogEntry = { type: PlayEvent; label: string; score: number; id: number };

type ActiveDrillScreenProps = {
  drill: ActiveDrill;
  sectionColor: string;
  onClose: () => void;
  onComplete: () => void;
};

type DrillCardProps = {
  drill: Drill;
  sectionId: string;
  completed: CompletedDrills;
  onToggle: (key: string) => void;
  color: string;
  onStart: (drill: Drill) => void;
  index: number;
};

type SectionCardProps = {
  section: Section;
  completedDrills: CompletedDrills;
  onToggle: (key: string) => void;
  color: string;
  onStartDrill: (drill: ActiveDrill) => void;
};

type TodayTabProps = {
  completedDrills: CompletedDrills;
  onToggle: (key: string) => void;
  selectedDay: number;
  onGoToGame: () => void;
};

type GameTrackerProps = {
  phase: PhaseKey;
  onPhaseChange: (phase: PhaseKey) => void;
};

type WeekOverviewProps = {
  completedDrills: CompletedDrills;
  onSelectDay: (idx: number) => void;
};

type IQTabProps = {
  completedGoals: CompletedGoals;
  onToggleGoal: (index: number) => void;
};

/* ─────────────────────────── HELPERS ─────────────────────────── */
function getCurrentDayIdx() {
  const d = new Date().getDay();
  return { 1:0, 2:1, 3:2, 4:3, 5:4, 6:5 }[d] ?? 0;
}
function getCurrentPhase() { return new Date().getMonth() <= 5 ? 1 : 2; }
function pad(n: number) { return String(n).padStart(2,"0"); }

const INTENSITY_LABELS = ["", "Easy", "Moderate", "Hard"];
const INTENSITY_COLORS = ["", "#10B981", "#F97316", "#EF4444"];
const INTENSITY_DOTS = ["", 1, 2, 3];

function IntensityBadge({ level }: { level: number }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:"50%",
          background: i <= level ? INTENSITY_COLORS[level] : "#374151",
          transition:"all 0.2s",
        }} />
      ))}
      <span style={{ fontSize:9, color:INTENSITY_COLORS[level], fontWeight:700, marginLeft:2, letterSpacing:"0.05em" }}>
        {INTENSITY_LABELS[level].toUpperCase()}
      </span>
    </div>
  );
}

/* ─────────────────────────── TIMER HOOK ─────────────────────────── */
function useTimer(totalSec: number) {
  const [sec, setSec] = useState(totalSec);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running && sec > 0) {
      ref.current = setInterval(() => setSec(s => s - 1), 1000);
    } else {
      if (ref.current !== null) { clearInterval(ref.current); }
      if (sec === 0) setRunning(false);
    }
    return () => { if (ref.current !== null) { clearInterval(ref.current); } };
  }, [running, sec]);
  return { sec, running, start: () => setRunning(true), pause: () => setRunning(false), reset: () => { setRunning(false); setSec(totalSec); } };
}

/* ─────────────────────────── ACTIVE DRILL SCREEN ─────────────────────────── */
function ActiveDrillScreen({ drill, sectionColor, onClose, onComplete }: ActiveDrillScreenProps) {
  const [currentSet, setCurrentSet] = useState(1);
  const [setsDone, setSetsDone] = useState(0);
  const totalSets = drill.sets;
  const isDurationBased = typeof drill.reps === "string" && drill.reps.includes("sec") || drill.reps.includes("min");
  const durationSec = isDurationBased
    ? (drill.reps.includes("min") ? parseInt(drill.reps) * 60 : parseInt(drill.reps))
    : 0;
  const { sec, running, start, pause, reset } = useTimer(durationSec || 45);
  const pct = durationSec > 0 ? Math.round(((durationSec - sec) / durationSec) * 100) : 0;
  const circumference = 2 * Math.PI * 52;

  const finishSet = () => {
    const newDone = setsDone + 1;
    setSetsDone(newDone);
    reset();
    if (newDone >= totalSets) { onComplete(); }
    else { setCurrentSet(s => s + 1); }
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:500,
      background:"#0A0A0A",
      display:"flex", flexDirection:"column",
      fontFamily:"'Bebas Neue', 'Impact', sans-serif",
    }}>
      {/* Top bar */}
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#6B7280", fontSize:14, display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:18 }}>←</span>
          <span style={{ fontFamily:"system-ui", fontSize:13 }}>BACK</span>
        </button>
        <div style={{ display:"flex", gap:6 }}>
          {Array.from({length:totalSets}).map((_,i) => (
            <div key={i} style={{ width:28, height:4, borderRadius:99, background: i < setsDone ? sectionColor : i === setsDone ? sectionColor+"80" : "#1F2937", transition:"all 0.3s" }} />
          ))}
        </div>
        <div style={{ fontFamily:"system-ui", fontSize:12, color:"#6B7280" }}>SET {currentSet}/{totalSets}</div>
      </div>

      {/* Drill name */}
      <div style={{ padding:"0 24px", marginTop:8 }}>
        <div style={{ fontSize:9, letterSpacing:"0.2em", color:sectionColor, fontFamily:"system-ui", fontWeight:700, marginBottom:6 }}>
          NOW WORKING
        </div>
        <div style={{ fontSize:34, color:"white", lineHeight:1, letterSpacing:"0.02em" }}>
          {drill.name.toUpperCase()}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:8 }}>
          <span style={{ fontSize:13, color:"#9CA3AF", fontFamily:"system-ui" }}>{drill.reps}</span>
          <span style={{ color:"#374151" }}>·</span>
          <IntensityBadge level={drill.intensity} />
        </div>
      </div>

      {/* Timer ring */}
      {durationSec > 0 ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
          <div style={{ position:"relative", width:140, height:140 }} onClick={running ? pause : start}>
            <svg width="140" height="140" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="70" cy="70" r="52" fill="none" stroke="#1F2937" strokeWidth="8" />
              <circle cx="70" cy="70" r="52" fill="none" stroke={sectionColor} strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct/100)}
                strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.5s ease" }} />
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:38, color:"white", lineHeight:1, fontFamily:"system-ui", fontWeight:200 }}>
                {pad(Math.floor(sec/60))}:{pad(sec%60)}
              </div>
              <div style={{ fontSize:11, color:"#6B7280", fontFamily:"system-ui", marginTop:4 }}>
                {running ? "TAP TO PAUSE" : sec === 0 ? "DONE" : "TAP TO START"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:72, lineHeight:1, color:sectionColor, fontFamily:"system-ui", fontWeight:200 }}>
            {drill.reps.split(" ")[0]}
          </div>
          <div style={{ fontSize:14, color:"#6B7280", fontFamily:"system-ui", letterSpacing:"0.1em", marginTop:4 }}>
            {drill.reps.split(" ").slice(1).join(" ").toUpperCase()}
          </div>
        </div>
      )}

      {/* Tip */}
      <div style={{ margin:"0 20px 20px", padding:"14px 16px", background:"#111827", borderRadius:16, borderLeft:`3px solid ${sectionColor}` }}>
        <div style={{ fontSize:9, letterSpacing:"0.15em", color:sectionColor, fontFamily:"system-ui", fontWeight:700, marginBottom:5 }}>COACHING TIP</div>
        <div style={{ fontSize:13, color:"#D1D5DB", fontFamily:"system-ui", lineHeight:1.55 }}>{drill.tip}</div>
      </div>

      {/* Done button */}
      <div style={{ padding:"0 20px 36px" }}>
        <button onClick={finishSet} style={{
          width:"100%", padding:"18px", borderRadius:18,
          background:`linear-gradient(135deg, ${sectionColor}, ${sectionColor}CC)`,
          border:"none", color:"white", fontSize:18, fontWeight:700,
          cursor:"pointer", letterSpacing:"0.1em",
          boxShadow:`0 8px 30px ${sectionColor}40`,
          transition:"all 0.2s",
        }}>
          {setsDone + 1 >= totalSets ? "✓ DRILL COMPLETE" : `SET ${currentSet} DONE →`}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── DRILL CARD ─────────────────────────── */
function DrillCard({ drill, sectionId, completed, onToggle, color, onStart, index }: DrillCardProps) {
  const key = `${sectionId}::${drill.name}`;
  const checked = !!completed[key];

  return (
    <div style={{
      background: checked ? "#0D1117" : "#111827",
      borderRadius:14, marginBottom:8,
      border:`1px solid ${checked ? color+"40" : "#1F2937"}`,
      overflow:"hidden", transition:"all 0.25s",
      animation:`fadeUp 0.3s ease both`,
      animationDelay:`${index * 0.04}s`,
    }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
        {/* Check */}
        <div onClick={() => onToggle(key)} style={{
          width:26, height:26, borderRadius:8, flexShrink:0,
          border:`2px solid ${checked ? color : "#374151"}`,
          background: checked ? color : "transparent",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          {checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>

        {/* Info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color: checked ? "#6B7280" : "#F3F4F6", textDecoration: checked ? "line-through" : "none", marginBottom:3 }}>
            {drill.name}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:"#9CA3AF", fontFamily:"monospace" }}>
              {drill.sets > 1 ? `${drill.sets} sets × ` : ""}{drill.reps}
            </span>
            <IntensityBadge level={drill.intensity} />
          </div>
        </div>

        {/* Start btn */}
        {!checked && (
          <button onClick={() => onStart(drill)} style={{
            width:34, height:34, borderRadius:10, border:"none",
            background:`${color}20`, color:color,
            cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0, transition:"all 0.2s",
          }}>▶</button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── SECTION CARD ─────────────────────────── */
function SectionCard({ section, completedDrills, onToggle, color, onStartDrill }: SectionCardProps) {
  const [open, setOpen] = useState(true);
  const totalSec = (section.duration || 0) * 60;
  const { sec, running, start, pause, reset } = useTimer(totalSec);
  const done = section.drills.filter(d => completedDrills[`${section.id}::${d.name}`]).length;
  const total = section.drills.length;
  const allDone = done === total;
  const catColor = CATEGORY_COLORS[section.category] || color;

  return (
    <div style={{ marginBottom:14, borderRadius:18, overflow:"hidden", border:`1px solid ${allDone ? color+"40" : "#1F2937"}`, background:"#0D1117" }}>
      {/* Header */}
      <div onClick={() => setOpen(o => !o)} style={{
        padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer",
        background: allDone ? `${color}12` : "transparent",
      }}>
        <div style={{
          width:42, height:42, borderRadius:13, flexShrink:0,
          background:`${catColor}15`, border:`1px solid ${catColor}30`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
        }}>{section.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
            <span style={{ fontSize:15, fontWeight:700, color: allDone ? "#6B7280" : "#F3F4F6", textDecoration: allDone ? "line-through" : "none" }}>{section.title}</span>
            <span style={{ fontSize:9, fontWeight:700, color:catColor, background:`${catColor}15`, padding:"2px 6px", borderRadius:6, letterSpacing:"0.08em" }}>{section.category}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:"#6B7280", fontFamily:"monospace" }}>{done}/{total} drills</span>
            {section.duration && <span style={{ fontSize:11, color:"#6B7280", fontFamily:"monospace" }}>· {section.duration} min</span>}
            {section.target && <span style={{ fontSize:11, color:catColor, fontFamily:"monospace" }}>· 🎯 {section.target} makes</span>}
          </div>
        </div>
        {/* Timer */}
        {section.duration !== null && section.duration > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }} onClick={e => e.stopPropagation()}>
            <span style={{ fontSize:14, fontFamily:"monospace", fontWeight:"bold", color: sec===0 ? "#10B981" : running ? color : "#9CA3AF", minWidth:40, textAlign:"right" }}>
              {pad(Math.floor(sec/60))}:{pad(sec%60)}
            </span>
            <button onClick={sec===0 ? reset : running ? pause : start} style={{
              width:28, height:28, borderRadius:"50%", border:"none",
              background: sec===0 ? "#10B981" : running ? "#1F2937" : color,
              color: running ? "#9CA3AF" : "white", cursor:"pointer", fontSize:11,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {sec===0 ? "↺" : running ? "⏸" : "▶"}
            </button>
          </div>
        )}
        <span style={{ fontSize:14, color:"#374151", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s", marginLeft:4 }}>▾</span>
      </div>

      {/* Progress bar */}
      <div style={{ height:2, background:"#1F2937" }}>
        <div style={{ height:"100%", width:`${total > 0 ? (done/total)*100 : 0}%`, background: allDone ? "#10B981" : color, transition:"width 0.4s ease" }} />
      </div>

      {/* Drills */}
      {open && (
        <div style={{ padding:"10px 12px 12px" }}>
          {section.note && (
            <div style={{ padding:"9px 12px", background:`${catColor}10`, borderRadius:10, borderLeft:`3px solid ${catColor}`, marginBottom:10 }}>
              <p style={{ margin:0, fontSize:12, color:"#9CA3AF", lineHeight:1.55, fontStyle:"italic" }}>{section.note}</p>
            </div>
          )}
          {section.drills.map((drill, i) => (
            <DrillCard
              key={drill.name}
              drill={drill}
              sectionId={section.id}
              completed={completedDrills}
              onToggle={onToggle}
              color={catColor}
              onStart={onStartDrill}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── TODAY TAB ─────────────────────────── */
function TodayTab({ completedDrills, onToggle, selectedDay, onGoToGame }: TodayTabProps) {
  const [activeDrill, setActiveDrill] = useState<ActiveDrill | null>(null);
  const [activeDrillColor, setActiveDrillColor] = useState("#F97316");
  const day = SCHEDULE[selectedDay];
  const allKeys = day.sections.flatMap(s => s.drills.map(d => `${s.id}::${d.name}`));
  const done = allKeys.filter(k => completedDrills[k]).length;
  const pct = allKeys.length > 0 ? Math.round((done/allKeys.length)*100) : 0;
  const totalDrills = allKeys.length;
  const totalSets = day.sections.flatMap(s => s.drills).reduce((a,d) => a + d.sets, 0);

  const handleStartDrill = (drill: ActiveDrill, color: string) => {
    setActiveDrillColor(color || day.color);
    setActiveDrill(drill);
  };

  if (activeDrill) {
    return (
      <ActiveDrillScreen
        drill={activeDrill}
        sectionColor={activeDrillColor}
        onClose={() => setActiveDrill(null)}
        onComplete={() => {
          onToggle(`${activeDrill._sectionId}::${activeDrill.name}`);
          setActiveDrill(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding:"0 14px 100px" }}>
      {/* Hero card */}
      <div style={{
        background:`linear-gradient(135deg, ${day.color}22, ${day.color}08)`,
        borderRadius:22, padding:"20px", marginBottom:16,
        border:`1px solid ${day.color}30`,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.18em", color:day.color, fontWeight:700, marginBottom:5 }}>
              {day.venueIcon} {day.venue.toUpperCase()} · {day.short}
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:"#F3F4F6", lineHeight:1.1, marginBottom:4 }}>
              {day.theme}
            </div>
            {day.isRecovery && (
              <span style={{ fontSize:10, color:"#06B6D4", background:"#06B6D420", padding:"3px 8px", borderRadius:6, fontWeight:700 }}>RECOVERY DAY</span>
            )}
            {day.isBigDay && (
              <span style={{ fontSize:10, color:"#EF4444", background:"#EF444420", padding:"3px 8px", borderRadius:6, fontWeight:700 }}>BIG DAY 🏆</span>
            )}
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:40, fontWeight:200, color: pct===100 ? "#10B981" : day.color, fontFamily:"monospace", lineHeight:1 }}>{pct}<span style={{ fontSize:18 }}>%</span></div>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {[
            { v: totalDrills, l:"DRILLS" },
            { v: totalSets, l:"TOTAL SETS" },
            { v: done, l:"COMPLETED" },
          ].map(s => (
            <div key={s.l} style={{ flex:1, background:"#0A0A0A60", borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:700, color:"#F3F4F6", fontFamily:"monospace" }}>{s.v}</div>
              <div style={{ fontSize:8, color:"#6B7280", letterSpacing:"0.1em", marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ height:5, background:"#1F2937", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, ${day.color}, ${day.color}AA)`, borderRadius:99, transition:"width 0.5s ease" }} />
        </div>
      </div>

      {/* Game CTA */}
      {day.hasGame && (
        <button onClick={onGoToGame} style={{
          width:"100%", padding:"14px 18px", borderRadius:16, marginBottom:14,
          border:`1px solid ${day.color}40`, background:`${day.color}10`,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${day.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              {day.isBigDay ? "🏆" : "🎮"}
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:13, fontWeight:700, color:day.color }}>{day.isBigDay ? "Play-to-21 Simulation" : "Play-to-11 Game"}</div>
              <div style={{ fontSize:11, color:"#6B7280" }}>{day.isBigDay ? "Max 3 dribbles · Phase 2" : "Max 4 dribbles · Phase 1"}</div>
            </div>
          </div>
          <span style={{ fontSize:18, color:day.color }}>→</span>
        </button>
      )}

      {day.sections.map(section => (
        <SectionCard
          key={section.id}
          section={section}
          completedDrills={completedDrills}
          onToggle={onToggle}
          color={day.color}
          onStartDrill={(drill) => handleStartDrill({ ...drill, _sectionId: section.id }, CATEGORY_COLORS[section.category] || day.color)}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── GAME TRACKER ─────────────────────────── */
function GameTracker({ phase, onPhaseChange }: GameTrackerProps) {
  const ph = PHASES[phase];
  const [score, setScore] = useState(0);
  const [possessions, setPossessions] = useState(0);
  const [stats, setStats] = useState({ makes:0, misses:0, badPickups:0, forced:0 });
  const [log, setLog] = useState<LogEntry[]>([]);

  const event = (type: PlayEvent) => {
    const delta = type === "make" ? 1 : -1;
    const ns = score + delta;
    setScore(ns);
    setPossessions(p => p+1);
    setStats(s => ({
      makes: type==="make" ? s.makes+1 : s.makes,
      misses: type==="miss" ? s.misses+1 : s.misses,
      badPickups: type==="bad" ? s.badPickups+1 : s.badPickups,
      forced: type==="forced" ? s.forced+1 : s.forced,
    }));
    const labels: Record<PlayEvent, string> = { make:"✅ Make", miss:"❌ Miss", bad:"⚠️ Bad Pickup", forced:"🚫 Forced" };
    setLog(l => [{ type, label: labels[type], score:ns, id:Date.now() }, ...l.slice(0,9)]);
  };

  const reset = () => { setScore(0); setPossessions(0); setStats({ makes:0, misses:0, badPickups:0, forced:0 }); setLog([]); };
  const won = score >= ph.target;
  const composure = possessions > 0 ? Math.round((stats.makes/possessions)*100) : 0;

  return (
    <div style={{ padding:"0 14px 100px" }}>
      {/* Phase */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {([1,2] as PhaseKey[]).map(p => {
          const pp = PHASES[p];
          return (
            <button key={p} onClick={() => { onPhaseChange(p); reset(); }} style={{
              flex:1, padding:"12px", borderRadius:14,
              border:`2px solid ${phase===p ? pp.color : "#1F2937"}`,
              background: phase===p ? pp.bg : "#0D1117",
              cursor:"pointer",
            }}>
              <div style={{ fontSize:14, fontWeight:800, color: phase===p ? pp.color : "#6B7280" }}>{pp.label}</div>
              <div style={{ fontSize:10, color:"#4B5563", fontFamily:"monospace", marginTop:2 }}>Play to {pp.target} · {pp.dribbles} dribbles · {pp.period}</div>
            </button>
          );
        })}
      </div>

      {/* Score */}
      <div style={{
        background: won ? "linear-gradient(135deg,#052E16,#064E3B)" : "#0D1117",
        border:`1.5px solid ${won ? "#10B981" : "#1F2937"}`,
        borderRadius:22, padding:"28px 20px 20px", marginBottom:14, textAlign:"center",
        boxShadow: won ? "0 0 40px rgba(16,185,129,0.2)" : "none",
        transition:"all 0.4s",
      }}>
        {won && <div style={{ fontSize:36, marginBottom:6 }}>🏆</div>}
        <div style={{ fontSize:88, fontWeight:200, lineHeight:1, fontFamily:"monospace", color: won ? "#10B981" : score < 0 ? "#EF4444" : "#F3F4F6" }}>
          {score > 0 ? "+" : ""}{score}
        </div>
        <div style={{ fontSize:11, color:"#4B5563", fontFamily:"monospace", letterSpacing:"0.1em", marginTop:4 }}>
          {won ? "🎉 GOAL REACHED!" : `GOAL: +${ph.target}`}
        </div>
        {/* Bar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:16 }}>
          <span style={{ fontSize:10, color:"#374151", fontFamily:"monospace" }}>-{ph.target}</span>
          <div style={{ flex:1, height:6, background:"#1F2937", borderRadius:99, overflow:"hidden" }}>
            <div style={{
              height:"100%",
              width:`${Math.max(0, Math.min(100, ((score+ph.target)/(ph.target*2))*100))}%`,
              background: won ? "#10B981" : score < 0 ? "#EF4444" : ph.color,
              borderRadius:99, transition:"all 0.4s",
            }} />
          </div>
          <span style={{ fontSize:10, color:"#374151", fontFamily:"monospace" }}>+{ph.target}</span>
        </div>
      </div>

      {/* Rules */}
      <div style={{ background:"#111827", borderRadius:14, padding:"12px 16px", marginBottom:14, display:"flex", gap:10, border:"1px solid #1F2937" }}>
        <span style={{ fontSize:18 }}>📋</span>
        <div>
          <div style={{ fontSize:11, color:"white", fontWeight:700, marginBottom:3 }}>{ph.label} — Play to {ph.target}</div>
          <div style={{ fontSize:11, color:"#6B7280", lineHeight:1.65 }}>
            Top of key · Max {ph.dribbles} dribbles<br/>Mid-range or layup only · +1 make · −1 all errors
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <button onClick={() => event("make")} style={{
          padding:"20px", borderRadius:18, border:"1.5px solid #065F46", background:"#052E16",
          cursor:"pointer", transition:"all 0.15s",
        }}>
          <div style={{ fontSize:24 }}>✅</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#10B981", marginTop:4 }}>MAKE</div>
          <div style={{ fontSize:11, color:"#065F46" }}>+1 point</div>
        </button>
        <button onClick={() => event("miss")} style={{
          padding:"20px", borderRadius:18, border:"1.5px solid #7F1D1D", background:"#450A0A",
          cursor:"pointer", transition:"all 0.15s",
        }}>
          <div style={{ fontSize:24 }}>❌</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#EF4444", marginTop:4 }}>MISS</div>
          <div style={{ fontSize:11, color:"#7F1D1D" }}>−1 point</div>
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
        <button onClick={() => event("bad")} style={{
          padding:"14px", borderRadius:14, border:"1.5px solid #78350F", background:"#1C0A00",
          cursor:"pointer",
        }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#F97316" }}>⚠️ Bad Pickup</div>
          <div style={{ fontSize:10, color:"#78350F" }}>−1 point</div>
        </button>
        <button onClick={() => event("forced")} style={{
          padding:"14px", borderRadius:14, border:"1.5px solid #4C1D95", background:"#13001F",
          cursor:"pointer",
        }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#8B5CF6" }}>🚫 Forced Shot</div>
          <div style={{ fontSize:10, color:"#4C1D95" }}>−1 point</div>
        </button>
      </div>

      {/* Stats */}
      <div style={{ background:"#0D1117", borderRadius:16, border:"1px solid #1F2937", padding:"14px 16px", marginBottom:14 }}>
        <div style={{ fontSize:9, letterSpacing:"0.12em", color:"#4B5563", marginBottom:12 }}>SESSION STATS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
          {[
            { label:"POSS", value:possessions, color:"#F3F4F6" },
            { label:"MAKES", value:stats.makes, color:"#10B981" },
            { label:"MISSES", value:stats.misses, color:"#EF4444" },
            { label:"COMP%", value:`${composure}%`, color:ph.color },
          ].map(s => (
            <div key={s.label} style={{ textAlign:"center", padding:"8px 4px", background:"#111827", borderRadius:10 }}>
              <div style={{ fontSize:22, fontWeight:700, color:s.color, fontFamily:"monospace", lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:8, color:"#4B5563", fontFamily:"monospace", marginTop:3, letterSpacing:"0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div style={{ background:"#0D1117", borderRadius:16, border:"1px solid #1F2937", padding:"14px 16px", marginBottom:14 }}>
          <div style={{ fontSize:9, letterSpacing:"0.12em", color:"#4B5563", marginBottom:10 }}>PLAY LOG</div>
          {log.slice(0,6).map((e,i) => (
            <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom: i < 5 ? "1px solid #111827" : "none" }}>
              <span style={{ fontSize:12, color:"#9CA3AF" }}>{e.label}</span>
              <span style={{ fontSize:13, fontFamily:"monospace", fontWeight:700, color: e.score>0?"#10B981":e.score<0?"#EF4444":"#6B7280" }}>
                {e.score > 0 ? "+" : ""}{e.score}
              </span>
            </div>
          ))}
        </div>
      )}

      <button onClick={reset} style={{ width:"100%", padding:"12px", borderRadius:14, border:"1px solid #1F2937", background:"transparent", color:"#4B5563", cursor:"pointer", fontSize:12, letterSpacing:"0.08em", fontFamily:"monospace" }}>
        ↺ RESET GAME
      </button>
    </div>
  );
}

/* ─────────────────────────── WEEK OVERVIEW ─────────────────────────── */
function WeekOverview({ completedDrills, onSelectDay }: WeekOverviewProps) {
  const todayIdx = getCurrentDayIdx();
  return (
    <div style={{ padding:"0 14px 100px" }}>
      {/* Weekly summary */}
      <div style={{ background:"#0D1117", borderRadius:18, border:"1px solid #1F2937", padding:"16px", marginBottom:16, display:"flex", gap:10 }}>
        {SCHEDULE.map((day, idx) => {
          const allKeys = day.sections.flatMap(s => s.drills.map(d => `${s.id}::${d.name}`));
          const done = allKeys.filter(k => completedDrills[k]).length;
          const pct = allKeys.length > 0 ? (done/allKeys.length)*100 : 0;
          const isToday = idx === todayIdx;
          return (
            <div key={day.id} onClick={() => onSelectDay(idx)} style={{ flex:1, textAlign:"center", cursor:"pointer" }}>
              <div style={{ fontSize:9, color: isToday ? day.color : "#6B7280", fontWeight:700, marginBottom:6, letterSpacing:"0.05em" }}>{day.short}</div>
              <div style={{ height:40, background:"#1F2937", borderRadius:6, overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                <div style={{ height:`${pct}%`, background: pct===100 ? "#10B981" : day.color, borderRadius:6, transition:"height 0.4s", minHeight: pct > 0 ? 4 : 0 }} />
              </div>
              <div style={{ fontSize:8, color:"#4B5563", fontFamily:"monospace", marginTop:4 }}>{Math.round(pct)}%</div>
            </div>
          );
        })}
      </div>

      {SCHEDULE.map((day, idx) => {
        const allKeys = day.sections.flatMap(s => s.drills.map(d => `${s.id}::${d.name}`));
        const done = allKeys.filter(k => completedDrills[k]).length;
        const pct = allKeys.length > 0 ? Math.round((done/allKeys.length)*100) : 0;
        const isToday = idx === todayIdx;
        return (
          <div key={day.id} onClick={() => onSelectDay(idx)} style={{
            background:"#0D1117", borderRadius:18,
            border:`1.5px solid ${isToday ? day.color : "#1F2937"}`,
            marginBottom:10, padding:"14px 16px", cursor:"pointer",
            boxShadow: isToday ? `0 0 20px ${day.color}15` : "none",
            transition:"all 0.2s",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:50, height:50, borderRadius:14, flexShrink:0,
                background: isToday ? day.color : `${day.color}15`,
                border:`1px solid ${day.color}30`,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1,
              }}>
                <span style={{ fontSize:8, fontWeight:900, color: isToday ? "rgba(255,255,255,0.8)" : day.color, letterSpacing:"0.08em" }}>{day.short}</span>
                <span style={{ fontSize:20, lineHeight:1 }}>{day.venueIcon}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:"#F3F4F6" }}>{day.label}</span>
                  {isToday && <span style={{ fontSize:8, fontWeight:800, color:day.color, background:`${day.color}20`, padding:"2px 7px", borderRadius:99, letterSpacing:"0.08em" }}>TODAY</span>}
                  {day.isBigDay && <span style={{ fontSize:8, fontWeight:800, color:"#EF4444", background:"#EF444420", padding:"2px 7px", borderRadius:99 }}>BIG DAY</span>}
                  {day.hasGame && <span style={{ fontSize:8, fontWeight:800, color:"#10B981", background:"#10B98120", padding:"2px 7px", borderRadius:99 }}>GAME</span>}
                </div>
                <div style={{ fontSize:12, color:"#6B7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{day.theme}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:20, fontWeight:700, fontFamily:"monospace", color: pct===100 ? "#10B981" : day.color }}>{pct}%</div>
                <div style={{ fontSize:9, color:"#4B5563", fontFamily:"monospace" }}>{done}/{allKeys.length}</div>
              </div>
            </div>
            <div style={{ height:3, background:"#1F2937", borderRadius:99, overflow:"hidden", marginTop:12 }}>
              <div style={{ height:"100%", width:`${pct}%`, background: pct===100 ? "#10B981" : day.color, borderRadius:99, transition:"width 0.4s" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── IQ TAB ─────────────────────────── */
function IQTab({ completedGoals, onToggleGoal }: IQTabProps) {
  const done = IQ_GOALS.filter((_,i) => completedGoals[i]).length;
  return (
    <div style={{ padding:"0 14px 100px" }}>
      {/* Kobe */}
      <div style={{ background:"#0D1117", borderRadius:20, padding:"20px", marginBottom:14, border:"1px solid #1F2937", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, fontSize:100, opacity:0.04 }}>🏀</div>
        <div style={{ fontSize:32, marginBottom:10 }}>🐍</div>
        <p style={{ margin:0, fontSize:14, color:"#D1D5DB", lineHeight:1.65, fontStyle:"italic" }}>
          "The most important thing is to try and inspire people so that they can be great in whatever they want to do."
        </p>
        <div style={{ marginTop:10, fontSize:11, color:"#374151", fontFamily:"monospace", letterSpacing:"0.06em" }}>— KOBE BRYANT</div>
      </div>

      {/* Goals */}
      <div style={{ background:"#0D1117", borderRadius:18, border:"1px solid #1F2937", padding:"16px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"#F3F4F6" }}>August Goals</div>
            <div style={{ fontSize:11, color:"#6B7280", fontFamily:"monospace", marginTop:2 }}>{done}/{IQ_GOALS.length} locked in</div>
          </div>
          <div style={{ width:44, height:44, borderRadius:12, background: done===IQ_GOALS.length ? "#052E16" : "#111827", border:`1px solid ${done===IQ_GOALS.length ? "#10B981" : "#1F2937"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:22, fontFamily:"monospace", fontWeight:700, color: done===IQ_GOALS.length ? "#10B981" : "#F97316" }}>{done}</span>
          </div>
        </div>
        <div style={{ height:3, background:"#1F2937", borderRadius:99, overflow:"hidden", marginBottom:14 }}>
          <div style={{ height:"100%", width:`${(done/IQ_GOALS.length)*100}%`, background:"#10B981", borderRadius:99, transition:"width 0.4s" }} />
        </div>
        {IQ_GOALS.map((goal, i) => {
          const checked = !!completedGoals[i];
          return (
            <div key={i} onClick={() => onToggleGoal(i)} style={{
              display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", cursor:"pointer",
              borderBottom: i < IQ_GOALS.length-1 ? "1px solid #111827" : "none",
            }}>
              <div style={{
                width:24, height:24, borderRadius:7, flexShrink:0, marginTop:1,
                border:`2px solid ${checked ? "#10B981" : "#374151"}`,
                background: checked ? "#10B981" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s",
              }}>
                {checked && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5L4.2 8.2L9.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
                <span style={{ fontSize:16 }}>{goal.icon}</span>
                <span style={{ fontSize:13, color: checked ? "#4B5563" : "#D1D5DB", textDecoration: checked ? "line-through" : "none", lineHeight:1.4 }}>{goal.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Film */}
      <div style={{ background:"#0D1117", borderRadius:18, border:"1px solid #1F2937", padding:"16px", marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#F3F4F6", marginBottom:12, display:"flex", gap:8, alignItems:"center" }}>
          <span>📺</span> Film Study Focus
        </div>
        {[
          { player:"Jalen Brunson", focus:"Pace & pickup timing", color:"#3B82F6" },
          { player:"Shai Gilgeous-Alexander", focus:"Body control & reads", color:"#8B5CF6" },
        ].map(p => (
          <div key={p.player} style={{ padding:"12px", borderRadius:12, background:"#111827", border:`1px solid ${p.color}20`, marginBottom:8 }}>
            <div style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.player}</div>
            <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>Focus: {p.focus}</div>
          </div>
        ))}
      </div>

      {/* Gather */}
      <div style={{ background:"#0D1117", borderRadius:18, border:"1px solid #1F2937", padding:"16px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#F3F4F6", marginBottom:12, display:"flex", gap:8, alignItems:"center" }}>
          <span>👣</span> Gather Split
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {[
            { pct:"70%", label:"1-2 Gather", sub:"Priority", color:"#3B82F6" },
            { pct:"30%", label:"Hop Gather", sub:"Secondary", color:"#8B5CF6" },
          ].map(g => (
            <div key={g.label} style={{ flex:1, background:"#111827", border:`1px solid ${g.color}25`, borderRadius:14, padding:"14px", textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:800, color:g.color, fontFamily:"monospace" }}>{g.pct}</div>
              <div style={{ fontSize:12, fontWeight:700, color:g.color, marginTop:2 }}>{g.label}</div>
              <div style={{ fontSize:10, color:"#4B5563", marginTop:3 }}>{g.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:"10px 12px", background:"#111827", borderRadius:12, border:"1px solid #1F2937" }}>
          <p style={{ margin:0, fontSize:12, color:"#6B7280", lineHeight:1.55 }}>
            Master 1-2 gather first. Don't move to hop gather until 1-2 is automatic under pressure.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */
export default function App() {
  const todayIdx = getCurrentDayIdx();
  const [tab, setTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [phase, setPhase] = useState<PhaseKey>(getCurrentPhase());
  const [completedDrills, setCompletedDrills] = useState<CompletedDrills>(() => {
    try { return JSON.parse(localStorage.getItem("bball_drills2") || "{}"); } catch { return {}; }
  });
  const [completedGoals, setCompletedGoals] = useState<CompletedGoals>(() => {
    try { return JSON.parse(localStorage.getItem("bball_goals2") || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem("bball_drills2", JSON.stringify(completedDrills)); }, [completedDrills]);
  useEffect(() => { localStorage.setItem("bball_goals2", JSON.stringify(completedGoals)); }, [completedGoals]);

  const toggleDrill = useCallback((key: string) => setCompletedDrills(prev => ({ ...prev, [key]: !prev[key] })), []);
  const toggleGoal = useCallback((i: number) => setCompletedGoals(prev => ({ ...prev, [i]: !prev[i] })), []);
  const handleSelectDay = (idx: number) => { setSelectedDay(idx); setTab("today"); };

  const day = SCHEDULE[selectedDay];

  return (
    <div style={{ maxWidth:430, margin:"0 auto", background:"#060A0F", minHeight:"100vh", fontFamily:"'SF Pro Display', -apple-system, sans-serif" }}>
      {/* Top bar */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(6,10,15,0.95)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid #111827",
        paddingTop:12,
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px 10px" }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:"#F3F4F6", letterSpacing:"-0.02em" }}>🏀 August Prep</div>
            <div style={{ fontSize:10, color:"#4B5563", fontFamily:"monospace", letterSpacing:"0.1em" }}>TEAM SELECTION TRAINING</div>
          </div>
          {/* Phase toggle */}
          <button onClick={() => setPhase(p => p===1 ? 2 : 1)} style={{
            padding:"6px 12px", borderRadius:99,
            border:`1.5px solid ${PHASES[phase].color}`,
            background:"transparent", color:PHASES[phase].color,
            fontSize:11, fontWeight:700, fontFamily:"monospace",
            cursor:"pointer", letterSpacing:"0.06em",
          }}>
            {PHASES[phase].label} ↕
          </button>
        </div>
        {/* Day pills */}
        {tab === "today" && (
          <div style={{ display:"flex", gap:6, overflowX:"auto", padding:"0 14px 12px", scrollbarWidth:"none" }}>
            {SCHEDULE.map((d, idx) => {
              const active = selectedDay === idx;
              return (
                <button key={d.id} onClick={() => setSelectedDay(idx)} style={{
                  flexShrink:0, padding:"7px 14px", borderRadius:99,
                  border:`1.5px solid ${active ? d.color : "#1F2937"}`,
                  background: active ? d.color : "#0D1117",
                  color: active ? "white" : "#6B7280",
                  fontSize:11, fontWeight:700, fontFamily:"monospace",
                  cursor:"pointer", transition:"all 0.2s",
                  letterSpacing:"0.06em",
                }}>{d.short}</button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ paddingTop:16 }}>
        {tab==="today" && <TodayTab completedDrills={completedDrills} onToggle={toggleDrill} selectedDay={selectedDay} onGoToGame={() => setTab("game")} />}
        {tab==="week" && <WeekOverview completedDrills={completedDrills} onSelectDay={handleSelectDay} />}
        {tab==="game" && <GameTracker phase={phase} onPhaseChange={setPhase} />}
        {tab==="iq" && <IQTab completedGoals={completedGoals} onToggleGoal={toggleGoal} />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background:"rgba(6,10,15,0.97)", backdropFilter:"blur(16px)",
        borderTop:"1px solid #111827",
        display:"flex", padding:"8px 8px 22px",
        zIndex:200,
      }}>
        {[
          { id:"today", icon:"📋", label:"TODAY" },
          { id:"week", icon:"📅", label:"WEEK" },
          { id:"game", icon:"🏀", label:"GAME" },
          { id:"iq", icon:"🧠", label:"IQ" },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:"6px 4px", border:"none", background:"transparent",
              cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            }}>
              <div style={{
                width:44, height:32, borderRadius:14,
                background: active ? "#1F2937" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:17, transition:"all 0.2s",
                boxShadow: active ? `inset 0 0 0 1px #374151` : "none",
              }}>{t.icon}</div>
              <span style={{ fontSize:9, fontWeight:800, color: active ? "#F3F4F6" : "#374151", fontFamily:"monospace", letterSpacing:"0.1em" }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
