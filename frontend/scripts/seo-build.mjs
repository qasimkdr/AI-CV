// Post-build SEO step (runs after `vite build`):
//  • writes dist/<route>/index.html with route-specific <title>, meta,
//    canonical and Open Graph tags so crawlers & link previews get the
//    right data without executing JavaScript
//  • injects JSON-LD structured data on the home page
//  • writes 404.html (noindex), sitemap.xml and robots.txt
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ROUTES,
  SITE,
  appJsonLd,
  faqJsonLd,
  organizationJsonLd,
} from "../src/seo/site.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const siteUrl = (process.env.VITE_SITE_URL || SITE.url).replace(/\/$/, "");
const abs = (p) => `${siteUrl}${p === "/" ? "/" : p}`;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const template = readFileSync(resolve(dist, "index.html"), "utf8");

const headFor = ({ title, description, url, robots = "index, follow, max-image-preview:large" }) => `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${url ? `<link rel="canonical" href="${esc(url)}" />` : ""}
    <meta name="robots" content="${robots}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    ${url ? `<meta property="og:url" content="${esc(url)}" />` : ""}
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    `;

const render = (head, jsonld = "") =>
  template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, head)
    .replace("<!--jsonld-->", jsonld)
    .replaceAll("https://aicvfrontend.netlify.app", siteUrl);

const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

for (const [path, meta] of Object.entries(ROUTES)) {
  const html = render(
    headFor({ ...meta, url: abs(path) }),
    path === "/" ? [organizationJsonLd(), appJsonLd(), faqJsonLd()].map(ld).join("\n    ") : ""
  );
  const out = path === "/" ? resolve(dist, "index.html") : resolve(dist, `.${path}`, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`  seo  ${path}`);
}

writeFileSync(
  resolve(dist, "404.html"),
  render(
    headFor({
      title: "Page not found — AI CV",
      description: "This page doesn't exist. Head back to AI CV to build your resume.",
      robots: "noindex, follow",
    })
  )
);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.entries(ROUTES)
  .map(
    ([p, m]) => `  <url>
    <loc>${abs(p)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${m.changefreq}</changefreq>
    <priority>${m.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`
);

writeFileSync(
  resolve(dist, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /create-resume
Disallow: /edit-resume/
Disallow: /resume-preview/
Disallow: /profile

Sitemap: ${siteUrl}/sitemap.xml
`
);

console.log(`  seo  404.html, sitemap.xml, robots.txt → ${siteUrl}`);
