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
Since assignment 5 every journey ends with a result on the page (see the Functionality Plan below).

**1. Find the address and the opening hours**
- Start: `index.html`
- Steps: read the "Quick Info" block
- End: open the place on the 2GIS map or call the phone number

**2. Compare services and book one**
- Start: `services.html`
- Steps: compare the prices of two services, press **Book** in the chosen row,
  fill in the booking form
- End: press **Book** — JavaScript checks every field and shows a demonstration summary
  with a reference number in `#booking-result`

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
- `js/` — `main.js` for every page and one script per page
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

## Assignments 4–5: JavaScript

### Midterm corrections
The HTML and CSS are frozen at the `midterm` tag. Only `<script>` links were added, plus two
text corrections (no points for them):
- `booking.html`, `#booking-next` — said "LOGOVO calls you to confirm the visit". The form sends
  nothing, so the text now says it shows a demonstration summary.
- `about.html`, `#review-next` — said "your review goes to the LOGOVO team, we write to your email".
  Now it says the review is only added to the list on the page.

Everything else (search fields, review cards, the photo viewer, the price comparison) is created
with DOM methods in `js/`. States use the midterm classes `is-hidden`, `is-active`, `is-selected`,
`is-error`, `is-success` and Bootstrap `is-invalid` / `is-valid`.

### Functionality Plan
| Page | Visitor goal | Function | Expected result | Student |
|---|---|---|---|---|
| every page | Know if LOGOVO is open now | Open status in the footer (`main.js`) | "Open now, closes at 21:00 (in 2 h 15 min)" or "Closed now, opens at 10:00" | whole team |
| services.html | Find a service and its price | Search + category + sort over the price list | Matching rows, "Showing N of 12", no-results row with reset, Book link in every row | Abylay Utemis |
| booking.html | Book a visit | Live summary and total, form validation, confirmation | Errors beside fields, then a summary with a demo reference number, nothing is sent | Abylay Utemis |
| about.html | Read and leave a review | Review cards from an array, rating filter, average rating | Cards with name, rating, barber level, date and time; count, empty state, reset | Rustem Gazymbekov |
| about.html | Leave a review | Review form validation with a character counter | New review card at the top of the list, demonstration message | Rustem Gazymbekov |
| gallery.html | Look at the photos closer | Photo viewer with Previous / Next, arrow keys and Esc | Large photo, "Photo 2 of 4", a next action link for every photo | Rustem Gazymbekov |
| team.html | Find a barber | Search by name + level filter | Matching barber cards, "Showing N of 9", empty state with reset | Alfarabi Yakhiya |
| team.html | Choose a level by price | Compare the price of a service at the three levels | Three cards with the total, lowest price marked, Book link with the level | Alfarabi Yakhiya |

Not used: cart (you book one visit and pay at the barbershop), login/registration (no such pages).

### JavaScript checklist
| Requirement | File and lines |
|---|---|
| `'use strict'`, `defer`, no `var`, `==`, inline events | line 1 of every file in `js/`, script links at the end of every page |
| Array of 6+ objects, 4+ properties | `js/main.js:7` (12 services), `js/team.js:3` (9 barbers), `js/about.js:22`, `js/gallery.js:5` |
| Loop / filter / find / map / total | `js/services.js:65`, `js/team.js:67`, `js/team.js:198`, `js/about.js:80` (reduce, average), `js/main.js:33` |
| Reusable functions with parameters and return values | `js/main.js:24` getPrice, `:32` getLowestPrice, `:41` formatPrice, `:48` makeReference, `:52` createElement |
| A function that calls another | `js/main.js:32` getLowestPrice calls getPrice, `js/team.js:148` getVisitPrice calls getPrice |
| Arithmetic | `js/booking.js:126` total × people, `js/about.js:83` average, `js/gallery.js:38` next photo, `js/main.js:145` time left |
| if/else, `&&`, `\|\|`, `===`, `!==` | `js/main.js:26`, `js/main.js:88`, `js/main.js:144`, `js/services.js:68`, `js/booking.js:178`, `js/booking.js:221` |
| `Math.random()` | `js/main.js:49` demo reference number, used in `js/booking.js:278` |
| One function renders repeated items | `js/services.js:97` rows, `js/about.js:95` review cards, `js/gallery.js:41` photos, `js/team.js:170` level cards |
| Search / filter / sort, count, no results, reset | `js/services.js:137`, `js/team.js:74`, `js/about.js:121` |
| Calculation flow | `js/booking.js:126` total, `js/team.js:197` price by level |
| Events: submit, click, input, change, keydown, reset | `js/booking.js:303-320`, `js/about.js:203-256`, `js/services.js:160-163`, `js/gallery.js:110` |
| Create / remove elements, `classList` states | `js/main.js:126` error list, `js/booking.js:255`, `js/gallery.js:68`, `js/team.js:82`, `js/about.js:148` (`is-error` / `is-success`) |
| Form validation (4+ fields, combined rules, focus first error) | `js/booking.js:227`, `js/about.js:183`, shared helpers `js/main.js:94-140` |
| Character counter | `js/about.js:139` |
| `textContent` for user text | `js/main.js:58`, all user text goes through `createElement` |

Validation rules on the booking form: name (trimmed, 2–40 letters), phone (+7 / 8 and 10 digits),
email, comment up to 300 characters, service, barber, date (not in the past, up to 30 days ahead),
time (not passed if the date is today), 1–5 people. Rules that combine fields: a lead barber does not
do the perm, the free bonus is only with a top or senior barber and only with a haircut,
a hair design only with a haircut.

Review form: name, email, optional phone, date of visit (not in the future, not before 2024 when
LOGOVO opened), 1–100 visits, review 20–500 characters, and with a rating of 3 or less at least
50 characters.

### Checks
- Tested in Chrome: every form with empty, wrong and correct data, reset, repeated submit.
- No console errors on any page.
- No horizontal scroll at 375 px and 768 px width.

### Evidence
Screenshots in `screenshots/assignment-5/`:
- `services-filter.png`, `services-no-results.png` — category + sort, empty result with reset
- `booking-summary.png`, `booking-errors.png`, `booking-success.png`, `booking-success-phone.png` — live total, errors beside fields, demo confirmation
- `review-errors.png`, `review-added.png`, `review-added-phone.png`, `review-filter-empty.png` — review validation, new card, empty filter
- `team-finder.png`, `team-compare.png` — barber search with empty state, price by level
- `gallery-viewer.png`, `gallery-viewer-phone.png` — photo viewer
- `footer-open-status.png` — open status on every page
