// Weather for a single point, proxied through the server so the WeatherAPI key
// never reaches the browser bundle.
type ForecastDayRaw = {
  date?: string;
  day?: {
    maxtemp_c?: number;
    mintemp_c?: number;
    daily_chance_of_rain?: number;
    condition?: { text?: string; code?: number };
  };
  astro?: { sunrise?: string; sunset?: string };
};

type WeatherApiResponse = {
  location?: { name?: string; region?: string; localtime?: string };
  current?: {
    temp_c?: number;
    feelslike_c?: number;
    humidity?: number;
    wind_kph?: number;
    wind_dir?: string;
    precip_mm?: number;
    uv?: number;
    cloud?: number;
    is_day?: number;
    last_updated?: string;
    condition?: { text?: string; code?: number };
  };
  forecast?: { forecastday?: ForecastDayRaw[] };
  error?: { message?: string };
};

// WeatherAPI translates condition text to a fixed set of languages that does not
// include Thai, so the codes are labelled here instead.
const CONDITIONS: Record<number, string> = {
  1000: "ท้องฟ้าแจ่มใส",
  1003: "มีเมฆบางส่วน",
  1006: "มีเมฆมาก",
  1009: "ท้องฟ้าครึ้ม",
  1030: "หมอกบาง",
  1063: "ฝนตกเป็นหย่อม",
  1066: "หิมะตกเป็นหย่อม",
  1069: "ฝนน้ำแข็งเป็นหย่อม",
  1087: "อาจมีฟ้าคะนอง",
  1114: "หิมะปลิว",
  1135: "หมอกหนา",
  1147: "หมอกน้ำแข็ง",
  1150: "ฝนละอองเบาเป็นหย่อม",
  1153: "ฝนละอองเบา",
  1168: "ฝนละอองเยือกแข็ง",
  1180: "ฝนเบาเป็นหย่อม",
  1183: "ฝนเบา",
  1186: "ฝนปานกลางเป็นช่วง",
  1189: "ฝนปานกลาง",
  1192: "ฝนหนักเป็นช่วง",
  1195: "ฝนหนัก",
  1198: "ฝนเยือกแข็งเบา",
  1201: "ฝนเยือกแข็ง",
  1204: "ฝนน้ำแข็งเบา",
  1207: "ฝนน้ำแข็ง",
  1210: "หิมะเบาเป็นหย่อม",
  1213: "หิมะเบา",
  1216: "หิมะปานกลางเป็นหย่อม",
  1219: "หิมะปานกลาง",
  1222: "หิมะหนักเป็นหย่อม",
  1225: "หิมะหนัก",
  1237: "เม็ดน้ำแข็ง",
  1240: "ฝนตกปรอย ๆ",
  1243: "ฝนตกปานกลางถึงหนัก",
  1246: "ฝนตกหนักมาก",
  1249: "ฝนน้ำแข็งเบาเป็นหย่อม",
  1252: "ฝนน้ำแข็งปานกลางถึงหนัก",
  1255: "หิมะตกเบา",
  1258: "หิมะตกปานกลางถึงหนัก",
  1261: "ฝนฟ้าคะนองเบาเป็นหย่อม",
  1264: "ฝนฟ้าคะนองปานกลางถึงหนัก",
  1273: "ฝนฟ้าคะนองเป็นหย่อม",
  1276: "ฝนฟ้าคะนอง",
  1279: "หิมะพร้อมฟ้าคะนองเป็นหย่อม",
  1282: "หิมะพร้อมฟ้าคะนอง",
};

function conditionThai(code: number | undefined, fallback: string | undefined) {
  return (code !== undefined ? CONDITIONS[code] : undefined) ?? fallback ?? "ไม่ทราบสภาพอากาศ";
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; data: WeatherSummary }>();

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

function errorMessage(cause: unknown) {
  const data = (cause as { data?: unknown })?.data;

  if (data && typeof data === "object") {
    const payload = data as WeatherApiResponse;
    if (payload.error?.message) return payload.error.message;
  }

  if (typeof data === "string" && data.trim()) return data.trim().slice(0, 180);

  return cause instanceof Error ? cause.message : "ไม่ทราบสาเหตุ";
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const lat = Number(query.lat);
  const lng = Number(query.lng);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "ต้องระบุ lat และ lng ที่ถูกต้อง",
    });
  }

  const config = useRuntimeConfig(event);
  const key = String(config.weatherApiKey ?? "").trim();

  if (!key) {
    throw createError({
      statusCode: 503,
      statusMessage: "ยังไม่ได้ตั้งค่าคีย์ WeatherAPI (NUXT_WEATHER_API_KEY)",
    });
  }

  // WeatherAPI resolves the nearest station for the point, so 2 decimals is
  // plenty of precision and keeps the cache warm between nearby points.
  const q = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = cache.get(q);

  setHeader(event, "cache-control", "private, max-age=600");

  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  let payload: WeatherApiResponse;

  try {
    payload = await $fetch<WeatherApiResponse>("https://api.weatherapi.com/v1/forecast.json", {
      query: { key, q, days: 3, aqi: "no", alerts: "no" },
      timeout: 12000,
    });
  } catch (cause) {
    throw createError({
      statusCode: 502,
      statusMessage: `WeatherAPI: ${errorMessage(cause)}`,
    });
  }

  if (payload.error?.message) {
    throw createError({ statusCode: 502, statusMessage: `WeatherAPI: ${payload.error.message}` });
  }

  const current = payload.current;

  if (!current || typeof current.temp_c !== "number") {
    throw createError({ statusCode: 502, statusMessage: "WeatherAPI ไม่ได้ส่งข้อมูลอากาศกลับมา" });
  }

  const days = (payload.forecast?.forecastday ?? [])
    .filter((day) => typeof day.date === "string" && day.day)
    .map((day) => ({
      date: day.date!,
      max: Math.round(day.day!.maxtemp_c ?? 0),
      min: Math.round(day.day!.mintemp_c ?? 0),
      chanceOfRain: Math.round(day.day!.daily_chance_of_rain ?? 0),
      condition: conditionThai(day.day!.condition?.code, day.day!.condition?.text),
      code: day.day!.condition?.code ?? 113,
      sunrise: day.astro?.sunrise ?? "",
      sunset: day.astro?.sunset ?? "",
    }));

  const summary: WeatherSummary = {
    source: "weatherapi",
    place: [payload.location?.name, payload.location?.region].filter(Boolean).join(" · "),
    localtime: payload.location?.localtime ?? "",
    updatedAt: current.last_updated ?? "",
    current: {
      tempC: Math.round(current.temp_c),
      feelsLikeC: Math.round(current.feelslike_c ?? current.temp_c),
      condition: conditionThai(current.condition?.code, current.condition?.text),
      code: current.condition?.code ?? 113,
      isDay: current.is_day !== 0,
      humidity: Math.round(current.humidity ?? 0),
      windKph: Math.round(current.wind_kph ?? 0),
      windDir: current.wind_dir ?? "",
      precipMm: Number((current.precip_mm ?? 0).toFixed(1)),
      uv: Number((current.uv ?? 0).toFixed(1)),
      cloud: Math.round(current.cloud ?? 0),
      chanceOfRain: days[0]?.chanceOfRain ?? 0,
    },
    days,
  };

  cache.set(q, { at: Date.now(), data: summary });

  return summary;
});
