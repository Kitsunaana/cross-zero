/** COLORS THEME */
const BG_COLORS = {
	DEFAULT: '#1b1b1f',
	secondary: '#202127'
}

const ACCENT_COLORS = {
	DEFAULT: '#f36464',
}

const TEXT_COLORS = {
	DEFAULT: '#ddddd5',
	secondary: '#97979e'
}

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			colors: {
				bg: BG_COLORS,
				accent: ACCENT_COLORS,
				text: TEXT_COLORS,
			}
		},
	}
}

