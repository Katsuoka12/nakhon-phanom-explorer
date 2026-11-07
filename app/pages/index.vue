<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Crosshair,
  Heart,
  MapPin,
  Mountain,
  Sparkles,
  Store,
  Trash2,
} from "@lucide/vue";
import heroImg from "~/assets/hero-thatphanom.jpg";
import { CATEGORIES } from "~/lib/categories";
import { CATEGORY_ICONS } from "~/lib/category-icons";
import { PLACES, distanceKm, type Pt } from "~/lib/places";

const HIGHLIGHTS = [
  { value: String(PLACES.length), label: "แหล่งท่องเที่ยว" },
  { value: String(CATEGORIES.length), label: "หมวดหมู่ใกล้เคียง" },
  { value: "12", label: "อำเภอทั่วจังหวัด" },
];

useSeoMeta({
  title: "TiewNakhon — เที่ยวนครพนม แผนที่แหล่งท่องเที่ยวและที่พัก",
  description:
    "แผนที่แหล่งท่องเที่ยวจังหวัดนครพนม ค้นหาตำแหน่งปัจจุบัน ปักหมุด และดูที่พัก ร้านค้า คาเฟ่ ร้านอาหาร และปั๊มน้ำมันใกล้เคียง",
  ogTitle: "TiewNakhon — เที่ยวนครพนม",
  ogDescription: "แผนที่แหล่งท่องเที่ยวและสถานที่ใกล้เคียงในจังหวัดนครพนม",
  ogType: "website",
  twitterCard: "summary_large_image",
});

const focus = ref<Pt | null>(null);
const me = ref<Pt | null>(null);
const pins = ref<Pt[]>([]);
const selected = ref<string | null>(null);
const geoMsg = ref("");
const listOpen = ref(true);
const year = new Date().getFullYear();

onMounted(() => {
  try {
    const stored = localStorage.getItem("tn-pins");
    if (stored) pins.value = JSON.parse(stored) as Pt[];
  } catch {
    /* ignore */
  }
});

function savePins(next: Pt[]) {
  pins.value = next;
  localStorage.setItem("tn-pins", JSON.stringify(next));
}

function selectPlace(id: string) {
  const place = PLACES.find((item) => item.id === id);
  if (!place) return;
  selected.value = id;
  if (window.innerWidth < 1024) listOpen.value = false;
}

