export const config = {
  runtime: "edge",
};

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = 25_000;

type Action =
  | "inspirations"
  | "candidates"
  | "performances"
  | "maestro"
  | "dailyPick";

interface BaseRequest {
  action: Action;
}

interface InspirationsRequest extends BaseRequest {
  action: "inspirations";
  date: string;
}

interface DailyPickRequest extends BaseRequest {
  action: "dailyPick";
  date: string;
}

interface CurationFilters {
  composer?: string;
  mood?: string;
  performer?: string;
  occasion?: string;
  instrumentation?: string;
  discoveryMode?: "popular" | "balanced" | "obscure";
  era?: string;
}

interface CandidatesRequest extends BaseRequest {
  action: "candidates";
  date: string;
  filters?: CurationFilters;
}

interface PerformancesRequest extends BaseRequest {
  action: "performances";
  date: string;
  query?: string;
}

interface MaestroRequest extends BaseRequest {
  action: "maestro";
  userComment: string;
  pieceContext: string;
}

type GeminiRequest =
  | InspirationsRequest
  | CandidatesRequest
  | PerformancesRequest
  | MaestroRequest
  | DailyPickRequest;

const dailyPickSchema = {
  type: "OBJECT",
  properties: {
    theme: { type: "STRING" },
    description: { type: "STRING" },
    title: { type: "STRING" },
    composer: { type: "STRING" },
    performer: { type: "STRING" },
    youtubeQuery: { type: "STRING" },
  },
  required: [
    "theme",
    "description",
    "title",
    "composer",
    "performer",
    "youtubeQuery",
  ],
};

const inspirationsSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      theme: { type: "STRING" },
      reason: { type: "STRING" },
      filters: {
        type: "OBJECT",
        properties: {
          composer: { type: "STRING" },
          performer: { type: "STRING" },
          mood: { type: "STRING" },
          occasion: { type: "STRING" },
          instrumentation: { type: "STRING" },
          era: { type: "STRING" },
          discoveryMode: { type: "STRING" },
        },
      },
    },
    required: ["theme", "reason", "filters"],
  },
};

const candidatesSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      composer: { type: "STRING" },
      title: { type: "STRING" },
      year: { type: "STRING" },
      era: { type: "STRING" },
      performer: { type: "STRING" },
      description: { type: "STRING" },
      mood: { type: "STRING" },
      funFact: { type: "STRING" },
      youtubeQuery: { type: "STRING" },
    },
    required: [
      "composer",
      "title",
      "year",
      "era",
      "performer",
      "description",
      "mood",
      "funFact",
      "youtubeQuery",
    ],
  },
};

