import { useState, useEffect, useRef } from "react";

const PHASES = [
  { id: 1, title: "Afbryd Loopet", weeks: "Uge 1–4", color: "#8B4513" },
  { id: 2, title: "Byg Nyt Fundament", weeks: "Uge 5–8", color: "#6B4423" },
  { id: 3, title: "Lev Det", weeks: "Uge 9–12", color: "#4A3728" },
];

const ESSENCES = {
  red: { name: "Rød", color: "#C04030", desc: "Styrke · Vitalitet · Kraft", body: "Maven, benene, hænderne" },
  white: { name: "Hvid", color: "#9BA8B7", desc: "Vilje · Klarhed · Sandhed", body: "Rygraden, hovedet" },
  gold: { name: "Guld", color: "#C8A84E", desc: "Iboende Værdi · Varme", body: "Brystet, solar plexus" },
  green: { name: "Grøn", color: "#5C8A5C", desc: "Loving Kindness · Venlighed", body: "Hjertet, hænderne" },
  pearl: { name: "Pearl", color: "#D4C5B0", desc: "Personlig Essens · Hjem", body: "Solar plexus, brystet" },
};

const MORNING = {
  1: {
    title: "The Formula / Breaking the Habit",
    duration: "25–45 min",
    steps: [
      "The Formula-meditation (dag 1–12) eller Breaking the Habit-meditation (dag 13–28)",
      "Intention: Invitér rød essens (uge 1) → hvid essens (uge 2) → guld essens (uge 3–4)",
      "Mærk den kemiske tilstand UDEN at handle på den",
      "I the quantum field / hullet: bliv. Invitér den nye kropslige oplevelse",
    ],
    essence: "red",
  },
  2: {
    title: "Heart Coherence + Essensinvitation",
    duration: "25 min",
    steps: [
      "Dispenza heart coherence-meditation som base",
      "Rød essens (man/ons/fre): Mærk ned i maven og benene. Varme, vital kraft. Dan tien.",
      "Hvid essens (tir/tor): Op langs rygraden. Klar, kølig, skarp. Vilje til sandhed.",
      "Brug qi gong-sansningen — mærk forskel på forestilling og reel energetisk bevægelse",
    ],
    essence: "white",
  },
  3: {
    title: "Den Nye Identitet",
    duration: "30 min",
    steps: [
      "Mærk dig selv som en person med fuld kontakt med styrke og vilje",
      "Felt-oplevelse: Hvordan sidder du? Hvordan ånder du? Hvad er din holdning til verden?",
      "Mærk at præstation fra overflod IKKE fjerner dig fra dig selv",
      "Du kan være succesfuld og dyb på samme tid",
    ],
    essence: "gold",
  },
};

const EVENING = {
  1: {
    title: "Projektionslog + Inquiry",
    duration: "10–15 min",
    steps: [
      "Hvornår projicerede jeg i dag? Ikke kun i relationer — også i verden",
      "For hver projektion: Hvad søgte jeg? Vilje (hvid)? Styrke (rød)? Værdi (guld)?",
      "Trigger-log: Hvad skete? Hvad sagde den indre stemme? Hvad følte kroppen?",
    ],
  },
  2: {
    title: "Inquiry — Succesangsten",
    duration: "15 min",
    steps: [
      "Hvad sker i min krop når jeg forestiller mig at lykkes?",
      "Mærk: tændingen (trevingen) OG sammentrækningen (barnet der frygter)",
      "Gå til barnet: Hvad havde det brug for at høre?",
      "Skab den nye overbevisning kropsligt — præstation OG autenticitet",
    ],
  },
  3: {
    title: "Integrationsjournal",
    duration: "10 min",
    steps: [
      "Hvornår mærkede jeg rød essens i dag?",
      "Hvornår mærkede jeg hvid essens i dag?",
      "Hvornår mistede jeg kontakten — og hvad bragte mig tilbage?",
    ],
  },
};

