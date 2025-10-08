# My Events - Project Checklist

> Checklist completo del proyecto siguiendo TDD workflow de CLAUDE.md
> Cada funcionalidad sigue: Arquitectura → RED → GREEN → Seguridad → Accesibilidad

**Leyenda:**
- ⬜ Pendiente
- 🟦 En progreso
- ✅ Completado
- 🔴 RED (tests failing)
- 🟢 GREEN (tests passing)

---

## 🎯 ÉPICA 1: Autenticación y Autorización

### US-001: Registro de Usuario
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Formulario con: email, password, confirmPassword, name
- Validaciones en tiempo real
- Email válido y único
- Password mínimo 8 caracteres, incluye mayúscula, minúscula y número
- Confirmación de contraseña debe coincidir
- Mostrar errores de validación debajo de cada campo
- Botón deshabilitado hasta que todos los campos sean válidos
- Redirección automática a login después de registro exitoso
- Manejo de errores del servidor

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de componentes signup
- ⬜ Definir tipos: `SignupCredentials`, `SignupResponse` (ya existen en api.types.ts)
- ⬜ Diseñar componentes:
  - `SignupForm.tsx` en `features/auth/components/`
  - `SignupPage.tsx` en `features/auth/pages/`
- ⬜ Planificar validaciones Zod (ya existe `signupSchema`)
- ⬜ Diseñar estructura de errores por campo
- ⬜ Planificar flujo de redirección post-signup
- ⬜ **Commit:** `feat: add signup architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/features/auth/components/SignupForm/SignupForm.test.tsx`
  - ⬜ Test: renderiza formulario con todos los campos
  - ⬜ Test: muestra error si email inválido
  - ⬜ Test: muestra error si password < 8 caracteres
  - ⬜ Test: muestra error si password no tiene mayúscula
  - ⬜ Test: muestra error si password no tiene minúscula
  - ⬜ Test: muestra error si password no tiene número
  - ⬜ Test: muestra error si passwords no coinciden
  - ⬜ Test: botón deshabilitado con datos inválidos
  - ⬜ Test: botón habilitado con datos válidos
  - ⬜ Test: llama a signup al enviar formulario válido
  - ⬜ Test: muestra error del servidor (email duplicado)
  - ⬜ Test: muestra loading durante registro
- ⬜ **Archivo:** `src/services/auth.service.test.ts`
  - ⬜ Test: `authService.signup()` envía credenciales correctas
  - ⬜ Test: `authService.signup()` retorna usuario con tokens
  - ⬜ Test: `authService.signup()` lanza error si email existe
- ⬜ **Archivo:** `src/features/auth/hooks/useSignup.test.ts` 
  - ⬜ Test: hook llama a authService.signup
  - ⬜ Test: hook guarda usuario en store al éxito
  - ⬜ Test: hook maneja errores correctamente
- ⬜ **Ejecutar:** `npm test` - Verificar que TODOS FALLAN ❌
- ⬜ **Commit:** `test: add signup tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ Verificar `signupSchema` en `auth.schema.ts` (ya existe)
- ⬜ Implementar `authService.signup()` en `services/auth.service.ts`
- ⬜ **Crear archivo:** `src/features/auth/hooks/useSignup.ts`
  ```typescript
  import { useMutation } from '@tanstack/react-query'
  import { authService } from '../../../services/auth.service'
  import { useAuthStore } from '../../../stores/useAuthStore/useAuthStore'

  export const useSignup = () => {
    const login = useAuthStore((state) => state.login)

    return useMutation({
      mutationFn: authService.signup,
      onSuccess: (data) => {
        login({
          ...data.user,
          token: data.token,
          refreshToken: data.refreshToken
        })
      }
    })
  }
  ```
- ⬜ **Crear archivo:** `src/features/auth/components/SignupForm/SignupForm.tsx`
  - ⬜ Importar useSignup hook
  - ⬜ Formulario con campos: email, name, password, confirmPassword
  - ⬜ Validación con signupSchema
  - ⬜ Manejo de errores por campo
  - ⬜ Mostrar loading durante signup
  - ⬜ Mostrar errores del servidor
  - ⬜ Botón deshabilitado según validación
- ⬜ **Crear archivo:** `src/features/auth/components/SignupForm/SignupForm.test.tsx`
- ⬜ **Crear archivo:** `src/features/auth/pages/SignupPage.tsx`
  - ⬜ Importar SignupForm
  - ⬜ Layout de página
  - ⬜ Link a login existente
  - ⬜ Redirección a login después de éxito
- ⬜ Añadir ruta `/signup` en router
- ⬜ Añadir link "Crear cuenta" en LoginPage
- ⬜ **Ejecutar:** `npm test` - Verificar que TODOS PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix` - Aplicar ESLint + Prettier
- ⬜ **Commit:** `feat: implement signup (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Verificar que `confirmPassword` NO se envía al servidor
- ⬜ Verificar sanitización de inputs (name, email)
- ⬜ Implementar rate limiting en formulario (prevenir spam)
- ⬜ Verificar que password NO se guarda en logs
- ⬜ Verificar que NO hay XSS en campos de texto
- ⬜ Añadir CAPTCHA si es necesario (opcional)
- ⬜ **Commit:** `fix: security improvements for signup`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Verificar labels correctos en todos los inputs
- ⬜ Añadir ARIA attributes necesarios
- ⬜ Navegación completa por teclado (Tab, Enter)
- ⬜ Anuncios de errores para screen readers (aria-live)
- ⬜ Contraste de colores WCAG AA en mensajes de error
- ⬜ Focus visible en todos los elementos interactivos
- ⬜ Verificar con herramienta axe DevTools
- ⬜ **Commit:** `feat: improve signup accessibility`

---

### US-002: Login de Usuario
**Estado:** 🟦 En progreso (70% completo)

**Criterios de Aceptación:**
- Formulario con: email y password
- Opción "Recordarme" para mantener sesión
- Validación de campos requeridos
- Mostrar mensaje de error si credenciales incorrectas
- Guardar JWT token en estado global y localStorage
- Redirección a dashboard después de login exitoso
- Link de recuperación de contraseña

#### Fase 1: Arquitectura ✅
- ✅ Diseñar estructura de `features/auth/`
- ✅ Definir tipos (`LoginCredentials`, `LoginResponse`)
- ✅ Crear `loginSchema` con Zod
- ✅ Diseñar `LoginForm`, `LoginPage`
- ✅ **Commit:** `feat: add auth architecture` (b7a9ee3)

#### Fase 2: TDD - Tests (RED) ✅
- ✅ Tests para `loginSchema`
- ✅ Tests para `useAuthStore`
- ✅ Tests para `LoginForm`
- ✅ **Commit:** Tests ya implementados

#### Fase 3: Implementación (GREEN) 🟦 EN PROGRESO
- ✅ Implementar `loginSchema`
- ✅ Implementar `LoginForm` (con datos mock)
- ✅ Crear `LoginPage`
- ✅ Crear `ProtectedRoute`
- 🟦 **EN PROGRESO:** Integrar servicio real de autenticación
  - ✅ Crear tipos API (`src/types/api.types.ts`)
  - 🟦 Configurar Axios (`src/lib/axios.ts`)
  - ⬜ Crear archivo `.env` con `VITE_API_URL`
  - ⬜ Verificar `.gitignore` incluye `.env`
  - ⬜ Crear `.env.example` como plantilla
  - ⬜ Configurar React Query (`src/lib/queryClient.ts`)
  - ⬜ Escribir tests para `authService.login()` (RED)
  - ⬜ Implementar `authService.login()` en `services/auth.service.ts`
  - ⬜ Verificar tests pasan (GREEN)
  - ⬜ Crear hook `useLogin` en `features/auth/hooks/useLogin.ts`
  - ⬜ Integrar hook en `LoginForm.tsx`
  - ⬜ Reemplazar datos mock con llamada real
  - ⬜ Añadir manejo de errores del servidor
  - ⬜ Implementar estados de loading (isPending)
  - ⬜ Implementar redirección inteligente (guardar ruta origen)
  - ⬜ Añadir QueryClientProvider en `main.tsx`
- ⬜ Implementar opción "Recordarme"
  - ⬜ Checkbox en formulario
  - ⬜ Persistir token por más tiempo si activo
- ⬜ Añadir link "¿Olvidaste tu contraseña?"
- ⬜ **Ejecutar:** `npm test` - Verificar que TODOS PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement login service integration (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Decisión: Tokens en httpOnly cookies vs localStorage
  - ⬜ Si localStorage: implementar medidas anti-XSS
  - ⬜ Si cookies: configurar httpOnly, secure, sameSite
- ⬜ Implementar CSRF protection si usando cookies
- ⬜ Implementar rate limiting (máx 5 intentos en 15 min)
- ⬜ No mostrar si error es "email no existe" vs "password incorrecta" (prevenir enumeration)
- ⬜ Verificar password NO se guarda en logs
- ⬜ Implementar timeout de sesión
- ⬜ **Commit:** `fix: security improvements for login`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Labels correctos en inputs
- ⬜ ARIA attributes (aria-label, aria-describedby para errores)
- ⬜ Navegación por teclado completa
- ⬜ Anuncios de errores (aria-live="polite")
- ⬜ Contraste de colores en botones y errores
- ⬜ Focus visible y ordenado
- ⬜ Verificar con screen reader (NVDA o VoiceOver)
- ⬜ **Commit:** `feat: improve login accessibility`

---

### US-003: Protección de Rutas
**Estado:** 🟦 En progreso (50% completo)

**Criterios de Aceptación:**
- Implementar guard/middleware para rutas protegidas
- Redireccionar a login si no hay token válido
- Verificar expiración de token
- Refresh automático de token si está por expirar

#### Fase 1: Arquitectura ✅
- ✅ Diseñar `ProtectedRoute` component en `global/components/`
- ✅ Planificar verificación de token
- ✅ Diseñar flujo de refresh automático
- ✅ **Commit:** Parte de arquitectura de auth

#### Fase 2: TDD - Tests (RED)
- ✅ Tests básicos para `ProtectedRoute`
- ⬜ **Archivo:** `src/global/components/ProtectedRoute/ProtectedRoute.test.tsx`
  - ⬜ Test: redirige a /login si no autenticado
  - ⬜ Test: muestra children si autenticado
  - ⬜ Test: guarda ruta de origen en state
  - ⬜ Test: verifica expiración de token
  - ⬜ Test: intenta refresh si token expirado pero refresh válido
  - ⬜ Test: redirige si refresh también expiró
- ⬜ **Archivo:** `src/lib/axios.test.ts`
  - ⬜ Test: interceptor añade Authorization header
  - ⬜ Test: interceptor maneja error 401
  - ⬜ Test: interceptor llama a refresh token
  - ⬜ Test: interceptor reintenta petición con nuevo token
  - ⬜ Test: interceptor logout si refresh falla
- ⬜ **Ejecutar:** `npm test` - Verificar que nuevos tests FALLAN ❌
- ⬜ **Commit:** `test: add route protection tests (RED)`

#### Fase 3: Implementación (GREEN)
- ✅ Implementar `ProtectedRoute` básico
- ⬜ Implementar verificación de expiración JWT
  - ⬜ Crear utilidad `isTokenExpired(token: string): boolean`
  - ⬜ Decodificar JWT y verificar campo `exp`
- ⬜ Implementar `authService.refreshToken()` en `services/auth.service.ts`
- ⬜ Implementar interceptores en `lib/axios.ts`:
  - ⬜ Request interceptor: añadir token automáticamente
  - ⬜ Response interceptor: manejar 401 y refresh automático
  - ⬜ Logout si refresh falla
- ⬜ Actualizar `ProtectedRoute` para usar refresh
- ⬜ Guardar ruta de origen en location.state
- ⬜ Usar ruta guardada en LoginForm para redirección
- ⬜ **Ejecutar:** `npm test` - Verificar que TODOS PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement route protection with token refresh (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Verificar que tokens NO se exponen en logs del navegador
- ⬜ Implementar rotación de refresh tokens (nuevo refresh en cada refresh)
- ⬜ Limpiar todos los tokens al hacer logout
- ⬜ Limpiar tokens si detecta manipulación
- ⬜ Implementar detección de sesiones concurrentes (opcional)
- ⬜ **Commit:** `fix: security improvements for route protection`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Anunciar redirecciones a screen readers
- ⬜ Mensaje visible de "Redirigiendo a login..."
- ⬜ Loading state accesible durante verificación
- ⬜ **Commit:** `feat: improve route protection accessibility`

---

## 🎯 ÉPICA 2: Gestión de Eventos

### US-004: Listar Eventos Disponibles
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Grid/Lista con tarjetas de eventos
- Mostrar: título, fecha, ubicación, capacidad disponible, imagen
- Paginación (10 eventos por página)
- Indicador visual para eventos llenos
- Skeleton loading mientras carga
- Filtros por: fecha, categoría, estado
- Ordenamiento por: fecha, nombre, capacidad
- Búsqueda por nombre (mínimo 3 caracteres)
- Diseño responsive para móvil

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/events/`
  ```
  features/events/
    components/
      EventCard/
        EventCard.tsx
        EventCard.test.tsx
      EventList/
        EventList.tsx
        EventList.test.tsx
      EventFilters/
        EventFilters.tsx
        EventFilters.test.tsx
      EventSearch/
        EventSearch.tsx
        EventSearch.test.tsx
      EventSkeleton/
        EventSkeleton.tsx
    hooks/
      useEvents.ts
      useEvents.test.ts
    pages/
      EventsPage.tsx
    types/
      event.types.ts
  ```