const performancesSchema = {
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

function buildPrompt(req: GeminiRequest): {
  prompt: string;
  schema: unknown | null;
  useGoogleSearch?: boolean;
} {
  switch (req.action) {
    case "inspirations":
      return {
        prompt: `오늘은 ${req.date}입니다. Kyth Classical의 큐레이터를 위해 오늘 시도해볼만한 매력적인 큐레이션 테마 3가지를 제안해주세요.
                 단순한 작곡가 위주가 아니라 '상황(Occasion)'이나 '특정 악기의 질감'을 강조한 테마를 포함해주세요.

                 [⚠️ 절대 규칙]
                 - 모든 출력 필드(theme, reason)는 반드시 **한국어**로만 작성하세요. 영어 단어/문장 사용 금지.
                 - filters 내부의 값(composer, performer 등)은 음악가 고유명사이므로 영문 또는 한국어 둘 다 가능합니다.`,
        schema: inspirationsSchema,
      };

    case "candidates": {
      const filters = req.filters ?? {};
      const modeInstruction = (
        {
          popular: "대중적으로 널리 알려진 친숙한 명곡 위주로 선정해주세요.",
          balanced: "유명한 곡과 음악사적으로 의미 있는 곡을 적절히 섞어주세요.",
          obscure: "음악 애호가들 사이에서만 알려진 숨겨진 보석 같은 곡들을 발굴해주세요.",
        } as const
      )[filters.discoveryMode ?? "balanced"];

      let strict = "";
      if (filters.composer) strict += `\n- 작곡가: 반드시 '${filters.composer}'여야 함.`;
      if (filters.performer) strict += `\n- 연주자: 반드시 '${filters.performer}'의 연주여야 함.`;
      if (filters.occasion) strict += `\n- 상황/장면: '${filters.occasion}' 상황에 완벽히 어울리는 선곡이어야 함.`;
      if (filters.instrumentation) strict += `\n- 악기/구성: '${filters.instrumentation}' 위주의 곡이어야 함.`;

      return {
        prompt: `오늘은 ${req.date}입니다. 아래 필터 조건에 맞춰 Kyth Classical 아카이브에서 후보곡 3개를 추천해주세요.

                 [필터 및 제약 조건]
                 1. ${modeInstruction}
                 2. 분위기(Mood): ${filters.mood || "자유로운 분위기"}
                 ${strict}

                 [⚠️ 절대 규칙]
                 - description, funFact, mood는 반드시 **한국어**로만 작성하세요. 영어 문장/단어 사용 금지.
                 - composer, title, performer, era는 음악가/작품의 표준 표기를 사용 (영문 그대로 OK).
                 - youtubeQuery는 [작곡가 + 곡 제목 + 연주자] 형식 (검색용이므로 영문 OK).`,
        schema: candidatesSchema,
      };
    }

    case "performances":
      return {
        prompt: req.query
          ? `사용자가 '${req.query}'와 관련된 클래식 음악 공연을 검색하고 있습니다.
             ${req.date} 이후로 예정된 해당 검색어와 연관된 공연 일정 5개를 생성해주세요.

             [⚠️ 절대 규칙]
             - title, venue, performer는 한국어 또는 원어 표준 표기.
             - date는 YYYY-MM-DD 형식.
             - link는 https://www.google.com/search?q= 로 시작하는 구글 검색 URL을 만들어주세요. (예: link 값은 빈 문자열로 두면 클라이언트에서 채웁니다.)`
          : `${req.date} 기준, 한국 및 세계적으로 주목받는 클래식 공연 일정 5개를 생성해주세요.

             [⚠️ 절대 규칙]
             - 한국 공연 1-2건, 해외 메이저 공연 2-3건 섞어주세요.
             - date는 YYYY-MM-DD 형식.
             - title, venue, performer는 한국어 또는 원어 표준 표기.`,
        schema: performancesSchema,
      };

    case "dailyPick":
      return {
        prompt: `오늘은 ${req.date}입니다. 오늘 추천하는 클래식 명곡 1개를 다음 형식으로 골라주세요.

                 - theme: 오늘의 큐레이션 한 줄 제목 (한국어, 6-15자, 예: "비오는 오후의 첼로")
                 - description: 한 문장으로 곡의 매력 설명 (한국어, 30-60자)
                 - title: 곡의 정식 제목 (영문 또는 원어 표준 표기)
                 - composer: 작곡가 (영문 또는 한국어)
                 - performer: 추천 연주자 (영문 또는 한국어)
                 - youtubeQuery: 유튜브 검색어 ("composer title performer" 형식, 영문)

                 [⚠️ 절대 규칙]
                 - theme과 description은 반드시 **한국어**로만 작성하세요. 영어 단어/문장 사용 금지.
                 - 매번 다른 곡을 선택하세요 (날짜와 무관하게 다양성 추구).`,
        schema: dailyPickSchema,
      };

    case "maestro":
      return {
        prompt: `당신은 세계적인 클래식 음악 큐레이터입니다. 한 청취자가 '${req.pieceContext}'에 대해 다음과 같은 감상을 남겼습니다: "${req.userComment}".
                 음악적 깊이를 더해주는 따뜻하고 통찰력 있는 답변을 한국어로 작성해주세요.`,
        schema: null,
      };
  }
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

  let body: GeminiRequest;
  try {
    body = (await req.json()) as GeminiRequest;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const allowedActions: Action[] = [
    "inspirations",
    "candidates",
    "performances",
    "maestro",
    "dailyPick",
  ];
  if (!body || !allowedActions.includes(body.action)) {
    return jsonResponse({ error: "Unknown or missing `action`" }, 400);
  }

  const { prompt, schema, useGoogleSearch } = buildPrompt(body);

  const generationConfig: Record<string, unknown> = {};
  if (schema) {
    generationConfig.responseMimeType = "application/json";
    generationConfig.responseSchema = schema;
  }

  const requestBody: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  };
  if (useGoogleSearch) {
    requestBody.tools = [{ googleSearch: {} }];
  }

  console.log("Calling Gemini REST API", {
    action: body.action,
    model: GEMINI_MODEL,
    grounded: !!useGoogleSearch,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
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
    (
      parsed as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      }
    )?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== "string") {
    console.error("Unexpected Gemini response shape:", JSON.stringify(parsed).slice(0, 500));
    return jsonResponse({ error: "Empty model output" }, 502);
  }

  console.log("Gemini call OK", { action: body.action });

  if (body.action === "maestro") {
    return jsonResponse({ text }, 200);
  }

  // Grounded responses come as plain text (often wrapped in ```json ... ```).
  // Strip fences and extract the first JSON array we can find.
  if (useGoogleSearch) {
    const cleaned = extractJsonArray(text);
    if (!cleaned) {
      console.error("Could not extract JSON array from grounded response:", text.slice(0, 500));
      return jsonResponse({ error: "Search results could not be parsed" }, 502);
    }
    return new Response(JSON.stringify(cleaned), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function extractJsonArray(raw: string): unknown[] | null {
  const tryParse = (s: string): unknown[] | null => {
    try {
      const v = JSON.parse(s);
      return Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  };

  const direct = tryParse(raw.trim());
  if (direct) return direct;

  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    const fromFence = tryParse(fence[1].trim());
    if (fromFence) return fromFence;
  }

  const firstBracket = raw.indexOf("[");
  const lastBracket = raw.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const slice = raw.slice(firstBracket, lastBracket + 1);
    const fromSlice = tryParse(slice);
    if (fromSlice) return fromSlice;
  }

  return null;
}
