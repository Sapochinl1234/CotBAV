# CotBAV

CotBAV es una plataforma web responsive para ayudar a freelancers de tecnología a calcular cotizaciones justas para proyectos de software.

## Arquitectura propuesta

- Frontend: React + Vite + CSS responsive
- Backend: Node.js + Express con capas limpias
- Seguridad: HTTPS, rate limiting, helmet, cookies HTTP-only y validación de inputs
- Datos: PostgreSQL + ORM en una evolución posterior

## Estructura de carpetas

- frontend/: UI responsive y formulario de cotización
- backend/: API REST para salud y estimación de cotizaciones
- docs/: documentación legal y técnica

## Cómo ejecutar

1. npm install
2. npm --prefix frontend install
3. npm --prefix backend install
4. npm run frontend
5. npm run backend
