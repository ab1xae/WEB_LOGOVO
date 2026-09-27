# What we deleted and what replaced it

Assignment 2 had four stylesheets and 1132 lines: `base.css` 294, `abylay.css` 247,
`rustem.css` 254, `alfarabi.css` 337. All four are deleted. What is left is
`css/custom.css`, 68 lines, with no layout rule in it. The old files are in the git history.

| what we had | what does it now |
| --- | --- |
| our own grids: `.service-list`, `.step-list`, `.barber-list`, `.level-prices`, `.design-list`, `.symbol-list`, `.timeline`, `.stats-list`, `.glossary-list`, `#photos`, `.booking-form` | `row` and `col-*` with the `g-*` gutters |
| floats and their `clear: both`: `.float-photo`, `.intro-photo`, `.inline-photo`, `.emblem` | grid columns, and `order-md-last` for the emblem |
| `main { max-width: 1100px; margin: 2rem auto }` | `container`, and `container-fluid` on the gallery |
| `main > section { margin-top: 2.5rem }`, `.form-actions { gap }` | `mt-5`, `gap-2`, `mb-*` |
| the whole navigation: `nav > ul { display: flex }`, `nav a`, `nav a:hover` | `navbar navbar-expand-lg` with `navbar-toggler`, `collapse` and `sticky-top` |
| `button {}`, `button:hover`, `.book-cta`, `.book-now`, `.top-link` | `btn` with `btn-warning`, `btn-primary`, `btn-outline-*`, `btn-lg`, `btn-sm`, and `position-fixed bottom-0 end-0 m-3` |
| our boxes: `.service-group`, `.barber-card`, `.design-card`, `.milestone`, `.photo-card`, `.numbers-box`, `.photo-frame` | the `card` component with `card-body h-100`, or `bg-white border rounded shadow-sm` |
| our badges: `.offer-badge`, `.level-badge`, `.milestone-year`, `.gift-note`, `.rating-badge` | `badge` with `text-bg-dark` or `text-bg-warning`, `alert alert-warning`, and `position-absolute top-0 end-0` |
| `table`, `th`, `td`, `thead th`, the `:nth-child` stripes, `.price-table { width: 90% }` | `table table-striped table-bordered`, `table-dark`, `caption-top`, `table-responsive` |
| `input`, `select`, `textarea`, `fieldset`, `legend` and their widths | `form-control`, `form-select`, `form-check`, `form-label`, `float-none w-auto` |
| `h1`/`h2` sizes, `.tagline`, `.highlight-text`, `figcaption` | `display-5`, `lead`, `fs-*`, `fw-*`, `text-*`, `figure-caption` |
| `img { max-width: 100% }`, the fixed photo heights with `object-fit` | `img-fluid`, and `ratio ratio-4x3` with `object-fit-cover` |
| the three specificity experiments on the caption, the table head and the badges | deleted, the two barber levels are told apart by `text-bg-dark` and `text-bg-warning` |
| decoration: the hover zoom, the arrow after external links, the big quote mark | dropped; the dash before the name comes from `blockquote-footer` |
| `a:focus { outline: 3px solid #c9a24d !important }` | Bootstrap draws the focus ring itself |

## What stayed and why

- The palette, in the Bootstrap variables. One block of values repaints every utility at once.
- The heading font. Bootstrap has no custom property for it.
- `btn-warning` and `btn-primary`. The buttons keep their colours in their own variables.
- The navbar hover colour. Same reason.
- The phone sign before `tel:` links. Generated content has no utility class.
- `.avatar` and `.avatar-lg`, two width and height pairs. Bootstrap has no fixed-size box utility.
