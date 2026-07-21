import { toast } from 'sonner';

export const showAlert = async (title: string, text?: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info') => {
  if (icon === 'error') {
    toast.error(title, { description: text });
  } else if (icon === 'success') {
    toast.success(title, { description: text });
  } else if (icon === 'warning' || icon === 'question') {
    toast.warning(title, { description: text });
  } else {
    toast.info(title, { description: text });
  }
};

export const showConfirm = async (title: string, text?: string, confirmText: string = 'Aceptar', cancelText: string = 'Cancelar') => {
  // Use native window.confirm for 0 dependencies and fast load
  const message = text ? `${title}\n\n${text}` : title;
  return new Promise<boolean>((resolve) => {
    resolve(window.confirm(message));
  });
};

export const showToast = async (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  if (icon === 'error') {
    toast.error(title);
  } else if (icon === 'success') {
    toast.success(title);
  } else if (icon === 'warning') {
    toast.warning(title);
  } else {
    toast.info(title);
  }
};
