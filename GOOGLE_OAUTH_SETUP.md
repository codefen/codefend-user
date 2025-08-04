# 🔧 Google OAuth Setup Guide

## 📋 Configuración Completa de Google Cloud Console

### **1. 🎯 OAuth Consent Screen**

#### **Información de la App:**
- **App name:** Codefend
- **User support email:** tu-email@codefend.com
- **Developer contact information:** tu-email@codefend.com

#### **Scopes Agregados:**
```
✅ openid
✅ email  
✅ profile
✅ https://www.googleapis.com/auth/contacts.readonly
```

#### **Test Users:**
```
✅ Agregar tu email como test user
✅ Agregar emails de otros desarrolladores
```

### **2. 🔑 Credentials (OAuth 2.0 Client IDs)**

#### **Web Application:**
- **Name:** Codefend Web Client
- **Client ID:** `452661025370-q6rirfe3gfik0spkd65369b8q3hposp5.apps.googleusercontent.com`

#### **🚨 AUTHORIZED JAVASCRIPT ORIGINS (CRÍTICO):**
```
✅ https://codefend.com
✅ https://www.codefend.com
✅ https://api.codefend.com
✅ http://localhost:5173          ← AGREGAR ESTO
✅ http://localhost:3000          ← AGREGAR ESTO
✅ http://localhost:8080          ← AGREGAR ESTO
```

#### **🚨 AUTHORIZED REDIRECT URIS:**
```
✅ https://codefend.com/auth/google/callback
✅ https://www.codefend.com/auth/google/callback
✅ http://localhost:5173/auth/google/callback    ← AGREGAR ESTO
✅ http://localhost:3000/auth/google/callback    ← AGREGAR ESTO
```

### **3. 🔧 Pasos para Agregar localhost:**

1. **Ve a Google Cloud Console:** https://console.cloud.google.com/
2. **Selecciona tu proyecto**
3. **Ve a "APIs & Services" > "Credentials"**
4. **Edita tu OAuth 2.0 Client ID**
5. **En "Authorized JavaScript origins" agrega:**
   ```
   http://localhost:5173
   http://localhost:3000
   http://localhost:8080
   ```
6. **En "Authorized redirect URIs" agrega:**
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:3000/auth/google/callback
   ```
7. **Guarda los cambios**

### **4. ⏰ Tiempo de Propagación:**
- Los cambios pueden tardar **5-10 minutos** en propagarse
- Si sigue fallando, espera un poco más

---

## 🚨 **PROBLEMA ESPECÍFICO: Google Identity Services (GSI)**

### **🔍 El Error Real:**
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID
```

**Este error NO viene del OAuth tradicional, sino del GSI (One Tap).**

### **🎯 Solución para GSI:**

#### **1. Verificar Google Identity Services:**
1. **Ve a:** https://console.cloud.google.com/apis/credentials
2. **Busca tu OAuth 2.0 Client ID**
3. **Verifica que tenga estos orígenes EXACTOS:**
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   https://codefend.com
   https://www.codefend.com
   ```

#### **2. Configuración Adicional para GSI:**
1. **En Google Cloud Console:**
   - APIs & Services > OAuth consent screen
   - **Agregar en "Authorized domains":**
     ```
     localhost
     codefend.com
     ```

#### **3. Verificar APIs Habilitadas:**
1. **Ve a:** https://console.cloud.google.com/apis/library
2. **Busca y habilita:**
   - ✅ Google Identity Services API
   - ✅ Google+ API (si existe)
   - ✅ People API

#### **4. Configuración de GSI en el Código:**
```javascript
// En tu componente GoogleAuthButton
const gsiConfig = {
  client_id: '452661025370-q6rirfe3gfik0spkd65369b8q3hposp5.apps.googleusercontent.com',
  callback: handleCredentialResponse,
  auto_select: false,
  cancel_on_tap_outside: true,
  // Agregar configuración específica para localhost
  context: 'signup',
  ux_mode: 'popup',
  // Importante: especificar el origen
  origin: window.location.origin
};
```

#### **5. 🚨 PASO CRÍTICO: Verificar "Authorized Domains" en OAuth Consent Screen**
1. **Ve a:** https://console.cloud.google.com/apis/credentials/consent
2. **En la sección "Authorized domains":**
3. **Agrega estos dominios:**
   ```
   localhost
   codefend.com
   ```
4. **Esto es DIFERENTE de "Authorized JavaScript origins"**
5. **GSI necesita ambos configurados**

#### **6. 🔧 Configuración Específica para Desarrollo Local:**
1. **En Google Cloud Console > OAuth consent screen:**
   - **App domain:** `localhost`
   - **Authorized domains:** `localhost, codefend.com`
   - **Privacy policy URL:** (puede estar vacío para desarrollo)
   - **Terms of service URL:** (puede estar vacío para desarrollo)

2. **En Google Cloud Console > Credentials:**
   - **Authorized JavaScript origins:** `http://localhost:5173`
   - **Authorized redirect URIs:** `http://localhost:5173/auth/google/callback`

