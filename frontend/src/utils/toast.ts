export type ToastType = 'success' | 'error' | 'info';

type ToastHandler = (message: string, type: ToastType) => void;

let handler: ToastHandler | null = null;

export const registerToastHandler = (h: ToastHandler) => {
  handler = h;
};

export const toast = {
  success: (message: string) => handler?.(message, 'success'),
  error: (message: string) => handler?.(message, 'error'),
  info: (message: string) => handler?.(message, 'info'),
};
