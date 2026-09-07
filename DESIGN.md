---
name: Mobbin
url: https://mobbin.com/
colors:
  background: "#ffffff"
  background-dark: "#141414"
  surface-light: "#ededed"
  surface-dark: "#404040"
  text-primary: "#141414"
  text-secondary: "#717171"
  text-muted: "#adadad"
  text-inverse: "#ffffff"
  border-light: "#e7e7e7"
  primary-red: "#ff4d6b" # Inferred from hero icon
  interactive-blue-base: "#4285f4" # Inferred from pseudoStates rgba(66, 133, 244, ...)
  focus-ring: "#00639b" # From pseudoStates rgb(0, 99, 155)
typography:
  display:
    family: "M Saans 652"
    size: 80px
    weight: 400
    line-height: 1.2
  h1:
    family: "M Saans 652"
    size: 32px
    weight: 400
    line-height: 1.2
  h2:
    family: "M Saans 652"
    size: 24px
    weight: 400
    line-height: 1.2
  body:
    family: "sans-serif"
    size: 16px
    weight: 400
    line-height: 1.5
  small:
    family: "sans-serif"
    size: 14px
    weight: 400
    line-height: 1.5
  caption:
    family: "sans-serif"
    size: 12px
    weight: 400
    line-height: 1.5
  code:
    family: "monospace"
    size: 12px
    weight: 400
    line-height: 1.5
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 128]
radius:
  sm: 16px
  md: 20px
  lg: 24px
  full: 9999px
elevation:
  card: "0px 1px 2px 0px rgba(0, 0, 0, 0.04)"
  modal: "0px 8px 40px 0px rgba(0, 0, 0, 0.04)"
  focus-white-outline: "0px 0px 0px 2px rgb(255, 255, 255)" # Used as an inner outline
motion:
  duration-base: "218ms"
  duration-fast: "200ms"
  duration-spin: "800ms"
  easing-standard: "ease-out"
  easing-linear: "linear"
components:
  button-primary:
    bg: "{colors.text-primary}"
    text: "{colors.text-inverse}"
    radius: "{radius.full}"
    padding: "14px 24px"
  button-secondary:
    bg: "{colors.background}"
    text: "{colors.text-primary}"
    border: "1px solid {colors.border-light}"
    radius: "{radius.full}"
    padding: "14px 24px"
  card:
    bg: "{colors.background}"
    radius: "{radius.lg}"
    shadow: "{elevation.card}"
  input:
    bg: "{colors.background}"
    border: "1px solid {colors.border-light}"
    radius: "{radius.sm}"
    padding: "10px 16px"
---

# Design System Inspired by Mobbin

## 1. Visual Theme & Atmosphere

Mobbin presents a clean, content-focused aesthetic, emphasizing clarity and ease of navigation for its extensive library of UI/UX inspiration. The design relies heavily on a stark white background (`#ffffff`) contrasted with deep black text (`#141414`), creating a high-readability environment. Subtle grey tones like `#adadad` and `#717171` are used for secondary information and borders, preventing visual clutter. The primary visual accent is a vibrant red (`#ff4d6b`) seen in the hero section's icon and subtle interactive elements, providing a friendly touch without overwhelming the minimalist layout.

Typography plays a crucial role, utilizing the distinct `M Saans 652` for prominent headings and a clear `sans-serif` for body text, ensuring a strong visual hierarchy. Layouts are spacious, with ample padding and rounded corners (`24px` radius for main content cards) that soften the overall appearance. Interaction feedback is subtle yet present, with CSS-driven background color transitions (`218ms`) on buttons and links, indicating responsiveness without being distracting. The site primarily showcases app screenshots, with minimal brand illustration and monochrome line icons, keeping the focus on user-generated content.

**Key Characteristics**:

- High contrast: `#141414` text on `#ffffff` background.
- Spacious layouts: Generous `80px` vertical padding for sections.
- Rounded corners: `24px` radius for cards, `9999px` for buttons.
- Distinct typography: `M Saans 652` for display, `sans-serif` for body.
- Subtle interactivity: `218ms` background transitions on hover.
- Minimalist iconography: Monochrome line icons throughout.
- Brand accent: `primary-red` (`#ff4d6b`) for key elements.

## 2. Color Palette & Roles

- **Primary**
  - `primary-red` (`#ff4d6b`) — Used as the brand accent color, notably in the hero section's central icon and for subtle highlights. (inferred from screenshot)