#### **7. ⏰ Tiempo de Propagación para GSI:**
- **GSI puede tardar hasta 30 minutos** en propagar cambios
- **Si sigue fallando después de 30 minutos:**
  - Limpiar cache del navegador
  - Probar en modo incógnito
  - Verificar que no haya extensiones bloqueando

#### **8. 🧪 Testing Específico para GSI:**
```javascript
// En la consola del navegador
console.log('Current Origin:', window.location.origin);
console.log('GSI Available:', !!window.google?.accounts?.id);
console.log('GSI Initialize:', !!window.google?.accounts?.id?.initialize);
```

---

## 🚨 **PROBLEMA ESPECÍFICO: localhost en Authorized Domains**

### **🔍 El Error Real:**
```
Invalid domain: must be a top private domain
```

**Google NO permite `localhost` en "Authorized domains" porque requiere dominios públicos.**

### **🎯 Soluciones para Desarrollo Local:**

#### **Opción 1: Usar un dominio local válido**
1. **Edita tu archivo hosts:**
   ```
   # Windows: C:\Windows\System32\drivers\etc\hosts
   # Mac/Linux: /etc/hosts
   
   127.0.0.1    local.codefend.com
   ```

2. **Configura tu servidor de desarrollo:**
   ```bash
   # En lugar de localhost:5173
   # Usar: local.codefend.com:5173
   ```

3. **En Google Cloud Console:**
   - **Authorized JavaScript origins:** `http://local.codefend.com:5173`
   - **Authorized domains:** `codefend.com` (ya lo tienes)

#### **Opción 2: Usar HTTPS local con mkcert**
1. **Instalar mkcert:**
   ```bash
   # Windows
   choco install mkcert
   
   # Mac
   brew install mkcert
   ```

2. **Generar certificado local:**
   ```bash
   mkcert -install
   mkcert localhost 127.0.0.1
   ```

3. **Configurar Vite para HTTPS:**
   ```javascript
   // vite.config.js
   export default {
     server: {
       https: {
         key: fs.readFileSync('localhost-key.pem'),
         cert: fs.readFileSync('localhost.pem')
       }
     }
   }
   ```

4. **En Google Cloud Console:**
   - **Authorized JavaScript origins:** `https://localhost:5173`
   - **Authorized domains:** `codefend.com`

#### **Opción 3: Deshabilitar GSI para desarrollo (Recomendado)**
1. **Modificar el código para usar solo OAuth tradicional:**
   ```javascript
   // En GoogleAuthButton.tsx
   const USE_GSI = false; // Deshabilitar GSI para desarrollo
   ```

2. **Usar solo el botón clásico de Google:**
   - No requiere configuración especial de dominios
   - Funciona perfectamente en localhost
   - Solo requiere "Authorized JavaScript origins"

#### **Opción 4: Usar Google OAuth Playground para testing**
1. **Para testing de contactos:**
   - Usar Google OAuth Playground
   - Obtener tokens manualmente
   - No requiere configuración de dominios

---

## 🚀 **Solución Recomendada para Desarrollo:**

### **Paso 1: Deshabilitar GSI temporalmente**
```javascript
// En GoogleAuthButton.tsx
const USE_GSI = false; // Cambiar a false para desarrollo
```

### **Paso 2: Usar solo OAuth tradicional**
- Mantener `http://localhost:5173` en "Authorized JavaScript origins"
- No necesitas `localhost` en "Authorized domains"

### **Paso 3: Para producción**
- Habilitar GSI cuando esté en `https://codefend.com`
- Agregar `codefend.com` en "Authorized domains"

---

## 🧪 **Testing Inmediato:**

