/**
 * @file core/hooks/useToast.js
 * @description Hook para gestión de notificaciones toast (feedback al usuario).
 * Expone API: toast.success / toast.error / toast.warn
 */
import { useState, useCallback } from 'react';

let _toastId = 0;

/**
 * @typedef {'success'|'error'|'warn'} ToastType
 * @typedef {{ id: number, message: string, type: ToastType }} ToastItem
 */

/**
 * Hook de toasts — genera notificaciones efímeras con auto-dismiss (3.5s)
 * @returns {{ toasts: ToastItem[], toast: object, removeToast: Function }}
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    removeToast,
    toast: {
      success: (msg) => addToast(msg, 'success'),
      error: (msg) => addToast(msg, 'error'),
      warn: (msg) => addToast(msg, 'warn'),
    },
  };
};
