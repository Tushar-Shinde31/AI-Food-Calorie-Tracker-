import { atom } from 'jotai';

interface FoodAnalysis {
  identifiedFood: string;
  image: string;
  portionSize: string;
  recognizedServingSize: string;
  nutritionFactsPerPortion: NutritionFactsPerPortion;
  nutritionFactsPer100g: NutritionFactsPerPortion;
  additionalNotes: string[];
}

interface NutritionFactsPerPortion {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
  sodium: string;
  cholesterol: string;
}

export const analysisAtom = atom<FoodAnalysis | null>(null);
