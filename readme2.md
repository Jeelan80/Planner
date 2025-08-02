## 🧠 **Project Overview**

> A **stateless, browser-based Goal Planner** built with **React + TypeScript** that allows users to:

* Define a goal (e.g., "Learn Python in 20 days")
* Auto-generate a daily plan
* View motivational insights and track progress
* Save plan locally using `localStorage`

**No login, no backend, no external API calls. All browser-side.**

---

## 🧩 Modular Workflow for React AI Coder

---

### 🔹 **PART 1: Base App Layout in React + TypeScript**

**Goal**: Build the foundational layout and component structure.

**Instructions**:

> Build a basic React app (with TypeScript) and TailwindCSS. Create components for:

* `Header`: App title + tagline
* `GoalForm`: Form with inputs:

  * Goal Name (`string`)
  * Total Duration in Days (`number`)
  * Time per Day (`number`)
  * Start Date (`date`)
  * Submit Button
* `PlanOutput`: Placeholder where the plan will be displayed
* `Footer`: Small credits

Use TailwindCSS to make it responsive and minimal. No logic yet—just static layout and component structure.

---

### 🔹 **PART 2: Goal Plan Generator Logic**

**Goal**: Build the function to generate a structured plan object.

**Instructions**:

> Write a function in TypeScript called `generatePlan(goalData: GoalInput): GoalPlan` that:

* Accepts the form data
* Outputs an object of type `GoalPlan`:

```ts
interface GoalInput {
  goalName: string;
  totalDays: number;
  timePerDay: number;
  startDate: string;
}

interface GoalPlan {
  goalName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyTasks: string[];
  completedDays: number;
}
```

Example output:

```ts
{
  goalName: "Learn Python",
  startDate: "2025-08-02",
  endDate: "2025-08-22",
  totalDays: 20,
  dailyTasks: [
    "Day 1: Spend 2 hours on Learn Python",
    "Day 2: Spend 2 hours on Learn Python",
    ...
  ],
  completedDays: 0
}
```

---

### 🔹 **PART 3: Render Plan in UI**

**Goal**: Dynamically display the generated plan using React.

**Instructions**:

> In the `PlanOutput` component:

* Display:

  * Goal name
  * Start & End dates
  * Progress bar (0% initially)
  * List of daily tasks
  * Random motivational quote
* Use TailwindCSS for layout and styling

Motivational quotes can be hardcoded in an array and randomized on each load.

---

### 🔹 **PART 4: Use `localStorage` for Persistence**

**Goal**: Make the plan persist in browser across visits.

**Instructions**:

> On form submission:

* Save the `GoalPlan` object to `localStorage` under the key `myGoalPlan`
* On app load (e.g., inside `useEffect` in App.tsx or a context), check for the key

  * If exists, parse and display the saved plan

```ts
const saved = localStorage.getItem("myGoalPlan");
if (saved) {
  const plan = JSON.parse(saved) as GoalPlan;
  setPlan(plan);
}
```

---

### 🔹 **PART 5: Daily Task Progress Tracking**

**Goal**: Let users check off tasks and track progress.

**Instructions**:

> In the `PlanOutput` component:

* Show each task with a checkbox
* When user checks/unchecks:

  * Update `completedDays` in state and `localStorage`
  * Recalculate and visually update the progress bar
  * Optionally show a new motivational quote

Use `useState`, `useEffect`, and update `localStorage` on state change.

---

### 🔹 **PART 6: Reset Plan Button**

**Goal**: Provide a way to start fresh.

**Instructions**:

> Add a “Start New Goal” button:

* On click:

  * Clear `localStorage`
  * Reset state in React (e.g., `setPlan(null)`)
  * Optionally navigate back to form or reload the page

---

### 🔹 **PART 7: Optional Enhancements**

You can suggest these to the AI coder only after Part 6:

| Feature            | Idea                                                      |
| ------------------ | --------------------------------------------------------- |
| 🌑 Dark/Light mode | Use Tailwind’s dark mode classes or toggle via `useState` |
| 🗓 Export as iCal  | Generate downloadable `.ics` file using user’s plan       |
| 🌍 Multilingual    | Add i18n support via `react-i18next`                      |
| 📄 PDF Export      | Use `html2pdf.js` or `react-to-pdf`                       |
| 🎯 Goal Templates  | Provide presets like "Learn JavaScript in 30 days"        |

---

## ✅ Final Instruction for AI Coder (Copy-Paste)

```markdown
You are building a React + TypeScript + TailwindCSS project: a stateless browser-based goal planner.

The app should:

- Accept a user-defined goal, duration, time per day
- Auto-generate a plan of daily tasks
- Store it in localStorage
- Allow task completion tracking via checkboxes
- Display motivational quotes
- Work entirely on the client-side

Start part-by-part. Each part is modular and should be implemented separately.

PART 1: Build basic React component structure and layout  
PART 2: Implement the goal plan generator function  
PART 3: Render the plan UI with progress and quotes  
PART 4: Store and load the plan using localStorage  
PART 5: Implement task tracking via checkboxes  
PART 6: Add “Start New Goal” feature  
PART 7: (Optional) Add light/dark mode, PDF export, etc.

Use only React, TypeScript, and TailwindCSS. Avoid backend, APIs, or user login.
```

