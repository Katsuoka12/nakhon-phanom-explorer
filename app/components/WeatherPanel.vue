<script setup lang="ts">
import { computed, type Component } from "vue";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Moon,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "@lucide/vue";

type WeatherSummary = {
  source: "weatherapi";
  place: string;
  localtime: string;
  updatedAt: string;
  current: {
    tempC: number;
    feelsLikeC: number;
    condition: string;
    code: number;
    isDay: boolean;
    humidity: number;
    windKph: number;
    windDir: string;
    precipMm: number;
    uv: number;
    cloud: number;
    chanceOfRain: number;
  };
  days: {
    date: string;
    max: number;
    min: number;
    chanceOfRain: number;
    condition: string;
    code: number;
    sunrise: string;
    sunset: string;
  }[];
};

const props = defineProps<{
  lat: number;
  lng: number;
  label: string;
}>();

// The key stays in runtimeConfig and is read by /api/weather only. Rendering the
// card on the server avoids a hydration swap and keeps the markup in the HTML.
const { data, pending, error } = await useFetch<WeatherSummary>("/api/weather", {
  query: computed(() => ({ lat: props.lat, lng: props.lng })),
});

const errorMessage = computed(
  () => error.value?.statusMessage || error.value?.message || "โหลดสภาพอากาศไม่สำเร็จ",
);
const setupMissing = computed(() => error.value?.statusCode === 503);

const RAIN = [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201];
const SLEET = [1204, 1207, 1249, 1252];
const SNOW = [
  1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258,
];
const STORM = [1087, 1273, 1276, 1279, 1282];

function weatherIcon(code: number, isDay: boolean) {
  if (STORM.includes(code)) return CloudLightning;
  if (SNOW.includes(code) || SLEET.includes(code)) return CloudSnow;
  if (RAIN.includes(code) || (code >= 1240 && code <= 1246)) return CloudRain;
  if ([1030, 1135, 1147].includes(code)) return CloudFog;
  if (code === 1000) return isDay ? Sun : Moon;
  if ([1003, 1006].includes(code)) return isDay ? CloudSun : CloudMoon;
  if (code === 1009) return Cloud;
  return isDay ? CloudSun : CloudMoon;
}

const dayLabel = (date: string, index: number) => {
  if (index === 0) return "วันนี้";
  if (index === 1) return "พรุ่งนี้";
  return new Date(`${date}T00:00:00`).toLocaleDateString("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const updatedLabel = computed(() => {
  const local = data.value?.localtime ?? "";
  return local.split(" ")[1] || data.value?.updatedAt || "";
});

const HEAVY_RAIN = [1192, 1195, 1243, 1246];

type TripAdvice = {
  level: 0 | 1 | 2;
  title: string;
  detail: string;
  icon: Component;
};

// A short travel verdict for today, derived from the current conditions: rain,
// storms, heat, UV and wind are the things that actually change a sightseeing day
// in Nakhon Phanom.
const tripAdvice = computed<TripAdvice | null>(() => {
  const now = data.value?.current;
  if (!now) return null;

  const reasons: string[] = [];
  let level: 0 | 1 | 2 = 0;

  const raise = (next: 0 | 1 | 2, reason: string) => {
    level = Math.max(level, next) as 0 | 1 | 2;
    reasons.push(reason);
  };

  if (STORM.includes(now.code)) raise(2, "มีฟ้าคะนอง");
  if (HEAVY_RAIN.includes(now.code) || now.precipMm >= 5) raise(2, "ฝนตกหนัก");
  if (SNOW.includes(now.code)) raise(2, "สภาพอากาศหนาวจัด");
  if (now.windKph >= 50) raise(2, `ลมแรง ${now.windKph} กม./ชม.`);

  if (now.chanceOfRain >= 60) raise(2, `โอกาสฝน ${now.chanceOfRain}%`);
  else if (now.chanceOfRain >= 30) raise(1, `อาจมีฝน ${now.chanceOfRain}%`);

  if (now.tempC >= 38) raise(1, `ร้อนจัด ${now.tempC}°C`);
  if (now.uv >= 8) raise(1, `UV สูง ${now.uv}`);
  if (now.windKph >= 35) raise(1, `ลมค่อนข้างแรง ${now.windKph} กม./ชม.`);
  if (now.humidity >= 80 && now.tempC >= 32) raise(1, "อากาศอบอ้าว");

  if (level === 0) {
    return {
      level,
      title: "เหมาะกับการเที่ยววันนี้",
      detail: `โอกาสฝน ${now.chanceOfRain}% · UV ${now.uv} · ${now.tempC}°C — ออกไปเดินชมสถานที่และถ่ายรูปได้สบาย`,
      icon: CloudSun,
    };
  }

  if (level === 1) {
    return {
      level,
      title: "เที่ยวได้ แต่ควรเตรียมตัว",
      detail: `${reasons.slice(0, 2).join(" · ")} — พกร่ม หมวก และพักกลางแจ้งเป็นช่วง ๆ`,
      icon: Umbrella,
    };
  }

  return {
    level,
    title: "ยังไม่แนะนำให้เที่ยวกลางแจ้ง",
    detail: `${reasons.slice(0, 2).join(" · ")} — เลื่อนกิจกรรม outdoor หรือเลือกสถานที่ในร่ม`,
    icon: CloudLightning,
  };
});
</script>

