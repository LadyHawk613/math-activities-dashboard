/**
 * Tactile Number Studio — the Integrated Math 3 Workshop presents front-facing topic books on paper shelves.
 * Yellow marks indicate selection and thinking; empty activity lists clearly reserve space for future teacher-authored practice.
 */
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import MatchTheGraphActivity from "@/components/MatchTheGraphActivity";
import RailBrandHeader from "@/components/RailBrandHeader";

type WorkshopTopic = { title: string; code: string; color: "coral" | "blue" | "yellow" | "teal" };
type WorkshopShelf = { title: string; note: string; topics: WorkshopTopic[] };
type WorkshopActivity = { code: string; title: string; description: string; color: "coral" | "blue" | "yellow" | "teal" };

const workshopShelves: WorkshopShelf[] = [
  {
    title: "Functions & Patterns",
    note: "MODEL THE CHANGE",
    topics: [
      { title: "Polynomial Functions", code: "F.01", color: "coral" },
      { title: "Rational Functions", code: "F.02", color: "blue" },
      { title: "Exponential Functions", code: "F.03", color: "yellow" },
      { title: "Logarithmic Functions", code: "F.04", color: "teal" },
      { title: "Modeling with Functions", code: "F.05", color: "coral" },
      { title: "Sequences and Series", code: "F.06", color: "blue" },
    ],
  },
  {
    title: "Geometry & Trigonometry",
    note: "SEE THE STRUCTURE",
    topics: [
      { title: "Trigonometric Functions", code: "G.01", color: "yellow" },
      { title: "Conic Sections", code: "G.02", color: "teal" },
      { title: "Geometric Reasoning and Proof", code: "G.03", color: "coral" },
      { title: "Coordinate Geometry", code: "G.04", color: "blue" },
    ],
  },
  {
    title: "Algebra, Systems & Data",
    note: "TEST THE CLAIM",
    topics: [
      { title: "Complex Numbers", code: "A.01", color: "blue" },
      { title: "Equations and Inequalities", code: "A.02", color: "coral" },
      { title: "Systems of Equations and Inequalities", code: "A.03", color: "yellow" },
      { title: "Probability and Statistics", code: "A.04", color: "teal" },
    ],
  },
];

const polynomialActivities: WorkshopActivity[] = [
  { code: "P.01", title: "Polynomial Detective", description: "Notice degree, leading coefficient, and the clues that shape a polynomial’s graph.", color: "yellow" },
  { code: "P.02", title: "Operations Workshop", description: "Add, subtract, and multiply polynomial expressions with a clear structure.", color: "coral" },
  { code: "P.03", title: "Factor to Find Zeros", description: "Use factors to locate zeros and connect an equation to its x-intercepts.", color: "blue" },
  { code: "P.04", title: "Graph Stories", description: "Trace end behavior, turning points, and intercepts to sketch a graph that makes sense.", color: "teal" },
  { code: "P.05", title: "Solve Polynomial Equations", description: "Choose a useful solving strategy and check each solution in context.", color: "coral" },
  { code: "P.06", title: "Model With a Polynomial", description: "Build and interpret a polynomial model from a real-world situation.", color: "yellow" },
  { code: "P.07", title: "Match the Graph", description: "Match graph cards to their function family by noticing shape, symmetry, and behavior.", color: "blue" },
];

