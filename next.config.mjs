const legacyImageRedirects = [
  {
    source: "/images/images%20(5).jpg",
    destination: "/images/japan-tokyo-osaka.jpg",
    permanent: true,
  },
  {
    source: "/images/images%20(6).jpg",
    destination: "/images/korea-seoul-nami-island.jpg",
    permanent: true,
  },
  {
    source: "/images/images%20(7).jpg",
    destination: "/images/europe-swiss-france.jpg",
    permanent: true,
  },
  {
    source: "/images/pcv9ubnkbagpy3uj68ld.jpg",
    destination: "/images/krabi-four-islands.jpg",
    permanent: true,
  },
  {
    source: "/images/thailand-top-tourist-attractions-in-the-world-w.webp",
    destination: "/images/chiang-mai-doi-inthanon.webp",
    permanent: true,
  },
  {
    source: "/images/73xOjfHu1ny3RYEw7LVp.webp",
    destination: "/images/vietnam-halong-bay.webp",
    permanent: true,
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return legacyImageRedirects;
  },
};

export default nextConfig;