- ⬜ Definir tipos en `src/types/event.types.ts`:
  - `Event` (ya existe en PROJECT_SPECS)
  - `EventListResponse`
  - `EventFilters`
  - `EventSortBy`
  - `PaginationParams`
- ⬜ Diseñar componentes:
  - `EventCard` - Tarjeta individual de evento
  - `EventList` - Lista/Grid de eventos
  - `EventFilters` - Filtros (fecha, categoría, estado)
  - `EventSearch` - Barra de búsqueda
  - `EventSkeleton` - Loading placeholder
  - `Pagination` - Controles de paginación
- ⬜ Planificar servicio `eventService.getEvents(params)`
- ⬜ Diseñar hook `useEvents` con React Query
- ⬜ Planificar estados: loading, error, empty, success
- ⬜ Diseñar responsive breakpoints
- ⬜ **Commit:** `feat: add event list architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/event.service.test.ts`
  - ⬜ Test: `getEvents()` sin parámetros retorna eventos
  - ⬜ Test: `getEvents()` con paginación retorna página correcta
  - ⬜ Test: `getEvents()` con filtros aplica filtros
  - ⬜ Test: `getEvents()` con búsqueda filtra por texto
  - ⬜ Test: `getEvents()` con ordenamiento ordena correctamente
  - ⬜ Test: maneja error de red correctamente
- ⬜ **Archivo:** `src/features/events/hooks/useEvents.test.ts`
  - ⬜ Test: hook retorna datos de eventos
  - ⬜ Test: hook maneja loading state
  - ⬜ Test: hook maneja error state
  - ⬜ Test: hook actualiza al cambiar filtros
  - ⬜ Test: hook implementa paginación
- ⬜ **Archivo:** `src/features/events/components/EventCard/EventCard.test.tsx`
  - ⬜ Test: renderiza título, fecha, ubicación
  - ⬜ Test: muestra imagen si existe
  - ⬜ Test: muestra capacidad disponible
  - ⬜ Test: muestra indicador "Lleno" si no hay cupos
  - ⬜ Test: es clickeable y navega a detalle
  - ⬜ Test: formato de fecha correcto
- ⬜ **Archivo:** `src/features/events/components/EventList/EventList.test.tsx`
  - ⬜ Test: renderiza múltiples EventCards
  - ⬜ Test: muestra skeleton durante loading
  - ⬜ Test: muestra mensaje si lista vacía
  - ⬜ Test: muestra error si falla carga
  - ⬜ Test: aplica layout grid en desktop
  - ⬜ Test: aplica layout lista en móvil
- ⬜ **Archivo:** `src/features/events/components/EventFilters/EventFilters.test.tsx`
  - ⬜ Test: renderiza todos los filtros
  - ⬜ Test: llama callback al cambiar fecha
  - ⬜ Test: llama callback al cambiar categoría
  - ⬜ Test: llama callback al cambiar estado
  - ⬜ Test: botón "Limpiar filtros" resetea todo
- ⬜ **Archivo:** `src/features/events/components/EventSearch/EventSearch.test.tsx`
  - ⬜ Test: no busca con menos de 3 caracteres
  - ⬜ Test: busca con 3+ caracteres
  - ⬜ Test: debounce de búsqueda (espera 300ms)
  - ⬜ Test: muestra número de resultados
  - ⬜ Test: botón limpiar búsqueda
