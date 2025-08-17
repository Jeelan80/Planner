# 🎯 Auto Goal Planner

A sophisticated, AI-enhanced goal planning and tracking application built with React 18 and TypeScript. Transform your aspirations into actionable plans with intelligent task generation, customizable dashboards, and comprehensive progress tracking.

## ✨ Key Features

### 🤖 AI-Powered Planning
- **Google Gemini Integration**: Advanced AI analyzes your goals and creates personalized strategies
- **Multiple Planning Methodologies**: Milestone-based, habit-forming, sprint, and custom approaches
- **Intelligent Task Generation**: Automatically converts goals into daily actionable tasks
- **Natural Language Processing**: Describe goals conversationally and get structured plans
- **Strategy Recommendations**: AI suggests optimal approaches based on goal complexity and timeline

### �G Advanced Goal Management
- **Comprehensive CRUD Operations**: Create, read, update, and delete goals with full data integrity
- **Smart Progress Tracking**: Visual indicators, completion percentages, and milestone celebrations
- **Priority & Tag System**: Organize goals with customizable priorities and tags
- **Status Management**: Active, completed, and paused states with automatic transitions
- **Time Estimation**: Built-in time tracking and daily time allocation

### 🎨 Fully Customizable Dashboard
- **Drag-and-Drop Interface**: Intuitive card-based layout with real-time reordering
- **Rich Card Types**: Photo cards, motivational quotes, progress trackers, quick notes, task summaries
- **Responsive Grid System**: Adapts seamlessly to desktop, tablet, and mobile devices
- **Theme System**: Light, dark, and auto themes with system preference detection
- **Persistent Customization**: All layout preferences saved locally with version migration

### 🔒 Privacy-First Architecture
- **Zero Server Dependency**: All data stored locally in browser localStorage
- **Offline-First Design**: Full functionality without internet connection
- **Export/Import System**: Complete data backup and restore capabilities
- **No Tracking**: Zero analytics, cookies, or user data collection
- **IP-Based Security**: Backend access control for enhanced security

