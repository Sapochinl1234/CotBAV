# Despliegue Vercel + Render

## 1. Frontend en Vercel
- Importar la carpeta raíz del proyecto en Vercel.
- Establecer la raíz de despliegue como la carpeta del proyecto.
- Configurar variables de entorno:
  - VITE_GOOGLE_CLIENT_ID
  - VITE_API_URL (opcional, si se usa una URL directa)

## 2. Backend en Render
- Crear un nuevo servicio web desde la carpeta raíz.
- Usar el archivo render.yaml para la configuración.
- Añadir la variable DATABASE_URL con la URL de PostgreSQL.
- Añadir JWT_SECRET y configurar NODE_ENV=production.

## 3. Conectar frontend y backend
- Ajustar la URL del backend en Vercel si es necesario.
- El archivo frontend/vercel.json está preparado para redirigir /api/* al backend.
