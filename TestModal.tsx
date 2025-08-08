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
                    <h2>Test Modal</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className="p-4">
                    {Array.from({ length: 50 }, (_, i) => (
                        <div key={i} className="p-4 border-b">
                            <h3>Item {i + 1}</h3>
                            <p>This is test content to check scroll performance. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};