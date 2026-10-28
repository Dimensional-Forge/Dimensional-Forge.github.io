// Accepted proposals data + proposal modal (any element with data-proposal opens one)

// ── PROPOSAL MODAL ────────────────────────────────────────────
const PROPOSALS = [
  {
    id: 'cove-design',
    type: 'Product Consulting · Forge Phase 0',
    title: 'Product Consultation',
    stats: [
      { val: '$220', lbl: 'Investment' },
      { val: '4h',   lbl: 'Hours' },
      { val: '0',    lbl: 'Forge Phase' },
    ],
    phases: [
      {
        title: 'Phase 0 — Discovery & Definition · Live Consulting Session',
        items: [
          'Pre-session intake form and structured agenda prep',
          '3-hour live video consulting session',
          'Product goals, manufacturing approach, and go-to-market alignment',
          'Recorded session delivered to client',
        ]
      }
    ],
    deliverables: [
      'Session recording',
      'Written summary document with prioritized action list',
      'Recommended next-step roadmap',
    ],
    tags: ['Product Consulting', 'Manufacturing Strategy', 'Roadmapping'],
  },
  {
    id: 'blast-light',
    type: 'Mechanical + Electrical Prototyping · Forge Phases 0–2',
    title: 'Tactical Light Prototype',
    stats: [
      { val: '$1,518', lbl: 'Investment' },
      { val: '38h',    lbl: 'Hours' },
      { val: '0–2',    lbl: 'Forge Phases' },
    ],
    phases: [
      { title: 'Phase 0 — Discovery & Definition', items: ['Project kickoff and alignment on requirements, constraints, and aesthetic goals'] },
      { title: 'Phase 1 — Concept & Feasibility', items: ['Concept sketching and ideation', 'Mechanical architecture plan', 'Electrical architecture plan'] },
      { title: 'Phase 2 — Design & Verification', items: ['Rough 3D CAD draft', 'Refined 3D CAD with client review and revision cycles', 'Material selection and parts ordering', 'Full mechanical and electrical assembly', 'Prototype testing and design revisions', 'Packaged and shipped to client'] },
    ],
    deliverables: ['Confirmed requirements and concept sketches', 'Rough and refined 3D CAD', 'Mechanical & Electrical Architecture Plans', 'Fully functional proof-of-concept prototype (shipped)', 'Prototype test results report'],
    tags: ['Mechanical Design', 'Electrical Architecture', 'Rapid Prototyping', '3D CAD'],
  },
  {
    id: 'glassboard',
    type: 'Technical Documentation · Forge Phases 0, 2 & 5',
    title: 'Mechanical Drawing Update — 40 Drawings',
    stats: [
      { val: '~$240',   lbl: 'Investment' },
      { val: '6h',      lbl: 'Hours' },
      { val: '0·2·5',   lbl: 'Forge Phases' },
    ],
    phases: [
      { title: 'Phase 0 — Discovery & Definition · Client Intake', items: ['Receive and verify all client-supplied assets', 'Confirm drawing numbers list, logo file format, and delivery format', 'Confirm title block change spec in writing'] },
      { title: 'Phase 2 — Design & Verification · Drawing Updates (40 Drawings)', items: ['Apply all 7 scope changes to each drawing (~8 min/drawing)', 'Logo swap, drawing number updates, and formatting standardization'] },
      { title: 'Phase 5 — Handoff & Lifecycle · Review & Delivery', items: ['Open/save verification pass on all updated files', 'Organize final deliverable package', 'Deliver in agreed format with confirmation'] },
    ],
    deliverables: ['Confirmed asset receipt and scope in writing', '40 updated drawings with all 7 changes applied', 'Final organized drawing package (native/PDF)'],
    tags: ['Technical Documentation', 'Engineering Drawings', 'CAD'],
  },
  {
    id: 'gus-battle-bot',
    type: 'Engineering Tutoring · 4 Sessions',
    title: "Battle Bot Engineering Tutoring",
    stats: [
      { val: '~$700', lbl: 'Investment' },
      { val: '17.5h', lbl: 'Hours' },
      { val: '4',     lbl: 'Sessions' },
    ],
    phases: [
      { title: 'Session 1 — Foundations', items: ['Rules analysis and design trade-offs', 'Parts sourcing and workspace setup', 'Student presents pre-work designs and commits to one bot concept'] },
      { title: 'Session 2 — Build Project', items: ['Full battle bot assembly: chassis, drive, weapon, electronics', 'Student leads all hands-on work; mentor guides with questions only', 'Completed bot test video and build summary written by student'] },
      { title: 'Session 3 — Repair Project', items: ['Systematic diagnosis using 5 Whys and methodical testing', 'Full repair of a broken battle bot', 'Repair summary and before/after documentation'] },
      { title: 'Session 4 — Final Demo & Reflection', items: ['Live demonstration of both bots', 'Engineering portfolio: photos, sketches, repair log, written reflection', 'Go/no-go recommendation for the next level of curriculum'] },
    ],
    deliverables: ['Final bot design documentation', 'Completed build-project battle bot', 'Completed repair-project battle bot', 'Engineering portfolio (written, photos, repair log)', 'Build and repair summaries authored by student'],
    tags: ['Engineering Tutoring', 'Mentorship', 'Hands-On STEM', 'Root Cause Analysis'],
  },
  {
    id: 'k9',
    type: 'Full Product Development · Forge Phases 0–4',
    title: 'Electromechanical Product — iOS Integration',
    stats: [
      { val: '~$9.4K', lbl: 'Investment' },
      { val: '235h',   lbl: 'Hours' },
      { val: '0–4',    lbl: 'Forge Phases' },
    ],
    phases: [
      { title: 'Phase 0 — Discovery & Definition', items: ['Product requirements document', 'Software requirements list'] },
      { title: 'Phase 1 — Concept & Feasibility', items: ['Initial concept sketches', 'Mechanical, electrical, and software architecture plans'] },
      { title: 'Phase 2 — Design & Verification · Detailed Design', items: ['Rough and refined 3D CAD with review cycles', 'Patent drawings', 'Photorealistic renders from final CAD', 'Transparent PNGs for marketing use'] },
      { title: 'Phase 2 — Design & Verification · First Prototype Build', items: ['Full electromechanical assembly', 'iOS app MVP with hardware integration', 'Software integration testing', 'Shipped prototype to client'] },
      { title: 'Phase 3 — Material Prototype & Validation · Second Prototype Build', items: ['Re-designed CAD optimized for 3D printing', 'Second prototype with printed enclosure', 'Updated iOS app integration', 'Test results and build-to-build change log'] },
      { title: 'Phase 4 — Production & Launch', items: ['DFM/DFA review, material re-selection', 'Engineering drawings and supplier quotes', 'Tooling, pilot run, and logistics planning'] },
    ],
    deliverables: ['Product requirements and software requirements docs', 'All architecture plans (mechanical, electrical, software)', 'Final 3D CAD + patent drawings', 'Photorealistic renders (transparent PNGs)', 'Two prototype builds (shipped)', 'iOS app MVP', 'Full BOM and production-ready drawings', 'DFM/DFA report, supplier matrix, production BOM'],
    tags: ['Systems Architecture', 'Electromechanical Design', 'iOS Integration', 'DFM/DFA', 'Prototyping'],
  },
  {
    id: 'pokestop',
    type: 'Custom Fabrication · Forge Phases 0, 3 & 5',
    title: 'Custom Pokéstop LED Sign',
    stats: [
      { val: '~$230',  lbl: 'Investment' },
      { val: '5.75h',  lbl: 'Hours' },
      { val: '0·3·5',  lbl: 'Forge Phases' },
    ],
    phases: [
      { title: 'Phase 0 — Discovery & Definition · Design & Planning', items: ['Final dimensions, LED color spec, and rotation mechanism confirmed with client'] },
      { title: 'Phase 3 — Material Prototype & Validation · Materials Procurement', items: ['Source acrylic sheet, LED neon flex, connectors, hardware', 'All materials verified against spec before build'] },
      { title: 'Phase 3 — Material Prototype & Validation · Fabrication', items: ['Acrylic cut to Pokéstop silhouette', 'LED neon flex installed on front face', 'Wiring, connectors, and solder joints complete'] },
      { title: 'Phase 5 — Handoff & Lifecycle · Testing & QC Handoff', items: ['LED continuity check and 8+ hour runtime test', 'Spin verification on pole mount', 'QC pass before client handoff'] },
    ],
    deliverables: ['Fabricated Pokéstop-silhouette acrylic sign', 'LED neon flex front face with wiring', 'Fully tested spinnable pole-mount assembly'],
    tags: ['Custom Fabrication', 'LED Electronics', 'Acrylic Work'],
  },
  {
    id: 'reverse-engineering',
    type: 'Reverse Engineering · Forge Phases 0, 2 & 5',
    title: 'Medical Device Reverse Engineering',
    stats: [
      { val: '$400',  lbl: 'Investment' },
      { val: '8h',    lbl: 'Hours' },
      { val: '0·2·5', lbl: 'Forge Phases' },
    ],
    phases: [
      { title: 'Phase 0 — Discovery & Definition · Teardown & Documentation', items: ['Device intake and inspection', 'Methodical disassembly with step-by-step photos of assembly order', 'Caliper measurements and reference photos of each component'] },
      { title: 'Phase 2 — Design & Verification · Reverse-Engineering CAD Modeling', items: ['Parametric SolidWorks part models from measured geometry', 'Critical interfaces and fit-up between mating components captured'] },
      { title: 'Phase 5 — Handoff & Lifecycle · Drawings & Handoff', items: ['STEP exports and basic dimensioned part drawings', 'Handoff summary and organized file package'] },
    ],
    deliverables: ['Teardown photo log in assembly order', 'Component list with key measurements', 'Native SolidWorks part models', 'STEP files', 'Basic dimensioned PDF drawings', 'Measurement summary'],
    tags: ['Reverse Engineering', 'CAD', 'Technical Documentation', 'Engineering Drawings'],
  },
  {
    id: 'stealth-wallet',
    type: 'Full Product Development · Forge Phases 0–2 & 4',
    title: 'Stealth Wallet — Design & Production',
    stats: [
      { val: '$2,250', lbl: 'Investment' },
      { val: '150h',   lbl: 'Hours' },
      { val: '0–2·4',  lbl: 'Forge Phases' },
    ],
    phases: [
      { title: 'Phase 0 — Discovery & Definition', items: ['Kickoff to confirm specs, dimensions, materials, and aesthetic goals'] },
      { title: 'Phase 1 — Concept & Feasibility', items: ['Concept sketches establishing layout and form factor options'] },
      { title: 'Phase 2 — Design & Verification · Detailed Design', items: ['Rough 3D CAD draft through final detailed CAD', 'Locking mechanism detail, exploded views, engineering drawings', 'Two client review and revision cycles'] },
      { title: 'Phase 2 — Design & Verification · Photorealistic Renders', items: ['3–5 photorealistic renders', 'Transparent PNGs for marketing use'] },
      { title: 'Phase 2 — Design & Verification · Proof-of-Concept Prototyping', items: ['Two rapid 3D printed prototype cycles', 'Durability and fit testing between cycles', 'Design revisions applied from physical test feedback'] },
      { title: 'Phase 4 — Production & Launch', items: ['DFM/DFA review (two rounds)', 'Material re-selection and supplier quoting', 'Functional testing with production-grade materials'] },
    ],
    deliverables: ['Confirmed spec document and concept sketches', 'Final CAD + engineering drawings', 'Photorealistic renders (transparent PNGs)', 'Multiple proof-of-concept prototype iterations + test results', 'DFM/DFA reports, production drawings, BOM', 'Supplier quotes and functional test report with production-grade materials'],
    tags: ['CAD Design', '3D Rendering', 'DFM/DFA', 'Production Prep', 'Supply Chain'],
  },
  {
    id: 'shirt-folding',
    type: 'Mechanical Prototyping · Forge Phases 0 & 2',
    title: 'Automated Machine MVP',
    stats: [
      { val: '$2,255', lbl: 'Investment' },
      { val: '41h',    lbl: 'Hours' },
      { val: '0 & 2',  lbl: 'Forge Phases' },
    ],
    phases: [
      { title: 'Phase 0 — Discovery & Definition · Design Review & BOM', items: ['Review reference and client CAD files', 'Map full mechanism and identify button-control delta', 'Analyze files for print-readiness', 'Produce complete BOM with sourcing and cost estimate', 'Deliver 3D print cost estimate based on file analysis'] },
      { title: 'Phase 2 — Design & Verification · CAD Adaptation & Parts Ordering', items: ['Targeted modifications for button-control integration and print-readiness fixes', 'Slice files and confirm tolerances with test prints of critical parts', 'Place all component orders for delivery during print runs'] },
      { title: 'Phase 2 — Design & Verification · Fabrication & Assembly', items: ['Run all 3D print jobs and receive components', 'Assemble complete machine', 'Install motors, actuators, and button-control wiring', 'Program full motion sequence', 'Initial bench-level functional checks'] },
      { title: 'Phase 2 — Design & Verification · Test & Refine', items: ['Structured mechanism verification testing', 'Identify failure modes and tune geometry and timing', 'One primary rework cycle included', 'Reliability run verification'] },
    ],
    deliverables: [
      'Design review notes (mechanism map, delta from reference, risks)',
      'Complete BOM with sourcing and component cost',
      '3D print cost estimate',
      'Print-ready files (all parts)',
      'Fully assembled Automated Machine MVP (v1)',
      'Wiring diagram',
      'Mechanism verification test results summary (success rate, failure modes)',
      'Refined machine (v1.1) after rework cycle',
    ],
    tags: ['Mechanical Design', 'Rapid Prototyping', '3D Printing', 'CAD Adaptation', 'V&V'],
  },
];

