<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Box } from "@lucide/vue";
import type { NearbyPlace } from "~/lib/categories";
import {
  loadLongdoMap,
  type LongdoMapInstance,
  type LongdoMarker,
  type LongdoNamespace,
} from "~/lib/longdo";

const props = defineProps<{
  center: { label: string; lat: number; lng: number };
  places: NearbyPlace[];
  selected?: string | null;
}>();

const emit = defineEmits<{ select: [id: string] }>();

const TILT = 55;
const BEARING = -20;
const ZOOM = 16.6;
const FOCUS_ZOOM = 17.6;

const holder = ref<HTMLDivElement | null>(null);
const status = ref<"loading" | "ready" | "error">("loading");
const message = ref("");
const tilted = ref(true);

let api: LongdoNamespace | null = null;
let map: LongdoMapInstance | null = null;
let markers = new Map<string, LongdoMarker>();
let observer: ResizeObserver | null = null;
let disposed = false;
let popupTimer: ReturnType<typeof setTimeout> | null = null;

const centerIcon = computed(() => ({
  html: `<div style="width:30px;height:30px;border-radius:9999px;background:var(--foreground);border:3px solid var(--card);box-shadow:0 6px 16px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><div style="width:10px;height:10px;border-radius:9999px;background:var(--gold)"></div></div>`,
  offset: { x: 0, y: 0 },
}));

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function dotIcon(label: string, name: string, active: boolean) {
  if (active) {
    return {
      html: `<div class="ld-pin ld-pin--active"><span class="ld-pin__label">${escapeHtml(
        name,
      )}</span><span class="ld-pin__ring"></span><span class="ld-pin__dot">${label}</span></div>`,
      offset: { x: 0, y: 0 },
    };
  }

  return {
    html: `<div style="width:24px;height:24px;border-radius:9999px;background:var(--primary);color:var(--primary-foreground);border:2px solid var(--card);display:flex;align-items:center;justify-content:center;font:600 10px/1 var(--font-sans);box-shadow:0 4px 12px rgba(0,0,0,.24)">${label}</div>`,
    offset: { x: 0, y: 0 },
  };
}

function renderMarkers() {
  if (!map || !api) return;

  map.Overlays.clear();
  markers = new Map();

  map.Overlays.add(
    new api.Marker(
      { lat: props.center.lat, lon: props.center.lng },
      { icon: centerIcon.value, title: `จุดอ้างอิง: ${props.center.label}` },
    ),
  );

  props.places.forEach((place, index) => {
    const number = index + 1;
    const selected = place.id === props.selected;
    const marker = new api!.Marker(
      { lat: place.lat, lon: place.lng },
      {
        icon: dotIcon(String(number), place.name, selected),
        title: `หมุด ${number}: ${place.name}`,
        detail: `<div style="font-family:var(--font-sans);max-width:230px;line-height:1.5">${
          selected
            ? `<span style="display:inline-block;margin-bottom:4px;padding:1px 7px;border-radius:9999px;background:var(--primary);color:var(--primary-foreground);font-size:9.5px;font-weight:600">หมุด ${number}</span><br>`
            : `<span style="font-size:9.5px;font-weight:600;color:var(--primary)">หมุด ${number}</span><br>`
        }<strong style="font-family:var(--font-display);font-size:13px;color:var(--foreground)">${escapeHtml(
          place.name,
        )}</strong><br><span style="font-size:11px;color:var(--muted-foreground)">${escapeHtml(
          place.address || "ไม่ระบุที่อยู่",
        )}</span></div>`,
        clickable: true,
      },
    );

    marker._placeId = place.id;
    map!.Overlays.add(marker);
    markers.set(place.id, marker);
  });
}

