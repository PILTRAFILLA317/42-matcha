import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	// theme: {
	// 	extend: {}
	// },

	plugins: [typography, forms, containerQueries, daisyui],

	daisyui: {
		themes: [
			{
				mytheme: {
					"primary": "#fd7e89",
					"secondary": "#6d95f2",
					"accent": "#9B3331",
					"neutral": "#393939",
					"base-100": "#1A1A1A",
					"base-200": "#2D2D2D",
				},
			},
		],
	},
} satisfies Config;
