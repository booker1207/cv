# Design

<!-- impeccable:design-schema 1 -->

Visual system of the CV site, recorded from the built page (`index.html`, `assets/style.css`). Direction pinned by Booker: the "BentoPortfolio" Framer template look (dark bento board), executed by hand.

## World

A black board of dark tiles. Everything on the page is a tile on a 12-column grid; there is no hero, no section backgrounds, no decoration outside the tiles. Information density comes from the grid, hierarchy from type size and weight only.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#000` | page |
| `--tile` | `#0a0a0a` | tile surface |
| `--tile-2` | `#050505` | inset surfaces (inputs, chips, stat boxes, work media) |
| `--line` | `rgba(187,187,187,.15)` | hairline borders |
| `--line-strong` | `rgba(187,187,187,.32)` | borders on controls |
| `--fg` | `#fff` | headings, names |
| `--fg-2` | `#c9c9c9` | body text (13:1 on tile) |
| `--fg-3` | `#9a9a9a` | dates, notes (7:1 on tile) |
| `--green` | `#31ee33` | the only colour: status dot |
| `--radius` | `14px` | tiles; inner elements 10–12px; pills 999px |
| `--gap` | `14px` | grid gap and board padding (12px under 720px) |
| `--pad` | `28px` | tile padding (22px under 720px) |

## Type

- Display and labels: **Instrument Sans** 600/700, uppercase, `letter-spacing -.025em` for the name (`clamp(52px, 6.2vw, 88px)`), 26px for tile headings, 28px italic for the "Featured work" label.
- Body: **Inter** 400/500, 15px, line-height 1.5; 14px inside dense tiles.
- Traditional Chinese: system CJK stack (`PingFang TC`, `Noto Sans TC`, `Microsoft JhengHei`) appended to both families, line-height 1.7, name set at letter-spacing .04em. The big name swaps to 廖禹誠 when `html[lang="zh-TW"]`.
- Code sample: system monospace 13px.

## Components

- **Tile**: `.tile` — surface, hairline border, radius, padding, `isolation:isolate`. Two pseudo-elements draw the cursor light (inner radial glow + masked border highlight) driven by `--mx/--my` set from `pointermove`; only on `hover: hover` devices.
- **Nav tile**: sticky at `top: var(--gap)`, blurred backdrop, brand (廖禹誠 + BOOKER*LIAO*), uppercase links, language segmented pill (`aria-pressed`), print pill.
- **Name tile** (role line now "AI-native Software Engineer · Founder"; status row holds the green L'Outhé pill and a white "AI-native workflow" pill), **photo tile** (edge-to-edge image, gradient caption), **experience tile** (internal scroll with bottom fade mask), **intro**, **email tile** (arrow slides on hover).
- **Work tiles**, three kinds. `.case` (L'Outhé 8 cols; Fundai and Owly 6 cols each): copy block (name, italic kind, one-line claim, metric `.chips`) plus a device composition — a bottom-clipped browser frame with a phone frame overlapping its lower-left; on hover both lift a few pixels and the ↗ circle inverts. `.app` (4 × 3 cols, order Blackjack → StockCalendar → Basketball Timer → TaskQuadrant): two overlapping phones (`.duo`: Blackjack table + strategy chart, StockCalendar explore + calendar, TaskQuadrant today + quadrants) or the landscape scoreboard frame, with an always-visible caption of name, kind, two chips and ↗ / "Coming soon"; hover blurs the media and reveals the description. `.auto` (12 cols): copy + Telegram phone (no code), display-only with a "Personal tool" pill. Chips: 11.5px Instrument Sans 600 on #161616 with a hairline border, pill radius. Every linked tile opens leouthe.eu, fundaitek.com, owly.finance or the App Store page.
- **Marquee**: duplicated track, `translateX(-50%)` over 48s, edge mask, pauses on hover.
- **Expertise list**: `01–04` counters, hairline dividers.
- **Form**: inputs on `--tile-2`, white submit; composes a `mailto:` (no backend).
- **Stat box**: large tabular number counted up on reveal.
- **Social buttons**: 52px squares.

## Motion

One entrance (`.reveal.pending`, applied by JS only to tiles below the fold at load: 22px rise + fade, 0.8s, 45ms stagger via `--i`; tiles on screen at load are never hidden), the cursor light, the work-tile hover, the marquee, a pulsing status dot, and a 0.36s crossfade on language switch. All disabled under `prefers-reduced-motion`.

## Breakpoints

- ≤1100px: name/photo 6+6, experience full width, work tiles 6 cols (wide 12), lower tiles stack by halves.
- ≤720px: single column, nav links hidden, print button hidden, work tiles image-over-text.

## Print

`@media print` rebuilds the board as a conventional A4 CV (three pages): every tile is hidden and then re-enabled in a fixed order with flex `order` (header with a print-only portrait at top-right, contact line, intro, experience with bullets, expertise in two columns, selected work as a compact list, toolbox as a text line, AI-native workflow, education). White paper, black 1.2px rules under uppercase section titles, 10pt Inter, no chips, images, nav, numbers or footer. The portrait is a separate `img.print-photo` inside the header block (hidden on screen) because an absolutely positioned element inside the multi-page board fragmented into a strip.

## Rasters

All images are Booker's own material; sources in `assets/work/SOURCES.md` and `assets/` (portrait crops from his own photo (seated by a tiled fireplace, Lisbon)).
