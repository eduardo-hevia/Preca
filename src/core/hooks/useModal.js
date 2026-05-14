/**
 * @file core/hooks/useModal.js
 * @description Hook para controlar apertura/cierre de modales y diálogos.
 */
import { useState, useCallback } from 'react';

/**
 * Controla el estado de un modal con datos opcionales (útil para edición)
 * @template T
 * @returns {{ isOpen: boolean, data: T|null, open: Function, close: Function }}
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const open = useCallback((payload = null) => {
    setData(payload);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay limpieza de data para evitar flicker en animación de cierre
    setTimeout(() => setData(null), 300);
  }, []);

  return { isOpen, data, open, close };
};
