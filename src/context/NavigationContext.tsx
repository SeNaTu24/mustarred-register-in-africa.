import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppRoute } from '../types';

interface NavigationContextValue {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/cac-registration',
  '/dcmi',
  '/trademarks',
  '/licences',
  '/talk-to-us',
];

function cleanRouteString(raw: string): string {
  // Strip query parameters and trailing fragments
  const withoutQuery = raw.split('?')[0].split('&')[0];
  // Strip trailing slashes, preserving root '/'
  const normalized = withoutQuery.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
}

function getRouteFromLocation(): AppRoute {
  // 1. Check pathname first (e.g. /cac-registration, /dcmi)
  const cleanedPath = cleanRouteString(window.location.pathname);
  if (VALID_ROUTES.includes(cleanedPath as AppRoute) && cleanedPath !== '/') {
    return cleanedPath as AppRoute;
  }

  // 2. Support hash-based fallback routes (e.g. #/cac-registration, #/dcmi)
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '/');
    const cleanedHash = cleanRouteString(rawHash);
    if (VALID_ROUTES.includes(cleanedHash as AppRoute)) {
      return cleanedHash as AppRoute;
    }
  }

  if (cleanedPath === '/') {
    return '/';
  }

  return '/';
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromLocation);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getRouteFromLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      window.history.pushState(null, '', route);
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
