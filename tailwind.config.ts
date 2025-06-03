import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./stories/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg1: "#f3f5f7",
        s1: "#ffe684",
        g0: "#eeeeee",
        g1: "#e3e3e3",
        g2: "#cccccc",
        g3: "#b3b3b3",
        m1: "#e2e3ff",
        m2: "#c5c7ff",
        m3: "#a3a7ff",
        m4: "#8387ff",
        title1: "#1c1c1c",
        text1: "#3f3f3f",
        subText1: "#6c6c6c",
        white: "#ffffff",
      },
      boxShadow: {
        button1: "0 0 5px 0 #00000026",
        button2: "0 0 8px 0 #00000033",
        select1: "0 0 10px 0 #a3a7ff66",
        side1: "5px 0 10px 3px #0000000d",
        side2: "0 5px 10px 3px #0000000d",
      },
    },
  },
};

export default config;
