import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import z from "zod";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    { websocket: true },
    (connection, request) => {
      connection.socket.on("message", async (message: string) => {
        const createPollBody = z.object({
          pollId: z.string().uuid(),
        });

        const { pollId } = createPollBody.parse(request.body);

        voting.subscribe(pollId, () => {
          connection.socket.send(JSON.stringify(message));
        });
      });
    }
  );
}
