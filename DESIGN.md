# DESIGN.md — hatim.sa

The design system for **hatim.sa**, the personal site of Hatim Alsufyani. The style is Apple-inspired: calm, content-first and precise.
This file is the single source of truth for visual and interaction design. Read it before changing `index.html`, `ar.html` or `cv.html`.

> Not affiliated with Apple. The site uses no Apple logos, SF fonts or trademarks. It follows Apple's published interface principles (WWDC 2018 "Designing Fluid Interfaces" and the Human Interface Guidelines foundations) and a neutral palette close to apple.com.

---

## 0. How styles are organised

- **No build step.** The pages retain their base `<style>` blocks. `site.css` and `site.js` provide shared responsive components, native disclosure behavior and progressive enhancement. All four pages load `typography.css` for consistent Arabic shaping. CV pages also use `cv-extra.css`.
- **Every design change must be applied to both `index.html` (EN, LTR) and `ar.html` (AR, RTL)**, and to `cv.html` / `cv-ar.html` when relevant.
- Arabic base styles live in `ar.html`; shared components use `[dir=rtl]` in `site.css`. See §3 for line heights, weights and tracking.
- Keep this file in sync with the code. If you change a value, update the matching table here in the same commit.

---

## 1. Principles

1. **Content first.** Typography and whitespace do the work. Decoration has to earn its place.
2. **One accent, used on purpose.** Blue means "act" or "go". Use at most one primary button per area; everything else is a text link.
3. **Respond instantly.** Feedback starts on press, not on release (`:active` scale).
4. **Calm motion.** One easing curve site-wide, short durations, no bounce on static UI.
5. **Depth through materials, not lines.** A translucent header and alternating section backgrounds, not heavy borders or shadows.
6. **Equal care in both languages.** Arabic is designed natively (spacing, weights, RTL), never mirrored as an afterthought.
7. **Accessible by default.** WCAG AA contrast, visible focus, and respect for `prefers-reduced-motion` and `prefers-reduced-transparency`.

---

## 2. Color

Light theme only (there is no dark mode yet). Defined on `:root` in each page:

```css
:root{
  --bg:#ffffff; --soft:#f5f5f7; --ink:#1d1d1f; --sub:#6e6e73;
  --line:rgba(0,0,0,.10); --accent:#0071e3; --accent-2:#0077ED;
  --sys:"Tajarib","Tajawal",-apple-system,system-ui,sans-serif;   /* EN pages */
  --ar:"Tajarib","Tajawal",-apple-system,system-ui,sans-serif;    /* ar.html uses --ar instead of --sys */
  --disp:"TajaribDisp","Tajarib",system-ui,sans-serif;
}
```

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Page background, regular sections, all cards |
| `--soft` | `#f5f5f7` | Alternating `.soft` sections, footer, skill tags and course pills |
| `--ink` | `#1d1d1f` | Primary text, headings, group header rules |
| `--sub` | `#6e6e73` | Secondary text: descriptions, metadata, kickers, nav |
| `--line` | `rgba(0,0,0,.10)` | Hairlines, chip borders, language toggle |
| `--accent` | `#0071e3` | Primary button, text links, highlighted word in chips |
| `--accent-2` | `#0077ED` | Primary button hover |

Other literal colors in use:
- `#ffffff` for primary-button text.
- `::selection` background `#b3d6ff`.
- Header background `rgba(255,255,255,.72)`.

### Contrast (WCAG 2)

| Foreground | Background | Ratio | Result |
|---|---|---|---|
| `--ink` | `--bg` | 16.8:1 | AAA |
| `--ink` | `--soft` | 15.5:1 | AAA |
| `--sub` | `--bg` | 5.1:1 | AA |
| `--sub` | `--soft` | 4.7:1 | AA |
| `--accent` | `--bg` | 4.7:1 | AA |
| `#fff` | `--accent` | 4.7:1 | AA |
| `--accent` | `--soft` | 4.3:1 | **Below AA**: never set small blue text directly on `--soft`; put it on a white card or chip |
| `#fff` | `--accent-2` | 4.3:1 | **Below AA**: consider darkening `--accent-2` |

---

## 3. Typography

### Typefaces

