/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        Bleu: '#7a89da',
        Rose: '#e0b1c5',
        Blanc: '#fffdf6',
        'Bleu clair': '#b1d9e1',
      },
      fontSize: {
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.25rem',
        '4xl': '3rem',
      },
      fontFamily: {
        'permanent-marker': 'Permanent Marker',
        agrandir: ['Agrandir', 'sans-serif'],
      },
      borderRadius: {
        'rounded-0': '0rem',
        'rounded-1': '0.1111111111111111rem',
        'rounded-2': '0.2777777777777778rem',
        'rounded-3': '0.4444444444444444rem',
        'rounded-4': '0.5555555555555556rem',
        'rounded-5': '0.8333333333333334rem',
        'rounded-6': '1.1111111111111112rem',
        'rounded-7': '2.2222222222222223rem',
        'rounded-8': '55.5rem',
      },
    },
  },
  plugins: [],
}

