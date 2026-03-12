// theme/theme.ts

export const theme = {
    colors: {
      // The deep, dark green used for primary buttons and dark cards
      forest: {
        primary: "#162C25",
        secondary: "#1D3A32", // Slightly lighter for gradients/hovers
        muted: "#2A453D",
      },
      // The signature lime green used for accents and highlights
      lime: {
        primary: "#C8F064",
        light: "#D9F591",
        dark: "#A9CD4D",
      },
      // The soft off-white/mint background color of the page
      background: {
        main: "#F2F9F1",
        card: "#FFFFFF",
      },
      // Text colors
      text: {
        dark: "#162C25",
        muted: "#5E6D68",
        white: "#FFFFFF",
      }
    },
    
    // Design tokens for the rounded "Pill" aesthetic seen in the image
    borderRadius: {
      full: "9999px",
      card: "2rem",      // 32px - for those chunky rounded corners
      button: "1.5rem",  // 24px
    },
  
    // Shadows for the floating card effect
    shadows: {
      soft: "0px 20px 40px rgba(22, 44, 37, 0.05)",
      card: "0px 10px 30px rgba(0, 0, 0, 0.03)",
    },
  
    // Typography settings for the Satoshi font
    typography: {
      fontFamily: "Satoshi, sans-serif",
      h1: {
        fontSize: "4.5rem",
        lineHeight: "1.1",
        letterSpacing: "-0.03em",
        fontWeight: "700",
      },
    }
  };
  
  export type Theme = typeof theme;