# Auto Goal Planner

A modern, browser-based goal planning and tracking application built with React and TypeScript. Plan your goals, generate daily tasks automatically, and track your progress—all stored locally in your browser.

## ✨ Features

- **Smart Goal Planning**: Enter your goals with start/end dates and daily time commitment
- **Automatic Task Generation**: AI-powered plan generation creates daily tasks automatically
- **Progress Tracking**: Visual progress bars and completion statistics
- **Offline-First**: All data stored locally using localStorage (no backend required)
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/auto-goal-planner.git
cd auto-goal-planner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI components
│   ├── forms/          # Form components  
│   ├── layout/         # Layout components
│   └── planner/        # Goal planner specific components
├── hooks/              # Custom React hooks
├── services/           # Services (localStorage, etc.)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: localStorage (browser-based)
- **Deployment**: Static hosting ready

## 📱 Core Components

### Goal Management
- **PlannerForm**: Create and edit goals
- **GoalCard**: Display goal information and progress
- **Goal Types**: Comprehensive TypeScript definitions

### Task Management  
- **TaskItem**: Individual task display and interaction
- **Task Generation**: Automatic daily task creation
- **Progress Tracking**: Visual progress indicators

### Data Persistence
- **LocalStorage Service**: Robust browser storage management
- **Custom Hooks**: useGoals, useTasks for state management
- **Export/Import**: Backup and restore functionality

## 🎯 Usage

1. **Create a Goal**: Click "Create New Goal" and fill in the details
2. **Automatic Planning**: Tasks are generated automatically based on your timeline
3. **Track Progress**: Check off daily tasks as you complete them
4. **Monitor Success**: View progress bars and completion statistics
5. **Stay Organized**: Use tags and priorities to organize your goals

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze project structure and dependencies

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency enforcement
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 📦 Build & Deployment

Build for production:
```bash
npm run build
```

The `dist` folder contains the built application ready for deployment to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Deploy the `dist` folder contents
- **Any Static Host**: Upload the `dist` folder contents

## 🔐 Privacy & Data

- **No Backend**: All data stays in your browser
- **No Tracking**: No analytics or user tracking
- **Offline Capable**: Works without internet connection
- **Data Control**: Export/import your data anytime

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- UI components powered by [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Build tool by [Vite](https://vitejs.dev/)

---

**Start planning your goals today!** 🎯