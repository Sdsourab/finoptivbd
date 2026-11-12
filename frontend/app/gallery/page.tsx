import { GalleryGrid } from "@/components/GalleryGrid";
import { getGallery } from "@/lib/api";
import { BrandProof } from "@/components/BrandProof";
export const revalidate=60;
export const metadata={title:"Analytics Gallery",description:"Visual examples from Finoptiv: dashboards, charts, analysis visuals, research communication, and brand work."};
export default async function GalleryPage(){const items=await getGallery().catch(()=>[]);return <div className="pb-10"><div className="mx-auto max-w-6xl px-4 pt-16 md:px-6"><p className="font-mono text-caption uppercase tracking-[0.18em] text-lime-accent">Gallery</p><h1 className="mt-3 font-display text-display-2 font-semibold">Analytics you can see.</h1><p className="mt-3 max-w-2xl text-body text-text-secondary">Charts, dashboards, research visuals, and branded communication from the Finoptiv work library.</p></div><BrandProof/>{items.length>0&&<section className="mx-auto max-w-6xl px-4 py-10 md:px-6"><h2 className="font-display text-display-3 font-medium">Published gallery</h2><div className="mt-8"><GalleryGrid items={items}/></div></section>}</div>}
