import { Content, GoogleGenerativeAI } from '@google/generative-ai';

interface Session {
  history: Content[];
}

export class GeminiSessionManager {
  private model;
  private sessions = new Map<string, Session>();

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async chat(userId: string, message: string): Promise<string> {
    let session = this.sessions.get(userId);

    if (!session) {
      session = { history: [] };
      this.sessions.set(userId, session);
    }

    session.history.push({ parts: [{ text: message }], role: 'user' });

    const result = await this.model.generateContent({ contents: session.history });
    const reply = result.response.text();

    session.history.push({ parts: [{ text: reply }], role: 'model' });

    return reply;
  }

  reset(userId: string) {
    this.sessions.delete(userId);
  }
}
