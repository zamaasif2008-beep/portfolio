// ---- Preloader ----
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 900);
});

// ---- Scroll progress bar ----
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
});

// ---- Starfield ----
const starsContainer = document.getElementById('stars');
const starCount = 80;
for (let i = 0; i < starCount; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.animationDelay = `${Math.random() * 3}s`;
  star.style.animationDuration = `${2 + Math.random() * 3}s`;
  starsContainer.appendChild(star);
}

// ---- Typewriter tagline ----
const roles = ['Web Developer', 'AI Enthusiast', 'CodeKrafters Member', 'Hackathon Builder'];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    typewriterEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    typewriterEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ---- Smooth scroll for nav links ----
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// ---- Active nav link + sliding pill indicator ----
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const navContainer = document.querySelector('.nav-links');
const indicator = document.querySelector('.nav-indicator');

function moveIndicatorTo(link) {
  if (!link) return;
  const containerRect = navContainer.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  indicator.style.left = `${linkRect.left - containerRect.left}px`;
  indicator.style.width = `${linkRect.width}px`;
  indicator.style.opacity = '1';
}

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
  moveIndicatorTo(document.querySelector('.nav-links a.active'));
}

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);
navLinks.forEach(link => link.addEventListener('mouseenter', () => moveIndicatorTo(link)));
navContainer.addEventListener('mouseleave', () => moveIndicatorTo(document.querySelector('.nav-links a.active')));

// ---- Reveal sections on scroll ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Scroll-linked rocket rise ----
const rocketTrack = document.getElementById('rocketTrack');
const maxTravel = 250;

window.addEventListener('scroll', () => {
  if (document.getElementById('rocketOuter').classList.contains('launching')) return;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  rocketTrack.style.transform = `translateY(${-progress * maxTravel}px)`;
});

// ---- Mouse spotlight glow ----
const spotlight = document.getElementById('spotlight');
window.addEventListener('mousemove', (e) => {
  spotlight.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
});
window.addEventListener('mouseleave', () => spotlight.style.opacity = '0');
window.addEventListener('mouseenter', () => spotlight.style.opacity = '1');

// ---- 3D tilt on project cards ----
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ---- Rocket click easter egg ----
const rocketBtn = document.getElementById('rocketBtn');
const rocketOuter = document.getElementById('rocketOuter');

function playLaunchSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) { /* Web Audio unavailable — ignore */ }
}

function spawnSmoke() {
  const rect = rocketOuter.getBoundingClientRect();
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'smoke-particle';
    particle.style.left = `${rect.left + rect.width / 2 + (Math.random() * 30 - 15)}px`;
    particle.style.top = `${rect.bottom - 10}px`;
    particle.style.setProperty('--drift', `${Math.random() * 60 - 30}px`);
    particle.style.animationDelay = `${Math.random() * 0.2}s`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1100);
  }
}

if (rocketBtn) {
  rocketBtn.addEventListener('click', () => {
    if (rocketOuter.classList.contains('launching')) return;
    playLaunchSound();
    spawnSmoke();
    rocketOuter.classList.add('launching');
    
    // Reset rocket position after launch
    setTimeout(() => {
      rocketOuter.classList.remove('launching');
    }, 2500);
  });
}

// ---- Copy Email Toast ----
const emailCard = document.getElementById('emailCard');
const toast = document.getElementById('toast');

if (emailCard) {
  emailCard.addEventListener('click', () => {
    const email = emailCard.getAttribute('data-copy');
    navigator.clipboard.writeText(email).then(() => {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    });
  });
}