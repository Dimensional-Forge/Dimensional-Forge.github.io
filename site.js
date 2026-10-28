// Shared site behavior: embers, mobile nav, nav active state, VENN widget

// Ember particles
const ec = document.getElementById('embers');
const clrs = ['#EE4236','#F0782D','#FAAC3D','#ff5500'];
for (let i = 0; i < 36; i++) {
  const e = document.createElement('div');
  e.className = 'ember';
  const s = Math.random() * 3.5 + 1.5;
  e.style.cssText = `
    width:${s}px;height:${s}px;
    background:${clrs[Math.floor(Math.random()*clrs.length)]};
    left:${Math.random()*100}%;
    bottom:${Math.random()*6}%;
    --dx:${(Math.random()-0.5)*120}px;
    animation-duration:${7+Math.random()*8}s;
    animation-delay:${Math.random()*10}s;
    box-shadow:0 0 ${s*3}px currentColor;
  `;
  ec.appendChild(e);
}

// Mobile nav burger
const burger = document.getElementById('nav-burger');
const navLinkList = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  const open = navLinkList.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinkList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinkList.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Nav active state
const secs = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
// Band at mid-viewport: works for sections taller than the screen (e.g. #work)
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.style.color = '');
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.style.color = '#F0782D';
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => navObs.observe(s));

