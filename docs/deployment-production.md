# Despliegue en producción

## Backend
- Desplegar en Render, Railway o Fly.io
- Configurar variables de entorno:
  - PORT
  - JWT_SECRET
  - DATABASE_URL
  - NODE_ENV=production
- Mantener HTTPS habilitado

## Frontend
- Desplegar en Vercel o Netlify
- Configurar:
  - VITE_API_URL
  - VITE_GOOGLE_CLIENT_ID

## Base de datos
- Usar PostgreSQL gestionado (Neon, Supabase, Railway Postgres o Cloud SQL)
- Conectar mediante DATABASE_URL
- Ejecutar migraciones si se requiere un esquema más completo
