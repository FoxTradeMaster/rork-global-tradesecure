import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { brandfetchRouter } from "./routes/brandfetch";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  brandfetch: brandfetchRouter,
});

export type AppRouter = typeof appRouter;
