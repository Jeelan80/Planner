## New Project Flow

## ✅ Final Project Flow: Goal Planning Assistant

---

### 🔁 OVERALL FLOW SUMMARY

> 💡 *“User enters a goal → AI processes it → Returns all needed strategies → User picks one → Plan gets generated and editable → Saved as a card.”*

---

### 🧩 STEP-BY-STEP FLOW

---

### **1. User Input**

* **Frontend:** User enters their goal in a free-text form (e.g. *“Lose 3kg in 30 days with 45 min walk daily”*).
* **Backend Trigger:** On submit, send the text as a prompt to an AI model (like OpenAI, Gemini, Claude, etc.).

---

### **2. Single API Call to AI Model**

Your **AI model must return structured JSON** with the following:

```json
{
  "title": "Lose 3kg",
  "duration_days": 30,
  "daily_time": "07:00 AM",
  "step_by_step_plan": [
    {"day": 1, "task": "Walk for 20 minutes"},
    {"day": 2, "task": "Walk for 25 minutes"},
    ...
  ],
  "progressive_load_plan": {
    "week_1": "Walk 20 min daily",
    "week_2": "Walk 30 min daily + reduce sugar",
    "week_3": "Walk 45 min daily + control portions",
    "week_4": "Add light jogging + meal tracking"
  },
  "milestone_plan": [
    {
      "milestone": "Complete 1st Week",
      "due_in_days": 7,
      "expected_result": "Lose 0.5kg and form routine"
    },
    {
      "milestone": "Mid-point",
      "due_in_days": 15,
      "expected_result": "Lose 1.5kg, walking habit formed"
    },
    {
      "milestone": "Final Goal",
      "due_in_days": 30,
      "expected_result": "Lose 3kg, improved lifestyle"
    }
  ]
}
```

---

### ✅ **Improvements in API Call Design**

* API should **return all 3 strategy-based plans** in a single response.
* Only one call is needed, so make sure the **prompt template is very well-structured** to get this info.
* If no “daily time” is mentioned in user input, **default to “7:00 AM”** or ask the user.

---

### **3. Frontend UI Receives Data**

Once the JSON is received:

* Autofill the following:

  * Goal title
  * Duration
  * Daily time

* Display **4 strategy cards**:

  1. Step-by-Step
  2. Progressive Load
  3. Milestone-Based
  4. Time Blocked *(this doesn’t need backend data)*

---

### **4. Strategy Cards Interaction**

When the user clicks any of the strategies:

* Expand and show that plan:

  * For Step-by-Step: List of daily tasks
  * For Progressive Load: Week-wise plan
  * For Milestone-Based: Milestone checkpoints
  * For Time Blocked: Let user pick time (e.g. 7–8 AM daily) and fill what they want to do in that time

* Add **Modify Plan Option** (editable form or drag/drop depending on complexity)

---

### **5. Plan Confirmation and Saving**

Once the user is satisfied with one strategy:

* User clicks **“Use this plan”**
* That strategy's plan is now saved as a **Card/Module in the dashboard**


---

### 🔁 Optional Add-ons for Later:

* Allow combining 2 strategies (e.g., Step-by-Step + Time Block)
* Show AI-suggested productivity tips per strategy
* Show progress tracker based on completed tasks/milestones
* Let users export the plan (PDF, calendar, etc.)

---

## 💡 Summary: Key Components

| Component         | Description                               |
| ----------------- | ----------------------------------------- |
| 🧠 AI Response    | All plans returned in a single JSON       |
| 🖥️ UI Sections   | Title, Duration, Daily Time (auto-filled) |
| 📊 Strategy Cards | Show all 4, only 3 fetched from API       |
| ✍️ Edit Plan      | User can tweak the suggested plan         |
| 📦 Save as Card   | Once confirmed, show on dashboard         |
| 🔁 One API Call   | Done only once when user enters the goal  |

---

Would you like a **React layout wireframe suggestion** or **prompt design** for the AI model next?
