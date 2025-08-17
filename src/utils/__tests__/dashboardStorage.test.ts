/**
 * @jest-environment jsdom
 */

import {
  saveDashboardData,
  loadDashboardData,
  clearDashboardData,
  exportDashboardData,
  importDashboardData,
  checkStorageAvailability,
} from '../dashboardStorage';
import { StoredDashboardData } from '../../types/dashboard';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('dashboardStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveDashboardData', () => {
    it('saves data to localStorage successfully', () => {
      const testData: StoredDashboardData = {
        layout: {
          cards: [],
          gridSize: { columns: 12, rows: 8 },
          version: 1,
        },
        cardData: {},
        preferences: {
          gridSize: 'comfortable',
          theme: 'auto',
          animations: true,
        },
      };

      const result = saveDashboardData(testData);

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'dashboard-layout',
        expect.any(String)
      );
    });

    it('handles localStorage quota exceeded error', () => {
      const testData: StoredDashboardData = {
        layout: {
          cards: Array(10).fill(null).map((_, i) => ({
            id: `card-${i}`,
            type: 'photo',
            position: { x: 0, y: 0 },
            size: { width: 1, height: 1 },
            config: { photo: { imageUrl: 'test.jpg', caption: '', altText: 'test' } },
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          gridSize: { columns: 12, rows: 8 },
          version: 1,
        },
        cardData: {},
        preferences: {
          gridSize: 'comfortable',
          theme: 'auto',
          animations: true,
        },
      };

      // Mock quota exceeded error
      const quotaError = new Error('QuotaExceededError');
      quotaError.name = 'QuotaExceededError';
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw quotaError;
      });

      const result = saveDashboardData(testData);

      expect(result).toBe(true); // Should still succeed with reduced data
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2); // First fails, second succeeds
    });

    it('returns false on other errors', () => {
      const testData: StoredDashboardData = {
        layout: {
          cards: [],
          gridSize: { columns: 12, rows: 8 },
          version: 1,
        },
        cardData: {},
        preferences: {
          gridSize: 'comfortable',
          theme: 'auto',
          animations: true,
        },
      };

      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Generic error');
      });

      const result = saveDashboardData(testData);

      expect(result).toBe(false);
    });
  });

  describe('loadDashboardData', () => {
    it('loads data from localStorage successfully', () => {
      const testData = {
        layout: {
          cards: [{
            id: 'test-card',
            type: 'photo',
            position: { x: 0, y: 0 },
            size: { width: 1, height: 1 },
            config: { photo: { imageUrl: 'test.jpg', caption: '', altText: 'test' } },
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          }],
          gridSize: { columns: 12, rows: 8 },
          version: 1,
        },
        cardData: {},
        preferences: {
          gridSize: 'comfortable',
          theme: 'auto',
          animations: true,
        },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = loadDashboardData();

      expect(result.layout.cards).toHaveLength(1);
      expect(result.layout.cards[0].createdAt).toBeInstanceOf(Date);
      expect(result.layout.cards[0].updatedAt).toBeInstanceOf(Date);
    });

    it('returns default data when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = loadDashboardData();

      expect(result.layout.cards).toEqual([]);
      expect(result.layout.version).toBe(1);
      expect(result.preferences.gridSize).toBe('comfortable');
    });

    it('returns default data on parse error', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const result = loadDashboardData();

      expect(result.layout.cards).toEqual([]);
      expect(result.layout.version).toBe(1);
    });

    it('migrates data from version 0 to 1', () => {
      const oldData = {
        cards: [],
        gridSize: { columns: 12, rows: 8 },
        cardData: {},
        preferences: {
          gridSize: 'comfortable',
          theme: 'auto',
          animations: true,
        },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(oldData));

      const result = loadDashboardData();

      expect(result.layout.version).toBe(1);
      expect(result.layout.cards).toEqual([]);
    });
  });

  describe('clearDashboardData', () => {
    it('removes data from localStorage', () => {
      clearDashboardData();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('dashboard-layout');
    });

    it('handles errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Remove error');
      });

      expect(() => clearDashboardData()).not.toThrow();
    });
  });

  describe('exportDashboardData', () => {
    it('exports data as JSON string', () => {
      const testData = {
        layout: {
          cards: [],
          gridSize: { columns: 12, rows: 8 },
          version: 1,
        },
        cardData: {},
        preferences: {
          gridSize: 'comfortable',
          theme: 'auto',
          animations: true,
        },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = exportDashboardData();

      expect(typeof result).toBe('string');
      expect(JSON.parse(result)).toEqual(expect.objectContaining({
        layout: expect.any(Object),
        cardData: expect.any(Object),
        preferences: expect.any(Object),
      }));
    });
  });

  describe('importDashboardData', () => {
    it('imports valid JSON data', () => {
      const testData = {
        layout: {
          cards: [],
          gridSize: { columns: 12, rows: 8 },
          version: 1,
        },
        cardData: {},
        preferences: {
          gridSize: 'comfortable',
          theme: 'auto',
          animations: true,
        },
      };

      const result = importDashboardData(JSON.stringify(testData));

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('returns false for invalid JSON', () => {
      const result = importDashboardData('invalid json');

      expect(result).toBe(false);
    });
  });

  describe('checkStorageAvailability', () => {
    it('returns available true when localStorage works', () => {
      const result = checkStorageAvailability();

      expect(result.available).toBe(true);
      expect(typeof result.used).toBe('number');
    });

    it('returns available false when localStorage fails', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = checkStorageAvailability();

      expect(result.available).toBe(false);
    });
  });
});