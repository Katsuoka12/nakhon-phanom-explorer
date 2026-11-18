export type LongdoLatLng = { lat: number; lon: number };

export type LongdoIcon = { html: string; offset?: { x: number; y: number } };

export type LongdoMarkerOptions = {
  icon?: LongdoIcon;
  title?: string;
  detail?: string;
  clickable?: boolean;
};

export type LongdoMarker = {
  pop: (mode?: boolean) => unknown;
  location: (value?: LongdoLatLng) => unknown;
  /** Custom property Longdo keeps across map operations. */
  _placeId?: string;
};

export type LongdoMapInstance = {
  Event: {
    bind: (name: string, handler: (payload?: unknown) => void) => void;
    unbind: (name: string, handler: (payload?: unknown) => void) => void;
  };
  Overlays: {
    add: (overlay: unknown) => unknown;
    remove: (overlay: unknown) => unknown;
    clear: () => unknown;
  };
  Ui: Record<string, unknown>;
  Renderer?: {
    remove?: () => void;
    fitBounds?: (
      bounds: [[number, number], [number, number]],
      options?: Record<string, unknown>,
    ) => void;
  };
  location: (value?: LongdoLatLng, animate?: boolean) => unknown;
  zoom: (value?: number, animate?: boolean) => unknown;
  move: (offset: { x: number; y: number }, animate?: boolean) => unknown;
  pitch: (angle: number) => unknown;
  rotate: (angle: number, animate?: boolean) => unknown;
  resize: () => void;
};

export type LongdoNamespace = {
  Map: new (options: Record<string, unknown>) => LongdoMapInstance;
  Marker: new (location: LongdoLatLng, options?: LongdoMarkerOptions) => LongdoMarker;
  UiComponent: Record<string, unknown>;
};

declare global {
  interface Window {
    longdo?: LongdoNamespace;
  }
}

const SCRIPT_ID = "longdo-map-api";
let pending: Promise<LongdoNamespace> | null = null;

/**
 * Loads the Longdo Map v3 JS API once. The key is fetched from our own server
 * route, so it never lives in the client bundle.
 */
export function loadLongdoMap(key: string): Promise<LongdoNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Longdo Map ใช้ได้เฉพาะฝั่งเบราว์เซอร์"));
  }

  if (window.longdo) return Promise.resolve(window.longdo);
  if (!key) return Promise.reject(new Error("ยังไม่ได้ตั้งค่า NUXT_LONGDO_KEY"));

  if (!pending) {
    pending = new Promise<LongdoNamespace>((resolve, reject) => {
      document.getElementById(SCRIPT_ID)?.remove();

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://api.longdo.com/map3/?key=${encodeURIComponent(key)}`;
      script.onload = () => {
        if (window.longdo) resolve(window.longdo);
        else reject(new Error("Longdo Map API ไม่พร้อมใช้งาน"));
      };
      script.onerror = () => reject(new Error("โหลด Longdo Map API ไม่สำเร็จ"));
      document.head.appendChild(script);
    }).catch((cause: unknown) => {
      pending = null;
      throw cause;
    });
  }

  return pending;
}
