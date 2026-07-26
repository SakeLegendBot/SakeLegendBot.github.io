const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const progressBar = document.getElementById('page-progress-bar');
const backToTop = document.getElementById('back-to-top');
const numberFormat = new Intl.NumberFormat('bs-BA');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otvori meni');
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Zatvori meni' : 'Otvori meni');
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0;
  header.classList.toggle('scrolled', scrollTop > 20);
  backToTop.classList.toggle('visible', scrollTop > 700);
  progressBar.style.width = `${percent}%`;
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

document.querySelectorAll('details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('details[open]').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.getElementById('godina').textContent = new Date().getFullYear();

const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const activeSectionObserver = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  sectionLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${visible.target.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5] });

sections.forEach(section => activeSectionObserver.observe(section));

function animateNumber(element, target) {
  if (prefersReducedMotion || !Number.isFinite(target)) {
    element.textContent = numberFormat.format(target);
    return;
  }
  const duration = 850;
  const start = performance.now();
  const tick = now => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = numberFormat.format(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const memberCount = document.getElementById('member-count');
const onlineCount = document.getElementById('online-count');
const discordStatus = document.getElementById('discord-status');
const discordStatusNote = document.getElementById('discord-status-note');
const discordBoardText = document.getElementById('discord-board-text');
const discordDot = document.getElementById('discord-dot');

memberCount.classList.add('is-loading');
onlineCount.classList.add('is-loading');

function setStatus(element, label, stateClass) {
  const dot = document.createElement('i');
  dot.setAttribute('aria-hidden', 'true');
  element.classList.remove('is-online', 'is-offline');
  element.classList.add(stateClass);
  element.replaceChildren(dot, document.createTextNode(` ${label}`));
}

const discordController = new AbortController();
const discordTimeout = window.setTimeout(() => discordController.abort(), 6000);

fetch('https://discord.com/api/v10/invites/yXfwsWXSf?with_counts=true', {
  cache: 'no-store',
  credentials: 'omit',
  referrerPolicy: 'no-referrer',
  signal: discordController.signal
})
  .then(response => {
    if (!response.ok) throw new Error('Discord statistika trenutno nije dostupna.');
    const type = response.headers.get('content-type') || '';
    if (!type.includes('application/json')) throw new Error('Neočekivan odgovor Discord servisa.');
    return response.json();
  })
  .then(data => {
    window.clearTimeout(discordTimeout);
    const members = Number(data.approximate_member_count);
    const online = Number(data.approximate_presence_count);
    if (!Number.isSafeInteger(members) || members < 0 || members > 100000000 ||
        !Number.isSafeInteger(online) || online < 0 || online > 100000000) {
      throw new Error('Nevažeći statistički podaci.');
    }
    memberCount.classList.remove('is-loading');
    onlineCount.classList.remove('is-loading');
    animateNumber(memberCount, members);
    animateNumber(onlineCount, online);
    setStatus(discordStatus, 'Dostupan', 'is-online');
    discordStatusNote.textContent = 'javna pozivnica je aktivna';
    discordBoardText.textContent = 'Dostupna';
    discordDot.classList.add('online');
  })
  .catch(() => {
    window.clearTimeout(discordTimeout);
    memberCount.classList.remove('is-loading');
    onlineCount.classList.remove('is-loading');
    memberCount.textContent = 'Aktivno';
    onlineCount.textContent = '24/7';
    setStatus(discordStatus, 'Nedostupno', 'is-offline');
    discordStatusNote.textContent = 'javna provjera trenutno nije uspjela';
    discordBoardText.textContent = 'Provjera nije uspjela';
    discordDot.classList.add('offline');
  });

