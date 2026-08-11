# Checklist de seguridad

- HTTPS obligatorio en producción
- OAuth 2.0 con Google como única vía de autenticación
- Tokens de sesión en cookies HTTP-only, Secure y SameSite=Strict
- Validación estricta de inputs en frontend y backend
- Rate limiting en endpoints sensibles
- Headers de seguridad: CSP, X-Frame-Options, X-Content-Type-Options, HSTS
- Logs de auditoría sin registrar datos sensibles en texto plano
- Backups cifrados de base de datos
