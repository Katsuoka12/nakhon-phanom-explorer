<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ArrowLeft,
  Clock,
  Compass,
  Crosshair,
  ExternalLink,
  MapPin,
  Star,
} from "@lucide/vue";
import {
  CATEGORIES,
  isCategoryId,
  type CategoryId,
  type NearbyPlace,
} from "~/lib/categories";
import { CATEGORY_ICONS } from "~/lib/category-icons";
import { PLACES, distanceKm, type Place } from "~/lib/places";

useSeoMeta({
  title: "ใกล้เคียง — ที่พัก ร้านค้า คาเฟ่ และปั๊มน้ำมัน | TiewNakhon",
  description:
    "เลือกจุดอ้างอิงในจังหวัดนครพนม แล้วดูที่พัก ร้านสะดวกซื้อ คาเฟ่ ร้านอาหาร และปั๊มน้ำมันใกล้เคียง เรียงตามระยะทาง",
  ogTitle: "ใกล้เคียง — TiewNakhon",
  ogDescription: "ที่พัก ร้านค้า คาเฟ่ ร้านอาหาร และปั๊มน้ำมันรอบจุดที่คุณเลือก",
  ogType: "website",
  twitterCard: "summary_large_image",
});

type NearbyResponse = { source: "google" | "sample"; places: NearbyPlace[] };

const route = useRoute();
const router = useRouter();

const FIRST = PLACES[0]!;

const initialCategory = route.query.category;
const category = ref<CategoryId>(isCategoryId(initialCategory) ? initialCategory : "stay");
const refId = ref(FIRST.id);
const refPoint = ref({ label: FIRST.name, lat: FIRST.lat, lng: FIRST.lng });
const geoMsg = ref("");

watch(category, (value) => {
  router.replace({ query: { ...route.query, category: value } });
});

const query = computed(() => ({
  lat: refPoint.value.lat,
  lng: refPoint.value.lng,
  type: category.value,
}));

const { data, pending, error, refresh } = await useFetch<NearbyResponse>("/api/nearby", { query });

const results = computed(() =>
  (data.value?.places ?? [])
    .map((place) => ({ ...place, km: distanceKm(refPoint.value, place) }))
    .sort((a, b) => a.km - b.km),
);

const usingSample = computed(() => data.value?.source === "sample");
const errorMessage = computed(
  () => error.value?.statusMessage || error.value?.message || "โหลดข้อมูลไม่สำเร็จ",
);

function choosePlace(place: Place) {
  refId.value = place.id;
  refPoint.value = { label: place.name, lat: place.lat, lng: place.lng };
}