const CHILD_PRACTICE = {
  title: "Essens-børnetid",
  duration: "10–15 min",
  steps: [
    "Vær fuldt til stede med dit barn — uden telefon, uden agenda",
    "Mærk: Hvad udstråler barnet? Guld (værdi)? Grøn (venlighed)?",
    "Mærk hvad det gør i DIN krop. Åbner hjertet sig? Eller kommer sorg?",
    "Kan du lade barnets guld minde dig om DIT guld — uden at tage det fra barnet?",
    "Dit barn er ikke din terapeut. Hold skellet klart.",
  ],
};

const RELATION = {
  1: "Stop med at oversætte for ham. Hvad SKER der? Ikke hvad det betyder.",
  2: "Formulér ét konkret behov. Klart. Uden drama. Hold det.",
  3: "Kærlighed uden kemisk afhængighed. Kan du elske i stilheden?",
};

const SHADOW_CHECKS = [
  "Bruger jeg 'alt er som det skal være' som skjold mod at mærke smerte?",
  "Pakker jeg min tilbagetrækning ind i spirituelt sprog?",
  "Oversætter jeg hans intentioner til handling — i mit eget hoved?",
  "Gør jeg mit barn til et nyt essentielt objekt?",
  "Er The Formula en port til forandring — eller en flugt ind i det sublime?",
  "Fravær af tilvalg ER fravalg.",
];

const SIGNS = [
  "Du mærker projektionen FØR den lander",
  "Kedsomheden får rum — det føles som åbenhed",
  "Du gør noget synligt i verden der skræmmer dig",
  "Dit nej føles kropsligt som klarhed",
  "Du kan elske i stilheden uden kemisk rush",
  "Du finder guld i dig selv — ikke kun i barnet",
  "Du kan se relationen klart: kærlighed OG sandhed",
];

function EssenceDot({ type, size = 10 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: ESSENCES[type]?.color || "#999",
        marginRight: 6,
        verticalAlign: "middle",
        boxShadow: `0 0 ${size/2}px ${ESSENCES[type]?.color || "#999"}40`,
      }}
    />
  );
}

function BreathCircle() {
  const [phase, setPhase] = useState("ind");
  const [scale, setScale] = useState(1);
  const intervalRef = useRef(null);
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step <= 40) {
        setPhase("ind");
        setScale(1 + (step / 40) * 0.5);
      } else if (step <= 60) {
        setPhase("hold");
      } else if (step <= 100) {
        setPhase("ud");
        setScale(1.5 - ((step - 60) / 40) * 0.5);
      } else {
        step = 0;
        setCount(c => c + 1);
      }
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div
        onClick={() => setActive(!active)}
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, #D4C5B044, #C8A84E22)`,
          border: "2px solid #C8A84E44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          transform: `scale(${scale})`,
          transition: "transform 0.1s linear",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 13, color: "#8B6F5E", fontFamily: "Georgia, serif" }}>
          {!active ? "start" : phase}
        </span>
      </div>
      {active && (
        <p style={{ fontSize: 12, color: "#8B6F5E", marginTop: 16, fontFamily: "Georgia, serif" }}>
          {count} vejrtrækninger · tryk for at stoppe
        </p>
      )}
    </div>
  );
}

