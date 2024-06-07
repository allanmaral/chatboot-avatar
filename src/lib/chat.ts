export type FacialExpression =
  | "default"
  | "smile"
  | "funnyFace"
  | "sad"
  | "surprised"
  | "angry"
  | "crazy";

export interface Message {
  /** Text content */
  text: string;

  /** Animation name */
  animation: string;

  /** Facial expression name */
  facialExpression: FacialExpression;

  /** Base64 encoded audio */
  audio: string;

  /** Mouth cues collection used for lip-sync */
  mouthCues: MouthCue[];
}

export type MouthShape = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "X";

export interface MouthCue {
  /** Mouth shape */
  value: MouthShape;

  /** Cue start time offset */
  start: number;

  /** Cue end time offset */
  end: number;
}

export async function sendMessage(message: string): Promise<Message[]> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  return data;
}
