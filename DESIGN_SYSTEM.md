# PRDXQ Design System

Stand: 1. November 2026

## Intent
One coherent digital studio identity: editorial graphite typography, mineral light surfaces, deep graphite dark mode and a restrained lime signal. Cinematic depth belongs to hero and showcase moments. Navigation, reading and forms remain calm and predictable.

## Tokens
- Ink: #172128 (light), #f2f5f7 (dark).
- Supporting text: #53616b (light), #c0c9d1 (dark).
- Accent: #c7ff38 with dark foreground.
- Typography: Manrope for display and interface; DM Mono for labels and metadata.
- Content width: 1,480px maximum; long-form copy around 65–72 characters per line.
- Touch targets: aim for at least 44px. Inputs use 16px to avoid mobile zoom.
- Responsive navigation: one shared 800px breakpoint.

## UX principles
1. Solve the user's task before adding visual effects.
2. Make keyboard focus visible and provide a skip-to-content path.
3. Keep hidden mobile navigation out of the focus order; trap focus while open and restore it on close.
4. Respect reduced motion; use transform/opacity for short, meaningful transitions.
5. Keep light and dark themes equally readable.
6. Mark concept previews as concepts. Do not imply they are screenshots, live deployments or commissioned client work unless verified.
7. Avoid unsupported delivery promises, metrics, client outcomes or ratings.
8. Use visible form labels and clear inline status messages.

## Page roles
- Home: positioning, capabilities and one clear project CTA.
- Work: projects and concepts with transparent status.
- Lab: interactive demonstrations, not claims about shipped products.
- Design: framed style explorations.
- Contact: guided intake that stores the inquiry securely.
- Admin: private inquiry and reward operations; preserve auth and RLS.

## Change discipline
Keep shared design tokens in theme.css. Prefer shared tokens over page-specific overrides. No arbitrary z-index escalations, decorative icon clutter or unverified social proof.
