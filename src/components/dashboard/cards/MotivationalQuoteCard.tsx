import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Quote, Edit3, Trash2, X, Shuffle, Plus } from 'lucide-react';
import { DashboardCard } from '../../../types/dashboard';
import { Button } from '../../common/Button';

interface MotivationalQuoteCardProps {
  card: DashboardCard;
  isCustomizing: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
}

interface QuoteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, author: string, category: string) => void;
  initialData?: {
    text: string;
    author?: string;
    category?: string;
  };
}

// Predefined motivational quotes library
const PREDEFINED_QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "resilience"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "persistence"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "mindset"
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: "self-improvement"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "growth"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "achievement"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
    category: "success"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
    category: "hard work"
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Unknown",
    category: "ambition"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
    category: "endurance"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
    category: "daily motivation"
  }
];

const QUOTE_CATEGORIES = [
  'motivation',
  'perseverance',
  'dreams',
  'resilience',
  'persistence',
  'action',
  'mindset',
  'self-improvement',
  'growth',
  'achievement',
  'success',
  'hard work',
  'ambition',
  'endurance',
  'daily motivation'
];

const QuoteEditModal: React.FC<QuoteEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'library'>('custom');
  const [customText, setCustomText] = useState(initialData?.text || '');
  const [customAuthor, setCustomAuthor] = useState(initialData?.author || '');
  const [customCategory, setCustomCategory] = useState(initialData?.category || 'motivation');
  const [selectedQuote, setSelectedQuote] = useState<typeof PREDEFINED_QUOTES[0] | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredQuotes = filterCategory === 'all' 
    ? PREDEFINED_QUOTES 
    : PREDEFINED_QUOTES.filter(quote => quote.category === filterCategory);

  const handleSave = () => {
    if (activeTab === 'custom') {
      if (!customText.trim()) {
        alert('Please enter a quote text');
        return;
      }
      onSave(customText.trim(), customAuthor.trim(), customCategory);
    } else if (selectedQuote) {
      onSave(selectedQuote.text, selectedQuote.author, selectedQuote.category);
    }
    onClose();
  };

  const getRandomQuote = () => {
    const randomQuote = PREDEFINED_QUOTES[Math.floor(Math.random() * PREDEFINED_QUOTES.length)];
    setSelectedQuote(randomQuote);
  };

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[2147483647]"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Quote' : 'Add Motivational Quote'}
            </h3>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Custom Quote
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Quote Library
            </button>
          </div>

          {/* Custom Quote Tab */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quote Text *
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter your motivational quote..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">{customText.length}/300 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author (optional)
                </label>
                <input
                  type="text"
                  value={customAuthor}
                  onChange={(e) => setCustomAuthor(e.target.value)}
                  placeholder="Quote author..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="quote-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="quote-category"
                  aria-label="Quote Category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {QUOTE_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quote Library Tab */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <select
                  id="filter-category"
                  aria-label="Filter by Category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {QUOTE_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={getRandomQuote}
                  variant="outline"
                  size="sm"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Random
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredQuotes.map((quote, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuote(quote)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedQuote === quote
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <p className="text-sm text-gray-900 dark:text-white mb-1">
                      "{quote.text}"
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      — {quote.author} • {quote.category}
                    </p>
                  </button>
                ))}
              </div>

              {selectedQuote && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Selected Quote:</h4>
                  <p className="text-blue-800 dark:text-blue-200 mb-1">"{selectedQuote.text}"</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    — {selectedQuote.author} • {selectedQuote.category}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                (activeTab === 'custom' && !customText.trim()) ||
                (activeTab === 'library' && !selectedQuote)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {initialData ? 'Update Quote' : 'Add Quote'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const MotivationalQuoteCard: React.FC<MotivationalQuoteCardProps> = ({
  card,
  isCustomizing,
  onUpdate,
  onDelete,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const quoteConfig = card.config.quote;

  const handleSaveQuote = (text: string, author: string, category: string) => {
    onUpdate(card.id, {
      config: {
        ...card.config,
        quote: {
          text,
          author: author || undefined,
          category: category || undefined,
        },
      },
    });
  };

  // If no quote configured, show setup state
  if (!quoteConfig?.text) {
    return (
      <>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200 group relative min-h-[320px] w-full flex flex-col justify-center">
          {isCustomizing && (
            <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity">
              <Button
                onClick={() => onDelete(card.id)}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-4">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quote Card</h3>
            <p className="text-white/70 text-sm mb-4 px-2">
              Add motivational quotes to inspire your daily work
            </p>
            <Button
              onClick={() => setShowEditModal(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Quote
            </Button>
          </div>
        </div>

        <QuoteEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveQuote}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200 group relative min-h-[320px] w-full flex flex-col justify-center">
        {isCustomizing && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity">
            <Button
              onClick={() => setShowEditModal(true)}
              variant="outline"
              size="sm"
              className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(card.id)}
              variant="outline"
              size="sm"
              className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}

        <div className="text-center px-2">
          <Quote className="w-8 h-8 text-white/60 mx-auto mb-4" />
          
          <blockquote className="text-white text-base font-medium leading-relaxed mb-4 italic line-clamp-4">
            "{quoteConfig.text}"
          </blockquote>
          
          {quoteConfig.author && (
            <cite className="text-white/80 text-sm font-medium not-italic block mb-2">
              — {quoteConfig.author}
            </cite>
          )}
          
          {quoteConfig.category && (
            <div className="mt-3">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/20 text-white/80 font-medium">
                {quoteConfig.category.charAt(0).toUpperCase() + quoteConfig.category.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <QuoteEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveQuote}
        initialData={quoteConfig}
      />
    </>
  );
};