export interface StoryParams {
  event: string;
  conflict: string;
  personality: string;
  viewpoint: string;
  theme: string;
}

export async function generateStory(params: StoryParams): Promise<string> {
  const response = await fetch("/api/generate-story", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate story");
  }

  const data = await response.json();
  return data.text;
}
