import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = (++toastId).toString();
    const newToast: Toast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
    
    // Also show browser alert for now
    if (variant === 'destructive') {
      alert(`Error: ${title}${description ? ` - ${description}` : ''}`);
    } else {
      console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`);
    }
  }, []);

  return { toast, toasts };
};
