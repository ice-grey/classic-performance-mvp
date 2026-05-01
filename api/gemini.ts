export const config = {
  runtime: "nodejs",
};

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = 25_000;

interface GeminiRequestBody {
  date?: string;
  query?: string;
}

const responseSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      date: { type: "STRING" },
      venue: { type: "STRING" },
      performer: { type: "STRING" },
      link: { type: "STRING" },
    },
    required: ["title", "date", "venue", "performer", "link"],
  },
};

function jsonResponse(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY env var is not set");
    return jsonResponse({ error: "Server misconfiguration: missing API key" }, 500);
  }

  let body: GeminiRequestBody;
  try {
    body = (await req.json()) as GeminiRequestBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const date = typeof body.date === "string" ? body.date : "";
  const query = typeof body.query === "string" ? body.query : "";
  if (!date) {
    return jsonResponse({ error: "`date` is required" }, 400);
  }

  const prompt = query
    ? `사용자가 '${query}'와 관련된 클래식 음악 공연을 검색하고 있습니다.
       ${date} 이후로 예정된 해당 검색어와 연관된 실제 공연 일정 5개를 생성해주세요.`
    : `${date} 기준, 한국 및 세계적으로 주목받는 실존 클래식 공연 일정 5개를 생성해주세요.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  console.log("Calling Gemini REST API", { model: GEMINI_MODEL, hasQuery: !!query });

  let upstream: Response;
  try {
    upstream = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
        },
      }),
    });
  } catch (err) {
    clearTimeout(timer);
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error("Gemini fetch failed:", aborted ? "timeout" : err);
    return jsonResponse(
      { error: aborted ? "Upstream timeout" : "Upstream network error" },
      504,
    );
  }
  clearTimeout(timer);

  const rawText = await upstream.text();
  if (!upstream.ok) {
    console.error("Gemini returned non-OK:", upstream.status, rawText);
    return jsonResponse(
      { error: `Gemini ${upstream.status}`, detail: rawText.slice(0, 500) },
      502,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("Gemini response not JSON:", rawText.slice(0, 500));
    return jsonResponse({ error: "Invalid upstream response" }, 502);
  }

  const text =
    (parsed as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
      ?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== "string") {
    console.error("Unexpected Gemini response shape:", JSON.stringify(parsed).slice(0, 500));
    return jsonResponse({ error: "Empty model output" }, 502);
  }

  console.log("Gemini call OK");
  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
