// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "path";
import fs from "fs";
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  devServer: {
    https: {
      key: "./server.key",
      cert: "./server.crt",
    },
  },
  routeRules: {
    '/api/**': {
        proxy: { to: "https://192.168.123.16/api/**", },
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
