import { createFileRoute, Link } from "@tanstack/react-router";
import { caseStudies } from "../lib/case-studies";

const SITE_URL = "https://mukulmbr.lovable.app";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Engineering Case Studies — Mukul" },
      {
        name: "description",
        content:
          "Technical case studies from Mukul's engineering portfolio — architecture decisions, performance bottlenecks, and AI integration logic behind featured products.",
      },
      { property: "og:title", content: "Engineering Case Studies — Mukul" },
      {
        property: "og:description",
        content:
          "How and why Mukul engineered featured products — architecture, trade-offs, performance work, and AI integration.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/work` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/work` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Engineering Case Studies",
          url: `${SITE_URL}/work`,
          author: { "@type": "Person", name: "Mukul Bushi Reddy M" },
          hasPart: caseStudies.map((c) => ({
            "@type": "Article",
            headline: `${c.name} — Engineering Case Study`,
            url: `${SITE_URL}/work/${c.slug}`,
          })),
        }),
      },
    ],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  return (
    <main className="min-h-screen bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back home
        </Link>
        <header className="mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Engineering Portfolio
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Case Studies
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            How and why these products were built — architecture decisions,
            performance bottlenecks, and AI integration logic. Less "what was
            shipped", more "how it was engineered".
          </p>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {caseStudies.map((c) => (
            <Link
              key={c.slug}
              to="/work/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                aria-hidden="true"
              />
              <div className="relative">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {c.tag}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {c.name}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {c.summary}
                </p>
                <p className="mt-6 text-xs font-medium text-foreground/70 group-hover:text-foreground">
                  Read case study →
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
