import { GoogleGenerativeAI } from "@google/generative-ai"




export const generateResult = async (prompt, fileTree = {}) => {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
    Current File Tree Context:
    ${JSON.stringify(fileTree, null, 2)}

    Examples: 
    
    <example>
     user: Create an express application 
     response: {
        "text": "this is your fileTree structure of the express server",
        "fileTree": {
            "app.js": {
                file: {
                    contents: "const express = require('express');\nconst app = express();\napp.get('/', (req, res) => res.send('Hello World!'));\napp.listen(3000, () => console.log('Server is running on port 3000'));"
                }
            },
            "package.json": {
                file: {
                    contents: "{\n  \"name\": \"temp-server\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.js\",\n  \"dependencies\": {\"express\": \"^4.21.2\"}\n}"
                }
            }
        },
        "buildCommand": { "mainItem": "npm", "commands": ["install"] },
        "startCommand": { "mainItem": "node", "commands": ["app.js"] }
     }
    </example>

    IMPORTANT: 
    1. If the user provides a prompt that builds on existing code, ONLY provide the new or updated files in the 'fileTree' object. Be concise and maintain existing logic.
    2. Don't use file name like routes/index.js if it's already there. 
    3. Always ensure the code is complete and functional.
    `
  });

  const result = await model.generateContent(prompt);

  return result.response.text()
}