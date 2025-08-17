# Design Document

## Overview

The dashboard customization feature will transform the existing static dashboard into a dynamic, user-configurable workspace. Users will be able to add, arrange, and manage various types of cards through an intuitive customization interface. The design leverages the existing React/TypeScript architecture and integrates seamlessly with the current goal planning system.

## Architecture

### Component Hierarchy
```
Dashboard
├── DashboardCustomizer (new)
│   ├── CustomizationButton (new)
│   ├── CustomizationPanel (new)
│   └── CardTypeSelector (new)
├── DashboardGrid (new)
│   ├── PhotoCard (new)
│   ├── MotivationalQuoteCard (new)
│   ├── ProjectProgressCard (new)
│   ├── QuickNotesCard (new)
│   └── TaskSummaryCard (new)
└── CardManager (new)
    ├── CardEditor (new)
    └── CardControls (new)
```

### State Management
The customization system will use React's built-in state management with localStorage persistence:

- **Dashboard Configuration State**: Manages card layout, positions, and configurations
- **Card Data State**: Stores individual card content and settings
- **Customization Mode State**: Controls edit/view modes and UI interactions

### Data Flow
1. User clicks customization button → Opens customization panel
2. User selects card type → Creates new card instance
3. Card configuration → Saves to localStorage
4. Dashboard renders → Loads saved configuration and displays cards

## Components and Interfaces

### Core Interfaces

```typescript
interface DashboardCard {
  id: string;
  type: 'photo' | 'quote' | 'progress' | 'notes' | 'tasks';
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: CardConfig;
  createdAt: Date;
  updatedAt: Date;
}

interface CardConfig {
  photo?: {
    imageUrl: string;
    caption?: string;
    altText: string;
  };
  quote?: {
    text: string;
    author?: string;
    category?: string;
  };
  progress?: {
    goalId?: string;
    showTasks: boolean;
    showPercentage: boolean;
  };
  notes?: {
    title: string;
    content: string;
    color?: string;
  };
  tasks?: {
    filter: 'today' | 'upcoming' | 'overdue';
    maxItems: number;
  };
}

interface DashboardLayout {
  cards: DashboardCard[];
  gridSize: { columns: number; rows: number };
  version: number;
}
```

### Component Specifications

#### 1. CustomizationButton
- **Purpose**: Entry point for dashboard customization
- **Location**: Floating button in dashboard header area
- **States**: Normal, Active (when customization panel is open)
- **Styling**: Matches existing button design with gradient and hover effects

#### 2. CustomizationPanel
- **Purpose**: Modal/sidebar interface for adding new cards
- **Layout**: Grid of card type options with preview thumbnails
- **Animation**: Slide-in from right side with backdrop blur
- **Responsive**: Adapts to mobile with bottom sheet layout

#### 3. DashboardGrid
- **Purpose**: Container for all dashboard cards with drag-and-drop support
- **Grid System**: CSS Grid with responsive breakpoints
- **Interactions**: Drag to reorder, resize handles, hover controls
- **Empty State**: Shows customization prompt when no cards exist

#### 4. Card Components

**PhotoCard**
- Image display with optional caption
- Upload interface with drag-and-drop support
- Image optimization and validation
- Responsive sizing with aspect ratio preservation

**MotivationalQuoteCard**
- Typography-focused design with quote and author
- Predefined quote library with categories
- Custom quote input with character limits
- Random quote rotation option

**ProjectProgressCard**
- Integration with existing goal system
- Progress visualization (progress bars, charts)
- Task completion statistics
- Goal selection dropdown

**QuickNotesCard**
- Simple text editor with formatting options
- Auto-save functionality
- Color themes for organization
- Expandable/collapsible content

**TaskSummaryCard**
- Integration with existing task system
- Filtered task lists (today, upcoming, overdue)
- Quick task completion toggle
- Task count badges

## Data Models

### Storage Schema
```typescript
// localStorage key: 'dashboard-layout'
interface StoredDashboardData {
  layout: DashboardLayout;
  cardData: Record<string, CardConfig>;
  preferences: {
    gridSize: 'compact' | 'comfortable' | 'spacious';
    theme: 'auto' | 'light' | 'dark';
    animations: boolean;
  };
}
```

### Migration Strategy
- Version-based schema with backward compatibility
- Graceful fallback to default layout for corrupted data
- Export/import functionality for backup and sharing

## Error Handling

### Image Upload Errors
- File size validation (max 5MB)
- File type validation (JPEG, PNG, WebP, GIF)
- Network error handling with retry mechanism
- Fallback to placeholder images

### Data Persistence Errors
- localStorage quota exceeded handling
- Corrupted data recovery with default fallback
- Sync conflict resolution for concurrent sessions
- User notification system for critical errors

### Component Error Boundaries
- Individual card error isolation
- Graceful degradation with error placeholders
- Error reporting for debugging
- Recovery actions for users

## Testing Strategy

### Unit Tests
- Card component rendering and interactions
- Data persistence and retrieval functions
- Configuration validation and sanitization
- Error handling edge cases

### Integration Tests
- Dashboard layout persistence across sessions
- Card drag-and-drop functionality
- Customization panel workflows
- Goal/task system integration

### User Experience Tests
- Responsive design across device sizes
- Performance with multiple cards
- Accessibility compliance (WCAG 2.1)
- Cross-browser compatibility

### Performance Considerations
- Lazy loading for card components
- Image optimization and caching
- Debounced save operations
- Virtual scrolling for large card collections

## Implementation Phases

### Phase 1: Core Infrastructure
- DashboardGrid component with basic layout
- CustomizationButton and panel UI
- Basic card types (Photo, Quote)
- localStorage persistence

### Phase 2: Advanced Cards
- ProjectProgressCard with goal integration
- QuickNotesCard with rich text editing
- TaskSummaryCard with filtering
- Drag-and-drop reordering

### Phase 3: Polish and Enhancement
- Card resize functionality
- Export/import capabilities
- Advanced customization options
- Performance optimizations

## Integration Points

### Existing Goal System
- Read goal data for progress cards
- Subscribe to goal updates for real-time sync
- Maintain data consistency across components

### Task Management
- Access task data for summary cards
- Real-time task completion updates
- Filter and sort capabilities

### Theme System
- Inherit from existing ThemeContext
- Card-specific theme overrides
- Dark/light mode compatibility

### User Preferences
- Extend existing personalization system
- Dashboard layout as user preference
- Sync with existing settings storage