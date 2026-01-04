/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Agricultural theme colors
                farm: {
                    50: '#f4fdf4',
                    100: '#eefcee',
                    200: '#dcf9dc',
                    300: '#bdf2bd',
                    400: '#90e690',
                    500: '#5dd45d',
                    600: '#38b038',
                    700: '#2d8b2d',
                    800: '#276e27',
                    900: '#225a22',
                    950: '#0e310e',
                },
                earth: {
                    50: '#fbf7f4',
                    100: '#f6ede8',
                    200: '#eedccf',
                    300: '#e2c1ad',
                    400: '#d29f82',
                    500: '#c5815f',
                    600: '#b86748',
                    700: '#994f36',
                    800: '#7f4230',
                    900: '#67372b',
                    950: '#371b14',
                }
            }
        },
    },
    plugins: [],
}
