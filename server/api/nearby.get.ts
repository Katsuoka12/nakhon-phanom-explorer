type CategoryId = "stay" | "convenience" | "cafe" | "restaurant" | "fuel";

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: { openNow?: boolean };
  googleMapsUri?: string;
};

type Sample = {
  name: string;
  address: string;
  rating: number;
  reviews: number;
  openNow: boolean;
};

type LongdoPlace = {
  id?: string;
  name?: string;
  lat?: number;
  lon?: number;
  address?: string;
  type?: string;
  obsoleted?: boolean;
};

const TYPES: Record<CategoryId, { includedType: string; radius: number }> = {
  stay: { includedType: "lodging", radius: 8000 },
  convenience: { includedType: "convenience_store", radius: 4000 },
  cafe: { includedType: "cafe", radius: 4000 },
  restaurant: { includedType: "restaurant", radius: 4000 },
  fuel: { includedType: "gas_station", radius: 10000 },
};

// Longdo Map uses its own POI tag names and takes the search radius as a span.
const LONGDO: Record<CategoryId, { tag: string; span: string }> = {
  stay: { tag: "hotel", span: "10km" },
  convenience: { tag: "convenience_store", span: "6km" },
  cafe: { tag: "coffee_shop", span: "8km" },
  restaurant: { tag: "restaurant", span: "8km" },
  fuel: { tag: "gas_station", span: "12km" },
};

