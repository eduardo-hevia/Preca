# Análisis de Seguridad y Versiones — bantrab-precalificacion (Frontend)

**Fecha de revisión:** Abril 2026  
**Node.js requerido:** ≥ 20.0.0 LTS

---

## Estado de Seguridad

```
npm audit → 0 vulnerabilities
```

**Sin vulnerabilidades conocidas en ninguna dependencia.**

---

## Versiones de Dependencias Principales

### Producción

| Paquete | Versión | Estado |
|---|---|---|
| react | 19.2.5 | ✅ Estable (última) |
| react-dom | 19.2.5 | ✅ Estable |
| react-router-dom | 7.14.2 | ✅ Estable |
| axios | 1.15.2 | ✅ Estable |
| lucide-react | 1.11.0 | ✅ Estable |

### Desarrollo y Testing

| Paquete | Versión | Estado |
|---|---|---|
| vite | 8.0.10 | ✅ Estable |
| vitest | 4.1.5 | ✅ Estable |
| @testing-library/react | 16.3.2 | ✅ Estable |
| @testing-library/jest-dom | 6.9.1 | ✅ Estable |
| @testing-library/user-event | 14.6.1 | ✅ Estable |
| @vitejs/plugin-react | 6.0.1 | ✅ Estable |
| jsdom | 29.0.2 | ✅ Estable |
| cypress | Offline | E2E (instalar localmente) |

---

## Nota sobre React 19

React 19 es la versión estable actual (lanzada en diciembre 2024). Incluye:
- Compilador React (opt-in)
- `use()` hook nativo
- Server Components mejorados
- Sin breaking changes para aplicaciones React 18 bien escritas

Este proyecto es totalmente compatible con React 19.

## Nota sobre Cypress

Cypress requiere binarios nativos descargados desde internet. En entornos sin acceso a red completo, ejecutar:

```bash
npm install cypress
npx cypress install
npx cypress open  # GUI
npx cypress run   # headless CI
```

Los specs E2E están en `tests/e2e/cypress/e2e/`.