| Family | Files (`fonts/tajarib/`) | Weights | Use |
|---|---|---|---|
| **Tajarib** | `Tajarib-Regular/Medium/Bold/Black.woff2` | 400 / 500 / 700 / 900 | All running text: Arabic, Latin **and digits** |
| **TajaribDisp** | `TajaribDisp-Bold/Black.woff2` | 700 / 900 | Display headings and the wordmark |
| Fallback | Tajawal → `-apple-system` → `system-ui` | | Only if the files fail to load |

All faces load with `font-display:swap`.

### OpenType rules (important)

- **Arabic reading text and subheadings:** `typography.css` enables `liga` and `calt`, with `ss01` and `dlig` explicitly off. Paragraphs, project titles, subheadings, navigation, buttons and CV body text use natural, unextended letterforms. Do not insert decorative tatweel characters. Arabic tracking stays zero and word spacing stays normal. Long copy uses start alignment and `text-wrap:pretty`; never justify it by stretching letters. Language tags scope the rules correctly in English pages.
- **Primary display headings only:** the hero name, large `.h2` section headings, contact heading and CV name retain `ss01`.
- **Never enable `dlig`.** It swaps meem and heh for decorative forms that were explicitly rejected. Medial heh must stay in its normal form.
- **Wordmark** `.brand .wm`: `font-feature-settings:'ss01'` only.

### Base text

| | EN (`index.html`) | AR (`ar.html`) |
|---|---|---|
| `body` line-height | 1.47 | 1.7 |
| Tracking | slightly negative on headings and UI (-0.01 to -0.03em) | **0 everywhere** (no letter-spacing in Arabic) |
| Rendering | `-webkit-font-smoothing:antialiased`, `font-optical-sizing:auto` | `-webkit-font-smoothing:antialiased` |

### Type scale

Sizes are EN; AR differences are noted.

| Role | Selector | Size | Weight | Line-height (EN / AR) | Tracking (EN) |
|---|---|---|---|---|---|
| Hero name | `.hero h1` | `clamp(2.6rem,6.2vw,4.8rem)` | 700, `--disp` | 1.03 / 1.15 | -0.03em |
| Section title | `.h2` | `clamp(2.1rem,5vw,3.4rem)`; AR `clamp(2rem,4.8vw,3.2rem)` | 700, `--disp` | 1.08 / 1.3 | -0.025em |
| Contact title | `.contact h2` | `clamp(2.4rem,6.5vw,4.5rem)`; AR `clamp(2.2rem,6vw,4rem)` | 700, `--disp` | 1.05 / 1.25 | -0.03em |
| Hero line | `.hero p` | `clamp(1.15rem,2.2vw,1.5rem)` | 400, `--sub` | 1.38 / 1.6 | -0.01em |
| Kicker | `.kicker` | 21px | 600; AR 700, `--sub` | n/a | -0.01em |
| About paragraph | `.about .atext p` | 1.2rem | 400, `--sub` | 1.5 / 1.8 | n/a |
| Project title | `.row .t` | `clamp(1.4rem,3vw,2rem)`; AR `clamp(1.35rem,2.8vw,1.9rem)` | 600; AR 700 | n/a | -0.02em |
| Qualification title | `.cred .ct` | `clamp(1.3rem,2.7vw,1.75rem)` | 600 | 1.25 | -0.02em |
| Dissertation title | `.diss .dt` | `clamp(1.35rem,2.6vw,1.9rem)` | 700 | 1.25 | -0.02em |
| Sub-heading | `.subh` | 1.45rem | 600 | n/a | -0.02em |
| Card title | `.card h3` | 1.4rem | 600; AR 700 | n/a | -0.02em |
| Card text | `.card p` | 1rem; AR 1.02rem | 400, `--sub` | 1.55 / 1.75 | -0.01em |
| Credential line | `.hmeta li` | 1.02rem; AR 1.05rem | 500, `--ink` | 1.5 / 1.75 | -0.01em |
| Course name | `.tg .tn` | 15px | 500 | 1.4 | n/a |
| Course meta | `.tg .tm` | 12.5px | 400, `--sub` | n/a | n/a |
| Skill tag | `.tg .sk` | 11.5px | 400 | 1.6 | n/a |
| Chip | `.chip` | 14px | 400 (`b` 600 in `--accent`) | n/a | -0.01em |
| Nav | `nav` | 13px; AR 14px | 400, `--sub` | n/a | n/a |
| Wordmark «حاتم» | `.brand .wm` | 25px | 700, TajaribDisp + `ss01` | 1 | 0 |
| Footer | `.foot` | 12.5px | 400, `--sub` | n/a | n/a |

