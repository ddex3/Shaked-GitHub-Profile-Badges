# GitHub Profile Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)

A lightweight HTTP service that generates dynamic SVG badges displaying real-time GitHub profile statistics. Embed them in your README, website, or anywhere that renders images.

## Features

- **8 badge types** - Profile views, followers, following, repos, gists, stars, account created, and last updated
- **3 visual styles** - `flat`, `flat-square`, and `rounded`
- **Fully customizable** - Colors, labels, prefixes, and suffixes
- **Built-in caching** - GitHub stats cached for 5 minutes to stay within API limits
- **Rate limiting** - 100 requests per 15 minutes per IP
- **Profile view counter** - Persistent view tracking with IP-based cooldown to prevent duplicates
- **Zero external services** - Embedded SQLite database (sql.js), no Redis or external DB needed

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher

### Installation

```bash
git clone https://github.com/ddex3/Shaked-GitHub-Profile-Badges.git
cd Shaked-GitHub-Profile-Badges
npm install
```

### Run in Development

```bash
npm run dev
```

### Build and Run for Production

```bash
npm run build
npm start
```

The server starts on **port 3000**.

## Usage

### Endpoint

```
GET /badge/:type?username=<github_username>
```

### Badge Types

| Type | Description | Example |
|------|-------------|---------|
| `profile-views` | Total profile views | `/badge/profile-views?username=ddex3` |
| `followers` | Follower count | `/badge/followers?username=ddex3` |
| `following` | Following count | `/badge/following?username=ddex3` |
| `repos` | Public repositories | `/badge/repos?username=ddex3` |
| `gists` | Public gists | `/badge/gists?username=ddex3` |
| `stars` | Total stars across all repos | `/badge/stars?username=ddex3` |
| `created` | Account creation date | `/badge/created?username=ddex3` |
| `updated` | Last profile update | `/badge/updated?username=ddex3` |

### Customization Options

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `style` | Badge style | `flat` | `flat`, `flat-square`, `rounded` |
| `color` | Right section color | `#4c1` | `blue`, `#ff6600` |
| `labelColor` | Left section color | `#555` | `#333`, `grey` |
| `label` | Custom label text | (varies by type) | `My+Repos` |
| `prefix` | Text before value | (none) | `~`, `$` |
| `suffix` | Text after value | (none) | `k`, `+` |

### Embedding in Markdown

**Basic badges:**

```markdown
![Followers](https://your-server.com/badge/followers?username=ddex3)
![Repos](https://your-server.com/badge/repos?username=ddex3)
![Stars](https://your-server.com/badge/stars?username=ddex3)
```

**Custom colors:**

```markdown
![Followers](https://your-server.com/badge/followers?username=ddex3&color=blue)
![Stars](https://your-server.com/badge/stars?username=ddex3&color=ff6600)
![Repos](https://your-server.com/badge/repos?username=ddex3&color=red)
![Gists](https://your-server.com/badge/gists?username=ddex3&color=purple&labelColor=333)
![Views](https://your-server.com/badge/profile-views?username=ddex3&color=green&labelColor=222)
```

**Different styles:**

```markdown
<!-- Flat (default) -->
![Followers](https://your-server.com/badge/followers?username=ddex3&style=flat&color=blue)

<!-- Flat Square -->
![Followers](https://your-server.com/badge/followers?username=ddex3&style=flat-square&color=blue)

<!-- Rounded -->
![Followers](https://your-server.com/badge/followers?username=ddex3&style=rounded&color=blue)
```

**Custom labels, prefixes, and suffixes:**

```markdown
![Repos](https://your-server.com/badge/repos?username=ddex3&label=Public+Repos&suffix=+total&color=green)
![Stars](https://your-server.com/badge/stars?username=ddex3&label=Total+Stars&prefix=%E2%AD%90+&color=ff6600)
![Followers](https://your-server.com/badge/followers?username=ddex3&label=GitHub+Fans&suffix=+people&color=purple)
![Views](https://your-server.com/badge/profile-views?username=ddex3&label=Profile+Views&color=blue&style=rounded)
![Created](https://your-server.com/badge/created?username=ddex3&label=Member+Since&color=grey&style=flat-square)
```

**Full showcase (all badge types for one user):**

```markdown
![Views](https://your-server.com/badge/profile-views?username=ddex3&color=blue&style=rounded)
![Followers](https://your-server.com/badge/followers?username=ddex3&color=green)
![Following](https://your-server.com/badge/following?username=ddex3&color=yellow)
![Repos](https://your-server.com/badge/repos?username=ddex3&color=red)
![Gists](https://your-server.com/badge/gists?username=ddex3&color=purple)
![Stars](https://your-server.com/badge/stars?username=ddex3&color=ff6600&style=flat-square)
![Created](https://your-server.com/badge/created?username=ddex3&color=grey)
![Updated](https://your-server.com/badge/updated?username=ddex3&color=pink)
```

## Project Structure

```
src/
├── server/          # Express server setup and rate limiting
├── routes/          # Badge endpoint routing
├── badges/          # Badge handler and type-specific resolvers
├── providers/       # GitHub API client
├── cache/           # In-memory cache layer
├── storage/         # SQLite database, schema, and repositories
├── svg/             # SVG badge generation engine
└── utils/           # Parameter parsing, hashing, and cooldown logic
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled production server |
| `npm run clean` | Remove build artifacts |

## How It Works

1. A request hits `/badge/:type` with a GitHub username
2. The server checks the in-memory cache for a recent result
3. On cache miss, it fetches data from the GitHub API (or increments the view counter for `profile-views`)
4. An SVG badge is dynamically generated with the resolved value and styling options
5. The response is cached for 5 minutes and returned as `image/svg+xml`

Large numbers are automatically formatted (e.g., 1,200 becomes "1.2k", 2,500,000 becomes "2.5M").

## Getting Help

- **Issues**: [Open an issue](https://github.com/ddex3/Shaked-GitHub-Profile-Badges/issues) for bugs or feature requests

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by **[@ddex3](https://github.com/ddex3)**
