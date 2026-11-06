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

## Nearby page (Google Places)

`/nearby` shows nearby stays, convenience stores, cafés, restaurants and petrol stations
around an attraction or the visitor's location. Results come from Google Places API (New)
Nearby Search through `server/api/nearby.get.ts`.

1. In Google Cloud Console enable **Places API (New)** and create an API key.
2. Put it in `.env` (never commit it):

```sh
NUXT_GOOGLE_PLACES_KEY=your-key
```

Without a key the page still works, but shows clearly-labelled sample rows instead of live
Google results. The key is only read on the server — it is never sent to the browser.

