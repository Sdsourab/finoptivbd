import Link from "next/link";

export const metadata = {
  title: "System Design",
  description:
    "How Finoptiv is built: Next.js, FastAPI, Supabase, security, caching, and deployment architecture.",
};

const services = [
  {
    step: "01",
    title: "Visitor",
    detail: "A browser requests a public portfolio page or sends an authenticated admin action.",
  },
  {
    step: "02",
    title: "Vercel",
    detail: "One Vercel project exposes two services. Path rewrites send /api/backend/* to FastAPI and all other routes to Next.js.",
  },
  {
    step: "03",
    title: "Application",
    detail: "Next.js renders pages with 60-second ISR. FastAPI validates API requests and applies server-side authorization.",
  },
  {
    step: "04",
    title: "Supabase",
    detail: "Postgres stores content, Auth manages the owner session, and Storage holds public article images plus private datasets.",
  },
];

const security = [
  ["Owner identity", "Supabase Auth issues the signed-in user's access token. Public sign-up is disabled."],
  ["API authorization", "FastAPI verifies the JWT and checks that the user ID exists in public.admins before allowing admin operations."],
  ["Database access", "Postgres Row Level Security protects publishable-key requests, including Storage uploads. A SECURITY DEFINER helper safely checks admin membership without exposing the admins table."],
  ["Server secrets", "SUPABASE_SECRET_KEY is used only by the backend. The browser receives only the publishable key."],
  ["Image storage", "Article images are publicly readable, but upload and management are limited to authenticated Finoptiv admins."],
];

export default function SystemDesignPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-accent">Architecture / 001</p>
        <h1 className="mt-4 font-display text-display-2 font-semibold">How Finoptiv works</h1>
        <p className="mt-5 text-body leading-relaxed text-text-secondary">
          Finoptiv is a small, stateless application built to publish analytical work safely and quickly. Its frontend,
          API, database, authentication, and file storage have clear responsibilities rather than sharing credentials
          or trusting the browser with privileged access.
        </p>
      </div>

      <section className="mt-12" aria-labelledby="request-path">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">01 / Request path</p>
            <h2 id="request-path" className="mt-2 font-display text-display-3 font-semibold">One project. Two services.</h2>
          </div>
          <Link href="/api/backend/docs" target="_blank" className="text-small text-lime-accent hover:underline">
            Explore API docs ↗
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((item) => (
            <article key={item.step} className="rounded-lg border border-white/10 bg-bg-card p-5">
              <p className="font-mono text-xs text-lime-accent">{item.step}</p>
              <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-small leading-relaxed text-text-secondary">{item.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 rounded-lg border border-white/10 px-5 py-4 font-mono text-xs leading-relaxed text-text-muted">
          Browser → Vercel Edge/CDN → Next.js frontend / FastAPI backend → Supabase Postgres + Auth + Storage
        </p>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">02 / Public read</p>
          <h2 className="mt-2 font-display text-display-3 font-semibold">Reading a case study</h2>
          <ol className="mt-5 space-y-4">
            {[
              "A visitor opens /work/{slug}.",
              "Next.js serves the cached page when available. Public pages revalidate after 60 seconds.",
              "On a cache miss, the server calls the FastAPI public read endpoint; it never sends the service secret to the browser.",
              "FastAPI selects published content from Supabase and returns typed JSON. The rendered page is cached for the next visitor.",
            ].map((item, index) => (
              <li key={item} className="flex gap-3 text-small leading-relaxed text-text-secondary">
                <span className="font-mono text-lime-accent">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">03 / Admin write</p>
          <h2 className="mt-2 font-display text-display-3 font-semibold">Publishing an edit</h2>
          <ol className="mt-5 space-y-4">
            {[
              "The owner signs in through Supabase Auth; the browser receives a short-lived access token.",
              "The admin interface sends the token as a Bearer credential to /api/backend/admin/*.",
              "FastAPI verifies the token and confirms that its user ID is present in public.admins.",
              "Pydantic validates the payload. The backend uses a privileged server key, so its own JWT and admin-membership checks are the authorization gate for these API writes.",
            ].map((item, index) => (
              <li key={item} className="flex gap-3 text-small leading-relaxed text-text-secondary">
                <span className="font-mono text-lime-accent">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="security-model">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">04 / Security boundaries</p>
        <h2 id="security-model" className="mt-2 font-display text-display-3 font-semibold">Security model</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          {security.map(([name, detail]) => (
            <div key={name} className="grid gap-2 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[180px_1fr] md:gap-6">
              <h3 className="text-small font-semibold text-text-primary">{name}</h3>
              <p className="text-small leading-relaxed text-text-secondary">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-white/10 bg-bg-card p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">05 / Performance</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Cache the common path</h2>
          <p className="mt-3 text-small leading-relaxed text-text-secondary">
            Public content uses Next.js Incremental Static Regeneration with a 60-second revalidation window. API responses
            also carry short cache headers. Fonts are bundled with next/font and the retro illustration components are
            loaded only by the pages that use them.
          </p>
        </article>
        <article className="rounded-lg border border-white/10 bg-bg-card p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">06 / Reliability</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Stateless deployment</h2>
          <p className="mt-3 text-small leading-relaxed text-text-secondary">
            The Next.js and FastAPI services are deployed together from one repository. A database-backed health endpoint
            checks Supabase connectivity. A scheduled GitHub Action can ping it to reduce inactivity risk on the Supabase
            Free plan, though it cannot guarantee that a project will never pause.
          </p>
        </article>
      </section>

      <div className="mt-14 flex flex-wrap gap-4 border-t border-white/10 pt-7">
        <Link href="/work" className="text-small text-lime-accent hover:underline">View case studies →</Link>
        <Link href="/writing" className="text-small text-lime-accent hover:underline">Read writing →</Link>
        <Link href="/api/backend/docs" target="_blank" className="text-small text-lime-accent hover:underline">Open FastAPI docs →</Link>
      </div>
    </div>
  );
}
