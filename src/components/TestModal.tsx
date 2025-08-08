import React from 'react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestModal: React.FC<TestModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Test Modal - Scroll Performance Check</h2>
          <button 
            onClick={onClose}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
        <div className="p-4">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="p-4 border-b">
              <h3 className="font-bold">Item {i + 1}</h3>
              <p>This is test content to check scroll performance. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              <div className="mt-2 flex space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Tag {i}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Category</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};