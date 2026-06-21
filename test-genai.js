require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const fs = require('fs');
  fs.writeFileSync('test.txt', 'Hello world this is a test file.');
  
  const uploadResult = await ai.files.upload({
    file: 'test.txt',
    mimeType: 'text/plain',
  });
  
  console.log("Upload result:", uploadResult);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        uploadResult,
        { text: "What is in this file?" }
      ]
    });
    console.log(response.text);
  } catch(e) {
    console.error("Error 1:", e.message);
  }

  try {
    const response2 = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        uploadResult.name,
        "What is in this file?"
      ]
    });
    console.log(response2.text);
  } catch(e) {
    console.error("Error 2:", e.message);
  }
}
main();
