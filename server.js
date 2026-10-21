const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));

app.post("/ask", async (req, res) => {
    const question = req.body.question;

    if (!question) {
        return res.status(400).json({
            error: "Question is required"
        });
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Answer only the user's question.
                                    Keep the answer short, clear, and relevant.
                                    Do not add unnecessary information.
                                    Do not discuss topics that were not asked.
                                    User's question:
                                    ${question}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(data);

            return res.status(response.status).json({
                error: data.error?.message || "Gemini API error"
            });
        }

        const answer = data.candidates[0].content.parts[0].text;

        res.json({
            answer: answer
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});