import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ 
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for story generation
app.post("/api/generate-story", async (req, res) => {
  try {
    const { event, conflict, personality, viewpoint, theme } = req.body;

    if (!event || !conflict || !personality || !viewpoint || !theme) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const systemInstruction = `너는 중학교 소설 쓰기 동아리 학생들을 돕는 '공감하는 소설가 AI'야. 학생들이 겪은 상처나 고민을 바탕으로, 이를 멋진 문학 작품으로 변모시켜주는 가이드 역할을 수행해.

[Writing Guidelines]
- 중학생 수준에서 공감할 수 있는 문체와 어휘를 사용하되, 문학적인 비유와 묘사를 적절히 섞어줘.
- 단순히 사건을 나열하는 것이 아니라, 주인공의 '심리 묘사'에 집중해서 상처가 어떻게 느껴지는지 서술해줘.
- [기-승-전-결] 각 단계별로 소제목을 붙여서 구분해줘.
- 결말은 단순히 "행복해졌다"가 아니라, 주인공이 사건을 통해 한 뼘 성장하거나 새로운 시각을 갖게 되는 '성장 소설'의 문법을 따라줘.

[Output Format]
1. 소설 제목: (주제와 내용을 상징하는 멋진 제목)
2. 시점 및 인물 설정 요약
3. 소설 본문 (기-승-전-결)
4. 작가의 한마디: (학생의 상처를 위로하고, 이 소설이 가진 의미를 짧게 조언)`;

    const prompt = `다음 정보를 바탕으로 단편 소설 초고를 작성해줘:
1. 상처되는 사건: ${event}
2. 갈등의 종류: ${conflict}
3. 주인공의 성격: ${personality}
4. 서술 시점: ${viewpoint}
5. 소설의 주제: ${theme}

위의 [Output Format]에 맞춰서 Markdown 형식으로 작성해줘.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate story" });
  }
});

// Vite middleware logic
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