function addPin(point: Pt) {
  savePins([...pins.value, point]);
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
      me.value = point;
      focus.value = point;
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

    <section
      class="snap-section relative isolate flex min-h-[calc(100dvh-4rem)] flex-col justify-end overflow-hidden"
    >
      <img
        :src="heroImg"
        alt="พระธาตุพนมยามเช้าริมแม่น้ำโขง"
        width="1600"
        height="912"
        class="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
      />
      <div class="hero-scrim absolute inset-0" />
      <div class="hero-glow absolute inset-0 opacity-70" />

      <div class="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-16 sm:px-6 md:pb-12 md:pt-20">
        <span
          class="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md"
        >
          <Sparkles class="h-3 w-3 text-gold" />
          จังหวัดนครพนม · ริมฝั่งโขง
        </span>

        <h1
          class="animate-fade-up anim-delay-1 hero-title mt-4 font-display text-[1.95rem] leading-[1.3] tracking-tight sm:text-[2.5rem] md:text-[3rem] lg:text-[3.4rem]"
        >
          เที่ยวนครพนม
          <br />
          <span class="text-gold">ในแผนที่เดียว</span>
        </h1>

        <p
          class="animate-fade-up anim-delay-2 mt-3 max-w-xl text-[13px] leading-relaxed text-white/80 sm:text-[15px]"
        >
          รวมแหล่งท่องเที่ยวในจังหวัดนครพนม พร้อมที่พัก ร้านค้า คาเฟ่ และปั๊มน้ำมันใกล้เคียง
          ค้นหาตำแหน่งของคุณ แล้วปักหมุดสถานที่ที่อยากไปได้เลย
        </p>

        <div class="animate-fade-up anim-delay-3 mt-6 flex flex-wrap items-center gap-2.5">
          <a
            href="#map"
            class="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground shadow-soft transition hover:brightness-110 active:scale-[0.98]"
          >
            <Compass class="h-4 w-4 transition duration-500 group-hover:rotate-90" /> เริ่มสำรวจแผนที่
          </a>
          <NuxtLink
            to="/nearby"
            class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-[13px] font-medium text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98]"
          >
            ดูสถานที่ใกล้เคียง
            <ArrowRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>

        <dl
          class="animate-fade-up anim-delay-4 mt-5 grid w-full max-w-sm grid-cols-3 gap-3 border-t border-white/20 pt-4"
        >
          <div v-for="item in HIGHLIGHTS" :key="item.label" class="flex flex-col gap-1">
            <dt class="font-display text-lg leading-none text-white">{{ item.value }}</dt>
            <dd class="text-[10.5px] leading-tight text-white/65">{{ item.label }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="map" class="snap-section h-[calc(100dvh-4rem)] p-2 sm:p-3">
      <div
        class="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-lift"
      >
        <div class="absolute inset-0">
          <TravelMap
            :focus="focus"
            :me="me"
            :pins="pins"
            :selected="selected"
            @add-pin="addPin"
          />
        </div>

        <!-- floating toolbar -->
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-[800] flex flex-col items-start gap-1.5 p-2.5 pl-14 sm:p-3 sm:pl-16"
        >
          <div
            class="glass-panel pointer-events-auto flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-2xl border border-border/80 p-1.5 shadow-soft"
          >
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground shadow-soft transition hover:brightness-110 active:scale-[0.98]"
              @click="locate"
            >
              <Crosshair class="h-3.5 w-3.5" /> ตำแหน่งของฉัน
            </button>
            <button
              v-if="pins.length > 0"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] text-foreground transition hover:bg-muted active:scale-[0.98]"
              @click="savePins([])"
            >
              <Trash2 class="h-3.5 w-3.5 text-primary" /> ล้างหมุด ({{ pins.length }})
            </button>
            <span class="hidden px-1.5 text-[11px] text-muted-foreground xl:inline">
              เลือกสถานที่เพื่อดูหมุด · แตะแผนที่เพื่อปักหมุด
            </span>
          </div>

          <div
            class="glass-panel pointer-events-auto flex w-fit flex-wrap gap-3 rounded-full border border-border/80 px-3 py-1.5 text-[11px] text-muted-foreground shadow-soft"
          >
            <span class="inline-flex items-center">
              <span class="map-dot pin-place" /> แหล่งท่องเที่ยว
            </span>
            <span class="inline-flex items-center">
              <span class="map-dot pin-stay" /> ที่พัก
            </span>
            <span class="inline-flex items-center">
              <span class="map-dot pin-user" /> หมุดของฉัน
            </span>
          </div>

          <span
            v-if="geoMsg"
            class="pointer-events-auto w-fit rounded-full border border-border/70 bg-card/95 px-3 py-1 text-[11px] text-primary shadow-soft backdrop-blur"
          >
            {{ geoMsg }}
          </span>
        </div>

        <!-- attractions panel -->
        <aside
          class="absolute inset-x-2 bottom-2 z-[800] max-h-[46dvh] overflow-hidden rounded-3xl border border-border/80 bg-card/95 shadow-lift backdrop-blur lg:inset-x-auto lg:bottom-3 lg:right-3 lg:top-3 lg:max-h-none lg:w-[324px]"
        >
          <div class="flex items-center justify-between gap-2 px-3.5 pb-2 pt-3.5">
            <div>
              <h2 class="font-display text-base leading-tight">แหล่งท่องเที่ยว</h2>
              <p class="mt-0.5 text-[10.5px] text-muted-foreground">
                {{ PLACES.length }} สถานที่ · เลือกเพื่อปักหมุดบนแผนที่
              </p>
            </div>
            <button
              type="button"
              :aria-label="listOpen ? 'ห่อหน้ารายการ' : 'ขยายรายชื่อสถานที่'"
              class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted lg:hidden"
              @click="listOpen = !listOpen"
            >
              <ChevronDown v-if="listOpen" class="h-4 w-4" />
              <ChevronUp v-else class="h-4 w-4" />
            </button>
          </div>

          <div
            v-if="listOpen"
            class="panel-scroll max-h-[calc(46dvh-4rem)] overflow-y-auto px-1.5 pb-2.5 lg:max-h-[calc(100%-4rem)]"
          >
            <ul class="space-y-0.5">
              <li v-for="(place, index) in PLACES" :key="place.id">
                <button
                  type="button"
                  class="group flex w-full items-center gap-2.5 rounded-2xl border p-1.5 text-left transition"
                  :class="
                    selected === place.id
                      ? 'border-primary/35 bg-accent/70 shadow-soft'
                      : 'border-transparent hover:border-border hover:bg-muted/70'
                  "
                  @click="selectPlace(place.id)"
                >
                  <span class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img
                      :src="place.img"
                      :alt="place.name"
                      loading="lazy"
                      class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span
                      class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent pb-0.5 text-center text-[10px] font-semibold text-white"
                    >
                      {{ String(index + 1).padStart(2, "0") }}
                    </span>
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-[13px] font-medium leading-snug">
                      {{ place.name }}
                    </span>
                    <span
                      class="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-primary"
                    >
                      <MapPin class="h-2.5 w-2.5" /> อ.{{ place.district }}
                      <span v-if="me" class="text-muted-foreground">
                        · {{ distanceKm(me, place).toFixed(1) }} กม.
                      </span>
                    </span>
                    <span
                      class="mt-0.5 line-clamp-2 block text-[10.5px] leading-relaxed text-muted-foreground"
                    >
                      {{ place.desc }}
                    </span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>

    <section
      id="nearby"
      class="snap-section flex min-h-[calc(100dvh-4rem)] items-center px-4 py-12 sm:px-6 md:py-16"
    >
      <div class="mx-auto w-full max-w-7xl">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
            >
              <Store class="h-3.5 w-3.5" /> ใกล้เคียง
            </span>
            <h2 class="mt-3 max-w-2xl font-display text-2xl leading-tight md:text-4xl">
              ทุกอย่างรอบ <span class="text-primary">จุดที่คุณเลือก</span>
            </h2>
            <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              ที่พัก ร้านสะดวกซื้อ คาเฟ่ ร้านอาหาร และปั๊มน้ำมัน เรียงตามระยะทางจากจุดอ้างอิง
            </p>
          </div>
          <NuxtLink
            to="/nearby"
            class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs text-foreground shadow-soft transition hover:border-primary/35 hover:text-primary"
          >
            เปิดหน้าใกล้เคียง <ArrowRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          <NuxtLink
            v-for="item in CATEGORIES"
            :key="item.id"
            :to="`/nearby?category=${item.id}`"
            class="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lift"
          >
            <span
              class="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <component :is="CATEGORY_ICONS[item.id]" class="h-[18px] w-[18px]" />
            </span>
            <span class="mt-3 font-display text-[15px] leading-snug">{{ item.label }}</span>
            <span class="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {{ item.description }}
            </span>
            <span class="mt-3 inline-flex items-center gap-1 text-[11px] text-primary">
              ดูรายการ <ArrowRight class="h-3 w-3" />
            </span>
          </NuxtLink>
        </div>

        <p class="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin class="h-3 w-3 text-primary" /> ข้อมูลสถานที่จาก Longdo Map /
          Google Maps · เลือกจุดอ้างอิงได้ในหน้าใกล้เคียง
        </p>
      </div>
    </section>

    <footer class="snap-end border-t border-border/70 bg-card/50">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div class="flex items-center gap-2.5">
            <span class="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <Mountain class="h-4 w-4" />
            </span>
            <span class="font-display text-lg leading-none">
              Tiew<span class="text-primary">Nakhon</span>
            </span>
          </div>
          <p class="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
            แผนที่ท่องเที่ยวจังหวัดนครพนม ริมฝั่งแม่น้ำโขง · ข้อมูลเพื่อการท่องเที่ยว
          </p>
        </div>
        <nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <NuxtLink to="/#map" class="transition hover:text-primary">แผนที่</NuxtLink>
          <NuxtLink to="/nearby" class="transition hover:text-primary">ใกล้เคียง</NuxtLink>
        </nav>
        <p class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          © {{ year }} TiewNakhon · ทำด้วย
          <Heart class="h-3 w-3 text-primary" /> เพื่อคนนครพนม
        </p>
      </div>
    </footer>
  </div>
</template>
