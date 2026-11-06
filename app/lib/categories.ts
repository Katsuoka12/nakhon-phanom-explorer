export type CategoryId = "stay" | "convenience" | "cafe" | "restaurant" | "fuel";

export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "stay",
    label: "ที่พักใกล้เคียง",
    short: "ที่พัก",
    description: "โรงแรม รีสอร์ท โฮมสเตย์ ริมโขง",
  },
  {
    id: "convenience",
    label: "ร้านสะดวกซื้อ",
    short: "สะดวกซื้อ",
    description: "7-Eleven, Lotus's go fresh และร้านท้องถิ่น",
  },
  {
    id: "cafe",
    label: "คาเฟ่",
    short: "คาเฟ่",
    description: "กาแฟ ที่นั่งชิล และวิวริมน้ำโขง",
  },
  {
    id: "restaurant",
    label: "ร้านอาหาร",
    short: "ร้านอาหาร",
    description: "อาหารอีสาน ปลาแม่โขง และของขึ้นชื่อ",
  },
  {
    id: "fuel",
    label: "ปั๊มน้ำมัน",
    short: "ปั๊มน้ำมัน",
    description: "ปตท. บางจาก เจ็ท และสถานีอื่น ๆ",
  },
];

export type NearbyPlace = {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  rating?: number;
  reviews?: number;
  openNow?: boolean;
  mapsUrl?: string;
  category: CategoryId;
  sample?: boolean;
};

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && CATEGORIES.some((category) => category.id === value);
}
