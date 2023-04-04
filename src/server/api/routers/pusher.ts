import { z } from "zod";
import { pusher } from "~/server/pusher";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const pusherRouter = createTRPCRouter({
  sendAll: protectedProcedure
    .input(z.object({ message: z.string(), sender: z.string() }))
    .mutation(async ({ input }) => {

      await pusher.trigger("chat", "chat-event", {
          message: input.message,
          sender: input.sender,
      });

      return ({ message: "Message sent" });
    }),
});
