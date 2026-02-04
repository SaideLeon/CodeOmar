'use client';

import React from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';
import WindowFrame from '@/components/WindowFrame';

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  variant?: 'error' | 'info';
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, title, message, variant = 'info', onClose }) => {
  if (!isOpen) return null;

  const Icon = variant === 'error' ? AlertTriangle : Info;
  const iconColor = variant === 'error' ? 'text-red-500' : 'text-emerald-500';
  const borderColor = variant === 'error' ? 'border-red-500/30' : 'border-emerald-500/30';
  const bgColor = variant === 'error' ? 'bg-red-500/10' : 'bg-emerald-500/10';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <WindowFrame title={title || 'notificacao.system'} className="shadow-2xl">
          <div className="p-6 bg-white dark:bg-[#0b0e11] space-y-4">
            <div className={`flex items-start gap-3 p-3 rounded border ${borderColor} ${bgColor}`}>
              <Icon className={`${iconColor} shrink-0 mt-0.5`} size={18} />
              <p className="text-sm text-gray-700 dark:text-gray-200 font-mono">{message}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-sm font-bold transition-colors shadow-lg shadow-emerald-900/20"
              >
                Ok
              </button>
            </div>
          </div>
        </WindowFrame>
      </div>
    </div>
  );
};

export default AlertModal;
