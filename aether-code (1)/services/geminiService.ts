import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCodeResponse } from '../types';

// Safely access API key to prevent runtime crashes in browser-only environments
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCodeFromPrompt = async (prompt: string, currentCode?: string): Promise<GeneratedCodeResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `
      You are an expert Frontend Developer. 
      Your task is to generate or modify HTML, CSS, and JavaScript based on the user's request.
      Return the result in a structured JSON format containing valid 'html', 'css', and 'js' strings.
      Ensure the CSS makes the result look modern and beautiful (Tailwind is NOT available in the preview, use raw CSS).
      If the user provides current code context, modify it. If not, create from scratch.
    `;

    const userPrompt = `
      Request: ${prompt}
      ${currentCode ? `Current Context: ${currentCode}` : ''}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING, description: "The HTML body content (do not include html/head/body tags)" },
            css: { type: Type.STRING, description: "The CSS styles" },
            js: { type: Type.STRING, description: "The JavaScript logic" },
            explanation: { type: Type.STRING, description: "Brief explanation of changes" }
          },
          required: ["html", "css", "js"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedCodeResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};