function fitToPlaces(animate = false) {
  if (!map) return;

  const points = [
    { lat: props.center.lat, lng: props.center.lng },
    ...props.places.map((place) => ({ lat: place.lat, lng: place.lng })),
  ];

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const south = Math.min(...lats);
  const north = Math.max(...lats);
  const west = Math.min(...lngs);
  const east = Math.max(...lngs);
  const h = south < north && west < east ? (north - south) : 0.0001;
  const round = (v: number) => Math.round(v * 1e8) / 1e8;

  if (north - south < 0.0004 && east - west < 0.0004) {
    map.location({ lat: round(props.center.lat), lon: round(props.center.lng) }, animate);
    map.zoom(animate ? 14.5 : ZOOM, animate);
    return;
  }

  // 1) fitBounds gives a good first frame; 2) snap+move removes the ~px
  //    float that fitBounds sometimes leaves.
  map.Renderer?.fitBounds?.([
    [round(west), round(south)],
    [round(east), round(north)],
  ], { padding: 42, maxZoom: 17, duration: animate ? 700 : 0 });

  const cx = (west + east) / 2;
  const cy = (south + north) / 2;
  map.location({ lat: round(cy), lon: round(cx) }, false);
  map.zoom(animate ? 17 : 17, false);
  map.move?.({ x: 0, y: 24 }, true);
}

function trimUi() {
  const ui = map?.Ui as Record<string, { visible?: (state: boolean) => void } | undefined> | undefined;
  if (!ui) return;

  for (const name of ["LayerSelector", "Toolbar", "Crosshair", "Terrain", "DPad"]) {
    ui[name]?.visible?.(false);
  }
}

function applyTilt(next: boolean) {
  tilted.value = next;
  map?.pitch(next ? TILT : 0);
  map?.rotate(next ? BEARING : 0);
}

function focusPlace(id: string | null) {
  if (!map || !id) return;

  const place = props.places.find((item) => item.id === id);
  if (!place) return;

  // 1) snap to the place first (drops any residual float from the previous frame)
  map.location({ lat: place.lat, lon: place.lng }, false);
  map.zoom(FOCUS_ZOOM, false);

  // 2) push the camera a hair so the pin's label (which floats above the dot)
  //    never clips against the top or bottom of the viewport
  const px = 32;
  map.move?.({ x: 0, y: px }, true);

  if (popupTimer) clearTimeout(popupTimer);
  popupTimer = setTimeout(() => markers.get(id)?.pop(true), 620);
}

onMounted(async () => {
  try {
    const { key } = await $fetch<{ key: string }>("/api/map-key");

    if (!key) {
      status.value = "error";
      message.value = "ยังไม่ได้ตั้งค่า NUXT_LONGDO_KEY จึงยังแสดงแผนที่ไม่ได้";
      return;
    }

    api = await loadLongdoMap(key);
    if (disposed || !holder.value) return;

    map = new api.Map({
      placeholder: holder.value,
      location: { lat: props.center.lat, lon: props.center.lng },
      zoom: ZOOM,
      pitch: TILT,
      bearing: BEARING,
      lastView: false,
      language: "th",
      sky: true,
      ui: api.UiComponent.Mobile,
    });

    map.Event.bind("ready", () => {
      if (disposed) return;
      status.value = "ready";
      map?.pitch(TILT);
      map?.rotate(BEARING);
      trimUi();
      renderMarkers();
      fitToPlaces();
      focusPlace(props.selected ?? null);
    });

    map.Event.bind("overlayClick", (overlay) => {
      const id = (overlay as { _placeId?: string } | undefined)?._placeId;
      if (id) emit("select", id);
    });

    observer = new ResizeObserver(() => map?.resize());
    observer.observe(holder.value);
  } catch (cause) {
    status.value = "error";
    message.value = cause instanceof Error ? cause.message : "โหลดแผนที่ไม่สำเร็จ";
  }
});

watch(
  () => props.center,
  (value) => {
    map?.location({ lat: value.lat, lon: value.lng }, true);
    map?.zoom(ZOOM, true);
  },
  { deep: true },
);

watch(
  () => props.places,
  () => {
    if (status.value !== "ready") return;
    renderMarkers();
    fitToPlaces(true);
  },
  { deep: true },
);

watch(
  () => props.selected,
  (id) => {
    if (status.value !== "ready") return;
    renderMarkers();
    if (id) focusPlace(id);
    else fitToPlaces(true);
  },
);

