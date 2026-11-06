import { BedDouble, Coffee, Fuel, Store, UtensilsCrossed } from "@lucide/vue";
import type { Component } from "vue";
import type { CategoryId } from "./categories";

export const CATEGORY_ICONS: Record<CategoryId, Component> = {
  stay: BedDouble,
  convenience: Store,
  cafe: Coffee,
  restaurant: UtensilsCrossed,
  fuel: Fuel,
};
