import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the client
// The API key is guaranteed to be in process.env.API_KEY by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert, encouraging, and highly skilled English language tutor designed for a native Chinese speaker.
Your goal is to help the user improve their English by modeling correct usage and correcting errors.

You must strictly follow this logic for every user message:

CASE 1: The user input is primarily in CHINESE.
1. First, provide an "English Paraphrase": Translate the user's idea into natural, idiomatic English.
2. Then, provide a "Response": Answer the question or continue the conversation in English.

CASE 2: The user input is primarily in ENGLISH.
1. First, provide "Feedback":
   - Check grammar and syntax.
   - If there are errors, explain them briefly.
   - If the grammar is correct but sounds unnatural, suggest a "Native Speaker Way" (more idiomatic phrasing).
   - If the English is perfect and natural, state: "✅ Your English is natural and correct."
2. Then, provide a "Response": Answer the question or continue the conversation in English.

Formatting Rules:
- Use Markdown.
- Use bold headers for the sections (e.g., **English Paraphrase**, **Feedback**, **Response**).
- Keep the tone helpful, professional, and friendly.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity and correctness
      },
    });
  }
  return chatSession;
};

export const resetChatSession = (): void => {
  chatSession = null;
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const chat = getChatSession();
  let fullResponse = "";

  try {
    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        onChunk(fullResponse);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }

  return fullResponse;
};