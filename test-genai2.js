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
  
  console.log("Upload result URI:", uploadResult.uri);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          fileData: {
            mimeType: uploadResult.mimeType,
            fileUri: uploadResult.uri
          }
        },
        { text: "What is in this file?" }
      ]
    });
    console.log("SUCCESS:", response.text);
  } catch(e) {
    console.error("Error 3:", e.message);
  }
}
main();
