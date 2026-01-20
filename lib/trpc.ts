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
        try {
          const response = await fetch(url, {
            ...options,
            signal: AbortSignal.timeout(120000),
          });
          console.log('[tRPC Client] Response status:', response.status);
          return response;
        } catch (error) {
          console.error('[tRPC Client] Fetch error:', error);
          console.error('[tRPC Client] URL:', url);
          console.error('[tRPC Client] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      },
    }),
  ],
});
