# Tag Checklist — LOGOVO Barbershop

Assignment 1, Introduction to Web Technologies, Astana IT University.

Students:
- **Abylay** = Abylay Utemis — services.html, booking.html
- **Rustem** = Rustem Gazymbekov — about.html, gallery.html
- index.html and colophon.html were made together

Line numbers are from the final version of the files.

## 1. Required on every page

| Requirement | index.html | colophon.html | services.html | booking.html | about.html | gallery.html |
|---|---|---|---|---|---|---|
| `<!DOCTYPE html>` | 1 | 1 | 1 | 1 | 1 | 1 |
| `<html lang="en">` | 2 | 2 | 2 | 2 | 2 | 2 |
| `<meta charset>` | 4 | 4 | 4 | 4 | 4 | 4 |
| `<meta name="viewport">` | 5 | 5 | 5 | 5 | 5 | 5 |
| `<meta name="description">` | 6 | 6 | 6 | 6 | 6 | 6 |
| `<meta name="author">` | 7 | 7 | 7 | 7 | 7 | 7 |
| unique `<title>` | 8 | 8 | 8 | 8 | 8 | 8 |
| author name in HTML comment | 11 | 11 | 11 | 11 | 11 | 11 |
| exactly one `<h1>` | 14 | 14 | 14 | 14 | 14 | 14 |
| `<header>` with site name | 13 | 13 | 13 | 13 | 13 | 13 |
| `<nav>` with `<ul>` of links to all 6 pages | 19–27 | 18–26 | 18–26 | 18–26 | 18–26 | 18–26 |
| `<main>` | 30 | 29 | 29 | 29 | 29 | 29 |
| `<footer>` with contacts (tel) | 70–73 | 87–90 | 173–176 | 166–169 | 214–217 | 99–102 |
| copyright entity `&copy;` | 72 | 89 | 175 | 168 | 216 | 101 |
| comment 1 ("why") | 18 | 50 | 71 | 83 | 42 | 65 |
| comment 2 ("why") | 59 | 65 | 153 | 117 | 96 | 87 |
| Author | both | both | Abylay | Abylay | Rustem | Rustem |

Heading order on every page: one `h1`, then only `h2` — no skipped levels.

## 2. Abylay Utemis — services.html, booking.html

### Structure

| Tag | File | Line(s) |
|---|---|---|
| `<section>` | services.html | 30, 69, 151 |
| `<section>` | booking.html | 30, 55, 78 |
| `<article>` | booking.html | 40 |
| `<aside>` | booking.html | 64 |
| `<figure>` + `<figcaption>` | services.html | 162 + 164, 167 + 169 |
| `<figure>` + `<figcaption>` | booking.html | 73 + 75 |

### Table (real price list)

| Tag | File | Line(s) |
|---|---|---|
| `<table>` | services.html | 72 |
| `<caption>` | services.html | 73 |
| `<thead>` | services.html | 74 |
| `<tbody>` | services.html | 82 |
| `<th scope="col">` | services.html | 76, 77, 78, 79 |
| `<th scope="row">` | services.html | 84, 90, 96, 102, 108, 114, 120, 126, 132, 138 |

### Lists

| Tag | File | Line(s) |
|---|---|---|
| nested list (`<ul>` inside `<li>`) | services.html | 45–68 (inner lists at 47, 54, 60) |
| ordered list with attribute `<ol type="1">` | services.html | 154 |
| definition list `<dl>` / `<dt>` / `<dd>` | booking.html | 43 (dt at 44, 47, 50) |

### Links

| Tag | File | Line(s) |
|---|---|---|
| external link with `target` and `rel` | services.html | 146 |
| `mailto:` link | booking.html | 36 |
| `tel:` link | booking.html | 35 |
| link to `#id` on the same page (1) | services.html | 35 (`#gift` → line 145) |
| link to `#id` on the same page (2) | services.html | 36 (`#visit-steps` → line 151) |

### Images (3, with alt)

| File | Line | Image |
|---|---|---|
| services.html | 163 | price-list.jpg |
| services.html | 168 | tools-station.jpg |
| booking.html | 74 | facade.jpg |

### Text tags

| Tag | File | Line(s) |
|---|---|---|
| `<strong>` | services.html | 39 |
| `<em>` | services.html | 42 |
| `<b>` | services.html | 34 |
| `<i>` | services.html | 33 |
| `<mark>` | services.html | 39 |
| `<small>` | services.html | 145, 146 |
| `<sup>` | services.html | 73, 146 |
| `<abbr title>` (1) | services.html | 41 |
| `<abbr title>` (2) | booking.html | 149 |
| `<blockquote>` (real quote, barber Akhmadzhon Ibrokhimov, 13 Sep 2026) | booking.html | 58–61 |
| `<q>` | services.html | 40 |
| `<cite>` | services.html | 146 |
| `<kbd>` | booking.html | 67 |
| `<samp>` | booking.html | 69 |
| `<code>`, `<pre>` | colophon.html (shared page, see section 4) | 51 |
| `<hr>` | services.html | 149 |
| `<br>` | booking.html | 88, 93, 98 and more |
| 4 different entities | services.html | `&amp;` 15, `&ndash;` 42, `&quot;` 36, `&copy;` 175 |

### Form (booking.html)

