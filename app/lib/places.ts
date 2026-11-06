import hero from "~/assets/hero-thatphanom.jpg";
import naga from "~/assets/place-naga.jpg";
import clock from "~/assets/place-clock.jpg";
import okat from "~/assets/place-okat.jpg";
import stupa from "~/assets/place-stupa.jpg";
import phulangka from "~/assets/place-phulangka.jpg";

export type Pt = { lat: number; lng: number };
export type Place = { id: string; name: string; district: string; lat: number; lng: number; desc: string; img: string };
export type Stay = { id: string; name: string; lat: number; lng: number; price: number; type: string };

export const CENTER: [number, number] = [17.4, 104.4];

export const PLACES: Place[] = [
  { id: "thatphanom", name: "วัดพระธาตุพนมวรมหาวิหาร", district: "ธาตุพนม", lat: 16.9423, lng: 104.724, desc: "พระธาตุคู่บ้านคู่เมือง ศักดิ์สิทธิ์ที่สุดแห่งลุ่มน้ำโขง", img: hero },
  { id: "naga", name: "พญาศรีสัตตนาคราช", district: "เมืองนครพนม", lat: 17.4097, lng: 104.784, desc: "รูปปั้นพญานาค 7 เศียร ริมฝั่งโขง แลนด์มาร์กของเมือง", img: naga },
  { id: "clock", name: "หอนาฬิกาเวียดนามอนุสรณ์", district: "เมืองนครพนม", lat: 17.4086, lng: 104.7811, desc: "หอนาฬิกาประวัติศาสตร์ สัญลักษณ์มิตรภาพไทย–เวียดนาม", img: clock },
  { id: "uncleho", name: "บ้านโฮจิมินห์ บ้านนาจอก", district: "เมืองนครพนม", lat: 17.3846, lng: 104.7547, desc: "หมู่บ้านมิตรภาพไทย–เวียดนาม และบ้านพักลุงโฮ", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Ho_Chi_Minh_%40NakhonPhanom-Gate.jpg/500px-Ho_Chi_Minh_%40NakhonPhanom-Gate.jpg' },
  { id: "okat", name: "วัดโอกาสศรีบัวบาน", district: "เมืองนครพนม", lat: 17.411, lng: 104.783, desc: "ประดิษฐานพระติ้วพระเทียม พระพุทธรูปคู่เมือง", img: okat },
  { id: "bridge", name: "สะพานมิตรภาพไทย–ลาว 3", district: "เมืองนครพนม", lat: 17.452, lng: 104.756, desc: "จุดชมวิวแม่น้ำโขงและฝั่งท่าแขก สปป.ลาว", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Third_Thai%E2%80%93Lao_Friendship_Bridge_access.jpg/500px-Third_Thai%E2%80%93Lao_Friendship_Bridge_access.jpg' },
  { id: "renu", name: "วัดพระธาตุเรณู", district: "เรณูนคร", lat: 17.042, lng: 104.683, desc: "พระธาตุจำลององค์เดิม และวัฒนธรรมผู้ไทเรณู", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%95%E0%B8%B8%E0%B9%80%E0%B8%A3%E0%B8%93%E0%B8%B9002.jpg/500px-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%95%E0%B8%B8%E0%B9%80%E0%B8%A3%E0%B8%93%E0%B8%B9002.jpg' },
  { id: "maruk", name: "พระธาตุมรุกขนคร", district: "ธาตุพนม", lat: 16.98, lng: 104.728, desc: "หนึ่งในพระธาตุประจำวันเกิดของนครพนม", img: stupa },
  { id: "thauthen", name: "พระธาตุท่าอุเทน", district: "ท่าอุเทน", lat: 17.565, lng: 104.602, desc: "พระธาตุทรงสูงสง่า ริมฝั่งแม่น้ำโขง", img: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Phra_That_Tha_Uthen.jpg' },
  { id: "sikhun", name: "พระธาตุศรีคุณ", district: "นาแก", lat: 16.954, lng: 104.511, desc: "พระธาตุเก่าแก่ประจำอำเภอนาแก", img: stupa },
  { id: "phulangka", name: "อุทยานแห่งชาติภูลังกา", district: "บ้านแพง", lat: 17.975, lng: 104.13, desc: "ป่าเขา น้ำตก และจุดชมทะเลหมอก", img: phulangka },
];

export const STAYS: Stay[] = [
  { id: "s1", name: "โรงแรมริมโขง ซิตี้", lat: 17.405, lng: 104.785, price: 900, type: "โรงแรม" },
  { id: "s2", name: "นาคา ริเวอร์ไซด์ โฮสเทล", lat: 17.412, lng: 104.782, price: 450, type: "โฮสเทล" },
  { id: "s3", name: "ทิวโขง บูทีค รีสอร์ท", lat: 17.395, lng: 104.79, price: 1600, type: "รีสอร์ท" },
  { id: "s4", name: "บ้านนาจอก โฮมสเตย์", lat: 17.386, lng: 104.752, price: 500, type: "โฮมสเตย์" },
  { id: "s5", name: "ธาตุพนม เพลส", lat: 16.944, lng: 104.721, price: 700, type: "โรงแรม" },
  { id: "s6", name: "เรือนพนม รีสอร์ท", lat: 16.938, lng: 104.73, price: 1200, type: "รีสอร์ท" },
  { id: "s7", name: "ผู้ไทเรณู โฮมสเตย์", lat: 17.045, lng: 104.68, price: 400, type: "โฮมสเตย์" },
  { id: "s8", name: "ท่าอุเทน ริเวอร์วิว", lat: 17.568, lng: 104.6, price: 650, type: "รีสอร์ท" },
  { id: "s9", name: "นาแก การ์เด้น โฮม", lat: 16.958, lng: 104.515, price: 550, type: "บ้านพัก" },
  { id: "s10", name: "ภูลังกา แคมป์ แอนด์ ลอดจ์", lat: 17.97, lng: 104.14, price: 800, type: "ลอดจ์" },
];

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearbyStays(p: { lat: number; lng: number }, n = 4) {
  return STAYS.map((s) => ({ ...s, km: distanceKm(p, s) })).sort((a, b) => a.km - b.km).slice(0, n);
}
