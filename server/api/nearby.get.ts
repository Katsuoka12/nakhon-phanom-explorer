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

const TYPES: Record<CategoryId, { includedType: string; radius: number }> = {
  stay: { includedType: "lodging", radius: 8000 },
  convenience: { includedType: "convenience_store", radius: 4000 },
  cafe: { includedType: "cafe", radius: 4000 },
  restaurant: { includedType: "restaurant", radius: 4000 },
  fuel: { includedType: "gas_station", radius: 10000 },
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
  const apiKey = String(config.googlePlacesKey ?? "").trim();

  if (!apiKey) {
    return { source: "sample", places: samplePlaces(type, lat, lng) };
  }

  const { includedType, radius } = TYPES[type];

  try {
    const response = await $fetch<{ places?: GooglePlace[] }>(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
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

    const places = (response.places ?? []).map((place, index) => ({
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

    return { source: "google", places };
  } catch (cause) {
    const reason =
      (cause as { data?: { error?: { message?: string } } })?.data?.error?.message ??
      (cause instanceof Error ? cause.message : "เรียก Google Places API ไม่สำเร็จ");

    throw createError({ statusCode: 502, statusMessage: reason });
  }
});
