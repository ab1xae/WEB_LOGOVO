# LOGOVO Barbershop

## Team

- Abylay Utemis — services.html, booking.html, `css/abylay.css`
- Rustem Gazymbekov — about.html, gallery.html, `css/rustem.css`
- Alfarabi — team.html, history.html, `css/alfarabi.css`
- index.html and `css/base.css` — made together

## Theme

**LOGOVO Barbershop** — a men's barbershop in Astana.
Address: Mangilik El 51/2. Working hours: 10:00–21:00, every day.
Phone: +7 700 396 8940. Email: logovo.barbershop@mail.ru

## Repository structure

```
/
├── index.html          — home page
├── services.html       — services and price list (Abylay)
├── booking.html        — booking form (Abylay)
├── team.html           — our barbers, prices per level, hair designs (Alfarabi)
├── history.html        — history of LOGOVO, the name and the wolf emblem (Alfarabi)
├── about.html          — about us, interview with the barber (Rustem)
├── gallery.html        — photo gallery (Rustem)
├── css/
│   ├── base.css        — common styles: palette, fonts, header, nav, main, footer
│   ├── abylay.css      — styles of Abylay
│   ├── rustem.css      — styles of Rustem
│   └── alfarabi.css    — styles of Alfarabi
├── images/             — our photos and the logo
├── screenshots/
│   ├── before/         — pages before CSS
│   └── after/          — pages after CSS
├── sketches/           — hand-drawn sketches of the pages
└── report/             — PDF report from assignment 1
```

## CSS

Every page links `css/base.css` first and then the personal file of the author.
The palette (5 colours) is in a comment at the top of `css/base.css`.
Fonts: Georgia for headings, Segoe UI for text, both with fallbacks.
The one internal `<style>` and the one inline `style` are on `index.html`.
The one `!important` is in `css/base.css` (focus ring).
The specificity experiment is in every personal file, look for "specificity experiment".

## How to open

Plain HTML and CSS, no JavaScript, no frameworks.

## Validation

All pages pass the [W3C HTML validator](https://validator.w3.org/) and all stylesheets pass the
[W3C CSS validator](https://jigsaw.w3.org/css-validator/) with zero errors.
