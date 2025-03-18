import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      gray: "#f4f3f7",
      white: "#ffffff",
      black: "#000000",
      red: "red",
      background: "#D9D9D9",
      ["text-secondary"]: "#262626",
      ["text-disabled"]: "#979797",
      ["border-primary"]: "#ebe9f1",
      ["border-gray"]: "#e8e6ef",
      ["accent-green"]: "#00bd83",
      ["info-primary"]: "#00855C",
      ["background-disabled"]: "#ededed",
      ["error-primary"]: "#CD574C",
      ["error-primary-20"]: "#F4DAD7",
      ["error-primary-80"]: "#A7392F",
      ["warning-primary"]: "#F4A125",
      ["warning-primary-20"]: "#FCEACF",
      ["warning-primary-50"]: "#D17823",
      ["success-primary"]: "#00835F",
      ["success-primary-0"]: "#E0FFF6",
    },
  },
  plugins: [],
};
export default config;
