# piratebay_api

A small TypeScript API that provides a simple, read-only interface to query The Pirate Bay's publicly available pages and return torrent metadata in JSON.

## Project intention

This project is intended to offer a lightweight programmatic way to search The Pirate Bay and retrieve basic torrent metadata (title, magnet link, size, seeders, leechers, uploader, and page URL) for research, archival, or personal-use tooling.

Important: this project does so by scraping publicly accessible pages. It is intended for lawful, ethical, and educational use only. The maintainers do not condone or support copyright infringement or facilitating illegal downloads. Use at your own risk and respect site terms of service and local law.

## Features

- Search torrents by query, category and page.
- Return results as structured JSON suitable for scripts and small applications.
- TypeScript-first codebase for type-safety and clarity.

## Endpoints

The following endpoints are implemented in src/torrent.controller.ts. Replace host/port with your server configuration (default: http://localhost:3000).

- GET /
  - Health & index endpoint. Returns a description and a summary of available endpoints.

- Search
  - GET /search?q=<term>&page=<number>&sort=<sort_key>&cat=<category>
    - Example: `/search?q=ubuntu&page=0&sort=seeds_desc&cat=300`
    - Alternative path-style: `/search/:term`, `/search/:term/:page`, `/search/:term/:page/:cat`
  - POST /search
    - Body: `{ q: "term", page: 0, sort: "seeds_desc", cat: 300 }`

- Top torrents
  - GET /top?cat=<category>&sort=<sort_key>
    - Example: `/top?cat=0&sort=seeds_desc`
  - GET /top/:cat
  - POST /top
    - Body: `{ cat: 0, sort: "seeds_desc" }`

- Top (last 48 hours)
  - GET /top48h?cat=<category>&sort=<sort_key>
  - GET /top48h/:cat
  - POST /top48h
    - Body: `{ cat: 0, sort: "seeds_desc" }`

- Recent torrents
  - GET /recent?page=<number>&sort=<sort_key>
    - Example: `/recent?page=0&sort=seeds_desc`
  - GET /recent/:page
  - POST /recent
    - Body: `{ page: 0, sort: "seeds_desc" }`

- API passthrough search
  - GET /api-search?q=<query params>
    - This passes the raw query string through to the Pirate Bay `s/` endpoint.
    - Example: `/api-search?q=ubuntu+intitle:server`
  - POST /api-search
    - Body: `{ q: "query params" }`

Notes
- sort: The controller supports a set of sort keys. Common keys used in the code include: `seeds_desc`, `seeds_asc`, `title_asc`, `title_desc`, `time_desc`, `time_asc`, `size_desc`, `size_asc`, `leeches_desc`, `leeches_asc`, `uploader_asc`, `uploader_desc`, `category_asc`, `category_desc`.
- cat: category numbers follow The Pirate Bay category ids. Use `0` for all categories.

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

Example request:

```bash
curl "http://localhost:3000/search?q=ubuntu"
```

## Contributing

Contributions welcome — please open issues for bugs or feature requests and send pull requests for changes. When contributing, include tests and type-safe changes where possible.

## Disclaimer

This software is provided "as-is". The author is not responsible for how it is used. Always ensure your usage complies with laws and the terms of service of target websites.

## License

Add your license here (for example: MIT).
