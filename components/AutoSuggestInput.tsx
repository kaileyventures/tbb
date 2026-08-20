'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AutoSuggestInputProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  maxSuggestions?: number;
  style?: React.CSSProperties;
}

export default function AutoSuggestInput({
  value,
  onChange,
  options,
  placeholder,
  required = false,
  maxSuggestions = 5,
  style
}: AutoSuggestInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter unique non-empty options matching current typed input, limited to maxSuggestions
  const filteredSuggestions = Array.from(new Set(options))
    .filter(opt => opt && opt.toLowerCase().includes(value.toLowerCase()))
    .slice(0, maxSuggestions);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: '#1f2937',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '14px',
          outline: 'none',
          ...style
        }}
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.6)',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 999999,
            listStyle: 'none',
            margin: '4px 0 0 0',
            padding: '6px'
          }}>
          {filteredSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => {
                onChange(suggestion);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <span>{suggestion}</span>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggestion</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
