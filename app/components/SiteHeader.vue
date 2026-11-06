<script setup lang="ts">
import { computed } from "vue";
import { MapPin, Mountain, Store } from "@lucide/vue";

const route = useRoute();
const isNearby = computed(() => route.path.startsWith("/nearby"));
</script>

<template>
  <header class="sticky top-0 z-[1000] border-b border-border/70 bg-background/80 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
      <NuxtLink to="/" class="group flex min-w-0 items-center gap-2 sm:gap-2.5">
        <span
          class="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft transition duration-300 group-hover:-rotate-6 sm:h-9 sm:w-9 sm:rounded-[14px]"
        >
          <Mountain class="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <span class="min-w-0 font-display text-lg leading-none tracking-tight sm:text-xl">
          <span class="block truncate">Tiew<span class="text-primary">Nakhon</span></span>
          <span
            class="mt-1 hidden font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground sm:block"
          >
            Nakhon Phanom
          </span>
        </span>
      </NuxtLink>

      <nav
        class="flex shrink-0 items-center gap-0.5 rounded-full border border-border/80 bg-card/70 p-1 text-sm shadow-soft"
      >
        <NuxtLink
          to="/#map"
          aria-label="แผนที่"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:px-3.5"
        >
          <MapPin class="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          <span class="hidden sm:inline">แผนที่</span>
        </NuxtLink>
        <NuxtLink
          to="/nearby"
          aria-label="ใกล้เคียง"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition sm:px-3.5"
          :class="
            isNearby
              ? 'bg-muted font-medium text-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          "
        >
          <Store class="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          <span class="hidden sm:inline">ใกล้เคียง</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
