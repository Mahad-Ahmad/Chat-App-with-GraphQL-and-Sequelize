/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = () => {
  const env = {
    APP_URI: process.env.APP_URI,
  };
  return { env, nextConfig };
};
