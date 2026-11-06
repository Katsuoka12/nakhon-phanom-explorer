import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-11-06",
  runtimeConfig: {
    // Secrets stay server-side: override with NUXT_GOOGLE_PLACES_KEY.
    googlePlacesKey: "",
  },
  devtools: { enabled: false },
  css: ["leaflet/dist/leaflet.css", "~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["leaflet", "@lucide/vue"],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "th" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#faf6ee" },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Mitr:wght@400;500;600&family=Sarabun:wght@400;500;600&display=swap",
        },
      ],
    },
  },
  typescript: { strict: true },
});
