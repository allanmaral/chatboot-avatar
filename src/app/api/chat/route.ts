import { answerUserMessage } from "@/lib/completion";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message) {
    return Response.json(
      { error: "Bad Request" },
      {
        status: 400,
      }
    );
  }

  const answer = await answerUserMessage(message);
  return Response.json(answer);
}
