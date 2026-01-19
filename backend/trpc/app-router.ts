import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { brandfetchRouter } from "./routes/brandfetch";
import { marketParticipantsRouter } from "./routes/market-participants";
import { aiMarketUpdaterRouter } from "./routes/ai-market-updater";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  brandfetch: brandfetchRouter,
  marketParticipants: marketParticipantsRouter,
  aiMarketUpdater: aiMarketUpdaterRouter,
});

export type AppRouter = typeof appRouter;
