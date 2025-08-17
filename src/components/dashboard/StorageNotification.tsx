import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, HardDrive, Download } from 'lucide-react';
import { Button } from '../common/Button';
import { checkStorageAvailability, exportDashboardData } from '../../utils/dashboardStorage';

interface StorageNotificationProps {
  storageInfo: ReturnType<typeof checkStorageAvailability>;
}

export const StorageNotification: React.FC<StorageNotificationProps> = ({
  storageInfo,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show notification if storage is not available or nearly full
    const shouldShow = !storageInfo.available || 
      (storageInfo.used && storageInfo.quota && storageInfo.used / storageInfo.quota > 0.8);
    
    setIsVisible(shouldShow && !isDismissed);
  }, [storageInfo, isDismissed]);

  const handleExportData = () => {
    try {
      const data = exportDashboardData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export dashboard data:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm z-40">
      <div className="flex items-start space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-full flex-shrink-0">
          {!storageInfo.available ? (
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          ) : (
            <HardDrive className="w-4 h-4 text-yellow-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-yellow-200 mb-1">
            {!storageInfo.available ? 'Storage Unavailable' : 'Storage Nearly Full'}
          </h4>
          
          <p className="text-xs text-yellow-300/80 mb-3">
            {!storageInfo.available 
              ? 'Dashboard customizations cannot be saved. Your changes may be lost.'
              : 'Your browser storage is nearly full. Consider backing up your dashboard.'
            }
          </p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleExportData}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Backup
            </Button>
            
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="outline"
              className="bg-transparent border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 text-xs"
            >
              Dismiss
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleDismiss}
          size="sm"
          variant="outline"
          className="bg-transparent border-none text-yellow-400 hover:text-yellow-300 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};