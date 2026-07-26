# Sake Zajednica — web v3.0

Kompletna statička web-prezentacija Sake Discord zajednice na bosanskom jeziku.

## Šta donosi v3.0

- proširena sekcija „Šta te čeka“
- pregled level rankova: Baraba, Radioaktivan, Ljudina i Legenda
- javni status bez izmišljanja statusa bota
- animirani Discord brojači
- aktivna navigacija prema trenutnoj sekciji
- indikator napretka kroz stranicu i dugme za povratak na vrh
- WebP slike za znatno brže učitavanje
- PWA manifest i ikone za instalaciju stranice
- SEO: canonical, Open Graph, Twitter kartice, strukturirani podaci, sitemap i robots.txt
- posebna stranica privatnosti i prilagođena 404 stranica
- zadržani Cloudflare Web Analytics i javni brojač pregleda

## Objavljivanje na GitHub Pages

1. Kopiraj sve datoteke iz ovog paketa u root GitHub repositoryja.
2. Zamijeni postojeće `index.html`, `style.css`, `script.js` i `README.md`.
3. Dodaj sve nove datoteke: `privacy.html`, `404.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, WebP slike i favicon ikone.
4. Commitaj i pushaj promjene na `main` branch.
5. GitHub Pages će automatski objaviti novu verziju.

## Važne napomene

- Discord statistika koristi javni invite API i prikazuje približne vrijednosti.
- Discord invite API ne potvrđuje status Sake bota. Zato stranica ne tvrdi da je bot online bez direktnog izvora.
- Sake bot je opisan samo kroz osnovne javne mogućnosti. Komande, interna logika i zaštitni sistemi nisu objavljeni.
- Javni brojač pregleda koristi CounterAPI, a Cloudflare Web Analytics anonimnu statistiku posjeta.
