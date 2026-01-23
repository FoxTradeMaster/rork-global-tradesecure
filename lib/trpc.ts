import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  if (!url) {
    // Return a dummy URL for standalone deployment (tRPC won't be used)
    return 'http://localhost:3000';
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
        
        const attemptFetch = async (attempt: number): Promise<Response> => {
          try {
            const controller = new AbortController();
            const timeout = attempt === 1 ? 30000 : 15000;
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
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
            
            if (attempt < 3) {
              const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
              console.warn(`[tRPC Client] Attempt ${attempt} failed after ${duration}ms, retrying in ${backoffMs}ms...`);
              await new Promise(resolve => setTimeout(resolve, backoffMs));
              return attemptFetch(attempt + 1);
            }
            
            console.error(`[tRPC Client] All attempts failed after ${duration}ms:`, error);
            console.error('[tRPC Client] URL:', url);
            console.error('[tRPC Client] Base URL:', getBaseUrl());
            console.error('[tRPC Client] Error details:', {
              name: error instanceof Error ? error.name : 'Unknown',
              message: error instanceof Error ? error.message : String(error),
              type: error instanceof Error ? error.constructor.name : typeof error,
            });
            
            if (error instanceof Error) {
              if (error.name === 'AbortError') {
                throw new Error(`Backend not responding (timed out after ${Math.round(duration/1000)}s). The backend may be down. Please contact support.`);
              } else if (error.message.includes('Load failed') || error.message.includes('Network request failed')) {
                throw new Error(`Backend server offline or unreachable. Please contact support if this persists.`);
              }
            }
            
            throw error;
          }
        };
        
        return attemptFetch(1);
      },
    }),
  ],
});
