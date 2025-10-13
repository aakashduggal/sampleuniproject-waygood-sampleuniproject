// Controller for course recommendations (Gemini AI integration placeholder)

/**
 * Expected input (POST JSON):
 * {
 *   topics: ["machine learning", "data science"],
 *   skillLevel: "beginner" // or intermediate, advanced
 * }
 */

const fetch = require('node-fetch');

exports.getRecommendations = async (req, res) => {
  try {
    const { topics = [], skillLevel = 'beginner', description = '' } = req.body || {};

    // Use Gemini API (Google Generative Language API)
    const apiKey = 'AIzaSyD4A3BJx_6RNbSBZ3lGufIev23G4mGiqgY';
    const GOOGLE_API_KEY = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyD4A3BJx_6RNbSBZ3lGufIev23G4mGiqgY'; 

    // Compose prompt
    const prompt = `You are an expert academic advisor specializing in recommending courses and programs of study to students.\n\nStudent Description: ${description}\n\nSuggest 3 relevant courses. For each, provide:\n- courseName\n- universityName\n- matchScore (0-100)\n- rationale (1-2 sentences)\nReturn as JSON array.`;

    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    let rawGemini = '';
    let data = null;
    try {
      if (!response.ok) {
        rawGemini = await response.text();
        console.error('Gemini API error:', response.status, rawGemini);
        return res.status(502).json({
          source: 'gemini',
          error: `Gemini API error: ${response.status}`,
          details: rawGemini
        });
      }
      data = await response.json();
    } catch (err) {
      console.error('Gemini API fetch/parse error:', err);
      return res.status(502).json({
        source: 'gemini',
        error: 'Failed to fetch or parse Gemini API response',
        details: rawGemini || err.message
      });
    }

    // Gemini returns a candidates array, each with content.parts[0].text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini raw text:', text);

    // Try to extract JSON from the response
    let recommendations = [];
    try {
      let cleanText = text.trim();
      // Remove Markdown code block if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/i, '').replace(/```$/, '').trim();
      }
      // Find first and last [ ] block
      const start = cleanText.indexOf('[');
      const end = cleanText.lastIndexOf(']');
      if (start !== -1 && end !== -1) {
        recommendations = JSON.parse(cleanText.substring(start, end + 1));
      } else {
        // fallback: try to parse whole text
        recommendations = JSON.parse(cleanText);
      }
    } catch (e) {
      // fallback: return text as rationale
      recommendations = [
        { courseName: 'AI Recommendation', universityName: '', matchScore: 80, rationale: text || 'Could not parse Gemini response.' }
      ];
      console.error('Gemini response parse error:', e, 'Raw text:', text);
    }

    return res.json({
      source: 'gemini',
      recommendations
    });
  } catch (err) {
    console.error('Server error in recommendationsController:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};