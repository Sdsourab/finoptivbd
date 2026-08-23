/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // TODO: narrow to the real project ref (https://<ref>.supabase.co)
        // once the Supabase project exists — see docs/07-DEPLOYMENT-SETUP.md
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
