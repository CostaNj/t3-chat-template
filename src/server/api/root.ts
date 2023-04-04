import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { pusherRouter } from "~/server/api/routers/pusher";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  pusher: pusherRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
