# CLAUDE.md — Panda Auto Detailing Toruń

Statyczna strona wizytówka (bez systemu budowania). Klient: Panda Auto Detailing Toruń (Adrian Lewiński). Wykonawca: KonradzkiMedia. Domena: pandadetailing.pl.

## Struktura

- `index.html` — strona główna (hero, o nas, usługi, proces, realizacje, cennik, kontakt)
- `uslugi.html` — pełna lista usług
- `polityka-prywatnosci.html` — polityka prywatności (RODO)
- `404.html` — strona błędu (style i skrypt inline, celowo bez zależności zewnętrznych)
- `css/style.css` — główny arkusz; `css/uslugi.css` — dodatki podstrony usług
- `js/main.js` — logika strony głównej; `js/uslugi.js` — podstrona usług
- `media/` — obrazy (WebP serwowane, `.JPG` jako źródło), logo, `og-image.jpg`, SVG
- `robots.txt`, `sitemap.xml`

## Konwencje

- **Wcięcia TABami** w HTML i CSS — trzymaj się tego przy edycji.
- Design tokens w `:root` (`css/style.css`): ciemny motyw, akcent `#ffb000`. Fonty: Bebas Neue (nagłówki), Inter (tekst), JetBrains Mono (liczby/etykiety).
- GSAP z **jsDelivr**: core `gsap@3.15`, wtyczki ScrollTrigger + ScrollToPlugin `@3.14.1`. (Wersje core/wtyczek się rozjeżdżają — jeśli animacje się psują, najpierw ujednolić do jednej wersji.)
- Cała logika GSAP w `main.js` jest w jednym `try/catch`. Rzeczy, które muszą działać nawet gdy CDN padnie (rok w stopce, lazy-load mapy), są **poza** tym `try`.
- Mapa Google ładowana leniwie (IntersectionObserver na `#kontakt`, ≈ koniec cennika), nie na klik. Adres iframe w `data-map-src` na `#mapa`.
- Ceny w `<script type="application/ld+json">` (schema.org) muszą pozostać zgodne z sekcją `#cennik`.

## Styl kodu — unikaj "AI slop"

Strona ma wyglądać na zrobioną ręcznie. W praktyce:

- **Bez hoverów na elementach nieklikalnych** (kafle `.service-card` to `<article>`, nie linki).
- **Zero zakomentowanego martwego kodu** — usuwać całkowicie (z nieużywanymi helperami włącznie).
- **Komentarze krótkie, jednolinijkowe, mówiące „dlaczego"** — nie akapity, nie narracja powtarzająca kod, bez numerowania sekcji i marketingowych wtrętów.

## Obrazy (WebP)

Konwersja przez `sharp`: `.rotate()` (EXIF) → resize długi bok max 2000px → `.webp({ quality: 80 })`. Atrybuty `width`/`height` na `<img>` muszą odpowiadać realnym wymiarom pliku WebP. Logo trzymane jako zoptymalizowany paletowy PNG.

Gotcha: `width`/`height` na `<img>` tworzą prezentacyjną wysokość, która nadpisuje CSS `aspect-ratio` (obraz się rozciąga) — w takim wypadku dać `height: auto` w CSS.

## Deploy / cache

Serwer (openresty) serwuje CSS/JS **bez `Cache-Control`** — po wgraniu zmian przeglądarki potrafią pokazywać starą wersję (objaw: „działa lokalnie, nie na serwerze"). Weryfikacja: `curl` żywej strony i porównanie z plikami lokalnymi — jeśli identyczne, to cache przeglądarki (`Ctrl+Shift+R`). Nie dodawać cache-bustingu `?v=` na stałe bez uzgodnienia.
