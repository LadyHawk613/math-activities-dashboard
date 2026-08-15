# Math Activity Hub — Design Direction

## Three visual approaches considered

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| Tactile Number Studio | A bright, hands-on learning space inspired by paper manipulatives, cut-card shapes, and a field notebook. It should make practice feel like experimentation rather than a test. | 0.04 |
| Cosmic Operations Lab | A nocturnal science-lab world where missions, planets, and glowing coordinates frame each activity as an expedition. | 0.07 |
| Quiet Scholarly Arcade | A restrained editorial interface that pairs a school workbook’s clarity with selective arcade-style reward moments. | 0.02 |

## Chosen approach — Tactile Number Studio

### Design Movement

**Contemporary educational editorial design** blended with the tactile optimism of paper craft and classroom manipulatives. The interface should look collected, arranged, and marked up by a thoughtful instructor—not generated from a generic dashboard template.

### Core Principles

1. **Make thinking visible.** Activities foreground the problem, the learner’s current choice, and usable feedback rather than decorative status widgets.
2. **Lead with approachable rigor.** The visual language is playful without becoming childish, allowing learners around ages 8–12 to feel capable and independent.
3. **Use intentional asymmetry.** A narrow notebook-like rail, offset cards, and generous margins create a guided learning flow rather than a centered marketing layout.
4. **Reward progress with evidence.** Streaks, mastery, and completion are presented as understandable signals, not inflated gamification.

### Color Philosophy

The foundation is **warm paper** rather than clinical white, which makes numbers and handwritten-style details feel less intimidating. Deep ink blue establishes calm concentration and visual authority. Persimmon orange identifies actions and moments of momentum, while the brand’s ownable signature **Numberline Yellow** marks active thinking, selection, and progress. Small teal accents add freshness but never compete with the activity prompt.

### Layout Paradigm

The desktop experience is a **learning workbench**: a slim, textured navigation rail stays at the left, while a broad activity canvas moves horizontally through the learner’s day. The home view opens with an offset briefing panel and a cluster of subject cards that overlap subtly like organized cards on a desk. On mobile, the rail becomes a compact top bar and activities become a single, deliberately paced vertical path.

### Signature Elements

1. **Numberline Yellow highlighter strokes** appear behind a selected answer, under a live stat, and beside section labels.
2. **A red-orange compass/star glyph** anchors the identity and reappears as a progress marker.
3. **Tactile task cards** use thin ink outlines, shallow offset shadows, small clipped corners, and gentle paper-like texture.

### Interaction Philosophy

Every interaction should provide an immediate, understandable response. Answer choices press in slightly, the active response gains a highlighter layer, and correct answers receive a concise celebratory pulse with a clear explanation. Learning controls are always visible; no interaction should depend on hidden gestures or ambiguous icons.

### Animation

Motion is brief and purposeful. Cards rise by 2–4 pixels on hover and compress to 97% on press. The first visit reveals the rail, briefing, and activity cards in a 40–70 ms stagger, using a snappy custom ease-out; this entrance is disabled for reduced-motion preferences. Correct-answer feedback uses a 220 ms scale-and-fade accent rather than confetti. Incorrect answers do not shake aggressively; they gently surface a hint with a warm color transition.

### Typography System

**Fraunces** is the editorial display face for page titles, key numerals, and celebration moments. **DM Sans** carries activity instructions, labels, and controls for high legibility. Display headlines have generous tracking and compact line-height; supporting labels use uppercase DM Sans with moderate letter spacing. No body copy is set in a novelty or handwriting font, preserving accessibility and fast scanning.

### Brand Essence

**Math Activity Hub turns daily practice into clear, tactile progress for curious upper-elementary learners.**

Personality: **encouraging, ingenious, grounded**.

### Brand Voice

The voice is confident, direct, and encouraging. Headlines name the learning moment; CTAs invite a small, specific next action. It avoids cheerleading filler and vague claims.

Example lines:

> “Find the pattern. Then make it yours.”

> “One quick round, one clearer idea.”

### Wordmark & Logo

The mark is a **four-point compass/star constructed from a plus sign and numberline ticks**, rendered in persimmon orange on a transparent background. It implies direction, a coordinate plane, and a learner’s “aha” moment. The wordmark pairs the mark with a custom-styled Fraunces title, using an offset yellow underline instead of a generic type treatment.

### Signature Brand Color

**Numberline Yellow — `#FFD84D`**. It is used sparingly but consistently to signify active thinking and progress.

### First-release scope

The initial release will be a responsive, frontend-only learning workspace with a daily dashboard, addition/subtraction, multiplication, and pattern activities, a five-question activity session with instant feedback, an adaptive difficulty indicator, and browser-local progress. The product will not ask learners for personal information or require accounts in the first release.

## Style Decisions

- **Numberline Yellow** is reserved for active thinking and progress evidence: highlighter strokes, numberline ticks, selected answers, and underlines, rather than general decoration.
- Every major view should include a workbench gesture, such as an offset paper card, notebook margin, clipped detail, layered manipulative, or a numberline annotation.
- Progress copy must sound like a direct instructor observation of learning evidence, replacing generic metrics and vague motivation.
