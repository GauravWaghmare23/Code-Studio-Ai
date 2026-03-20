import { GoogleGenerativeAI } from "@google/generative-ai"




export const generateResult = async (prompt) => {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    // generationConfig: {
    //   responseMimeType: "application/json",
    //   temperature: 0.4,
    // },
  });

  const result = await model.generateContent(prompt);

  return result.response.text()
}