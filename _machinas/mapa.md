# 🗺️ MAPA DE LA APLICACIÓN CODEFEND

## 📋 RESUMEN EJECUTIVO

La aplicación Codefend es una plataforma de ciberseguridad con una arquitectura de **3 componentes principales**:

```
┌─────────────┬───────────────────────────┬───────────────────┐
│   SIDEBAR   │        MAIN CENTRAL       │   BARRA DERECHA   │
│  (Navbar    │     (Contenido dinámico)  │   (Navbar + Stats │
│  vertical)  │                           │   + Info)         │
└─────────────┴───────────────────────────┴───────────────────┘
```

---

## 🏗️ ARQUITECTURA PRINCIPAL

### **1. LAYOUT RAÍZ**
**Archivo**: `src/app/views/pages/panel/PanelPage.tsx`
- **Función**: Punto de entrada del panel, renderiza la estructura base
- **Componentes que renderiza**:
  - `<Sidebar />` - Barra lateral izquierda (navegación principal)
  - `<Outlet />` - Contenido dinámico (páginas específicas)
- **Responsabilidades**:
  - Autenticación y redirección
  - Gestión de modales globales
  - Event listeners globales
  - Responsive design (mobile fallback)

---

## 📱 COMPONENTES PRINCIPALES

### **1. SIDEBAR IZQUIERDA (Navbar Vertical)**

**Archivo principal**: `src/app/views/components/sidebar/Sidebar.tsx`
**Componentes internos**:
- `SidebarDesktop.tsx` - Versión de escritorio
- `SidebarMobile.tsx` - Versión móvil
- `SidebarOpenButton.tsx` - Botón para abrir en móvil

**CSS**: `src/app/views/components/sidebar/sidebar.scss`

**Estructura del menú** (en `SidebarDesktop.tsx`):
```
Main
├── Administration
├── Company Panel  
├── Dashboard ⭐ (activo)
├── Team members
├── User profile
└── Purchases

Attack surface
├── Web software
├── Network devices
└── Social attacks

Risk control
├── Detected issues
├── AI Surveillance
├── Dataleaks explorer
└── Ask a hacker
```

**Responsabilidades**:
- Navegación principal de la aplicación
- Gestión de permisos por rol de usuario
- Indicación de página activa
- Responsive (desktop/mobile)
- **Posición**: Fija, altura completa (100dvh)

---

### **2. MAIN CENTRAL (Contenido Dinámico)**

**Patrón común**: Cada página tiene su propio layout con `<section className="left">`

**Páginas principales**:

#### **Dashboard** 
- **Archivo**: `src/app/views/pages/panel/layouts/dashboard/Dashboard.tsx`
- **CSS**: `src/app/views/pages/panel/layouts/dashboard/dashboard.scss`
- **Componentes**:
  - `DashboardVulnerabilities` - Lista de vulnerabilidades
  - `DashboardInvoke` - Inicio de escaneos
  - `DashboardAddResource` - Agregar recursos
  - `DashboardAddCollaborators` - Agregar colaboradores

#### **Issues (Vulnerabilidades)**
- **Archivo**: `src/app/views/pages/panel/layouts/issues/layouts/IssuesPanel.tsx`
- **Componentes**:
  - `IssueResources` - Lista de issues
  - `IssueReport` - Reportes y filtros

#### **Scans**
- **Archivo**: `src/app/views/pages/panel/layouts/scans/ScanSection/ScanSection.tsx`
- **Funcionalidades**:
  - Inicio de escaneos automáticos
  - Pestañas: AI Scans / Web Surveillance
  - Animaciones de procesamiento de URLs

#### **Web Resources**
- **Archivo**: `src/app/views/pages/panel/layouts/web/WebApplicationPanel.tsx`

#### **Network**
- **Archivo**: `src/app/views/pages/panel/layouts/lan/Network.tsx`
- **Vistas**: Cards / Network Visualization / World Map

#### **Social Engineering**
- **Archivo**: `src/app/views/pages/panel/layouts/social/SocialEngineering.tsx`

