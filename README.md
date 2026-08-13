# DeepSeek Harness for macOS

An unofficial Electron distribution of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
for Apple Silicon Macs. The app bundles the published `@deepseek-ai/dsh` npm package, starts its Web UI
on a private random localhost port, and opens it in a native desktop window. Users do not need to install
Node.js.

ASAR packaging is intentionally disabled because DSH's user profiles resolve plugins through symlinks
to the bundled dependency tree; Node's ESM loader cannot follow those links into an ASAR archive.
The macOS app icon is generated from the upstream DeepSeek Harness favicon pinned to the source revision
used when this wrapper was created.

## Requirements

- Apple Silicon Mac (`arm64`)
- macOS 11 or newer
- Node.js 22.19+ and npm (build only)

## Develop

```sh
npm install
npm start
```

The application's persistent data is stored below the standard macOS Application Support directory,
inside `DeepSeek Harness/dsh`.

## Build the DMG

```sh
npm ci
npm test
npm run dist:mac
```

The artifact is written to `dist/DeepSeek-Harness-<version>-mac-arm64.dmg`.

The default local build is unsigned. On first launch, right-click the app and choose **Open**. For public
distribution, configure an Apple Developer ID certificate and notarization credentials; electron-builder
will discover the signing identity from the keychain.

## Release

Push a version tag such as `v0.1.0`. The GitHub Actions workflow builds on an Apple Silicon runner and
attaches the DMG and checksum to a GitHub Release. Keep `@deepseek-ai/dsh` pinned in `package.json` so
desktop releases remain reproducible.

This project is not an official DeepSeek AI product. DeepSeek Harness is currently a developer preview.
