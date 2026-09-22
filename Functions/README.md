# Firebase backend

Cloud Functions implement measurement history, alarm notifications, account emails, verification, and user-management operations.

1. Run `npm ci` in `Functions/functions`.
2. Copy `.env.example` to `.env` in that directory and configure a development mail service, optional Expo token, and `PORTAL_BASE_URL`.
3. Configure a separate Firebase development project and its Auth, Realtime Database, Firestore, rules, and initial data.
4. Run `npm run lint` to inspect the existing code against the project lint configuration.

The manifest declares Node.js 18, reflecting the original backend runtime. Check runtime compatibility when setting up a new instance.

The existing `serve` script starts only the Functions emulator; it is not a complete isolated emulator suite. Without explicit emulator configuration, dependent services can still refer to a real project. This snapshot does not include a tested full local backend setup.

`PORTAL_BASE_URL` defaults to `http://localhost:3000`. Set it to your own portal origin for a configured instance.

Realtime Database and Firestore rule paths are configured in `firebase.json`. Account provisioning uses an owner account or the Admin SDK. The history scheduler writes machine-level `CID` metadata used when querying historical readings; existing installations need that metadata populated before history queries can succeed.

See the [Firebase access model](../README.md#firebase-rules) for permissions and integration requirements.
