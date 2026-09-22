# Architecture walkthrough

Tromatic NEXT connects a file-based installation interface with mobile and web clients. The boundaries are visible in four independently installed packages.

## Telemetry and control

```mermaid
sequenceDiagram
    participant Machine as Installation files
    participant Sender as Windows sender
    participant DB as Realtime Database
    participant App as Mobile app
    participant Receiver as Windows receiver
    Machine->>Sender: JSON file changes
    Sender->>Sender: Wait for stable size; compare checksum
    Sender->>DB: Update chamber measurements
    DB-->>App: Live subscription update
    App->>DB: Supported user adjustment
    DB-->>Receiver: Machine state changes
    Receiver->>Receiver: Compare values; filter supported fields
    Receiver->>Machine: Write command JSON
```

The sender delays reading until file size stabilizes and uses an MD5 checksum to suppress repeated file events. This checksum detects repeated content; it is not a cryptographic authentication mechanism. The receiver filters changed fields and writes CRLF-formatted JSON for the local integration. The gatherer parses drying-program files and writes program headers and phases to Firestore in batches.

## Live state and history

Realtime Database supplies current machine state. A scheduled Cloud Function copies measurements into Firestore history, which the mobile graph screen consumes. This separates a changing operational view from historical readings. Status-change handlers translate alarm bits into localized messages for push notifications.

## Customer workflows

Firebase Auth provides identity. The web portal includes company, machine, and user screens; Cloud Functions implement invitations, verification, password flows, and role-related operations. Email links use `PORTAL_BASE_URL`, and SMTP settings come from the backend environment. English, Dutch, and German dictionaries support both interfaces and notification content.

## Boundaries worth reviewing

- Client visibility and role controls are user-interface behavior. Isolation between customers must be enforced by database rules and server authorization; hardened rules are included in `Functions`; see [the rule review](FIREBASE_RULES.md).
- The Windows bridge requires an authenticated integration account and local machine files. It is not a general-purpose public API or simulator.
- File watcher behavior, authorization, token expiry, retries, and concurrency deserve dedicated tests before adapting this implementation to a new installation.
- The repository is an engineering portfolio, not an audited industrial control distribution. Publishing source does not provision any services.
