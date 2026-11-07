# Nakhon Phanom Explorer

ช่วยทำเว็บสถานที่ท่องเที่ยวประเทศไทย จังหวัดนครพนม เอาแค่ในจังหวัด โดยมีองค์ประกอบดังนี้

## Stack

- Nuxt 4 (Vue 3, SSR) + Nitro
- Tailwind CSS v4 ผ่าน `@tailwindcss/vite` (ธีมอยู่ใน `app/assets/css/main.css`)
- Leaflet + OpenStreetMap (`app/components/TravelMap.client.vue`)
- ไอคอนจาก `@lucide/vue`

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7398d034-50e6-47d3-9a1e-59a6bb847b98).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Nearby page (Longdo Map / Google Places)

`/nearby` shows nearby stays, convenience stores, cafés, restaurants and petrol stations
around an attraction or the visitor's location. Places are fetched by
`server/api/nearby.get.ts`, which prefers whichever key is configured:

1. **Longdo Map** (Nearby POI) — used when `NUXT_LONGDO_KEY` is set. Categories map to the
   tags `hotel`, `convenience_store`, `coffee_shop`, `restaurant` and `gas_station`.
2. **Google Places API (New)** (Nearby Search) — used when only `NUXT_GOOGLE_PLACES_KEY` is set.
3. **Sample data** — used when neither key is set; the page labels it clearly.

Create a Longdo key at <https://api.longdo.com/console> (free tier: 100k requests/month)
or a Google key with **Places API (New)** enabled in Google Cloud Console, then put it in
`.env` (never commit it):

```sh
NUXT_LONGDO_KEY=your-longdo-key
NUXT_GOOGLE_PLACES_KEY=your-google-key   # optional fallback
```

The key is only read on the server — it is never sent to the browser. Longdo results carry
name, address and coordinates (no ratings or opening hours); Google results add rating,
review count and open/closed state.

