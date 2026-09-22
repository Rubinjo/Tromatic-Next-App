# Publication readiness

## Sanitized repository history

The existing repository is retained. The history cleanup removes generated bundles, source maps, build caches, local deployment aliases, and machine sample exports from all local refs. Historical Firebase configuration and Expo deployment identifiers are replaced with placeholders. Personal author/committer emails are replaced with privacy addresses; author names, timestamps, messages, commit order, and merges are preserved. Commit IDs necessarily change.

A verified recovery bundle and a working-tree backup were created outside the repository before rewriting. They contain the original private history and must never be published. No backup branch or tag is retained inside this repository.

The scan covered both branches advertised by GitHub at the time of review, plus local refs. Gitleaks 8.30.1 reported six pre-cleanup findings in legacy Firebase configuration and generated Next.js output. A separate blob review covered deployment identifiers, private paths, personal email metadata, and machine sample files.

## GitHub synchronization

Both GitHub branches (`main` and `Rick-2022-02-24-packages-update`) were updated atomically on 2026-09-22 using explicit force-with-lease expectations. Remote branch IDs were checked against the sanitized local heads. Repository visibility was not changed. Do not merge old clones back into this history; collaborators should make a fresh clone.

A post-push check found one GitHub-managed pull-request head still referencing 126 original commits with personal author/committer emails. It was not fetched into the sanitized local repository. GitHub marks pull-request refs read-only; normal pushes cannot replace them. Keep the repository private until this remaining exposure is resolved with GitHub Support. A private support-request draft and the original-to-sanitized commit map are retained outside the repository.

GitHub cached commit views, forks, release assets, Actions artifacts, and other clones can also retain old content. Ask Support to review the affected pull-request reference, purge eligible cached views, and perform server-side garbage collection. GitHub decides whether the data qualifies for removal; see [GitHub's removal procedure](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository). Repository visibility has not been changed. Any credential owner should review historical exposure and rotate/restrict affected credentials as appropriate.

The retained product branding, public store identifiers, public business contact, and author names are intentional. Publishing source still requires the relevant source/branding rights. No new license is assigned by this cleanup.

## Local verification

Run `node scripts/audit-publication.cjs --history` for a dependency-free heuristic scan. It prints categories and locations, never matched values. The heuristic scan reports eight reviewed matches: the public business contact in current/historical documents, the placeholder integration email, redacted Firebase configuration placeholders, and old README password placeholders. Use a dedicated scanner such as `gitleaks git . --log-opts="--all" --redact` as well. Neither scanner establishes the absence of every possible confidential fact.

Verification completed on 2026-09-22: all 438 pre-rewrite commits were retained, with identical parent relationships after ID mapping, messages, names, and timestamps. All 1,099 reachable blobs were checked for the original deployment values and prohibited historical paths. Gitleaks 8.30.1 reported zero findings across rewritten refs. Git integrity checks passed, old reflogs were expired, and unreachable old objects were pruned after backup verification. A subsequent documentation commit records these results.

## Firebase rules

Realtime Database and Firestore rules are included and referenced by `Functions/firebase.json`. Read [the rule review](FIREBASE_RULES.md) for confirmed vulnerabilities in the supplied rules, the hardened policy, and required integration changes. No deployment or automated authorization tests were performed. Server callables require a separate authorization review because Admin SDK access bypasses database rules.
