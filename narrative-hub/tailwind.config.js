/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
                display: ['var(--font-space)', 'var(--font-inter)', 'sans-serif'], // For headings
                serif: ['var(--font-playfair)', 'serif'],
            },
            colors: {
                brand: {
                    50: '#FFF5F0',
                    100: '#FFE8DC',
                    200: '#FFD1B8',
                    300: '#FFB891',
                    400: '#FF9E66',
                    500: '#FF5500', // Reference Orange
                    600: '#E64D00',
                    700: '#CC4400',
                    800: '#A33600',
                    900: '#7A2900',
                    950: '#4D1A00',
                },
                surface: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#FAFAFA', // Ultra light gray
                    tertiary: '#F5F5F5',
                    dark: '#050505',
                    'dark-secondary': '#121212',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
            },
            boxShadow: {
                'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
                'medium': '0 8px 30px rgba(0, 0, 0, 0.04)',
                'hard': '0 0 0 2px #000000', // Brutalist border option
                'glow-orange': '0 0 60px -15px rgba(255, 85, 0, 0.3)',
            },
            letterSpacing: {
                'tightest': '-0.04em',
                'tighter': '-0.02em',
            },
            lineHeight: {
                'tighter': '1.1',
            },
        },
    },
    plugins: [],
};