const SAMPLES: Record<CategoryId, Sample[]> = {
  stay: [
    { name: "โรงแรมริมโขง ซิตี้", address: "ถ.สุนทรวิจิตร อ.เมืองนครพนม", rating: 4.3, reviews: 412, openNow: true },
    { name: "นาคา ริเวอร์ไซด์ โฮสเทล", address: "อ.เมืองนครพนม", rating: 4.6, reviews: 238, openNow: true },
    { name: "ทิวโขง บูทีค รีสอร์ท", address: "อ.เมืองนครพนม", rating: 4.5, reviews: 186, openNow: true },
    { name: "บ้านนาจอก โฮมสเตย์", address: "บ้านนาจอก อ.เมืองนครพนม", rating: 4.4, reviews: 97, openNow: true },
    { name: "ธาตุพนม เพลส", address: "อ.ธาตุพนม", rating: 4.2, reviews: 154, openNow: true },
    { name: "เรือนพนม รีสอร์ท", address: "อ.ธาตุพนม", rating: 4.4, reviews: 203, openNow: false },
    { name: "ผู้ไทเรณู โฮมสเตย์", address: "อ.เรณูนคร", rating: 4.7, reviews: 88, openNow: true },
    { name: "ท่าอุเทน ริเวอร์วิว", address: "อ.ท่าอุเทน", rating: 4.1, reviews: 132, openNow: true },
  ],
  convenience: [
    { name: "7-Eleven สาขาถนนสุนทรวิจิตร", address: "ถ.สุนทรวิจิตร อ.เมืองนครพนม", rating: 4.2, reviews: 311, openNow: true },
    { name: "7-Eleven สาขาหน้าพระธาตุพนม", address: "อ.ธาตุพนม", rating: 4.4, reviews: 189, openNow: true },
    { name: "Lotus's go fresh นครพนม", address: "ถ.นิตโย อ.เมืองนครพนม", rating: 4.1, reviews: 274, openNow: true },
    { name: "CJ More สาขาเมืองนครพนม", address: "อ.เมืองนครพนม", rating: 4.0, reviews: 96, openNow: true },
    { name: "7-Eleven สาขาท่าอุเทน", address: "อ.ท่าอุเทน", rating: 4.3, reviews: 74, openNow: true },
    { name: "7-Eleven สาขาเรณูนคร", address: "อ.เรณูนคร", rating: 4.2, reviews: 63, openNow: true },
    { name: "Lotus's go fresh ธาตุพนม", address: "อ.ธาตุพนม", rating: 4.2, reviews: 121, openNow: true },
    { name: "7-Eleven สาขาบ้านแพง", address: "อ.บ้านแพง", rating: 4.1, reviews: 48, openNow: false },
  ],
  cafe: [
    { name: "คาเฟ่ริมโขง", address: "ริมแม่น้ำโขง อ.เมืองนครพนม", rating: 4.6, reviews: 342, openNow: true },
    { name: "บ้านไม้ คอฟฟี่", address: "อ.เมืองนครพนม", rating: 4.5, reviews: 208, openNow: true },
    { name: "โขงโค้ง คาเฟ่", address: "อ.เมืองนครพนม", rating: 4.7, reviews: 156, openNow: true },
    { name: "เรือนร้อยปี คาเฟ่", address: "อ.ธาตุพนม", rating: 4.3, reviews: 97, openNow: true },
    { name: "ภูเขา คอฟฟี่", address: "อ.บ้านแพง", rating: 4.4, reviews: 61, openNow: false },
    { name: "นครพนม เอสเพรสโซ่", address: "ถ.สุนทรวิจิตร อ.เมืองนครพนม", rating: 4.2, reviews: 143, openNow: true },
    { name: "ดวงตะวัน คาเฟ่", address: "อ.เรณูนคร", rating: 4.5, reviews: 58, openNow: true },
    { name: "ริมน้ำ คอฟฟี่ เฮาส์", address: "อ.ท่าอุเทน", rating: 4.4, reviews: 79, openNow: true },
  ],
  restaurant: [
    { name: "ครัวริมโขง", address: "ริมแม่น้ำโขง อ.เมืองนครพนม", rating: 4.5, reviews: 512, openNow: true },
    { name: "ร้านเจริญสุข", address: "อ.เมืองนครพนม", rating: 4.3, reviews: 287, openNow: true },
    { name: "ข้าวเปียกนครพนม", address: "ถ.สุนทรวิจิตร อ.เมืองนครพนม", rating: 4.4, reviews: 194, openNow: true },
    { name: "ร้านอาหารผู้ไท", address: "อ.เรณูนคร", rating: 4.6, reviews: 132, openNow: true },
    { name: "ครัวพระธาตุ", address: "อ.ธาตุพนม", rating: 4.2, reviews: 221, openNow: true },
    { name: "ร้านแซ่บอีสาน", address: "อ.เมืองนครพนม", rating: 4.3, reviews: 176, openNow: true },
    { name: "ปลาแม่โขง ริมโขง", address: "อ.ท่าอุเทน", rating: 4.5, reviews: 108, openNow: false },
    { name: "ก๋วยเตี๋ยวเรือคุณแดง", address: "อ.นาแก", rating: 4.1, reviews: 67, openNow: true },
  ],
  fuel: [
    { name: "ปตท. สาขานครพนม", address: "ถ.นิตโย อ.เมืองนครพนม", rating: 4.2, reviews: 186, openNow: true },
    { name: "บางจาก สาขาธาตุพนม", address: "อ.ธาตุพนม", rating: 4.1, reviews: 92, openNow: true },
    { name: "ปตท. สาขาท่าอุเทน", address: "อ.ท่าอุเทน", rating: 4.0, reviews: 74, openNow: true },
    { name: "เจ็ท สาขานครพนม", address: "อ.เมืองนครพนม", rating: 4.3, reviews: 118, openNow: true },
    { name: "ปตท. สาขาเรณูนคร", address: "อ.เรณูนคร", rating: 4.1, reviews: 63, openNow: true },
    { name: "บางจาก สาขาบ้านแพง", address: "อ.บ้านแพง", rating: 4.2, reviews: 41, openNow: true },
    { name: "ปตท. สาขานาแก", address: "อ.นาแก", rating: 3.9, reviews: 58, openNow: true },
    { name: "คาลเท็กซ์ สาขาศรีสงคราม", address: "อ.ศรีสงคราม", rating: 4.0, reviews: 37, openNow: false },
  ],
};

function isCategory(value: unknown): value is CategoryId {
  return typeof value === "string" && value in TYPES;
}

