/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
})();

/* ── NAVBAR SCROLL ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── CANVAS PARTICLES ───────────────────────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 80;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x:    Math.random() * window.innerWidth,
    y:    Math.random() * window.innerHeight,
    r:    Math.random() * 1.5 + 0.3,
    dx:   (Math.random() - 0.5) * 0.25,
    dy:   (Math.random() - 0.5) * 0.25,
    opacity: Math.random() * 0.6 + 0.2,
    hue:  Math.random() > 0.7 ? 165 : (Math.random() > 0.5 ? 190 : 260),
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
    ctx.fill();
  });

  // Connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(74,222,128,${0.07 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── HERO BG PARALLAX ───────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg-img');
heroBg.classList.add('loaded');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  heroBg.style.transform = `scale(1) translateY(${y * 0.3}px)`;
});

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.feature-card');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ── VERSIONS ───────────────────────────────────────────────── */
const versionsData = {
  vanilla: [
    "1.21.4","1.21.3","1.21.1","1.21",
    "1.20.6","1.20.4","1.20.2","1.20.1","1.20",
    "1.19.4","1.19.3","1.19.2","1.19",
    "1.18.2","1.18.1","1.18",
    "1.17.1","1.17",
    "1.16.5","1.16.4","1.16.3","1.16.2","1.16.1","1.16",
    "1.15.2","1.15.1","1.15",
    "1.12.2","1.12.1","1.12",
    "1.8.9","1.8","1.7.10",
  ],
  forge: [
    "1.21.1-Forge","1.20.4-Forge","1.20.1-Forge",
    "1.19.4-Forge","1.19.2-Forge","1.18.2-Forge",
    "1.16.5-Forge","1.12.2-Forge",
  ],
  fabric: [
    "1.21.4-Fabric","1.21.1-Fabric","1.20.6-Fabric",
    "1.20.4-Fabric","1.20.1-Fabric","1.19.4-Fabric",
    "1.19.2-Fabric","1.18.2-Fabric",
  ],
};

const grid = document.getElementById('versions-grid');
function renderVersions(type) {
  grid.innerHTML = '';
  versionsData[type].forEach((v, i) => {
    const pill = document.createElement('div');
    pill.className = 'ver-pill' + (i === 0 ? ' latest' : '');
    pill.textContent = v;
    pill.style.animationDelay = (i * 30) + 'ms';
    grid.appendChild(pill);
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderVersions(tab.dataset.tab);
  });
});
renderVersions('vanilla');

/* ── DOWNLOAD BUTTON FLASH ──────────────────────────────────── */
const dlBtn = document.getElementById('dl-win');
if (dlBtn) {
  dlBtn.addEventListener('click', e => {
    e.preventDefault();
    const orig = dlBtn.querySelector('span').textContent;
    dlBtn.querySelector('span').textContent = '✓ Letöltés elindítva!';
    dlBtn.style.background = '#22c55e';
    setTimeout(() => {
      dlBtn.querySelector('span').textContent = orig;
      dlBtn.style.background = '';
    }, 2200);
   window.location.href = 'MineLife.exe';
  });
}
