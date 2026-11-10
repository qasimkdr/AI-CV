import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { ROUTES, SITE, absoluteUrl } from "@/seo/site";

const upsertMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Keeps <head> in sync with the current route. Updates the tags that the
 * build step already wrote into the static HTML instead of appending
 * duplicates, so crawlers see exactly one of each.
 */
export default function Seo({
  title,
  description,
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();
  const preset = ROUTES[pathname] || {};

  const finalTitle =
    title || preset.title || `${SITE.name} — ${SITE.tagline}`;
  const finalDescription =
    description || preset.description || SITE.description;
  const url = absoluteUrl(pathname);

  useEffect(() => {
    document.title = finalTitle;

    upsertMeta("name", "description", finalDescription);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );
    upsertMeta("property", "og:title", finalTitle);
    upsertMeta("property", "og:description", finalDescription);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", finalTitle);
    upsertMeta("name", "twitter:description", finalDescription);
    upsertLink("canonical", url);
  }, [finalTitle, finalDescription, noindex, url]);

  if (!jsonLd) return null;

  const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return blocks.map((block, i) => (
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
    />
  ));
}
