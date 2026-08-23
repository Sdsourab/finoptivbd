import Link from "next/link";
import { HireMeButton } from "@/components/HireMeButton";
import { getServices } from "@/lib/api";

export const revalidate = 60;
export const metadata = { title: "Services" };

// Phase 3. Prices are never invented — a service without a
// starting_price_usd shows "Contact for pricing" instead of a fabricated number.
export default async function ServicesPage() {
  const services = await getServices().catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="font-display text-display-2 font-semibold">Services</h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        Consulting and one-off project work, grounded in the methods shown in{" "}
        <Link href="/work" className="text-lime-accent hover:underline">
          Work
        </Link>
        .
      </p>

      {services.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className="flex flex-col rounded-lg border border-white/8 bg-bg-card p-6">
              <h2 className="font-display text-display-4 font-medium text-text-primary">{s.name}</h2>
              <p className="mt-2 flex-1 text-small text-text-secondary">{s.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-small text-lime-accent">
                  {s.starting_price_usd != null ? `From $${s.starting_price_usd}` : "Contact for pricing"}
                </span>
                {s.related_case_study_slug && (
                  <Link href={`/work/${s.related_case_study_slug}`} className="text-caption text-text-muted hover:text-text-primary">
                    See the case study →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-body text-text-muted">
          Nothing formally listed yet — reach out directly and we can scope it together.
        </p>
      )}

      <div className="mt-14">
        <HireMeButton pageTitle="Services" />
      </div>
    </div>
  );
}
