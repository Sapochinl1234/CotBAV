# Guía de despliegue para producción

## Frontend
- Desplegar en Vercel o Netlify
- Configurar variables de entorno para la URL del backend
- Habilitar HTTPS automático

## Backend
- Contenerizar con Docker
- Desplegar en Render, Railway, Fly.io o un VPS con TLS
- Configurar variables de entorno para secretos y base de datos

## Base de datos
- Usar PostgreSQL administrado (Supabase, Neon o Cloud SQL)
- Habilitar copias de seguridad cifradas
- Aplicar migraciones vía Prisma o TypeORM
