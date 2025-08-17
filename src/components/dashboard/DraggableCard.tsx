import React, { useState, useRef } from 'react';
import { DashboardCard } from '../../types/dashboard';
import { Goal, Task } from '../../types';
import { CardRenderer } from './CardRenderer';
import { Move } from 'lucide-react';

interface DraggableCardProps {
  card: DashboardCard;
  index: number;
  isCustomizing: boolean;
  // when true, the card can be dragged (may be enabled outside of customization mode)
  draggingEnabled?: boolean;
  isDragging: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
  onDragStart: (cardId: string, index: number) => void;
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  // Additional props for specific card types
  goals?: Goal[];
  tasks?: Task[];
  getTasksForGoal?: (goalId: string) => Task[];
  getTodaysTasks?: () => Task[];
  getOverdueTasks?: () => Task[];
  onToggleTask?: (taskId: string, completed: boolean) => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  index,
  isCustomizing,
  draggingEnabled = false,
  isDragging,
  onUpdate,
  onDelete,
  onEdit,
  onDragStart,
  onDragEnd,
  onDragOver,
  goals = [],
  tasks = [],
  getTasksForGoal = () => [],
  getTodaysTasks = () => [],
  getOverdueTasks = () => [],
  onToggleTask = () => {},
}) => {
  const [dragOver, setDragOver] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const pointerDownRef = useRef(false);
  const startedDragRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const touchMoveHandlerRef = useRef<((e: TouchEvent) => void) | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggingEnabled) {
      e.preventDefault();
      return;
    }

    // Prevent native dragstart from activating on a simple click. Only allow
    // the native drag to proceed if the pointer moved past the threshold.
    try {
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      if (Math.hypot(dx, dy) <= 6 && !startedDragRef.current) {
        // Too small movement - treat as click, ignore native dragstart
        e.preventDefault();
        return;
      }
    } catch (e) {
      void e;
    }

    e.dataTransfer.effectAllowed = 'move';
    // expose the card id under multiple mime types so drop targets can read it
    try {
      e.dataTransfer.setData('text/plain', card.id);
      e.dataTransfer.setData('text/html', card.id);
      e.dataTransfer.setData('application/x-card-id', card.id);
      // Create a lightweight clone of the card element to use as the drag image.
      // This avoids issues where inner <img draggable={false}> prevents a proper
      // drag ghost from sticking to the cursor (notably for PhotoCard).
      try {
        const node = dragRef.current;
        if (node && typeof e.dataTransfer.setDragImage === 'function') {
          const clone = node.cloneNode(true) as HTMLElement;
          // Style the clone so it doesn't affect layout and looks like a card
          clone.style.position = 'absolute';
          clone.style.top = '-9999px';
          clone.style.left = '-9999px';
          clone.style.width = `${node.getBoundingClientRect().width}px`;
          clone.style.pointerEvents = 'none';
          document.body.appendChild(clone);
          // center the pointer horizontally and place vertically near the top
          const rect = node.getBoundingClientRect();
          const offsetX = rect.width / 2;
          const offsetY = 16;
          e.dataTransfer.setDragImage(clone, offsetX, offsetY);
          // schedule removal of the temporary clone
          setTimeout(() => {
            try {
              document.body.removeChild(clone);
            } catch (err) {
              void err;
            }
          }, 0);
        }
      } catch (err) {
        void err;
      }
    } catch {
      // Some browsers may throw when setting multiple types in certain environments — ignore
    }
    onDragStart(card.id, index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnd();
  setDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  // Always set dragOver visual and inform parent of current hover index so
  // the preview ordering can update continuously as the pointer moves.
  if (!dragOver) setDragOver(true);
  onDragOver(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragOver to false if we're leaving the card entirely
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setDragOver(false);
  // notify parent we've left this card
  onDragOver(-1);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div
      ref={dragRef}
      draggable={draggingEnabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      // Capture mousedown/touchstart and only start drag after a small movement threshold
      onMouseDownCapture={(e) => {
        if (!draggingEnabled) return;
        pointerDownRef.current = true;
        startedDragRef.current = false;
        startPosRef.current = { x: e.clientX, y: e.clientY };

        // attach window move handler
        mouseMoveHandlerRef.current = (ev: MouseEvent) => {
          if (!pointerDownRef.current || startedDragRef.current) return;
          const dx = ev.clientX - startPosRef.current.x;
          const dy = ev.clientY - startPosRef.current.y;
          if (Math.hypot(dx, dy) > 6) {
            startedDragRef.current = true;
            onDragStart(card.id, index);
          }
        };

        window.addEventListener('mousemove', mouseMoveHandlerRef.current);
        // cleanup on mouseup
        const upHandler = () => {
          // If we started a synthetic drag via movement threshold, finalize it
          if (startedDragRef.current) {
            try {
              onDragEnd();
            } catch (e) {
              // ignore errors from synthetic drag finalization
              void e;
            }
          }
          pointerDownRef.current = false;
          startedDragRef.current = false;
          if (mouseMoveHandlerRef.current) {
            window.removeEventListener('mousemove', mouseMoveHandlerRef.current);
            mouseMoveHandlerRef.current = null;
          }
        };
        window.addEventListener('mouseup', upHandler, { once: true });
      }}
      onTouchStartCapture={(e) => {
        if (!draggingEnabled) return;
        const t = e.touches[0];
        pointerDownRef.current = true;
        startedDragRef.current = false;
        startPosRef.current = { x: t.clientX, y: t.clientY };

        touchMoveHandlerRef.current = (ev: TouchEvent) => {
          if (!pointerDownRef.current || startedDragRef.current) return;
          const touch = ev.touches[0];
          if (!touch) return;
          const dx = touch.clientX - startPosRef.current.x;
          const dy = touch.clientY - startPosRef.current.y;
          if (Math.hypot(dx, dy) > 6) {
            startedDragRef.current = true;
            onDragStart(card.id, index);
          }
        };

        window.addEventListener('touchmove', touchMoveHandlerRef.current as EventListener);
        const touchEnd = () => {
          // If we started a synthetic drag via movement threshold, finalize it
          if (startedDragRef.current) {
            try {
              onDragEnd();
            } catch (e) {
              // ignore errors from synthetic drag finalization
              void e;
            }
          }
          pointerDownRef.current = false;
          startedDragRef.current = false;
          if (touchMoveHandlerRef.current) {
            window.removeEventListener('touchmove', touchMoveHandlerRef.current as EventListener);
            touchMoveHandlerRef.current = null;
          }
        };
        window.addEventListener('touchend', touchEnd, { once: true });
      }}
      className={`
        relative transition-all duration-200
        ${draggingEnabled ? 'cursor-move' : 'cursor-default'}
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'opacity-100 scale-100 rotate-0'}
        ${dragOver && draggingEnabled ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}
    >
      {/* Drag Handle - Only visible when customizing */}
      {isCustomizing && (
        <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Make the small handle itself draggable so users can reliably start a drag from the handle */}
          <div
            draggable={draggingEnabled}
            onDragStart={handleDragStart}
            onMouseDown={(e) => e.stopPropagation()}
            className="bg-blue-500 text-white p-1 rounded-full shadow-lg cursor-move"
            aria-hidden
          >
            <Move className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Drop Zone Indicator */}
      {dragOver && isCustomizing && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-xl z-10 flex items-center justify-center">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Drop here
          </div>
        </div>
      )}

      <CardRenderer
        card={card}
        isCustomizing={isCustomizing}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={onEdit}
        goals={goals}
        tasks={tasks}
        getTasksForGoal={getTasksForGoal}
        getTodaysTasks={getTodaysTasks}
        getOverdueTasks={getOverdueTasks}
        onToggleTask={onToggleTask}
      />
    </div>
  );
};