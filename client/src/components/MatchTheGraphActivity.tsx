/**
 * Tactile Number Studio — a warm, paper-based graph matching activity adapted from the user-provided game logic.
 * Students match graph cards to function-family trays through drag-and-drop or click-and-place interaction.
 */
import { ArrowLeft, Check, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type FamilyId = "linear" | "quadratic" | "absolute" | "squareroot" | "exponential" | "cubic" | "cuberoot" | "logarithmic" | "rational-odd" | "rational-even";
type Family = { id: FamilyId; name: string; fn: (x: number) => number };

const roundOne: Family[] = [
  { id: "linear", name: "Linear", fn: (x) => x },
  { id: "quadratic", name: "Quadratic", fn: (x) => x * x },
  { id: "absolute", name: "Absolute Value", fn: (x) => Math.abs(x) },
  { id: "squareroot", name: "Square Root", fn: (x) => (x >= 0 ? Math.sqrt(x) : Number.NaN) },
  { id: "exponential", name: "Exponential", fn: (x) => Math.pow(2, x) },
];
const roundTwo: Family[] = [
  { id: "cubic", name: "Cubic", fn: (x) => x * x * x },
  { id: "cuberoot", name: "Cube Root", fn: (x) => Math.cbrt(x) },
  { id: "logarithmic", name: "Logarithmic", fn: (x) => (x > 0 ? Math.log2(x) : Number.NaN) },
  { id: "rational-odd", name: "Rational (Odd)", fn: (x) => (x !== 0 ? 1 / x : Number.NaN) },
  { id: "rational-even", name: "Rational (Even)", fn: (x) => (x !== 0 ? 1 / (x * x) : Number.NaN) },
];
const rounds = [roundOne, roundTwo, [...roundOne, ...roundTwo]];
const roundNames = ["Round 1", "Round 2", "Challenge · all 10"];

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function GraphPreview({ family }: { family: Family }) {
  const paths = useMemo(() => {
    const width = 100;
    const height = 66;
    const min = -6;
    const max = 6;
    const samples = 90;
    const toX = (x: number) => ((x - min) / (max - min)) * width;
    const toY = (y: number) => height / 2 - (y / max) * (height / 2 - 4);
    const segments: [number, number][][] = [];
    let segment: [number, number][] = [];
    for (let index = 0; index <= samples; index += 1) {
      const x = min + (index / samples) * (max - min);
      const y = family.fn(x);
      if (!Number.isFinite(y) || y < min || y > max) {
        if (segment.length > 1) segments.push(segment);
        segment = [];
      } else {
        segment.push([toX(x), toY(y)]);
      }
    }
    if (segment.length > 1) segments.push(segment);
    return segments.map((points) => points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" "));
  }, [family]);

  return <svg viewBox="0 0 100 66" role="img" aria-label={`${family.name} graph`}><rect width="100" height="66" fill="#fffdf7" /><line x1="0" y1="33" x2="100" y2="33" stroke="#c8c8c2" strokeWidth="1" /><line x1="50" y1="0" x2="50" y2="66" stroke="#c8c8c2" strokeWidth="1" />{paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#17304f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />)}</svg>;
}

export default function MatchTheGraphActivity({ onBack }: { onBack: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [cardOrder, setCardOrder] = useState<FamilyId[]>(() => shuffle(rounds[0].map((family) => family.id)));
  const [placements, setPlacements] = useState<Partial<Record<FamilyId, FamilyId>>>({});
  const [selectedCard, setSelectedCard] = useState<FamilyId | null>(null);
  const [lockedTargets, setLockedTargets] = useState<Set<FamilyId>>(new Set());
  const [status, setStatus] = useState<{ kind: "" | "correct" | "incorrect"; text: string }>({ kind: "", text: "" });
  const [hintOpen, setHintOpen] = useState(false);
  const families = rounds[roundIndex];
  const familyById = useMemo(() => new Map(families.map((family) => [family.id, family])), [families]);
  const placedIds = new Set(Object.values(placements));

  function resetActivity(nextRound = roundIndex) {
    setCardOrder(shuffle(rounds[nextRound].map((family) => family.id)));
    setPlacements({});
    setSelectedCard(null);
    setLockedTargets(new Set());
    setStatus({ kind: "", text: "" });
    setHintOpen(false);
  }

  function switchRound(index: number) {
    setRoundIndex(index);
    resetActivity(index);
  }

  function placeCard(cardId: FamilyId, targetId: FamilyId) {
    if (lockedTargets.has(targetId)) return;
    setPlacements((current) => {
      const next = { ...current };
      Object.entries(next).forEach(([target, placed]) => { if (placed === cardId) delete next[target as FamilyId]; });
      next[targetId] = cardId;
      return next;
    });
    setSelectedCard(null);
    setStatus({ kind: "", text: "" });
  }

  function returnCardToBank(targetId: FamilyId) {
    if (lockedTargets.has(targetId)) return;
    setPlacements((current) => {
      const next = { ...current };
      delete next[targetId];
      return next;
    });
    setStatus({ kind: "", text: "" });
  }

  function checkAnswers() {
    const allFilled = families.every((family) => placements[family.id]);
    if (!allFilled) {
      setStatus({ kind: "incorrect", text: "Place a graph in every family tray before checking." });
      return;
    }
    const correctTargets = new Set<FamilyId>();
    families.forEach((family) => { if (placements[family.id] === family.id) correctTargets.add(family.id); });
    setLockedTargets(correctTargets);
    setStatus(correctTargets.size === families.length ? { kind: "correct", text: `Correct — all ${families.length} graph cards matched.` } : { kind: "incorrect", text: `${correctTargets.size} / ${families.length} correct. Matched cards are locked; adjust the rest.` });
  }

  return <main className="studio-shell match-shell"><aside className="rail rail-session" aria-label="Match the Graph navigation"><button className="brand-mark" onClick={onBack} aria-label="Return to Polynomial Functions"><Sparkles size={23} /></button><div className="rail-line" /><button className="rail-back" onClick={onBack}><ArrowLeft size={18} /><span>Back to Polynomial Functions</span></button></aside><section className="match-canvas"><header className="match-head"><button className="eyebrow-back" onClick={onBack}><ArrowLeft size={14} />Polynomial Functions</button><p className="section-kicker">FUNCTION RECOGNITION · PLAYABLE ACTIVITY</p><h1>Match the graph.</h1><p>Place each graph card below the function family it belongs to. Drag a card, or select it and then choose a tray.</p></header><div className="match-controls"><div className="round-tabs" role="tablist" aria-label="Activity rounds">{roundNames.map((name, index) => <button key={name} className={roundIndex === index ? "active" : ""} onClick={() => switchRound(index)} role="tab" aria-selected={roundIndex === index}>{name}</button>)}</div><div className="match-actions"><button className="graph-check" onClick={checkAnswers}><Check size={16} />Check answer</button><button onClick={() => resetActivity()}><RotateCcw size={15} />Reset</button><button onClick={() => setHintOpen((open) => !open)}><Lightbulb size={15} />{hintOpen ? "Hide hint" : "Show hint"}</button></div></div>{hintOpen && <aside className="graph-hint"><Lightbulb size={17} /><p><strong>Look for a tell:</strong> think about end behavior, symmetry, and domain restrictions. A U-shape, a curve that levels off, or two separate branches each point to a different family.</p></aside>}<p className={`graph-status ${status.kind}`} aria-live="polite">{status.text}</p><section className={`graph-trays round-${roundIndex}`} aria-label="Function family trays">{families.map((family) => { const placedId = placements[family.id]; const placedFamily = placedId ? familyById.get(placedId) : null; const isLocked = lockedTargets.has(family.id); return <div className={`graph-tray ${isLocked ? "locked" : ""}`} key={family.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const id = event.dataTransfer.getData("text/plain") as FamilyId; if (familyById.has(id)) placeCard(id, family.id); }}><h2>{family.name}</h2><button className="graph-dropzone" onClick={() => { if (selectedCard) placeCard(selectedCard, family.id); else if (placedId) returnCardToBank(family.id); }} disabled={isLocked} aria-label={`${placedId ? "Return the placed graph from" : "Place a graph in"} the ${family.name} tray`}>{placedFamily ? <GraphPreview family={placedFamily} /> : <span>{selectedCard ? "Place selected card" : "Drop graph here"}</span>}</button></div>; })}</section><section className="graph-bank"><div className="bank-heading"><p className="section-kicker">GRAPH CARD BANK</p><span>{cardOrder.filter((id) => !placedIds.has(id)).length} cards remaining</span></div><div className="graph-cards">{cardOrder.filter((id) => !placedIds.has(id)).map((id) => { const family = familyById.get(id); if (!family) return null; return <button key={id} className={`graph-card ${selectedCard === id ? "selected" : ""}`} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", id)} onClick={() => setSelectedCard((current) => current === id ? null : id)} aria-pressed={selectedCard === id}><GraphPreview family={family} /></button>; })}</div></section></section></main>;
}
