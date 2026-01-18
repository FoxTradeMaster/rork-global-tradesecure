import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { createBrandFetchClient } from "@/lib/brandfetch";

export const brandfetchRouter = createTRPCRouter({
  searchByDomain: publicProcedure
    .input(z.object({ 
      domain: z.string() 
    }))
    .query(async ({ input }) => {
      const client = createBrandFetchClient();
      
      if (!client) {
        throw new Error('BrandFetch API key not configured');
      }

      try {
        const result = await client.searchByDomain(input.domain);
        return result;
      } catch (error) {
        console.error('[BrandFetch tRPC] Search error:', error);
        throw error;
      }
    }),

  searchByName: publicProcedure
    .input(z.object({ 
      name: z.string() 
    }))
    .query(async ({ input }) => {
      const client = createBrandFetchClient();
      
      if (!client) {
        throw new Error('BrandFetch API key not configured');
      }

      try {
        const results = await client.searchByName(input.name);
        return results;
      } catch (error) {
        console.error('[BrandFetch tRPC] Search error:', error);
        throw error;
      }
    }),

  enrichCompany: publicProcedure
    .input(z.object({
      name: z.string(),
      website: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const client = createBrandFetchClient();
      
      if (!client) {
        throw new Error('BrandFetch API key not configured');
      }

      try {
        let brandData = null;

        if (input.website) {
          brandData = await client.searchByDomain(input.website);
        }

        if (!brandData) {
          const searchResults = await client.searchByName(input.name);
          if (searchResults && searchResults.length > 0) {
            const domain = searchResults[0].domain;
            brandData = await client.searchByDomain(domain);
          }
        }

        if (brandData) {
          const email = brandData.links?.find(link => 
            link.name.toLowerCase() === 'email' || 
            link.url.startsWith('mailto:')
          )?.url.replace('mailto:', '') || null;

          return {
            logo: client.getLogo(brandData),
            primaryColor: client.getPrimaryColor(brandData),
            description: brandData.description || brandData.longDescription,
            links: brandData.links,
            email,
            verified: brandData.claimed,
          };
        }

        return null;
      } catch (error) {
        console.error('[BrandFetch tRPC] Enrich error:', error);
        return null;
      }
    }),
});
