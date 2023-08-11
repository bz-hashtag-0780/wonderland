/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			fontFamily: {
				wonderland: ['Pacifico', 'cursive'],
			},
			backgroundColor: {
				'custom-orange': 'rgb(252, 199, 135)',
			},
			borderColor: {
				'custom-orange': 'rgba(252, 199, 135, 0.314)',
			},
		},
	},
	plugins: [],
};
