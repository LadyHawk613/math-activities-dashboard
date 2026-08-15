/**
 * Tactile Number Studio — warm paper, ink-blue structure, Numberline Yellow highlights.
 * A left-rail course selector launches level-specific starter activities while retaining the workbench ethos.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, Compass, Gauge, Home as HomeIcon, Lightbulb, LineChart, Menu, RotateCcw, Sparkles, Star, Trophy, X } from "lucide-react";
import Integrated3Workshop from "@/components/Integrated3Workshop";

type SectionId = "integrated-1" | "algebra-1" | "pre-calculus" | "integrated-2" | "geometry" | "calculus" | "integrated-3" | "trigonometry" | "grade-4";
type Choice = number | string;
type Feedback = "correct" | "incorrect" | null;
type Question = { prompt: string; visual: string; choices: Choice[]; answer: Choice; clue: string; explanation: string };
type MathSection = { id: SectionId; title: string; eyebrow: string; activity: string; description: string; note: string; image: string; color: string };

const compassMark = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/vqEdiYIDCATHBBCS.png";
const mathSections: MathSection[] = [
  { id: "algebra-1", title: "Algebra 1", eyebrow: "EQUATIONS & FUNCTIONS", activity: "Equation Studio", description: "Balance equations and use functions to describe a changing quantity.", note: "KEEP IT BALANCED", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/SEZjQZnbCSDPkovH.jpg", color: "blue" },
  { id: "integrated-1", title: "Integrated Math 1", eyebrow: "FOUNDATIONS", activity: "Linear Launch", description: "Explore variables, proportional reasoning, and the first patterns of algebra.", note: "BUILD THE RULE", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/nECMMagASYBLvqUC.jpg", color: "orange" },
  { id: "integrated-2", title: "Integrated Math 2", eyebrow: "QUADRATICS & SYSTEMS", activity: "Quadratic Workshop", description: "Compare parabolas, systems, and transformations one clear move at a time.", note: "FIND THE TURN", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/aNRkssswHJjbEODd.jpg", color: "teal" },
  { id: "geometry", title: "Geometry", eyebrow: "SHAPE & PROOF", activity: "Shape Reasoning", description: "Use angle facts, similarity, and area to defend a geometric claim.", note: "MARK THE FACTS", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/nECMMagASYBLvqUC.jpg", color: "orange" },
  { id: "integrated-3", title: "Integrated Math 3", eyebrow: "MODELING & DATA", activity: "Model Builder", description: "Use exponentials, polynomials, and data to test a mathematical model.", note: "TEST THE MODEL", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/aNRkssswHJjbEODd.jpg", color: "teal" },
  { id: "trigonometry", title: "Trigonometry", eyebrow: "ANGLES & CYCLES", activity: "Triangle Navigator", description: "Follow the relationships between sides, angles, and periodic patterns.", note: "TRACK THE CYCLE", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/nECMMagASYBLvqUC.jpg", color: "orange" },
  { id: "pre-calculus", title: "Pre-Calculus", eyebrow: "FUNCTIONS & RATES", activity: "Function Fieldwork", description: "Trace patterns in functions, radians, and changing rates before calculus begins.", note: "NOTICE THE CHANGE", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/aNRkssswHJjbEODd.jpg", color: "teal" },
  { id: "calculus", title: "Calculus", eyebrow: "CHANGE & ACCUMULATION", activity: "Rate of Change", description: "Connect slopes, derivatives, and accumulation through short visual prompts.", note: "FOLLOW THE RATE", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/SEZjQZnbCSDPkovH.jpg", color: "blue" },
  { id: "grade-4", title: "4th Grade Math", eyebrow: "NUMBER SENSE", activity: "Multiply & Measure", description: "Use place value, multiplication, and fractions to make strong number sense.", note: "MAKE A MODEL", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/SEZjQZnbCSDPkovH.jpg", color: "blue" },
];

const questionSets: Record<SectionId, Question[]> = {
  "integrated-1": [
    { prompt: "x + 7 = 19", visual: "keep both sides balanced", choices: [10, 12, 19, 26], answer: 12, clue: "Undo the +7 by taking 7 away from both sides.", explanation: "19 − 7 is 12, so x is 12." },
    { prompt: "3x = 24", visual: "three equal groups", choices: [6, 8, 12, 21], answer: 8, clue: "What number makes three equal groups total 24?", explanation: "24 ÷ 3 is 8." },
    { prompt: "y = 2x + 1; x = 4", visual: "substitute the value", choices: [5, 8, 9, 10], answer: 9, clue: "Replace x with 4 before you calculate.", explanation: "2 × 4 + 1 is 9." },
    { prompt: "5, 9, 13, 17, ?", visual: "constant difference", choices: [19, 20, 21, 22], answer: 21, clue: "Check the jump between each pair of terms.", explanation: "The pattern adds 4, so 17 + 4 is 21." },
    { prompt: "2(x + 3) = 18", visual: "divide, then undo", choices: [3, 6, 9, 12], answer: 6, clue: "First divide both sides by 2.", explanation: "x + 3 is 9; taking away 3 gives x = 6." },
  ],
  "algebra-1": [
    { prompt: "4x − 3 = 21", visual: "add 3, then divide", choices: [4, 5, 6, 9], answer: 6, clue: "Get the term with x by itself before dividing.", explanation: "Adding 3 gives 24; 24 ÷ 4 is 6." },
    { prompt: "y = 3x − 2; x = 5", visual: "evaluate the function", choices: [8, 10, 13, 17], answer: 13, clue: "Use 5 as the input for x.", explanation: "3 × 5 − 2 is 13." },
    { prompt: "x² = 49", visual: "which value squares to 49?", choices: [5, 6, 7, 8], answer: 7, clue: "Think of the positive factor paired with itself.", explanation: "7 × 7 is 49." },
    { prompt: "2x + 5 = 3x − 4", visual: "move x terms together", choices: [-9, 1, 9, 14], answer: 9, clue: "Subtract 2x from both sides first.", explanation: "5 = x − 4, so x is 9." },
    { prompt: "Slope through (1, 2) and (3, 8)", visual: "rise ÷ run", choices: [2, 3, 4, 6], answer: 3, clue: "The rise is 6 and the run is 2.", explanation: "6 ÷ 2 is 3." },
  ],
  "pre-calculus": [
    { prompt: "sin(90°)", visual: "unit-circle value", choices: [0, 1, -1, "undefined"], answer: 1, clue: "At the top of the unit circle, look at the y-coordinate.", explanation: "The y-coordinate at 90° is 1." },
    { prompt: "f(x) = x²; f(−3)", visual: "input is negative", choices: [-9, -6, 6, 9], answer: 9, clue: "Square the whole input, including its sign.", explanation: "(−3)² is 9." },
    { prompt: "π radians = ? degrees", visual: "half a turn", choices: [90, 180, 270, 360], answer: 180, clue: "A full turn is 2π radians.", explanation: "Half of 2π is π, which is 180°." },
    { prompt: "Domain of √x", visual: "real-number inputs", choices: ["x ≤ 0", "x ≥ 0", "x ≠ 0", "all x"], answer: "x ≥ 0", clue: "A real square root cannot start with a negative number.", explanation: "x must be 0 or greater." },
    { prompt: "g(x) = 2x + 5; g(2)", visual: "substitute the input", choices: [7, 9, 10, 14], answer: 9, clue: "Replace x with 2.", explanation: "2 × 2 + 5 is 9." },
  ],
  "integrated-2": [
    { prompt: "x² = 36", visual: "two square roots", choices: [6, "±6", 18, 36], answer: "±6", clue: "Both a positive and negative number can square to 36.", explanation: "6² and (−6)² are both 36." },
    { prompt: "y = (x − 2)²", visual: "vertex form", choices: ["(0, 2)", "(2, 0)", "(−2, 0)", "(0, −2)"], answer: "(2, 0)", clue: "The x-value moves opposite the sign inside the parentheses.", explanation: "The vertex is shifted right to (2, 0)." },
    { prompt: "x + y = 10; x = 4", visual: "use the known value", choices: [4, 6, 10, 14], answer: 6, clue: "Substitute x = 4 into the first equation.", explanation: "4 + y = 10, so y is 6." },
    { prompt: "(x + 3)(x − 3)", visual: "difference of squares", choices: ["x² + 9", "x² − 9", "x² − 6x + 9", "x² + 6x + 9"], answer: "x² − 9", clue: "The middle terms cancel.", explanation: "x² − 3x + 3x − 9 simplifies to x² − 9." },
    { prompt: "x² − 5x + 6 = 0", visual: "find the factors", choices: ["1, 6", "2, 3", "−2, −3", "−1, −6"], answer: "2, 3", clue: "Find two factors of 6 that add to 5.", explanation: "(x − 2)(x − 3) = 0, so the roots are 2 and 3." },
  ],
  geometry: [
    { prompt: "Triangle angles: 48°, 67°, ?", visual: "triangle total = 180°", choices: [55, 65, 75, 85], answer: 65, clue: "Add the known angles, then subtract from 180.", explanation: "48 + 67 is 115; 180 − 115 is 65." },
    { prompt: "Area of a 7 × 5 rectangle", visual: "length × width", choices: [12, 24, 35, 70], answer: 35, clue: "Multiply the side lengths.", explanation: "7 × 5 is 35 square units." },
    { prompt: "Right triangle: legs 3 and 4", visual: "Pythagorean triple", choices: [5, 6, 7, 12], answer: 5, clue: "Use the familiar 3–4–5 triangle.", explanation: "3² + 4² equals 25, so the hypotenuse is 5." },
    { prompt: "Circumference when r = 4", visual: "C = 2πr", choices: ["4π", "8π", "12π", "16π"], answer: "8π", clue: "Multiply 2 by the radius.", explanation: "2 × π × 4 is 8π." },
    { prompt: "Similar shapes have the same…", visual: "shape versus size", choices: ["area", "angles", "perimeter", "side lengths"], answer: "angles", clue: "Their side lengths may scale, but another feature stays equal.", explanation: "Similar figures have equal corresponding angles." },
  ],
  calculus: [
    { prompt: "d/dx (x²)", visual: "power rule", choices: ["x", "2x", "x²", "2"], answer: "2x", clue: "Bring the exponent down, then lower it by one.", explanation: "The derivative of x² is 2x." },
    { prompt: "d/dx (5x)", visual: "constant slope", choices: [0, 1, 5, "5x"], answer: 5, clue: "A line’s derivative is its slope.", explanation: "The slope of 5x is 5." },
    { prompt: "∫ 3x² dx", visual: "reverse the power rule", choices: ["x³ + C", "3x³ + C", "x² + C", "6x + C"], answer: "x³ + C", clue: "What derivative would give 3x²?", explanation: "The derivative of x³ is 3x²." },
    { prompt: "Slope of y = 2x + 1", visual: "coefficient of x", choices: [1, 2, 3, "undefined"], answer: 2, clue: "In y = mx + b, m is the slope.", explanation: "m is 2." },
    { prompt: "d/dx (7)", visual: "constant function", choices: [0, 1, 7, "undefined"], answer: 0, clue: "A flat function does not change.", explanation: "The derivative of a constant is 0." },
  ],
  "integrated-3": [
    { prompt: "2³ × 2⁴", visual: "same base", choices: [16, 32, 64, 128], answer: 128, clue: "When bases match, add the exponents.", explanation: "2³ × 2⁴ is 2⁷, which is 128." },
    { prompt: "y = 3(2ˣ); x = 2", visual: "evaluate the exponential", choices: [6, 9, 12, 18], answer: 12, clue: "Find 2² before multiplying by 3.", explanation: "3 × 4 is 12." },
    { prompt: "Mean of 4, 6, 8", visual: "share equally", choices: [5, 6, 7, 18], answer: 6, clue: "Add the values and divide by how many there are.", explanation: "18 ÷ 3 is 6." },
    { prompt: "A 2% growth factor", visual: "one plus the rate", choices: [0.02, 0.98, 1.02, 2], answer: 1.02, clue: "A growth factor includes the original whole.", explanation: "100% + 2% equals 102%, or 1.02." },
    { prompt: "x³ × x²", visual: "combine exponents", choices: ["x⁵", "x⁶", "2x⁵", "x"], answer: "x⁵", clue: "Add exponents for like bases.", explanation: "3 + 2 is 5." },
  ],
  trigonometry: [
    { prompt: "sin(30°)", visual: "special-angle value", choices: [0, "1/2", "√2/2", 1], answer: "1/2", clue: "Use the 30°–60°–90° triangle.", explanation: "The sine of 30° is 1/2." },
    { prompt: "cos(0°)", visual: "unit-circle point", choices: [0, "1/2", 1, -1], answer: 1, clue: "At 0°, the unit-circle point lies on the positive x-axis.", explanation: "Its x-coordinate is 1." },
    { prompt: "tan(45°)", visual: "equal legs", choices: [0, "√2/2", 1, "undefined"], answer: 1, clue: "At 45°, opposite and adjacent have equal length.", explanation: "A ratio of equal lengths is 1." },
    { prompt: "Hypotenuse 10, opposite 6", visual: "sin θ = opposite ÷ hypotenuse", choices: ["3/5", "4/5", "5/3", "5/2"], answer: "3/5", clue: "Use the two sides named in the sine ratio.", explanation: "6 ÷ 10 simplifies to 3/5." },
    { prompt: "Period of y = sin x", visual: "one full cycle", choices: ["π", "2π", "3π", "4π"], answer: "2π", clue: "The sine curve repeats after one full unit-circle turn.", explanation: "One full cycle is 2π." },
  ],
  "grade-4": [
    { prompt: "8 × 7", visual: "equal groups", choices: [48, 54, 56, 63], answer: 56, clue: "Use a fact you know: 8 × 5 plus 8 × 2.", explanation: "40 + 16 is 56." },
    { prompt: "63 ÷ 9", visual: "how many groups?", choices: [6, 7, 8, 9], answer: 7, clue: "What number times 9 makes 63?", explanation: "7 × 9 is 63." },
    { prompt: "Which equals 1/2?", visual: "same-sized shares", choices: ["2/3", "3/6", "3/4", "4/6"], answer: "3/6", clue: "Half means the top number is half the bottom number.", explanation: "3 is half of 6, so 3/6 equals 1/2." },
    { prompt: "3,405 + 290", visual: "add hundreds and tens", choices: ["3,595", "3,695", "3,705", "3,795"], answer: "3,695", clue: "Add 200, then add 90.", explanation: "3,405 + 200 is 3,605; plus 90 is 3,695." },
    { prompt: "Perimeter: 6 by 4 rectangle", visual: "add every side", choices: [10, 20, 24, 48], answer: 20, clue: "Use 6 + 4 + 6 + 4.", explanation: "The perimeter is 20 units." },
  ],
};

const defaultProgress: Record<SectionId, number> = { "integrated-1": 62, "algebra-1": 45, "pre-calculus": 24, "integrated-2": 35, geometry: 48, calculus: 18, "integrated-3": 31, trigonometry: 39, "grade-4": 72 };
const navItems = [{ label: "Today", icon: HomeIcon }, { label: "Activities", icon: BookOpen }, { label: "Progress", icon: LineChart }];

export default function Home() {
  const [activeSection, setActiveSection] = useState<MathSection | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId>("integrated-1");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Choice | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [correctInRound, setCorrectInRound] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [integrated3WorkshopOpen, setIntegrated3WorkshopOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activityProgress, setActivityProgress] = useState<Record<SectionId, number>>(defaultProgress);
  const [dailyStreak, setDailyStreak] = useState(4);
  const selectedSection = mathSections.find((section) => section.id === selectedSectionId) ?? mathSections[0];
  const questions = activeSection ? questionSets[activeSection.id] : questionSets[selectedSection.id];
  const question = activeSection ? questions[questionIndex] : null;

  useEffect(() => { const savedProgress = window.localStorage.getItem("math-hub-course-progress"); const savedStreak = window.localStorage.getItem("math-hub-streak"); if (savedProgress) try { setActivityProgress({ ...defaultProgress, ...JSON.parse(savedProgress) }); } catch { window.localStorage.removeItem("math-hub-course-progress"); } if (savedStreak) setDailyStreak(Number(savedStreak)); }, []);
  useEffect(() => { window.localStorage.setItem("math-hub-course-progress", JSON.stringify(activityProgress)); }, [activityProgress]);
  const mastery = useMemo(() => Math.round(Object.values(activityProgress).reduce((total, value) => total + value, 0) / mathSections.length), [activityProgress]);

  function startSection(section: MathSection) { setSelectedSectionId(section.id); setQuestionIndex(0); setSelectedAnswer(null); setFeedback(null); setCorrectInRound(0); setRoundFinished(false); setMobileNavOpen(false); if (section.id === "integrated-3") { setActiveSection(null); setIntegrated3WorkshopOpen(true); return; } setIntegrated3WorkshopOpen(false); setActiveSection(section); }
  function chooseAnswer(choice: Choice) { if (!question || feedback === "correct") return; setSelectedAnswer(choice); if (choice === question.answer) { setFeedback("correct"); setCorrectInRound((current) => current + 1); if (activeSection) setActivityProgress((current) => ({ ...current, [activeSection.id]: Math.min(100, current[activeSection.id] + 3) })); } else setFeedback("incorrect"); }
  function moveForward() { if (!activeSection) return; if (questionIndex === questions.length - 1) { setRoundFinished(true); setDailyStreak((current) => { const next = Math.max(current, 5); window.localStorage.setItem("math-hub-streak", String(next)); return next; }); return; } setQuestionIndex((current) => current + 1); setSelectedAnswer(null); setFeedback(null); }
  function finishRound() { setActiveSection(null); setRoundFinished(false); setQuestionIndex(0); setFeedback(null); }

  if (integrated3WorkshopOpen) return <Integrated3Workshop onBack={() => setIntegrated3WorkshopOpen(false)} />;

  if (activeSection && question && !roundFinished) return <main className="studio-shell session-shell"><aside className="rail rail-session" aria-label="Math Activity Hub navigation"><button className="brand-mark" onClick={finishRound} aria-label="Return to section dashboard"><img src={compassMark} alt="" /></button><div className="rail-line" /><button className="rail-back" onClick={finishRound}><ArrowLeft size={18} /><span>Back to {activeSection.title}</span></button></aside><section className="session-canvas"><header className="session-head"><div><p className="section-kicker">{activeSection.eyebrow} · {activeSection.title}</p><h1>{activeSection.activity}</h1></div><div className="round-progress" aria-label={`Question ${questionIndex + 1} of ${questions.length}`}><span>ROUND {questionIndex + 1} / {questions.length}</span><div className="mini-track"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></div></header><div className="question-workbench"><div className="question-notebook"><span className="notebook-tab">THINK IT THROUGH</span><p className="question-visual">{question.visual}</p><h2>{question.prompt}</h2><p className="question-prompt">Which answer makes the pattern true?</p><div className="answer-grid" role="group" aria-label="Answer choices">{question.choices.map((choice, index) => { const isSelected = selectedAnswer === choice; const showCorrect = feedback === "correct" && choice === question.answer; const showIncorrect = feedback === "incorrect" && isSelected; return <button key={String(choice)} className={`answer-choice ${isSelected ? "selected" : ""} ${showCorrect ? "is-correct" : ""} ${showIncorrect ? "is-incorrect" : ""}`} onClick={() => chooseAnswer(choice)} disabled={feedback === "correct"}><span>{String.fromCharCode(65 + index)}</span><strong>{choice}</strong>{showCorrect && <Check size={18} />}{showIncorrect && <X size={18} />}</button>; })}</div></div><aside className={`coach-note ${feedback ?? ""}`} aria-live="polite"><div className="coach-icon"><Lightbulb size={19} /></div>{feedback === null && <><p className="section-kicker">A LITTLE CLUE</p><p>{question.clue}</p></>}{feedback === "incorrect" && <><p className="section-kicker">ALMOST—RETRACE</p><p>{question.clue}</p><button className="text-action" onClick={() => { setSelectedAnswer(null); setFeedback(null); }}><RotateCcw size={14} />Try another route</button></>}{feedback === "correct" && <><p className="section-kicker">THAT’S IT</p><p>{question.explanation}</p><button className="next-button" onClick={moveForward}>{questionIndex === questions.length - 1 ? "See round recap" : "Next challenge"}<ArrowRight size={17} /></button></>}</aside></div></section></main>;

  if (activeSection && roundFinished) return <main className="studio-shell session-shell"><aside className="rail rail-session" aria-label="Math Activity Hub navigation"><button className="brand-mark" onClick={finishRound} aria-label="Return to section dashboard"><img src={compassMark} alt="" /></button></aside><section className="round-recap"><div className="recap-star"><Sparkles size={30} /></div><p className="section-kicker">{activeSection.title.toUpperCase()} · ROUND COMPLETE</p><h1>You gave it a real go.</h1><p className="recap-score"><strong>{correctInRound}</strong> of {questions.length} answers found on your first try.</p><p className="recap-copy">Your {activeSection.activity} pathway has moved forward. Keep the strategy that made the hard ones click.</p><div className="recap-actions"><button className="primary-action" onClick={() => startSection(activeSection)}>Try a fresh round <RotateCcw size={17} /></button><button className="quiet-action" onClick={finishRound}>Return to {activeSection.title}</button></div></section></main>;

  return <main className="studio-shell"><button className="mobile-menu" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Open navigation"><Menu size={21} /></button><aside className={`rail ${mobileNavOpen ? "open" : ""}`} aria-label="Math Activity Hub navigation"><div className="rail-brand"><img src={compassMark} alt="" /><span>math<br />activity<br /><b>hub</b></span></div><section className="course-menu" aria-label="Select a math section"><p className="course-menu-title">SELECT A MATH SECTION</p>{mathSections.map((section) => <button className={`course-button ${selectedSectionId === section.id ? "active" : ""}`} key={section.id} onClick={() => startSection(section)}><span>{section.title}</span><ArrowRight size={14} /></button>)}</section><div className="rail-line course-divider" /><nav>{navItems.map(({ label, icon: Icon }, index) => <button className={`rail-nav-item ${index === 0 ? "active" : ""}`} key={label} onClick={() => setMobileNavOpen(false)}><Icon size={18} /><span>{label}</span></button>)}</nav><div className="rail-footnote"><Compass size={17} /><span>Your learning<br />workbench.</span></div></aside>
    <section className="dashboard-canvas"><header className="topline"><p><span className="yellow-dot" />{selectedSection.title.toUpperCase()} WORKBENCH</p><button className="help-button"><CircleHelp size={17} />Need a hand?</button></header><section className="briefing-grid"><div className="welcome-copy"><p className="section-kicker">{selectedSection.eyebrow} · STARTER ACTIVITY</p><h1>{selectedSection.activity}.<br /><em>Make your first move.</em></h1><p className="intro-copy">{selectedSection.description} Choose a clue, test an idea, and carry the useful strategy forward.</p><button className="primary-action" onClick={() => startSection(selectedSection)}>Launch {selectedSection.activity}<ArrowRight size={17} /></button></div><div className="hero-still-life"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/drRvhWArUDELxFoI.jpg" alt="Tactile math tiles and a highlighted number line arranged on a learning desk" /><div className="hero-sticker"><Star size={13} fill="currentColor" /><span>MAKE<br />A MOVE</span></div></div></section><section className="signal-strip" aria-label="Today’s learning evidence"><div className="signal-cell streak-signal"><span className="signal-icon"><Sparkles size={18} /></span><div><b>{dailyStreak} days you returned</b><small>practice is becoming a habit you can trust</small></div></div><div className="signal-divider" /><div className="signal-cell"><span className="signal-icon yellow"><Gauge size={18} /></span><div><b>{activityProgress[selectedSection.id]}% explored here</b><small>in {selectedSection.title}</small></div></div><div className="signal-divider" /><div className="signal-cell"><span className="signal-icon blue"><Trophy size={18} /></span><div><b>{mastery}% across all sections</b><small>each round adds evidence to your workbench</small></div></div></section><section className="activities-section" id="activities"><div className="section-heading"><div><p className="section-kicker">READY WHEN YOU ARE</p><h2>{selectedSection.title} starter round.</h2></div><p>Select any course from the left menu to launch its tailored five-question activity.</p></div><div className="activity-deck section-deck"><article className={`activity-card ${selectedSection.color}`}><div className="activity-image-wrap"><img src={selectedSection.image} alt="" /></div><div className="activity-content"><p className="activity-eyebrow">{selectedSection.eyebrow}</p><h3>{selectedSection.activity}</h3><p>{selectedSection.description}</p><div className="card-bottom"><div className="progress-detail"><span>{activityProgress[selectedSection.id]}% of this section explored</span><div className="progress-track"><i style={{ width: `${activityProgress[selectedSection.id]}%` }} /></div></div><button onClick={() => startSection(selectedSection)} aria-label={`Launch ${selectedSection.activity}`}><ChevronRight size={19} /></button></div></div><span className="margin-note">{selectedSection.note}</span><span className="card-index">01</span></article><aside className="section-note"><p className="section-kicker">SECTION NOTE</p><h3>One short round. One usable idea.</h3><p>Each course button opens a distinct activity with questions designed for that level’s first mathematical moves.</p><span><BookOpen size={15} />Choose a course at any time</span></aside></div></section><footer className="dashboard-footer"><span>Learning happens one clear idea at a time.</span><span>Math Activity Hub · practice studio</span></footer></section>
  </main>;
}
