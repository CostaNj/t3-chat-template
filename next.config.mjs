// @ts-ignore
import withLinaria from 'next-linaria';
import i18nextConfig from "./next-i18next.config.mjs";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = withLinaria({
	reactStrictMode: true,
	i18n: i18nextConfig.i18n,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
});
export default config;
