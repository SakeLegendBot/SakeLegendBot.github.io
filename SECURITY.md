# Sigurnost — Sake Zajednica web

## Dozvoljeni sadržaj repositoryja

Samo javne statičke datoteke: HTML, CSS, JavaScript, slike, manifest, sitemap i dokumentacija.

## Nikada ne objavljivati

- Discord bot token
- `.env` datoteke
- webhook URL-ove
- OAuth client secret
- API ključeve
- pristupne podatke za Render, GitHub ili Cloudflare
- backup baze podataka ili logove sa ličnim podacima

Ako je tajna ikada završila u commitu, nije dovoljno obrisati datoteku. Tajnu treba odmah opozvati ili rotirati, a zatim očistiti Git historiju.

## Javna površina stranice

Stranica nema prijavu, formu, bazu podataka niti mogućnost upravljanja botom. Jedini programski poziv iz browsera je javno čitanje približne Discord statistike. Cloudflare Web Analytics ostaje uključen kao vanjska skripta.

## Prijava problema

Sigurnosni problem prijaviti privatno vlasniku projekta, bez objavljivanja exploita ili osjetljivih detalja u javnom issueu.
