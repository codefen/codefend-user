/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		screens:{
			'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
		},
		extend: {
			colors: {
				'primary-color-mask': '#ff0000',
        'secondary-color-50': '#fe4e4e',
			}
		},
	},
	plugins: [],
};
