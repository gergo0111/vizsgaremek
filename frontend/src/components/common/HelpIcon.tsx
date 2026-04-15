import { useState } from 'react';
import './HelpIcon.css';

interface HelpIconProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpIcon({ text, position = 'top' }: HelpIconProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="help-icon-container">
      <span
        className="help-icon"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        ?
      </span>
      {isVisible && (
        <div className={`help-tooltip help-tooltip-${position}`}>
          {text}
        </div>
      )}
    </div>
  );
}
