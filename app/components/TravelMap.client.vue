<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import L from "leaflet";
import { CENTER, PLACES, nearbyStays, type Pt } from "~/lib/places";
import { BOUNDARY } from "~/lib/boundary";

const props = defineProps<{
  focus: Pt | null;
  me: Pt | null;
  pins: Pt[];
  selected: string | null;
}>();

const emit = defineEmits<{ "add-pin": [point: Pt] }>();

const el = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let dyn: L.LayerGroup | null = null;
let sel: L.LayerGroup | null = null;

const icon = (cls: string, label: string) =>
  L.divIcon({
    className: "",
    html: `<div class="map-pin ${cls}"><span>${label}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });

// Keep the marker low enough on screen that its popup clears the floating toolbar.
const flyTo = (m: L.Map, latlng: [number, number], z: number) => {
  const off = Math.max(60, 500 - m.getSize().y / 2);
  const p = m.project(latlng, z).add([0, -off]);
  m.flyTo(m.unproject(p, z), z, { duration: 0.8 });
};

onMounted(async () => {
  await nextTick();
  if (!el.value) return;
  try {
  const outline = L.polygon(BOUNDARY);
  const bounds = outline.getBounds();
  const m = L.map(el.value, {
    zoomControl: true,
    // Let the wheel scroll the page between sections instead of zooming the map.
    scrollWheelZoom: false,
    maxBounds: bounds.pad(0.25),
    maxBoundsViscosity: 1,
  }).setView(CENTER, 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 18,
  }).addTo(m);
  // Mask everything outside the province
  const world: [number, number][] = [
    [-89, -179],
    [-89, 179],
    [89, 179],
    [89, -179],
  ];
  L.polygon([world, ...BOUNDARY], {
    stroke: false,
    fillColor: "#f3e6dc",
    fillOpacity: 0.92,
    interactive: false,
  }).addTo(m);
  L.polygon(BOUNDARY, { color: "#c2566f", weight: 3, fill: false, interactive: false }).addTo(m);
  m.fitBounds(bounds, { padding: [10, 10] });
  m.setMinZoom(m.getZoom());
  m.on("click", (e) => emit("add-pin", { lat: e.latlng.lat, lng: e.latlng.lng }));
  dyn = L.layerGroup().addTo(m);
  sel = L.layerGroup().addTo(m);
  map = m;
  setTimeout(() => m.invalidateSize(), 200);
  } catch (err) {
    console.error("[map] init failed", err);
  }
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  dyn = null;
  sel = null;
});

watch(
  [() => props.pins, () => props.me],
  () => {
    const group = dyn;
    if (!group) return;
    group.clearLayers();
    props.pins.forEach((point, index) =>
      L.marker([point.lat, point.lng], { icon: icon("pin-user pin-drop", String(index + 1)) })
        .addTo(group)
        .bindPopup(`หมุดของฉัน #${index + 1}`),
    );
    if (props.me) {
      L.circleMarker([props.me.lat, props.me.lng], {
        radius: 9,
        color: "#fff",
        weight: 3,
        fillColor: "#e0506e",
        fillOpacity: 1,
      })
        .addTo(group)
        .bindPopup("ตำแหน่งของคุณ");
    }
  },
  { deep: true },
);

watch(
  () => props.selected,
  () => {
    const group = sel;
    const m = map;
    if (!group || !m) return;
    group.clearLayers();
    const place = PLACES.find((item) => item.id === props.selected);
    if (!place) return;
    nearbyStays(place, 4).forEach((stay) =>
      L.marker([stay.lat, stay.lng], { icon: icon("pin-stay pin-drop", "⌂") })
        .addTo(group)
        .bindPopup(
          `<b>${stay.name}</b><br/>${stay.type} · ฿${stay.price.toLocaleString()}/คืน · ${stay.km.toFixed(1)} กม.`,
        ),
    );
    const marker = L.marker([place.lat, place.lng], {
      icon: icon("pin-place pin-drop", "★"),
      zIndexOffset: 1000,
    })
      .addTo(group)
      .bindPopup(
        `<div class="place-pop"><img src="${place.img}" alt="${place.name}" /><b>${place.name}</b><span>อ.${place.district}</span><p>${place.desc}</p></div>`,
        { maxWidth: 240, minWidth: 220 },
      );
    flyTo(m, [place.lat, place.lng], 13);
    m.once("moveend", () => marker.openPopup());
  },
);

watch(
  () => props.focus,
  (point) => {
    if (point && map) flyTo(map, [point.lat, point.lng], 13);
  },
);
</script>

<template>
  <div ref="el" class="h-full w-full" />
</template>
