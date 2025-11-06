
"use client";

import { RecipesProvider } from '@/context/recipes-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { useEffect, useRef } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
// Optional navigation bar color (Android only)
declare global {
  interface Window { __navApplied?: boolean }
}
import { auth } from '@/lib/firebase';
import { browserSessionPersistence, onAuthStateChanged, setPersistence, signOut } from 'firebase/auth';

function AuthSessionManager() {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // 1) Use session storage persistence: session ends when the browser/tab closes
    setPersistence(auth, browserSessionPersistence).catch((e) => {
      console.warn('No se pudo establecer la persistencia de sesión:', e);
    });

    // 2) Auto-logout por inactividad (5 minutos)
    const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes
    let lastActivity = Date.now();

    const resetTimer = () => {
      lastActivity = Date.now();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(async () => {
        try {
          await signOut(auth);
          alert('Tu sesión ha expirado por inactividad. Vuelve a iniciar sesión para continuar.');
        } catch (e) {
          console.error('Error cerrando sesión por inactividad:', e);
        }
      }, INACTIVITY_MS);
    };

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    const unsub = onAuthStateChanged(auth, (u) => {
      // Guardar marca de tiempo de login en sessionStorage
      if (u) {
        try {
          sessionStorage.setItem('loginAt', String(Date.now()));
        } catch {}
      } else {
        try {
          sessionStorage.removeItem('loginAt');
        } catch {}
      }
      // Reinicia el contador cuando cambia el estado de auth
      resetTimer();
    });

    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetTimer));
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      unsub();
    };
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecipesProvider>
      <FavoritesProvider>
        {/* Ensure WebView respects system UI safe areas on Android */}
        <SafeAreaStatusBar />
        <AuthSessionManager />
        {children}
      </FavoritesProvider>
    </RecipesProvider>
  );
}

function SafeAreaStatusBar() {
  useEffect(() => {
    // Call Capacitor StatusBar plugin if available (Android/iOS); ignore on web
    const apply = async () => {
      try {
        // Detect theme preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const bgColor = isDark ? '#0f1f0f' : '#E8F8ED'; // Dark: very dark green; Light: light green
        const barStyle = isDark ? Style.Light : Style.Dark; // Light icons on dark, dark icons on light
        
        // Always keep content below system bars
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: barStyle });
        await StatusBar.setBackgroundColor({ color: bgColor });
        
        // Navigation bar styling via CSS meta (fallback) or plugin if added later
        if (!window.__navApplied) {
          const meta = document.createElement('meta');
          meta.name = 'theme-color';
          meta.content = bgColor;
          meta.setAttribute('media', '(prefers-color-scheme: light)');
          document.head.appendChild(meta);
          
          const metaDark = document.createElement('meta');
          metaDark.name = 'theme-color';
          metaDark.content = '#0f1f0f';
          metaDark.setAttribute('media', '(prefers-color-scheme: dark)');
          document.head.appendChild(metaDark);
          
          window.__navApplied = true;
        }
        
        // Listen for theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async (e) => {
          const newDark = e.matches;
          const newBg = newDark ? '#0f1f0f' : '#E8F8ED';
          const newStyle = newDark ? Style.Light : Style.Dark;
          try {
            await StatusBar.setStyle({ style: newStyle });
            await StatusBar.setBackgroundColor({ color: newBg });
          } catch {}
        });
      } catch {}
    };
    apply();
  }, []);
  return null;
}
