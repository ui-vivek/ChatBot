import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class BotService {
  readonly genAI: any;
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY);
  }
  async getChatbotResponse(message: string) {
    try {
      if (!message) throw new Error('Please provide a message');
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 200,
        responseMimeType: 'text/plain',
      };

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
      });

      let history = [];
      history.push({ role: 'user', parts: [{ text: message }] });
      const result = await model
        .startChat({
          generationConfig,
          history: [
            {
              role: 'user',
              parts: [{ text: `${Date.now()}` }],
            },
            {
              role: 'user',
              parts: [{ text: 'My name is vivek singh' }],
            },
          ],
        })
        .sendMessage(message);
      const response = await result.response;
      let text = await response.text();
      history.push({ role: 'model', parts: [{ text }] });
      return { response: text };
    } catch (error) {
      console.error('Error interacting with chatbot:', error);
      throw new Error(
        'Sorry, ☹️ there was an issue with the chatbot. Please try again later.',
      );
    }
  }
}
