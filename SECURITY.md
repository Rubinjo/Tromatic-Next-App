# Security

Do not submit credentials, customer identifiers, installation data, or exploit details in public issues. Use GitHub private vulnerability reporting if enabled, or contact the repository owner privately through their profile.

Hardened database security rules are included; see [the rule review](docs/FIREBASE_RULES.md) for policy and compatibility changes. A complete deployment configuration is not included. UI roles alone do not enforce authorization. Review server-side permissions, company isolation, token handling, dependencies, and machine integration before using a new deployment.

Keep server credentials in private environment configuration. Firebase client settings and `NEXT_PUBLIC_*` values are visible to clients and must never be used as an authorization boundary.

Before publication, follow [the publication notes](docs/PUBLICATION.md), including the history review. Ignore rules do not remove files from existing commits.