#### **Mobile Apps**
- **Archivo**: `src/app/views/pages/panel/layouts/mobile/MobileApplicationPanel.tsx`

#### **Data Leaks (SNS)**
- **Archivo**: `src/app/views/pages/panel/layouts/sns/SnsPanel.tsx`
- **CSS**: `src/app/views/pages/panel/layouts/sns/Sns.scss`

---

### **3. BARRA DERECHA (Navbar + Stats & Info)**

**Patrón común**: Cada página tiene su propio layout con `<section className="right">`

**Componentes principales**:

#### **Navbar (Header Superior)**
**Archivo principal**: `src/app/views/components/navbar/Navbar.tsx`
**CSS**: `src/app/views/components/navbar/navbar.scss`

**Estructura**:
```tsx
<nav className="navbar">
  <div className="left">
    <div className="navbar-logo">        // Logo de la empresa
    <Breadcrumb />                       // "Codefend // dashboard"
  </div>
  <div className="right">
    <div className="actions">            // Iconos de usuario, OnBoard, logout
      {isAdmin() && (
        <div onClick={openOnBoard}>OnBoard</div>
        <NetworkIcon />                  // Settings de red
      )}
      <div className="user">             // Email del usuario
      <ThemeChangerButton />             // Cambio de tema
      <LogoutIcon />                     // Cerrar sesión
    </div>
  </div>
</nav>
```

**Responsabilidades**:
- Mostrar logo y breadcrumb de navegación
- Acciones de usuario (OnBoard, logout, configuraciones)
- Cambio de tema claro/oscuro
- **Nueva posición**: Integrado en la barra derecha como card
- **Estilo**: Card con bordes redondeados y sombra

#### **Componentes de Stats & Info**:
- `VulnerabilitiesStatus` - Estado de vulnerabilidades
- `VulnerabilityRisk` - Gráfico de riesgo
- `DashboardScanStart` - Inicio rápido de escaneos
- `ResourceByLocation` - Recursos por ubicación

---

## 🎨 SISTEMA DE ESTILOS

### **CSS Principal**
**Archivo**: `src/app/views/styles/index.scss`

**Variables importantes**:
```scss
:root {
  --sidebar-width: 240px;
  --nav-height: 50px;
  --card-space: 12px;
  --max-height-layout: min(calc(100dvh - 10px), 1016px);
}
```

**Layout base**:
```scss
main {
  display: flex;
  justify-content: space-between;
  padding-inline-start: calc(var(--sidebar-width) + var(--card-space) * 2);
  
  .left {
    flex: 1 1 70%;    // Columna principal
  }
  
  .right {
    flex: 1 1 45%;    // Barra derecha (navbar + stats)
  }
}
```

### **Navbar como Card**
```scss
.navbar {
  width: 100%;
  background: var(--primary-color);
  border-radius: var(--brd-radius);
  border: 1px solid var(--primary-color-300);
  box-shadow: 0 1px 4px 0 #00000010;
  padding: var(--card-space) calc(var(--card-space) * 1.5);
  margin-bottom: var(--card-space);
  color: var(--tertiary-color-700);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  max-width: 100%;
  box-sizing: border-box;
  animation: fadeInFromTop 0.5s ease-in-out;
  overflow: visible;
}
```

### **Temas**
**Archivo**: `src/app/views/styles/settings/_colors.scss`
- Soporte para tema claro y oscuro
- Variables CSS para colores dinámicos

---

## 🔧 COMPONENTES REUTILIZABLES

### **Modales**
**Directorio**: `src/app/views/components/modals/`
- `ModalWrapper.tsx` - Wrapper base
- `ConfirmModal.tsx` - Confirmaciones
- `reports/` - Modales de reportes
- `order/` - Modales de órdenes/pagos

### **Formularios y Inputs**
**Directorio**: `src/app/views/components/forms/`
- `SearchBar.tsx` - Barra de búsqueda principal
- Inputs especializados por tipo de recurso

### **Tablas**
**Directorio**: `src/app/views/components/Table/`
- `Tablev3.tsx` - Tabla principal v3
- Componentes de paginación y filtros