- ⬜ **Ejecutar:** `npm test` - Verificar que TODOS FALLAN ❌
- ⬜ **Commit:** `test: add event list tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ Copiar interface `Event` de PROJECT_SPECS a `src/types/event.types.ts`
- ⬜ Crear tipos adicionales en `event.types.ts`
- ⬜ **Implementar:** `src/services/event.service.ts`
  ```typescript
  export const eventService = {
    getEvents: async (params?: EventQueryParams): Promise<EventListResponse> => {
      const response = await api.get('/events', { params })
      return response.data
    }
  }
  ```
- ⬜ **Implementar:** `src/features/events/hooks/useEvents.ts`
  ```typescript
  export const useEvents = (params?: EventQueryParams) => {
    return useQuery({
      queryKey: ['events', params],
      queryFn: () => eventService.getEvents(params)
    })
  }
  ```
- ⬜ **Implementar:** `EventCard.tsx`
  - ⬜ Mostrar imagen (con fallback si no existe)
  - ⬜ Mostrar título, fecha formateada, ubicación
  - ⬜ Mostrar capacidad: "X de Y disponibles"
  - ⬜ Badge "Lleno" si currentAttendees >= capacity
  - ⬜ onClick navega a `/events/${event.id}`
  - ⬜ Estilos con Tailwind CSS
- ⬜ **Implementar:** `EventSkeleton.tsx`
  - ⬜ Placeholder animado para carga
  - ⬜ Mismas dimensiones que EventCard
- ⬜ **Implementar:** `EventList.tsx`
  - ⬜ Usar hook useEvents
  - ⬜ Mostrar skeleton si isLoading
  - ⬜ Mostrar error si isError
  - ⬜ Mostrar mensaje "No hay eventos" si empty
  - ⬜ Grid responsive (1 col móvil, 2 tablet, 3 desktop)
  - ⬜ Integrar paginación
- ⬜ **Implementar:** `EventFilters.tsx`
  - ⬜ Select para categoría
  - ⬜ Select para estado
  - ⬜ Date picker para fecha
  - ⬜ Botón "Limpiar filtros"
  - ⬜ Emitir cambios al componente padre
- ⬜ **Implementar:** `EventSearch.tsx`
  - ⬜ Input de búsqueda
  - ⬜ Debounce de 300ms
  - ⬜ Validación mínimo 3 caracteres
  - ⬜ Mostrar "X resultados encontrados"
  - ⬜ Icono de búsqueda
  - ⬜ Botón limpiar (X)
- ⬜ **Implementar:** `Pagination.tsx` (componente global)
  - ⬜ Botones Previous/Next
  - ⬜ Números de página
  - ⬜ Información "Mostrando X-Y de Z"
- ⬜ **Implementar:** `EventsPage.tsx`
  - ⬜ Integrar EventSearch
  - ⬜ Integrar EventFilters
  - ⬜ Integrar EventList
  - ⬜ Manejar estado de filtros
  - ⬜ Layout responsive
- ⬜ Añadir ruta `/events` en router
- ⬜ **Ejecutar:** `npm test` - Verificar que TODOS PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement event list (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Sanitizar input de búsqueda (prevenir XSS)
- ⬜ Validar parámetros de filtros antes de enviar
- ⬜ Validar paginación (no permitir páginas negativas)
- ⬜ Rate limiting en búsqueda (prevenir spam)
- ⬜ Escapar HTML en descripciones de eventos
- ⬜ **Commit:** `fix: security improvements for event list`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ ARIA labels en EventCards (role="article")
- ⬜ Navegación por teclado en grid
- ⬜ Anunciar resultados de búsqueda (aria-live)
- ⬜ Anunciar cambios de filtros
- ⬜ Labels descriptivos en selects
- ⬜ Focus visible en cards
- ⬜ Contraste en badges e indicadores
- ⬜ Alt text descriptivo en imágenes
- ⬜ Skip links para navegación rápida
- ⬜ **Commit:** `feat: improve event list accessibility`

---

### US-005: Ver Detalle de Evento
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Mostrar información completa: título, descripción, fecha, hora, duración
- Ubicación con mapa integrado
- Capacidad total y disponible
- Lista de sesiones programadas
- Información de speakers
- Botón de registro prominente (si hay cupos)
- Indicador si usuario ya está registrado
- Compartir en redes sociales
- Countdown si evento próximo

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/events/components/EventDetail/`
  ```
  EventDetail/
    EventDetail.tsx
    EventDetail.test.tsx
    components/
      EventHeader/
        EventHeader.tsx
      EventDescription/
        EventDescription.tsx
      EventLocation/
        EventLocation.tsx
        MapComponent.tsx
      EventSessions/
        EventSessions.tsx
        SessionCard.tsx
      EventCapacity/
        EventCapacity.tsx
      RegistrationButton/
        RegistrationButton.tsx
      CountdownTimer/
        CountdownTimer.tsx
      SocialShare/
        SocialShare.tsx
  ```
- ⬜ Definir tipos:
  - `EventDetail` (extender Event con más info)
  - `Location` (address, coordinates)
- ⬜ Planificar servicio `eventService.getEventById(id)`
- ⬜ Diseñar hook `useEvent(id)`
- ⬜ Decidir librería de mapas (Google Maps vs Leaflet)
- ⬜ Planificar integración con API de mapas
- ⬜ **Commit:** `feat: add event detail architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/event.service.test.ts`
  - ⬜ Test: `getEventById()` retorna evento completo
  - ⬜ Test: `getEventById()` lanza error si ID inválido
  - ⬜ Test: `getEventById()` lanza error si evento no existe
- ⬜ **Archivo:** `src/features/events/hooks/useEvent.test.ts`
  - ⬜ Test: hook retorna datos de evento
  - ⬜ Test: hook maneja loading state
  - ⬜ Test: hook maneja error 404
- ⬜ **Archivo:** `EventDetail/EventDetail.test.tsx`
  - ⬜ Test: renderiza título y descripción completa
  - ⬜ Test: renderiza fecha, hora, duración formateadas
  - ⬜ Test: renderiza ubicación con mapa
  - ⬜ Test: muestra capacidad total y disponible
  - ⬜ Test: muestra lista de sesiones
  - ⬜ Test: muestra botón registro si hay cupos
  - ⬜ Test: oculta botón registro si lleno
  - ⬜ Test: muestra "Ya registrado" si usuario inscrito
  - ⬜ Test: muestra countdown si evento próximo
  - ⬜ Test: muestra botones de redes sociales
  - ⬜ Test: skeleton durante loading
  - ⬜ Test: error 404 si evento no existe
- ⬜ **Archivo:** `CountdownTimer/CountdownTimer.test.tsx`
  - ⬜ Test: muestra días, horas, minutos, segundos
  - ⬜ Test: actualiza cada segundo
  - ⬜ Test: muestra "Evento iniciado" si fecha pasada
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add event detail tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ **Implementar:** `eventService.getEventById()`
  ```typescript
  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`)
    return response.data
  }
  ```
- ⬜ **Implementar:** `useEvent(id)` hook
- ⬜ **Implementar:** `EventHeader.tsx`
  - ⬜ Imagen grande de evento
  - ⬜ Título principal
  - ⬜ Fecha y hora prominentes
  - ⬜ Badge de categoría
- ⬜ **Implementar:** `EventDescription.tsx`
  - ⬜ Descripción completa (puede contener HTML seguro)
  - ⬜ Tags del evento
  - ⬜ Info del organizador
- ⬜ **Implementar:** `EventLocation.tsx`
  - ⬜ Dirección completa
  - ⬜ Integrar mapa (Leaflet recomendado)
  - ⬜ Marcador en ubicación
  - ⬜ Botón "Cómo llegar"
- ⬜ **Implementar:** `EventSessions.tsx`
  - ⬜ Lista de sesiones con horarios
  - ⬜ Info de speakers por sesión
  - ⬜ Sala/ubicación de sesión
- ⬜ **Implementar:** `EventCapacity.tsx`
  - ⬜ Barra de progreso visual
  - ⬜ "X de Y lugares disponibles"
  - ⬜ Indicador "Lleno" si corresponde
- ⬜ **Implementar:** `RegistrationButton.tsx`
  - ⬜ Botón prominente "Registrarme"
  - ⬜ Deshabilitado si lleno
  - ⬜ Muestra "Ya registrado" si aplica
  - ⬜ onClick llama a registro (US-011)
- ⬜ **Implementar:** `CountdownTimer.tsx`
  - ⬜ Contador en tiempo real
  - ⬜ Formato: "Faltan X días, Y horas, Z minutos"
  - ⬜ useEffect con interval de 1 segundo
- ⬜ **Implementar:** `SocialShare.tsx`
  - ⬜ Botones: Facebook, Twitter, WhatsApp, Link
  - ⬜ Generar URLs de compartir correctas
  - ⬜ Copiar link al portapapeles
- ⬜ **Implementar:** `EventDetail.tsx` (componente principal)
  - ⬜ Integrar todos los subcomponentes
  - ⬜ Layout responsive
  - ⬜ Breadcrumb de navegación
- ⬜ Añadir ruta `/events/:id` en router
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement event detail (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Validar ID de evento (solo números/UUIDs)
- ⬜ Sanitizar descripción HTML (usar DOMPurify)
- ⬜ Validar URLs de imágenes (prevenir XSS)
- ⬜ No exponer datos sensibles del organizador
- ⬜ **Commit:** `fix: security improvements for event detail`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Estructura semántica (h1, h2, section, article)
- ⬜ Alt text descriptivo en imágenes
- ⬜ ARIA labels en botones de acción
- ⬜ Mapa accesible (descripción textual alternativa)
- ⬜ Countdown legible por screen readers
- ⬜ Focus management en modales
- ⬜ Contraste en todos los elementos
- ⬜ **Commit:** `feat: improve event detail accessibility`

---

### US-006: Crear Nuevo Evento
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Formulario multi-paso (4 pasos):
  - Paso 1: Información básica (título, descripción, categoría)
  - Paso 2: Fecha, hora y ubicación
  - Paso 3: Capacidad y configuración
  - Paso 4: Revisión y confirmación
- Validaciones por paso:
  - Título: 5-100 caracteres
  - Descripción: 20-500 caracteres
  - Fecha debe ser futura
  - Capacidad: mínimo 1, máximo 1000
- Preview del evento antes de guardar
- Opción "Guardar como borrador"
- Notificación de éxito después de crear

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/events/components/CreateEvent/`
  ```
  CreateEvent/
    CreateEventWizard.tsx
    CreateEventWizard.test.tsx
    steps/
      Step1BasicInfo/
        Step1BasicInfo.tsx
        Step1BasicInfo.test.tsx
      Step2DateTime/
        Step2DateTime.tsx
      Step3Capacity/
        Step3Capacity.tsx
      Step4Review/
        Step4Review.tsx
    components/
      StepIndicator/
        StepIndicator.tsx
      StepNavigation/
        StepNavigation.tsx
      EventPreview/
        EventPreview.tsx
  ```
