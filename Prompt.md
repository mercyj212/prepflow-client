# PrepUp CBT — Homepage Build Prompt for Google Antigravity

## Project Overview

Build the **PrepUp CBT** homepage as a single-page scrollytelling website. The aesthetic is directly inspired by the DarkFeather agency site: dark, editorial, minimal luxury — deep charcoal/near-black backgrounds, crisp white typography, subtle warm amber/orange glows. The scroll experience should feel cinematic and intentional.

---

## Brand Identity

- **Brand name:** PrepUp CBT
- **Tagline:** *Clarity. Balance. Transformation.*
- **Tone:** Premium, calm, editorial — like a luxury wellness brand meets a high-end design agency
- **Color palette:**
  - Background: `#0a0a0a` (near black)
  - Surface: `#111111` / `#141414`
  - Primary text: `#f5f5f0` (warm white)
  - Accent: `#c9a96e` (warm gold — use sparingly for hover states, dividers, highlights)
  - Subtle glow/atmosphere: deep amber-orange (`rgba(180, 80, 20, 0.15)`) used only as radial background glow, never on text

---

## Typography

Use **Google Fonts** (import via `<link>` in `<head>`):

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Neue+Haas+Grotesk+Display+Pro:wght@400;500&display=swap" rel="stylesheet">
```

**If Neue Haas is unavailable, substitute with:**
```html
family=Outfit:wght@300;400;500
```

- **Display headings** (`h1`, `h2`, large hero text): `'Cormorant Garamond', serif` — weight 300, italic where dramatic effect is needed
- **Body / nav / labels / buttons**: `'Neue Haas Grotesk Display Pro', sans-serif` (or Outfit) — weight 400/500
- **Nav brand name**: uppercase, letter-spacing 0.2em, small size (~13px)
- **Section labels**: uppercase, letter-spacing 0.25em, font-size 11px, muted opacity (0.5)

---

## Page Sections (in scroll order)

### 1. Navigation Bar
- Fixed at top, fully transparent background (blurs slightly on scroll with `backdrop-filter: blur(12px)`)
- Left: `PrepUp CBT` in small uppercase tracking
- Right: nav links — `Services`, `Approach`, `About`, `Contact`
- No borders, no boxes — just clean type with hover underline animation (thin gold line slides in)

---

### 2. Hero Section — Full Viewport

**Layout:**
- Full-screen (`100vh`), dark background
- Top-left: small label — `"Cognitive Behavioral Therapy"` in muted uppercase
- Center-left (vertically centered): Giant stacked display text:

```
Heal.
Grow.
Thrive.
```

Each word on its own line. Font: Cormorant Garamond, weight 300, ~120px desktop / ~64px mobile. Animate each word fading and sliding up on load with staggered delay (0ms, 150ms, 300ms).

- Below the words: a diagonal arrow icon `↘` (same style as DarkFeather) followed by a small scroll CTA label
- Bottom right corner: a subtle counter like `01 — 05` indicating scroll progress sections

**Background:**
- No image. Create atmosphere with CSS: two large radial gradients — one warm amber-orange in the upper right, one deep teal-blue in the lower left. Very low opacity (~0.15). Creates the same "glowing orbs" mood as the reference images.

```css
background: radial-gradient(ellipse at 80% 10%, rgba(180,80,20,0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 10% 90%, rgba(20,60,80,0.18) 0%, transparent 60%),
            #0a0a0a;
```

---

### 3. Services Section — Scrollytelling

**Layout:** Full-width section, dark background.

- Section label top-left: `"What We Offer"` in small muted uppercase
- Large section heading: `"Our Approach"` in Cormorant Garamond display size
- Below: An expandable accordion list (like the "Our Capabilities" screen in the reference):

Each row:
- Service name in medium weight sans-serif (~18px)
- `+` icon on the right (rotates to `×` when open)
- Thin gold divider line separating rows
- On expand: a short description paragraph animates open smoothly

**Services to list:**
1. Individual CBT Therapy
2. Anxiety & Stress Management
3. Depression Support
4. Trauma-Informed Care
5. Mindfulness & Resilience

---

### 4. Stats / About Section

**Layout:** Two-column. Left: a large number. Right: supporting text.

Mirroring the `10+ Years` section from the reference:

```
Left col:
  Small label: "Experience"
  Large display number: 500+
  Subtitle: Clients Helped

Right col:
  Body text (2–3 sentences):
  "We believe healing is a partnership. Through evidence-based CBT
   techniques, we help you identify patterns, challenge distortions,
   and build lasting resilience — one session at a time."
```

Background: subtle warm radial glow shifted to right side.

---

### 5. Case Stories / Testimonials Section

**Layout:** Horizontal scroll or card grid — 2 cards visible at once.

- Section label: `"Transformations"` in muted uppercase
- Each card: dark surface (`#141414`), rounded corners (8px), padding
- Card content: short anonymized testimonial quote in Cormorant Garamond italic, below it a small label like `"Anxiety Recovery"` or `"Career Burnout"`
- Cards animate in from the right as user scrolls into section

---

### 6. Contact / Get in Touch Section

Mirroring the final section from reference images:

- Section label top-left: `"Start Your Journey"`
- Large heading: `"Get in Touch"` — Cormorant Garamond display
- Two minimal input fields (no box borders — just a single bottom-line border):
  - `Your email`
  - `Tell us about yourself`
- Right-aligned send button: text `Send →` (no box, just text with arrow, underline on hover)
- Below inputs: a simple footer link grid — two columns (`Services`, `About`, `Blog` / `Instagram`, `LinkedIn`)

---

## Scrollytelling / Animation Requirements

Use **Intersection Observer API** (vanilla JS — no library needed) to trigger animations:

- Every section heading: starts `opacity: 0; transform: translateY(40px)` — animates to visible when scrolled into view
- Section labels: fade in with 200ms delay after heading
- Accordion rows: stagger-animate in (each row 80ms apart)
- Stats number: count-up animation when section enters viewport
- Cards: slide in from right

**Scroll indicator:** A thin vertical progress line on the right edge of the viewport. As user scrolls, it fills from top to bottom in the gold accent color.

---

## Technical Spec

- **Single HTML file** — all CSS and JS inline (no frameworks, no build tools)
- Use CSS custom properties (variables) for all colors and fonts
- Mobile responsive — stack to single column below 768px
- No external JS libraries
- Smooth scroll behavior: `scroll-behavior: smooth` on `html`
- All fonts loaded via Google Fonts `<link>` in `<head>`

---

## File Output

Deliver as a single file: `prepup-cbt.html`

---

## Summary of Visual Rules

| Property | Value |
|---|---|
| Background | `#0a0a0a` near-black |
| Display font | Cormorant Garamond 300 |
| UI font | Neue Haas Grotesk / Outfit |
| Accent | `#c9a96e` warm gold |
| Atmosphere | Amber + teal radial glows, very low opacity |
| Motion | Staggered fade-up on scroll, no jarring effects |
| Mood | Editorial luxury, cinematic, calm authority |