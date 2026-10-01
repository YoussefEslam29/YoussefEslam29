# Neo-Gotham Deco — design reference

The portfolio is a noir city at night, lit in neon: an art-deco skyline under a
night sky that burns red at the horizon, black silhouettes, amber window light,
brass trim, and neon signs, tubes and glows. It borrows the "Dark Deco" look of
*Batman: The Animated Series*, the neon retro-future of *Batman Beyond*, and the
lacquer-red jazz club — without using any DC character or logo. Your own owl
takes the bat's place in the searchlight.

**Neon is the light source; everything else is the night it glows in.** Signs
(the hero name, section titles) and tubes (tower outlines, rules, buttons) are
lit. Panels, cards and small trim stay dark and brass, so the neon has something
to stand out against.

Moodboard: [`references/`](references/)

| Reference | Drives |
|---|---|
| `01-dark-deco-skyline.png` | The hero: red sky, red moon, black towers, amber windows, print grain |
| `02-jazz-club.png` | Content sections: lacquer red on black, stool-top discs, the velvet curtain |
| `03-neon-retro-future.png` | Interaction: neon edges, streamline stripes, the glow on hover and focus |

## Where the design lives

This folder documents the look; the code that draws it is in the app:

| File | What it holds |
|---|---|
| `src/app/globals.css` | Tokens (colour, type, spacing), buttons, filter plaques, kicker, divider, forms |
| `src/app/layout.js` | The three typefaces, self-hosted with `next/font` |
| `src/components/Skyline.js` | The hero city: moon, owl-signal, searchlights, three planes of towers |
| `src/components/*.module.css` | Each section's own layout and details |
| `public/logo-owl.png`, `src/app/icon.png`, `src/app/favicon.ico` | The owl, recoloured to this palette |

Change a colour or font in `globals.css` and every section and the admin pages
follow.

## Colour

| Token | Hex | Role |
|---|---|---|
| `--clr-ink-900` | `#0D0708` | Page background, the skyline's foreground |
| `--clr-ink-850` | `#120909` | Alternate sections |
| `--clr-ink-800` | `#190C0D` | Cards, panels, inputs |
| `--clr-crimson-600` | `#B3191F` | **Lacquer.** Button hover fills, contact icons, the stamp. Fill only |
| `--clr-neon` | `#FF4A45` | **Red neon.** The main tube colour: signs, outlines, buttons, the active nav bar |
| `--clr-neon-core` | `#FFE6DE` | **White-hot core.** The text colour of every neon sign |
| `--clr-neon-pink` | `#FF5C93` | **Pink neon.** The second tube, used sparingly (divider, canopy, two towers, the street line, the Databases & Cloud skills) |
| `--clr-amber` | `#F2B544` | **Window light.** Highlights, links, tags, the focus ring, the amber tube in the hero |
| `--clr-brass` | `#C9A15A` | **Trim.** Kickers, labels, hairline frames |
| `--clr-cream` | `#F4E7D3` | Primary text |
| `--clr-paper` | `#EFE2C8` | The personnel-file sheet |
| `--grad-sky` | `#060203` → `#CF2A24` | The hero sky: night at the top, the city's red glow at the horizon |
| `--glow-text`, `--glow-tube` | — | The glow stacks: a tight halo round the core, the tube colour, a wide bloom |

Contrast (WCAG), measured:

| Pairing | Ratio |
|---|---|
| Cream on ink | 16.4 : 1 |
| Secondary text `#C8B3A2` on ink | 9.9 : 1 |
| Muted text `#9C857A` on a card | 5.5 : 1 |
| Amber on ink | 10.9 : 1 |
| Neon on ink | 6.0 : 1 |
| Pink neon on ink | 6.9 : 1 |
| Neon core (sign text) on ink | 16.8 : 1 |
| Neon core on the night sky | 15.4 : 1 |
| Hero tagline on the sky, at its lowest (reddest) point | 6.0 : 1 |
| Cream on lacquer (button hover) | 5.6 : 1 |
| **Lacquer as text on ink** | **2.9 : 1 — never use lacquer for text** |

The glow is decoration; every ratio above is measured on the text colour alone.

## Type

| Role | Face | Why |
|---|---|---|
| Display | **Big Shoulders** (800) | Tall and condensed, drawn from 1930s Chicago signage: headings read like towers |
| Neon signs | **Big Shoulders Inline** | The inline-stroke cut reads as bent glass tubing. Only for signs: the hero name, section titles, page titles, the 404 |
| Body | **Jost** | Follows Futura (1927), so the body copy belongs to the same era |
| Labels, typed text | **Space Mono** | The typed role plaque, the personnel file, small caps labels |

Headings are uppercase. Every neon sign is `--clr-neon-core` text with a
`--glow-text` bloom. Section titles flicker on, like a sign warming up, as they
scroll into view. The hero name does the same on load.

## Motifs

Each one appears where it means something, not everywhere:

- **Neon signs.** The hero name and every section title, in the inline face.
- **Neon tubes.** They appear in six places:
  - red and pink outlines on five towers
  - the street line at the foot of the city
  - the tube across each project card, and the ring round each skill monogram
  - the tapering divider under each header
  - primary buttons and the active filter
  - the red-pink-red canopy that closes the contact section