<template>
  <section class="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
    <div
      class="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-4 py-2.5"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <CloudSun class="h-4 w-4" />
        </span>
        <div class="min-w-0">
          <p class="font-display text-[12.5px] leading-tight">สภาพอากาศวันนี้</p>
          <p class="truncate text-[10px] leading-tight text-muted-foreground">
            {{ data?.place || label }}
          </p>
        </div>
      </div>
      <span class="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
        WeatherAPI
      </span>
    </div>

    <!-- loading -->
    <div v-if="pending" class="flex items-center gap-3 px-4 py-3.5">
      <div class="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
      <div class="flex-1 space-y-2">
        <div class="h-3 w-24 animate-pulse rounded-full bg-muted" />
        <div class="h-2.5 w-40 animate-pulse rounded-full bg-muted" />
      </div>
    </div>

    <!-- error / not configured -->
    <p v-else-if="error" class="px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
      <template v-if="setupMissing">
        ยังไม่ได้ตั้งค่าคีย์สภาพอากาศ — ตั้ง
        <code class="text-primary">NUXT_WEATHER_API_KEY</code> เพื่อเปิดใช้พยากรณ์อากาศ
      </template>
      <template v-else>โหลดสภาพอากาศไม่สำเร็จ · {{ errorMessage }}</template>
    </p>

    <div v-else-if="data" class="px-4 py-3.5">
      <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div class="flex items-center gap-2.5">
          <span
            class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary"
          >
            <component
              :is="weatherIcon(data.current.code, data.current.isDay)"
              class="h-6 w-6"
            />
          </span>
          <div>
            <p class="font-display text-3xl leading-none">
              {{ data.current.tempC }}<span class="align-top text-sm text-muted-foreground">°C</span>
            </p>
            <p class="mt-1 text-[11px] leading-tight text-muted-foreground">
              {{ data.current.condition }}
            </p>
          </div>
        </div>

        <dl class="grid grow grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:grid-cols-4">
          <div class="flex items-center gap-1.5">
            <Thermometer class="h-3.5 w-3.5 shrink-0 text-primary" />
            <dt class="text-muted-foreground">รู้สึกเหมือน</dt>
            <dd class="font-medium">{{ data.current.feelsLikeC }}°</dd>
          </div>
          <div class="flex items-center gap-1.5">
            <Umbrella class="h-3.5 w-3.5 shrink-0 text-primary" />
            <dt class="text-muted-foreground">โอกาสฝน</dt>
            <dd class="font-medium">{{ data.current.chanceOfRain }}%</dd>
          </div>
          <div class="flex items-center gap-1.5">
            <Droplets class="h-3.5 w-3.5 shrink-0 text-primary" />
            <dt class="text-muted-foreground">ความชื้น</dt>
            <dd class="font-medium">{{ data.current.humidity }}%</dd>
          </div>
          <div class="flex items-center gap-1.5">
            <Wind class="h-3.5 w-3.5 shrink-0 text-primary" />
            <dt class="text-muted-foreground">ลม</dt>
            <dd class="font-medium">{{ data.current.windKph }} กม./ชม.</dd>
          </div>
        </dl>

        <span
          v-if="data.current.uv > 0"
          class="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] text-secondary-foreground"
        >
          <Sun class="h-3 w-3 text-gold" /> UV {{ data.current.uv }}
        </span>
      </div>

      <div
        v-if="tripAdvice"
        class="mt-3 flex items-start gap-2 rounded-2xl border px-3 py-2"
        :class="{
          'border-primary/25 bg-primary/5': tripAdvice.level === 0,
          'border-gold/40 bg-gold/10': tripAdvice.level === 1,
          'border-destructive/30 bg-destructive/5': tripAdvice.level === 2,
        }"
      >
        <component
          :is="tripAdvice.icon"
          class="mt-0.5 h-4 w-4 shrink-0"
          :class="{
            'text-primary': tripAdvice.level === 0,
            'text-gold': tripAdvice.level === 1,
            'text-destructive': tripAdvice.level === 2,
          }"
        />
        <div class="min-w-0">
          <p class="text-[11.5px] font-medium leading-tight">{{ tripAdvice.title }}</p>
          <p class="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
            {{ tripAdvice.detail }}
          </p>
        </div>
      </div>

      <div class="mt-3 flex items-stretch gap-2 border-t border-border/70 pt-3">
        <div
          v-for="(day, index) in data.days"
          :key="day.date"
          class="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-muted/50 px-2.5 py-1.5"
        >
          <component
            :is="weatherIcon(day.code, true)"
            class="h-5 w-5 shrink-0 text-primary"
            :aria-label="day.condition"
          />
          <div class="min-w-0">
            <p class="truncate text-[10px] leading-tight text-muted-foreground">
              {{ dayLabel(day.date, index) }}
            </p>
            <p class="text-[11px] font-medium leading-tight">
              {{ day.max }}°
              <span class="font-normal text-muted-foreground">/ {{ day.min }}°</span>
            </p>
          </div>
        </div>
      </div>

      <p class="mt-2 text-[10px] text-muted-foreground">
        อัปเดต {{ updatedLabel }} น. · ข้อมูลจาก
        <a
          href="https://www.weatherapi.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:underline"
          >WeatherAPI.com</a
        >
      </p>
    </div>
  </section>
</template>
