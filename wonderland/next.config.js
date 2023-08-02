/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'basicbeasts.mypinata.cloud',
				port: '',
				pathname: '/ipfs/**',
			},
		],
	},
};
