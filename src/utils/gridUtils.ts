// Grid positioning and layout utilities

import { DashboardCard } from '../types/dashboard';

export interface GridPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
}

// Default grid configurations for different screen sizes
export const GRID_CONFIGS = {
  mobile: { columns: 1, rows: 10, gap: 16 },
  tablet: { columns: 2, rows: 8, gap: 20 },
  desktop: { columns: 3, rows: 6, gap: 24 },
  wide: { columns: 4, rows: 5, gap: 24 },
} as const;

// Get appropriate grid config based on screen width
export const getGridConfig = (screenWidth: number): GridConfig => {
  if (screenWidth < 640) return GRID_CONFIGS.mobile;
  if (screenWidth < 1024) return GRID_CONFIGS.tablet;
  if (screenWidth < 1280) return GRID_CONFIGS.desktop;
  return GRID_CONFIGS.wide;
};

// Find the next available position in the grid
export const findNextAvailablePosition = (
  existingCards: DashboardCard[],
  gridConfig: GridConfig,
  cardSize: { width: number; height: number } = { width: 1, height: 1 }
): GridPosition => {
  const occupiedPositions = new Set<string>();
  
  // Mark all occupied positions
  existingCards.forEach(card => {
    for (let x = card.position.x; x < card.position.x + card.size.width; x++) {
      for (let y = card.position.y; y < card.position.y + card.size.height; y++) {
        occupiedPositions.add(`${x},${y}`);
      }
    }
  });

  // Find first available position that can fit the card
  for (let y = 0; y <= gridConfig.rows - cardSize.height; y++) {
    for (let x = 0; x <= gridConfig.columns - cardSize.width; x++) {
      let canFit = true;
      
      // Check if the card can fit at this position
      for (let dx = 0; dx < cardSize.width && canFit; dx++) {
        for (let dy = 0; dy < cardSize.height && canFit; dy++) {
          if (occupiedPositions.has(`${x + dx},${y + dy}`)) {
            canFit = false;
          }
        }
      }
      
      if (canFit) {
        return { x, y, width: cardSize.width, height: cardSize.height };
      }
    }
  }

  // If no position found, place at the end
  return { x: 0, y: gridConfig.rows, width: cardSize.width, height: cardSize.height };
};

// Check if a position is valid within the grid
export const isValidPosition = (
  position: GridPosition,
  gridConfig: GridConfig,
  existingCards: DashboardCard[] = [],
  excludeCardId?: string
): boolean => {
  // Check bounds
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x + position.width > gridConfig.columns ||
    position.y + position.height > gridConfig.rows
  ) {
    return false;
  }

  // Check for overlaps with existing cards
  const occupiedPositions = new Set<string>();
  existingCards
    .filter(card => card.id !== excludeCardId)
    .forEach(card => {
      for (let x = card.position.x; x < card.position.x + card.size.width; x++) {
        for (let y = card.position.y; y < card.position.y + card.size.height; y++) {
          occupiedPositions.add(`${x},${y}`);
        }
      }
    });

  // Check if any part of the new position overlaps
  for (let x = position.x; x < position.x + position.width; x++) {
    for (let y = position.y; y < position.y + position.height; y++) {
      if (occupiedPositions.has(`${x},${y}`)) {
        return false;
      }
    }
  }

  return true;
};

// Convert grid position to CSS styles
export const gridPositionToCSS = (
  position: GridPosition
): React.CSSProperties => {
  return {
    gridColumn: `${position.x + 1} / span ${position.width}`,
    gridRow: `${position.y + 1} / span ${position.height}`,
  };
};

// Calculate optimal card size based on content type
export const getOptimalCardSize = (cardType: DashboardCard['type']): { width: number; height: number } => {
  switch (cardType) {
    case 'photo':
      return { width: 1, height: 1 }; // Square for photos
    case 'quote':
      return { width: 1, height: 1 }; // Square for quotes
    case 'progress':
      return { width: 1, height: 1 }; // Square for progress
    case 'notes':
      return { width: 1, height: 1 }; // Square for notes
    case 'tasks':
      return { width: 1, height: 1 }; // Square for task lists
    default:
      return { width: 1, height: 1 };
  }
};

// Reorganize cards to fill gaps after deletion
export const reorganizeCards = (
  cards: DashboardCard[],
  gridConfig: GridConfig
): DashboardCard[] => {
  const sortedCards = [...cards].sort((a, b) => {
    if (a.position.y !== b.position.y) {
      return a.position.y - b.position.y;
    }
    return a.position.x - b.position.x;
  });

  const reorganizedCards: DashboardCard[] = [];

  sortedCards.forEach(card => {
    const newPosition = findNextAvailablePosition(
      reorganizedCards,
      gridConfig,
      card.size
    );

    reorganizedCards.push({
      ...card,
      position: { x: newPosition.x, y: newPosition.y },
    });
  });

  return reorganizedCards;
};