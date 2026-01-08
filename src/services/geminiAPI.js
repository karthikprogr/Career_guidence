// Groq AI API Integration for Question Generation
import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

let groqClient = null;

// Initialize Groq API
export const initializeGemini = () => {
  if (API_KEY) {
    groqClient = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
    return true;
  }
  console.warn('Groq API key not found. AI features will be disabled.');
  return false;
};

/**
 * Generate aptitude questions using Gemini AI
 * @param {string} category - Verbal, Quantitative, or General Knowledge
 * @param {number} count - Number of questions to generate
 * @param {string} difficulty - Easy, Medium, or Hard
 * @returns {Promise<Array>} Array of generated questions
 */
export const generateQuestions = async (category, count = 10, difficulty = 'Medium') => {
  if (!groqClient) {
    initializeGemini();
  }

  if (!groqClient) {
    throw new Error('Groq API not initialized');
  }

  const systemPrompt = `You are an expert aptitude test question generator. Generate high-quality multiple choice questions in valid JSON format.`;
  
  const userPrompt = `Generate ${count} ${difficulty} level multiple choice questions for ${category} aptitude test.

Format your response EXACTLY as a JSON array:
[
  {
    "question": "Question text here?",
    "options": {
      "a": "Option A text",
      "b": "Option B text",
      "c": "Option C text",
      "d": "Option D text"
    },
    "correctAnswer": "a",
    "category": "${category}"
  }
]

Requirements:
- ${category === 'Verbal' ? 'Focus on synonyms, antonyms, sentence completion, grammar, vocabulary' : ''}
- ${category === 'Quantitative' ? 'Focus on arithmetic, algebra, geometry, data interpretation' : ''}
- ${category === 'General Knowledge' ? 'Focus on history, geography, science, current affairs, technology' : ''}
- Make questions suitable for college admission tests
- Ensure only ONE correct answer per question
- Mix up which option (a,b,c,d) is correct
- Make all options plausible
- Return ONLY valid JSON array, no markdown, no extra text`;

  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    const text = chatCompletion.choices[0]?.message?.content || "";
    
    // Extract JSON from response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Parse JSON
    const questions = JSON.parse(jsonText);
    
    // Transform questions to match your format (with array of options and correctAnswer index)
    return questions.map(q => ({
      question: q.question,
      options: [q.options.a, q.options.b, q.options.c, q.options.d],
      correctAnswer: ['a', 'b', 'c', 'd'].indexOf(q.correctAnswer.toLowerCase()),
      category: category.toLowerCase(),
      difficulty: difficulty.toLowerCase()
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
};

/**
 * Check if Groq API is available
 */
export const isGeminiAvailable = () => {
  return !!API_KEY;
};