### 📱 Mobile-Optimized Experience
- **Touch-Friendly Interface**: 44px minimum touch targets and gesture support
- **Responsive Components**: Mobile-first design with adaptive layouts
- **Progressive Web App Ready**: Installable with offline capabilities
- **Cross-Browser Compatibility**: Chrome 80+, Firefox 75+, Safari 13+

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Modern web browser** with localStorage support
- **Google Gemini API key** (optional, for AI features)

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd auto-goal-planner
   npm install
   ```

2. **Configure environment** (optional for AI features)
   ```bash
   # Create .env file for AI functionality
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   echo "REACT_APP_NETWORK_HOST=127.0.0.1" >> .env
   ```

3. **Start development**
   ```bash
   npm run dev
   ```
   
   **Servers:**
   - 🎨 Frontend (Vite + React): http://localhost:3000
   - 🔧 Backend (Express): http://localhost:4000

4. **Build for production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

## 📂 Architecture Overview

```
auto-goal-planner/
├── � sFrontend (React 18 + TypeScript)
│   ├── src/
│   │   ├── components/          # Component library
│   │   │   ├── common/         # Reusable UI components
│   │   │   ├── dashboard/      # Customizable dashboard system
│   │   │   ├── forms/          # Goal creation and AI planning
│   │   │   ├── layout/         # App shell and navigation
│   │   │   └── planner/        # Goal and task management
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useGoals.ts     # Goal state management
│   │   │   ├── useTasks.ts     # Task operations
│   │   │   └── useUserPersonalization.ts
│   │   ├── services/           # Business logic layer
│   │   ├── types/              # TypeScript definitions
│   │   ├── contexts/           # React context providers
│   │   └── App.tsx             # Main application
│   └── 📱 PWA Configuration
├── 🔧 Backend (Express + TypeScript)
│   ├── server/
│   │   ├── routes/            # API endpoints
│   │   │   └── plan.ts        # AI planning routes
│   │   └── index.js           # Server entry point
│   └── 🤖 AI Integration (Google Gemini)
├── 🛠️ Development Tools
│   ├── scripts/               # Custom build scripts
│   │   ├── dev.js            # Enhanced dev server
│   │   ├── build.js          # Production build
│   │   └── analyze.js        # Project analysis
│   ├── 📋 Configuration
│   │   ├── vite.config.ts    # Vite configuration
│   │   ├── tsconfig.json     # TypeScript config
│   │   ├── tailwind.config.js # Tailwind CSS
│   │   └── eslint.config.js  # ESLint rules
│   └── 📚 Documentation
│       ├── docs/             # Feature documentation
│       ├── design.md         # Technical design
│       └── tasks.md          # Development roadmap
```

## �️ Tevch Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** with dark mode support
- **Lucide React** for consistent iconography
- **React Router DOM** for navigation
- **React DatePicker** and **React Time Picker** for date/time inputs

### Backend
- **Express.js** with TypeScript support
- **Google Generative AI** (@google/generative-ai) for AI planning
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration

### Development & Build
- **TypeScript** with strict mode enabled
- **ESLint** with React and TypeScript rules
- **PostCSS** with Autoprefixer
- **Custom build scripts** for enhanced development experience

## 🎯 Core Functionality

### Goal Management System
- **PlannerForm**: Comprehensive goal creation with validation
- **GoalCard**: Rich goal display with progress indicators
- **Goal Types**: Full TypeScript definitions for type safety
- **Status Tracking**: Active, completed, and paused states

### AI Planning Engine
- **AIGoalPlanner**: Natural language goal processing
- **Strategy Selection**: Multiple AI-generated approaches
- **Task Generation**: Automatic daily task creation
- **Plan Optimization**: Time-based task scheduling

### Task Management
- **TaskItem**: Interactive task components with completion tracking
- **Daily Scheduling**: Automatic task distribution across timeline
- **Progress Visualization**: Real-time progress bars and statistics
- **Category System**: Daily tasks, milestones, and reviews

### Dashboard Customization
- **DashboardCustomization**: Main customization interface
- **Card System**: Photo, quote, progress, notes, and task cards
- **Drag-and-Drop**: HTML5 drag API with touch support
- **Storage Management**: Persistent layout with migration support

### Data Persistence
- **localStorage Service**: Robust browser storage with error handling
- **Custom Hooks**: Reactive state management with useGoals, useTasks
- **Export/Import**: Complete data backup and restore
- **Schema Migration**: Automatic data structure updates

## 🎨 User Experience

### Personalization
- **First-Time Setup**: Guided onboarding experience
- **Personalized Welcome**: Time-based greetings with user names
- **Theme System**: Light, dark, and auto themes
- **Custom Layouts**: Drag-and-drop dashboard customization

### Mobile Optimization
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Touch Interactions**: Optimized for touch devices
- **Progressive Web App**: Installable with offline capabilities
- **Performance**: Lazy loading and optimized rendering

### Accessibility
- **WCAG 2.1 Compliance**: Full accessibility support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Focus Management**: Proper focus handling throughout

## 🔧 Development

### Available Scripts

- `npm run dev` - Start fullstack development servers
- `npm run build` - Build for production with optimizations
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with TypeScript support
- `npm run analyze` - Analyze project structure and dependencies
- `npm start` - Alias for `npm run dev`

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency enforcement
- **Custom Scripts**: Enhanced development workflow
- **Environment Configuration**: Flexible environment setup

### Testing Strategy

- **Unit Tests**: Component and hook testing
- **Integration Tests**: Workflow and feature testing
- **Accessibility Tests**: WCAG compliance verification
- **Performance Tests**: Load time and interaction optimization

## 📦 Deployment

### Production Build
```bash
npm run build
```

The `dist` folder contains the optimized application ready for deployment.

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN Deployment**: Any static file hosting service
- **Self-Hosted**: Upload `dist` folder to web server
- **Docker**: Containerized deployment ready

### Environment Configuration

Create `.env` file for AI features:
```env
GEMINI_API_KEY=your_google_gemini_api_key
REACT_APP_NETWORK_HOST=127.0.0.1
```

## 🔐 Privacy & Security

- **Local-First**: All user data stored in browser localStorage
- **No Tracking**: Zero analytics, cookies, or user tracking
- **Offline Capable**: Full functionality without internet
- **Data Ownership**: Complete user control over data
- **IP Security**: Backend access control for API endpoints
- **HTTPS Ready**: Secure deployment configuration

## 🚧 Development Status

### Completed Features ✅
- Core goal and task management system
- AI-powered planning with Google Gemini
- Customizable dashboard with drag-and-drop
- Responsive design and mobile optimization
- Data persistence and export/import
- Theme system and personalization
- Comprehensive error handling

### In Progress 🔄
- Enhanced testing suite
- Performance optimizations
- Additional card types for dashboard
- Advanced AI planning strategies

### Planned Features 📋
- Cloud synchronization (optional)
- Collaborative goal sharing
- Advanced analytics and insights
- Plugin system for extensibility

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`npm install`)
4. Start development server (`npm run dev`)
5. Make your changes with tests
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Component Structure**: Organized by feature
- **Testing**: Include tests for new features
- **Documentation**: Update docs for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the excellent framework
- **Google** for Gemini AI integration
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful, consistent icons
- **Vite** for the fast build tool
- **TypeScript** for type safety and developer experience

---

**Transform your goals into achievements with AI-powered planning!** 🚀✨

*Built with ❤️ using modern web technologies*