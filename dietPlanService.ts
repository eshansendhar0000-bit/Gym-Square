import type { FitnessAim } from "@prisma/client";

export interface DietPlan {
  aim: FitnessAim;
  title: string;
  goal: string;
  foodCategories: string[];
  sampleMealStructure: string[];
  preWorkout: string;
  postWorkout: string;
  hydration: string;
  notes: string;
}

// Central, reusable mapping from a member's selected fitness aim to a
// general nutrition guidance category. This is the single source of
// truth used by both the diet-plan endpoint and, on the client, the
// mirrored static content — keeping the logic in one place rather
// than duplicated across the UI.
const dietPlans: Record<FitnessAim, DietPlan> = {
  MUSCLE_BUILDING: {
    aim: "MUSCLE_BUILDING",
    title: "Muscle Building",
    goal: "Support muscle repair and growth alongside consistent strength training.",
    foodCategories: [
      "Adequate protein (dal, paneer, curd, eggs, chicken, fish)",
      "Complex carbohydrates (rice, roti, oats, sweet potato)",
      "Healthy fats (nuts, seeds, ghee in moderation)",
      "Vegetables and fruits for micronutrients",
    ],
    sampleMealStructure: [
      "Breakfast: eggs or paneer with roti, plus a fruit",
      "Lunch: dal, rice or roti, vegetables, curd",
      "Evening snack: sprouts or a handful of nuts",
      "Dinner: chicken/fish/paneer with vegetables and roti",
    ],
    preWorkout: "A light carbohydrate snack such as a banana or a few dates 30–60 minutes before training.",
    postWorkout: "A protein-rich meal or snack (e.g. curd, eggs, paneer) within a couple of hours after training.",
    hydration: "Drink water regularly through the day, and more around training sessions.",
    notes: "Individual protein needs vary — this is general guidance, not a prescription.",
  },
  WEIGHT_MANAGEMENT: {
    aim: "WEIGHT_MANAGEMENT",
    title: "Weight Management",
    goal: "Support a balanced, sustainable approach to managing body weight.",
    foodCategories: [
      "Balanced meals with portion awareness",
      "Protein-rich foods (dal, eggs, curd, chicken, fish)",
      "Plenty of vegetables",
      "Whole grains over refined grains where possible",
    ],
    sampleMealStructure: [
      "Breakfast: a protein source with vegetables, kept moderate in portion",
      "Lunch: dal, a whole grain, and a generous portion of vegetables",
      "Evening snack: fruit or a small portion of nuts",
      "Dinner: a lighter meal with protein and vegetables",
    ],
    preWorkout: "A small, easily digestible snack if training within a few hours of a meal.",
    postWorkout: "A balanced meal with protein and vegetables to support recovery.",
    hydration: "Prioritise water through the day; limit sugary beverages.",
    notes: "Sustainable, gradual changes are generally easier to maintain than restrictive plans.",
  },
  STRENGTH: {
    aim: "STRENGTH",
    title: "Strength Training",
    goal: "Fuel heavy, focused training sessions and support recovery between them.",
    foodCategories: [
      "Protein for muscle repair (dal, eggs, paneer, chicken, fish)",
      "Carbohydrates for training energy (rice, roti, fruits)",
      "Micronutrient-rich vegetables and fruits",
      "Adequate fats for overall health",
    ],
    sampleMealStructure: [
      "Breakfast: a protein and carbohydrate combination (eggs with roti)",
      "Lunch: dal, rice or roti, vegetables",
      "Pre-training snack: a light carbohydrate source",
      "Dinner: protein, complex carbohydrates, and vegetables",
    ],
    preWorkout: "A carbohydrate-focused snack 60–90 minutes before a heavy session.",
    postWorkout: "Protein and carbohydrates together to support recovery, e.g. curd with fruit.",
    hydration: "Water throughout the day; consider electrolytes for long or intense sessions.",
    notes: "Strength gains depend on many factors beyond diet — training and recovery matter too.",
  },
  ENDURANCE: {
    aim: "ENDURANCE",
    title: "Endurance",
    goal: "Support sustained energy for longer training sessions and aid recovery.",
    foodCategories: [
      "Carbohydrates for sustained energy (rice, roti, fruits, oats)",
      "Moderate protein for recovery (dal, curd, eggs, chicken, fish)",
      "Fluids and electrolytes",
      "Fruits and vegetables for micronutrients",
    ],
    sampleMealStructure: [
      "Breakfast: oats or roti with fruit",
      "Lunch: rice, dal, vegetables",
      "Pre-training snack: easily digestible carbohydrates",
      "Dinner: a balanced meal with carbohydrates and protein",
    ],
    preWorkout: "A carbohydrate-rich snack an hour or so before longer sessions.",
    postWorkout: "Carbohydrates and protein together, plus fluids, to support recovery.",
    hydration: "Fluids and electrolytes are especially important for longer sessions, particularly in heat.",
    notes: "Fuelling needs scale with session length and intensity — adjust gradually and observe how you feel.",
  },
  GENERAL_FITNESS: {
    aim: "GENERAL_FITNESS",
    title: "General Fitness",
    goal: "Support overall health and energy for a well-rounded fitness routine.",
    foodCategories: [
      "A balanced mix of protein, carbohydrates, and fats",
      "Variety of vegetables and fruits",
      "Whole grains where possible",
      "Adequate hydration",
    ],
    sampleMealStructure: [
      "Breakfast: a balanced plate with protein and whole grains",
      "Lunch: dal, roti or rice, vegetables",
      "Snack: fruit or nuts",
      "Dinner: a lighter, balanced meal",
    ],
    preWorkout: "A light snack if training is more than a couple of hours after a meal.",
    postWorkout: "A balanced meal within a few hours of training.",
    hydration: "Water throughout the day is generally sufficient for moderate activity.",
    notes: "General guidance suitable as a starting point for most routines.",
  },
  SPORTS_PERFORMANCE: {
    aim: "SPORTS_PERFORMANCE",
    title: "Sports Performance",
    goal: "Support the energy and recovery demands of sport-specific training.",
    foodCategories: [
      "Carbohydrates to fuel training and match days",
      "Protein for recovery (dal, eggs, paneer, chicken, fish)",
      "Fruits and vegetables for micronutrients",
      "Fluids and electrolytes around activity",
    ],
    sampleMealStructure: [
      "Breakfast: carbohydrates with a protein source",
      "Lunch: rice or roti, dal, vegetables",
      "Pre-activity snack: easily digestible carbohydrates",
      "Post-activity: protein and carbohydrates together",
    ],
    preWorkout: "A carbohydrate-focused meal or snack 1–3 hours before activity, depending on tolerance.",
    postWorkout: "Carbohydrates and protein soon after activity to support recovery.",
    hydration: "Fluids and electrolytes before, during, and after activity, especially in heat.",
    notes: "Sport-specific nutrition needs vary widely — this is a general starting point only.",
  },
  FLEXIBILITY_MOBILITY: {
    aim: "FLEXIBILITY_MOBILITY",
    title: "Flexibility / Mobility",
    goal: "Support overall wellbeing alongside a mobility-focused routine.",
    foodCategories: [
      "Balanced, varied meals",
      "Plenty of vegetables and fruits",
      "Adequate protein and healthy fats",
      "Consistent hydration",
    ],
    sampleMealStructure: [
      "Breakfast: a balanced plate with fruit",
      "Lunch: dal, roti or rice, vegetables",
      "Snack: fruit or curd",
      "Dinner: a light, balanced meal",
    ],
    preWorkout: "A light snack if needed, since mobility sessions are typically lower intensity.",
    postWorkout: "A balanced meal at your usual mealtime is generally sufficient.",
    hydration: "Regular water intake throughout the day.",
    notes: "General wellbeing nutrition — adjust based on how your body responds.",
  },
  OTHER: {
    aim: "OTHER",
    title: "General Guidance",
    goal: "A balanced nutrition starting point while your specific goal is clarified.",
    foodCategories: [
      "A balanced mix of protein, carbohydrates, and fats",
      "Variety of vegetables and fruits",
      "Whole grains where possible",
      "Adequate hydration",
    ],
    sampleMealStructure: [
      "Breakfast: a balanced plate with protein",
      "Lunch: dal, roti or rice, vegetables",
      "Snack: fruit or nuts",
      "Dinner: a balanced, lighter meal",
    ],
    preWorkout: "A light snack if training soon after a long gap since your last meal.",
    postWorkout: "A balanced meal within a few hours of training.",
    hydration: "Water throughout the day.",
    notes: "Speak with a trainer about refining your specific goal for more tailored guidance.",
  },
};

export function getDietPlanForAim(aim: FitnessAim): DietPlan {
  return dietPlans[aim];
}

export function getAllDietPlans(): DietPlan[] {
  return Object.values(dietPlans);
}
