# Sistema de Toast Anti-Duplicados

Este sistema evita que se muestren múltiples toasts con el mismo mensaje al mismo tiempo.

## ✨ Características

- ✅ **Evita duplicados automáticamente**: Solo muestra un toast por mensaje único
- ✅ **API compatible**: Misma interfaz que react-toastify
- ✅ **Limpieza automática**: Los toasts se eliminan del registro al cerrarse
- ✅ **Modo forzado disponible**: Para casos especiales donde se necesiten duplicados
- ✅ **Debugging integrado**: Herramientas para monitorear toasts activos

## 🚀 Uso Básico

```typescript
import { toast } from '@/app/data/utils';

// Esto solo mostrará un toast, sin importar cuántas veces se llame
toast.error('Refused: invalid or unreachable domain');
toast.error('Refused: invalid or unreachable domain'); // ← Este se omite automáticamente

// Diferentes tipos de toast
toast.success('¡Operación exitosa!');
toast.warning('Advertencia importante');
toast.warn('Advertencia importante'); // Alias para warning
toast.info('Información útil');
```

## 🔧 Opciones Avanzadas

### Deshabilitar prevención de duplicados

```typescript
// Forzar mostrar el toast sin verificar duplicados
toast.error('Error crítico', { preventDuplicate: false });

// O usar el modo force
toast.force.error('Este siempre se mostrará');
```

### Gestión manual de toasts

```typescript
// Cerrar un toast específico
const toastId = toast.success('Guardado');
toast.dismiss(toastId);

// Cerrar todos los toasts
toast.dismissAll();

// Verificar si un toast está activo
if (toast.isActive('Mi mensaje', 'error')) {
  console.log('Ya hay un toast de error con este mensaje');
}
```

## 🛠️ Debugging

```typescript
// Ver todos los toasts activos
console.log('Toasts activos:', toast.getActiveToasts());

// Limpiar el registro (útil para testing)
toast.clearRegistry();
```

## 📝 Migración desde react-toastify

### Antes:
```typescript
import { toast } from 'react-toastify';

toast.error('Mi mensaje');
```

### Después:
```typescript
import { toast } from '@/app/data/utils';

toast.error('Mi mensaje'); // Automáticamente evita duplicados
```

## ⚡ Casos de Uso Típicos

### 1. Validación de formularios
```typescript
// Solo muestra el error una vez, aunque se valide múltiples veces
const validateForm = () => {
  if (!email.includes('@')) {
    toast.error('Email inválido'); // Se evitará duplicado automáticamente
  }
};
```

### 2. Errores de API
```typescript
const fetchData = async () => {
  try {
    const response = await api.getData();
  } catch (error) {
    toast.error(error.message); // Solo un toast por tipo de error
  }
};
```

### 3. Estados de carga
```typescript
const saveData = async () => {
  const toastId = toast.info('Guardando...', { autoClose: false });
  
  try {
    await api.save(data);
    toast.dismiss(toastId);
    toast.success('¡Guardado exitosamente!');
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Error al guardar');
  }
};
```

## 🎯 Problema Resuelto

**Antes (con react-toastify):**
```typescript
// Múltiples llamadas al procesar dominios
toast.error('Refused: invalid or unreachable domain');
toast.error('Refused: invalid or unreachable domain');
toast.error('Refused: invalid or unreachable domain');
// Resultado: 🚨 Múltiples toasts idénticos spam al usuario
```

**Después (con nuestro sistema):**
```typescript
// Las mismas múltiples llamadas
toast.error('Refused: invalid or unreachable domain');
toast.error('Refused: invalid or unreachable domain');
toast.error('Refused: invalid or unreachable domain');
// Resultado: ✅ Solo un toast mostrado, experiencia limpia
```

## 🎯 Beneficios

1. **Mejor UX**: Los usuarios no ven spam de notificaciones
2. **Rendimiento**: Menos elementos DOM y procesamiento
3. **Limpieza visual**: Interfaz más ordenada
4. **Compatibilidad**: Drop-in replacement para react-toastify
5. **Flexibilidad**: Opciones para casos especiales

## 🔍 Implementación Interna

El sistema mantiene un `Map` de toasts activos usando una clave compuesta por:
- Tipo de toast (success, error, warning, info)
- Contenido del mensaje

Cuando un toast se cierra, se elimina automáticamente del registro. 