- ⬜ Definir tipos:
  - `CreateEventData` (datos del formulario completo)
  - `EventDraft` (evento guardado como borrador)
  - `Step1Data`, `Step2Data`, `Step3Data`
- ⬜ Crear schemas de validación:
  - `step1Schema` (título, descripción, categoría)
  - `step2Schema` (fecha, hora, ubicación)
  - `step3Schema` (capacidad, configuración)
- ⬜ Planificar servicio `eventService.createEvent()`
- ⬜ Planificar servicio `eventService.saveDraft()`
- ⬜ Diseñar hook `useCreateEvent`
- ⬜ Planificar estado del wizard (paso actual, datos acumulados)
- ⬜ **Commit:** `feat: add create event architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/features/events/schemas/createEvent.schema.test.ts`
  - ⬜ Test: step1Schema valida título 5-100 chars
  - ⬜ Test: step1Schema valida descripción 20-500 chars
  - ⬜ Test: step1Schema requiere categoría
  - ⬜ Test: step2Schema valida fecha futura
  - ⬜ Test: step2Schema valida formato de hora
  - ⬜ Test: step2Schema valida dirección requerida
  - ⬜ Test: step3Schema valida capacidad 1-1000
- ⬜ **Archivo:** `src/services/event.service.test.ts`
  - ⬜ Test: `createEvent()` envía datos correctos
  - ⬜ Test: `createEvent()` retorna evento creado con ID
  - ⬜ Test: `saveDraft()` guarda borrador
- ⬜ **Archivo:** `CreateEventWizard.test.tsx`
  - ⬜ Test: muestra paso 1 inicialmente
  - ⬜ Test: botón "Siguiente" deshabilitado con datos inválidos
  - ⬜ Test: botón "Siguiente" habilitado con datos válidos
  - ⬜ Test: avanza al paso 2 al clickear "Siguiente"
  - ⬜ Test: retrocede al paso 1 con "Anterior"
  - ⬜ Test: acumula datos de cada paso
  - ⬜ Test: muestra preview en paso 4
  - ⬜ Test: crea evento al confirmar en paso 4
  - ⬜ Test: guarda draft con botón "Guardar borrador"
  - ⬜ Test: StepIndicator muestra progreso correcto
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add create event tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ **Crear:** `src/features/events/schemas/createEvent.schema.ts`
  ```typescript
  export const step1Schema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(500),
    category: z.string().min(1)
  })
  // ... step2Schema, step3Schema
  ```
- ⬜ **Implementar:** `eventService.createEvent()`
- ⬜ **Implementar:** `eventService.saveDraft()`
- ⬜ **Implementar:** `useCreateEvent` hook
  ```typescript
  export const useCreateEvent = () => {
    return useMutation({
      mutationFn: eventService.createEvent,
      onSuccess: (data) => {
        // Invalidar cache de eventos
        queryClient.invalidateQueries(['events'])
        // Notificación de éxito
        // Redirigir a detalle del evento
      }
    })
  }
  ```
- ⬜ **Implementar:** `Step1BasicInfo.tsx`
  - ⬜ Inputs: título, descripción (textarea), categoría (select)
  - ⬜ Validación en tiempo real con step1Schema
  - ⬜ Mostrar errores debajo de campos
- ⬜ **Implementar:** `Step2DateTime.tsx`
  - ⬜ Date picker para fecha
  - ⬜ Time picker para hora
  - ⬜ Input para duración
  - ⬜ Input/autocomplete para ubicación
  - ⬜ Validar fecha futura
- ⬜ **Implementar:** `Step3Capacity.tsx`
  - ⬜ Input numérico para capacidad
  - ⬜ Validar rango 1-1000
  - ⬜ Opciones adicionales (registro requiere aprobación, etc.)
- ⬜ **Implementar:** `Step4Review.tsx`
  - ⬜ Resumen de todos los datos
  - ⬜ Preview visual del evento
  - ⬜ Botón "Confirmar y crear"
  - ⬜ Link "Editar" para cada sección
- ⬜ **Implementar:** `StepIndicator.tsx`
  - ⬜ Visualización de 4 pasos
  - ⬜ Paso actual destacado
  - ⬜ Pasos completados con checkmark
- ⬜ **Implementar:** `StepNavigation.tsx`
  - ⬜ Botones "Anterior", "Siguiente", "Guardar borrador"
  - ⬜ Lógica de habilitación según validación
- ⬜ **Implementar:** `CreateEventWizard.tsx`
  - ⬜ Estado: pasoActual, datosAcumulados
  - ⬜ Navegación entre pasos
  - ⬜ Validación antes de avanzar
  - ⬜ Integrar hook useCreateEvent
  - ⬜ Manejo de loading y errores
