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

fetch('https://discord.com/api/v10/invites/yXfwsWXSf?with_counts=true', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('Discord statistika trenutno nije dostupna.');
    return response.json();
  })
  .then(data => {
    const members = Number(data.approximate_member_count ?? 0);
    const online = Number(data.approximate_presence_count ?? 0);
    memberCount.classList.remove('is-loading');
    onlineCount.classList.remove('is-loading');
    animateNumber(memberCount, members);
    animateNumber(onlineCount, online);
    discordStatus.classList.add('is-online');
    discordStatus.innerHTML = '<i></i> Dostupan';
    discordStatusNote.textContent = 'javna pozivnica je aktivna';
    discordBoardText.textContent = 'Dostupna';
    discordDot.classList.add('online');
  })
  .catch(() => {
    memberCount.classList.remove('is-loading');
    onlineCount.classList.remove('is-loading');
    memberCount.textContent = 'Aktivno';
    onlineCount.textContent = '24/7';
    discordStatus.classList.add('is-offline');
    discordStatus.innerHTML = '<i></i> Nedostupno';
    discordStatusNote.textContent = 'javna provjera trenutno nije uspjela';
    discordBoardText.textContent = 'Provjera nije uspjela';
    discordDot.classList.add('offline');
  });

const visitorCount = document.getElementById('visitor-count');
fetch('https://api.counterapi.dev/v1/sake-zajednica/pregledi/up', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('Brojač trenutno nije dostupan.');
    return response.json();
  })
  .then(data => {
    const count = Number(data.count);
    visitorCount.textContent = Number.isFinite(count) ? numberFormat.format(count) : '—';
  })
  .catch(() => {
    visitorCount.textContent = '—';
    visitorCount.closest('.visitor-counter').title = 'Brojač trenutno nije dostupan';
  });
