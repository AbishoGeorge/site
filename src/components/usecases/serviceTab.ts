import { useSyncExternalStore } from 'react';
import type { Service } from '../../content/stories';

// Which service's stories the Use cases section shows. Links elsewhere on the page, such as the Services cards, can
// switch it before scrolling there.
let current: Service = 'accounts';
const listeners = new Set<() => void>();

export function showUseCases(service: Service) {
  current = service;
  listeners.forEach((listener) => listener());
}

export function useShownService() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    (): Service => 'accounts'
  );
}
