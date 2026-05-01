
import { GoogleGenAI, Type } from "@google/genai";
import { Performance } from "../types";

export const getUpcomingPerformances = async (date: string, query: string = ""): Promise<Performance[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = query 
    ? `사용자가 '${query}'와 관련된 클래식 음악 공연을 검색하고 있습니다. 
       ${date} 이후로 예정된 해당 검색어와 연관된 실제 공연 일정 5개를 생성해주세요.`
    : `${date} 기준, 한국 및 세계적으로 주목받는 실존 클래식 공연 일정 5개를 생성해주세요.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            date: { type: Type.STRING },
            venue: { type: Type.STRING },
            performer: { type: Type.STRING },
            link: { type: Type.STRING }
          },
          required: ["title", "date", "venue", "performer", "link"]
        }
      }
    }
  });

  const data: any[] = JSON.parse(response.text || "[]");
  return data.map((item, i) => ({
    ...item,
    id: btoa(item.title + item.date + i)
  }));
};
