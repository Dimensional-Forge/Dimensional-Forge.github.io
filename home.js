// Homepage: old portfolio links, inquiry form, featured proposals, Substack pill

// Old portfolio deep links: leadership now lives in About, the rest on the Portfolio page
if (location.hash === '#leadership') {
  location.replace('#about');
} else if (/^#(work|systems|mechanical|electrical|software|ai)$/.test(location.hash)) {
  location.replace('portfolio.html');
}

// Inquiry form → mailto with pre-filled body
document.getElementById('inquiry-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name    = this.elements['name'].value.trim();
  const email   = this.elements['email'].value.trim();
  const service = this.elements['service'].value;
  const brief   = this.elements['body'].value.trim();
  const subject = encodeURIComponent('Project Brief — ' + (service || 'General Inquiry'));
  const body    = encodeURIComponent(
    'Name: '    + name    + '\n' +
    'Email: '   + email   + '\n' +
    'Service: ' + (service || 'Not specified') + '\n\n' +
    'Project Brief:\n' + brief
  );
  window.location.href = 'mailto:ConnectWithSean@the-dimensional-forge.net?subject=' + subject + '&body=' + body;
});

// Featured proposals: the rest sit behind "See all"
const propGrid = document.querySelector('#delivered .proposals-grid');
const propToggle = document.getElementById('proposals-toggle');
if (propGrid && propToggle) {
  const total = propGrid.querySelectorAll('.proposal-card').length;
  propToggle.addEventListener('click', () => {
    const open = propGrid.classList.toggle('show-all');
    propToggle.setAttribute('aria-expanded', open);
    propToggle.textContent = open ? 'Show featured only' : `See all ${total} accepted proposals`;
    if (!open) document.getElementById('delivered').scrollIntoView({ behavior: 'smooth' });
  });
}

// Substack latest post pill — data written daily by GitHub Actions
(async () => {
  try {
    const res = await fetch('./latest-post.json');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.title) return;
    document.getElementById('sp-title').textContent = data.title;
    document.getElementById('sp-desc').textContent = data.desc || '';
    document.getElementById('sp-meta').textContent = data.date || '';
    const pill = document.getElementById('substack-pill');
    pill.href = data.link || '#';
    pill.style.display = 'flex';
  } catch (_) { /* hide silently on failure */ }
})();
