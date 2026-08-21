# LocalRepair MVP Design System

## 1. Design principles

Trust first, local second, action third. Every page should answer “what can I do next?” Keep copy plain, forms short, and the repair status visible. Prefer useful whitespace and clear hierarchy over decorative complexity.

## 2. Visual direction

Modern neighborhood service: warm off-white surfaces, deep navy text, repair-blue primary actions, and a small green trust accent. Use subtle borders and shadows; avoid gradients, autoplay effects, and excessive animation.

## 3. Tokens (Tailwind-friendly)

```text
primary:       #2563EB (blue-600)
primary-dark:  #1D4ED8 (blue-700)
ink:           #0F172A (slate-900)
muted:         #64748B (slate-500)
surface:       #FFFFFF
background:    #F8FAFC (slate-50)
border:        #E2E8F0 (slate-200)
success:       #16A34A (green-600)
warning:       #D97706 (amber-600)
danger:        #DC2626 (red-600)
info:          #0891B2 (cyan-600)
```

Use a 4px base spacing scale: `p-1` through `p-8`, with sections commonly using `py-12` or `py-20`. Cards use `rounded-xl`, `border`, and a restrained shadow. Content is centered with a maximum width around `max-w-7xl`.

## 4. Typography

Use a clean sans-serif system stack or Inter if already available. Body is 16px with comfortable line height. Page titles are 32–48px responsive; section titles 24–32px; card titles 18–20px. Use sentence case and avoid all-caps except compact badges.

## 5. Components

- **Buttons:** primary filled blue, secondary white with border, destructive red only for destructive actions. Minimum 44px touch height; include disabled and loading states.
- **Inputs:** visible label, helper/error text, 12px radius, clear focus ring, useful placeholder only as an example.
- **Cards:** one clear action; show icon/photo, title, supporting metadata, and status where relevant.
- **Badges:** colored background with text and icon where useful. Status labels are human-readable: “Searching”, “Accepted”, “On the way”, “Completed”.
- **Navbar:** LocalRepair wordmark, concise public links, role-aware dashboard CTA, and user menu after login.
- **Footer:** short value statement, support/contact placeholder, and legal placeholder; do not imply services that do not exist.
- **Timeline:** vertical on mobile, compact horizontal only on wide screens; completed steps use green, active uses blue, upcoming uses muted gray.

## 6. Screens

### Landing page

Hero: “Reliable appliance repair, close to home.” Explain verified technicians and transparent estimates. Primary CTA is “Book a repair”; secondary is “Join as a technician”. Follow with appliance category cards, three-step explanation, trust stats from seed data, and footer.

### Service categories

Show AC, refrigerator, washing machine, microwave, TV, water purifier, cooler, and geyser as icon cards. Selecting a category starts the booking wizard and preserves the selection.

### Diagnosis UI

Use a short form: category, problem description, optional urgency/context. Result card clearly labels “Suggested issue”, “Urgency”, and “What to check next”. Provide “Use this and continue” plus “Edit description”. Include a disclaimer that a technician confirms the diagnosis.

### Technician listing

Show verified badge, name, category match, rating, completed jobs, service area, approximate distance when available, and a “View profile”/“Choose technician” action. Include loading skeleton, no-match empty state, and retryable error.

### Technician profile

Identity and trust information appear above the fold: name, verified badge, rating, experience, skills, service area, availability, and reviews. The booking CTA remains visible on mobile.

### Booking page

Use a stepper: appliance → problem/diagnosis → address → technician → preferred date/time → review request. Preserve entered values when moving backward. The final summary shows appliance, issue, address, technician, and schedule before submission.

### Booking confirmation

Show a clear confirmation number, current status “Searching”, selected technician if assigned, next step, and “View repair status”. Avoid claiming the technician has accepted until the API says so.

### Customer dashboard

Top: greeting and “Book a repair”. Below: active repair card with status/timeline, recent repairs, saved appliances, and a compact profile panel. Empty state explains how to create the first repair.

### Technician dashboard

Top: availability toggle, today’s summary, pending requests, and active job. Each job shows appliance, issue, area, requested time, and accept/reject actions. Job detail includes status actions, estimate form, and completion action.

## 7. States and accessibility

Every data view needs loading, error, and empty states. Error copy explains what the user can do next and never exposes stack traces. Use semantic headings, labels, button elements, keyboard-operable controls, visible focus, sufficient contrast, alt text for meaningful imagery, and `aria-live` for mutation feedback. Responsive behavior should support 320px-wide mobile through desktop; use stacked cards and sticky bottom CTAs on small screens.

## 8. Motion

Use only short transitions for hover, focus, and status changes. Respect `prefers-reduced-motion`. No animation should delay booking or hide critical state.

