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

document.querySelectorAll('details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('details[open]').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('godina').textContent = new Date().getFullYear();

const numberFormat = new Intl.NumberFormat('bs-BA');

// Discord javni invite API daje samo približan broj članova i online korisnika.
fetch('https://discord.com/api/v10/invites/yXfwsWXSf?with_counts=true', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('Discord statistika trenutno nije dostupna.');
    return response.json();
  })
  .then(data => {
    document.getElementById('member-count').textContent = numberFormat.format(data.approximate_member_count ?? 0);
    document.getElementById('online-count').textContent = numberFormat.format(data.approximate_presence_count ?? 0);
  })
  .catch(() => {
    document.getElementById('member-count').textContent = 'Aktivno';
    document.getElementById('online-count').textContent = '24/7';
  });

// Javni brojač pregleda; Cloudflare Analytics ostaje precizniji privatni izvor.
const visitorCount = document.getElementById('visitor-count');
fetch('https://api.counterapi.dev/v1/sake-zajednica/pregledi/up', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('Brojač trenutno nije dostupan.');
    return response.json();
  })
  .then(data => { visitorCount.textContent = numberFormat.format(data.count); })
  .catch(() => {
    visitorCount.textContent = '—';
    visitorCount.closest('.visitor-counter').title = 'Brojač trenutno nije dostupan';
  });