function samplePlaces(type: CategoryId, lat: number, lng: number) {
  const items = SAMPLES[type];
  return items.map((item, index) => {
    const angle = (index * Math.PI * 2) / items.length + 0.35;
    const spread = 0.006 + (index % 4) * 0.005;
    return {
      id: `sample-${type}-${index}`,
      name: item.name,
      address: item.address,
      lat: Number((lat + Math.sin(angle) * spread).toFixed(5)),
      lng: Number((lng + Math.cos(angle) * spread).toFixed(5)),
      rating: item.rating,
      reviews: item.reviews,
      openNow: item.openNow,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${item.name} ${item.address}`,
      )}`,
      category: type,
      sample: true,
    };
  });
}

function errorMessage(cause: unknown) {
  const data = (cause as { data?: unknown })?.data;

  if (typeof data === "string" && data.trim()) return data.trim().slice(0, 180);

  if (data && typeof data === "object") {
    const payload = data as { error?: { message?: string }; message?: string };
    const message = payload.error?.message ?? payload.message;
    if (message) return message;
  }

  return cause instanceof Error ? cause.message : "ไม่ทราบสาเหตุ";
}

async function longdoPlaces(key: string, type: CategoryId, lat: number, lng: number) {
  const { tag, span } = LONGDO[type];

  const response = await $fetch<{ data?: LongdoPlace[] }>(
    "https://api.longdo.com/POIService/json/search",
    {
      query: { lon: lng, lat, span, tag, limit: 15, locale: "th", key },
      timeout: 12000,
    },
  );

  const seen = new Set<string>();

  return (response.data ?? [])
    .filter((place) => place.type === "poi" && !place.obsoleted)
    .filter((place) => typeof place.name === "string" && place.name.trim().length > 0)
    .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lon))
    .filter((place) => {
      const id = place.id ?? `${place.name}:${place.lat}:${place.lon}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((place, index) => ({
      id: place.id ?? `longdo-${type}-${index}`,
      name: place.name!.trim(),
      address: place.address ?? "",
      lat: place.lat!,
      lng: place.lon!,
      mapsUrl: `https://map.longdo.com/?lon=${place.lon}&lat=${place.lat}&zoom=17`,
      category: type,
    }));
}

async function googlePlaces(key: string, type: CategoryId, lat: number, lng: number) {
  const { includedType, radius } = TYPES[type];

  const response = await $fetch<{ places?: GooglePlace[] }>(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours.openNow,places.googleMapsUri",
      },
      body: {
        includedTypes: [includedType],
        maxResultCount: 15,
        rankPreference: "DISTANCE",
        languageCode: "th",
        regionCode: "TH",
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius,
          },
        },
      },
    },
  );

  return (response.places ?? []).map((place, index) => ({
    id: place.id ?? `${type}-${index}`,
    name: place.displayName?.text ?? "ไม่ทราบชื่อ",
    address: place.formattedAddress ?? "",
    lat: place.location?.latitude ?? lat,
    lng: place.location?.longitude ?? lng,
    rating: place.rating,
    reviews: place.userRatingCount,
    openNow: place.currentOpeningHours?.openNow,
    mapsUrl: place.googleMapsUri,
    category: type,
  }));
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const lat = Number(query.lat);
  const lng = Number(query.lng);
  const type = query.type;

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !isCategory(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: "ต้องระบุ lat, lng และหมวดหมู่ที่ถูกต้อง",
    });
  }

  const config = useRuntimeConfig(event);
  const longdoKey = String(config.longdoKey ?? "").trim();
  const googleKey = String(config.googlePlacesKey ?? "").trim();
  const failures: string[] = [];

  if (longdoKey) {
    try {
      const places = await longdoPlaces(longdoKey, type, lat, lng);
      return { source: "longdo" as const, places };
    } catch (cause) {
      failures.push(`Longdo Map: ${errorMessage(cause)}`);
    }
  }

  if (googleKey) {
    try {
      const places = await googlePlaces(googleKey, type, lat, lng);
      return { source: "google" as const, places };
    } catch (cause) {
      failures.push(`Google Places: ${errorMessage(cause)}`);
    }
  }

  if (failures.length) {
    throw createError({ statusCode: 502, statusMessage: failures.join(" · ") });
  }

  return { source: "sample" as const, places: samplePlaces(type, lat, lng) };
});