### **Opción A: Deshabilitar GSI**
1. Cambia `USE_GSI = false` en el código
2. Prueba el registro
3. Debería funcionar sin errores de dominio

### **Opción B: Usar dominio local**
1. Agrega `127.0.0.1 local.codefend.com` en tu hosts
2. Accede a `http://local.codefend.com:5173`
3. Configura `local.codefend.com` en Google Cloud Console

**¿Quieres que deshabilitemos GSI temporalmente para que funcione en desarrollo?** 🎯

---

## 🧪 Testing Después de la Configuración

### **1. Limpiar Cache del Navegador:**
```
Ctrl + Shift + R (Hard Refresh)
```

### **2. Verificar en Console:**
```javascript
// Debería aparecer sin errores de origen
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

### **3. Probar Popup:**
- El popup de Google debería abrirse correctamente
- No debería aparecer "Failed to open popup window"

### **4. Verificar GSI Específicamente:**
```javascript
// En la consola del navegador
console.log('GSI Client ID:', window.google?.accounts?.id?.initialize);
console.log('Current Origin:', window.location.origin);
```

---

## 🔍 Debugging Específico para GSI

### **Si sigue fallando:**

1. **Verificar Client ID en GSI:**
   ```javascript
   console.log('GSI Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
   ```

2. **Verificar Origen:**
   ```javascript
   console.log('Origin:', window.location.origin);
   ```

3. **Verificar en Google Cloud Console:**
   - Los orígenes están exactamente como aparecen en el navegador
   - No hay espacios extra
   - El protocolo es correcto (http vs https)

4. **Verificar APIs Habilitadas:**
   - Google Identity Services API debe estar habilitada
   - People API debe estar habilitada

---

## 📞 URLs Importantes

- **Google Cloud Console:** https://console.cloud.google.com/
- **OAuth Playground:** https://developers.google.com/oauthplayground/
- **Google OAuth Docs:** https://developers.google.com/identity/protocols/oauth2
- **Google Identity Services:** https://developers.google.com/identity/gsi/web

---

*Última actualización: Julio 2025* 

## 🚨 **TROUBLESHOOTING: Botón no funciona**

### **🔍 Síntomas:**
- ✅ Botón se renderiza correctamente
- ✅ No hay errores en consola
- ❌ Al hacer clic no pasa nada
- ❌ No se abre popup de Google

### **🎯 Soluciones:**

#### **1. Verificar "Authorized JavaScript origins"**
1. **Ve a:** https://console.cloud.google.com/apis/credentials
2. **Edita tu OAuth 2.0 Client ID**
3. **Verifica que tenga EXACTAMENTE:**
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   https://codefend.com
   https://www.codefend.com
   ```

#### **2. Verificar que el dominio coincida**
```javascript
// En la consola del navegador
console.log('Current origin:', window.location.origin);
console.log('Current href:', window.location.href);
```

**El origen debe coincidir EXACTAMENTE** con lo configurado en Google Cloud Console.

#### **3. Verificar que GSI esté cargado**
```javascript
// En la consola del navegador
console.log('Google available:', !!window.google);
console.log('Google accounts available:', !!window.google?.accounts);
console.log('Google accounts.id available:', !!window.google?.accounts?.id);
```

#### **4. Verificar configuración de GSI**
```javascript
// En la consola del navegador
console.log('GSI initialize available:', !!window.google?.accounts?.id?.initialize);
console.log('GSI renderButton available:', !!window.google?.accounts?.id?.renderButton);
```

#### **5. Verificar que el botón esté en el DOM**
```javascript
// En la consola del navegador
console.log('Button container:', document.getElementById('google-signin-button'));
```

#### **6. Verificar que no haya bloqueadores**
- **Extensiones del navegador** que bloqueen popups
- **Configuración de privacidad** del navegador
- **Firewall o antivirus** que bloqueen conexiones

#### **7. Probar en modo incógnito**
- Abrir ventana incógnita
- Ir a `http://localhost:5173`
- Probar el botón

#### **8. Verificar logs del servidor**
```bash
# Windows PowerShell
Get-Content api.codefend.com/.errors -Wait

# Linux/Mac
tail -f api.codefend.com/.errors
```

---

## 🔧 **Configuración Mínima Requerida:**

### **Para que funcione en localhost:**
1. ✅ **Authorized JavaScript origins:** `http://localhost:5173`
2. ✅ **OAuth consent screen:** Configurado con scopes básicos
3. ✅ **Test users:** Tu email agregado como test user
4. ✅ **Client ID:** Configurado correctamente en el código

### **NO necesitas:**
- ❌ `localhost` en "Authorized domains" (no es posible)
- ❌ HTTPS en desarrollo local
- ❌ Dominios adicionales

---

## 🧪 **Testing Paso a Paso:**

### **1. Verificar configuración:**
```javascript
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('Origin:', window.location.origin);
console.log('Google loaded:', !!window.google);
```

### **2. Verificar botón:**
```javascript
const button = document.querySelector('#google-signin-button');
console.log('Button found:', !!button);
console.log('Button children:', button?.children?.length);
```

### **3. Verificar eventos:**
```javascript
// Agregar listener temporal para debug
document.addEventListener('click', (e) => {
  if (e.target.closest('#google-signin-button')) {
    console.log('Button clicked!');
  }
});
```

---

## 🚀 **Solución de Emergencia:**

Si nada funciona, usar **Google OAuth Playground**:
1. Ve a: https://developers.google.com/oauthplayground/
2. Configura con tu Client ID
3. Obtén tokens manualmente
4. Usa para testing

**¿Puedes verificar que `http://localhost:5173` esté en "Authorized JavaScript origins"?** 🎯 

## 🚨 **SOLUCIÓN DEFINITIVA: Origen no autorizado**

### **🔍 El Error:**
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID
```

**Esto significa que `localhost:5173` NO está en "Authorized JavaScript origins".**

### **🎯 Solución Paso a Paso:**

#### **1. Ir a Google Cloud Console:**
1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu proyecto "Codefend"
3. Haz clic en tu OAuth 2.0 Client ID

#### **2. Verificar "Authorized JavaScript origins":**
**DEBE tener EXACTAMENTE:**
```
http://localhost:5173
http://127.0.0.1:5173
https://codefend.com
https://www.codefend.com
```

#### **3. Si falta `http://localhost:5173`:**
1. Haz clic en "+ ADD URI"
2. Agrega: `http://localhost:5173`
3. Haz clic en "SAVE"

#### **4. Esperar propagación:**
- Los cambios pueden tardar **5-10 minutos**
- Limpiar cache del navegador (Ctrl + Shift + R)

#### **5. Verificar que funcione:**
```javascript
// En la consola del navegador
console.log('Origin:', window.location.origin);
console.log('Should be: http://localhost:5173');
```

### **🚨 Si sigue fallando:**

#### **Opción A: Usar 127.0.0.1 en lugar de localhost**
1. En Google Cloud Console, agregar: `http://127.0.0.1:5173`
2. Acceder a: `http://127.0.0.1:5173` en lugar de `localhost:5173`

#### **Opción B: Verificar configuración completa**
1. **OAuth consent screen:** Configurado con scopes básicos
2. **Test users:** Tu email agregado
3. **Client ID:** Coincide en frontend y backend

#### **Opción C: Usar dominio local**
1. Editar hosts: `127.0.0.1 local.codefend.com`
2. Agregar: `http://local.codefend.com:5173` en Google Cloud Console
3. Acceder a: `http://local.codefend.com:5173`

---

## 🧪 **Testing Inmediato:**

### **1. Verificar configuración actual:**
```javascript
// En la consola
console.log('Current origin:', window.location.origin);
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

### **2. Verificar que no haya errores:**
- ❌ `[GSI_LOGGER]: The given origin is not allowed`
- ❌ `Failed to load resource: the server responded with a status of 403`
- ✅ `✅ Google Identity Services inicializado correctamente`

### **3. Probar registro completo:**
1. Ir a: `http://localhost:5173/test-google-registration`
2. Hacer clic en "Sign up with Google"
3. Debería abrir popup de Google sin errores
4. Después de login, debería obtener contactos automáticamente

---

## 🚀 **Resultado Esperado:**

### **Sin errores de origen:**
```
✅ Google Identity Services inicializado correctamente
✅ Botón Google GSI renderizado correctamente
✅ Google response recibido: {credential: "..."}
✅ Access token obtenido para contactos
✅ Gmail contacts obtained: 878 contacts
```

### **Con contactos guardados en DB:**
- `gmail_contacts` NO será NULL
- Contendrá JSON con todos los contactos

**¿Puedes verificar que `http://localhost:5173` esté en "Authorized JavaScript origins" en Google Cloud Console?** 🎯 