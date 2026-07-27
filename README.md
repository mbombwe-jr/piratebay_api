# piratebay_api

A small TypeScript API that provides a simple, read-only interface to query The Pirate Bay's publicly available pages and return torrent metadata in JSON.

## Project intention

This project is intended to offer a lightweight programmatic way to search The Pirate Bay and retrieve basic torrent metadata (title, magnet link, size, seeders, leechers, uploader, and page URL) for research, archival, or personal-use tooling.

Important: this project does so by scraping publicly accessible pages. It is intended for lawful, ethical, and educational use only. The maintainers do not condone or support copyright infringement or facilitating illegal downloads. Use at your own risk and respect site terms of service and local law.

## Features

- Search torrents by query, category and page.
- Return results as structured JSON suitable for scripts and small applications.
- TypeScript-first codebase for type-safety and clarity.

## Quick start

Requirements:
- Node.js (16+ recommended)
- npm or yarn

Install:

```bash
npm install
# or
# yarn install
```

Run development server:

```bash
npm run dev
```

Example request (replace host/port if configured differently):

```bash
curl "http://localhost:3000/search?q=ubuntu"
```

## API (example)

- GET /search?q=<query>&category=<category>&page=<number>
  - Returns a JSON array of matching torrent metadata.
- GET /torrent/:id
  - Returns detailed metadata for a single torrent entry, including magnet link.

Adjust endpoints to match the implementation in the codebase.

## Contributing

Contributions welcome — please open issues for bugs or feature requests and send pull requests for changes. When contributing, include tests and type-safe changes where possible.

## Disclaimer

This software is provided "as-is". The author is not responsible for how it is used. Always ensure your usage complies with laws and the terms of service of target websites.

## License

Add your license here (for example: MIT).
