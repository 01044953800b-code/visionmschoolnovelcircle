import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock API endpoint for story generation (No Gemini API used)
app.post("/api/generate-story", async (req, res) => {
  try {
    const { event, conflict, personality, viewpoint, theme } = req.body;

    if (!event || !conflict || !personality || !viewpoint || !theme) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // A simple template-based mock story to demonstrate UI functionality without AI
    const mockStory = `
# 소설 제목: 울타리 너머의 계절

### 시점 및 인물 설정 요약
- **시점**: ${viewpoint}
- **성격**: ${personality}를 가진 주인공
- **갈등**: ${conflict}

---

## [기] 고요한 파문
어느 계절이든 공기는 무게를 가진다. ${event}라는 사건이 내 삶에 끼어든 이후, 내가 들이키는 산소는 평소보다 수천 배는 더 무겁게 느껴졌다. 교실 창밖으로 흩날리는 나뭇잎들을 보며 나는 생각했다. 나의 ${personality} 성격이 이 모든 일을 더 복잡하게 만든 걸까?

## [승] 깊어지는 그림자
${conflict} 때문인지 밤마다 천장이 낮게 내려앉는 기분이 들었다. 친구들의 웃음소리는 복도 끝에서 날카로운 파편이 되어 날아왔고, 나는 그저 고개를 숙인 채 신발 끝만 응시할 뿐이었다. 속상한 마음은 잉크처럼 번져 내 일기장을 온통 까맣게 물들였다.

## [전] 마주 보는 거울
더 이상 도망칠 곳이 없다는 것을 깨달은 그날, 나는 옥상으로 올라가 차가운 바람을 맞았다. ${theme}라는 목표가 내 머릿속을 스쳤다. 아픔을 피하는 것이 아니라, 그 아픔을 내 이야기의 첫 문장으로 삼기로 결심했을 때, 비로소 세상의 소음이 멈추기 시작했다.

## [결] 새로운 시작
이제 나는 ${event} 이전의 나로 돌아갈 수 없다는 것을 안다. 하지만 그 상처가 나를 무너뜨린 것이 아니라, 나를 더 단단하게 빚어냈음을 느낀다. 한 뼘 자란 키만큼, 나는 조금 더 먼 곳을 바라볼 수 있는 힘을 얻었다.

---

### 작가의 한마디
오늘 들려준 당신의 아픔은 결코 무의미하지 않아요. ${theme}라는 주제처럼, 이 이야기가 당신에게 작은 위로와 용기가 되었기를 바랍니다. 당신은 혼자가 아니에요.
`;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({ text: mockStory });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate story template" });
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
