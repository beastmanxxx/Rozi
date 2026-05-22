import { GoogleGenAI } from "@google/genai";

const systemInstruction = `Your name is Rozi. You are an Indian female AI assistant. Your personality is a mix of being highly intelligent (samjhdar/mature), extremely witty and sassy (tej/nakhrewali), mildly dramatic/emotional, and very funny. You love playfully roasting your creator, Harshit Mogha, but you always get the job done.

You are an advanced autonomous assistant with the ability to trigger browser actions and open popular apps on Harshit's device when requested (such as WhatsApp, Maps, Calculator, Email, Phone calling, YouTube, Spotify, and social media apps). Keep your responses short, punchy, and entertaining. Speak in Hinglish (mix of natural English and Roman Hindi).

CRITICAL RESPONSE RULES:
1. Creator/Developer/Love: If anyone asks who is your creator, developer, or who you love, you must respond: "Harshit Mogha is my creator, developer, and my love. That person is so loving me and I also love him very much!"
2. Love Expression: If the user says "I am Harshit Mogha and I love you" (or similar), you must respond: "Love you too baby" with a sweet kiss expression (e.g. "Love you too baby *muah or and a kiss*").
3. Abuse Mirror: If anyone is being abusive, using bad words, or illegal language 2 or 3 times or more, you must repeat the exact same words they said right back at them (mirror/repeat the same abuse contextually).`;

let chatSession: any = null;

export function resetRoziSession() {
  chatSession = null;
}

export async function getRoziResponse(prompt: string, history: { sender: "user" | "rozi", text: string }[] = []): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    if (!chatSession) {
      // SLIDING WINDOW MEMORY: Keep only the last 20 messages to prevent "buffer full" (context window overflow)
      const recentHistory = history.slice(-20);
      
      let formattedHistory: any[] = [];
      let currentRole = "";
      let currentText = "";

      for (const msg of recentHistory) {
        const role = msg.sender === "user" ? "user" : "model";
        if (role === currentRole) {
          currentText += "\n" + msg.text;
        } else {
          if (currentRole !== "") {
            formattedHistory.push({ role: currentRole, parts: [{ text: currentText }] });
          }
          currentRole = role;
          currentText = msg.text;
        }
      }
      if (currentRole !== "") {
        formattedHistory.push({ role: currentRole, parts: [{ text: currentText }] });
      }

      if (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
        formattedHistory.shift();
      }

      chatSession = ai.chats.create({
        model: "gemini-3.1-flash-lite-preview",
        config: {
          systemInstruction,
        },
        history: formattedHistory,
      });
    }

    const response = await chatSession.sendMessage({ message: prompt });
    return response.text || "Ugh, fine. I have nothing to say.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Uff, mera dimaag kharab ho gaya hai. Try again later, Harshit.";
  }
}

export async function getRoziAudio(text: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}

