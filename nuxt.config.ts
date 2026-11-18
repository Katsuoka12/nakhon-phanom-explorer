import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-11-06",
  runtimeConfig: {
    // Secrets stay server-side. Nearby places prefers Longdo Map when its key is
    // set, then Google Places, and falls back to sample data when both are empty.
    longdoKey: "",
    googlePlacesKey: "",
    // WeatherAPI key for the weather panel on /nearby (server-side only).
    weatherApiKey: "",
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
