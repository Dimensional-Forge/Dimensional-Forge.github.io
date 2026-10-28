// Client reviews: fetched from the Google Sheet via Apps Script

// ── REVIEWS ────────────────────────────────────────────────
const REVIEWS_API = 'https://script.google.com/macros/s/AKfycbxXXt5HtzjyGq_44WJbHuxVcjllRCSoJasuNIBgnvnvMVXO0m16w-LkcJOyDy5phoiG/exec';

async function fetchSheetReviews() {
  const res = await fetch(REVIEWS_API + '?t=' + Date.now());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function starsHtml(rating, cls = 'rv-card-star') {
  return [1,2,3,4,5].map(i => {
    const full = Math.floor(rating);
    const frac = rating - full;
    if (i <= full) {
      return `<span class="${cls}" style="color:var(--df-gold)">★</span>`;
    } else if (i === full + 1 && frac > 0) {
      const pct = Math.round(frac * 100);
      return `<span class="${cls}" style="position:relative;display:inline-block;color:var(--df-brush)">★<span style="position:absolute;left:0;top:0;overflow:hidden;width:${pct}%;color:var(--df-gold)">★</span></span>`;
    } else {
      return `<span class="${cls}" style="color:var(--df-brush)">★</span>`;
    }
  }).join('');
}

function renderReviews(reviews) {
  const list = document.getElementById('rv-list');
  list.innerHTML = reviews.length === 0
    ? '<p style="color:var(--df-muted);font-size:0.86rem;">No reviews yet. Be the first!</p>'
    : reviews.slice().reverse().map(r => `
      <div class="rv-card">
        <div class="rv-card-header">
          <span class="rv-card-name">${escHtml(r.name)}</span>
          <span class="rv-card-stars">${starsHtml(r.rating)}</span>
        </div>
        <div class="rv-card-date">${escHtml(r.date)}${r.project ? ' &nbsp;·&nbsp; ' + escHtml(r.project) : ''}</div>
        ${String(r.text || '').trim() ? `<div class="rv-card-text">${escHtml(r.text)}</div>` : ''}
      </div>`).join('');

  // Show the newest few; the rest sit behind "Show all"
  const RV_INITIAL = 6;
  const cards = list.querySelectorAll('.rv-card');
  const moreBtn = document.getElementById('rv-more');
  let expanded = false;
  const applyLimit = () => {
    cards.forEach((c, i) => c.classList.toggle('rv-hidden', !expanded && i >= RV_INITIAL));
    moreBtn.textContent = expanded ? 'Show fewer' : `Show all ${cards.length} reviews`;
  };
  moreBtn.hidden = cards.length <= RV_INITIAL;
  moreBtn.onclick = () => {
    expanded = !expanded;
    applyLimit();
    if (!expanded) document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
  };
  applyLimit();

  const total = reviews.length;
  const avg   = total ? (reviews.reduce((s, r) => s + parseFloat(r.rating), 0) / total) : 0;
  const dist  = [5,4,3,2,1].map(s => reviews.filter(r => Math.round(parseFloat(r.rating)) === s).length);

  document.getElementById('rv-score').textContent = total ? avg.toFixed(2) : '—';
  document.getElementById('rv-stars-display').innerHTML = total
    ? starsHtml(avg, 'rv-star-icon')
    : '';
  document.getElementById('rv-count').textContent =
    total === 0 ? 'No reviews yet'
    : total === 1 ? '1 review'
    : `${total} reviews`;

  const heroNum = document.getElementById('hero-rating-num');
  const heroLbl = document.getElementById('hero-rating-lbl');
  if (total === 0) {
    heroNum.textContent = '—';
    heroLbl.textContent = 'Client Rating';
  } else {
    heroNum.innerHTML = '<span style="color:var(--df-gold)">★</span>' + avg.toFixed(2);
    heroLbl.textContent = total === 1 ? 'Avg. Client Rating (1 review)' : `Avg. Client Rating (${total})`;
  }

  const barsEl = document.getElementById('rv-bars');
  barsEl.innerHTML = [5,4,3,2,1].map((s, i) => {
    const pct = total ? Math.round((dist[i] / total) * 100) : 0;
    return `<div class="rv-bar-row">
      <span class="rv-bar-label">${s}</span>
      <div class="rv-bar-track"><div class="rv-bar-fill" style="width:${pct}%"></div></div>
      <span class="rv-bar-n">${dist[i]}</span>
    </div>`;
  }).join('');
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('rv-list').innerHTML =
  '<p style="color:var(--df-muted);font-size:0.86rem;">Loading reviews…</p>';
fetchSheetReviews()
  .then(renderReviews)
  .catch(err => {
    console.error('[reviews] fetch failed:', err);
    document.getElementById('rv-list').innerHTML =
      '<p style="color:var(--df-muted);font-size:0.86rem;">Could not load reviews.</p>';
  });
