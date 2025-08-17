// BACKUP: TimePickerInput component
// Beautiful time picker with clock interface
// Saved for future use - DO NOT IMPORT

import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimePickerInputBackup: React.FC<TimePickerInputProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTime, setTempTime] = useState(value || '07:00 AM');
  
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    return { hours: hours || 7, minutes: minutes || 0, period: period || 'AM' };
  };

  const { hours, minutes, period } = parseTime(tempTime);

  const formatTime = (h: number, m: number, p: string) => {
    const formattedHour = h.toString().padStart(2, '0');
    const formattedMinute = m.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${p}`;
  };

  const updateTime = (newHours: number, newMinutes: number, newPeriod: string) => {
    const formatted = formatTime(newHours, newMinutes, newPeriod);
    setTempTime(formatted);
  };

  const getClockRotation = () => {
    const hour12 = hours % 12 || 12;
    return (hour12 * 30) - 90; // 30 degrees per hour, -90 to start at 12
  };

  const handleHourClick = (hour: number) => {
    updateTime(hour, minutes, period);
  };

  const handleOk = () => {
    onChange(tempTime);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempTime(value || '07:00 AM');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-2 border border-blue-200 rounded-xl shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/60 backdrop-blur-md text-slate-900 font-semibold cursor-pointer flex items-center justify-between"
      >
        <span>{value || '07:00 AM'}</span>
        <Clock className="w-4 h-4 text-blue-400" />
      </div>

      {/* Time Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select time</h3>
            
            {/* Digital Display */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={hours}
                    onChange={(e) => updateTime(Number(e.target.value) || 1, minutes, period)}
                    className="w-20 h-20 text-4xl font-bold text-center bg-gradient-to-br from-purple-200 to-purple-300 text-purple-900 rounded-2xl border-0 focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-200 shadow-inner"
                    aria-label="Hours"
                  />
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs font-semibold text-purple-600 whitespace-nowrap">
                    Hour
                  </div>
                </div>
                
                <div className="mx-4 flex flex-col items-center">
                  <span className="text-4xl font-bold text-gray-600 animate-pulse">:</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-1 animate-bounce"></div>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes.toString().padStart(2, '0')}
                    onChange={(e) => updateTime(hours, Number(e.target.value) || 0, period)}
                    className="w-20 h-20 text-4xl font-bold text-center bg-white rounded-2xl border-2 border-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 shadow-md"
                    aria-label="Minutes"
                  />
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs font-semibold text-purple-600 whitespace-nowrap">
                    Minute
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex flex-col gap-2">
                <button
                  onClick={() => updateTime(hours, minutes, 'AM')}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 transform ${
                    period === 'AM' 
                      ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  AM
                </button>
                <button
                  onClick={() => updateTime(hours, minutes, 'PM')}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 transform ${
                    period === 'PM' 
                      ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Clock Face */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg
                  width="240"
                  height="240"
                  viewBox="0 0 240 240"
                  className="cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  {/* Outer Ring */}
                  <circle cx="120" cy="120" r="110" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                  
                  {/* Clock Face with Gradient */}
                  <defs>
                    <radialGradient id="clockGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#f1f5f9" />
                    </radialGradient>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.1"/>
                    </filter>
                  </defs>
                  
                  <circle cx="120" cy="120" r="100" fill="url(#clockGradient)" stroke="#d1d5db" strokeWidth="2" filter="url(#shadow)" />
                  
                  {/* Hour Markers */}
                  {[...Array(12)].map((_, index) => {
                    const angle = (index * 30) - 90;
                    const isMainHour = index % 3 === 0;
                    const outerRadius = isMainHour ? 85 : 90;
                    const innerRadius = isMainHour ? 75 : 85;
                    
                    const x1 = 120 + outerRadius * Math.cos(angle * Math.PI / 180);
                    const y1 = 120 + outerRadius * Math.sin(angle * Math.PI / 180);
                    const x2 = 120 + innerRadius * Math.cos(angle * Math.PI / 180);
                    const y2 = 120 + innerRadius * Math.sin(angle * Math.PI / 180);
                    
                    return (
                      <line
                        key={index}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isMainHour ? "#6b7280" : "#d1d5db"}
                        strokeWidth={isMainHour ? "3" : "2"}
                      />
                    );
                  })}
                  
                  {/* Interactive Hour Numbers */}
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour, index) => {
                    const angle = (index * 30) - 90;
                    const x = 120 + 65 * Math.cos(angle * Math.PI / 180);
                    const y = 120 + 65 * Math.sin(angle * Math.PI / 180);
                    const isSelected = hour === hours;
                    
                    return (
                      <g key={hour}>
                        <circle
                          cx={x}
                          cy={y}
                          r="18"
                          fill={isSelected ? "#7c3aed" : "transparent"}
                          stroke={isSelected ? "#7c3aed" : "transparent"}
                          strokeWidth="2"
                          className="cursor-pointer transition-all duration-200 hover:fill-purple-100 hover:stroke-purple-300"
                          onClick={() => handleHourClick(hour)}
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={`text-sm font-bold cursor-pointer transition-colors duration-200 ${
                            isSelected ? "fill-white" : "fill-gray-700"
                          } hover:fill-purple-600`}
                          onClick={() => handleHourClick(hour)}
                        >
                          {hour}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Animated Hour Hand */}
                  <line
                    x1="120"
                    y1="120"
                    x2={120 + 50 * Math.cos(getClockRotation() * Math.PI / 180)}
                    y2={120 + 50 * Math.sin(getClockRotation() * Math.PI / 180)}
                    stroke="#7c3aed"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-in-out"
                    filter="url(#shadow)"
                  />
                  
                  {/* Hand Base */}
                  <circle cx="120" cy="120" r="8" fill="#7c3aed" filter="url(#shadow)" />
                  <circle cx="120" cy="120" r="4" fill="#a855f7" />
                  
                  {/* Selected Hour Indicator */}
                  <circle
                    cx={120 + 50 * Math.cos(getClockRotation() * Math.PI / 180)}
                    cy={120 + 50 * Math.sin(getClockRotation() * Math.PI / 180)}
                    r="6"
                    fill="#ec4899"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleCancel}
                className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleOk}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};