onBeforeUnmount(() => {
  disposed = true;
  if (popupTimer) clearTimeout(popupTimer);
  observer?.disconnect();
  map?.Renderer?.remove?.();
  map = null;
});
</script>

<template>
  <div class="relative h-full w-full">
    <div ref="holder" class="longdo-holder h-full w-full" />

    <div
      v-if="status !== 'ready'"
      class="absolute inset-0 grid place-items-center bg-muted/85 px-6 text-center backdrop-blur-sm"
    >
      <div>
        <p v-if="status === 'loading'" class="text-[11px] text-muted-foreground">
          กำลังโหลดแผนที่ 3D…
        </p>
        <template v-else>
          <p class="font-display text-[13px]">แสดงแผนที่ไม่ได้</p>
          <p class="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">{{ message }}</p>
        </template>
      </div>
    </div>

    <button
      v-if="status === 'ready'"
      type="button"
      :aria-pressed="tilted"
      :title="tilted ? 'สลับเป็นมุมมองด้านบน (2D)' : 'สลับเป็นมุมมอง 3D'"
      class="absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-medium shadow-soft backdrop-blur transition"
      :class="
        tilted
          ? 'border-primary/40 bg-primary text-primary-foreground'
          : 'border-border/80 bg-card/90 text-muted-foreground hover:text-primary'
      "
      @click="applyTilt(!tilted)"
    >
      <Box class="h-3 w-3" /> 3D
    </button>
  </div>
</template>

<style scoped>
/* Keep the map chrome minimal: zoom + compass only, in the site's styling. */
.longdo-holder :deep(.maplibregl-ctrl:has(.maplibregl-ctrl-geolocate)),
.longdo-holder :deep(.maplibregl-ctrl:has(.maplibregl-ctrl-terrain)),
.longdo-holder :deep(.maplibregl-ctrl:has(.maplibregl-ctrl-fullscreen)) {
  display: none;
}

.longdo-holder :deep(.maplibregl-ctrl-group) {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  box-shadow: var(--shadow-soft);
}

.longdo-holder :deep(.maplibregl-ctrl-group button + button) {
  border-top-color: var(--border);
}

.longdo-holder :deep(.maplibregl-ctrl-attrib) {
  border-radius: 8px 0 0 0;
  font-size: 9.5px;
  background: color-mix(in oklab, var(--card) 84%, transparent);
}

.longdo-holder :deep(.maplibregl-ctrl-attrib a) {
  color: var(--primary);
}

/* The selected pin: bigger gold dot, pulsing halo and the place name above it. */
.longdo-holder :deep(.ld-pin) {
  position: relative;
  width: 34px;
  height: 34px;
}

.longdo-holder :deep(.ld-pin__dot) {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  border: 2.5px solid var(--card);
  border-radius: 9999px;
  background: var(--gold);
  color: var(--foreground);
  font: 700 12px/1 var(--font-sans);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.32);
}

.longdo-holder :deep(.ld-pin__ring) {
  position: absolute;
  inset: -8px;
  border: 2px solid color-mix(in oklab, var(--gold) 75%, transparent);
  border-radius: 9999px;
  animation: ld-pin-pulse 2s ease-out infinite;
}

.longdo-holder :deep(.ld-pin__label) {
  position: absolute;
  bottom: calc(100% + 7px);
  left: 50%;
  max-width: 190px;
  overflow: hidden;
  padding: 3px 9px;
  border-radius: 9999px;
  background: var(--foreground);
  color: var(--card);
  font: 600 10.5px/1.45 var(--font-sans);
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: translateX(-50%);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
}

@keyframes ld-pin-pulse {
  0% {
    opacity: 0.9;
    transform: scale(0.85);
  }
  70% {
    opacity: 0;
    transform: scale(1.18);
  }
  100% {
    opacity: 0;
    transform: scale(1.18);
  }
}

.longdo-holder :deep(.maplibregl-ctrl-scale) {
  border-color: color-mix(in oklab, var(--muted-foreground) 60%, transparent);
  border-radius: 6px;
  font-size: 9.5px;
  color: var(--muted-foreground);
  background: color-mix(in oklab, var(--card) 72%, transparent);
}
</style>