### Rules

- `text-wrap:balance` on `.h2` and `.hero p`.
- Measure:
  - Section titles `max-width:16ch` (EN) or `20ch` (AR).
  - Paragraphs 46–66ch.
- Headings end with a period in both languages: "Selected projects." / «مشاريع مختارة.».
- Numbers that align in columns use `font-variant-numeric:tabular-nums`.

---

## 4. Layout & spacing

| Item | Value |
|---|---|
| Content width `.wrap` / `.bar` | `max-width:1000px`, side padding 24px (20px under 480px) |
| Header | fixed, height 48px |
| Section `.sec` | `padding:110px 0` (AR 108px); 84px under 820px |
| Contact section | `padding:130px 24px`; `84px 24px` under 820px; 20px side padding under 480px |
| Hero | `padding:88px 24px 0` (72px top under 820px); grid `1fr minmax(240px,340px)`, gap 48px, `align-items:end` |
| Gaps | cards 20px · chips 10px · CTA buttons 14px · course groups 34px/36px · tags 6px |
| Rows | `.row` 30px × 4px (hover indents 12px) · `.cred` 28px × 4px |
| Card padding | 34px × 30px (AR 32px × 28px) · dissertation card `clamp(26px,4vw,48px)` |

### Breakpoints

| Width | Change |
|---|---|
| `≤980px` | Course groups go to 2 columns |
| `≤820px` | **Main mobile switch:** one column, centered hero, photo above the text, nav links hidden, section padding 84px |
| `≤640px` | Course groups go to 1 column |
| `≤480px` | Gutter 20px, project role tags hidden, credential rows stack |
| `≤400px` | Credential-line items may wrap |

The page body must never scroll horizontally at any width.

---

## 5. Shape: radius, borders, shadows

| Radius | Use |
|---|---|
| `980px` (pill) | Buttons, language toggle, chips, skill tags, course pills, dimension pills |
| `24px` | Dissertation card `.diss` |
| `20px` | Focus cards `.card` |
| `16px` | Mail fallback menu `.mailfb` |
| `10px` | Items inside the mail menu |
| `50%` | 4×4px separator dots in `.hmeta` |

| Shadow | Value | Use |
|---|---|---|
| Card | `0 1px 3px rgba(0,0,0,.04), 0 10px 30px rgba(0,0,0,.05)` | `.card` |
| Raised card | `0 1px 3px rgba(0,0,0,.04), 0 12px 36px rgba(0,0,0,.06)` | `.diss` |
| Floating | `0 12px 36px rgba(0,0,0,.12)` | `.mailfb` |

Borders:
- Hairline: `1px solid var(--line)` between rows and list items, and around chips.
- Group header: `1px solid var(--ink)` under course-group titles.
- Never use coloured side borders on cards.

---

## 6. Materials & depth

- **Header (glass):** `background:rgba(255,255,255,.72); backdrop-filter:saturate(180%) blur(20px)`. Content scrolls underneath. The bottom hairline appears after 8px of scroll (`header.scrolled`).
- **Reduced transparency:** under `prefers-reduced-transparency:reduce` the header becomes solid `#fff` with a visible hairline.
- **Sections separate by background** (`--bg` / `--soft` alternating), not by rules. Cards stay white on both.
- **No gradients.** The one exception is the functional mask that fades the bottom of the mobile portrait.

---

## 7. Motion

| Item | Spec |
|---|---|
| Easing (everything) | `cubic-bezier(.33,1,.68,1)`, a smooth ease-out |
| Reveal `.rv.is-revealing` | 700ms from opacity 0 and translateY(24px); same easing; 55ms stagger, capped at 4 steps. `.rv` is visible before JavaScript, and reduced motion disables the animation. |
| Button press | `.btn:active{transform:scale(.97)}`, 200ms |
| Link chevron | moves 3px on hover, 200ms |
| Project row hover | `padding-inline-start` 4px → 12px, 350ms |
| Colors | links and nav 250ms; header hairline 400ms |
| Reduced motion | `prefers-reduced-motion:reduce`: no transforms, reveal becomes a 400ms opacity fade, `scroll-behavior:auto`, animations off |

Content must be readable at rest: the reveal only animates in, and nothing important depends on scrolling.

### For future interactive UI (drawers, swipe galleries, sheets)

