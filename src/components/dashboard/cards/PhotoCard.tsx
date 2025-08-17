import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Image as ImageIcon, Edit3, Trash2, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { DashboardCard } from '../../../types/dashboard';
import { Button } from '../../common/Button';
import styles from './PhotoCard.module.css';

interface PhotoCardProps {
  card: DashboardCard;
  isCustomizing: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
}

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string, caption: string, altText: string) => void;
  initialData?: {
    imageUrl: string;
    caption?: string;
    altText: string;
  };
}

interface FullscreenImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
  caption?: string;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [caption, setCaption] = useState(initialData?.caption || '');
  const [altText, setAltText] = useState(initialData?.altText || '');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Block body scroll when modal is open and ensure proper stacking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    };
  }, [isOpen]);

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert file to base64 for local storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        if (!altText) {
          setAltText(file.name.replace(/\.[^/.]+$/, ''));
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read the file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      // Handle error without reference to the error object
      setError('Failed to upload image');
      setUploading(false);
    }
  }, [altText]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleSave = () => {
    if (!imageUrl) {
      setError('Please select an image');
      return;
    }
    if (!altText.trim()) {
      setError('Please provide alt text for accessibility');
      return;
    }

    onSave(imageUrl, caption, altText.trim());
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Photo' : 'Add Photo'}
            </h3>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-0">
            {/* Image Upload Area */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-gray-900 dark:text-white">Upload Image</h4>
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={altText || 'Uploaded image'}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    onClick={() => setImageUrl('')}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors min-h-[300px] flex flex-col justify-center ${dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                    Drag and drop an image here, or
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 mx-auto"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload photo"
                    title="Choose a photo to upload"
                  />
                  <p className="text-sm text-gray-500 mt-6">
                    JPEG, PNG, WebP, or GIF (max 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-gray-900 dark:text-white">Photo Details</h4>

              {/* Caption Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption for your photo..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-2">{caption.length}/100 characters</p>
              </div>

              {/* Alt Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Alt Text (required)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image for accessibility..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  maxLength={150}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">{altText.length}/150 characters</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-6 pt-6">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 py-3 text-base min-w-[120px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!imageUrl || !altText.trim() || uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 text-base min-w-[140px]"
                >
                  {initialData ? 'Update Photo' : 'Add Photo'}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}


        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const FullscreenImageModal: React.FC<FullscreenImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  altText,
  caption,
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay fullscreen-modal" role="dialog" aria-modal="true">
      {/* Header with controls */}
      <div className="fullscreen-controls">
        <div className="fullscreen-controls-left">
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
            disabled={zoom >= 5}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          size="sm"
          className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* CSS variables need to be dynamic for the zoom/pan functionality */}
        <img
          src={imageUrl}
          alt={altText}
          className={`${styles.zoomableImage} ${zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`
          }}
          draggable={false}
        />
      </div>

      {/* Caption overlay */}
      {caption && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3 inline-block max-w-2xl">
            <p className="text-white text-sm leading-relaxed">{caption}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-right">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-white/80">
          <p>Scroll to zoom • Drag to pan • ESC to close</p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const PhotoCard: React.FC<PhotoCardProps> = ({
  card,
  isCustomizing,
  onUpdate,
  onDelete,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [showInlineControls, setShowInlineControls] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [inlineZoom, setInlineZoom] = useState<number>((card.config.photo as any)?.__inlineZoom || 1);
  const [inlineRotate, setInlineRotate] = useState<number>((card.config.photo as any)?.__inlineRotate || 0);

  const photoConfig = card.config.photo;

  const handleSavePhoto = (imageUrl: string, caption: string, altText: string) => {
    onUpdate(card.id, {
      config: {
        ...card.config,
        photo: {
          imageUrl,
          caption: caption || undefined,
          altText,
        },
      },
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // If no photo configured, show setup state
  if (!photoConfig?.imageUrl) {
    return (
      <>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200 group relative h-[280px] w-full flex flex-col justify-center">
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
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Photo Card</h3>
            <p className="text-white/70 text-sm mb-4">
              Add a personal photo to customize your dashboard
            </p>
            <Button
              onClick={() => setShowUploadModal(true)}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Photo
            </Button>
          </div>
        </div>

        <PhotoUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSave={handleSavePhoto}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-200 group relative w-full flex flex-col">
        {isCustomizing && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity z-10">
            <Button
              onClick={() => setShowUploadModal(true)}
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

        {imageError ? (
          <div className="aspect-[4/3] flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <div className="text-center p-4">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Failed to load image</p>
              <Button
                onClick={() => setShowUploadModal(true)}
                size="sm"
                variant="outline"
                className="mt-2"
              >
                Replace Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="aspect-[4/3] overflow-hidden relative">
            <img
              src={photoConfig.imageUrl}
              alt={photoConfig.altText}
              className={`${styles.cardImage} w-full h-full object-cover transition-transform duration-200`}
              onError={handleImageError}
              loading="lazy"
              onClick={() => setShowInlineControls(prev => !prev)}
              style={{
                transform: `scale(${inlineZoom}) rotate(${inlineRotate}deg)`
              }}
            />

            {/* Inline controls overlay (visible after single click) */}
            {showInlineControls && (
              <div className={`${styles.inlineControls} absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none`}>
                <div className="pointer-events-auto flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-md p-1">
                  <Button
                    onClick={() => {
                      setShowUploadModal(true);
                      setShowInlineControls(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setInlineZoom(prev => Math.min(5, Math.round((prev + 0.25) * 100) / 100));
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setInlineZoom(prev => Math.max(0.5, Math.round((prev - 0.25) * 100) / 100));
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setInlineRotate(prev => (prev + 90) % 360);
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="pointer-events-auto">
                  <Button
                    onClick={() => {
                      setShowInlineControls(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {photoConfig.caption && (
          <div className="p-4 flex-shrink-0">
            <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
              {photoConfig.caption}
            </p>
          </div>
        )}
      </div>

      <PhotoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={handleSavePhoto}
        initialData={photoConfig}
      />

      <FullscreenImageModal
        isOpen={showFullscreenModal}
        onClose={() => setShowFullscreenModal(false)}
        imageUrl={photoConfig.imageUrl}
        altText={photoConfig.altText}
        caption={photoConfig.caption}
      />
    </>
  );
};