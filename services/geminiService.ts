import { Performance } from "../types";

export const getUpcomingPerformances = async (
  date: string,
  query: string = "",
): Promise<Performance[]> => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, query }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch performances (${response.status}): ${errText}`,
    );
  }

  const data: Array<Omit<Performance, "id">> = await response.json();
  return data.map((item, i) => ({
    ...item,
    id: btoa(unescape(encodeURIComponent(item.title + item.date + i))),
  }));
};
