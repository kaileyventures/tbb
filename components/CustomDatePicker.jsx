import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './CustomDatePicker.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate years from 2020 to 2030
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 2030 - 2020 + 1 }, (_, i) => 2020 + i).reverse();

export default function CustomDatePicker({
  value = '',
  onChange,
  disabled = false,
  className = '',
  style = {},
  placeholder = 'Select date...',
  required = false,
  min = '',
  max = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  
  // Track temporary viewport state when calendar is open
  const [viewYear, setViewYear] = useState(currentYear);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth()); // 0-indexed

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Helper to safely extract string date from value (in case value is non-string or object)
  const getStringValue = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
      if (typeof val.target?.value === 'string') return val.target.value;
      if (typeof val.value === 'string') return val.value;
    }
    return String(val);
  };

  // Sync internal view with current value
  useEffect(() => {
    const strVal = getStringValue(value);
    if (strVal) {
      const parts = strVal.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y)) setViewYear(y);
        if (!isNaN(m) && m >= 0 && m <= 11) setViewMonth(m);
      }
    }
  }, [value]);

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 310; // Approximate dropdown height
      const dropdownWidth = 280; // Fixed width
      
      let top = rect.bottom + window.scrollY;
      let left = rect.left + window.scrollX;

      // Adjust if it goes offscreen vertically
      if (rect.bottom + dropdownHeight > window.innerHeight && rect.top - dropdownHeight > 0) {
        top = rect.top + window.scrollY - dropdownHeight - 4;
      }

      // Adjust if it goes offscreen horizontally
      if (rect.left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth + window.scrollX - dropdownWidth - 16;
      }

      setCoords({
        top,
        left,
        width: Math.max(rect.width, 260)
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        const portalEl = document.getElementById('custom-datepicker-portal');
        if (portalEl && portalEl.contains(event.target)) return;
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  // Date manipulation helpers
  const handlePrevMonth = () => {
    setViewMonth(prev => {
      if (prev === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth(prev => {
      if (prev === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleDateSelect = (day) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDate = `${viewYear}-${formattedMonth}-${formattedDay}`;
    
    if (onChange) {
      onChange({ target: { value: selectedDate } });
    }
    setIsOpen(false);
  };

  const handleTodaySelect = () => {
    const today = new Date();
    const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(today.getDate()).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${formattedMonth}-${formattedDay}`;
    
    if (onChange) {
      onChange({ target: { value: todayStr } });
    }
    setIsOpen(false);
  };

  // Generate day cells
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayIndex(viewYear, viewMonth);

  const days = [];
  // Add empty slots for previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Format value to display beautifully
  const getDisplayDate = () => {
    const strVal = getStringValue(value);
    if (!strVal) return '';
    const parts = strVal.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      }
    }
    const d = new Date(strVal);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return strVal;
  };

  // Format YYYY-MM-DD comparison helper
  const isSelectedDate = (day) => {
    const strVal = getStringValue(value);
    if (!strVal || !day) return false;
    const parts = strVal.split('-');
    if (parts.length < 3) return false;
    return (
      parseInt(parts[0], 10) === viewYear &&
      parseInt(parts[1], 10) === (viewMonth + 1) &&
      parseInt(parts[2], 10) === day
    );
  };

  // Split classes: remove form-control from container so we don't get double borders/backgrounds
  const containerClass = className
    .split(' ')
    .filter(c => c !== 'form-control')
    .join(' ');

  // Split styles: separate container layout styles from input design styles
  const containerStyles = {};
  const inputStyles = {};

  const containerKeys = [
    'width', 'minWidth', 'maxWidth', 'flex', 'flexGrow', 'flexShrink', 'flexBasis',
    'gridColumn', 'gridRow', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'position', 'top', 'bottom', 'left', 'right', 'zIndex', 'display', 'alignSelf', 'justifySelf',
    'height' // Let height also be handled by the trigger
  ];

  if (style) {
    Object.keys(style).forEach(key => {
      if (containerKeys.includes(key) && key !== 'height') {
        containerStyles[key] = style[key];
      } else {
        inputStyles[key] = style[key];
      }
    });
  }

  return (
    <div 
      className={`custom-datepicker-container ${disabled ? 'is-disabled' : ''}`}
      style={containerStyles}
      ref={containerRef}
    >
      <div 
        className={`custom-datepicker-trigger form-control ${containerClass}`}
        onClick={handleToggle}
        style={{ ...inputStyles, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <span className={`custom-datepicker-text ${!value ? 'is-placeholder' : ''}`}>
          {getDisplayDate() || placeholder}
        </span>
        <i className="fa-solid fa-calendar-days custom-datepicker-icon"></i>
      </div>

      {isOpen && !disabled && createPortal(
        <div 
          id="custom-datepicker-portal"
          className="custom-datepicker-dropdown"
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 99999
          }}
        >
          {/* Quick Dropdown Headers for Month & Year */}
          <div className="custom-datepicker-header">
            <button 
              type="button" 
              className="custom-datepicker-nav-btn" 
              onClick={handlePrevMonth}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="custom-datepicker-selectors">
              <select
                className="custom-datepicker-select month-select"
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
              >
                {MONTHS.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                className="custom-datepicker-select year-select"
                value={viewYear || ""}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
              >
                <option value="" disabled>Select Year</option>
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button 
              type="button" 
              className="custom-datepicker-nav-btn" 
              onClick={handleNextMonth}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="custom-datepicker-weekdays">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="custom-datepicker-days">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="custom-datepicker-day empty"></div>;
              }
              const isSelected = isSelectedDate(day);
              const isToday = (() => {
                const today = new Date();
                return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
              })();

              const isDisabled = (() => {
                if (!day) return false;
                const formattedMonth = String(viewMonth + 1).padStart(2, '0');
                const formattedDay = String(day).padStart(2, '0');
                const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;

                if (min) {
                  const minStr = getStringValue(min);
                  if (minStr && dateStr < minStr) return true;
                }
                if (max) {
                  const maxStr = getStringValue(max);
                  if (maxStr && dateStr > maxStr) return true;
                }
                return false;
              })();
              
              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={isDisabled}
                  className={`custom-datepicker-day ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''} ${isDisabled ? 'is-disabled' : ''}`}
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  style={{ opacity: isDisabled ? 0.35 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="custom-datepicker-footer">
            <button 
              type="button" 
              className="custom-datepicker-today-btn"
              onClick={handleTodaySelect}
            >
              Today
            </button>
            <button 
              type="button" 
              className="custom-datepicker-close-btn"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
