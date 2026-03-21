# 🐾 Love Paws Pet Sitting — Website

Official website for **Love Paws Pet Sitting by Gabi Romanini**, professional pet sitter in the Eindhoven area (Netherlands).

🔗 **URL:** https://lovepawspetsitting.com/ _(published 2026.03.18)_

---

## Project structure

```
lovepaws-website/
├── README.md                        ← this file
├── LICENSE                          ← GPL-3.0
├── .editorconfig
├── .gitignore
│
└── site/
    ├── index.html                   ← main page (all sections, i18n hooks, full SEO)
    ├── favicon.svg                  ← cartoon cat face favicon
    ├── robots.txt                   ← search engine crawling rules
    ├── sitemap.xml                  ← sitemap with hreflang EN / NL / PT-BR
    ├── .htaccess                    ← configuration file used by the Apache HTTP Server
    │
    ├── lang/                        ← translation files (edit copy here, not in HTML)
    │   ├── en.json                  ← English strings (default)
    │   ├── nl.json                  ← Dutch strings
    │   └── pt-BR.json               ← Brazilian Portuguese strings
    │
    └── assets/
        ├── css/
        │   └── styles.css           ← all styles (tab-indented)
        │
        ├── js/
        │   ├── i18n.js              ← language switcher + DOM text injection
        │   ├── main.js              ← navigation, scroll effects, gallery arrows
        │   └── contact.js           ← contact form + FormSubmit + sender metadata
        │
        └── images/
            ├── logo.png             ← Love Paws logo (transparent PNG, 240×178)
            ├── hero.jpg             ← hero section photo (800×1000)
            ├── about.jpg            ← Gabi's photo (About Me section, 600×800)
            ├── amora.jpg            ← photo of cat Amora (400×400)
            ├── panqueca.jpg         ← photo of cat Panqueca (400×400)
            ├── service-cat.jpg      ← Home Visits service card image (700×400)
            ├── service-dog.jpg      ← Dog Walking service card image (700×400)
            └── gallery/             ← gallery photos (400×400)
                ├── gallery-01.jpg
                ├── gallery-02.jpg
                ├── gallery-03.jpg
                ├── gallery-04.jpg
                ├── gallery-05.jpg
                ├── gallery-06.jpg
                ├── gallery-07.jpg
                ├── gallery-08.jpg
                ├── gallery-09.jpg
                ├── gallery-10.jpg
                ├── gallery-11.jpg
                └── gallery-12.jpg
```

---

## Multi-language

The site supports **English, Dutch and Brazilian Portuguese**. A language switcher appears in the navbar (desktop) and mobile menu. The chosen language persists across sessions via `localStorage`. The browser's language is auto-detected on first visit.

### Editing copy (text content)

All visible text lives in the `lang/` JSON files — **not** in `index.html`. To change a sentence, price description, button label or any other text:

1. Open the relevant file: `lang/en.json`, `lang/nl.json` or `lang/pt-BR.json`
2. Find the key and edit the value
3. Save — no HTML changes needed

The JSON files all share the same key structure. Example:

```json
"fees": {
  "standard": {
    "title": "Home Visit / Dog Walk",
    "desc": "Per visit, within a 5 km radius..."
  }
}
```

### Adding a new language

1. Copy `lang/en.json` → `lang/xx.json` (use a BCP-47 code, e.g. `de` for German)
2. Translate all values
3. Add a `<button class="lang-btn" data-lang="xx">XX</button>` to the switcher in `index.html`
4. Add the language to the `SUPPORTED` array in `assets/js/i18n.js`

---

## KVK registration

**KVK number: 95744193** (Kamer van Koophandel — Dutch Chamber of Commerce)

This number is displayed as a trust badge in the hero section and in the footer contact column. It is stored in the `lang/*.json` files under `footer.kvk_label`, `footer.kvk_number`, `footer.kvk_note`, and `hero.kvk_badge`. The acronym **KVK is not translated** in the English and Portuguese versions — only a short explanation is added.

---

## Contact form

The form uses **[FormSubmit.co](https://formsubmit.co)** — no account, no API keys, zero setup.

On the **first ever submission**, FormSubmit sends a one-time activation email to `gabi@lovepawspetsitting.com`. Click the confirmation link once — all future messages arrive directly.

Each submission also includes hidden sender metadata: IP address, country, city, browser, OS, screen size and timezone.

---

## Replacing images

Save your real photo with the **exact same filename** — no code changes needed.

| File | Where it appears | Recommended size |
|------|-----------------|-----------------|
| `logo.png` | Hero (large) + footer + nav fallback | Transparent PNG, any size |
| `hero.jpg` | Hero section right side | 800×1000 px |
| `about.jpg` | About Me | 600×800 px |
| `amora.jpg` | Amora cat card | 400×400 px |
| `panqueca.jpg` | Panqueca cat card | 400×400 px |
| `service-cat.jpg` | Home Visits service card | 700×400 px |
| `service-dog.jpg` | Dog Walking service card | 700×400 px |
| `gallery/gallery-01.jpg` … `gallery-12.jpg` | Scrollable photo gallery | 400×400 px |

**Tips:** compress free at [squoosh.app](https://squoosh.app). Use lowercase, no spaces.

---

## Running locally

⚠️ **You must serve the site over HTTP** — the language switcher uses `fetch()` to load the JSON files, which does not work when opening `index.html` directly as a `file://` URL.

```bash
# Run from the repository root
python3 -m http.server 8000
# then open http://localhost:8000/site/
```

---

## Terms & Conditions

Not yet implemented. Planned as a modal pop-up triggered by a link in the footer. The T&C text will live inside a `<div class="modal">` in `index.html`, with translations keyed in the `lang/` files.

---

## License

GNU General Public License v3.0 — see [LICENSE](LICENSE).
