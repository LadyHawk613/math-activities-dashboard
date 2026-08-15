/**
 * Tactile Number Studio — warm paper, ink-blue structure, Numberline Yellow highlights.
 * The page is an asymmetric learning workbench: calm, capable, and hands-on rather than game-like.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, Compass, Gauge, Home as HomeIcon, Lightbulb, LineChart, Menu, RotateCcw, Sparkles, Star, Trophy, X } from "lucide-react";

type ActivityId = "addition" | "multiplication" | "patterns";
type Choice = number | string;
type Feedback = "correct" | "incorrect" | null;
type Activity = { id: ActivityId; eyebrow: string; title: string; description: string; image: string; color: string; note: string };
type Question = { prompt: string; visual: string; choices: Choice[]; answer: Choice; clue: string; explanation: string };

const compassMark = "/manus-storage/math-hub-compass-mark_0b41fc56.png";
const activities: Activity[] = [
  { id: "addition", eyebrow: "NUMBER SENSE", title: "Build & Break", description: "Jump tens, then ones, and name the move that gets you there.", image: "/manus-storage/math-hub-addition_6d72e8f4.jpg", color: "orange", note: "JUMP IN PARTS" },
  { id: "multiplication", eyebrow: "EQUAL GROUPS", title: "Array Lab", description: "Build equal rows, then use the arrangement to explain your answer.", image: "/manus-storage/math-hub-multiplication_d7dba472.jpg", color: "blue", note: "COUNT THE ROWS" },
  { id: "patterns", eyebrow: "ALGEBRAIC THINKING", title: "Pattern Scout", description: "Notice the change, predict the next move, then test your rule.", image: "/manus-storage/math-hub-patterns_2d2f52d2.jpg", color: "teal", note: "FOLLOW THE RULE" },
];

const questionSets: Record<ActivityId, Question[]> = {
  addition: [
    { prompt: "27 + 16", visual: "27  →  +10  →  +6", choices: [33, 43, 44, 53], answer: 43, clue: "Break 16 into 10 and 6. What do you get after each jump?", explanation: "27 + 10 is 37, then 37 + 6 is 43." },
    { prompt: "54 − 28", visual: "54  →  −20  →  −8", choices: [26, 32, 36, 46], answer: 26, clue: "Move back 20 first, then move back 8 more.", explanation: "54 − 20 is 34, and 34 − 8 is 26." },
    { prompt: "38 + 25", visual: "38  →  +20  →  +5", choices: [53, 63, 64, 73], answer: 63, clue: "Tens first, ones second.", explanation: "38 + 20 is 58, then 58 + 5 is 63." },
    { prompt: "71 − 36", visual: "71  →  −30  →  −6", choices: [25, 35, 45, 55], answer: 35, clue: "Take away 3 tens, then 6 ones.", explanation: "71 − 30 is 41, then 41 − 6 is 35." },
    { prompt: "46 + 19", visual: "46  →  +20  →  −1", choices: [55, 64, 65, 66], answer: 65, clue: "Adding 20, then taking away 1 can make this easier.", explanation: "46 + 20 is 66; one less is 65." },
  ],
  multiplication: [
    { prompt: "4 groups of 6", visual: "6 + 6 + 6 + 6", choices: [10, 20, 24, 36], answer: 24, clue: "Count four equal jumps of 6.", explanation: "Four groups of 6 make 24." },
    { prompt: "7 × 3", visual: "3 + 3 + 3 + 3 + 3 + 3 + 3", choices: [18, 20, 21, 24], answer: 21, clue: "There are seven groups, each with three.", explanation: "Seven 3s total 21." },
    { prompt: "5 × 8", visual: "5 rows • 8 in each row", choices: [35, 40, 42, 45], answer: 40, clue: "Use five groups of eight.", explanation: "5 × 8 is 40." },
    { prompt: "9 × 4", visual: "4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4", choices: [32, 35, 36, 40], answer: 36, clue: "Nine groups of four is the same as ten groups, minus one group.", explanation: "10 × 4 is 40, and 40 − 4 is 36." },
    { prompt: "6 × 7", visual: "6 rows • 7 in each row", choices: [40, 42, 45, 48], answer: 42, clue: "Use a known fact: 6 × 5 plus 6 × 2.", explanation: "30 + 12 = 42." },
  ],
  patterns: [
    { prompt: "4, 8, 12, 16, ?", visual: "add 4 each time", choices: [18, 20, 22, 24], answer: 20, clue: "Compare each number with the one right before it.", explanation: "The pattern adds 4, so 16 + 4 is 20." },
    { prompt: "30, 27, 24, 21, ?", visual: "subtract the same amount", choices: [16, 17, 18, 19], answer: 18, clue: "What amount is being subtracted each time?", explanation: "Each number is 3 less than the previous one, so 21 − 3 is 18." },
    { prompt: "2, 5, 10, 17, ?", visual: "+3, +5, +7, then…", choices: [24, 25, 26, 27], answer: 26, clue: "The jumps are odd numbers that grow by 2.", explanation: "After +3, +5, and +7 comes +9. So 17 + 9 is 26." },
    { prompt: "1, 3, 6, 10, ?", visual: "+2, +3, +4, then…", choices: [14, 15, 16, 17], answer: 15, clue: "The amount added grows by one each time.", explanation: "The next jump is +5, so 10 + 5 is 15." },
    { prompt: "50, 45, 39, 32, ?", visual: "−5, −6, −7, then…", choices: [22, 23, 24, 25], answer: 24, clue: "The amount subtracted is increasing by one.", explanation: "Next subtract 8: 32 − 8 is 24." },
  ],
};

const navItems = [{ label: "Today", icon: HomeIcon }, { label: "Activities", icon: BookOpen }, { label: "Progress", icon: LineChart }];

export default function Home() {
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Choice | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [correctInRound, setCorrectInRound] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activityProgress, setActivityProgress] = useState<Record<ActivityId, number>>({ addition: 68, multiplication: 42, patterns: 24 });
  const [dailyStreak, setDailyStreak] = useState(4);

  useEffect(() => {
    const savedProgress = window.localStorage.getItem("math-hub-progress");
    const savedStreak = window.localStorage.getItem("math-hub-streak");
    if (savedProgress) try { setActivityProgress(JSON.parse(savedProgress)); } catch { window.localStorage.removeItem("math-hub-progress"); }
    if (savedStreak) setDailyStreak(Number(savedStreak));
  }, []);
  useEffect(() => { window.localStorage.setItem("math-hub-progress", JSON.stringify(activityProgress)); }, [activityProgress]);

  const mastery = useMemo(() => Math.round(Object.values(activityProgress).reduce((total, value) => total + value, 0) / 3), [activityProgress]);
  const question = activeActivity ? questionSets[activeActivity.id][questionIndex] : null;

  function startActivity(activity: Activity) { setActiveActivity(activity); setQuestionIndex(0); setSelectedAnswer(null); setFeedback(null); setCorrectInRound(0); setRoundFinished(false); setMobileNavOpen(false); }
  function chooseAnswer(choice: Choice) {
    if (!question || feedback === "correct") return;
    setSelectedAnswer(choice);
    if (choice === question.answer) {
      setFeedback("correct"); setCorrectInRound((current) => current + 1);
      if (activeActivity) setActivityProgress((current) => ({ ...current, [activeActivity.id]: Math.min(100, current[activeActivity.id] + 3) }));
    } else setFeedback("incorrect");
  }
  function moveForward() {
    if (!activeActivity) return;
    if (questionIndex === 4) {
      setRoundFinished(true); setDailyStreak((current) => { const next = Math.max(current, 5); window.localStorage.setItem("math-hub-streak", String(next)); return next; }); return;
    }
    setQuestionIndex((current) => current + 1); setSelectedAnswer(null); setFeedback(null);
  }
  function finishRound() { setActiveActivity(null); setRoundFinished(false); setQuestionIndex(0); setFeedback(null); }

  if (activeActivity && question && !roundFinished) return <main className="studio-shell session-shell">
    <aside className="rail rail-session" aria-label="Math Activity Hub navigation"><button className="brand-mark" onClick={finishRound} aria-label="Return to today"><img src={compassMark} alt="" /></button><div className="rail-line" /><button className="rail-back" onClick={finishRound}><ArrowLeft size={18} /><span>Leave round</span></button></aside>
    <section className="session-canvas">
      <header className="session-head"><div><p className="section-kicker">{activeActivity.eyebrow}</p><h1>{activeActivity.title}</h1></div><div className="round-progress" aria-label={`Question ${questionIndex + 1} of 5`}><span>ROUND {questionIndex + 1} / 5</span><div className="mini-track"><i style={{ width: `${((questionIndex + 1) / 5) * 100}%` }} /></div></div></header>
      <div className="question-workbench"><div className="question-notebook"><span className="notebook-tab">THINK IT THROUGH</span><p className="question-visual">{question.visual}</p><h2>{question.prompt}</h2><p className="question-prompt">Which answer makes the pattern true?</p><div className="answer-grid" role="group" aria-label="Answer choices">{question.choices.map((choice, index) => { const isSelected = selectedAnswer === choice; const showCorrect = feedback === "correct" && choice === question.answer; const showIncorrect = feedback === "incorrect" && isSelected; return <button key={String(choice)} className={`answer-choice ${isSelected ? "selected" : ""} ${showCorrect ? "is-correct" : ""} ${showIncorrect ? "is-incorrect" : ""}`} onClick={() => chooseAnswer(choice)} disabled={feedback === "correct"}><span>{String.fromCharCode(65 + index)}</span><strong>{choice}</strong>{showCorrect && <Check size={18} />}{showIncorrect && <X size={18} />}</button>; })}</div></div>
        <aside className={`coach-note ${feedback ?? ""}`} aria-live="polite"><div className="coach-icon"><Lightbulb size={19} /></div>{feedback === null && <><p className="section-kicker">A LITTLE CLUE</p><p>{question.clue}</p></>}{feedback === "incorrect" && <><p className="section-kicker">ALMOST—RETRACE</p><p>{question.clue}</p><button className="text-action" onClick={() => { setSelectedAnswer(null); setFeedback(null); }}><RotateCcw size={14} />Try another route</button></>}{feedback === "correct" && <><p className="section-kicker">THAT’S IT</p><p>{question.explanation}</p><button className="next-button" onClick={moveForward}>{questionIndex === 4 ? "See round recap" : "Next challenge"}<ArrowRight size={17} /></button></>}</aside>
      </div>
    </section>
  </main>;

  if (activeActivity && roundFinished) return <main className="studio-shell session-shell"><aside className="rail rail-session" aria-label="Math Activity Hub navigation"><button className="brand-mark" onClick={finishRound} aria-label="Return to today"><img src={compassMark} alt="" /></button></aside><section className="round-recap"><div className="recap-star"><Sparkles size={30} /></div><p className="section-kicker">ROUND COMPLETE</p><h1>You gave it a real go.</h1><p className="recap-score"><strong>{correctInRound}</strong> of 5 answers found on your first try.</p><p className="recap-copy">Your {activeActivity.title} pathway has moved forward. Keep practicing the strategy that made the hard ones click.</p><div className="recap-actions"><button className="primary-action" onClick={() => startActivity(activeActivity)}>Try a fresh round <RotateCcw size={17} /></button><button className="quiet-action" onClick={finishRound}>Return to today</button></div></section></main>;

  return <main className="studio-shell">
    <button className="mobile-menu" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Open navigation"><Menu size={21} /></button>
    <aside className={`rail ${mobileNavOpen ? "open" : ""}`} aria-label="Math Activity Hub navigation"><div className="rail-brand"><img src={compassMark} alt="" /><span>math<br />activity<br /><b>hub</b></span></div><div className="rail-line" /><nav>{navItems.map(({ label, icon: Icon }, index) => <button className={`rail-nav-item ${index === 0 ? "active" : ""}`} key={label} onClick={() => setMobileNavOpen(false)}><Icon size={18} /><span>{label}</span></button>)}</nav><div className="rail-footnote"><Compass size={17} /><span>Your learning<br />workbench.</span></div></aside>
    <section className="dashboard-canvas"><header className="topline"><p><span className="yellow-dot" />TUESDAY’S WORKBENCH</p><button className="help-button"><CircleHelp size={17} />Need a hand?</button></header>
      <section className="briefing-grid"><div className="welcome-copy"><p className="section-kicker">HELLO, ALEX</p><h1>Find the pattern.<br /><em>Then make it yours.</em></h1><p className="intro-copy">A small round can uncover a big idea. Pick a workbench, make one clear move, and keep the strategy you find.</p><button className="primary-action" onClick={() => startActivity(activities[0])}>Try one clear move<ArrowRight size={17} /></button></div><div className="hero-still-life"><img src="/manus-storage/math-hub-hero-workbench_5fa8d7d5.jpg" alt="Tactile math tiles and a highlighted number line arranged on a learning desk" /><div className="hero-sticker"><Star size={13} fill="currentColor" /><span>MAKE<br />A MOVE</span></div></div></section>
      <section className="signal-strip" aria-label="Today’s learning evidence"><div className="signal-cell streak-signal"><span className="signal-icon"><Sparkles size={18} /></span><div><b>{dailyStreak} days you returned</b><small>practice is becoming a habit you can trust</small></div></div><div className="signal-divider" /><div className="signal-cell"><span className="signal-icon yellow"><Gauge size={18} /></span><div><b>{mastery}% got clearer</b><small>across the ideas you worked on today</small></div></div><div className="signal-divider" /><div className="signal-cell"><span className="signal-icon blue"><Trophy size={18} /></span><div><b>1 move to reuse</b><small>break a tricky number into easier parts</small></div></div></section>
      <section className="activities-section" id="activities"><div className="section-heading"><div><p className="section-kicker">CHOOSE A WORKBENCH</p><h2>Meet the day’s math.</h2></div><p>Choose one idea to test. Your clues will change with the thinking you show.</p></div><div className="activity-deck">{activities.map((activity, index) => { const progress = activityProgress[activity.id]; return <article className={`activity-card ${activity.color}`} key={activity.id}><div className="activity-image-wrap"><img src={activity.image} alt="" /></div><div className="activity-content"><p className="activity-eyebrow">{activity.eyebrow}</p><h3>{activity.title}</h3><p>{activity.description}</p><div className="card-bottom"><div className="progress-detail"><span>{progress}% of this idea explored</span><div className="progress-track"><i style={{ width: `${progress}%` }} /></div></div><button onClick={() => startActivity(activity)} aria-label={`Start ${activity.title}`}><ChevronRight size={19} /></button></div></div><span className="margin-note">{activity.note}</span><span className="card-index">0{index + 1}</span></article>; })}</div></section>
      <footer className="dashboard-footer"><span>Learning happens one clear idea at a time.</span><span>Math Activity Hub · practice studio</span></footer>
    </section>
  </main>;
}
