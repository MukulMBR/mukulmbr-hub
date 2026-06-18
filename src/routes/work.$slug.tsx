import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { caseStudies, getCaseStudy, type CaseStudy } from "../lib/case-studies";

const SITE_URL = "https://mukulmbr.lovable.app";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }): { study: CaseStudy } => {
    const study = getCaseStudy(params.slug);
    if (!study) throw notFound();
    return { study };
  },
  head: ({ params, loaderData }) => {
    const study = loaderData?.study;
    const url = `${SITE_URL}/work/${params.slug}`;
    if (!study) {
      return {
        meta: [
          { title: "Case study not found — Mukul" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const title = `${study.name} — Engineering Case Study | Mukul`;
    const description = study.summary;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            url,
            author: { "@type": "Person", name: "Mukul Bushi Reddy M" },
            keywords: study.stack.join(", "),
            about: study.tag,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Case study not found</h1>
        <Link to="/work" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← All case studies
        </Link>
      </div>
    </main>
  ),
  component: CaseStudyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-6">{children}</div>
    </section>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function CaseStudyPage() {
  const { study } = Route.useLoaderData();
  const others = caseStudies.filter((c) => c.slug !== study.slug);

  return (
    <main className="min-h-screen bg-background px-6 py-24 md:py-32">
      <article className="mx-auto max-w-3xl">
        <Link
          to="/work"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All case studies
        </Link>

        <header className="mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {study.tag} · {study.year}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            {study.name}
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            {study.summary}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm md:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Role</dt>
              <dd className="mt-1 font-medium">{study.role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Year</dt>
              <dd className="mt-1 font-medium">{study.year}</dd>
            </div>
            <div className="col-span-2 md:col-span-1">
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Stack</dt>
              <dd className="mt-1 font-medium">{study.stack.join(" · ")}</dd>
            </div>
          </dl>
        </header>

        <Section title="Problem">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {study.problem}
          </p>
        </Section>

        <Section title="Architecture">
          {study.architecture.map((b) => (
            <Block key={b.title} {...b} />
          ))}
        </Section>

        <Section title="Key decisions">
          {study.decisions.map((b) => (
            <Block key={b.title} {...b} />
          ))}
        </Section>

        <Section title="Performance bottlenecks">
          {study.bottlenecks.map((b) => (
            <Block key={b.title} {...b} />
          ))}
        </Section>

        {study.ai && study.ai.length > 0 && (
          <Section title="AI integration">
            {study.ai.map((b) => (
              <Block key={b.title} {...b} />
            ))}
          </Section>
        )}

        <Section title="Impact">
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            {study.impact.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Section>

        {others.length > 0 && (
          <section className="mt-20 border-t border-border pt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              More case studies
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  to="/work/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {c.tag}
                  </p>
                  <p className="mt-1 font-medium">{c.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