- **Interactive**
  - `interactive-blue-base` (`#4285f4`) — The base blue color used for interactive states, typically with opacity, for hover and active feedback on elements. (inferred from pseudoStates rgba values)
  - `focus-ring` (`#00639b`) — The distinct blue color used for keyboard focus outlines, ensuring accessibility.

- **Neutral Scale**
  - `background` (`#ffffff`) — The dominant background color across the entire site, providing a clean canvas.
  - `text-primary` (`#141414`) — The primary color for headings and main body text, offering high contrast on light backgrounds.
  - `text-secondary` (`#717171`) — Used for secondary information, descriptions, and less prominent text.
  - `text-muted` (`#adadad`) — Applied to subtle hints, disabled states, and very light contextual text.
  - `text-inverse` (`#ffffff`) — Used for text elements placed on dark backgrounds or primary action buttons.

- **Surface & Borders**
  - `surface-light` (`#ededed`) — A very light grey used for subtle background tints, such as search input fields or card backgrounds.
  - `surface-dark` (`#404040`) — A dark grey used for backgrounds of elements within dark sections, providing contrast against `background-dark`.
  - `background-dark` (`#141414`) — Used for sections or components that require a dark background, often paired with `text-inverse`.
  - `border-light` (`#e7e7e7`) — A light grey used for subtle borders on inputs, buttons, and dividing lines. (inferred from screenshot)

## 3. Typography Rules

- **Font Family**:
  - Primary: `'M Saans 652', 'M Saans 600', 'M Saans 456', 'sans-serif'`
  - Monospace: `'monospace'` (for code snippets or technical text)

- **Hierarchy**:
  - **Display**: `M Saans 652` `80px` `400` · line-height `1.2` · tracking `0px` · Used for the primary hero headline.
  - **H1**: `M Saans 652` `32px` `400` · line-height `1.2` · tracking `0px` · Main section titles.
  - **H2**: `M Saans 652` `24px` `400` · line-height `1.2` · tracking `0px` · Sub-section titles and prominent text.
  - **H3**: `M Saans 600` `20px` `600` · line-height `1.3` · tracking `0px` · Card titles and emphasized headings. (inferred from screenshot, `M Saans 600` and `20px` from `cssVariables`)
  - **Body**: `sans-serif` `16px` `400` · line-height `1.5` · tracking `0px` · Standard paragraph text and descriptions.
  - **Small**: `sans-serif` `14px` `400` · line-height `1.5` · tracking `0px` · Secondary information, meta-data, and form hints.
  - **Caption**: `sans-serif` `12px` `400` · line-height `1.5` · tracking `0px` · Footnotes, timestamps, and very subtle text.
  - **Code/Mono**: `monospace` `12px` `400` · line-height `1.5` · tracking `0px` · Generic fallback for code.

- **Principles**:
  - Maintain a clear visual hierarchy by pairing the bold `M Saans` for headings with a legible `sans-serif` for body content.
  - Utilize generous line-heights of `1.2` for headings and `1.5` for body text to enhance readability and visual breathing room.
  - Ensure `text-primary` (`#141414`) is used for all main content on `background` (`#ffffff`) for optimal contrast (ratio 18.42, AAA).
  - Employ `text-secondary` (`#717171`) for less critical information, balancing visual weight without losing legibility.

## 4. Component Stylings

### Buttons

Mobbin's buttons feature generous padding and fully rounded corners, providing a friendly yet professional appearance. Transitions are smooth, indicating interactive states clearly.

#### Primary Button

A prominent call-to-action button with a dark background and inverse text.

```css
.button-primary {
  background-color: var(--color-text-primary, #141414);
  color: var(--color-text-inverse, #ffffff);
  font-family: var(--typography-body-family, sans-serif);
  font-size: 16px;
  font-weight: 400;
  padding: 14px 24px;
  border: none;
  border-radius: var(--radius-full, 9999px);
  cursor: pointer;
  transition: background-color var(--motion-duration-base, 218ms)
    var(--motion-easing-standard, ease-out);
}

.button-primary:hover {
  background-color: var(
    --color-background-dark,
    #000000
  ); /* inferred from screenshot */
}

.button-primary:active {
  background-color: var(
    --color-background-dark,
    #000000
  ); /* inferred from screenshot */
  transform: translateY(1px); /* inferred from screenshot */
}

.button-primary:disabled {
  background-color: var(--color-text-muted, #adadad);
  cursor: not-allowed;
  opacity: 0.7; /* inferred from screenshot */
}
```

<details>
<summary>Secondary Button</summary>

A ghost button with a light background and border, used for secondary actions.

