import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ProcessedMessage {
  native_script_text: string;
  translated_text: string;
}

export const processMessage = async (
  inputText: string,
  sourceLanguage: Language,
  targetLanguage: Language
): Promise<ProcessedMessage> => {
  // If no translation is needed, and no transliteration is likely needed, return original text.
  if (sourceLanguage.code === targetLanguage.code) {
    const isRomanScript = /^[a-zA-Z0-9\s.,?!']+$/.test(inputText);
    // If language is English, or if it's not Roman script, no processing needed.
    if (sourceLanguage.code === 'en' || !isRomanScript) {
      return {
        native_script_text: inputText,
        translated_text: inputText,
      };
    }
    // Otherwise, it might be phonetic input that needs transliteration, so proceed to API.
  }

  try {
    const prompt = `
Context: You are a translation and transliteration engine for BhashaBharti, an Indian multilingual chat app.
Your tone should be natural and suitable for a chat conversation.

Task:
1.  **Transliterate**: Convert the following input text from Roman script to its native ${sourceLanguage.name} script.
    - If the input is already in its native script or the source language is English, the original text should be used.
    - The result goes into the 'native_script_text' field.
2.  **Translate**: Translate the original input text from ${sourceLanguage.name} to ${targetLanguage.name}.
    - The result goes into the 'translated_text' field.

Input Text: "${inputText.replace(/"/g, '\\"')}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // More suitable for chat applications
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            native_script_text: { 
                type: Type.STRING, 
                description: `The input text transliterated into ${sourceLanguage.name} script. If source is English or already in script, this is the original text.` 
            },
            translated_text: { 
                type: Type.STRING, 
                description: `The input text accurately translated into ${targetLanguage.name}.` 
            },
            status: { 
                type: Type.STRING, 
                description: 'This should always be the string "SUCCESS".' 
            },
          },
          required: ["native_script_text", "translated_text", "status"],
        },
      },
    });

    const resultText = response.text.trim();
    // In case the model wraps the JSON in markdown backticks
    const sanitizedText = resultText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const resultJson = JSON.parse(sanitizedText);

    if (resultJson && resultJson.native_script_text && resultJson.translated_text && resultJson.status === "SUCCESS") {
      return {
        native_script_text: resultJson.native_script_text,
        translated_text: resultJson.translated_text,
      };
    } else {
      console.error("Received invalid JSON structure from API:", resultJson);
      throw new Error("Invalid or failed JSON response from API");
    }
  } catch (error) {
    console.error("Error processing message with Gemini:", error);
    throw new Error("Message processing failed via Gemini API");
  }
};
