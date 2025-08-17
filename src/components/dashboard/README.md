# Dashboard Customization Components

This directory contains all components related to the dashboard customization feature, which allows users to personalize their dashboard with various types of cards.

## Quick Start

```tsx
import { DashboardCustomization } from './components/dashboard/DashboardCustomization';

function App() {
  return (
    <DashboardCustomization
      goals={goals}
      tasks={tasks}
      getTasksForGoal={getTasksForGoal}
      getTodaysTasks={getTodaysTasks}
      getOverdueTasks={getOverdueTasks}
      onToggleTask={handleToggleTask}
    />
  );
}
```

## Component Structure

### Core Components

- **`DashboardCustomization.tsx`** - Main component that orchestrates the entire feature
- **`CustomizationButton.tsx`** - Floating button to toggle customization mode
- **`CustomizationPanel.tsx`** - Modal for selecting card types
- **`DashboardGrid.tsx`** - Layout container with empty state handling
- **`DragDropContainer.tsx`** - Handles drag-and-drop reordering
- **`CardRenderer.tsx`** - Routes to appropriate card component
- **`CardManager.tsx`** - Manages card operations with confirmations

### Card Components

All card components are located in the `cards/` subdirectory:

- **`PhotoCard.tsx`** - Image upload and display with captions
- **`MotivationalQuoteCard.tsx`** - Custom and predefined motivational quotes
- **`ProjectProgressCard.tsx`** - Goal progress tracking and visualization
- **`QuickNotesCard.tsx`** - Simple note-taking with color themes
- **`TaskSummaryCard.tsx`** - Filtered task lists with quick actions

### Utility Components

- **`ErrorBoundary.tsx`** - Error isolation and recovery
- **`StorageNotification.tsx`** - Storage warnings and backup options
- **`MobileOptimizations.tsx`** - Mobile-specific enhancements

## Card Development

### Creating a New Card Type

1. **Create the component** in `cards/NewCardType.tsx`:

```tsx
import React, { useState } from 'react';
import { DashboardCard } from '../../../types/dashboard';

interface NewCardTypeProps {
  card: DashboardCard;
  isCustomizing: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
}

export const NewCardType: React.FC<NewCardTypeProps> = ({
  card,
  isCustomizing,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  // Implementation here
};
```

2. **Update the types** in `types/dashboard.ts`:

```typescript
// Add to DashboardCard type union
type: 'photo' | 'quote' | 'progress' | 'notes' | 'tasks' | 'newtype';

// Add to CardConfig interface
interface CardConfig {
  // ... existing configs
  newtype?: {
    // Your config properties
  };
}
```

3. **Register in CardRenderer** (`CardRenderer.tsx`):

```tsx
case 'newtype':
  return <NewCardType {...commonProps} />;
```

4. **Add to CustomizationPanel** (`CustomizationPanel.tsx`):

```tsx
const cardTypeOptions: CardTypeOption[] = [
  // ... existing options
  {
    id: 'newtype',
    type: 'newtype',
    name: 'New Card Type',
    description: 'Description of your new card type',
    icon: 'YourIcon',
    category: 'productivity', // or 'personal' or 'project'
  },
];
```

5. **Update DashboardCustomization** to handle the new type in `handleCardTypeSelect`.

### Card Component Guidelines

#### Required Props
All card components must accept these props:
- `card: DashboardCard` - The card data
- `isCustomizing: boolean` - Whether in customization mode
- `onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void` - Update handler
- `onDelete: (cardId: string) => void` - Delete handler
- `onEdit: (cardId: string) => void` - Edit handler (optional)

#### State Management
- Use `card.config[cardType]` for card-specific configuration
- Call `onUpdate` to persist changes
- Handle both setup and configured states

#### UI Patterns
- Show setup state when not configured
- Display management controls when `isCustomizing` is true
- Use consistent styling with existing cards
- Include proper loading and error states

#### Example Structure

```tsx
export const ExampleCard: React.FC<ExampleCardProps> = ({
  card,
  isCustomizing,
  onUpdate,
  onDelete,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const config = card.config.example;

  // Setup state - no configuration yet
  if (!config?.configured) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        {/* Setup UI */}
      </div>
    );
  }

  // Configured state - show card content
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 group relative">
      {/* Management controls */}
      {isCustomizing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Edit and delete buttons */}
        </div>
      )}
      
      {/* Card content */}
    </div>
  );
};
```

## Testing

### Running Tests

```bash
# Run all dashboard tests
npm test -- --testPathPattern=dashboard

# Run specific test file
npm test -- DashboardCustomization.test.tsx

# Run with coverage
npm test -- --coverage --testPathPattern=dashboard
```

### Test Categories

1. **Unit Tests** - Individual component behavior
2. **Integration Tests** - Component interactions
3. **Accessibility Tests** - ARIA compliance and keyboard navigation
4. **Performance Tests** - Render optimization and memory usage

### Writing Tests

Follow the existing test patterns:

```tsx
describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent {...props} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockHandler = jest.fn();
    render(<YourComponent onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## Styling Guidelines

### CSS Classes
- Use Tailwind CSS utility classes
- Follow existing color schemes and spacing
- Maintain consistency with the app's design system

### Responsive Design
- Mobile-first approach
- Use responsive grid classes (`sm:`, `md:`, `lg:`, `xl:`)
- Test on various screen sizes

### Animations
- Use CSS transitions for smooth interactions
- Keep animations subtle and purposeful
- Respect user's motion preferences

## Performance Best Practices

### Component Optimization
- Use `React.memo` for expensive components
- Implement proper dependency arrays in hooks
- Avoid unnecessary re-renders

### Storage Efficiency
- Minimize data stored in localStorage
- Implement data compression for large datasets
- Use debounced saves to reduce write operations

### Image Handling
- Compress images before storage
- Implement lazy loading for image cards
- Provide fallbacks for failed loads

## Accessibility Checklist

- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Proper ARIA labels and descriptions
- [ ] Color contrast compliance (WCAG 2.1)
- [ ] Focus management in modals
- [ ] Alternative text for images
- [ ] Semantic HTML structure

## Browser Support

### Minimum Requirements
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Required APIs
- localStorage (for persistence)
- HTML5 Drag and Drop API
- File API (for image uploads)
- CSS Grid (for layout)

## Troubleshooting

### Common Issues

**Cards not saving**
- Check localStorage availability
- Verify browser storage quota
- Look for JavaScript errors in console

**Drag and drop not working**
- Ensure modern browser support
- Check for conflicting event handlers
- Verify touch-action CSS properties on mobile

**Images not displaying**
- Check file size limits (5MB max)
- Verify supported formats (JPEG, PNG, WebP, GIF)
- Look for CORS issues with external images

**Performance issues**
- Clear browser cache and localStorage
- Check for memory leaks in development tools
- Reduce number of cards if experiencing slowdowns

### Debug Mode

Enable debug logging:

```javascript
localStorage.setItem('dashboard-debug', 'true');
```

This will provide additional console output for troubleshooting.

## Contributing

### Pull Request Guidelines
1. Include tests for new functionality
2. Update documentation for API changes
3. Follow existing code style and patterns
4. Test across supported browsers
5. Verify accessibility compliance

### Code Review Checklist
- [ ] Functionality works as expected
- [ ] Tests pass and provide good coverage
- [ ] Code follows established patterns
- [ ] Documentation is updated
- [ ] Accessibility requirements met
- [ ] Performance impact considered
- [ ] Browser compatibility verified