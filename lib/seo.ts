// Solid State — structured data (JSON-LD) builders.
//
// One module owns every schema.org object the site emits. Pages call a
// builder, render it through <JsonLd />, done. No inline schema anywhere
// else — keeps the shapes consistent and greppable.
//
// Why this exists: AI engines (ChatGPT, Perplexity, Claude) and Google both
// read JSON-LD to understand entities. We had none. Low-DR sites win AI
// citations on structure, not authority.

import type { Skill } from "./types"
import { LICENSE_LABEL } from "./types"

export const SITE_URL = "https://solidstate.cc"
export const SITE_NAME = "Solid State"

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`

/** Organization — referenced by everything else via @id. */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/Solid_State_mark.png`,
      width: 400,
      height: 400,
    },
    sameAs: ["https://github.com/solidstatecc"],
    description:
      "AI agent skills marketplace. A skill is packaged judgment. Sourced, licensed, no fake installs.",
  }
}

/** WebSite — ties pages to the publisher entity. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    description:
      "Browse, install, and publish skills for any agent runtime — Claude Code, Hermes Agent, OpenClaw, NemoClaw, Antigravity.",
  }
}

/** BreadcrumbList from [label, path] pairs. Last item carries no URL. */
export function breadcrumbsJsonLd(items: Array<[string, string?]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      ...(path ? { item: `${SITE_URL}${path}` } : {}),
    })),
  }
}

/** Skill detail page → SoftwareApplication. Offers only when price is known. */
export function skillJsonLd(skill: Skill) {
  const isFree = skill.price === 0 || skill.price === "free"
  const isPaid = typeof skill.price === "number" && skill.price > 0
  const offers =
    isFree || isPaid
      ? {
          offers: {
            "@type": "Offer",
            price: isFree ? 0 : (skill.price as number),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/skills/${skill.slug}`,
          },
        }
      : {}

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.description,
    url: `${SITE_URL}/skills/${skill.slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    softwareVersion: skill.version,
    datePublished: skill.createdAt,
    author: { "@type": "Organization", name: skill.author },
    publisher: { "@id": ORG_ID },
    license: LICENSE_LABEL[skill.license],
    keywords: skill.tags.join(", "),
    ...(skill.repoUrl ? { sameAs: skill.repoUrl } : {}),
    ...offers,
  }
}

/** Glossary term → DefinedTerm inside the site's DefinedTermSet. */
export function termJsonLd(term: { slug: string; term: string; short: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.short,
    url: `${SITE_URL}/glossary/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Solid State Glossary — agent skills, explained",
      url: `${SITE_URL}/glossary`,
    },
  }
}

/** Paid SKU page → Product with a one-time Offer. */
export function productJsonLd(p: {
  name: string
  description: string
  path: string
  price: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    url: `${SITE_URL}${p.path}`,
    image: `${SITE_URL}/Solid_State_mark.png`,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${p.path}`,
      seller: { "@id": ORG_ID },
    },
  }
}

/** Source pack page → ItemList of its skill pages. */
export function skillListJsonLd(name: string, path: string, items: Skill[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/skills/${s.slug}`,
    })),
  }
}
