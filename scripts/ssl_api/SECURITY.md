# Seguridad de Credenciales SSL.com

## Manejo de Credenciales

1. NUNCA commitear `llaves.py` u otros archivos de credenciales
2. Usar `llaves.template.py` como base y crear tu propio `llaves.py` local
3. Las credenciales deben ser generadas desde el panel de SSL.com
4. Rotar credenciales regularmente (recomendado: cada 90 días)

## En caso de exposición

Si las credenciales son expuestas:

1. Revocar inmediatamente en SSL.com
2. Generar nuevas credenciales
3. Auditar uso no autorizado en logs
4. Notificar al equipo de seguridad

## Prevención

- Pre-commit hook instalado para detectar credenciales
- Archivos sensibles en .gitignore
- Revisión de código obligatoria
- Escaneo regular de secretos en el repositorio

## Archivos Protegidos

Estos archivos NUNCA deben ser commiteados:
- `llaves.py`
- `credentials.py`
- `secrets.py`
- Cualquier archivo con credenciales SSL.com
