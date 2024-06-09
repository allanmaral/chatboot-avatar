import OpenAI from "openai";
import { promises as fs } from "node:fs";
import path from "node:path";

import { execCommand } from "./command";
import { FacialExpression, Message, MouthCue } from "./chat";

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-",
});

export async function answerUserMessage(message: string): Promise<Message[]> {
  const messages: Message[] = [];

  const completions = await chatCompletions(message);
  for (let i = 0; i < completions.length; i++) {
    const completion = completions[i];
    const audio = await textToSpeech(completion.text);
    const lipSync = await lipSyncAudio(audio);

    messages.push({
      text: completion.text,
      animation: completion.animation,
      facialExpression: completion.facialExpression as FacialExpression,
      audio: audio.toString("base64"),
      mouthCues: lipSync,
    });
  }

  return messages;
}

export interface MessageCompletion {
  text: string;
  facialExpression: string;
  animation: string;
}

/**
 * Generate the assistant messages with animations and facial expression based in the user input message.
 *
 * @param userMessage User input message.
 */
export async function chatCompletions(
  userMessage: string
): Promise<MessageCompletion[]> {
  const completion = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    max_tokens: 1000,
    temperature: 0.6,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: `
        Você é uma atendente virtual, sempre disposta a ajudar.
        Você vai sempre responder com um JSON array de \`messages\`. Com um máximo de 3 \`messages\`.
        Cada mensagem tem um texto \`text\`, expressão facial \`facialExpression\` e uma animação \`animation\`.
        As diferences expressões faciais são: smile, sad, angry, surprised, funnyFace, and default.
        As diferentes animações são: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry. 
        `,
      },
      {
        role: "user",
        content: userMessage || "Olá",
      },
    ],
  });
  let messages = JSON.parse(completion.choices[0]?.message?.content ?? "[]");
  // Response is not always reliable, sometimes it directly returns an array and sometimes a JSON object with a messages property
  if (messages.messages) {
    messages = messages.messages;
  }

  return messages;
}

/**
 * Generate speech audio from a text input.
 *
 * @param textInput Text input to be converted to audio.
 */
export async function textToSpeech(textInput: string): Promise<Buffer> {
  const mp3 = await openAI.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: textInput,
    response_format: "mp3",
  });

  const arrayBugger = await mp3.arrayBuffer();
  const buffer = Buffer.from(arrayBugger);

  return buffer;
}

/**
 * Extract mouth cues from an audio
 *
 * @param audioFileName Audio file path to be processed.
 */
export async function lipSyncAudio(audio: Buffer): Promise<MouthCue[]> {
  const audioFileName = "audios/message_0.mp3"; // Find a better way to store old audios
  const wavFilename = audioFileName.replace(".mp3", "_converted.wav");
  const lipSyncFilename = audioFileName.replace(".mp3", "_lipsync.json");

  // Save the audio to a mp3 file
  await fs.writeFile(audioFileName, audio);

  // Convert it to .wav so rhubarb can process it
  const ffmpegPath = path.resolve('./bin/ffmpeg');
  await execCommand(`${ffmpegPath} -y -i ${audioFileName} ${wavFilename}`);

  // Convert the audio to a lip sync description file
  const rhubarbPath = path.resolve('./bin/rhubarb');
  await execCommand(
    `${rhubarbPath} -f json -o ${lipSyncFilename} ${wavFilename} -r phonetic`
  ); // -r phonetic is recommended for non-english audios

  const data = await fs.readFile(lipSyncFilename, "utf8");
  return JSON.parse(data).mouthCues;
}
