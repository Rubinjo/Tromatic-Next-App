# Contributing

For portfolio review, start with the root README and architecture walkthrough. Each component has its own lockfile and setup instructions.

Keep changes focused, use synthetic data, and document the component and behavior affected. Never include customer exports, credentials, generated bundles, source maps, or local deployment configuration. Run the relevant lint/build checks when configured, and state which checks you could not run.

Run `node scripts/audit-publication.cjs` before sharing changes. This heuristic scanner reports categories and locations without printing matching values; findings need human review. It is not a substitute for a dedicated secret scanner or backend security review.
