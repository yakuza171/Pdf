
import { GoogleGenAI } from "@google/genai";
import { PDFMetadata } from "../types";

export class GeminiService {
  // Fix: Removed permanent instance to ensure each request uses a fresh GoogleGenAI instance with the latest process.env.API_KEY

  async searchPDFs(query: string, availablePDFs: PDFMetadata[]): Promise<PDFMetadata[]> {
    if (!query.trim()) return availablePDFs;

    // Fix: Instantiate GoogleGenAI right before the call to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é um assistente técnico especializado em eletrônica. 
        Dada a consulta do usuário: "${query}", analise esta lista de manuais: ${JSON.stringify(availablePDFs.map(p => ({ id: p.id, title: p.title, description: p.description, tags: p.tags })))}. 
        Retorne APENAS uma lista separada por vírgulas com os IDs dos manuais que são relevantes. Se nada for encontrado, retorne "none".`,
      });

      const resultIds = (response.text || '').split(',').map(id => id.trim());
      if (resultIds[0] === 'none') return [];
      
      return availablePDFs.filter(p => resultIds.includes(p.id));
    } catch (error) {
      console.error("Busca via Gemini falhou:", error);
      const lowerQuery = query.toLowerCase();
      return availablePDFs.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
    }
  }

  async generateSummary(pdfTitle: string, description: string): Promise<string> {
    // Fix: Instantiate GoogleGenAI right before the call to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Forneça um resumo técnico profissional de 2 frases em português para o manual "${pdfTitle}": "${description}".`,
      });
      return response.text || '';
    } catch (error) {
      return description;
    }
  }
}

export const geminiService = new GeminiService();