```css
.button-secondary {
  background-color: var(--color-background, #ffffff);
  color: var(--color-text-primary, #141414);
  font-family: var(--typography-body-family, sans-serif);
  font-size: 16px;
  font-weight: 400;
  padding: 14px 24px;
  border: 1px solid var(--color-border-light, #e7e7e7);
  border-radius: var(--radius-full, 9999px);
  cursor: pointer;
  transition:
    background-color var(--motion-duration-base, 218ms)
      var(--motion-easing-standard, ease-out),
    border-color var(--motion-duration-base, 218ms)
      var(--motion-easing-standard, ease-out);
}

.button-secondary:hover {
  background-color: var(
    --color-surface-light,
    #f5f5f5
  ); /* inferred from screenshot */
  border-color: var(--color-text-muted, #adadad); /* inferred from screenshot */
}

.button-secondary:active {
  background-color: var(
    --color-surface-light,
    #f0f0f0
  ); /* inferred from screenshot */
  transform: translateY(1px); /* inferred from screenshot */
}

.button-secondary:disabled {
  background-color: var(--color-background, #ffffff);
  border-color: var(--color-text-muted, #adadad);
  color: var(--color-text-muted, #adadad);
  cursor: not-allowed;
  opacity: 0.7; /* inferred from screenshot */
}
```

</details>

<details>
<summary>Ghost Button</summary>

A text-only button used for less prominent actions, often within navigation or secondary contexts.

```css
.button-ghost {
  background-color: transparent;
  color: var(--color-text-primary, #141414);
  font-family: var(--typography-body-family, sans-serif);
  font-size: 16px;
  font-weight: 400;
  padding: 10px 12px; /* inferred from screenshot */
  border: none;
  border-radius: var(--radius-sm, 16px); /* inferred from screenshot */
  cursor: pointer;
  transition:
    background-color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out),
    color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out);
}

.button-ghost:hover {
  background-color: rgba(
    var(--color-interactive-blue-base, 66, 133, 244),
    0.08
  ); /* from pseudoStates */
  color: var(--color-text-primary, #141414); /* inferred from screenshot */
}

.button-ghost:active {
  background-color: rgba(
    var(--color-interactive-blue-base, 66, 133, 244),
    0.1
  ); /* from pseudoStates */
  color: var(--color-text-primary, #141414); /* inferred from screenshot */
}

.button-ghost:disabled {
  color: var(--color-text-muted, #adadad);
  cursor: not-allowed;
  opacity: 0.7; /* inferred from screenshot */
}
```

</details>
### Cards & Containers

#### Standard Card

Used for displaying app screenshots and user testimonials, featuring a white background, large border-radius, and a subtle shadow.

```css
.card {
  background-color: var(--color-background, #ffffff);
  border-radius: var(--radius-lg, 24px);
  box-shadow: var(--elevation-card, 0px 1px 2px 0px rgba(0, 0, 0, 0.04));
  padding: 24px; /* inferred from screenshot */
  transition: box-shadow var(--motion-duration-base, 218ms)
    var(--motion-easing-standard, ease-out);
}

.card:hover {
  box-shadow: var(
    --elevation-modal,
    0px 8px 40px 0px rgba(0, 0, 0, 0.04)
  ); /* inferred from screenshot */
}
```

### Inputs & Forms

#### Text Input

A standard text input field with a light border and background, and a clear focus state.

```css
.input-text {
  background-color: var(--color-surface-light, #ededed);
  color: var(--color-text-primary, #141414);
  font-family: var(--typography-body-family, sans-serif);
  font-size: 16px;
  font-weight: 400;
  padding: 10px 16px;
  border: 1px solid var(--color-border-light, #e7e7e7);
  border-radius: var(--radius-sm, 16px);
  transition:
    border-color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out),
    box-shadow var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out);
}

.input-text::placeholder {
  color: var(--color-text-muted, #adadad);
}

.input-text:focus {
  outline: 2px solid var(--color-focus-ring, #00639b); /* from pseudoStates */
  outline-offset: 1px; /* inferred from screenshot */
  border-color: var(--color-focus-ring, #00639b); /* inferred from screenshot */
  box-shadow: var(
    --elevation-focus-white-outline,
    0px 0px 0px 2px rgb(255, 255, 255)
  ); /* from pseudoStates */
}

.input-text:disabled {
  background-color: var(--color-surface-light, #ededed);
  border-color: var(--color-border-light, #e7e7e7);
  color: var(--color-text-muted, #adadad);
  cursor: not-allowed;
  opacity: 0.7; /* inferred from screenshot */
}
```

