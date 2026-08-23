import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/api";

const logoDataUri = (() => {
  try {
    const file = fs.readFileSync(path.join(process.cwd(), "public", "logo-wordmark-white.png"));
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
})();

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  let title = "Finoptiv";
  let excerpt = "Data Driven. Insight Focused. Future Ready.";
  let isExternal = false;

  try {
    const article = await getArticle(params.slug);
    title = article.title;
    excerpt = article.excerpt;
    isExternal = Boolean(article.external_url);
  } catch {
    // Unknown slug: still return a valid, on-brand generic image rather than erroring.
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#041F1A",
          backgroundImage: "linear-gradient(90deg, #062E27 0%, #0B8E4C 50%, #B7E000 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {logoDataUri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoDataUri} alt="Finoptiv" height={36} />
          ) : (
            <div style={{ fontSize: 28, color: "#FFFFFF", opacity: 0.85 }}>Finoptiv</div>
          )}
          {isExternal && (
            <div
              style={{
                fontSize: 22,
                color: "#041F1A",
                backgroundColor: "#B7E000",
                padding: "6px 16px",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              ↗ External
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 56, color: "#FFFFFF", fontWeight: 700, maxWidth: 950, lineHeight: 1.15 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "#FFFFFF", opacity: 0.85, marginTop: 20, maxWidth: 900 }}>
            {excerpt}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}