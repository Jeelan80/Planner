import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function getGeminiPlan(goal: string) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set in .env');
  
  // Initialize the Gemini model
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Create a detailed prompt for goal planning
  const prompt = `You are an expert AI goal planning assistant. Analyze the user's goal: "${goal}" and create 3 HIGHLY DETAILED, personalized strategies.

IMPORTANT: Create a complete day-by-day plan for the ENTIRE duration. Each strategy must be unique and provide specific, actionable tasks.

Return ONLY this JSON structure:
{
  "title": "clear, specific goal title",
  "duration": "total days needed (as string)",
  "dailyTime": "average daily time in minutes (as string)",
  "strategies": {
    "stepByStep": [
      {"day": 1, "task": "Very specific task with clear deliverables", "focus": "What to focus on", "minutes": "time in minutes"},
      {"day": 2, "task": "Next specific task building on day 1", "focus": "Focus area", "minutes": "time in minutes"}
    ],
    "progressiveLoad": [
      {"day": 1, "task": "Light start - specific beginner task", "focus": "Foundation building", "minutes": "lower minutes"},
      {"day": 2, "task": "Slightly more challenging task", "focus": "Building up", "minutes": "slightly more minutes"}
    ],
    "milestoneBased": [
      {"day": 1, "task": "Start milestone 1", "milestone": "Week 1: Foundation", "minutes": "time in minutes"},
      {"day": 2, "task": "Continue milestone 1", "milestone": "Week 1: Foundation", "minutes": "time in minutes"}
    ]
  }
}

STRATEGY REQUIREMENTS:
1. STEP-BY-STEP: Equal daily tasks, consistent time, logical progression
2. PROGRESSIVE LOAD: Start easy (60-80% of target time), gradually increase to 120% by end
3. MILESTONE-BASED: Group into weekly milestones, with review/assessment days

TASK REQUIREMENTS:
- Each task must be specific and actionable (e.g., "Complete arrays and strings practice - solve 5 problems" not just "practice coding")
- Include exact study materials, practice problems, or specific activities
- For learning goals: specify chapters, topics, exercises, projects
- For fitness goals: specify exercises, reps, duration, intensity
- For projects: specify features, components, deliverables

TIME ALLOCATION:
- Vary the minutes based on task complexity and strategy
- Progressive: Start at 60-80 minutes, end at 150-180 minutes for 2hr goal
- Step-by-step: Keep consistent around target time
- Milestone: Vary based on milestone phase (setup, work, review)

Generate plans for the COMPLETE duration - if 15 days, provide all 15 days for each strategy.`;

  try {
    console.log('🤖 Calling Gemini API with prompt...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📝 Gemini raw response:', text);
    
    // Parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed Gemini response:', parsedResponse);
        return parsedResponse;
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response as JSON:', parseError);
      throw new Error('Invalid JSON response from Gemini');
    }
    
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    throw error;
  }
}
