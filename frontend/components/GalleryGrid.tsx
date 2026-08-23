"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
            className="group relative block w-full overflow-hidden rounded-lg border border-white/8 bg-bg-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.caption || ""}
              loading="lazy"
              className="block h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-main/90 to-transparent p-3 text-left text-caption text-text-secondary">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || "Gallery image"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-bg-card text-text-primary"
          >
            <X size={20} aria-hidden />
          </button>
          <div className="max-h-[85vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.image_url} alt={active.caption || ""} className="max-h-[75vh] w-auto rounded-lg" />
            <div className="mt-3 flex items-center justify-between gap-4">
              {active.caption && <p className="text-small text-text-secondary">{active.caption}</p>}
              {active.related_article_slug && (
                <Link
                  href={`/work/${active.related_article_slug}`}
                  className="shrink-0 text-small text-lime-accent hover:underline"
                >
                  View case study →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}