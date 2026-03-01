/* ===========================
   ECLIPSE INTERACTIVE — JS
   =========================== */

// ─── NAV SCROLL ───
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── HAMBURGER ───
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });
}

// ─── ACTIVE NAV LINK ───
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ─── SCROLL ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-in').forEach((el, i) => {
  el.dataset.delay = (i % 6) * 80;
  observer.observe(el);
});

// ─── STAGGER CHILDREN ───
document.querySelectorAll('.stagger-children').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.classList.add('fade-up');
    child.dataset.delay = i * 120;
    observer.observe(child);
  });
});

// ─── HERO COUNTER ANIMATION ───
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.count), 1500);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

// ─── ARCADE STARS ───
function createStars(container, count = 50) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      background: hsl(${Math.random() * 360},100%,70%);
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.7 + 0.3};
      animation: twinkle ${Math.random() * 2 + 1}s ease-in-out ${Math.random() * 2}s infinite alternate;
      box-shadow: 0 0 ${Math.random() * 4 + 2}px currentColor;
    `;
    container.appendChild(star);
  }
}

document.querySelectorAll('.arcade-art .stars').forEach(c => createStars(c));

// ─── HORROR BLOOD DRIPS ───
function createDrips(container, count = 8) {
  for (let i = 0; i < count; i++) {
    const drip = document.createElement('div');
    drip.classList.add('blood-drip');
    drip.style.cssText = `
      left: ${Math.random() * 90 + 5}%;
      animation-duration: ${Math.random() * 3 + 2}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: ${Math.random() * 0.5 + 0.3};
      width: ${Math.floor(Math.random() * 3) + 2}px;
    `;
    container.appendChild(drip);
  }
}

document.querySelectorAll('.horror-art').forEach(c => createDrips(c));

// ─── CURSOR TRAIL (hero only) ───
const trail = [];
const TRAIL_COUNT = 12;
for (let i = 0; i < TRAIL_COUNT; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: ${6 - i * 0.4}px;
    height: ${6 - i * 0.4}px;
    background: rgba(124,111,255,${0.6 - i * 0.05});
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: opacity 0.2s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(dot);
  trail.push({ el: dot, x: 0, y: 0 });
}

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateTrail() {
  let x = mouseX, y = mouseY;
  trail.forEach((dot, i) => {
    dot.el.style.left = (dot.x - 3) + 'px';
    dot.el.style.top = (dot.y - 3) + 'px';
    dot.x += (x - dot.x) * (0.3 - i * 0.02);
    dot.y += (y - dot.y) * (0.3 - i * 0.02);
    x = dot.x;
    y = dot.y;
  });
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ─── PARALLAX HERO ───
const heroContent = document.querySelector('.hero-content');
const heroOrbs = document.querySelector('.hero-orbs');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroContent) heroContent.style.transform = `translateY(${y * 0.25}px)`;
  if (heroOrbs) heroOrbs.style.transform = `translateY(${y * 0.15}px)`;
});

// ─── INJECT TWINKLE KEYFRAME ───
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle { from{opacity: 0.2} to{opacity: 1} }
  @keyframes drip { 0%,100%{height:20px;opacity:0.3} 50%{height:80px;opacity:0.7} }
`;
document.head.appendChild(style);
