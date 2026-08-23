import { GalleryGrid } from "@/components/GalleryGrid";
import { getGallery } from "@/lib/api";

export const revalidate = 60;
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const items = await getGallery().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="font-display text-display-2 font-semibold">Gallery</h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        Charts, diagrams, and screenshots from the work — a visual companion to{" "}
        <a href="/work" className="text-lime-accent hover:underline">
          Work
        </a>
        .
      </p>

      {items.length > 0 ? (
        <div className="mt-10">
          <GalleryGrid items={items} />
        </div>
      ) : (
        <p className="mt-10 text-body text-text-muted">No images yet — check back soon.</p>
      )}
    </div>
  );
}