/**
 * @file tests/unit/estadosMockService.test.js
 * @description Tests unitarios del store mock de estados (HU-61309).
 * Verifica reglas de negocio: unicidad, obligatoriedad, bitácora.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock de import.meta.env ANTES de importar el módulo
vi.stubEnv('VITE_USE_MOCK', 'true');

// El import.meta.env ya está mockeado en setup.js

import EstadosServiceMock from '../../src/infrastructure/mock/estadosMockService.js';

describe('EstadosMockService — HU-61309', () => {
  beforeEach(() => EstadosServiceMock._reset());

  /* getAll */
  describe('getAll()', () => {
    it('retorna los 7 estados base iniciales', () => {
      expect(EstadosServiceMock.getAll()).toHaveLength(7);
    });

    it('retorna un array de objetos con id y descripcion', () => {
      const estados = EstadosServiceMock.getAll();
      estados.forEach(e => {
        expect(e).toHaveProperty('id');
        expect(e).toHaveProperty('descripcion');
        expect(e).toHaveProperty('tipo');
      });
    });
  });

  /* validate */
  describe('validate()', () => {
    it('RN-01: descripción vacía → invalid', () => {
      expect(EstadosServiceMock.validate('')).toMatchObject({ valid: false });
      expect(EstadosServiceMock.validate('  ')).toMatchObject({ valid: false });
    });

    it('RN-02: descripción > 50 chars → invalid', () => {
      expect(EstadosServiceMock.validate('A'.repeat(51))).toMatchObject({ valid: false });
    });

    it('RN-01: descripción duplicada (misma) → invalid', () => {
      const r = EstadosServiceMock.validate('Aprobado');
      expect(r.valid).toBe(false);
    });

    it('RN-01: descripción duplicada (case-insensitive) → invalid', () => {
      expect(EstadosServiceMock.validate('aprobado')).toMatchObject({ valid: false });
      expect(EstadosServiceMock.validate('APROBADO')).toMatchObject({ valid: false });
    });

    it('descripción única → valid', () => {
      expect(EstadosServiceMock.validate('Estado Nuevo Único')).toMatchObject({ valid: true });
    });

    it('excluye el propio ID en edición (no marca como duplicado)', () => {
      const estados = EstadosServiceMock.getAll();
      const primerEstado = estados[0];
      expect(EstadosServiceMock.validate(primerEstado.descripcion, primerEstado.id)).toMatchObject({ valid: true });
    });
  });

  /* create */
  describe('create()', () => {
    it('RN-01/RN-05: crea estado y aparece en getAll()', () => {
      const nuevo = EstadosServiceMock.create('Estado Test');
      expect(nuevo).toMatchObject({ descripcion: 'Estado Test', tipo: 'custom' });
      expect(EstadosServiceMock.getAll()).toHaveLength(8);
    });

    it('RN-05: registra entrada en bitácora', () => {
      EstadosServiceMock.create('Para Bitácora');
      const bitacora = EstadosServiceMock.getBitacora();
      expect(bitacora[0]).toMatchObject({ operacion: 'CREACIÓN', valorNuevo: 'Para Bitácora' });
    });

    it('RN-01: lanza error si descripción es duplicada', () => {
      expect(() => EstadosServiceMock.create('Aprobado')).toThrow();
    });

    it('trima espacios en la descripción', () => {
      const nuevo = EstadosServiceMock.create('  Trimado  ');
      expect(nuevo.descripcion).toBe('Trimado');
    });

    it('IDs son incrementales y únicos', () => {
      const a = EstadosServiceMock.create('Estado A');
      const b = EstadosServiceMock.create('Estado B');
      expect(b.id).toBeGreaterThan(a.id);
    });
  });

  /* update */
  describe('update()', () => {
    it('RN-05: actualiza descripción y registra diff en bitácora', () => {
      const estados = EstadosServiceMock.getAll();
      const id = estados[0].id;
      const anterior = estados[0].descripcion;
      const actualizado = EstadosServiceMock.update(id, 'Aprobado Modificado');
      expect(actualizado.descripcion).toBe('Aprobado Modificado');
      const bitacora = EstadosServiceMock.getBitacora();
      expect(bitacora[0]).toMatchObject({
        operacion:     'ACTUALIZACIÓN',
        valorAnterior: anterior,
        valorNuevo:    'Aprobado Modificado',
      });
    });

    it('RN-03: no elimina el estado (sigue en getAll)', () => {
      const id = EstadosServiceMock.getAll()[0].id;
      EstadosServiceMock.update(id, 'Aprobado V2');
      expect(EstadosServiceMock.getAll().find(e => e.id === id)).toBeDefined();
    });

    it('RN-01: lanza error si nueva descripción es duplicada en otro estado', () => {
      const estados = EstadosServiceMock.getAll();
      const id1 = estados[0].id;
      const desc2 = estados[1].descripcion;
      expect(() => EstadosServiceMock.update(id1, desc2)).toThrow();
    });

    it('lanza 404 si el estado no existe', () => {
      expect(() => EstadosServiceMock.update(9999, 'X')).toThrow();
    });
  });

  /* getBitacora */
  describe('getBitacora()', () => {
    it('retorna la bitácora base (3 entradas iniciales)', () => {
      expect(EstadosServiceMock.getBitacora().length).toBeGreaterThanOrEqual(3);
    });

    it('la entrada más reciente es la primera (orden DESC)', () => {
      EstadosServiceMock.create('Último estado');
      const bitacora = EstadosServiceMock.getBitacora();
      expect(bitacora[0].valorNuevo).toBe('Último estado');
    });
  });

  /* reset */
  describe('_reset()', () => {
    it('restaura exactamente 7 estados', () => {
      EstadosServiceMock.create('A');
      EstadosServiceMock.create('B');
      EstadosServiceMock._reset();
      expect(EstadosServiceMock.getAll()).toHaveLength(7);
    });
  });
});
