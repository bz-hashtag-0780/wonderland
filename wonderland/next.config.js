/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
	images: {
		domains: ['basicbeasts.mypinata.cloud', 'basicbeasts.io'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'basicbeasts.mypinata.cloud',
				port: '',
				pathname: '/ipfs/**',
			},
			{
				protocol: 'https',
				hostname: 'basicbeasts.io',
				port: '',
				pathname:
					'/_next/static/image/public/fungible_tokens/fungible_tokens_thumbnails/**',
			},
			{
				protocol: 'https',
				hostname: 'images.flovatar.com',
				port: '',
				pathname: '/flovatar/png/**',
			},
		],
	},
};
