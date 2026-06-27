import axios from "axios";

const API_KEY = "YOUR_API_KEY";

export async function getAIResponse(message) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const response = await axios.post(url, {
    contents: [
      {
        parts: [
          {
            text: message,
          },
        ],
      },
    ],
  });

  return response.data.candidates[0].content.parts[0].text;
}
