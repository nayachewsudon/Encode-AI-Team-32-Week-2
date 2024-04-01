import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "http://127.0.0.1:5000/v1",
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: "system",
        content:
          `You are a professional comedian who has been hired to write a series of jokes. Just answer with the joke you were asked to return`,
      },
      ...messages.additionalMessages,
        {
          role: "system",
          content:
            `Based on the generated joke, evaluate and classify if the joke 1) is funny or not, 2) appropriate or not, 3) offensive or not, 4) a dad joke or not `,
        },
        ...messages,
    ],
  });


  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
