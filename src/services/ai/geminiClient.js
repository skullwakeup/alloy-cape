import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generateMarkdown(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            temperature: 0.2,
        },
    });

    return response.text;
}

export async function generateJSON({
    prompt,
    schema,
    temperature = 0.2,
}) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature,
        },
    });

    return JSON.parse(response.text);
}