/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        gradient: "gradient 15s ease infinite",
        float: "float 10s ease-in-out infinite",
        pulse: "pulse 1s infinite", // Added pulse animation
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        pulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      // Custom theme extension for glassmorphism effect
      backdropBlur: {
        sm: "4px",
        md: "10px",
        lg: "16px",
      },
      borderRadius: {
        xl: "16px",
      },
      boxShadow: {
        glass: "0px 4px 30px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        "glass-bg": "rgba(255, 255, 255, 0.1)",
        "glass-border": "rgba(255, 255, 255, 0.2)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
