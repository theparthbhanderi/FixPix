/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563EB', // Electric Blue
                    hover: '#1d4ed8',
                    light: '#3b82f6',
                },
                secondary: {
                    DEFAULT: '#10B981', // Neon Green
                },
                accent: {
                    purple: '#8B5CF6',    // Neon Purple
                    pink: '#EC4899',
                },
                // Dark/Light Theme Surfaces (Mapped to CSS Variables)
                background: 'rgb(var(--bg-background) / <alpha-value>)',
                surface: 'rgb(var(--bg-surface) / <alpha-value>)',
                'surface-highlight': 'rgb(var(--bg-surface-highlight) / <alpha-value>)',

                // Text colors
                'text-main': 'rgb(var(--text-main) / <alpha-value>)',
                'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
                'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',

                border: {
                    DEFAULT: 'rgb(var(--border-color) / <alpha-value>)',
                    light: 'rgb(var(--border-light) / <alpha-value>)',
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                'pill': '9999px',
            },
            boxShadow: {
                'neon': '0 0 10px rgba(37, 99, 235, 0.2), 0 0 20px rgba(37, 99, 235, 0.1)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backgroundImage: {
                'gradient-cyber': 'linear-gradient(to bottom right, #121212, #1e1e2e)',
            }
        },
    },
    plugins: [],
}
