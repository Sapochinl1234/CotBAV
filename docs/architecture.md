# Arquitectura de CotBAV

## Visión general

CotBAV separa la experiencia de usuario del motor de cotización para permitir cambios de reglas de negocio sin afectar la interfaz.

## Componentes principales

- Frontend responsive para captura de datos y visualización de resultados
- Backend API para validación, seguridad y cálculo
- Motor de cotización independiente para ajustar benchmarks y márgenes

## Capas sugeridas

1. Presentación: controladores REST / UI
2. Lógica de negocio: reglas de cotización, impuestos y complejidad
3. Infraestructura: clientes externos de tipo de cambio, persistencia futura
4. Seguridad transversal: autenticación, rate limiting, logging, sanitización
