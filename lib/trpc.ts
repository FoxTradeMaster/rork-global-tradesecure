import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  if (!url) {
    throw new Error(
      "Rork did not set EXPO_PUBLIC_RORK_API_BASE_URL, please use support",
    );
  }

  return url;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        console.log('[tRPC Client] Fetching:', url);
        const startTime = Date.now();
        
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 240000);
          
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
              ...options?.headers,
              'Content-Type': 'application/json',
            },
          });
          
          clearTimeout(timeoutId);
          const duration = Date.now() - startTime;
          console.log(`[tRPC Client] Response status: ${response.status} (${duration}ms)`);
          
          return response;
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[tRPC Client] Fetch failed after ${duration}ms:`, error);
          console.error('[tRPC Client] URL:', url);
          console.error('[tRPC Client] Base URL:', getBaseUrl());
          console.error('[tRPC Client] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            type: error instanceof Error ? error.constructor.name : typeof error,
          });
          
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              throw new Error(`Request timeout after ${duration}ms - backend processing took too long`);
            } else if (error.message.includes('Load failed') || error.message.includes('Network request failed')) {
              throw new Error(`Backend server unreachable at ${getBaseUrl()} - check if backend is running`);
            }
          }
          
          throw error;
        }
      },
    }),
  ],
});
