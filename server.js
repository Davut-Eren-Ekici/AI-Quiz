require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/generate-quiz", async function(req, res) {
    console.log("Frontend'den gelen ayarlar:", req.body);

    const { topic, questionCount, difficulty } = req.body;

    const prompt = `
    Bana '${topic}' konusu hakkında, '${difficulty}' zorluk seviyesinde tam ${questionCount} adet çoktan seçmeli quiz sorusu hazırla.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            question: { type: "STRING" },
                            options: {
                                type: "ARRAY",
                                items: { type: "STRING" }
                            },
                            answer: { type: "STRING" }
                        },
                        required: ["question", "options", "answer"]
                    }
                }
            }
        });

        const quizData = JSON.parse(response.text);

        console.log("Gemini'den üretilen quiz:", quizData);

        res.json({
            success: true,
            quiz: quizData
        });

    } catch (error) {
        console.error("Gemini API Hatası:", error);
        res.status(500).json({ success: false, error: "Quiz oluşturulurken bir hata oluştu." });
    }
});

app.get("/", function(req, res) {
    res.send("AI Quiz Backend çalışıyor!");
});

app.listen(3000, function() {
    console.log("Server çalışıyor : http://localhost:3000");
});