/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'midnight-abyss': '#0A0F1D',
                'cyan-signal': '#00F5D4',
                'data-purple': '#7B61FF',
                'solar-coral': '#FF6B6B',
                'starlight-white': '#EAEAEA',
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