These follow the same Apple guidance:
- Respond on pointer-down and track the pointer 1:1, keeping the grab offset (Pointer Events + `setPointerCapture`).
- Everything must be interruptible. Animate from the current on-screen value, never lock input, and use springs rather than CSS transitions for gesture-driven motion.
- **Springs:** damping 1.0 (no bounce) by default. Add slight bounce (≈0.8) only when the gesture carried momentum. Typical response 0.3–0.4s (move 1.0/0.4, drawer or sheet 0.8/0.3).
- **Hand off the release velocity** to the spring. **Project momentum** before snapping:
  `target = current + (v/1000)·d/(1−d)`, with `d ≈ 0.998`.
- **Rubber-band at edges:** `offset = x·D·0.55 / (D + 0.55·|x|)`.
- Animate only `transform` and `opacity`. Decide commit or cancel by the sign of the velocity, not by position.

---

## 8. Components

**Primary button** `.btn.btn-p`
- Pill, `--accent` background, white text, 16px, weight 500, padding 11px 22px (AR 12px 24px).
- Hover `--accent-2`; press `scale(.97)`.
- One per area.

**Text link button** `.btn.btn-t`
- `--accent` text followed by a chevron `.ch`: "›" in EN, "‹" in AR.
- Hover: underline, and the chevron nudges 3px.

**Language toggle** `.lang`
- Pill with a `--line` border, 12.5px (AR 13px), padding 5px 13px.
- Hover: border turns `--ink`.

**Chip** `.chip`
- White pill with a `--line` border, 14px, padding 9px 18px.
- A leading `<b>` in `--accent`. As a link, the border turns `--ink` on hover.

**Skill tag** `.sk` and **course pill** `.cq span`
- `--soft` pill with no border, 11.5px and 12.5px.

**Card** `.card`
- White, radius 20px, card shadow.
- `h3` followed by `--sub` text, start-aligned.
- Used three per row (one column under 820px).

**Rows** `.row` (legacy) and `.cred` (qualifications and certificates)
- Two-column grid: title, then role or year on the end side.
- Full-width description below, hairline underneath.

**Section head**
- `.kicker` (`--sub`) above `.h2`.

**Credential line** `.hmeta`
- `--ink` items at weight 500, separated by grey 4px dots.
- JS adds `.ls` to the first item on each wrapped line to hide its dot.

**Selected project cards** `.featured-project`
- All three projects — Shawahid, Tawasol Yanbu and Yanbu Secondary — share the same card component in both languages. Use a 24px radius, standard hairline, 36px padding and a two-column text/image layout. The first card starts 40px below the heading; subsequent cards are separated by 28px.
- Text uses the same blue role label, 2.5rem project title, description and primary blue visit button. Preserve project-specific facts and details when available; do not add filler metrics to force matching heights.
- All previews share a 3:2 frame, radius 20px, the existing subtle image shadow and a centered caption. At 820px and below, the image appears above the text; use the existing responsive card padding and title scale.
- Tawasol Yanbu and Yanbu Secondary use genuine 1200×800 WebP screenshots of their public landing pages, with descriptive alt text, explicit dimensions and lazy loading.

**Contact actions and mail options**
- One blue email capsule, with the address and a separate native `details.mail-options` disclosure inside it. The address opens `mailto:` directly.
- Contact controls have a minimum height of 52px, use the normal 16px button type, and a 14px gap. They stack below 480px. In Arabic, the invitation is split after «والفرص» so «التي يمكن أن أضيف إليها بخبرتي.» starts a separate line.
- LinkedIn is a blue `.btn.btn-t` text link with the supplied 24px brand icon and the normal text chevron. It has no border or separate filled background.
- `.mail-panel` opens under the email action. It is white, radius 16px, with the floating shadow. Inner items use radius 10px and at least a 44px touch target.
- Actions: Copy address, Open in Gmail, Open in Outlook. Items use `--soft` on hover. Copy status uses `--sub`.
- Native disclosure supports pointer and keyboard activation without JavaScript. JavaScript adds outside-click / Escape dismissal and accessible clipboard status; no mail-client detection is used.

**Show more** native `details > summary`
- `--accent` text link with a text-glyph chevron rotating 90° (mirrored in Arabic).
- On a `--soft` section, small blue actions sit on a white pill to preserve contrast.