<details>
<summary>Form Label</summary>

Standard label for form fields.

```css
.form-label {
  color: var(--color-text-primary, #141414);
  font-family: var(--typography-body-family, sans-serif);
  font-size: 16px;
  font-weight: 400;
  margin-bottom: var(--spacing-8, 8px);
  display: block;
}
```

</details>

<details>
<summary>Checkbox/Radio</summary>

Custom styled checkbox/radio buttons (not visible in screenshot, inferring basic styles).

```css
.checkbox-radio {
  appearance: none;
  width: 20px; /* inferred from screenshot */
  height: 20px; /* inferred from screenshot */
  border: 2px solid var(--color-border-light, #e7e7e7);
  border-radius: var(--radius-sm, 16px); /* for checkbox */
  transition:
    background-color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out),
    border-color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out);
  cursor: pointer;
  vertical-align: middle; /* inferred from screenshot */
}

.checkbox-radio[type="radio"] {
  border-radius: var(--radius-full, 9999px); /* for radio */
}

.checkbox-radio:checked {
  background-color: var(
    --color-text-primary,
    #141414
  ); /* inferred from screenshot */
  border-color: var(--color-text-primary, #141414);
}

.checkbox-radio:focus {
  outline: 2px solid var(--color-focus-ring, #00639b);
  outline-offset: 2px;
}

.checkbox-radio:disabled {
  background-color: var(--color-surface-light, #ededed);
  border-color: var(--color-border-light, #e7e7e7);
  opacity: 0.7;
  cursor: not-allowed;
}
```

</details>
### Navigation

#### Top Navigation Bar

The main header bar, fixed at the top, containing the logo and primary navigation links.

```css
.navbar-top {
  background-color: var(--color-background, #ffffff);
  padding: var(--spacing-20, 20px) var(--spacing-40, 40px); /* inferred from screenshot */
  border-bottom: 1px solid var(--color-border-light, #e7e7e7); /* inferred from screenshot */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: var(--z-header, 9);
  box-shadow: var(
    --elevation-card,
    0px 1px 2px 0px rgba(0, 0, 0, 0.04)
  ); /* inferred from screenshot */
}
```

<details>
<summary>Navigation Link</summary>

Individual links within the top navigation bar.

```css
.nav-link {
  color: var(--color-text-secondary, #717171);
  font-family: var(--typography-body-family, sans-serif);
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  padding: var(--spacing-8, 8px) var(--spacing-12, 12px); /* inferred from screenshot */
  border-radius: var(--radius-sm, 16px); /* inferred from screenshot */
  transition:
    background-color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out),
    color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out);
}

.nav-link:hover {
  background-color: rgba(
    var(--color-interactive-blue-base, 66, 133, 244),
    0.08
  ); /* from pseudoStates */
  color: var(--color-text-primary, #141414); /* inferred from screenshot */
}

.nav-link.active,
.nav-link[aria-current="page"] {
  color: var(--color-text-primary, #141414);
  font-weight: 600; /* inferred from screenshot */
}
```

</details>

<details>
<summary>Dropdown Menu</summary>

(None observed in source)

</details>
### Links

#### Standard Link

Default inline text links, typically underlined on hover.

```css
.link-standard {
  color: var(--color-text-primary, #141414);
  text-decoration: none;
  transition:
    text-decoration-color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out),
    color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out);
}

.link-standard:hover {
  color: var(
    --color-text-primary,
    #141414
  ); /* pseudoStates show no color change */
  text-decoration: underline;
  text-decoration-color: var(--color-text-primary, #141414);
}

.link-standard:visited {
  color: var(--color-text-secondary, #717171); /* inferred from screenshot */
}
```

<details>
<summary>Secondary Link</summary>

Links used for less prominent actions or within a more muted context.

```css
.link-secondary {
  color: var(--color-text-secondary, #717171);
  text-decoration: none;
  transition:
    text-decoration-color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out),
    color var(--motion-duration-fast, 200ms)
      var(--motion-easing-standard, ease-out);
}

.link-secondary:hover {
  color: var(--color-text-primary, #141414); /* inferred from screenshot */
  text-decoration: underline;
  text-decoration-color: var(--color-text-primary, #141414);
}

.link-secondary:visited {
  color: var(--color-text-muted, #adadad); /* inferred from screenshot */
}
```

</details>
### Badges
(none observed in source)

## 5. Layout Principles