- ⬜ Crear página `CreateEventPage.tsx`
- ⬜ Añadir ruta `/events/create` (protegida)
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement create event (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Sanitizar todos los inputs de texto
- ⬜ Validar capacidad del lado del servidor también
- ⬜ Verificar autenticación (solo usuarios autenticados)
- ⬜ Rate limiting (máx 5 eventos por hora)
- ⬜ Validar formato de imágenes subidas
- ⬜ Prevenir inyección HTML en descripción
- ⬜ **Commit:** `fix: security improvements for create event`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ ARIA labels en wizard ("Paso 1 de 4")
- ⬜ Anunciar cambios de paso
- ⬜ Navegación por teclado completa
- ⬜ Errores de validación accesibles
- ⬜ Focus management al cambiar paso
- ⬜ Labels descriptivos en todos los inputs
- ⬜ Instrucciones claras en cada paso
- ⬜ **Commit:** `feat: improve create event accessibility`

---

### US-007: Editar Evento Existente
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Solo el creador puede editar su evento
- Formulario pre-llenado con datos actuales
- Validar que no haya conflictos con asistentes registrados
- Historial de cambios
- Confirmación antes de guardar cambios

#### Fase 1: Arquitectura
- ⬜ Reutilizar componentes de US-006 (CreateEventWizard)
- ⬜ Definir tipo `UpdateEventData`
- ⬜ Planificar servicio `eventService.updateEvent(id, data)`
- ⬜ Planificar verificación de permisos (solo creador)
- ⬜ Diseñar componente `EditEventPage.tsx`
- ⬜ Planificar manejo de conflictos (ej: reducir capacidad con asistentes ya registrados)
- ⬜ **Commit:** `feat: add edit event architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/event.service.test.ts`
  - ⬜ Test: `updateEvent()` actualiza datos correctamente
  - ⬜ Test: `updateEvent()` lanza error si no es creador
  - ⬜ Test: `updateEvent()` valida conflictos de capacidad
- ⬜ **Archivo:** `EditEventPage.test.tsx`
  - ⬜ Test: carga datos actuales del evento
  - ⬜ Test: pre-llena formulario con datos
  - ⬜ Test: permite editar campos
  - ⬜ Test: valida cambios antes de guardar
  - ⬜ Test: muestra confirmación antes de guardar
  - ⬜ Test: redirige a detalle después de guardar
  - ⬜ Test: muestra error si no tiene permisos
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add edit event tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ **Implementar:** `eventService.updateEvent()`
- ⬜ **Implementar:** `useUpdateEvent` hook
- ⬜ **Implementar:** `EditEventPage.tsx`
  - ⬜ Cargar evento actual con `useEvent(id)`
  - ⬜ Verificar permisos (userId === event.organizerId)
  - ⬜ Reutilizar CreateEventWizard en modo "edit"
  - ⬜ Pre-llenar datos iniciales
  - ⬜ Modal de confirmación antes de guardar
  - ⬜ Validar conflictos del lado cliente
- ⬜ Añadir ruta `/events/:id/edit` (protegida)
- ⬜ Botón "Editar" en EventDetail (solo visible para creador)
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement edit event (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Verificar permisos en servidor (no solo cliente)
- ⬜ Validar que solo creador puede editar
- ⬜ Prevenir race conditions (optimistic locking)
- ⬜ Sanitizar inputs editados
- ⬜ **Commit:** `fix: security improvements for edit event`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Anunciar carga de datos
- ⬜ Modal de confirmación accesible
- ⬜ Focus management
- ⬜ **Commit:** `feat: improve edit event accessibility`

---

### US-008: Búsqueda Avanzada de Eventos
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Búsqueda en título y descripción
- Autocomplete con sugerencias
- Fuzzy search (tolerante a errores)
- Mostrar número de resultados
- Historial de búsquedas recientes
- Búsqueda por voz (opcional)

#### Fase 1: Arquitectura
- ⬜ Mejorar `EventSearch` de US-004
- ⬜ Planificar librería fuzzy search (fuse.js)
- ⬜ Diseñar componente `SearchAutocomplete`
- ⬜ Planificar almacenamiento de historial (localStorage)
- ⬜ Diseñar servicio `eventService.searchEvents(query)`
- ⬜ Planificar API de búsqueda avanzada
- ⬜ **Commit:** `feat: add advanced search architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/event.service.test.ts`
  - ⬜ Test: `searchEvents()` busca en título y descripción
  - ⬜ Test: fuzzy search encuentra con typos
  - ⬜ Test: retorna resultados ordenados por relevancia
- ⬜ **Archivo:** `SearchAutocomplete.test.tsx`
  - ⬜ Test: muestra sugerencias mientras escribe
  - ⬜ Test: navega sugerencias con flechas
  - ⬜ Test: selecciona con Enter
  - ⬜ Test: muestra historial de búsquedas
  - ⬜ Test: borra item del historial
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add advanced search tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ Instalar librería fuzzy search: `pnpm add fuse.js`
- ⬜ **Implementar:** `eventService.searchEvents()`
  - ⬜ Integrar fuse.js para fuzzy matching
  - ⬜ Configurar campos de búsqueda (title, description, tags)
  - ⬜ Configurar umbral de similitud
- ⬜ **Implementar:** `useSearchEvents` hook
- ⬜ **Implementar:** `SearchAutocomplete.tsx`
  - ⬜ Input con sugerencias desplegables
  - ⬜ Navegación por teclado (↑ ↓ Enter Esc)
  - ⬜ Highlighting de texto coincidente
  - ⬜ Sección de historial reciente
- ⬜ **Implementar:** Hook `useSearchHistory`
  - ⬜ Guardar búsquedas en localStorage
  - ⬜ Limitar a últimas 10 búsquedas
  - ⬜ Método para borrar historial
- ⬜ Reemplazar EventSearch básico con SearchAutocomplete
- ⬜ Mostrar "X resultados para 'query'"
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement advanced search (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Sanitizar query de búsqueda
- ⬜ Rate limiting en búsquedas
- ⬜ Validar longitud máxima de query
- ⬜ **Commit:** `fix: security improvements for search`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ ARIA attributes para autocomplete (combobox)
- ⬜ Anunciar número de sugerencias
- ⬜ Navegación por teclado completa
- ⬜ **Commit:** `feat: improve search accessibility`

---

## 🎯 ÉPICA 3: Gestión de Sesiones

### US-009: Programar Sesiones de Evento
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Modal/página para añadir sesión
- Campos: título, descripción, speaker, hora inicio, duración
- Validar que no haya traslapes de horario
- Drag & drop para reordenar sesiones
- Límite máximo de sesiones por evento
- Preview completo de la agenda

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/sessions/`
  ```
  features/sessions/
    components/
      SessionForm/
        SessionForm.tsx
      SessionList/
        SessionList.tsx
      SessionCard/
        SessionCard.tsx
      SessionTimeline/
        SessionTimeline.tsx
    hooks/
      useSessions.ts
      useCreateSession.ts
    types/
      session.types.ts
  ```
- ⬜ Definir tipos (Session ya existe en PROJECT_SPECS)
- ⬜ Planificar validación de horarios (no overlap)
- ⬜ Decidir librería drag & drop (react-beautiful-dnd o dnd-kit)
- ⬜ Planificar servicio `sessionService.createSession()`
- ⬜ **Commit:** `feat: add session management architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/features/sessions/schemas/session.schema.test.ts`
  - ⬜ Test: valida título requerido
  - ⬜ Test: valida duración mínima/máxima
  - ⬜ Test: valida hora de inicio
- ⬜ **Archivo:** `src/services/session.service.test.ts`
  - ⬜ Test: `createSession()` crea sesión
  - ⬜ Test: `createSession()` valida overlap
  - ⬜ Test: `getSessions(eventId)` retorna sesiones del evento
  - ⬜ Test: `updateSessionOrder()` reordena sesiones
- ⬜ **Archivo:** `SessionForm.test.tsx`
  - ⬜ Test: renderiza todos los campos
  - ⬜ Test: valida campos requeridos
  - ⬜ Test: detecta overlap de horarios
  - ⬜ Test: muestra error si overlap
  - ⬜ Test: crea sesión si datos válidos
- ⬜ **Archivo:** `SessionList.test.tsx`
  - ⬜ Test: renderiza lista de sesiones ordenadas
  - ⬜ Test: permite drag & drop
  - ⬜ Test: actualiza orden al soltar
  - ⬜ Test: muestra timeline visual
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add session management tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ Copiar interface `Session` de PROJECT_SPECS a types
- ⬜ **Crear:** `src/features/sessions/schemas/session.schema.ts`
  ```typescript
  export const sessionSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(500),
    startTime: z.date(),
    duration: z.number().min(15).max(480), // 15 min a 8 horas
    speakerId: z.string().optional()
  })
  ```
- ⬜ **Implementar:** `src/services/session.service.ts`
  - ⬜ `createSession(eventId, data)`
  - ⬜ `getSessions(eventId)`
  - ⬜ `updateSession(id, data)`
  - ⬜ `deleteSession(id)`
  - ⬜ `updateSessionOrder(eventId, sessionIds[])`
- ⬜ **Implementar:** `useCreateSession` hook
- ⬜ **Implementar:** `useSessions(eventId)` hook
- ⬜ **Implementar:** `SessionForm.tsx`
  - ⬜ Inputs: título, descripción, speaker (select), startTime, duration
  - ⬜ Validación con sessionSchema
  - ⬜ Validación de overlap (comparar con sesiones existentes)
  - ⬜ Mostrar error si overlap detectado
  - ⬜ Modal o página según diseño
- ⬜ **Implementar:** `SessionCard.tsx`
  - ⬜ Mostrar info de sesión
  - ⬜ Hora de inicio y fin
  - ⬜ Speaker (si existe)
  - ⬜ Botones: Editar, Eliminar
  - ⬜ Draggable handle para reordenar
- ⬜ Instalar: `pnpm add @dnd-kit/core @dnd-kit/sortable`
- ⬜ **Implementar:** `SessionList.tsx`
  - ⬜ Lista de SessionCards
  - ⬜ Integrar drag & drop con dnd-kit
  - ⬜ Actualizar orden en servidor al soltar
  - ⬜ Botón "Añadir sesión"
- ⬜ **Implementar:** `SessionTimeline.tsx`
  - ⬜ Vista visual de timeline del día
  - ⬜ Bloques de sesiones en línea temporal
  - ⬜ Detectar gaps entre sesiones
- ⬜ Integrar SessionList en EventDetail (US-005)
- ⬜ Botón "Gestionar sesiones" en edit event (solo organizador)
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement session management (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Verificar permisos (solo organizador del evento)
- ⬜ Validar overlap en servidor también
- ⬜ Sanitizar inputs
- ⬜ **Commit:** `fix: security improvements for sessions`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Drag & drop accesible con teclado
- ⬜ Anuncios de reordenamiento
- ⬜ ARIA labels en timeline
- ⬜ **Commit:** `feat: improve session accessibility`

---

### US-010: Asignar Speakers
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Buscar speakers existentes
- Crear nuevo speaker con: nombre, bio, foto, redes sociales
- Un speaker puede estar en múltiples sesiones
- Validar disponibilidad de horario del speaker
- Tarjeta de speaker con toda la información

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/speakers/`
  ```
  features/speakers/
    components/
      SpeakerForm/
        SpeakerForm.tsx
      SpeakerCard/
        SpeakerCard.tsx
      SpeakerSearch/
        SpeakerSearch.tsx
      SpeakerSelect/
        SpeakerSelect.tsx
    hooks/
      useSpeakers.ts
      useCreateSpeaker.ts
    types/
      speaker.types.ts
  ```
- ⬜ Definir tipos:
  ```typescript
  interface Speaker {
    id: string
    name: string
    bio: string
    photo?: string
    socialMedia: {
      twitter?: string
      linkedin?: string
      website?: string
    }
  }
  ```
- ⬜ Planificar servicio `speakerService`
- ⬜ Planificar validación de disponibilidad (no overlap de sesiones)
- ⬜ **Commit:** `feat: add speaker management architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/speaker.service.test.ts`
  - ⬜ Test: `createSpeaker()` crea speaker
  - ⬜ Test: `getSpeakers()` retorna lista
  - ⬜ Test: `searchSpeakers(query)` busca por nombre
  - ⬜ Test: `getSpeakerAvailability(id, eventId)` verifica horarios
- ⬜ **Archivo:** `SpeakerForm.test.tsx`
  - ⬜ Test: valida nombre requerido
  - ⬜ Test: valida bio mínimo 20 caracteres
  - ⬜ Test: valida URLs de redes sociales
  - ⬜ Test: permite subir foto
  - ⬜ Test: crea speaker con datos válidos
- ⬜ **Archivo:** `SpeakerSelect.test.tsx`
  - ⬜ Test: muestra lista de speakers
  - ⬜ Test: permite buscar speaker
  - ⬜ Test: permite crear nuevo speaker
  - ⬜ Test: selecciona speaker para sesión
  - ⬜ Test: valida disponibilidad de horario
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add speaker management tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ **Crear:** `src/types/speaker.types.ts`
- ⬜ **Crear:** `src/features/speakers/schemas/speaker.schema.ts`
  ```typescript
  export const speakerSchema = z.object({
    name: z.string().min(2).max(100),
    bio: z.string().min(20).max(500),
    photo: z.string().url().optional(),
    socialMedia: z.object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional()
    }).optional()
  })
  ```
- ⬜ **Implementar:** `src/services/speaker.service.ts`
- ⬜ **Implementar:** `useCreateSpeaker` hook
- ⬜ **Implementar:** `useSpeakers` hook
- ⬜ **Implementar:** `SpeakerForm.tsx`
  - ⬜ Campos: name, bio (textarea), photo (file upload)
  - ⬜ Inputs para redes sociales
  - ⬜ Preview de foto subida
  - ⬜ Validación con speakerSchema
- ⬜ **Implementar:** `SpeakerCard.tsx`
  - ⬜ Foto circular
  - ⬜ Nombre y bio
  - ⬜ Links a redes sociales
  - ⬜ Lista de sesiones donde participa
- ⬜ **Implementar:** `SpeakerSelect.tsx`
  - ⬜ Combobox con búsqueda
  - ⬜ Lista de speakers existentes
  - ⬜ Opción "Crear nuevo speaker"
  - ⬜ Validar disponibilidad al seleccionar
  - ⬜ Mostrar warning si overlap de horarios
- ⬜ Integrar SpeakerSelect en SessionForm
- ⬜ Mostrar speakers en EventDetail
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement speaker management (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Validar URLs de foto (prevenir XSS)
- ⬜ Sanitizar bio (puede contener HTML)
- ⬜ Validar tamaño y tipo de foto subida
- ⬜ Verificar permisos (solo organizador)
- ⬜ **Commit:** `fix: security improvements for speakers`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Alt text en fotos de speakers
- ⬜ ARIA labels en tarjetas
- ⬜ Navegación por teclado en select
- ⬜ **Commit:** `feat: improve speaker accessibility`

---

## 🎯 ÉPICA 4: Gestión de Asistentes

### US-011: Registrarse a Evento
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Botón de registro visible si hay cupos
- Confirmación antes de registrar
- Actualización inmediata del contador de cupos
- Email de confirmación (simulado)
- Añadir a calendario personal
- Opción para cancelar registro

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/registrations/`
  ```
  features/registrations/
    components/
      RegistrationButton/
        RegistrationButton.tsx
      RegistrationModal/
        RegistrationModal.tsx
      CancelRegistrationModal/
        CancelRegistrationModal.tsx
    hooks/
      useRegisterToEvent.ts
      useCancelRegistration.ts
    types/
      registration.types.ts
  ```
- ⬜ Definir tipos (Registration ya existe en PROJECT_SPECS)
- ⬜ Planificar servicio `registrationService.register()`
- ⬜ Planificar servicio `registrationService.cancel()`
- ⬜ Planificar verificación de cupos disponibles
- ⬜ Diseñar modal de confirmación
- ⬜ **Commit:** `feat: add registration architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/registration.service.test.ts`
  - ⬜ Test: `register()` registra usuario a evento
  - ⬜ Test: `register()` falla si evento lleno
  - ⬜ Test: `register()` falla si ya registrado
  - ⬜ Test: `cancel()` cancela registro
  - ⬜ Test: `getMyRegistrations()` retorna registros del usuario
- ⬜ **Archivo:** `RegistrationButton.test.tsx`
  - ⬜ Test: muestra "Registrarme" si hay cupos
  - ⬜ Test: muestra "Lleno" si sin cupos
  - ⬜ Test: muestra "Registrado" si ya inscrito
  - ⬜ Test: deshabilitado si lleno
  - ⬜ Test: abre modal de confirmación al click
  - ⬜ Test: registra al confirmar
  - ⬜ Test: actualiza contador de cupos
- ⬜ **Archivo:** `CancelRegistrationModal.test.tsx`
  - ⬜ Test: muestra confirmación antes de cancelar
  - ⬜ Test: cancela registro al confirmar
  - ⬜ Test: actualiza estado del evento
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add registration tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ Copiar interface `Registration` de PROJECT_SPECS
- ⬜ **Implementar:** `src/services/registration.service.ts`
  ```typescript
  export const registrationService = {
    register: async (eventId: string): Promise<Registration> => {
      const response = await api.post(`/events/${eventId}/register`)
      return response.data
    },
    cancel: async (registrationId: string): Promise<void> => {
      await api.delete(`/registrations/${registrationId}`)
    },
    getMyRegistrations: async (): Promise<Registration[]> => {
      const response = await api.get('/registrations/me')
      return response.data
    }
  }
  ```
- ⬜ **Implementar:** `useRegisterToEvent` hook
  ```typescript
  export const useRegisterToEvent = (eventId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: () => registrationService.register(eventId),
      onSuccess: () => {
        // Invalidar cache del evento para actualizar cupos
        queryClient.invalidateQueries(['event', eventId])
        queryClient.invalidateQueries(['my-registrations'])
      }
    })
  }
  ```
- ⬜ **Implementar:** `useCancelRegistration` hook
- ⬜ **Implementar:** `RegistrationModal.tsx`
  - ⬜ Título: "Confirmar registro"
  - ⬜ Resumen: nombre evento, fecha, ubicación
  - ⬜ Botones: "Cancelar", "Confirmar registro"
  - ⬜ Loading durante registro
  - ⬜ Cerrar automáticamente al éxito
- ⬜ **Implementar:** `RegistrationButton.tsx`
  - ⬜ Estados: disponible, lleno, registrado, loading
  - ⬜ onClick abre RegistrationModal
  - ⬜ Usa hook useRegisterToEvent
  - ⬜ Optimistic update de UI
- ⬜ **Implementar:** `CancelRegistrationModal.tsx`
  - ⬜ Confirmación de cancelación
  - ⬜ Advertencia de políticas de cancelación
  - ⬜ Botones: "No cancelar", "Sí, cancelar"
- ⬜ Integrar RegistrationButton en EventDetail
- ⬜ Actualizar contador de cupos en tiempo real
- ⬜ Simular "envío de email" (console.log o notificación)
- ⬜ Botón "Añadir a calendario" (genera archivo .ics)
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement event registration (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Verificar autenticación (solo usuarios logueados)
- ⬜ Verificar cupos en servidor (no confiar en cliente)
- ⬜ Prevenir double-submit (race condition)
- ⬜ Rate limiting (máx 5 registros por minuto)
- ⬜ **Commit:** `fix: security improvements for registration`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Modal accesible (aria-modal, focus trap)
- ⬜ Anunciar cambio de estado del botón
- ⬜ Confirmación clara y accesible
- ⬜ **Commit:** `feat: improve registration accessibility`

---

### US-012: Ver Mis Eventos
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Dashboard personalizado con:
  - Eventos próximos (ordenados por fecha)
  - Eventos pasados (archivo)
  - Eventos creados por mí
- Filtros por estado y fecha
- Exportar lista a PDF/Excel
- Notificaciones de eventos próximos (24h antes)
- Acciones rápidas: cancelar registro, ver detalle

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/dashboard/`
  ```
  features/dashboard/
    components/
      UpcomingEvents/
        UpcomingEvents.tsx
      PastEvents/
        PastEvents.tsx
      MyCreatedEvents/
        MyCreatedEvents.tsx
      DashboardFilters/
        DashboardFilters.tsx
      ExportButton/
        ExportButton.tsx
    hooks/
      useMyRegistrations.ts
      useMyCreatedEvents.ts
    pages/
      DashboardPage.tsx
  ```
