import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";

import tailwindConfig from "./tailwind.config.js";

export default {
  plugins: [
    postcssImport(),
    tailwind(tailwindConfig),
    postcssNested(),
    autoprefixer()
  ]
};
