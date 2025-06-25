import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getQuizQuestions = async (req, res) => {
  try {
    const { category = "code", difficulty = "Easy", limit = 5 } = req.query;

    const response = await axios.get('https://quizapi.io/api/v1/questions', {
      headers: {
        'X-Api-Key': process.env.QUIZAPI_KEY
      },
      params: {
        category,
        difficulty,
        limit
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Quiz API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
};
