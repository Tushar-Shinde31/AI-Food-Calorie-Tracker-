import { GoogleGenerativeAI } from '@google/generative-ai';

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request): Promise<Response> {
  try {
    const { image } = await req.json();

    const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analyze this food image and provide detailed nutritional information in the following JSON format:
    {
      "foodAnalysis": {
        "identifiedFood": "Name and detailed description of what you see in the image",
        "portionSize": "Estimated portion size in grams",
        "recognizedServingSize": "Estimated serving size in grams",
        "nutritionFactsPerPortion": {
          "calories": "Estimated calories",
          "protein": "Estimated protein in grams",
          "carbs": "Estimated carbs in grams",
          "fat": "Estimated fat in grams",
          "fiber": "Estimated fiber in grams",
          "sugar": "Estimated sugar in grams",
          "sodium": "Estimated sodium in mg",
          "cholesterol": "Estimated cholesterol in mg"
        },
        "nutritionFactsPer100g": {
          "calories": "Calories per 100g",
          "protein": "Protein in grams per 100g",
          "carbs": "Carbs in grams per 100g",
          "fat": "Fat in grams per 100g",
          "fiber": "Fiber in grams per 100g",
          "sugar": "Sugar in grams per 100g",
          "sodium": "Sodium in mg per 100g",
          "cholesterol": "Cholesterol in mg per 100g"
        },
        "additionalNotes": [
          "Any notable nutritional characteristics",
          "Presence of allergens",
          "Whether it's vegetarian/vegan/gluten-free if applicable"
        ]
      }
    }
    
    Ensure the response is in valid JSON format exactly as specified above, without any markdown formatting.
    Provide realistic estimates based on typical portion sizes and nutritional databases.
    Be as specific and accurate as possible in identifying the food and its components.
    Make sure to calculate both portion-based and per 100g nutritional values for easy comparison.`;

    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    const text = response.text();

    // Clean up the response text to remove any markdown formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();

    // Parse the response text as JSON to validate the format
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (error) {
      console.error('Failed to parse Gemini response as JSON:', error);
      throw new Error('Invalid response format from Gemini');
    }

    return Response.json({
      success: true,
      data: parsedResponse,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