- **Spacing System**:
  Base unit `4px` → Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 128`
  - `4px`: Smallest inline element spacing, icon-to-text.
  - `8px`: Vertical spacing for form labels, small lists, tight component elements.
  - `12px`: Padding inside small buttons or tags.
  - `16px`: Standard padding for inputs, horizontal spacing between menu items.
  - `20px`: Vertical padding for navigation bars.
  - `24px`: Padding inside cards, spacing between minor sections.
  - `32px`: Vertical spacing between form groups, larger component separations.
  - `40px`: Horizontal padding for main content areas, larger component gaps.
  - `48px`: Spacing between major content blocks.
  - `64px`: Significant vertical section padding.
  - `80px`: Large vertical spacing for hero sections and main content divisions.
  - `128px`: Extra large horizontal padding for wide desktop layouts.

- **Grid & Container** _(Suggested — not measured)_:
  _Note: container widths and column counts are not extracted from the source. The values below are reasonable defaults inferred from the visible layout density._
  - **Max Width**: `1440px` (inferred from screenshot viewport)
  - **Columns**: `12` (inferred)
  - **Gutter**: `24px` (inferred)
  - **Section Padding**: `80px` vertical, `128px` horizontal (inferred from screenshot)

- **Whitespace Philosophy**:
  Mobbin leverages generous whitespace to create a sense of calm and focus, allowing content to breathe and preventing visual overload. Large `80px` vertical margins separate major sections, while `24px` padding within cards ensures content is not cramped. This ample use of `background` (`#ffffff`) contributes to the clean, professional, and content-first impression.

- **Border Radius Scale**:
  - `sm`: `16px` — Used for input fields, small interactive elements, and internal components.
  - `md`: `20px` — Applied to smaller cards or specific UI elements requiring a softer edge.
  - `lg`: `24px` — Prominently used for main content cards and larger containers.
  - `full`: `9999px` — Utilized for fully rounded buttons and circular elements like avatars.

## 6. Depth & Elevation

- **Flat (z-neg-2)**: `none` — Background elements that sit beneath the main content.
- **Base (z-neg-1)**: `none` — Elements that are part of the page flow but visually behind.
- **Card (z-1)**: `0px 1px 2px 0px rgba(0, 0, 0, 0.04)` — Standard elevation for content cards and subtle UI elements.
- **Card Overlay (z-2)**: `none` — Used for overlays on cards (e.g., hover states or interaction layers).
- **Header (z-9)**: `0px 1px 2px 0px rgba(0, 0, 0, 0.04)` — Fixed navigation bar, slightly elevated above content.
- **Overlay (z-9999)**: `none` — Specific third-party overlays like Google One Tap.

**Shadow Philosophy**:
Mobbin employs a subtle shadow philosophy, primarily using `0px 1px 2px 0px rgba(0, 0, 0, 0.04)` for cards to provide a gentle lift without heavy visual weight. On hover, cards gain a more pronounced `0px 8px 40px 0px rgba(0, 0, 0, 0.04)` shadow, indicating interactivity and depth. The overall approach is to add minimal, soft depth, maintaining the clean and uncluttered aesthetic.

## 7. Do's and Don'ts

### Do's

- **Do** use `text-primary` (`#141414`) for all main headings and body text on `background` (`#ffffff`) for AAA contrast (18.42:1).
- **Do** apply `M Saans 652` `80px` `400` only to the main hero headline to maintain its distinct visual impact.
- **Do** use `padding: 14px 24px` and `border-radius: 9999px` for all `Primary Button` and `Secondary Button` instances.
- **Do** separate major content sections with at least `80px` of vertical spacing using the `spacing` scale.
- **Do** ensure all `input-text` fields have a `1px` solid `border-light` (`#e7e7e7`) and `16px` `border-radius`.
- **Do** implement the `focus-ring` (`#00639b`) outline for all interactive elements to ensure accessibility.
- **Do** use `text-secondary` (`#717171`) for descriptive text and metadata, which has an AA contrast ratio of 4.88:1 on `background` (`#ffffff`).
- **Do** apply `border-radius: 24px` to `card` components to achieve the signature soft-edged look.

### Don'ts

