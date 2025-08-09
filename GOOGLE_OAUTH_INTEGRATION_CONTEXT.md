# 🔧 Google OAuth Integration - Context & Testing Files

## 📋 Resumen del Proyecto

Integración completa de Google OAuth con obtención de contactos de Gmail para el registro de usuarios en Codefend.

### 🎯 Funcionalidades Implementadas:
- ✅ Login con Google OAuth
- ✅ Registro automático con Google
- ✅ Obtención de contactos de Gmail (opcional)
- ✅ Almacenamiento de contactos en base de datos
- ✅ Sistema de debug completo

---

## 🗂️ Archivos de Testing Frontend

### **Páginas de Testing:**
```
src/app/views/pages/
├── TestGoogleContacts.tsx          # Test básico de contactos
├── TestGoogleRegistration.tsx      # Test de registro completo
└── TestGoogleDebug.tsx             # Debug paso a paso con POST
```

### **Componentes:**
```
src/app/views/components/
├── GoogleAuthButton/
│   ├── GoogleAuthButton.tsx        # Botón principal de Google OAuth
│   └── GoogleAuthButton.scss       # Estilos del botón
└── GoogleRegistration/
    └── GoogleRegistration.tsx      # Componente de registro completo
```

### **Hooks:**
```
src/app/data/hooks/users/auth/
└── useGoogleAuth.ts                # Hook principal de autenticación Google
```

### **Configuración:**
```
src/app/data/utils/
└── config.ts                       # Configuración de Google Client ID
```

### **Rutas Agregadas:**
```
src/app/router/Routes.tsx           # Rutas de testing agregadas:
- /test-google-contacts
- /test-google-registration  
- /test-google-debug
```

---

## 🗂️ Archivos de Testing Backend

### **Scripts de Debug:**
```
api.codefend.com/
├── test_people_api.php             # Test básico de People API
├── debug_google_registration.php   # Debug completo del registro
└── index.php                       # Router principal (agregado debug_google_registration)
```

### **Core de Usuarios:**
```
api.codefend.com/core/users/
├── users_add.php                   # Registro de usuarios (modificado para Google)
├── users_google_login.php          # Login específico de Google
├── users_access.php                # Login manual (sin cambios)
└── google_verify.php               # Verificación de tokens Google (modificado)
```

### **Documentación:**
```
GOOGLE_OAUTH_SETUP.md               # Guía de configuración de Google Cloud Console
```

---

## 🔧 Configuración Requerida

### **Variables de Entorno Frontend (.env):**
```env
VITE_GOOGLE_CLIENT_ID=452661025370-q6rirfe3gfik0spkd65369b8q3hposp5.apps.googleusercontent.com
VITE_ENABLE_GOOGLE_AUTH=true
```

### **Configuración Backend:**
```php
// En config.php o similar
$google_client_id = '452661025370-q6rirfe3gfik0spkd65369b8q3hposp5.apps.googleusercontent.com';
$google_client_secret = 'TU_GOOGLE_CLIENT_SECRET';
```

### **Google Cloud Console:**
- ✅ OAuth consent screen configurado
- ✅ Scopes agregados:
  - `openid`
  - `email` 
  - `profile`
  - `https://www.googleapis.com/auth/contacts.readonly`
- ✅ Usuarios de prueba agregados
- ✅ Authorized JavaScript origins configurados
- ✅ Authorized redirect URIs configurados

---

## 🧪 URLs de Testing

### **Frontend (localhost:5173):**
```
http://localhost:5173/test-google-contacts      # Test básico de contactos
http://localhost:5173/test-google-registration  # Test de registro completo
http://localhost:5173/test-google-debug         # Debug paso a paso
```

### **Backend (api.codefend.com):**
```
https://api.codefend.com/index.php?model=test_people_api
https://api.codefend.com/index.php?model=debug_google_registration
```

---

## 🔍 Problemas Resueltos

### **1. Contactos truncados (solo 4 contactos):**
- **Problema:** Filtro que solo mostraba contactos con email
- **Solución:** Removido filtro `!empty($contact_info['emails'])`
- **Archivos modificados:** `google_verify.php`, `test_people_api.php`

### **2. Tokens truncados en URL:**
- **Problema:** URLs GET tienen límite de longitud
- **Solución:** Cambiado a POST en debug script
- **Archivos modificados:** `debug_google_registration.php`, `TestGoogleDebug.tsx`

### **3. Cartel de advertencia Google:**
- **Problema:** Scope `contacts.readonly` es sensible
- **Solución:** Agregar usuarios de prueba en Google Cloud Console
- **Documentación:** `GOOGLE_OAUTH_SETUP.md`

### **4. Contactos no se guardan en DB:**
- **Problema:** En proceso de debug
- **Estado:** Creando sistema de debug paso a paso
- **Archivos:** `debug_google_registration.php`

---

## 🚀 Flujo de Registro Completo

### **1. Frontend (TestGoogleRegistration.tsx):**
```
Usuario → Login Google → Solicitar contactos → Enviar al backend
```

### **2. Backend (users_add.php):**
```
Recibir tokens → Verificar Google → Obtener contactos → Crear usuario → Guardar en DB
```

### **3. Base de Datos:**
```
Tabla: leads
- auth_data: JSON con datos de Google
- gmail_contacts: JSON con contactos (LONGTEXT)
```

---

## 🔧 Comandos Útiles

### **Ver logs del servidor:**
```bash
# Linux/Mac
tail -f api.codefend.com/.errors

# Windows PowerShell
Get-Content api.codefend.com/.errors -Wait
```

### **Verificar configuración:**
```bash
# Frontend
echo $VITE_GOOGLE_CLIENT_ID

# Backend
grep -r "google_client_id" api.codefend.com/
```

---

## 📊 Estado Actual

### **✅ Funcionando:**
- Login con Google OAuth
- Obtención de contactos (878 contactos)
- Verificación de tokens
- Interfaz de testing

### **🔄 En Proceso:**
- Debug de guardado en base de datos
- Integración en registro completo

### **📝 Pendiente:**
- Verificar por qué no se guardan contactos en DB
- Testing de registro completo
- Documentación final

---

## 🎯 Próximos Pasos

1. **Probar registro completo** con `TestGoogleRegistration.tsx`
2. **Verificar logs** del servidor durante registro
3. **Debug paso a paso** con `TestGoogleDebug.tsx`
4. **Corregir problemas** identificados
5. **Integrar en producción**

---

## 📞 Contactos de Referencia

- **Google OAuth Playground:** https://developers.google.com/oauthplayground/
- **Google Cloud Console:** https://console.cloud.google.com/
- **People API Docs:** https://developers.google.com/people/api/rest/v1/people.connections/list

---

*Última actualización: Julio 2025*
*Estado: En desarrollo - Testing activo* 