# PRDXQ — Digital Studio Portfolio

A mobile-first portfolio for PRDXQ / Ilias Asdufan, built with semantic HTML, CSS and vanilla JavaScript and published through GitHub Pages.

## Pages

- \`index.html\` — positioning, selected work, capabilities and process
- \`projects.html\` — project index and case-study entry points
- \`services.html\` — service categories and inquiry paths
- \`lab.html\` — interactive frontend experiments
- \`design.html\` — live design-style playground
- \`about.html\` — founder profile and working approach
- \`contact.html\` — project inquiry form that prepares an email draft
- \`work.html\` — compatibility redirect to the project index

## Local preview

Because this is a static website, open \`index.html\` directly or run a simple local server:

\`\`\`bash
python -m http.server 8000
\`\`\`

Then open \`http://localhost:8000\`.

## Deployment

The site is intended for GitHub Pages and the custom domain \`prdxq.de\`. Keep the repository's existing custom-domain configuration and image assets in place. Changes on the redesign branch do not update the live site until merged into the configured publishing branch.

## Notes

- The project preview cards are illustrative mockups, not screenshots of verified production deployments.
- The contact form uses a \`mailto:\` flow. It does not store or send data to a server; the visitor must send the prepared email in their own mail app.
- Lab interactions are client-side demonstrations. They do not deploy software or connect to external systems.
- No unverified client counts, testimonials, performance metrics or business outcomes are included.
- The design respects \`prefers-reduced-motion\`, includes keyboard focus states and uses responsive layouts.
- Review all legal pages and business disclosures for the actual business before public launch.