| Requirement | Line(s) |
|---|---|
| `<form method="post" action="#">` | 80 |
| comment "no server, form does not send" inside the form | 81 |
| `<fieldset>` + `<legend>` | 84 + 85, 103 + 104 |
| `<label for>` connected to `id` | 88, 93, 98, 107, 112, 120, 123, 126, 130, 144, 149, 153 |
| `type="text"` | 89 |
| `type="email"` | 94 |
| `type="tel"` | 99 |
| `type="number"` | 113 |
| `type="date"` | 108 |
| radio group | 119, 122, 125 |
| checkbox | 143, 148 |
| `<select>` with `<option>` | 131–139 |
| `<textarea>` | 154 |
| `required` | 89, 94, 99, 108 |
| `placeholder` | 89, 94, 99, 154 |
| `<button type="submit">` | 159 |
| `<button type="reset">` | 160 |

## 3. Rustem Gazymbekov — about.html, gallery.html

### Structure

| Tag | File | Line(s) |
|---|---|---|
| `<section>` | about.html | 55, 89, 103, 131 |
| `<section>` | gallery.html | 30, 63 |
| `<article>` | about.html | 30 |
| `<aside>` | about.html | 43 |
| `<figure>` + `<figcaption>` | about.html | 121 + 123 |
| `<figure>` + `<figcaption>` | gallery.html | 66 + 68, 71 + 73, 76 + 78, 81 + 83 |

### Table (real working hours)

| Tag | File | Line(s) |
|---|---|---|
| `<table>` | about.html | 57 |
| `<caption>` | about.html | 58 |
| `<thead>` | about.html | 59 |
| `<tbody>` | about.html | 66 |
| `<th scope="col">` | about.html | 61, 62, 63 |
| `<th scope="row">` | about.html | 68, 73, 78 |

### Lists

| Tag | File | Line(s) |
|---|---|---|
| nested list (`<ul>` inside `<li>`) | gallery.html | 41–61 (inner lists at 43, 49, 55) |
| ordered list with attribute `<ol type="a">` | gallery.html | 41 |
| definition list `<dl>` / `<dt>` / `<dd>` | about.html | 109 (dt at 110, 113, 116) |

### Links

| Tag | File | Line(s) |
|---|---|---|
| external link with `target` and `rel` | gallery.html | 95 |
| `mailto:` link | about.html | 127 |
| `tel:` link | about.html | 128 |
| link to `#id` on the same page (1) | about.html | 38 (`#quote-source` → line 97) |
| link to `#id` on the same page (2) | gallery.html | 37 (`#photos` → line 63) |

### Images (5, with alt)

| File | Line | Image |
|---|---|---|
| about.html | 122 | logo-wall.jpg |
| gallery.html | 67 | tools-station.jpg |
| gallery.html | 72 | shelf-products.jpg |
| gallery.html | 77 | awards-shelf.jpg |
| gallery.html | 82 | lounge.jpg |

### Text tags

| Tag | File | Line(s) |
|---|---|---|
| `<strong>` | about.html | 33, 52 |
| `<em>` | gallery.html | 34 |
| `<b>` | about.html | 92 |
| `<i>` | about.html | 106 |
| `<mark>` | about.html | 34 |
| `<small>` | about.html | 84 |
| `<sup>` | about.html | 58, 84 |
| `<abbr title>` (1) | about.html | 35 |
| `<abbr title>` (2) | about.html | 107 |
| `<abbr title>` (3) | gallery.html | 56 |
| `<blockquote>` (real quote, barber Akhmadzhon Ibrokhimov, 13 Sep 2026) | about.html | 97–100 |
| `<q>` | about.html | 94 |
| `<cite>` | about.html | 36 |
| `<code>`, `<pre>`, `<kbd>`, `<samp>` | colophon.html (shared page, see section 4) | 51, 67, 70 |
| `<hr>` | about.html | 87 |
| `<br>` | about.html | 99 |
| 4 different entities | about.html + gallery.html | `&amp;` about 21, `&ndash;` about 68, `&quot;` gallery 35, `&copy;` about 216 |

### div and span

| Tag | File | Line | Comment line |
|---|---|---|---|
| `<div>` (badge with one number) | about.html | 52 | 51 |
| `<span>` (3 words marked in a sentence) | gallery.html | 89 | 87 |

### Form (about.html)

| Requirement | Line(s) |
|---|---|
| `<form method="post" action="#">` | 134 |
| comment "no server, form does not send" inside the form | 135 |
| `<fieldset>` + `<legend>` | 137 + 138, 156 + 157 |
| `<label for>` connected to `id` | 141, 146, 151, 160, 165, 170, 183, 186, 189, 192, 196, 202 |
| `type="text"` | 142 |
| `type="email"` | 147 |
| `type="tel"` | 152 |
| `type="number"` | 166 |
| `type="date"` | 161 |
| radio group | 182, 185, 188, 191 |
| checkbox | 201 |
| `<select>` with `<option>` | 171–176 |
| `<textarea>` | 197 |
| `required` | 142, 147, 161, 197 |
| `placeholder` | 142, 147, 152, 197 |
| `<button type="submit">` | 207 |
| `<button type="reset">` | 208 |

## 4. Shared pages — index.html, colophon.html (both students)

| Tag | File | Line(s) |
|---|---|---|
| `<section>` | index.html | 31, 60 |
| `<figure>` + `<figcaption>` + `<img>` | index.html | 54 + 56 + 55 |
| `<strong>` | index.html | 63, 64, 65 |
| `<section>` | colophon.html | 30, 42, 74 |
| `<cite>` | colophon.html | 33 |
| `<abbr title>` ×2 | colophon.html | 45, 46 |
| `<pre>` + `<code>` (page skeleton example) | colophon.html | 51–64 |
| `<code>` (second use) | colophon.html | 80 |
| `<kbd>` | colophon.html | 67, 68 |
| `<samp>` | colophon.html | 70 |
| entities `&lt;` `&gt;` | colophon.html | 51–64 |
