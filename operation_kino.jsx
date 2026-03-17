import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&family=Oswald:wght@300;400;600;700&display=swap');`;

const STYLE = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --parchment: #f0e6c8;
    --parchment-dark: #d9c9a0;
    --ink: #1a1208;
    --red: #8b1a1a;
    --red-bright: #c0392b;
    --gold: #b8860b;
    --gold-light: #d4a017;
    --green: #2d5a27;
    --olive: #6b6b2a;
    --stamp-red: rgba(139,26,26,0.85);
  }

  body {
    background: #0e0c08;
    font-family: 'Courier Prime', monospace;
    color: var(--ink);
    min-height: 100vh;
  }

  .scanline-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
    animation: scanFlicker 8s infinite;
  }
  @keyframes scanFlicker {
    0%,100%{opacity:1} 50%{opacity:0.97} 51%{opacity:0.93} 52%{opacity:0.97}
  }

  .app-bg {
    min-height: 100vh;
    background: radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0e0c08 70%);
    padding: 0 0 60px 0;
  }

  /* HEADER */
  .header {
    text-align: center;
    padding: 40px 20px 10px;
    position: relative;
  }
  .header-sub {
    font-family: 'Courier Prime', monospace;
    font-size: 11px;
    letter-spacing: 6px;
    color: var(--gold);
    text-transform: uppercase;
    opacity: 0.7;
    animation: fadeIn 1s ease;
  }
  .header-title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(36px,8vw,72px);
    font-weight: 700;
    letter-spacing: 8px;
    color: var(--parchment);
    text-transform: uppercase;
    text-shadow: 0 0 40px rgba(184,134,11,0.3), 2px 2px 0 #000;
    animation: titleReveal 1.2s ease;
  }
  @keyframes titleReveal {
    from { opacity:0; letter-spacing: 20px; }
    to   { opacity:1; letter-spacing: 8px; }
  }
  .header-divider {
    width: 200px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 12px auto;
    animation: expandLine 1.5s ease;
  }
  @keyframes expandLine { from{width:0} to{width:200px} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  /* TABS */
  .tabs {
    display: flex;
    justify-content: center;
    gap: 0;
    margin: 30px auto 0;
    max-width: 500px;
    border: 1px solid rgba(184,134,11,0.3);
    border-radius: 2px;
    overflow: hidden;
  }
  .tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: rgba(240,230,200,0.5);
    font-family: 'Oswald', sans-serif;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.3s;
    border-right: 1px solid rgba(184,134,11,0.2);
    position: relative;
    overflow: hidden;
  }
  .tab-btn:last-child { border-right: none; }
  .tab-btn.active {
    background: var(--red);
    color: var(--parchment);
    font-weight: 600;
  }
  .tab-btn::after {
    content: '';
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 0; height: 2px;
    background: var(--gold-light);
    transition: width 0.3s;
  }
  .tab-btn:hover::after { width: 80%; }
  .tab-btn:hover:not(.active) { color: var(--parchment); background: rgba(139,26,26,0.2); }

  /* MAIN PANEL */
  .main-panel {
    max-width: 480px;
    margin: 30px auto;
    padding: 0 16px;
    animation: fadeIn 0.4s ease;
  }

  /* PARCHMENT CARD */
  .card {
    background: var(--parchment);
    border-radius: 2px;
    padding: 28px 24px;
    position: relative;
    box-shadow:
      0 0 0 1px rgba(139,26,26,0.15),
      0 0 0 4px rgba(240,230,200,0.1),
      0 20px 60px rgba(0,0,0,0.8),
      inset 0 0 80px rgba(180,160,100,0.15);
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute; inset: 0;
    background:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.5;
  }
  .tape {
    position: absolute;
    top: -8px; left: 50%; transform: translateX(-50%) rotate(-1deg);
    width: 80px; height: 22px;
    background: rgba(240,230,190,0.6);
    border: 1px solid rgba(200,180,120,0.4);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 2;
  }

  .section-label {
    font-family: 'Courier Prime', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--gold-light), transparent);
    opacity: 0.4;
  }

  /* FORM */
  .form-group { margin-bottom: 18px; }
  .form-label {
    display: block;
    font-family: 'Courier Prime', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--red);
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    background: rgba(0,0,0,0.05);
    border: 1px solid rgba(139,26,26,0.3);
    border-bottom: 2px solid var(--red);
    border-radius: 0;
    padding: 10px 12px;
    font-family: 'Special Elite', cursive;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: all 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    background: rgba(139,26,26,0.05);
    border-color: var(--red-bright);
    box-shadow: 0 2px 0 0 var(--red-bright), 0 0 12px rgba(139,26,26,0.1);
  }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-select { cursor: pointer; }

  /* PHOTO UPLOAD */
  .photo-upload {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .photo-box {
    width: 90px; height: 110px;
    border: 2px dashed rgba(139,26,26,0.4);
    background: rgba(0,0,0,0.06);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  .photo-box:hover { border-color: var(--red-bright); background: rgba(139,26,26,0.06); }
  .photo-box img { width:100%; height:100%; object-fit:cover; }
  .photo-placeholder {
    font-size: 28px; color: rgba(139,26,26,0.3);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .photo-placeholder span {
    font-family: 'Courier Prime', monospace;
    font-size: 8px; letter-spacing: 2px; color: rgba(139,26,26,0.5);
  }
  .photo-right { flex: 1; }

  /* THREAT SLIDER */
  .threat-row {
    display: flex; align-items: center; gap: 10px;
    margin-top: 4px;
  }
  .threat-slider {
    flex: 1; -webkit-appearance: none;
    height: 4px;
    background: linear-gradient(90deg, var(--green) 0%, var(--olive) 40%, var(--gold) 70%, var(--red-bright) 100%);
    border-radius: 0; outline: none; cursor: pointer;
  }
  .threat-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    background: var(--parchment);
    border: 3px solid var(--red);
    border-radius: 0;
    transform: rotate(45deg);
    cursor: pointer;
    transition: transform 0.15s;
  }
  .threat-slider::-webkit-slider-thumb:hover { transform: rotate(45deg) scale(1.2); }
  .threat-badge {
    font-family: 'Oswald', sans-serif;
    font-size: 11px; letter-spacing: 2px;
    padding: 3px 8px;
    font-weight: 600;
    text-transform: uppercase;
    transition: all 0.3s;
  }

  /* SUBMIT BTN */
  .submit-btn {
    width: 100%;
    background: var(--red);
    border: none; border-radius: 0;
    color: var(--parchment);
    font-family: 'Oswald', sans-serif;
    font-size: 14px; letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 700;
    padding: 16px;
    cursor: pointer;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(139,26,26,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .submit-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.4s;
  }
  .submit-btn:hover::before { transform: translateX(100%); }
  .submit-btn:hover { background: var(--red-bright); box-shadow: 0 6px 30px rgba(192,57,43,0.6); transform: translateY(-1px); }
  .submit-btn:active { transform: translateY(1px); }

  /* OP BOARD */
  .op-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(139,26,26,0.3);
  }
  .op-title {
    font-family: 'Oswald', sans-serif;
    font-size: 11px; letter-spacing: 4px;
    color: rgba(26,18,8,0.5); text-transform: uppercase;
  }
  .live-dot {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Courier Prime', monospace; font-size: 11px;
    color: var(--red);
  }
  .dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--red);
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .mission-banner {
    background: rgba(0,0,0,0.06);
    border: 1px solid rgba(139,26,26,0.2);
    border-left: 4px solid var(--red);
    padding: 16px;
    margin-bottom: 16px;
    position: relative;
  }
  .active-ops-tag {
    display: inline-block;
    background: var(--red);
    color: var(--parchment);
    font-family: 'Oswald', sans-serif;
    font-size: 10px; letter-spacing: 3px;
    padding: 3px 8px; margin-bottom: 8px;
    text-transform: uppercase;
  }
  .mission-name {
    font-family: 'Oswald', sans-serif;
    font-size: 22px; font-weight: 700; letter-spacing: 3px;
    color: var(--ink); text-transform: uppercase;
  }
  .objective-label {
    font-size: 9px; letter-spacing: 3px; color: rgba(26,18,8,0.45);
    text-transform: uppercase; margin-top: 10px; margin-bottom: 2px;
  }
  .objective-text {
    font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 1px;
    color: var(--ink);
  }
  .classified-stamp {
    position: absolute; right: 12px; bottom: 12px;
    font-family: 'Oswald', sans-serif; font-size: 14px; letter-spacing: 3px;
    color: var(--stamp-red); border: 3px solid var(--stamp-red);
    padding: 4px 10px; text-transform: uppercase; font-weight: 700;
    transform: rotate(-12deg);
    opacity: 0.7;
  }

  .stats-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-bottom: 16px;
  }
  .stat-box {
    background: rgba(0,0,0,0.05);
    border: 1px solid rgba(139,26,26,0.2);
    padding: 12px;
  }
  .stat-micro { font-size: 9px; letter-spacing: 3px; color: rgba(26,18,8,0.45); text-transform: uppercase; margin-bottom: 4px; }
  .stat-value { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 700; color: var(--ink); }
  .stat-bar { height: 3px; background: var(--gold-light); margin-top: 6px; }

  /* AGENT CARD */
  .agent-list-label {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }
  .agent-list-title { font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 2px; }
  .agent-list-sub { font-size: 9px; letter-spacing: 2px; color: var(--red); text-transform: uppercase; }

  .agent-card {
    border: 1px solid rgba(139,26,26,0.25);
    background: rgba(255,255,255,0.04);
    padding: 12px;
    display: flex; gap: 12px;
    margin-bottom: 8px;
    transition: all 0.2s;
    animation: slideIn 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .agent-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--red);
    transform: scaleY(0);
    transition: transform 0.2s;
  }
  .agent-card:hover { background: rgba(139,26,26,0.06); }
  .agent-card:hover::before { transform: scaleY(1); }
  @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }

  .agent-photo {
    width: 54px; height: 54px; flex-shrink: 0;
    border: 2px solid rgba(139,26,26,0.3);
    object-fit: cover; background: rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: rgba(139,26,26,0.3);
    overflow: hidden;
  }
  .agent-photo img { width:100%; height:100%; object-fit:cover; }
  .agent-info { flex: 1; min-width: 0; }
  .agent-name-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; }
  .agent-name { font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
  .agent-codename {
    font-size: 9px; letter-spacing: 2px; padding: 2px 6px;
    background: var(--olive); color: var(--parchment);
    text-transform: uppercase; white-space: nowrap; flex-shrink: 0;
  }
  .agent-status {
    font-size: 10px; letter-spacing: 2px; color: var(--green);
    text-transform: uppercase; margin-top: 2px;
  }
  .agent-detail { font-size: 10px; color: rgba(26,18,8,0.5); margin-top: 3px; }
  .status-bar { height: 3px; background: rgba(0,0,0,0.1); margin-top: 8px; border-radius: 0; overflow: hidden; }
  .status-fill { height: 100%; background: var(--red); border-radius: 0; }

  .delete-btn {
    background: none; border: none; color: rgba(139,26,26,0.4);
    cursor: pointer; font-size: 14px; padding: 2px 4px;
    transition: color 0.2s; align-self: flex-start;
  }
  .delete-btn:hover { color: var(--red-bright); }

  /* TARGET CARD */
  .target-card {
    border: 2px solid rgba(139,26,26,0.5);
    background: rgba(255,255,255,0.03);
    padding: 18px;
    margin-bottom: 16px;
    position: relative;
    animation: fadeIn 0.4s ease;
  }
  .target-photo-area {
    width: 100%; height: 180px;
    background: rgba(0,0,0,0.08);
    border: 1px solid rgba(139,26,26,0.2);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; margin-bottom: 14px; position: relative;
    cursor: pointer;
  }
  .target-photo-area img { width:100%; height:100%; object-fit:cover; filter: sepia(20%) contrast(1.05); }
  .target-photo-label {
    position: absolute; top: 0; left: 0; right: 0;
    background: linear-gradient(180deg, rgba(139,26,26,0.4), transparent);
    padding: 6px 10px;
    font-family: 'Courier Prime', monospace; font-size: 9px; letter-spacing: 3px;
    color: var(--parchment); text-transform: uppercase;
  }
  .target-subject { font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
  .target-status { font-size: 10px; letter-spacing: 3px; color: var(--red); text-transform: uppercase; margin-bottom: 4px; }
  .target-detail { font-size: 11px; color: rgba(26,18,8,0.6); margin-bottom: 4px; display: flex; gap: 6px; }
  .target-detail strong { color: var(--red); font-weight: 700; }
  .target-notes {
    background: rgba(0,0,0,0.05);
    border-left: 3px solid rgba(139,26,26,0.3);
    padding: 10px; margin-top: 10px;
    font-size: 11px; color: rgba(26,18,8,0.7);
    font-style: italic;
    line-height: 1.6;
  }
  .warning-icon { color: var(--red); font-size: 16px; }

  /* ABORT BTN */
  .abort-btn {
    width: 100%;
    background: var(--red);
    border: none; border-radius: 0;
    color: var(--parchment);
    font-family: 'Oswald', sans-serif;
    font-size: 12px; letter-spacing: 5px;
    text-transform: uppercase; font-weight: 700;
    padding: 14px;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(139,26,26,0.35);
    animation: btnGlow 3s ease-in-out infinite;
  }
  @keyframes btnGlow { 0%,100%{box-shadow: 0 4px 20px rgba(139,26,26,0.35)} 50%{box-shadow: 0 4px 30px rgba(192,57,43,0.6)} }
  .abort-btn:hover { background: var(--red-bright); }

  /* EMPTY STATE */
  .empty-state {
    text-align: center; padding: 40px 20px;
    color: rgba(26,18,8,0.3);
  }
  .empty-state .big-icon { font-size: 36px; margin-bottom: 10px; opacity: 0.4; }
  .empty-state p { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }

  /* SUCCESS FLASH */
  .success-flash {
    position: fixed; inset: 0; z-index: 9998;
    background: rgba(139,26,26,0.15);
    animation: flashAnim 0.6s ease forwards;
    pointer-events: none;
  }
  @keyframes flashAnim { 0%{opacity:1} 100%{opacity:0} }

  /* STATUS COLORS */
  .status-green { color: var(--green) !important; }
  .status-gold  { color: var(--gold) !important; }
  .status-red   { color: var(--red-bright) !important; }
  .status-olive { color: var(--olive) !important; }

  /* THREAT COLORS */
  .threat-low      { background: var(--green) !important; color: #fff !important; }
  .threat-moderate { background: var(--olive) !important; color: #fff !important; }
  .threat-elevated { background: var(--gold) !important;  color: #000 !important; }
  .threat-critical { background: var(--red-bright) !important; color: #fff !important; }

  .divider { height: 1px; background: rgba(139,26,26,0.2); margin: 16px 0; }

  /* COUNT BADGE */
  .count-badge {
    display: inline-block; background: var(--red);
    color: var(--parchment); font-size: 9px; letter-spacing: 1px;
    padding: 2px 6px; font-family: 'Oswald', sans-serif;
    margin-left: 6px; vertical-align: middle;
    animation: fadeIn 0.3s ease;
  }
`;

const THREAT_LEVELS = ["LOW", "MODERATE", "ELEVATED", "CRITICAL"];
const THREAT_CLASSES = ["threat-low", "threat-moderate", "threat-elevated", "threat-critical"];
const STATUSES = ["IN POSITION", "DEEP COVER", "COMPROMISED", "PROJECTOR READY", "STANDBY"];
const STATUS_CLASSES = ["status-green", "status-olive", "status-red", "status-gold", "status-olive"];
const CODENAMES = ["Apache","The Italian","The Actress","The French","The Bear","Ghost","Shadow","Viper"];

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function App() {
  const [tab, setTab] = useState("build");
  const [flash, setFlash] = useState(false);

  // Mission state
  const [mission, setMission] = useState({
    name: "", objective: "", location: "", threat: 2,
    targetName: "", targetStatus: "", targetCoords: "",
    targetNotes: "", targetImg: null,
  });

  // Agents
  const [agents, setAgents] = useState([]);
  const [agentForm, setAgentForm] = useState({ name: "", codename: 0, status: 0, detail: "", photo: null });

  const targetImgRef = useRef();
  const agentImgRef = useRef();

  const handleMission = (k, v) => setMission(p => ({ ...p, [k]: v }));
  const handleAgent = (k, v) => setAgentForm(p => ({ ...p, [k]: v }));

  async function handleTargetImg(e) {
    const f = e.target.files[0]; if (!f) return;
    const b = await toBase64(f);
    handleMission("targetImg", b);
  }
  async function handleAgentImg(e) {
    const f = e.target.files[0]; if (!f) return;
    const b = await toBase64(f);
    handleAgent("photo", b);
  }

  function addAgent() {
    if (!agentForm.name.trim()) return;
    setAgents(p => [...p, { ...agentForm, id: Date.now() }]);
    setAgentForm({ name: "", codename: 0, status: 0, detail: "", photo: null });
    if (agentImgRef.current) agentImgRef.current.value = "";
    setFlash(true); setTimeout(() => setFlash(false), 600);
  }

  function removeAgent(id) { setAgents(p => p.filter(a => a.id !== id)); }

  const threatClass = THREAT_CLASSES[mission.threat] || "threat-elevated";
  const threatLabel = THREAT_LEVELS[mission.threat] || "ELEVATED";

  return (
    <>
      <style>{STYLE}</style>
      {flash && <div className="success-flash" />}
      <div className="scanline-overlay" />
      <div className="app-bg">
        <div className="header">
          <div className="header-sub">Classified Intelligence Platform</div>
          <div className="header-title">Op. Kino</div>
          <div className="header-divider" />
        </div>

        <div className="tabs">
          <button className={`tab-btn ${tab === "build" ? "active" : ""}`} onClick={() => setTab("build")}>Build Mission</button>
          <button className={`tab-btn ${tab === "add" ? "active" : ""}`} onClick={() => setTab("add")}>Add Agent</button>
          <button className={`tab-btn ${tab === "board" ? "active" : ""}`} onClick={() => setTab("board")}>
            Op Board {agents.length > 0 && <span className="count-badge">{agents.length}</span>}
          </button>
        </div>

        <div className="main-panel">
          {/* BUILD MISSION */}
          {tab === "build" && (
            <div className="card">
              <div className="tape" />
              <div className="section-label">Mission Parameters</div>

              <div className="form-group">
                <label className="form-label">Operation Name</label>
                <input className="form-input" placeholder="e.g. OPERATION KINO" value={mission.name}
                  onChange={e => handleMission("name", e.target.value.toUpperCase())} />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Objective</label>
                <input className="form-input" placeholder="e.g. INFILTRATION" value={mission.objective}
                  onChange={e => handleMission("objective", e.target.value.toUpperCase())} />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. PARIS, DISTRICT 8" value={mission.location}
                  onChange={e => handleMission("location", e.target.value.toUpperCase())} />
              </div>

              <div className="form-group">
                <label className="form-label">Threat Level</label>
                <div className="threat-row">
                  <input type="range" min="0" max="3" value={mission.threat}
                    className="threat-slider"
                    onChange={e => handleMission("threat", +e.target.value)} />
                  <span className={`threat-badge ${threatClass}`}>{threatLabel}</span>
                </div>
              </div>

              <div className="divider" />
              <div className="section-label">Target Profile</div>

              <div className="photo-upload">
                <div className="photo-box" onClick={() => targetImgRef.current.click()}>
                  {mission.targetImg
                    ? <img src={mission.targetImg} alt="target" />
                    : <div className="photo-placeholder">🎯<span>Photo</span></div>}
                </div>
                <input ref={targetImgRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleTargetImg} />
                <div className="photo-right">
                  <div className="form-group" style={{marginBottom:10}}>
                    <label className="form-label">Subject Name</label>
                    <input className="form-input" placeholder="COL. HANS LANDA" value={mission.targetName}
                      onChange={e => handleMission("targetName", e.target.value.toUpperCase())} />
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Last Known Status</label>
                    <input className="form-input" placeholder="WITH [CONTACT]" value={mission.targetStatus}
                      onChange={e => handleMission("targetStatus", e.target.value.toUpperCase())} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{marginTop:14}}>
                <label className="form-label">Last Coordinates</label>
                <input className="form-input" placeholder="52.5200° N, 13.4050° E" value={mission.targetCoords}
                  onChange={e => handleMission("targetCoords", e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Intelligence Notes</label>
                <textarea className="form-textarea" placeholder="Subject was last seen entering the subterranean complex at 0300h..."
                  value={mission.targetNotes}
                  onChange={e => handleMission("targetNotes", e.target.value)} />
              </div>

              <button className="submit-btn" onClick={() => { setTab("board"); setFlash(true); setTimeout(()=>setFlash(false),600); }}>
                ▶ Deploy Mission
              </button>
            </div>
          )}

          {/* ADD AGENT */}
          {tab === "add" && (
            <div className="card">
              <div className="tape" />
              <div className="section-label">Agent Registration</div>

              <div className="photo-upload">
                <div className="photo-box" onClick={() => agentImgRef.current.click()}>
                  {agentForm.photo
                    ? <img src={agentForm.photo} alt="agent" />
                    : <div className="photo-placeholder">🕵<span>Photo</span></div>}
                </div>
                <input ref={agentImgRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAgentImg} />
                <div className="photo-right">
                  <div className="form-group" style={{marginBottom:10}}>
                    <label className="form-label">Agent Name</label>
                    <input className="form-input" placeholder="LT. ALDO RAINE" value={agentForm.name}
                      onChange={e => handleAgent("name", e.target.value.toUpperCase())} />
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Codename</label>
                    <select className="form-select" value={agentForm.codename}
                      onChange={e => handleAgent("codename", +e.target.value)}>
                      {CODENAMES.map((c, i) => <option key={i} value={i}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{marginTop:14}}>
                <label className="form-label">Current Status</label>
                <select className="form-select" value={agentForm.status}
                  onChange={e => handleAgent("status", +e.target.value)}>
                  {STATUSES.map((s, i) => <option key={i} value={i}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Loadout / Skillset</label>
                <input className="form-input" placeholder="heavy / close quarters" value={agentForm.detail}
                  onChange={e => handleAgent("detail", e.target.value)} />
              </div>

              <button className="submit-btn" onClick={addAgent}>
                ✚ Enlist Agent
              </button>

              {agents.length > 0 && (
                <>
                  <div className="divider" />
                  <div className="section-label">Enlisted Agents</div>
                  {agents.map((a) => (
                    <div className="agent-card" key={a.id}>
                      <div className="agent-photo">
                        {a.photo ? <img src={a.photo} alt={a.name} /> : "🕵"}
                      </div>
                      <div className="agent-info">
                        <div className="agent-name-row">
                          <span className="agent-name">{a.name || "UNKNOWN"}</span>
                          <span className="agent-codename">{CODENAMES[a.codename]}</span>
                        </div>
                        <div className={`agent-status ${STATUS_CLASSES[a.status]}`}>{STATUSES[a.status]}</div>
                        {a.detail && <div className="agent-detail">{a.detail}</div>}
                      </div>
                      <button className="delete-btn" onClick={() => removeAgent(a.id)}>✕</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* OP BOARD */}
          {tab === "board" && (
            <div className="card">
              <div className="tape" />
              <div className="op-header">
                <span className="op-title">Op Board</span>
                <span className="live-dot"><span className="dot" />Live</span>
              </div>

              {(mission.name || mission.objective) ? (
                <div className="mission-banner">
                  <div className="active-ops-tag">Active Ops</div>
                  <div className="mission-name">{mission.name || "UNNAMED OP"}</div>
                  {mission.objective && <>
                    <div className="objective-label">Current Objective</div>
                    <div className="objective-text">{mission.objective}</div>
                  </>}
                  {mission.threat >= 1 && (
                    <div style={{marginTop:10}}>
                      <span className={`threat-badge ${threatClass}`} style={{padding:"4px 10px"}}>
                        Threat : {threatLabel}
                      </span>
                    </div>
                  )}
                  <div className="classified-stamp">Classified</div>
                </div>
              ) : (
                <div className="mission-banner" style={{opacity:0.5}}>
                  <div className="active-ops-tag">No Active Ops</div>
                  <div style={{fontSize:11,letterSpacing:2,marginTop:6,textTransform:"uppercase",color:"rgba(26,18,8,0.4)"}}>
                    Configure a mission in Build tab
                  </div>
                </div>
              )}

              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-micro">Connected Cells</div>
                  <div className="stat-value">{agents.length > 0 ? `${agents.length}/${agents.length}` : "0/0"}</div>
                  <div className="stat-bar" style={{width:`${agents.length > 0 ? 100 : 0}%`}} />
                </div>
                <div className="stat-box">
                  <div className="stat-micro">Location</div>
                  <div className="stat-value" style={{fontSize: mission.location && mission.location.length > 10 ? "13px" : "18px", lineHeight: "1.2"}}>
                    {mission.location || "—"}
                  </div>
                </div>
              </div>

              {/* Target */}
              {(mission.targetName || mission.targetImg) && (
                <>
                  <div className="section-label">High-Value Target</div>
                  <div className="target-card">
                    {mission.targetImg && (
                      <div className="target-photo-area" onClick={() => targetImgRef.current?.click()}>
                        <div className="target-photo-label">⚠ Surveillance Photo</div>
                        <img src={mission.targetImg} alt="target" />
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div className="target-subject">Subject : {mission.targetName || "UNKNOWN"}</div>
                      <span className="warning-icon">⚠</span>
                    </div>
                    {mission.targetStatus && (
                      <div className="target-detail">
                        <strong>STATUS :</strong> <span style={{color:"var(--red)"}}>{mission.targetStatus}</span>
                      </div>
                    )}
                    {mission.targetCoords && (
                      <div className="target-detail">
                        <strong>LAST COORD :</strong> <span style={{color:"var(--red)"}}>{mission.targetCoords}</span>
                      </div>
                    )}
                    {mission.targetNotes && (
                      <div className="target-notes">"{mission.targetNotes}"</div>
                    )}
                  </div>
                </>
              )}

              {/* Agents */}
              {agents.length > 0 && (
                <>
                  <div className="agent-list-label">
                    <span className="agent-list-title">Agent Roster</span>
                    <span className="agent-list-sub">Active Deployment</span>
                  </div>
                  {agents.map((a, i) => (
                    <div className="agent-card" key={a.id} style={{animationDelay:`${i*0.08}s`}}>
                      <div className="agent-photo">
                        {a.photo ? <img src={a.photo} alt={a.name} /> : "🕵"}
                      </div>
                      <div className="agent-info">
                        <div className="agent-name-row">
                          <span className="agent-name">{a.name || "UNKNOWN"}</span>
                          <span className="agent-codename">{CODENAMES[a.codename]}</span>
                        </div>
                        <div className={`agent-status ${STATUS_CLASSES[a.status]}`}>{STATUSES[a.status]}</div>
                        {a.detail && <div className="agent-detail">{a.detail}</div>}
                        <div className="status-bar"><div className="status-fill" style={{width:`${60+i*12}%`}} /></div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!mission.name && !mission.targetName && agents.length === 0 && (
                <div className="empty-state">
                  <div className="big-icon">📋</div>
                  <p>No intelligence data</p>
                  <p style={{marginTop:6,fontSize:"10px"}}>Build your mission first</p>
                </div>
              )}

              <div className="divider" />
              <button className="abort-btn">⚠ BROADCAST EMERGENCY</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
