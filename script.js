const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');

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
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('godina').textContent = new Date().getFullYear();

// Javni brojač pregleda stranice. Cloudflare Analytics i dalje pruža precizniju privatnu statistiku.
const visitorCount = document.getElementById('visitor-count');
fetch('https://api.counterapi.dev/v1/sake-zajednica/pregledi/up')
  .then(response => {
    if (!response.ok) throw new Error('Brojač trenutno nije dostupan.');
    return response.json();
  })
  .then(data => {
    visitorCount.textContent = new Intl.NumberFormat('bs-BA').format(data.count);
  })
  .catch(() => {
    visitorCount.textContent = '—';
    visitorCount.closest('.visitor-counter').title = 'Brojač trenutno nije dostupan';
  });
