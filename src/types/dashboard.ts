// Dashboard customization type definitions

export interface DashboardCard {
  id: string;
  type: 'photo' | 'quote' | 'progress' | 'notes' | 'tasks';
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: CardConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardConfig {
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

export interface DashboardLayout {
  cards: DashboardCard[];
  gridSize: { columns: number; rows: number };
  version: number;
}

export interface StoredDashboardData {
  layout: DashboardLayout;
  cardData: Record<string, CardConfig>;
  preferences: {
    gridSize: 'compact' | 'comfortable' | 'spacious';
    theme: 'auto' | 'light' | 'dark';
    animations: boolean;
  };
}

export interface CardTypeOption {
  id: string;
  type: DashboardCard['type'];
  name: string;
  description: string;
  icon: string;
  category: 'personal' | 'productivity' | 'project';
}

export interface DashboardState {
  cards: DashboardCard[];
  isCustomizing: boolean;
  selectedCard: string | null;
  draggedCard: string | null;
}