(function () {
  const G = '#00ee44', D = '#050f07';
  const THINK_LOOKS = [[8,-5,true],[2,-4,true],[-6,-4,true],[2,-4,true]];
  const SPEAK_CYCLE = ['open','mid','small','mid','open','small','mid'];

  const leye   = document.getElementById('vwh-leye');
  const reye   = document.getElementById('vwh-reye');
  const lpupil = document.getElementById('vwh-lpupil');
  const rpupil = document.getElementById('vwh-rpupil');
  const lshine = document.getElementById('vwh-lshine');
  const rshine = document.getElementById('vwh-rshine');
  const mouthEl  = document.getElementById('vwh-mouth');
  const statusEl = document.getElementById('venn-header-status');

  let eyePos = { dx:0, dy:0, squint:false };
  let speakTimer = null, speakFrame = 0;
  let thinkEyeTimer = null, thinkEyePhase = 0;

  function getMouths() {
    return {
      idle:     `<rect x="56" y="152" width="14" height="10" fill="${G}"/><rect x="150" y="152" width="14" height="10" fill="${G}"/><rect x="70" y="162" width="80" height="10" fill="${G}"/>`,
      thinking: `<rect x="68" y="158" width="66" height="7" fill="${G}"/><rect x="134" y="153" width="18" height="5" fill="${G}"/><rect x="152" y="150" width="10" height="4" fill="${G}"/>`,
      small:    `<rect x="50" y="148" width="120" height="8" fill="${G}"/><rect x="42" y="156" width="8" height="14" fill="${G}"/><rect x="170" y="156" width="8" height="14" fill="${G}"/><rect x="50" y="170" width="120" height="8" fill="${G}"/><rect x="58" y="156" width="104" height="14" fill="${D}"/>`,
      mid:      `<rect x="48" y="142" width="124" height="8" fill="${G}"/><rect x="40" y="150" width="8" height="22" fill="${G}"/><rect x="172" y="150" width="8" height="22" fill="${G}"/><rect x="48" y="172" width="124" height="8" fill="${G}"/><rect x="56" y="150" width="108" height="22" fill="${D}"/><rect x="66" y="150" width="22" height="11" fill="${G}" opacity="0.75"/><rect x="99" y="150" width="22" height="11" fill="${G}" opacity="0.75"/><rect x="132" y="150" width="22" height="11" fill="${G}" opacity="0.75"/>`,
      open:     `<rect x="46" y="134" width="128" height="8" fill="${G}"/><rect x="38" y="142" width="8" height="38" fill="${G}"/><rect x="174" y="142" width="8" height="38" fill="${G}"/><rect x="46" y="180" width="128" height="8" fill="${G}"/><rect x="54" y="142" width="112" height="38" fill="${D}"/><rect x="62" y="142" width="24" height="15" fill="${G}" opacity="0.7"/><rect x="98" y="142" width="24" height="15" fill="${G}" opacity="0.7"/><rect x="134" y="142" width="24" height="15" fill="${G}" opacity="0.7"/>`,
    };
  }

  function setMouth(k) { mouthEl.innerHTML = getMouths()[k] || getMouths().idle; }

  function setEyePos(dx, dy, squint) {
    eyePos = { dx, dy, squint };
    const h = squint ? 30 : 44, y = squint ? 65 : 58;
    leye.setAttribute('height', h);   leye.setAttribute('y', y);
    reye.setAttribute('height', h);   reye.setAttribute('y', y);
    lpupil.setAttribute('x', 50+dx);  lpupil.setAttribute('y', 68+dy);
    rpupil.setAttribute('x', 142+dx); rpupil.setAttribute('y', 68+dy);
    lshine.setAttribute('x', 50+dx);  lshine.setAttribute('y', 68+dy);
    rshine.setAttribute('x', 142+dx); rshine.setAttribute('y', 68+dy);
  }

  function startThinkingEyes() {
    clearInterval(thinkEyeTimer); thinkEyePhase = 0; setEyePos(...THINK_LOOKS[0]);
    thinkEyeTimer = setInterval(() => {
      thinkEyePhase = (thinkEyePhase + 1) % THINK_LOOKS.length;
      setEyePos(...THINK_LOOKS[thinkEyePhase]);
    }, 900);
  }
  function stopThinkingEyes() { clearInterval(thinkEyeTimer); thinkEyeTimer = null; setEyePos(0,0,false); }

  function setState(s) {
    clearInterval(speakTimer);
    if (s !== 'thinking') stopThinkingEyes();
    switch (s) {
      case 'idle':
        statusEl.textContent = '● Bridge Offline'; statusEl.className = '';
        setMouth('idle'); break;
      case 'idle-live':
        statusEl.textContent = '● Online'; statusEl.className = 'venn-live';
        setMouth('idle'); break;
      case 'thinking':
        statusEl.textContent = '◌ Thinking...'; statusEl.className = '';
        setMouth('thinking'); startThinkingEyes(); break;
      case 'responding':
        statusEl.textContent = '▶ Responding'; statusEl.className = 'venn-live';
        speakFrame = 0;
        speakTimer = setInterval(() => setMouth(SPEAK_CYCLE[speakFrame++ % SPEAK_CYCLE.length]), 140);
        break;
    }
  }

  function blink() {
    const by = eyePos.squint ? 79 : 78;
    leye.setAttribute('height','4'); leye.setAttribute('y', by);
    reye.setAttribute('height','4'); reye.setAttribute('y', by);
    [lpupil,rpupil,lshine,rshine].forEach(e => e.setAttribute('opacity','0'));
    setTimeout(() => {
      setEyePos(eyePos.dx, eyePos.dy, eyePos.squint);
      [lpupil,rpupil,lshine,rshine].forEach(e => e.removeAttribute('opacity'));
    }, 100);
    setTimeout(blink, 3000 + Math.random() * 4000);
  }

  // ── Init ──────────────────────────────────────────────
  // Venn chats over Telegram now — the panel shows a live status + an "Open Telegram"
  // CTA (see #venn-cta in the markup). No on-site chat bridge to call.
  const toggle  = document.getElementById('venn-toggle');
  const panel   = document.getElementById('venn-panel');
  const closeBtn = document.getElementById('venn-close');

  toggle.addEventListener('click', () => panel.classList.toggle('venn-open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('venn-open'));

  if (statusEl) { statusEl.textContent = '● Live'; statusEl.className = 'venn-live'; }

  // Smart "Open Telegram": try the app first (the tg:// link carries the start=website
  // auto-approve payload); if the app doesn't take over within ~1.2s, fall back to
  // Telegram Web in the same tab. Telegram Web drops the payload, so those visitors land
  // on the manual access gate instead of auto-approve — still better than a dead button.
  const ctaBtn = document.getElementById('venn-cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', e => {
      e.preventDefault();
      const TG_APP = 'tg://resolve?domain=Venn_SMS_Bot&start=website';
      const TG_WEB = 'https://web.telegram.org/k/#@Venn_SMS_Bot';
      let appOpened = false;
      const t0 = Date.now();
      const onHide = () => { if (document.hidden) appOpened = true; };
      document.addEventListener('visibilitychange', onHide);
      try { window.location.href = TG_APP; }
      catch (err) { console.error('[venn-cta] app launch failed:', err.message); }
      setTimeout(() => {
        document.removeEventListener('visibilitychange', onHide);
        // If the tab never hid, the app didn't open (the <2500ms guard ignores a timer
        // that fired late because the tab was backgrounded — i.e. the app did open).
        if (!appOpened && !document.hidden && Date.now() - t0 < 2500) {
          console.log('[venn-cta] Telegram app did not open — falling back to Telegram Web');
          window.location.href = TG_WEB;
        }
      }, 1200);
    });
  }

  setMouth('idle');
  setTimeout(blink, 1800 + Math.random() * 2000);

  // ── Badge face (toggle button) ─────────────────────────────────
  // Mirrors the panel face exactly — same SVG coordinate space
  const BADGE_CYCLE = ['idle','thinking','small','idle','mid','idle','open','idle'];
  const tleye   = document.getElementById('vwt-leye');
  const treye   = document.getElementById('vwt-reye');
  const tlpupil = document.getElementById('vwt-lpupil');
  const trpupil = document.getElementById('vwt-rpupil');
  const tlshine = document.getElementById('vwt-lshine');
  const trshine = document.getElementById('vwt-rshine');
  const tmouthEl = document.getElementById('vwt-mouth');
  let tEyePos = { dx:0, dy:0, squint:false };

  function setTMouth(k) { tmouthEl.innerHTML = getMouths()[k] || getMouths().idle; }

  function setTEyePos(dx, dy, squint) {
    tEyePos = { dx, dy, squint };
    const h = squint ? 30 : 44, y = squint ? 65 : 58;
    tleye.setAttribute('height', h);   tleye.setAttribute('y', y);
    treye.setAttribute('height', h);   treye.setAttribute('y', y);
    tlpupil.setAttribute('x', 50+dx);  tlpupil.setAttribute('y', 68+dy);
    trpupil.setAttribute('x', 142+dx); trpupil.setAttribute('y', 68+dy);
    tlshine.setAttribute('x', 50+dx);  tlshine.setAttribute('y', 68+dy);
    trshine.setAttribute('x', 142+dx); trshine.setAttribute('y', 68+dy);
  }

  let badgeCycleIdx = 0;
  function runBadgeCycle() {
    setTimeout(() => {
      const k = BADGE_CYCLE[badgeCycleIdx++ % BADGE_CYCLE.length];
      setTMouth(k);
      if (k === 'thinking') setTEyePos(...THINK_LOOKS[Math.floor(Math.random()*4)]);
      else setTEyePos(0,0,false);
      runBadgeCycle();
    }, 2200 + Math.random() * 800);
  }

  function tBlink() {
    const by = tEyePos.squint ? 79 : 78;
    tleye.setAttribute('height','4'); tleye.setAttribute('y', by);
    treye.setAttribute('height','4'); treye.setAttribute('y', by);
    [tlpupil,trpupil,tlshine,trshine].forEach(e => e.setAttribute('opacity','0'));
    setTimeout(() => {
      setTEyePos(tEyePos.dx, tEyePos.dy, tEyePos.squint);
      [tlpupil,trpupil,tlshine,trshine].forEach(e => e.removeAttribute('opacity'));
    }, 100);
    setTimeout(tBlink, 3000 + Math.random() * 4000);
  }

  setTMouth('idle');
  setTEyePos(0,0,false);
  setTimeout(tBlink, 2500 + Math.random() * 2000);
  runBadgeCycle();
})();
