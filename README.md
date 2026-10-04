# LOGOVO Barbershop
A website for LOGOVO, a men's barbershop in Astana, built with HTML and Bootstrap 5.3.8.
Mangilik El 51/2, every day 10:00-21:00, +7 700 396 8940.

## Team
- Abylay Utemis — services.html, booking.html
- Rustem Gazymbekov — about.html, gallery.html
- Alfarabi Yakhiya — team.html, history.html
- index.html and `css/custom.css` — made together

## Pages
All pages share the same header, menu, footer and the "Book a visit" button.

- `index.html` — home: address, hours, contacts, map link
- `services.html` — price list for the three barber levels, a Book button in every row
- `booking.html` — booking form with a summary and the total
- `team.html` — our barbers by level, their prices and hair designs
- `history.html` — the story of LOGOVO and the wolf emblem
- `about.html` — about us, interview with the senior barber, review form
- `gallery.html` — our photos from inside the barbershop

## Three user journeys
There is no JavaScript yet, so the forms do not show a result. The places for the result
are already on the pages, JavaScript will fill them in assignment 5.

**1. Find the address and the opening hours**
- Start: `index.html`
- Steps: read the "Quick Info" block
- End: open the place on the 2GIS map or call the phone number

**2. Compare services and book one**
- Start: `services.html`
- Steps: compare the prices of two services, press **Book** in the chosen row,
  fill in the booking form
- End: press **Book** — the browser checks the fields, the confirmation will appear
  in `#booking-result`

**3. Read about the team and book a barber**
- Start: `team.html`
- Steps: read about the barber levels, open Akhmadzhon's interview,
  press **Book with Akhmadzhon**, fill in the booking form
- End: press **Book** — same as journey 2

## Prepared for JavaScript
- **Names:** all ids and classes are in English, lowercase, with hyphens (`booking-form`, `client-phone`).
- **Empty containers:**
  - `booking-errors` and `review-errors` — the list of mistakes in a form
  - `booking-result` and `review-result` — the confirmation and the thank-you message
  - `booking-summary` and `booking-total` — the chosen service, barber, time and price
- **Book links** pass the choice in the address (`?service=beard`, `?barber=ilyas`),
  the values match the options of the booking form.
- **Prices** are stored in the booking form options as `data-price-lead`, `data-price-top`,
  `data-price-senior`; the barbers have `data-level`.
- **State classes** in `css/custom.css`: `is-hidden`, `is-active`, `is-selected`, `is-error`, `is-success`.
- **Field errors** use Bootstrap `is-invalid` with the `invalid-feedback` text under each required field.

## Folders
- `css/` — our stylesheet
- `images/` — our own photos and the logo
- `screenshots/midterm/` — every page at phone (375px) and desktop (1440px) width
- `screenshots/` — older screenshots from assignments 2 and 3
- `sketches/` — hand-drawn sketches
- `report/` — PDF report from assignment 1

## How to open
Open `index.html` in a browser.

## Quality pass
What we found and fixed:
- The booking form did not say what happens after "Book" — added the text, the summary and the result area.
- The booking form had no time and no barber choice — added both, plus all services and hair designs.
- "Pay online (soon)" button — removed.
- No way to book from the price list or the team page — added Book buttons.
- The site showed two barber levels, the price stand has three — added the lead level.
- Akhmadzhon "works since 2023", but LOGOVO opened in 2024 — fixed to 2024.
- The review form had no message after sending — added the text and the result area.
- Different floating buttons on every page — one "Book a visit" button everywhere.
- Some buttons had no id, one id was in camelCase — fixed.
- Headings were written in different styles — made the same.
- The gift "wax hair removal" was translated as "hair wax" — fixed.
- The services page was wider than a phone screen — fixed.
- Some colours were Bootstrap blue instead of ours — fixed.
- Photos were 24 MB together — resized to about 1.8 MB.

## Checks
- All pages pass the W3C HTML validator, `custom.css` passes the W3C CSS validator.
- No console errors, no broken images and no broken links.
- No horizontal scroll at phone width (375px).
