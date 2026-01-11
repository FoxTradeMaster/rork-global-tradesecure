import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { opencorporatesRouter } from "./routes/opencorporates";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  opencorporates: opencorporatesRouter,
});

export type AppRouter = typeof appRouter;