### **Botones**
**Directorio**: `src/app/views/components/buttons/`
- `PrimaryButton.tsx`
- `ThemeChangerButton.tsx`

---

## 📊 GESTIÓN DE ESTADO

### **Context Providers**
**Directorio**: `src/app/views/context/`
- `AppContextProvider.tsx` - Estado global principal
- `ThemeContext.tsx` - Gestión de temas
- `FlashLightContext.tsx` - Efectos visuales

### **Stores (Zustand)**
**Directorio**: `src/app/data/store/`
- `modal.store.ts` - Estado de modales
- `credential.store.ts` - Credenciales
- `updating.store.ts` - Actualizaciones

### **Hooks Personalizados**
**Directorio**: `src/app/data/hooks/`
- `common/` - Hooks generales
- `panel/` - Hooks específicos del panel
- `users/` - Hooks de usuarios

---

## 🛣️ RUTAS Y NAVEGACIÓN

### **Router Principal**
**Archivo**: `src/app/router/Routes.tsx`

**Estructura de rutas**:
```
/
├── /auth/signin
├── /auth/signup
└── /panel/
    ├── / (dashboard)
    ├── /web
    ├── /network  
    ├── /social
    ├── /mobile
    ├── /issues
    ├── /scans
    ├── /preferences
    └── /admin
```

---

## 🔍 PATRONES DE DESARROLLO

### **Estructura de Página Típica**
```tsx
const PageComponent = () => {
  const [showScreen] = useShowScreen();
  const { data, isLoading } = usePageData();
  
  return (
    <main className={`page-name ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        {/* Contenido principal */}
      </section>
      <section className="right">
        {/* Barra lateral derecha */}
      </section>
    </main>
  );
};
```

### **Gestión de Loading States**
- Hook `useShowScreen()` para animaciones de entrada
- Componente `PageLoader` para estados de carga
- Skeleton loaders en componentes específicos

### **Responsive Design**
- Breakpoint principal: 1230px
- Mobile fallback para pantallas pequeñas
- CSS Container Queries para componentes específicos

---

## 🚀 FUNCIONALIDADES ESPECIALES

### **Escaneos Automáticos**
**Archivo**: `src/app/views/pages/panel/layouts/scans/ScanSection/ScanSection.tsx`
- Procesamiento de URLs con animaciones
- Limpieza automática de protocolos y rutas
- Estados de progreso visual

### **Telemetría y Analytics**
**Directorio**: `src/app/views/components/telemetry/`
- Tracking de secciones visitadas
- Métricas de uso de escaneos

### **Sistema de Permisos**
- Hooks: `useUserRole()`, `useUserData()`
- Roles: admin, user, provider, reseller
- Componentes condicionalmente renderizados

---

## 📋 CHECKLIST DE NAVEGACIÓN RÁPIDA

### Para modificar el header:
1. `src/app/views/components/navbar/Navbar.tsx`
2. `src/app/views/components/navbar/navbar.scss`

### Para modificar la sidebar:
1. `src/app/views/components/sidebar/SidebarDesktop.tsx`
2. `src/app/views/components/sidebar/sidebar.scss`

### Para agregar una nueva página:
1. Crear en `src/app/views/pages/panel/layouts/[nombre]/`
2. Agregar ruta en `src/app/router/Routes.tsx`
3. Agregar ítem en `SidebarDesktop.tsx`

### Para modificar estilos globales:
1. `src/app/views/styles/index.scss` - Layout principal
2. `src/app/views/styles/settings/_colors.scss` - Variables de color

### Para trabajar con modales:
1. `src/app/views/components/modals/`
2. Registrar en `PanelPage.tsx` si es global

---

## 🎯 PUNTOS CLAVE PARA REFORMAS

1. **Layout principal**: `PanelPage.tsx` es el punto de entrada
2. **Estructura CSS**: Basada en flexbox con 3 columnas principales
3. **Componentes modulares**: Cada sección es independiente
4. **Estado global**: Manejado por Context + Zustand
5. **Responsive**: Mobile-first con breakpoints específicos

---

*Última actualización: Enero 2025*
*Versión de la app: v25.0.3* 