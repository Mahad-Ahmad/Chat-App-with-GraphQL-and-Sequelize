/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = () => {
  const env = {
    APP_URI: process.env.APP_URI,
    SUBSCRIPTION_URL: process.env.SUBSCRIPTION_URL,
  };
  return { env, nextConfig };
};