- ⬜ Planificar servicios:
  - `registrationService.getMyRegistrations()`
  - `eventService.getMyEvents()`
- ⬜ Planificar filtros: upcoming, past, created, status
- ⬜ Planificar exportación (librería jsPDF o xlsx)
- ⬜ **Commit:** `feat: add dashboard architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `DashboardPage.test.tsx`
  - ⬜ Test: muestra eventos próximos ordenados por fecha
  - ⬜ Test: separa eventos pasados
  - ⬜ Test: muestra eventos creados por mí
  - ⬜ Test: aplica filtros correctamente
  - ⬜ Test: exporta a PDF
  - ⬜ Test: exporta a Excel
  - ⬜ Test: acciones rápidas funcionan
- ⬜ **Archivo:** `useMyRegistrations.test.ts`
  - ⬜ Test: hook retorna registraciones del usuario
  - ⬜ Test: filtra por upcoming/past
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add dashboard tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ **Implementar:** `useMyRegistrations` hook
  ```typescript
  export const useMyRegistrations = () => {
    return useQuery({
      queryKey: ['my-registrations'],
      queryFn: registrationService.getMyRegistrations
    })
  }
  ```
- ⬜ **Implementar:** `useMyCreatedEvents` hook
- ⬜ **Implementar:** `UpcomingEvents.tsx`
  - ⬜ Filtrar eventos con fecha futura
  - ⬜ Ordenar por fecha ascendente
  - ⬜ Mostrar countdown si faltan < 7 días
  - ⬜ Botón "Cancelar registro"
  - ⬜ Link a detalle de evento
- ⬜ **Implementar:** `PastEvents.tsx`
  - ⬜ Filtrar eventos con fecha pasada
  - ⬜ Ordenar por fecha descendente
  - ⬜ Indicador "Asistí" si attendanceConfirmed
  - ⬜ Opción de marcar como asistido (opcional)
- ⬜ **Implementar:** `MyCreatedEvents.tsx`
  - ⬜ Lista de eventos creados
  - ⬜ Estadísticas: registrados, capacidad
  - ⬜ Botones: Editar, Ver, Gestionar
- ⬜ **Implementar:** `DashboardFilters.tsx`
  - ⬜ Filtro por status (upcoming/past/all)
  - ⬜ Filtro por rango de fechas
  - ⬜ Ordenamiento
- ⬜ Instalar: `pnpm add jspdf xlsx`
- ⬜ **Implementar:** `ExportButton.tsx`
  - ⬜ Dropdown: "Exportar a PDF" / "Exportar a Excel"
  - ⬜ Generar PDF con lista de eventos
  - ⬜ Generar Excel con datos tabulares
  - ⬜ Download automático
- ⬜ **Implementar:** `DashboardPage.tsx`
  - ⬜ Tabs: "Próximos", "Pasados", "Creados por mí"
  - ⬜ Integrar filtros
  - ⬜ Integrar exportación
  - ⬜ Layout responsivo
- ⬜ Añadir ruta `/dashboard` (protegida)
- ⬜ Link en navegación principal
- ⬜ **Implementar notificaciones** (opcional):
  - ⬜ Verificar eventos en próximas 24h
  - ⬜ Mostrar badge o banner
  - ⬜ Usar Web Notifications API (pedir permiso)
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement user dashboard (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Verificar que solo ve sus propios eventos
- ⬜ Validar permisos en servidor
- ⬜ No exponer datos sensibles en exportaciones
- ⬜ **Commit:** `fix: security improvements for dashboard`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Tabs accesibles (ARIA)
- ⬜ Anunciar cambios de filtros
- ⬜ Navegación por teclado
- ⬜ **Commit:** `feat: improve dashboard accessibility`

---

### US-013: Control de Capacidad
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Actualización en tiempo real de cupos disponibles
- Bloquear registro cuando lleno
- Lista de espera cuando lleno
- Notificar si se libera un cupo
- Dashboard de analytics de ocupación

#### Fase 1: Arquitectura
- ⬜ Planificar sistema de waitlist (lista de espera)
- ⬜ Diseñar componentes:
  - `WaitlistButton.tsx`
  - `CapacityGauge.tsx` (medidor visual)
  - `CapacityAnalytics.tsx` (para organizadores)
- ⬜ Planificar servicio `waitlistService`
- ⬜ Planificar WebSocket o polling para updates en tiempo real
- ⬜ Diseñar tipos para Waitlist
- ⬜ **Commit:** `feat: add capacity control architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/waitlist.service.test.ts`
  - ⬜ Test: `joinWaitlist()` añade a lista de espera
  - ⬜ Test: `leaveWaitlist()` sale de lista
  - ⬜ Test: `getWaitlistPosition()` retorna posición
  - ⬜ Test: notifica cuando hay cupo disponible
- ⬜ **Archivo:** `CapacityGauge.test.tsx`
  - ⬜ Test: muestra porcentaje de ocupación
  - ⬜ Test: cambia color según ocupación (verde/amarillo/rojo)
  - ⬜ Test: actualiza en tiempo real
- ⬜ **Archivo:** `WaitlistButton.test.tsx`
  - ⬜ Test: se muestra solo si evento lleno
  - ⬜ Test: añade a waitlist al click
  - ⬜ Test: muestra posición en lista
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add capacity control tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ **Crear tipos:** `src/types/waitlist.types.ts`
  ```typescript
  interface WaitlistEntry {
    id: string
    userId: string
    eventId: string
    position: number
    joinedAt: Date
    notified: boolean
  }
  ```
- ⬜ **Implementar:** `src/services/waitlist.service.ts`
  - ⬜ `joinWaitlist(eventId)`
  - ⬜ `leaveWaitlist(eventId)`
  - ⬜ `getWaitlistPosition(eventId)`
- ⬜ **Implementar:** `useJoinWaitlist` hook
- ⬜ **Implementar:** `CapacityGauge.tsx`
  - ⬜ Barra de progreso visual
  - ⬜ Porcentaje: (currentAttendees / capacity) * 100
  - ⬜ Colores:
    - Verde: < 50%
    - Amarillo: 50-90%
    - Rojo: > 90%
  - ⬜ Texto: "X de Y lugares ocupados"
- ⬜ **Implementar:** `WaitlistButton.tsx`
  - ⬜ Visible solo si currentAttendees >= capacity
  - ⬜ Texto: "Unirse a lista de espera"
  - ⬜ Muestra posición después de unirse
  - ⬜ Botón para salir de lista
- ⬜ **Implementar actualización en tiempo real:**
  - Opción A: WebSocket (si backend lo soporta)
  - Opción B: Polling cada 30 segundos
  - ⬜ Hook `useRealtimeCapacity(eventId)`
- ⬜ **Implementar:** `CapacityAnalytics.tsx` (para organizadores)
  - ⬜ Gráfico de ocupación histórica
  - ⬜ Estadísticas: tasa de cancelación, tiempo promedio de registro
  - ⬜ Lista de espera actual
  - ⬜ Solo visible para organizador del evento
- ⬜ Integrar CapacityGauge en EventDetail
- ⬜ Integrar WaitlistButton en EventDetail
- ⬜ Añadir tab "Analytics" en EventDetail (solo organizador)
- ⬜ **Implementar notificación cuando hay cupo:**
  - ⬜ Backend notifica a primero en waitlist
  - ⬜ Mostrar notificación en app
  - ⬜ Email de notificación (simulado)
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement capacity control (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Validar capacidad en servidor (transacciones atómicas)
- ⬜ Prevenir race conditions en registro
- ⬜ Verificar permisos para analytics
- ⬜ **Commit:** `fix: security improvements for capacity control`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Anunciar cambios de capacidad
- ⬜ CapacityGauge accesible (aria-valuenow)
- ⬜ Notificaciones accesibles
- ⬜ **Commit:** `feat: improve capacity control accessibility`

---

## 🎯 ÉPICA 5: Perfil de Usuario

### US-014: Ver y Editar Perfil
**Estado:** ⬜ Pendiente

**Criterios de Aceptación:**
- Información editable: nombre, bio, avatar, preferencias
- Cambiar contraseña con verificación
- Estadísticas: eventos asistidos, eventos creados
- Configuración de notificaciones
- Eliminar cuenta con confirmación

#### Fase 1: Arquitectura
- ⬜ Diseñar estructura de `features/profile/`
  ```
  features/profile/
    components/
      ProfileHeader/
        ProfileHeader.tsx
      ProfileForm/
        ProfileForm.tsx
      ChangePasswordForm/
        ChangePasswordForm.tsx
      ProfileStats/
        ProfileStats.tsx
      NotificationSettings/
        NotificationSettings.tsx
      DeleteAccountModal/
        DeleteAccountModal.tsx
    hooks/
      useUpdateProfile.ts
      useChangePassword.ts
      useDeleteAccount.ts
    pages/
      ProfilePage.tsx
  ```
- ⬜ Definir tipos: `UserPreferences`, `ProfileUpdateData`
- ⬜ Planificar servicios:
  - `userService.updateProfile()`
  - `userService.changePassword()`
  - `userService.deleteAccount()`
  - `userService.getStats()`
- ⬜ **Commit:** `feat: add profile management architecture`

#### Fase 2: TDD - Tests (RED)
- ⬜ **Archivo:** `src/services/user.service.test.ts`
  - ⬜ Test: `updateProfile()` actualiza datos
  - ⬜ Test: `changePassword()` cambia contraseña
  - ⬜ Test: `changePassword()` valida contraseña actual
  - ⬜ Test: `deleteAccount()` elimina cuenta
  - ⬜ Test: `getStats()` retorna estadísticas
- ⬜ **Archivo:** `ProfileForm.test.tsx`
  - ⬜ Test: pre-llena datos actuales del usuario
  - ⬜ Test: permite editar nombre
  - ⬜ Test: permite editar bio
  - ⬜ Test: permite subir avatar
  - ⬜ Test: guarda cambios correctamente
- ⬜ **Archivo:** `ChangePasswordForm.test.tsx`
  - ⬜ Test: requiere contraseña actual
  - ⬜ Test: requiere nueva contraseña
  - ⬜ Test: requiere confirmación de nueva contraseña
  - ⬜ Test: valida que nueva contraseña sea diferente
  - ⬜ Test: valida fortaleza de contraseña
  - ⬜ Test: muestra error si contraseña actual incorrecta
- ⬜ **Archivo:** `DeleteAccountModal.test.tsx`
  - ⬜ Test: requiere confirmación
  - ⬜ Test: requiere escribir "ELIMINAR" para confirmar
  - ⬜ Test: elimina cuenta al confirmar
  - ⬜ Test: cierra sesión después de eliminar
- ⬜ **Ejecutar:** `npm test` - Verificar FALLAN ❌
- ⬜ **Commit:** `test: add profile management tests (RED)`

#### Fase 3: Implementación (GREEN)
- ⬜ **Crear tipos:** `src/types/profile.types.ts`
  ```typescript
  interface UserPreferences {
    emailNotifications: boolean
    pushNotifications: boolean
    language: 'es' | 'en'
    timezone: string
  }

  interface ProfileUpdateData {
    name?: string
    bio?: string
    avatar?: string
    preferences?: UserPreferences
  }
  ```
- ⬜ **Implementar:** `src/services/user.service.ts`
  ```typescript
  export const userService = {
    updateProfile: async (data: ProfileUpdateData): Promise<User> => {
      const response = await api.patch('/users/me', data)
      return response.data
    },
    changePassword: async (currentPassword: string, newPassword: string) => {
      await api.post('/users/me/change-password', {
        currentPassword,
        newPassword
      })
    },
    deleteAccount: async (): Promise<void> => {
      await api.delete('/users/me')
    },
    getStats: async (): Promise<UserStats> => {
      const response = await api.get('/users/me/stats')
      return response.data
    }
  }
  ```
- ⬜ **Implementar:** `useUpdateProfile` hook
- ⬜ **Implementar:** `useChangePassword` hook
- ⬜ **Implementar:** `useDeleteAccount` hook
- ⬜ **Crear schema:** `src/features/profile/schemas/profile.schema.ts`
  ```typescript
  export const profileSchema = z.object({
    name: z.string().min(2).max(50),
    bio: z.string().max(200).optional(),
    avatar: z.string().url().optional()
  })

  export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    confirmPassword: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  })
  ```
- ⬜ **Implementar:** `ProfileHeader.tsx`
  - ⬜ Avatar grande
  - ⬜ Nombre del usuario
  - ⬜ Bio
  - ⬜ Botón "Editar perfil"
- ⬜ **Implementar:** `ProfileForm.tsx`
  - ⬜ Input para nombre
  - ⬜ Textarea para bio
  - ⬜ Upload de avatar (con preview)
  - ⬜ Validación con profileSchema
  - ⬜ Botón "Guardar cambios"
  - ⬜ Loading durante actualización
- ⬜ **Implementar:** `ChangePasswordForm.tsx`
  - ⬜ Input contraseña actual (type="password")
  - ⬜ Input nueva contraseña
  - ⬜ Input confirmar nueva contraseña
  - ⬜ Indicador de fortaleza de contraseña
  - ⬜ Validación con changePasswordSchema
  - ⬜ Botón "Cambiar contraseña"
  - ⬜ Success message al cambiar
- ⬜ **Implementar:** `ProfileStats.tsx`
  - ⬜ Card "Eventos asistidos" con número
  - ⬜ Card "Eventos creados" con número
  - ⬜ Card "Próximos eventos" con número
  - ⬜ Opcional: Gráfico de actividad
- ⬜ **Implementar:** `NotificationSettings.tsx`
  - ⬜ Toggle: Notificaciones por email
  - ⬜ Toggle: Notificaciones push
  - ⬜ Select: Idioma
  - ⬜ Select: Zona horaria
  - ⬜ Guarda automáticamente al cambiar
- ⬜ **Implementar:** `DeleteAccountModal.tsx`
  - ⬜ Advertencia clara del impacto
  - ⬜ Input: "Escribe ELIMINAR para confirmar"
  - ⬜ Validar texto exacto
  - ⬜ Botón "Eliminar cuenta" (rojo, peligro)
  - ⬜ Al confirmar: eliminar cuenta y logout
- ⬜ **Implementar:** `ProfilePage.tsx`
  - ⬜ Tabs: "Perfil", "Contraseña", "Notificaciones", "Peligro"
  - ⬜ Tab Perfil: ProfileHeader + ProfileForm + ProfileStats
  - ⬜ Tab Contraseña: ChangePasswordForm
  - ⬜ Tab Notificaciones: NotificationSettings
  - ⬜ Tab Peligro: DeleteAccountModal
  - ⬜ Layout responsivo
- ⬜ Añadir ruta `/profile` (protegida)
- ⬜ Link "Mi perfil" en menú de usuario (navbar)
- ⬜ **Ejecutar:** `npm test` - Verificar PASAN ✅
- ⬜ **Ejecutar:** `npm run lint:fix`
- ⬜ **Commit:** `feat: implement user profile management (GREEN)`

#### Fase 4: Seguridad
- ⬜ Ejecutar agente `security-auditor`
- ⬜ Verificar contraseña actual antes de cambiar
- ⬜ Validar fortaleza de nueva contraseña
- ⬜ Sanitizar bio (prevenir XSS)
- ⬜ Validar avatar (tipo, tamaño, URL)
- ⬜ Confirmación por email antes de eliminar cuenta
- ⬜ No permitir recuperación de cuenta eliminada
- ⬜ **Commit:** `fix: security improvements for profile`

#### Fase 5: Accesibilidad
- ⬜ Ejecutar agente `wcag-compliance-auditor`
- ⬜ Tabs accesibles con ARIA
- ⬜ Labels en todos los inputs
- ⬜ Anunciar guardado exitoso
- ⬜ Modal de eliminación accesible
- ⬜ Contraste en botón peligroso
- ⬜ **Commit:** `feat: improve profile accessibility`

---

## 📊 Resumen de Progreso Global

### Estado General del Proyecto
- **Total User Stories:** 14
- **Completadas:** 0
- **En Progreso:** 2 (US-002: 70%, US-003: 50%)
- **Pendientes:** 12

### Por Épica

#### Épica 1: Autenticación y Autorización (40% completo)
- ✅ US-002: Login (70%) - 🟦 EN PROGRESO
- ⬜ US-001: Registro (0%)
- ⬜ US-003: Protección de rutas (50%) - 🟦 EN PROGRESO

#### Épica 2: Gestión de Eventos (0% completo)
- ⬜ US-004: Listar eventos (0%)
- ⬜ US-005: Detalle de evento (0%)
- ⬜ US-006: Crear evento (0%)
- ⬜ US-007: Editar evento (0%)
- ⬜ US-008: Búsqueda avanzada (0%)

#### Épica 3: Gestión de Sesiones (0% completo)
- ⬜ US-009: Programar sesiones (0%)
- ⬜ US-010: Asignar speakers (0%)

#### Épica 4: Gestión de Asistentes (0% completo)
- ⬜ US-011: Registro a evento (0%)
- ⬜ US-012: Dashboard de eventos (0%)
- ⬜ US-013: Control de capacidad (0%)

#### Épica 5: Perfil de Usuario (0% completo)
- ⬜ US-014: Gestión de perfil (0%)

---

## 🎯 Próximos Pasos Inmediatos

### 🟦 Ahora Mismo (Tarea Actual)
**US-002: Login - Fase 3 GREEN - Integración servicio real**

Pasos pendientes:
1. ✅ Crear `src/types/api.types.ts`
2. 🟦 Crear `src/lib/axios.ts`
3. ⬜ Crear archivo `.env` con `VITE_API_URL`
4. ⬜ Verificar `.gitignore` incluye `.env`
5. ⬜ Crear `.env.example`
6. ⬜ Crear `src/lib/queryClient.ts`
7. ⬜ Escribir tests para `authService.login()` (RED)
8. ⬜ Implementar `authService.login()` (GREEN)
9. ⬜ Crear hook `useLogin`
10. ⬜ Integrar hook en `LoginForm`
11. ⬜ Añadir QueryClientProvider en `main.tsx`

### ⬜ Siguiente (Después de completar US-002 GREEN)
**US-003: Protección de Rutas - Fase 3 GREEN**
- Implementar verificación de expiración JWT
- Implementar refresh automático de tokens
- Configurar interceptores de Axios

### ⬜ Luego
**US-002: Login - Fase 4 Seguridad**
- Ejecutar `security-auditor`
- Implementar mejoras de seguridad

### ⬜ Después
**US-002: Login - Fase 5 Accesibilidad**
- Ejecutar `wcag-compliance-auditor`
- Implementar mejoras de accesibilidad

### ⬜ Finalmente
**US-001: Registro de Usuario - Todas las fases**
- Arquitectura → RED → GREEN → Seguridad → Accesibilidad

---

## 📝 Convenciones y Notas

### Git Commits (según CLAUDE.md)
- `feat: add [feature] architecture` - Después de fase arquitectura
- `test: add [feature] tests (RED)` - Después de escribir tests que fallan
- `feat: implement [feature] (GREEN)` - Después de implementación exitosa
- `fix: security improvements` - Después de auditoría de seguridad
- `feat: improve accessibility` - Después de mejoras WCAG
- **NUNCA mencionar "Claude" en commits**

### Workflow TDD Estricto
1. **Arquitectura:** Diseñar estructura y tipos → Commit
2. **RED:** Escribir TODOS los tests → Verificar que FALLAN → Commit
3. **GREEN:** Implementar código → Verificar que PASAN → Lint → Commit
4. **Seguridad:** Auditar → Corregir → Commit
5. **Accesibilidad:** Auditar → Mejorar → Commit

### Agentes Especializados
- `scope-rule-architect` - Para arquitectura y estructura
- `react-programming-tutor` - Para aprender conceptos React
- `tdd-test-first` - Para escribir tests (fase RED)
- `tdd-implementer` - Para implementación (fase GREEN)
- `security-auditor` - Para auditoría de seguridad
- `wcag-compliance-auditor` - Para accesibilidad
- `git-commit-specialist` - Para commits semánticos

### Reglas de Oro
- ❌ NUNCA escribir código sin tests primero
- ❌ NUNCA implementar sin que tests fallen (RED)
- ❌ NUNCA hacer commit sin ejecutar lint
- ✅ SIEMPRE aplicar ESLint + Prettier
- ✅ SIEMPRE verificar que tests pasan antes de commit
- ✅ SIEMPRE seguir el workflow TDD completo

---

## 🔗 Referencias

- **PROJECT_SPECS.md** - Especificaciones completas del proyecto
- **CLAUDE.md** - Workflow TDD y convenciones
- **Tech Stack:**
  - React 19 + TypeScript
  - Zustand para estado global
  - React Query para estado del servidor
  - Tailwind CSS para estilos
  - Vitest + React Testing Library para tests
  - Axios para peticiones HTTP

---

**Última actualización:** 2025-10-08
**Versión del checklist:** 1.0
