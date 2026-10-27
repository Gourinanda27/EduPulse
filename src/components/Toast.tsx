import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <Sparkles size={16} color="var(--accent-primary)" />
        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{message}</span>
      </div>
    </div>
  );
};
