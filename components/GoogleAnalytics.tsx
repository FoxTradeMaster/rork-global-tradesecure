import { useEffect } from 'react';
import { Platform } from 'react-native';

// Google Analytics component for web platform
export function GoogleAnalytics() {
  useEffect(() => {
    // Only run on web platform
    if (Platform.OS !== 'web') return;

    // Check if gtag is already loaded
    if (typeof window !== 'undefined' && !(window as any).gtag) {
      // Create script element for gtag.js
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BYQSVV756H';
      script.async = true;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag function
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;

      // Configure Google Analytics
      gtag('js', new Date());
      gtag('config', 'G-BYQSVV756H', {
        page_path: window.location.pathname,
      });
    }
  }, []);

  return null;
}

// Helper function to track page views
export function trackPageView(url: string) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  
  if ((window as any).gtag) {
    (window as any).gtag('config', 'G-BYQSVV756H', {
      page_path: url,
    });
  }
}

// Helper function to track custom events
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}
