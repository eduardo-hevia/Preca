/**
 * @file tests/unit/casosMockService.test.js
 * @description Tests unitarios del store mock de casos especiales (HU-61310).
 * Cubre: RN-06 (unicidad tipo+número), RN-07 (fecha defunción), RN-10 (soft-delete).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.stubEnv('VITE_USE_MOCK', 'true');

import CasosServiceMock from '../../src/infrastructure/mock/casosMockService.js';
import { ESTADO_ID }    from '../../src/core/constants/index.js';

describe('CasosMockService — HU-61310', () => {
  beforeEach(() => CasosServiceMock._reset());

  /* getAll */
  describe('getAll()', () => {
    it('retorna solo registros activos', () => {
      const todos = CasosServiceMock.getAll();
      expect(todos.every(c => c.activo !== false)).toBe(true);
    });

    it('retorna 5 casos base', () => {
      expect(CasosServiceMock.getAll()).toHaveLength(5);
    });
  });

  /* validate */
  describe('validate()', () => {
    it('RN-06: tipo vacío → invalid', () => {
      expect(CasosServiceMock.validate('', '1234567890101')).toMatchObject({ valid: false });
    });

    it('RN-06: número vacío → invalid', () => {
      expect(CasosServiceMock.validate('DPI', '')).toMatchObject({ valid: false });
    });

    it('RN-06: duplicado activo → invalid', () => {
      const existente = CasosServiceMock.getAll()[0];
      const r = CasosServiceMock.validate(existente.tipoDocumento, existente.numeroDocumento);
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/duplicado|existe/i);
    });

    it('RN-06: combinación única → valid', () => {
      expect(CasosServiceMock.validate('DPI', '9999999999999')).toMatchObject({ valid: true });
    });

    it('excluye el propio ID en edición', () => {
      const caso = CasosServiceMock.getAll()[0];
      expect(CasosServiceMock.validate(caso.tipoDocumento, caso.numeroDocumento, caso.id))
        .toMatchObject({ valid: true });
    });
  });

  /* create */
  describe('create()', () => {
    it('RN-06: crea caso nuevo y aparece en getAll()', () => {
      const nuevo = CasosServiceMock.create({
        tipoDocumento: 'DPI', numeroDocumento: '7777777777777',
        nombreCompleto: 'PRUEBA CASO', estadoId: 3,
      });
      expect(nuevo.id).toBeDefined();
      expect(CasosServiceMock.getAll()).toHaveLength(6);
    });

    it('RN-07: lanza error si estado=Fallecido sin fechaDefuncion', () => {
      expect(() => CasosServiceMock.create({
        tipoDocumento: 'DPI', numeroDocumento: '8888888888888',
        nombreCompleto: 'FALLECIDO', estadoId: ESTADO_ID.FALLECIDO,
        fechaDefuncion: null,
      })).toThrow(/defunci[oó]n/i);
    });

    it('RN-07: acepta Fallecido cuando incluye fechaDefuncion', () => {
      expect(() => CasosServiceMock.create({
        tipoDocumento: 'DPI', numeroDocumento: '8888888888888',
        nombreCompleto: 'FALLECIDO CON FECHA', estadoId: ESTADO_ID.FALLECIDO,
        fechaDefuncion: '2025-01-15',
      })).not.toThrow();
    });

    it('RN-06: lanza error si tipo+número ya existe en activos', () => {
      const caso = CasosServiceMock.getAll()[0];
      expect(() => CasosServiceMock.create({
        tipoDocumento: caso.tipoDocumento,
        numeroDocumento: caso.numeroDocumento,
        nombreCompleto: 'OTRO',
        estadoId: 3,
      })).toThrow(/duplicado|existe/i);
    });
  });

  /* softDelete */
  describe('softDelete()', () => {
    it('RN-10: marca el caso como inactivo', () => {
      const id = CasosServiceMock.getAll()[0].id;
      CasosServiceMock.softDelete(id);
      expect(CasosServiceMock.getAll().find(c => c.id === id)).toBeUndefined();
    });

    it('RN-10: retorna { eliminado: true }', () => {
      const id = CasosServiceMock.getAll()[0].id;
      const result = CasosServiceMock.softDelete(id);
      expect(result).toMatchObject({ eliminado: true });
    });

    it('RN-10: no elimina físicamente (el registro sigue en la lista interna con activo=false)', () => {
      const initialCount = CasosServiceMock.getAll().length;
      const id = CasosServiceMock.getAll()[0].id;
      CasosServiceMock.softDelete(id);
      // getAll solo devuelve activos — caso eliminado ya no aparece
      expect(CasosServiceMock.getAll()).toHaveLength(initialCount - 1);
    });

    it('lanza 404 si el caso no existe', () => {
      expect(() => CasosServiceMock.softDelete(99999)).toThrow();
    });

    it('permite crear un nuevo registro con el mismo tipo+número tras eliminarlo', () => {
      const caso = CasosServiceMock.getAll()[0];
      CasosServiceMock.softDelete(caso.id);
      expect(() => CasosServiceMock.create({
        tipoDocumento: caso.tipoDocumento,
        numeroDocumento: caso.numeroDocumento,
        nombreCompleto: 'REUTILIZADO',
        estadoId: 3,
      })).not.toThrow();
    });
  });

  /* update */
  describe('update()', () => {
    it('actualiza datos del caso', () => {
      const caso = CasosServiceMock.getAll()[0];
      const actualizado = CasosServiceMock.update(caso.id, { ...caso, nombreCompleto: 'NOMBRE ACTUALIZADO', estadoId: 5 });
      expect(actualizado.nombreCompleto).toBe('NOMBRE ACTUALIZADO');
      expect(actualizado.estadoId).toBe(5);
    });

    it('RN-07: lanza error si se cambia a Fallecido sin fecha', () => {
      const caso = CasosServiceMock.getAll()[0];
      expect(() => CasosServiceMock.update(caso.id, { ...caso, estadoId: ESTADO_ID.FALLECIDO, fechaDefuncion: null }))
        .toThrow();
    });

    it('lanza 404 si el caso no existe', () => {
      expect(() => CasosServiceMock.update(99999, {})).toThrow();
    });
  });

  /* _reset */
  describe('_reset()', () => {
    it('restaura a 5 casos base', () => {
      CasosServiceMock.softDelete(CasosServiceMock.getAll()[0].id);
      CasosServiceMock._reset();
      expect(CasosServiceMock.getAll()).toHaveLength(5);
    });
  });
});