- **Don't** use `text-muted` (`#adadad`) on `background-dark` (`#404040`); its contrast ratio of 4.62:1 only passes AA, but `text-inverse` (`#ffffff`) is preferred.
- **Don't** introduce custom spacing values; adhere strictly to the `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 128px` `spacing` scale.
- **Don't** use `M Saans 652` for body text; reserve it for headings to preserve typographic hierarchy.
- **Don't** alter the `218ms` `background-color` transition duration for buttons; maintain consistent interaction feedback.
- **Don't** use hard, sharp corners; always apply a `border-radius` from the `sm`, `md`, or `lg` scale.
- **Don't** use `text-primary` (`#141414`) on `surface-dark` (`#404040`); its contrast ratio of 1.78:1 fails AA.
- **Don't** use `text-secondary` (`#717171`) for primary calls to action; reserve `text-primary` (`#141414`) or `text-inverse` (`#ffffff`).
- **Don't** apply shadows heavier than `0px 8px 40px 0px rgba(0, 0, 0, 0.04)` to maintain the light and airy aesthetic.

## 8. Responsive Behavior

- **Breakpoints**:
  - **Mobile Small** (~410px): Adjust typography to `14px` body, stack `Primary Button` and `Secondary Button` vertically.
  - **Mobile Large** (~809px): Collapse `Top Navigation Bar` into a hamburger menu, optimize `card` layouts to single column.
  - **Tablet** (~810px - 1199px): Adjust `section padding` to `40px` horizontal, allow `card` components to display in 2 columns.
  - **Desktop** (~1200px+): Maintain `1440px` max content width, utilize `128px` horizontal `section padding`.

- **Touch Targets**:
  - Ensure all interactive elements, including `buttons` and `nav-links`, have a minimum touch target size of `44px` by `44px`.
  - Maintain a minimum of `8px` `spacing` between adjacent interactive elements to prevent accidental taps.

- **Collapsing Strategy**:
  - **Navigation**: The `Top Navigation Bar` should transition to a hamburger menu below `809px`, keeping the logo visible.
  - **Cards**: `card` layouts should reflow from multiple columns to a single column on screens below `809px`.
  - **Typography**: `Display` and `H1` font sizes should scale down to `32px` and `24px` respectively on mobile breakpoints.
  - **Padding**: Horizontal `section padding` should reduce to `24px` on mobile to maximize content area.
  - **Forms**: `input-text` fields should expand to `100%` width within their container on mobile.
  - **Spacing**: Vertical `spacing` between major sections can be reduced to `48px` on mobile to optimize screen real estate.

## 9. Agent Prompt Guide

- **Quick Color Reference**
  - `background`: `#ffffff`
  - `background-dark`: `#141414`
  - `surface-light`: `#ededed`
  - `surface-dark`: `#404040`
  - `text-primary`: `#141414`
  - `text-secondary`: `#717171`
  - `text-muted`: `#adadad`
  - `text-inverse`: `#ffffff`
  - `border-light`: `#e7e7e7`
  - `primary-red`: `#ff4d6b`
  - `interactive-blue-base`: `#4285f4`
  - `focus-ring`: `#00639b`

- **Iteration Guide**
  1.  Always use `text-primary` (`#141414`) on `background` (`#ffffff`) for body text, ensuring AAA contrast.
  2.  Always apply `font-family: 'M Saans 652'` for `Display` and `H1` through `H3` roles.
  3.  Always use `padding: 14px 24px` and `border-radius: 9999px` for `Primary Button` and `Secondary Button`.
  4.  Always use `border-radius: 24px` for `card` components.
  5.  Always use the `spacing` scale values of `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 128px`.
  6.  Always include `transition: background-color 218ms ease-out` for interactive elements like buttons and links.
  7.  Always use `outline: 2px solid #00639b` for the focus ring on `input-text` and interactive elements.
  8.  Always apply `box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04)` as the default elevation for `card` components.
  9.  Always ensure the `Top Navigation Bar` collapses into a hamburger menu below `809px` viewport width.
  10. Always reduce `Display` font size to `32px` on mobile (`max-width: 809px`).
  11. Never use `text-primary` (`#141414`) on `surface-dark` (`#404040`) due to insufficient contrast.
  12. Always ensure `nav-link` elements have a `background-color` change to `rgba(66, 133, 244, 0.08)` on hover.

<!-- DESIGNMD_VALIDATOR_WARNINGS
{
  "version": 1,
  "generatedAt": "2026-07-29T19:27:57.431Z",
  "summary": {
    "unpairedBanned": 1,
    "bannedPhrase": 0,
    "total": 1
  },
  "warnings": [
    {
      "kind": "unpaired-banned-word",
      "term": "clean",
      "sentence": "Mobbin presents a clean, content-focused aesthetic, emphasizing clarity and ease of navigation for its extensive library of UI/UX inspiration."
    }
  ]
}
-->
