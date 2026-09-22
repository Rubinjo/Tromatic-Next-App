# Publication readiness

## Sanitized repository history

The existing repository is retained. The history cleanup removes generated bundles, source maps, build caches, local deployment aliases, and machine sample exports from all local refs. Historical Firebase configuration and Expo deployment identifiers are replaced with placeholders. Personal author/committer emails are replaced with privacy addresses; author names, timestamps, messages, commit order, and merges are preserved. Commit IDs necessarily change.

A verified recovery bundle and a working-tree backup were created outside the repository before rewriting. They contain the original private history and must never be published. No backup branch or tag is retained inside this repository.

The scan covered both branches advertised by GitHub at the time of review, plus local refs. Gitleaks 8.30.1 reported six pre-cleanup findings in legacy Firebase configuration and generated Next.js output. A separate blob review covered deployment identifiers, private paths, personal email metadata, and machine sample files.

## Before making this same GitHub repository public

The local rewrite does not automatically replace GitHub's copy. Both remote branches must be updated to their sanitized equivalents using explicit force-with-lease expectations. Do not merge the old remote history back in. Collaborators should make a fresh clone afterward.

GitHub pull-request refs, cached commit views, forks, release assets, Actions artifacts, and other clones can retain old content. Review those separately; contact GitHub Support if sensitive cached commits require removal. Repository visibility has not been changed. Any credential owner should review historical exposure and rotate/restrict affected credentials as appropriate.

The retained product branding, public store identifiers, public business contact, and author names are intentional. Publishing source still requires the relevant source/branding rights. No new license is assigned by this cleanup.

## Local verification

Run `node scripts/audit-publication.cjs --history` for a dependency-free heuristic scan. It prints categories and locations, never matched values. The heuristic scan reports eight reviewed matches: the public business contact in current/historical documents, the placeholder integration email, redacted Firebase configuration placeholders, and old README password placeholders. Use a dedicated scanner such as `gitleaks git . --log-opts="--all" --redact` as well. Neither scanner establishes the absence of every possible confidential fact.

Verification completed on 2026-09-22: all 438 pre-rewrite commits were retained, with identical parent relationships after ID mapping, messages, names, and timestamps. All 1,099 reachable blobs were checked for the original deployment values and prohibited historical paths. Gitleaks 8.30.1 reported zero findings across rewritten refs. Git integrity checks passed, old reflogs were expired, and unreachable old objects were pruned after backup verification. A subsequent documentation commit records these results.

## Firebase rules

Realtime Database and Firestore rules are included and referenced by `Functions/firebase.json`. Read [the rule review](FIREBASE_RULES.md) for confirmed vulnerabilities in the supplied rules, the hardened policy, and required integration changes. No deployment or automated authorization tests were performed. Server callables require a separate authorization review because Admin SDK access bypasses database rules.