export default function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [view, setView] = useState("today");
  const [completedSteps, setCompletedSteps] = useState({});
  const [journalText, setJournalText] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [essenceToday, setEssenceToday] = useState(null);
  const [shadowIdx, setShadowIdx] = useState(0);
  const [showSigns, setShowSigns] = useState(false);

  const today = new Date().toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" });
  const morning = MORNING[currentPhase];
  const evening = EVENING[currentPhase];
  const relation = RELATION[currentPhase];

  const toggleStep = (section, idx) => {
    const key = `${section}-${idx}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveJournal = () => {
    if (!journalText.trim()) return;
    setJournalEntries(prev => [
      { text: journalText, date: new Date().toLocaleDateString("da-DK"), essence: essenceToday },
      ...prev,
    ]);
    setJournalText("");
    setEssenceToday(null);
  };

  const navItems = [
    { id: "today", label: "I dag" },
    { id: "child", label: "Barn" },
    { id: "breathe", label: "Ånd" },
    { id: "journal", label: "Journal" },
    { id: "shadow", label: "Skygge" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #FAF6F0 0%, #F0E8DD 40%, #E8DFD3 100%)",
      fontFamily: "'Georgia', 'Garamond', serif",
      color: "#3C2415",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{
        padding: "28px 20px 16px",
        borderBottom: "1px solid #D4C5B044",
      }}>
        <h1 style={{
          fontSize: 20,
          fontWeight: "normal",
          letterSpacing: "0.08em",
          margin: 0,
          color: "#5C3D2E",
        }}>
          ◇ DAGLIG PRAKSIS
        </h1>
        <p style={{ fontSize: 12, color: "#8B6F5E", margin: "4px 0 0", letterSpacing: "0.04em" }}>
          {today}
        </p>
      </div>

      {/* Phase Selector */}
      <div style={{ display: "flex", gap: 6, padding: "12px 20px" }}>
        {PHASES.map(ph => (
          <button
            key={ph.id}
            onClick={() => setCurrentPhase(ph.id)}
            style={{
              flex: 1,
              padding: "8px 4px",
              background: currentPhase === ph.id ? ph.color : "transparent",
              color: currentPhase === ph.id ? "#FAF6F0" : "#8B6F5E",
              border: `1px solid ${currentPhase === ph.id ? ph.color : "#C4B5A4"}`,
              borderRadius: 4,
              fontSize: 11,
              fontFamily: "Georgia, serif",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{ph.title}</div>
            <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{ph.weeks}</div>
          </button>
        ))}
      </div>

      {/* Nav */}
      <div style={{
        display: "flex",
        gap: 0,
        padding: "0 20px",
        borderBottom: "1px solid #D4C5B044",
      }}>
        {navItems.map(n => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            style={{
              flex: 1,
              padding: "10px 4px",
              background: "transparent",
              border: "none",
              borderBottom: view === n.id ? "2px solid #5C3D2E" : "2px solid transparent",
              color: view === n.id ? "#3C2415" : "#8B6F5E",
              fontSize: 12,
              fontFamily: "Georgia, serif",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 100px" }}>

        {/* === TODAY VIEW === */}
        {view === "today" && (
          <div>
            {/* Morning */}
            <div style={{
              background: "#FDFAF7",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 14, margin: 0, color: "#5C3D2E" }}>
                  ☀ Morgen
                </h2>
                <span style={{ fontSize: 11, color: "#8B6F5E" }}>{morning.duration}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: "bold", margin: "0 0 8px", color: "#3C2415" }}>
                <EssenceDot type={morning.essence} /> {morning.title}
              </p>
              {morning.steps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => toggleStep("morning", i)}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "6px 0",
                    cursor: "pointer",
                    opacity: completedSteps[`morning-${i}`] ? 0.5 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>
                    {completedSteps[`morning-${i}`] ? "◆" : "◇"}
                  </span>
                  <span style={{
                    fontSize: 12,
                    lineHeight: "18px",
                    color: "#5C3D2E",
                    textDecoration: completedSteps[`morning-${i}`] ? "line-through" : "none",
                  }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Child time - compact */}
            <div style={{
              background: `linear-gradient(135deg, ${ESSENCES.gold.color}08, ${ESSENCES.green.color}08)`,
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}>
              <h2 style={{ fontSize: 14, margin: "0 0 6px", color: "#5C3D2E" }}>
                <EssenceDot type="gold" /><EssenceDot type="green" /> Essens-børnetid
              </h2>
              <p style={{ fontSize: 12, color: "#8B6F5E", margin: 0 }}>
                10–15 min fuldt nærvær. Mærk guld og grøn. Lad barnet inspirere — uden at bære din healing.
              </p>
            </div>

            {/* Evening */}
            <div style={{
              background: "#F5F0EA",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 14, margin: 0, color: "#5C3D2E" }}>
                  ☽ Aften
                </h2>
                <span style={{ fontSize: 11, color: "#8B6F5E" }}>{evening.duration}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: "bold", margin: "0 0 8px", color: "#3C2415" }}>
                {evening.title}
              </p>
              {evening.steps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => toggleStep("evening", i)}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "6px 0",
                    cursor: "pointer",
                    opacity: completedSteps[`evening-${i}`] ? 0.5 : 1,
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>
                    {completedSteps[`evening-${i}`] ? "◆" : "◇"}
                  </span>
                  <span style={{
                    fontSize: 12,
                    lineHeight: "18px",
                    color: "#5C3D2E",
                    textDecoration: completedSteps[`evening-${i}`] ? "line-through" : "none",
                  }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Relation */}
            <div style={{
              background: "transparent",
              border: "1px solid #C04030",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}>
              <h2 style={{ fontSize: 14, margin: "0 0 6px", color: "#C04030" }}>
                ◇ Relationspraksis
              </h2>
              <p style={{ fontSize: 12, color: "#5C3D2E", margin: 0, lineHeight: "18px" }}>
                {relation}
              </p>
            </div>

            {/* Essence bar */}
            <div style={{
              display: "flex",
              gap: 8,
              padding: "8px 0",
            }}>
              {Object.entries(ESSENCES).map(([key, e]) => (
                <div key={key} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 2,
                    background: e.color,
                    opacity: 0.3,
                    marginBottom: 4,
                  }} />
                  <span style={{ fontSize: 9, color: "#8B6F5E" }}>{e.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === CHILD VIEW === */}
        {view === "child" && (
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${ESSENCES.gold.color}12, ${ESSENCES.green.color}12)`,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}>
              <h2 style={{ fontSize: 18, margin: "0 0 12px", color: "#5C3D2E", fontWeight: "normal" }}>
                Dit barn som lærer
              </h2>
              <p style={{ fontSize: 13, color: "#5C3D2E", lineHeight: "20px", margin: "0 0 16px" }}>
                Dit 1-årige barn stråler af guld og grøn essens — iboende værdi og kærlig venlighed.
                Det er de kvaliteter du hungrer efter. Lad barnet inspirere dig til at finde dem i dig selv.
              </p>

              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{
                  flex: 1,
                  background: "#FDFAF7",
                  borderRadius: 8,
                  padding: 12,
                  borderLeft: `3px solid ${ESSENCES.gold.color}`,
                }}>
                  <p style={{ fontSize: 12, fontWeight: "bold", margin: "0 0 4px", color: ESSENCES.gold.color }}>
                    Guld Essens
                  </p>
                  <p style={{ fontSize: 11, margin: 0, color: "#5C3D2E", lineHeight: "16px" }}>
                    Værdifuld bare ved at eksistere. Ingen betingelser. Dit barn har ikke gjort noget for at fortjene sin plads.
                  </p>
                </div>
                <div style={{
                  flex: 1,
                  background: "#FDFAF7",
                  borderRadius: 8,
                  padding: 12,
                  borderLeft: `3px solid ${ESSENCES.green.color}`,
                }}>
                  <p style={{ fontSize: 12, fontWeight: "bold", margin: "0 0 4px", color: ESSENCES.green.color }}>
                    Grøn Essens
                  </p>
                  <p style={{ fontSize: 11, margin: 0, color: "#5C3D2E", lineHeight: "16px" }}>
                    Stille, varm kærlighed. Uden intensitet. Den kærlighed du keder dig i — og har brug for at lære.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: "#FDFAF7",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}>
              <h3 style={{ fontSize: 14, margin: "0 0 10px", color: "#5C3D2E" }}>◇ Daglig praksis</h3>
              {CHILD_PRACTICE.steps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => toggleStep("child", i)}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "6px 0",
                    cursor: "pointer",
                    opacity: completedSteps[`child-${i}`] ? 0.5 : 1,
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>
                    {completedSteps[`child-${i}`] ? "◆" : "◇"}
                  </span>
                  <span style={{
                    fontSize: 12,
                    lineHeight: "18px",
                    color: "#5C3D2E",
                    textDecoration: completedSteps[`child-${i}`] ? "line-through" : "none",
                  }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              background: "#C0403010",
              border: "1px solid #C0403030",
              borderRadius: 8,
              padding: 14,
              fontSize: 12,
              color: "#5C3D2E",
              lineHeight: "18px",
            }}>
              <strong>Opmærksomhed:</strong> Projicerer du din længsel efter guld og grøn essens ud på barnet,
              ligesom du projicerer rød og hvid essens ud på partnere? Dit barn kan inspirere dig — men det
              kan ikke hele dig. Det må aldrig bære den opgave.
            </div>
          </div>
        )}

        {/* === BREATHE VIEW === */}
        {view === "breathe" && (
          <div>
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <h2 style={{ fontSize: 18, fontWeight: "normal", color: "#5C3D2E", margin: "0 0 8px" }}>
                Mave-kontakt
              </h2>
              <p style={{ fontSize: 12, color: "#8B6F5E", margin: "0 0 20px", lineHeight: "18px" }}>
                Læg en hånd på maven under navlen. Træk vejret ned i hånden.
                Lad opmærksomheden synke ned — fra hoved, forbi hjerte, ned i maven.
              </p>
            </div>

            <BreathCircle />

            <div style={{
              marginTop: 24,
              background: "#FDFAF7",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: 16,
            }}>
              <h3 style={{ fontSize: 13, margin: "0 0 12px", color: "#5C3D2E" }}>Essenserne i kroppen</h3>
              {Object.entries(ESSENCES).map(([key, e]) => (
                <div key={key} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: "1px solid #E8DFD320",
                }}>
                  <EssenceDot type={key} size={14} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: "bold", color: e.color }}>{e.name}</span>
                    <span style={{ fontSize: 11, color: "#8B6F5E", marginLeft: 8 }}>{e.desc}</span>
                    <br />
                    <span style={{ fontSize: 10, color: "#8B6F5E", fontStyle: "italic" }}>{e.body}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16,
              padding: 14,
              background: "#F5F0EA",
              borderRadius: 8,
              fontSize: 12,
              color: "#5C3D2E",
              lineHeight: "18px",
              textAlign: "center",
              fontStyle: "italic",
            }}>
              "Fravær af tilvalg ER fravalg."
              <br />— din egen hvide essens
            </div>
          </div>
        )}

        {/* === JOURNAL VIEW === */}
        {view === "journal" && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: "normal", color: "#5C3D2E", margin: "8px 0 16px" }}>
              Inquiry Journal
            </h2>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: "#8B6F5E", margin: "0 0 8px" }}>
                Hvilken essens mærkede du i dag?
              </p>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {Object.entries(ESSENCES).map(([key, e]) => (
                  <button
                    key={key}
                    onClick={() => setEssenceToday(key)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      background: essenceToday === key ? e.color + "20" : "transparent",
                      border: `1px solid ${essenceToday === key ? e.color : "#D4C5B0"}`,
                      borderRadius: 4,
                      fontSize: 10,
                      color: essenceToday === key ? e.color : "#8B6F5E",
                      fontFamily: "Georgia, serif",
                      cursor: "pointer",
                    }}
                  >
                    {e.name}
                  </button>
                ))}
              </div>

              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Hvad mærkede du? Hvad overraskede dig? Hvad var kvaliteten af det du fandt?"
                style={{
                  width: "100%",
                  minHeight: 120,
                  padding: 12,
                  border: "1px solid #D4C5B0",
                  borderRadius: 8,
                  background: "#FDFAF7",
                  fontFamily: "Georgia, serif",
                  fontSize: 13,
                  color: "#3C2415",
                  resize: "vertical",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <button
                onClick={saveJournal}
                disabled={!journalText.trim()}
                style={{
                  marginTop: 8,
                  padding: "10px 20px",
                  background: journalText.trim() ? "#5C3D2E" : "#D4C5B0",
                  color: "#FAF6F0",
                  border: "none",
                  borderRadius: 4,
                  fontFamily: "Georgia, serif",
                  fontSize: 13,
                  cursor: journalText.trim() ? "pointer" : "default",
                  width: "100%",
                }}
              >
                Gem
              </button>
            </div>

            {journalEntries.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 13, color: "#8B6F5E", margin: "0 0 12px" }}>Tidligere</h3>
                {journalEntries.map((entry, i) => (
                  <div key={i} style={{
                    background: "#FDFAF7",
                    border: "1px solid #E8DFD3",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#8B6F5E" }}>{entry.date}</span>
                      {entry.essence && <EssenceDot type={entry.essence} size={8} />}
                    </div>
                    <p style={{ fontSize: 12, color: "#5C3D2E", margin: 0, lineHeight: "18px" }}>
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === SHADOW VIEW === */}
        {view === "shadow" && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: "normal", color: "#5C3D2E", margin: "8px 0 16px" }}>
              Skygge & Fælder
            </h2>

            <div style={{
              background: "#FDFAF7",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: 20,
              marginBottom: 16,
              textAlign: "center",
            }}>
              <p style={{
                fontSize: 14,
                color: "#3C2415",
                lineHeight: "22px",
                margin: "0 0 16px",
                fontStyle: "italic",
              }}>
                "{SHADOW_CHECKS[shadowIdx]}"
              </p>
              <button
                onClick={() => setShadowIdx((shadowIdx + 1) % SHADOW_CHECKS.length)}
                style={{
                  padding: "8px 20px",
                  background: "transparent",
                  border: "1px solid #8B6F5E",
                  borderRadius: 4,
                  fontFamily: "Georgia, serif",
                  fontSize: 12,
                  color: "#8B6F5E",
                  cursor: "pointer",
                }}
              >
                Næste spørgsmål
              </button>
            </div>

            <button
              onClick={() => setShowSigns(!showSigns)}
              style={{
                width: "100%",
                padding: "14px",
                background: showSigns ? "#5C3D2E" : "transparent",
                color: showSigns ? "#FAF6F0" : "#5C3D2E",
                border: `1px solid #5C3D2E`,
                borderRadius: 8,
                fontFamily: "Georgia, serif",
                fontSize: 13,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              {showSigns ? "Skjul tegn på bevægelse" : "◇ Tegn på bevægelse"}
            </button>

            {showSigns && (
              <div style={{
                background: "#FDFAF7",
                border: "1px solid #E8DFD3",
                borderRadius: 8,
                padding: 16,
              }}>
                {SIGNS.map((sign, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: 8,
                    padding: "8px 0",
                    borderBottom: i < SIGNS.length - 1 ? "1px solid #E8DFD320" : "none",
                  }}>
                    <span style={{ fontSize: 12, color: "#C8A84E", flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: 12, color: "#5C3D2E", lineHeight: "18px" }}>{sign}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              marginTop: 20,
              padding: 16,
              background: "#F5F0EA",
              borderRadius: 8,
              textAlign: "center",
            }}>
              <p style={{ fontSize: 12, color: "#5C3D2E", margin: 0, lineHeight: "20px", fontStyle: "italic" }}>
                Du har værktøjerne. Du har kroppen, sansningen, årene med praksis — og et barn
                der viser dig vej til de essenser du hungrer efter. Lad det ændre sig med dig.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