- **Film grain.** The print texture of the references. Over the hero sky and pressed into the paper file.
- **Sunburst.** Brass rays rising behind each section title.
- **Kicker.** The section's navbar name, flanked by brass rules with diamond ends.
- **Double hairline frame.** A border plus a second line 5 px inside it, on panels and tiles.
- **Fluting.** The footer plinth and the mobile menu's edge, like the bridge pillar in reference 1.

## Section notes

- **Hero.** The skyline is server-rendered SVG, with no client JavaScript: stars, a red moon, neon-traced towers, and a neon street. `--scroll` sinks the distant planes faster as you scroll. The searchlights sweep. The owl-signal and the name "warm up" on load.
- **About.** A personnel file on paper, with an inked AVAILABLE stamp.
- **Skills.** Each monogram sits in a ring of lit neon tube, coloured by category. Red is Languages & Web, pink is Databases & Cloud, amber is Hardware & Systems, and the filter buttons carry the colour key. On hover or tap, the tile switches on like a sign: dark glass in a tube frame of its colour, with the description.
- **Projects.** Poster cards with a lacquer band. The category is the card's kicker. On hover the lights come on.
- **Certificates.** Each certificate sits in a mat with a brass fillet. The lightbox uses a double brass frame.
- **Contact.** A stage spotlight from above, and the neon canopy below.
- **404 and errors.** The status code is a neon sign in the inline face.

## Phones

The desktop layout is the reference; phones get their own arrangement of the
same pieces. Media queries are written out by hand (CSS has no custom media
yet), always one of these:

| Regime | Query | What changes |
|---|---|---|
| Phone | `(max-width: 767px)` | Single column, phone spacing, swipeable filter chips |
| Phone, portrait | `(max-width: 767px) and (orientation: portrait)` | Bottom tab bar; the skyline becomes a band under the hero text |
| Short landscape | `(orientation: landscape) and (max-height: 500px)` | Compact top bar and drawer; hero text over the full city |
| Compact nav | `(max-width: 1023px)` | The top bar shows the burger instead of links |
| Desktop | `(min-width: 1024px)` | Unchanged |
| Hover | `(hover: hover) and (pointer: fine)` | The **only** place `:hover` effects live; on touch they stick after a tap |
| Touch | `(hover: none)` | `:active` press feedback and "tap" hints |

Only one navigation pattern shows at a time:

| Screen | Top bar | Sections |
|---|---|---|
| Phone, portrait | Logo (home) + CV button | **Bottom tab bar** |
| Phone landscape, tablet | Logo + burger | Side drawer |
| Desktop | Logo + links + "Let's Talk" | — |

- **The tab bar** is a marquee rail along the bottom: glass-black, a brass
  double hairline on top, five tabs with icon and label. A short neon tube
  glides to the current tab. It slides away while a form field has focus and
  under the drawer or lightbox, and clears the home indicator.
- **The nav indicators** (the desktop underline and the tab bar's tube) follow
  a line 40% down the screen, so tall sections light up as soon as they reach
  it. A clicked link lights at once instead of trailing through the sections
  in between.
- **Skill tiles** switch on with a tap as well as hover, and from the keyboard.
  Keep skill descriptions to **70 characters or fewer**; the phone tiles are
  sized for that.
- **Certificates** become compact cards on phones, thumbnail on the left; the
  whole card opens the lightbox. In the lightbox, swipe left and right to step
  through, swipe down to close, and Back closes it too. Every gesture also has
  a visible button.
- **Contact** puts the tap-to-call and tap-to-email cards before the form.
- **Sizes.** Everything tappable is at least **44 × 44 px**, and no text is
  smaller than **12 px**.
- **Safe areas.** `viewport-fit=cover` is on; the bars, drawer, lightbox and
  gutters pad with the `--safe-*` tokens.
- **Checking.** With the dev server running, `node scripts/mobile-audit.mjs`
  checks seven phone, landscape and tablet sizes for content past the screen
  edge, small tap targets, small text, and hero buttons below the fold.

## Editing the skyline

The towers are data in `src/components/Skyline.js` as `[x, width, height, crown]`,
in a 1600 × 1000 view box with the ground at y = 1000:

- **Crowns:** `flat`, `setback`, `spire`, `ziggurat`, `fin`, `dome`, `water`, `hero`, `fluted`.
- **Neon outline:** add a fifth value, `"red"` or `"pink"`, to trace that tower in neon. The far and mid planes support it.
- **Left half:** keep it low (height ≤ 180), so the hero text sits on open sky.
- **Windows:** lit from a fixed seed per plane. Change the `seed` to re-light the city.

## Motion and access

- **Reduced motion.** Every animation stops under `prefers-reduced-motion`. The skyline shows a still frame, with beams parked and all lights on.
- **Keyboard.** Focus is an amber ring, visible on both the sky and the night sections.
- **Filters.** Filter buttons report their state with `aria-pressed` or `aria-selected`.
