# Mobile application

React Native / Expo client with live chamber readings, history charts, supported controls, and English, Dutch, and German localization.

1. Use a Node.js / Expo toolchain compatible with the committed Expo SDK 51 dependencies.
2. Run `npm ci` in `App`.
3. Copy `.env.example` to `.env` and provide your own Firebase client configuration.
4. Run `npm start` and use a compatible simulator or development build. A current Expo Go release may not support this older SDK.

Account provisioning and backend rules are separate prerequisites. There is no public demo login. For your own store build, configure your own application identifiers, native service configuration, Expo owner, EAS project, and update URL. Optional Expo settings are omitted when unset. `STORAGEBUCKET` is the supported environment variable name.

See the [root README](../README.md) for architecture and store links.
