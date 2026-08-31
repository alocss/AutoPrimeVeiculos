"use client";

import { useSyncExternalStore } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "autoprime:compare";
const MAX_COMPARE = 3;
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

function write(next: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cache = next;
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

export function toggleCompare(vehicleId: string) {
  const current = readFromStorage();
  if (current.includes(vehicleId)) {
    write(current.filter((id) => id !== vehicleId));
    return;
  }
  if (current.length >= MAX_COMPARE) {
    toast.error(`Você pode comparar até ${MAX_COMPARE} veículos. Remova um para adicionar outro.`);
    return;
  }
  write([...current, vehicleId]);
}

export function removeFromCompare(vehicleId: string) {
  write(readFromStorage().filter((id) => id !== vehicleId));
}

export function clearCompare() {
  write([]);
}

export function useCompare() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ids,
    isComparing: (vehicleId: string) => ids.includes(vehicleId),
    toggle: toggleCompare,
    remove: removeFromCompare,
    clear: clearCompare,
    count: ids.length,
    max: MAX_COMPARE,
  };
}
