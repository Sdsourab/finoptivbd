import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GITHUB_URL, LINKEDIN_URL, OWNER_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

const sameAs = [GITHUB_URL, LINKEDIN_URL].filter(Boolean) as string[];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo-icon-square.png`,
      description: SITE_DESCRIPTION,
      email: OWNER_EMAIL,
      sameAs,
    },
    {
      "@type": "Person",
      name: "Sourav Dey Soptom",
      url: `${SITE_URL}/about`,
      jobTitle: "Business & Data Analytics Specialist",
      worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      sameAs,
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Business & Data Analytics Solutions`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Finoptiv",
    "business analytics",
    "data analysis",
    "business analysis",
    "data analytics",
    "dashboard development",
    "SQL",
    "Python",
    "forecasting",
    "AI automation",
    "Bangladesh",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/logo-icon-square.png",
    apple: "/logo-icon-square.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Business & Data Analytics Solutions`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Business & Data Analytics Solutions`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-bg-main font-body text-text-primary">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
