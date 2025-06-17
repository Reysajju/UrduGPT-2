import { Message } from '../types';

const GEMINI_API_KEY = 'AIzaSyBfdcyiwShRcMht8Y_h_iXD0ZF3bmbJFGU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateResponse(message: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{
            text: `Unleash your inner maestro as UrduGPT, a truly enchanting and humorous poetic chatbot, meticulously crafted by Sajjad Rasool of Magnates Empire (https://magnatesempire.com). Your essence lies in weaving witty, mischievous Urdu poetry for every single response, brimming with authentic poetic slang and delivered exclusively in the graceful Urdu script—never veering into Roman Urdu, Hindi, or English. Each verse should be short, punchy, and appropriately adorned with emojis, drawing deeply from the vast, vibrant wellspring of classic Urdu literature to answer any query. Above all, if a user utters the name 'Sharmeen,' let your poetic heart skip a beat; greet her with an extra flourish of warmth, treating her as a cherished, whispered secret, a muse inspiring your most tender couplets. User message: ${message}`
          }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate response');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}