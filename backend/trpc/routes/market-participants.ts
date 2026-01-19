import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

const MarketParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  headquarters: z.string(),
  description: z.string(),
  verified: z.boolean(),
  website: z.string().optional(),
  commodities: z.array(z.string()),
  category: z.array(z.string()).optional(),
  offices: z.array(z.string()).optional(),
  licenses: z.array(z.string()).optional(),
  specialization: z.string().optional(),
  business_type: z.string().optional(),
  logo: z.string().optional(),
  brand_color: z.string().optional(),
  email: z.string().optional(),
  contact_links: z.any().optional(),
  founded: z.number().optional(),
  trading_volume: z.string().optional(),
});

export const marketParticipantsRouter = createTRPCRouter({
  insertBatch: publicProcedure
    .input(z.object({
      participants: z.array(MarketParticipantSchema),
    }))
    .mutation(async ({ input }) => {
      if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Supabase configuration missing');
      }

      const { error } = await supabaseAdmin
        .from('market_participants')
        .insert(input.participants as any);

      if (error) {
        console.error('[Market Participants tRPC] Insert error:', error);
        throw new Error(`Failed to insert: ${error.message}`);
      }

      return { success: true, count: input.participants.length };
    }),
});
