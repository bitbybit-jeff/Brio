# Brio Budget

Brio Budget is a personal finance dashboard for tracking income, expenses,
savings, and custom financial goals. App data is stored locally using
`localStorage`.

## Development

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

## Production checks

```sh
npm run lint
npm run build
```

The production bundle is generated in `dist/`. Run `npm run preview` to serve
that bundle locally.

## Windows desktop app

Run the app in an Electron window during development:

```sh
npm run desktop:dev
```

Build a Windows installer:

```sh
npm run desktop:build
```

The x64 and ARM64 installers are written to `release/`. The packaged app keeps
its data in Electron's local app storage. It does not automatically share data
with the browser version.
