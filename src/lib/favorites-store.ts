"use client";

import { useSyncExternalStore } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "autoprime:favorites";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function emitChange() {
  cache = readFromStorage();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

function getServerSnapshot(): string[] {
  return [];
}

export function toggleFavorite(vehicleId: string) {
  const current = readFromStorage();
  const wasFavorite = current.includes(vehicleId);
  const next = wasFavorite ? current.filter((id) => id !== vehicleId) : [...current, vehicleId];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitChange();
  toast.success(wasFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ids,
    isFavorite: (vehicleId: string) => ids.includes(vehicleId),
    toggle: toggleFavorite,
    count: ids.length,
  };
}
