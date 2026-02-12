# [Austin Summer Camps Map](https://github.com/kayluhb/austin-summer-camps)

An interactive map and filterable directory of summer camps in the Austin, TX area. Data sourced from the [Austin Chronicle](https://www.austinchronicle.com/summer-camps/) and augmented by /r/austin community members.

## Tech Stack

- [React Router v7](https://reactrouter.com/) (SSR)
- [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/) via react-map-gl
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) for deployment
- [Biome](https://biomejs.dev/) for linting and formatting

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/)
- A [Mapbox access token](https://account.mapbox.com/access-tokens/)

### Setup

```bash
pnpm install
cp .dev.vars.example .dev.vars
```

Add your Mapbox token to `.dev.vars`:

```
MAPBOX_TOKEN=pk.your_token_here
```

### Development

```bash
pnpm dev
```

### Linting

```bash
pnpm lint        # check
pnpm lint:fix    # auto-fix
```

## Deployment

### Cloudflare Workers

Set the `MAPBOX_TOKEN` secret in your Cloudflare dashboard or via Wrangler:

```bash
wrangler secret put MAPBOX_TOKEN
```

Then deploy:

```bash
pnpm deploy
```

### Docker

```bash
docker build -t austin-camps-map .
docker run -p 3000:3000 austin-camps-map
```
