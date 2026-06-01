---
title: Deployment
description: Build and host your docs.
icon: rocket
---

# Deployment

`axerity build` writes a plain folder of static files to `build/`. Every page is
prerendered to HTML, and the search index, `.md` URLs, `llms.txt`, sitemap, RSS
feed, and OpenGraph images are all written out. Any static host can serve it, no
server required.

```bash
axerity build   # -> build/
```

Most hosts write `.html` files (`installation.html`) but link to clean URLs
(`/installation`), so the one thing to get right per host is **clean URL**
handling. Each guide below covers it.

## Vercel

Add a `vercel.json` so Vercel serves the static output instead of looking for a
SvelteKit server build:

```json title="vercel.json"
{
	"framework": null,
	"buildCommand": "axerity build",
	"outputDirectory": "build",
	"cleanUrls": true
}
```

Push the repo and Vercel does the rest. If pages still 404, open Project →
Settings and set the Framework Preset to **Other**.

## Cloudflare Pages

In the Pages project settings:

- **Build command:** `npx axerity build`
- **Build output directory:** `build`
- **Framework preset:** None

Cloudflare serves clean URLs automatically.

## Netlify

```toml title="netlify.toml"
[build]
  command = "npx axerity build"
  publish = "build"
```

Netlify serves clean URLs (pretty URLs) by default.

## GitHub Pages

Build, then publish the `build/` folder (for example with a GitHub Action that
runs `npx axerity build` and uploads `build/` as the Pages artifact).

Project sites are served from `https://<user>.github.io/<repo>/`, a sub-path, so
set the base in `axerity.json`:

```json title="axerity.json"
{
	"basePath": "/<repo>"
}
```

User and organization sites (served from the domain root) need no `basePath`.

## Nginx

Serve `build/` and fall back to the `.html` file for clean URLs:

```nginx
server {
	listen 80;
	server_name docs.example.com;
	root /var/www/build;

	location / {
		try_files $uri $uri.html $uri/index.html /404.html;
	}
}
```

## Caddy

```caddy
docs.example.com {
	root * /var/www/build
	try_files {path} {path}.html {path}/index.html
	file_server
}
```

## Any other host

Upload the contents of `build/` and point the host at it. Configure two things if
you can: serve `<name>.html` for `/<name>` (clean URLs), and use `404.html` as
the not-found page.
