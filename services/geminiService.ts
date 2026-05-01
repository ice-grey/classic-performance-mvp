import { ClassicalPiece, Performance } from "../types";

export interface CurationFilters {
  composer?: string;
  mood?: string;
  performer?: string;
  occasion?: string;
  instrumentation?: string;
  discoveryMode?: "popular" | "balanced" | "obscure";
  era?: string;
}

export interface CurationInspiration {
  theme: string;
  reason: string;
  filters: CurationFilters;
}

async function callGemini<T>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`/api/gemini failed (${response.status}): ${errText}`);
  }

  return (await response.json()) as T;
}

export const getInspirations = async (
  date: string,
): Promise<CurationInspiration[]> => {
  return callGemini<CurationInspiration[]>({ action: "inspirations", date });
};

export const generateCandidates = async (
  date: string,
  filters?: CurationFilters,
): Promise<ClassicalPiece[]> => {
  const candidates = await callGemini<Array<Omit<ClassicalPiece, "id" | "date">>>({
    action: "candidates",
    date,
    filters,
  });
  return candidates.map((data, index) => ({
    id: btoa(unescape(encodeURIComponent(date + data.title + index))),
    date,
    ...data,
  }));
};

export const getUpcomingPerformances = async (
  date: string,
  query: string = "",
): Promise<Performance[]> => {
  const data = await callGemini<Array<Omit<Performance, "id">>>({
    action: "performances",
    date,
    query,
  });
  return data.map((item, i) => ({
    ...item,
    id: btoa(unescape(encodeURIComponent(item.title + item.date + i))),
  }));
};

export const generateMaestroResponse = async (
  userComment: string,
  pieceContext: string,
): Promise<string> => {
  const result = await callGemini<{ text: string }>({
    action: "maestro",
    userComment,
    pieceContext,
  });
  return result.text || "";
};