const backdrop = document.getElementById('pmodal-backdrop');
const closeBtn = document.getElementById('pmodal-close');

function openProposal(id) {
  const p = PROPOSALS.find(x => x.id === id);
  if (!p) return;

  document.getElementById('pmodal-type').textContent = p.type;
  document.getElementById('pmodal-title').textContent = p.title;

  document.getElementById('pmodal-stats').innerHTML = p.stats.map(s =>
    `<div class="pstat">
      <span class="pstat-val">${s.val}</span>
      <span class="pstat-lbl">${s.lbl}</span>
    </div>`
  ).join('');

  document.getElementById('pmodal-phases').innerHTML = p.phases.map(ph =>
    `<div class="pmodal-phase">
      <div class="pmodal-phase-title">${ph.title}</div>
      <ul>${ph.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`
  ).join('');

  document.getElementById('pmodal-deliverables').innerHTML =
    p.deliverables.map(d => `• ${d}`).join('<br>');

  document.getElementById('pmodal-tags').innerHTML =
    p.tags.map(t => `<span class="wtag">${t}</span>`).join('');

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProposal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeProposal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeProposal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProposal(); });

document.querySelectorAll('[data-proposal]').forEach(card => {
  card.addEventListener('click', () => openProposal(card.dataset.proposal));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProposal(card.dataset.proposal); } });
});