**Selected professional development** `.selected-training`
- Six verified university courses appear first, followed by a native disclosure for the remaining catalog; no duplicates or invented qualifications.
- Flat rows with the standard hairline; no added card backgrounds or shadows. Three columns, two at 980px, one at 640px; 34px/36px desktop gaps.
- Standard course type: title 15px / 500 / 1.4, provider and duration 12.5px, skill tags 11.5px on `--soft`.
- Heading and metadata areas align within the grid. Titles use the page's language; university names are written in full in featured English rows.

**Footer**
- `--soft` background, top hairline, 12.5px `--sub`.

---

## 9. Imagery & iconography

- **Portrait:** use the owner's supplied photograph, with facial details and pose preserved. The source GIF stays unchanged outside the repository.
  - Responsive WebP delivery copies: `portrait-2026-480.webp` (480×720) and `portrait-2026-960.webp` (960×1440); JPEG fallback and sharing image: `portrait-2026.jpg` (960×1440).
  - **Desktop:** an end-side column (240–340px) aligned to the bottom of the hero, with a 4:5 frame and top-aligned `object-fit:cover` crop.
  - **Mobile:** above the text, `width:min(230px,62vw)`, the same 4:5 frame and top alignment, with the existing bottom fade `mask-image:linear-gradient(#000 78%,transparent)`.
  - A small CSS `brightness(1.025)` adjustment blends the photograph's near-white background into the white hero. The image files retain the original photograph; do not use generated facial replacements.
  - Keep explicit dimensions, responsive `sizes`, and high fetch priority to avoid layout movement and oversized downloads.
- **No icon library and no emoji.** Arrows are text glyphs (› ‹). The owner-supplied LinkedIn mark (`linkedin-icon.webp`) is the explicit exception for the LinkedIn contact link; preserve its original colors.
- **Wordmark only:** «حاتم» set in TajaribDisp with `ss01`. No badge or symbol.

---

## 10. RTL (ar.html)

- `<html lang="ar" dir="rtl">` with logical properties throughout: `margin-inline`, `padding-inline`, `inset-inline-start`.
- Wrap Latin strings, codes and IDs in `<bdi dir="ltr">`. Use `.nw` (`white-space:nowrap`) for codes that must not break.
- Chevrons and hover offsets flip with the direction. `[dir=rtl] .mailfb` mirrors the menu's horizontal transform.
- No letter-spacing, taller line heights, and 700 where EN uses 600 (§3).

---

## 11. Voice (design-relevant)

- Plain, first-person, short sentences. No hype words, no exclamation marks, no emoji.
- Arabic is written natively, never translated word for word.
- Numbers as digits. Training hours as whole numbers (no minutes).

---

## 12. Do / Don't

| Do | Don't |
|---|---|
| One blue primary button per area, text links for the rest | Gradients, new colours outside the tokens |
| Alternate `--bg` and `--soft` sections | Coloured side-border cards, heavy shadows |
| Headings in TajaribDisp with `ss01`, ending with a period | `dlig`, or any typeface other than Tajarib |
| Pills (980px) for buttons, chips and tags; 20px for cards | Arbitrary radii per element |
| One easing curve, short durations | Many simultaneous animations, bounce without momentum |
| Blue text on white surfaces only | Small blue text directly on `--soft` |
| Change EN and AR together | One language lagging behind the other |
| Respect reduced motion and reduced transparency | Apple logos, SF fonts or any Apple trademark |

---

## 13. Checklist before you commit

- [ ] The change is applied to both `index.html` and `ar.html` (and `cv.html` if relevant).
- [ ] Only the tokens in §2 are used. No new colours, radii or easing curves.
- [ ] Only primary display headings use `--disp` + `'liga','ss01'`; reading text and subheadings use natural forms, and `dlig` stays disabled throughout.
- [ ] Checked at 1280px, 390px and 340px wide, in both languages. No horizontal scroll.
- [ ] Arabic: RTL correct, no letter-spacing, Latin wrapped in `<bdi dir="ltr">`.
- [ ] Contrast meets AA. Focus is visible. Reduced motion and transparency still work.
- [ ] This `DESIGN.md` is updated if any value changed.

---

*Principles adapted from Apple's WWDC 2018 talk "Designing Fluid Interfaces" and the Human Interface Guidelines, via the open-source `apple-design` skill (emilkowalski/skills). Values reflect the code as of 13 October 2026.*
