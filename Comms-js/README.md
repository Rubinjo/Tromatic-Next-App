# Windows machine integration

Three Node.js services bridge installation files and Firebase:

| Service | Input | Output |
| --- | --- | --- |
| Sender | JSON measurements in `../sender` | Realtime Database machine state |
| Receiver | Supported changes in Realtime Database | Command JSON in `../receiver` |
| Gatherer | Drying programs in `../../dat` | Firestore program headers and phases |

Paths are relative to the process working directory. Inspect the constants and file paths before running. Use development folders and synthetic data; the repository contains no installation exports.

1. On Windows, run `npm ci` in `Comms-js`.
2. Copy `.env.example` to `.env` and configure a dedicated development integration account and company identifier.
3. Prepare the expected folders and your own development Firebase rules/data.
4. Run `node sender.js`, `node receiver.js`, or `node gatherer.js` from this directory to inspect the relevant service.

`node startup.js` installs and starts all three Windows services. Use it only when intentionally setting up a persistent integration, with a verified working directory and permissions. It is not part of the portfolio review setup.

The checksum is for duplicate-event detection; access control is the responsibility of the backend and account configuration.
