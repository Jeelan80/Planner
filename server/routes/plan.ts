import express, { Request, Response } from 'express';
import { getGeminiPlan } from '../utils/getGeminiPlan.ts';

const router = express.Router();

// POST /generate-plan
router.post('/generate-plan', express.json(), async (req: Request, res: Response) => {
  console.log('✅ /generate-plan route called with body:', req.body);
  try {
    const { goal } = req.body;
    if (!goal) {
      console.log('❌ Missing goal in request body');
      return res.status(400).json({ error: 'Missing goal in request body' });
    }
    
    console.log('🚀 Calling Gemini API for goal:', goal);
    const aiResponse = await getGeminiPlan(goal);
    console.log('📦 Gemini API response:', aiResponse);
    
    // If Gemini returns empty or invalid, return mock data
    if (!aiResponse || Object.keys(aiResponse).length === 0) {
      console.log('⚠️ Gemini returned empty, sending mock data');
      const mockResponse = {
        title: goal,
        duration: "30",
        dailyTime: "120",
        strategies: {
          stepByStep: [
            { day: 1, task: `Start working on: ${goal}`, focus: `Begin ${goal}` },
            { day: 2, task: `Continue with: ${goal}`, focus: `Progress on ${goal}` }
          ],
          progressiveLoad: [
            { week: 1, focus: `Week 1: Foundation of ${goal}` },
            { week: 2, focus: `Week 2: Building up ${goal}` }
          ]
        }
      };
      return res.status(200).json(mockResponse);
    }
    
    res.status(200).json(aiResponse);
  } catch (err) {
    console.error('❌ Error in /generate-plan route:', err);
    
    // Return mock data on error to prevent frontend crash
    const errorMockResponse = {
      title: req.body.goal || "Sample Goal",
      duration: "21",
      dailyTime: "90",
      strategies: {
        stepByStep: [
          { day: 1, task: "Day 1: Getting started", focus: "Initial setup" },
          { day: 2, task: "Day 2: Building momentum", focus: "Continue progress" }
        ]
      }
    };
    
    res.status(200).json(errorMockResponse);
  }
});

export default router;
