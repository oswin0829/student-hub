"use client";

import { useState } from 'react';

export default function ExpandableDescription({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;

  return (
    <div className="flex flex-col">
      {/* We use 'max-height' instead of 'line-clamp' 
         because line-clamp often forces 'display: -webkit-box', 
         which can break 'white-space: pre-wrap' in some browsers.
      */}
      <div 
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out relative`}
        style={{ 
          maxHeight: isExpanded ? 'none' : '120px',
          whiteSpace: 'pre-wrap', // The magic sauce
          wordBreak: 'break-word'
        }}
      >
        <div className="text-gray-600 leading-relaxed text-[15px] font-medium pb-4">
          {text}
        </div>

        {/* Fades the text out when it's collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>
      
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 w-fit text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        {isExpanded ? "Show Less ▲" : "Read Full Details ▼"}
      </button>
    </div>
  );
}