export default function Integrated3Workshop({ onBack }: { onBack: () => void }) {
  const [activeTopic, setActiveTopic] = useState<WorkshopTopic | null>(null);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);

  if (activeActivity === "match-the-graph") return <MatchTheGraphActivity onBack={() => setActiveActivity(null)} />;

  if (activeTopic) {
    return (
      <main className="studio-shell workshop-shell">
        <aside className="rail rail-session" aria-label="Integrated Math 3 Workshop navigation">
          <RailBrandHeader onClick={onBack} />
          <div className="rail-line" />
          <button className="rail-back" onClick={() => setActiveTopic(null)}><ArrowLeft size={18} /><span>Back to Workshop</span></button>
        </aside>
        <section className="topic-canvas">
          <header className="topic-head">
            <button className="eyebrow-back" onClick={() => setActiveTopic(null)}><ArrowLeft size={14} />Integrated Math 3 Workshop</button>
            <p className="section-kicker">TOPIC ACTIVITY LIST · {activeTopic.code}</p>
            <h1>{activeTopic.title}.</h1>
            <p className="topic-intro">{activeTopic.title === "Polynomial Functions" ? "Begin with these six activity outlines, then return to any idea that needs another look." : "This is your dedicated shelf for building confidence with this topic. Practice activities will gather here as you add them."}</p>
          </header>
          {activeTopic.title === "Polynomial Functions" ? (
            <section className="polynomial-list" aria-label="Polynomial Functions activity list">
              <div className="list-heading"><div><p className="section-kicker">YOUR FIRST ACTIVITY LIST</p><h2>Six ways in.</h2></div><p>Start with the first activity and move through the ideas in order, or return to any activity when you need another look.</p></div>
              <div className="activity-list-grid">
                {polynomialActivities.map((activity, index) => activity.code === "P.07" ? <button className={`workshop-activity launchable ${activity.color}`} key={activity.code} onClick={() => setActiveActivity("match-the-graph")}><span className="activity-code">{activity.code}</span><span className="activity-sequence">{String(index + 1).padStart(2, "0")}</span><h3>{activity.title}</h3><p>{activity.description}</p><span className="activity-note"><Sparkles size={14} />Launch activity <ArrowRight size={14} /></span></button> : <article className={`workshop-activity ${activity.color}`} key={activity.code}><span className="activity-code">{activity.code}</span><span className="activity-sequence">{String(index + 1).padStart(2, "0")}</span><h3>{activity.title}</h3><p>{activity.description}</p><span className="activity-note"><BookOpen size={14} />Activity outline ready</span></article>)}
              </div>
            </section>
          ) : <section className="activity-empty" aria-label={`${activeTopic.title} activity list`}> 
              <div className="empty-mark"><BookOpen size={25} /></div>
              <p className="section-kicker">YOUR ACTIVITY LIST</p>
              <h2>This shelf is being stocked.</h2>
              <p>There are no activities in <strong>{activeTopic.title}</strong> yet. When you create a practice activity, it will appear here for students to choose.</p>
              <button className="primary-action" onClick={() => setActiveTopic(null)}>Browse another topic <ArrowRight size={17} /></button>
            </section>}
        </section>
      </main>
    );
  }

  return (
    <main className="studio-shell workshop-shell">
      <aside className="rail rail-session" aria-label="Integrated Math 3 Workshop navigation">
        <RailBrandHeader onClick={onBack} />
        <div className="rail-line" />
        <button className="rail-back" onClick={onBack}><ArrowLeft size={18} /><span>Back to Math Hub</span></button>
      </aside>
      <section className="workshop-canvas">
        <header className="workshop-head">
          <div>
            <p className="section-kicker">INTEGRATED MATH 3 · WORKSHOP DIRECTORY</p>
            <h1 className="compact-workshop-title">Choose a topic. <em>Build your practice.</em></h1>
          </div>
          <div className="workshop-note"><span className="yellow-dot" /><p>Choose a topic, then choose the practice that helps the next idea click.</p></div>
        </header>
        <section className="workshop-shelves" aria-label="Integrated Math 3 topics">
          {workshopShelves.map((shelf, shelfIndex) => (
            <section className="topic-shelf" key={shelf.title}>
              <div className="shelf-heading"><div><p className="section-kicker">SHELF {String(shelfIndex + 1).padStart(2, "0")}</p><h2>{shelf.title}</h2></div><span>{shelf.note}</span></div>
              <div className="topic-book-row">
                {shelf.topics.map((topic, index) => (
                  <button className={`topic-book ${topic.color}`} key={topic.title} onClick={() => setActiveTopic(topic)}>
                    <span className="book-code">{topic.code}</span>
                    <strong>{topic.title}</strong>
                    <span className="book-open">Open shelf <ArrowRight size={14} /></span>
                    <i className="book-page-corner" aria-hidden="true" />
                    <b className="book-number">{String(index + 1).padStart(2, "0")}</b>
                  </button>
                ))}
              </div>
              <div className="shelf-plank" aria-hidden="true"><i /></div>
            </section>
          ))}
        </section>
        <footer className="workshop-footer"><span><BookOpen size={14} />Topics become activity lists as you add new practice.</span><button onClick={onBack}>Return to Math Activity Hub <ArrowLeft size={14} /></button></footer>
      </section>
    </main>
  );
}
