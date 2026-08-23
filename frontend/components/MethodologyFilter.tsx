"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface FilterOption {
  slug: string;
  name: string;
}

interface MethodologyFilterProps {
  options: FilterOption[];
  paramName: "methodology" | "category";
  label: string;
}

export function MethodologyFilter({ options, paramName, label }: MethodologyFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(paramName);

  function hrefFor(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set(paramName, slug);
    } else {
      params.delete(paramName);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  if (!options.length) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      <Link
        href={hrefFor(null)}
        className={`rounded-full border px-4 py-1.5 text-small transition-colors ${
          !active
            ? "border-lime-accent bg-lime-accent/10 text-lime-accent"
            : "border-white/10 text-text-secondary hover:text-text-primary"
        }`}
      >
        All
      </Link>
      {options.map((o) => (
        <Link
          key={o.slug}
          href={hrefFor(o.slug)}
          className={`rounded-full border px-4 py-1.5 text-small transition-colors ${
            active === o.slug
              ? "border-lime-accent bg-lime-accent/10 text-lime-accent"
              : "border-white/10 text-text-secondary hover:text-text-primary"
          }`}
        >
          {o.name}
        </Link>
      ))}
    </div>
  );
}
