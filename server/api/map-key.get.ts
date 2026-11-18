// The Longdo Map browser SDK needs the key in the page, so it is handed to our
// own origin instead of being baked into the client bundle. Restrict the key to
// your domains in the Longdo console as well.
export default defineEventHandler((event) => {
  const fetchSite = getRequestHeader(event, "sec-fetch-site");

  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw createError({ statusCode: 403, message: "ไม่อนุญาตให้ดึงคีย์แผนที่จากโดเมนอื่น" });
  }

  const config = useRuntimeConfig(event);

  setHeader(event, "cache-control", "private, max-age=300");

  return { key: String(config.longdoKey ?? "").trim() };
});
