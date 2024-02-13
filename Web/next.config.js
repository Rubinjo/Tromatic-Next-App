const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve.fallback = { fs: false };

		return config;
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/portal/machines",
				permanent: true,
			},
			{
				source: "/portal",
				destination: "/portal/machines",
				permanent: true,
			},
		];
	},
};

module.exports = withNextIntl(nextConfig);
