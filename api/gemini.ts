import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: "nodejs",
};

interface GeminiRequestBody {
  date?: string;
  query?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server misconfiguration: missing API key" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: GeminiRequestBody;
  try {
    body = (await req.json()) as GeminiRequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const date = typeof body.date === "string" ? body.date : "";
  const query = typeof body.query === "string" ? body.query : "";
  if (!date) {
    return new Response(JSON.stringify({ error: "`date` is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = query
    ? `사용자가 '${query}'와 관련된 클래식 음악 공연을 검색하고 있습니다.
       ${date} 이후로 예정된 해당 검색어와 연관된 실제 공연 일정 5개를 생성해주세요.`
    : `${date} 기준, 한국 및 세계적으로 주목받는 실존 클래식 공연 일정 5개를 생성해주세요.`;

  const ai = new GoogleGenAI({ apiKey });

  try {
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
              link: { type: Type.STRING },
            },
            required: ["title", "date", "venue", "performer", "link"],
          },
        },
      },
    });

    return new Response(response.text || "[]", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
