import { createContext, useContext } from 'react';
import { USE_CASE_PATH } from './components/usecases/links';

/** Which page the address names: the home page, or a use case's own page at /use-cases/<id>/. */
export interface Route {
  path: string;
  useCase?: string;
  /** Moves to another page without a reload, replacing the current history entry. */
  go: (path: string) => void;
}

export function storyIdFromPath(path: string) {
  return USE_CASE_PATH.exec(path)?.[1];
}

const RouteContext = createContext<Route>({ path: '/', go: () => {} });
export const RouteProvider = RouteContext.Provider;
export const useRoute = () => useContext(RouteContext);
