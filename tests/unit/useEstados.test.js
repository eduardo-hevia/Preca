/**
 * @file tests/unit/useEstados.test.js
 * @description Tests del hook useEstados con mock de EstadosApi.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

/* Mock de EstadosApi ANTES de importar el hook */
vi.mock('../../src/infrastructure/api/modules/estadosApi.js', () => ({
  default: {
    getAll:      vi.fn(),
    getBitacora: vi.fn(),
    create:      vi.fn(),
    update:      vi.fn(),
    getById:     vi.fn(),
  },
}));

import { useEstados } from '../../src/modules/estados-precalificacion/hooks/useEstados.js';
import EstadosApi     from '../../src/infrastructure/api/modules/estadosApi.js';

const ESTADOS_MOCK = [
  { id: 1, descripcion: 'Aprobado', tipo: 'base' },
  { id: 2, descripcion: 'Nuevo',    tipo: 'base' },
  { id: 3, descripcion: 'Denegado', tipo: 'base' },
];

describe('useEstados hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    EstadosApi.getAll.mockResolvedValue({ data: ESTADOS_MOCK });
    EstadosApi.getBitacora.mockResolvedValue({ data: [] });
  });

  it('carga estados en el mount inicial', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.asyncState.loading).toBe(false));
    expect(result.current.estados).toHaveLength(3);
    expect(EstadosApi.getAll).toHaveBeenCalledTimes(1);
  });

  it('asyncState.loading es true durante la carga', async () => {
    let resolvePromise;
    EstadosApi.getAll.mockReturnValue(new Promise(r => { resolvePromise = r; }));
    EstadosApi.getBitacora.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useEstados());
    expect(result.current.asyncState.loading).toBe(true);

    await act(async () => resolvePromise({ data: ESTADOS_MOCK }));
    await waitFor(() => expect(result.current.asyncState.loading).toBe(false));
  });

  it('asyncState.error se setea cuando la API falla', async () => {
    EstadosApi.getAll.mockRejectedValue(new Error('Error de red'));
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.asyncState.error).toBeTruthy());
    expect(result.current.asyncState.loading).toBe(false);
  });

  it('create() llama a EstadosApi.create y refresca la lista', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.asyncState.loading).toBe(false));

    EstadosApi.create.mockResolvedValue({ data: { id: 8, descripcion: 'Nuevo Estado' } });

    await act(async () => {
      const res = await result.current.create('Nuevo Estado');
      expect(res.ok).toBe(true);
    });

    expect(EstadosApi.create).toHaveBeenCalledWith({ descripcion: 'Nuevo Estado' });
    expect(EstadosApi.getAll).toHaveBeenCalledTimes(2); // mount + después de create
  });

  it('create() retorna { ok: false } cuando la API rechaza', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.asyncState.loading).toBe(false));

    EstadosApi.create.mockRejectedValue({ message: 'Ya existe', code: 'ESTADO_DUPLICADO' });

    await act(async () => {
      const res = await result.current.create('Aprobado');
      expect(res.ok).toBe(false);
      expect(res.code).toBe('ESTADO_DUPLICADO');
    });
  });

  it('update() llama a EstadosApi.update con id y descripcion', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.asyncState.loading).toBe(false));

    EstadosApi.update.mockResolvedValue({ data: { id: 1, descripcion: 'Aprobado V2' } });

    await act(async () => {
      const res = await result.current.update(1, 'Aprobado V2');
      expect(res.ok).toBe(true);
    });

    expect(EstadosApi.update).toHaveBeenCalledWith(1, { descripcion: 'Aprobado V2' });
  });

  it('filteredEstados filtra por searchQuery', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.estados).toHaveLength(3));

    act(() => result.current.setSearchQuery('apro'));
    expect(result.current.filteredEstados).toHaveLength(1);
    expect(result.current.filteredEstados[0].descripcion).toBe('Aprobado');
  });

  it('filteredEstados es la lista completa cuando searchQuery está vacío', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.estados).toHaveLength(3));
    expect(result.current.filteredEstados).toHaveLength(3);
  });

  it('validate() rechaza descripción vacía', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.asyncState.loading).toBe(false));
    expect(result.current.validate('')).toMatchObject({ valid: false });
  });

  it('validate() rechaza descripción duplicada local', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.estados).toHaveLength(3));
    expect(result.current.validate('Aprobado')).toMatchObject({ valid: false });
  });

  it('validate() acepta descripción única', async () => {
    const { result } = renderHook(() => useEstados());
    await waitFor(() => expect(result.current.estados).toHaveLength(3));
    expect(result.current.validate('Estado Completamente Nuevo')).toMatchObject({ valid: true });
  });
});