function locate() {
  if (!navigator.geolocation) {
    geoMsg.value = "อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง";
    return;
  }
  geoMsg.value = "กำลังค้นหาตำแหน่ง…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      refId.value = "me";
      refPoint.value = { label: "ตำแหน่งของคุณ", ...point };
      geoMsg.value = "";
    },
    () => {
      geoMsg.value = "ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาอนุญาตการใช้ตำแหน่ง";
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <SiteHeader />

    <main class="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 md:pt-10">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft class="h-3.5 w-3.5" /> กลับหน้าแรก
      </NuxtLink>

      <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span
            class="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
          >
            <Compass class="h-3.5 w-3.5" /> สำรวจนครพนม
          </span>
          <h1 class="mt-3 font-display text-2xl leading-tight md:text-4xl">
            รอบ ๆ <span class="text-primary">“{{ refPoint.label }}”</span>
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            ที่พัก ร้านสะดวกซื้อ คาเฟ่ ร้านอาหาร และปั๊มน้ำมัน เรียงตามระยะทางจากจุดอ้างอิง
          </p>
        </div>
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground shadow-soft"
        >
          <MapPin class="h-3.5 w-3.5 text-primary" />
          {{ usingSample ? "ข้อมูลตัวอย่าง" : "ข้อมูลจาก Google Maps" }}
        </span>
      </div>

      <!-- reference point -->
      <section class="mt-6 rounded-3xl border border-border/80 bg-card/60 p-4 shadow-soft">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-display text-base">
            จุดอ้างอิง:
            <span class="text-primary">{{ refPoint.label }}</span>
          </h2>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground shadow-soft transition hover:brightness-110 active:scale-[0.98]"
            @click="locate"
          >
            <Crosshair class="h-3.5 w-3.5" /> ตำแหน่งของฉัน
          </button>
        </div>

        <div class="panel-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="place in PLACES"
            :key="place.id"
            type="button"
            class="shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition"
            :class="
              refId === place.id
                ? 'border-primary/40 bg-accent/70 font-medium text-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
            "
            @click="choosePlace(place)"
          >
            {{ place.name }}
          </button>
        </div>

        <p v-if="geoMsg" class="mt-2 text-[11px] text-primary">{{ geoMsg }}</p>
      </section>

      <!-- categories -->
      <div class="panel-scroll mt-6 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="item in CATEGORIES"
          :key="item.id"
          type="button"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition"
          :class="
            category === item.id
              ? 'border-primary/40 bg-primary text-primary-foreground shadow-soft'
              : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
          "
          @click="category = item.id"
        >
          <component :is="CATEGORY_ICONS[item.id]" class="h-4 w-4" />
          {{ item.label }}
        </button>
      </div>

      <p
        v-if="usingSample && !pending"
        class="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground"
      >
        ยังไม่ได้ตั้งค่า Google Places API key (<code class="text-primary">NUXT_GOOGLE_PLACES_KEY</code>)
        — ตอนนี้จึงแสดงรายการตัวอย่างเพื่อให้เห็นหน้าตาและการทำงานของหน้า
        เมื่อใส่คีย์แล้ว รายการจะถูกดึงจาก Google Maps จริงตามตำแหน่งที่เลือก
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p class="text-[11px] text-muted-foreground">
          {{ pending ? "กำลังโหลด…" : `${results.length} สถานที่ · เรียงตามระยะทาง` }}
        </p>
        <NuxtLink to="/#map" class="text-[11px] text-primary hover:underline">
          ดูจุดอ้างอิงบนแผนที่ →
        </NuxtLink>
      </div>

      <!-- loading -->
      <div v-if="pending" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-40 animate-pulse rounded-3xl bg-muted" />
      </div>

      <!-- error -->
      <div
        v-else-if="error"
        class="mt-4 rounded-3xl border border-destructive/30 bg-card p-6 shadow-soft"
      >
        <h2 class="font-display text-base">โหลดข้อมูลไม่สำเร็จ</h2>
        <p class="mt-1 text-xs leading-relaxed text-muted-foreground">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground shadow-soft"
          @click="refresh()"
        >
          ลองอีกครั้ง
        </button>
      </div>

      <!-- results -->
      <div v-else-if="results.length" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="place in results"
          :key="place.id"
          class="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lift"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <component :is="CATEGORY_ICONS[place.category]" class="h-[18px] w-[18px]" />
            </span>
            <span class="rounded-full bg-muted px-2 py-0.5 text-[10.5px] text-muted-foreground">
              {{ place.km.toFixed(1) }} กม.
            </span>
          </div>

          <h2 class="mt-2.5 line-clamp-2 font-display text-[15px] leading-snug">
            {{ place.name }}
          </h2>
          <p class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {{ place.address || "ไม่ระบุที่อยู่" }}
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2 text-[10.5px]">
            <span
              v-if="place.rating"
              class="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2 py-0.5 text-secondary-foreground"
            >
              <Star class="h-3 w-3 fill-gold text-gold" /> {{ place.rating.toFixed(1) }}
              <span v-if="place.reviews" class="text-muted-foreground">({{ place.reviews }})</span>
            </span>
            <span
              v-if="place.openNow !== undefined"
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
              :class="
                place.openNow
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              "
            >
              <Clock class="h-3 w-3" /> {{ place.openNow ? "เปิดอยู่" : "ปิดอยู่" }}
            </span>
          </div>

          <a
            v-if="place.mapsUrl"
            :href="place.mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            เปิดใน Google Maps <ExternalLink class="h-3 w-3" />
          </a>
        </article>
      </div>

      <p
        v-else
        class="mt-4 rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground"
      >
        ไม่พบสถานที่ในหมวดนี้รอบจุดอ้างอิง ลองเลือกจุดอ้างอิงอื่นหรือใช้ตำแหน่งของคุณ
      </p>

      <p class="mt-8 text-[10.5px] leading-relaxed text-muted-foreground">
        ข้อมูลสถานที่จาก Google Maps (Places API) · ระยะทางคำนวณจากจุดอ้างอิงแบบเส้นตรง
        · ราคาและเวลาเปิด-ปิดอาจเปลี่ยนแปลง ควรตรวจสอบอีกครั้งก่อนเดินทาง
      </p>
    </main>
  </div>
</template>
