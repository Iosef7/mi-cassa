import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Base configuration matching the system's design
const swalConfig = {
  customClass: {
    popup: 'bg-card border border-border rounded-2xl shadow-2xl text-foreground',
    title: 'text-xl font-bold text-foreground',
    htmlContainer: 'text-muted-foreground',
    confirmButton: 'bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20',
    cancelButton: 'bg-muted text-muted-foreground font-bold px-6 py-2.5 rounded-xl hover:bg-muted/80 transition-colors',
  },
  buttonsStyling: false,
  background: 'var(--card)',
  color: 'var(--foreground)',
};

export const showAlert = (title: string, text?: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info') => {
  return MySwal.fire({
    ...swalConfig,
    title,
    text,
    icon,
  });
};

export const showConfirm = async (title: string, text?: string, confirmText: string = 'Aceptar', cancelText: string = 'Cancelar') => {
  const result = await MySwal.fire({
    ...swalConfig,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true, // Puts confirm on the right
  });
  return result.isConfirmed;
};

export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  return MySwal.fire({
    ...swalConfig,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    title,
    icon,
    customClass: {
      ...swalConfig.customClass,
      popup: 'bg-card border border-border rounded-xl shadow-lg text-foreground mt-4 mr-4',
    }
  });
};
