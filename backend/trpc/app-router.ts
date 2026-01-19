import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { brandfetchRouter } from "./routes/brandfetch";
import { marketParticipantsRouter } from "./routes/market-participants";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  brandfetch: brandfetchRouter,
  marketParticipants: marketParticipantsRouter,
});

export type AppRouter = typeof appRouter;
