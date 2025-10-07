# Tutorial de Autenticación - React 19 + Zustand + TDD

> 📚 Tutorial educativo paso a paso para implementar login y autenticación en TaskFlow
>
> **Fecha:** 2025-10-04
> **Stack:** React 19, TypeScript, Zustand, Vitest, React Testing Library

---

## Índice

1. [Paso 1: Fundamentos de Autenticación](#paso-1-fundamentos-de-autenticación)
2. [Paso 2: Tests para AuthStore (TDD)](#paso-2-tests-para-authstore-tdd)
3. [Paso 2 (Implementación): Cómo escribir los tests](#paso-2-implementación-cómo-escribir-los-tests)

---

## Análisis del Proyecto Actual - CasaBlancaR (TaskFlow)

### Stack Tecnológico Detectado
- **React 19** + TypeScript
- **Zustand** para manejo de estado global (con middleware de persistencia)
- **React Query** (@tanstack/react-query) para estado del servidor
- **React Router DOM v7** para navegación
- **Tailwind CSS 4** para estilos
- **Vitest** + React Testing Library para pruebas
- **Socket.io-client** para comunicación en tiempo real
- **Axios** para peticiones HTTP
- **Zod** para validación de esquemas
- **IndexedDB (idb)** para almacenamiento offline

### Estado Actual de la Autenticación

✅ **Ya implementado:**
1. **Store de autenticación** (`/src/stores/useAuthStore.ts`)
   - Almacena usuario y estado de autenticación
   - Usa `persist` middleware para guardar en localStorage
   - Métodos: `login()`, `logout()`, `updateUser()`

2. **Tipos de usuario** (`/src/types/user.types.ts`)
   - `User`: datos básicos del usuario
   - `AuthUser`: extiende User con tokens (token + refreshToken)
   - `UserPresence`: para colaboración en tiempo real

3. **Protección de rutas** (`/src/routes/protected.tsx`)
   - Componente `ProtectedRoute` funcional
   - Redirección a `/login` si no autenticado
   - Control de roles (RBAC)

4. **Formulario de login básico** (`/src/features/auth/auth.tsx`)
   - UI del formulario con email/password
   - Manejo de estado local del formulario
   - InputField reutilizable

5. **Configuración de rutas**
   - Router configurado con rutas públicas y protegidas
   - Lazy loading de componentes
   - Redirección por defecto a `/login`

❌ **Lo que falta implementar:**
1. **Lógica de autenticación real** - El formulario no está conectado al store
2. **Validación de formularios** - No hay validación con Zod
3. **Servicio de API** - No existe el servicio para hacer login/registro
4. **Manejo de errores** - No hay feedback visual de errores
5. **Gestión de tokens** - No hay refresh token automático
6. **Tests** - No hay tests para autenticación (TDD pendiente)
7. **Persistencia de sesión** - No hay verificación de token al cargar la app
8. **Logout completo** - Falta limpiar todos los stores

---

## Paso 1: Fundamentos de Autenticación

### 1.1 ¿Qué es la Autenticación y por qué la necesitamos?

**Analogía del edificio de oficinas:**

Imagina que tu aplicación React es un edificio de oficinas moderno. La autenticación es como el sistema de seguridad del edificio:

- **Identificación (Quién eres)**: Cuando llegas al edificio, muestras tu credencial al guardia. Esto es el **login** - le dices al sistema quién eres.
- **Verificación (Probar que eres tú)**: El guardia compara tu foto con tu cara. Esto es la **validación de contraseña** - demuestras que realmente eres quien dices ser.
- **Pase de acceso (Token)**: Una vez verificado, recibes una tarjeta de acceso temporal. Esto es el **token JWT** - un pase que llevas contigo mientras estés en el edificio.
- **Acceso a áreas (Autorización)**: Tu tarjeta abre ciertas puertas pero no todas. Esto es **RBAC (Role-Based Access Control)** - permisos basados en tu rol.

**¿Por qué no simplemente recordar que iniciaste sesión?**

Porque las aplicaciones web son **stateless** (sin estado por naturaleza). Cada vez que haces una petición al servidor, es como si fueras un extraño - el servidor no te recuerda. Por eso necesitamos tokens: son como tu tarjeta de identificación que muestras en cada petición.

---

### 1.2 Flujo completo de autenticación: La historia de un usuario

Vamos a seguir el viaje de María, una usuaria de tu app:

**Escena 1: Primera visita (Usuario no autenticado)**
```
María abre la app → React carga → Zustand verifica: "¿hay usuario guardado?"
→ No hay nadie → Redirige a /login
```

**Escena 2: Haciendo login**
```
María escribe email/password → Presiona "Iniciar sesión"
→ Frontend valida el formato (Zod)
→ Envía datos al servidor (Axios)
→ Servidor verifica en base de datos
→ Si es correcto: devuelve { user, token, refreshToken }
→ Frontend guarda en Zustand → localStorage lo persiste
→ Redirige a /dashboard
```

**Escena 3: Navegando la app (Sesión activa)**
```
María va a /tareas → ProtectedRoute pregunta: "¿estás autenticada?"
→ Zustand responde: "Sí, aquí está su token"
→ Permite el acceso → Componente carga
```

**Escena 4: Haciendo peticiones protegidas**
```
María crea una tarea → Frontend envía POST con el token en headers
→ Servidor verifica el token → Si es válido: procesa la petición
→ Si expiró: devuelve 401 → Frontend usa refreshToken para renovar
→ Si refreshToken también expiró: logout automático
```

**Escena 5: Cerrando sesión**
```
María presiona "Cerrar sesión" → Frontend llama logout()
→ Zustand limpia el usuario → localStorage se borra
→ React Query invalida cachés → Redirige a /login
```

---

### 1.3 Componentes de un sistema de autenticación

Tu sistema de autenticación tiene 5 capas, como las capas de una cebolla:

#### Capa 1: UI (Interfaz de Usuario)
- **Qué es**: Los formularios de login/registro que ve el usuario
- **Responsabilidades**:
  - Capturar datos (email/password)
  - Mostrar errores visuales
  - Feedback de carga (spinners)
- **En tu proyecto**: `/src/features/auth/auth.tsx`

#### Capa 2: Validación (Client-side)
- **Qué es**: Verificar que los datos tengan el formato correcto ANTES de enviarlos
- **Por qué**: Mejor UX (feedback inmediato) y menos peticiones inútiles al servidor
- **Herramienta**: Zod (ya está en tu proyecto)
- **Ejemplo**: "El email debe tener @", "Password mínimo 8 caracteres"

#### Capa 3: Estado Global (Zustand Store)
- **Qué es**: El "cerebro" que recuerda si estás autenticado
- **Responsabilidades**:
  - Guardar usuario actual
  - Mantener tokens
  - Proveer métodos: login(), logout(), updateUser()
- **En tu proyecto**: `/src/stores/useAuthStore.ts` (ya existe!)

#### Capa 4: Comunicación con API (Axios + React Query)
- **Qué es**: El "mensajero" que habla con el backend
- **Axios**: Para hacer las peticiones HTTP
- **React Query**: Para cachear respuestas y manejar estados (loading, error, success)
- **Falta implementar**: `/src/services/auth.service.ts`

#### Capa 5: Interceptores y Middleware
- **Qué es**: "Guardias automáticos" que agregan el token a TODAS las peticiones
- **Por qué**: No tienes que acordarte de poner el token manualmente en cada petición
- **Funcionalidad extra**: Auto-renovación de tokens expirados
- **Falta implementar**: Configuración de Axios con interceptores

---

### 1.4 Decisiones arquitectónicas: Ventajas y Desventajas

#### ✅ Decisión 1: Zustand para Estado de Autenticación

**Ventajas:**
- **Simplicidad**: Menos boilerplate que Redux (no actions, reducers, dispatchers complicados)
- **TypeScript first**: Excelente inferencia de tipos
- **Tamaño**: Solo 1.2kb vs 8kb de Redux
- **Middleware de persistencia**: Ya incluido (persist middleware)
- **No necesita Provider**: Funciona como un hook normal

**Desventajas:**
- **DevTools menos maduras**: No tan potentes como Redux DevTools
- **Menos comunidad**: Menos recursos/tutoriales que Redux
- **No es estándar**: En equipos grandes puede preferirse Redux por familiaridad

**¿Cuándo reconsiderar?**
- Si tu app crece a +100 componentes con estado complejo → Redux Toolkit
- Si necesitas time-travel debugging avanzado → Redux

#### ✅ Decisión 2: localStorage para Persistencia

**Ventajas:**
- **Persiste sesiones**: El usuario no se desloguea al refrescar
- **Simple**: API nativa del browser, sin librerías extra
- **Sincrónico**: Lectura/escritura instantánea

**Desventajas:**
- **Seguridad limitada**: Vulnerable a XSS (JavaScript malicioso puede leerlo)
- **Capacidad**: Máximo 5-10MB
- **No accesible desde service workers**: Limita funcionalidad offline avanzada

**Alternativas y cuándo usarlas:**
- **sessionStorage**: Si quieres que la sesión se cierre al cerrar la pestaña
- **IndexedDB**: Para datos sensibles encriptados (ya tienes `idb` instalado!)
- **httpOnly cookies**: La opción MÁS segura (pero requiere más setup en backend)

**Recomendación para tu proyecto:**
Guarda solo tokens en localStorage. Datos sensibles del usuario (si los hay) en IndexedDB encriptados.

#### ✅ Decisión 3: JWT Tokens (Access + Refresh)

**Cómo funcionan:**
```
Access Token:
- Vida corta (15 minutos)
- Se envía en cada petición
- Si lo roban, expira rápido

Refresh Token:
- Vida larga (7 días)
- Solo se usa para pedir un nuevo Access Token
- Guardado más seguro
```

**Ventajas:**
- **Stateless**: El servidor no necesita guardar sesiones en memoria
- **Escalable**: Funciona en múltiples servidores sin problemas
- **Mobile-friendly**: Mismo sistema para web y app nativa

**Desventajas:**
- **No se pueden revocar fácilmente**: Si robas un token válido, funciona hasta que expire
- **Tamaño**: JWT son más grandes que session IDs (importante en mobile con datos limitados)
- **Complejidad**: Necesitas lógica de refresh automático

**Alternativa y cuándo usarla:**
- **Session cookies**: Si tu app es solo web y el backend está en el mismo dominio (más simple, más seguro)

---

### 1.5 Arquitectura TDD para Autenticación

Tu proyecto sigue **TDD (Test-Driven Development)**. Esto significa que para cada funcionalidad:

**Fase RED → GREEN → REFACTOR**

```
🔴 RED: Escribir el test (falla porque no hay código)
   ↓
🟢 GREEN: Escribir el mínimo código para pasar el test
   ↓
🔵 REFACTOR: Mejorar el código manteniendo tests verdes
```

**¿Por qué TDD para autenticación específicamente?**

La autenticación es **crítica para seguridad**. Un bug aquí puede:
- Permitir acceso no autorizado
- Exponer datos sensibles
- Romper toda la app

Los tests te dan **confianza** de que:
- Los tokens se manejan correctamente
- Las rutas están protegidas
- Los errores se manejan bien
- No rompes nada al hacer cambios

---

### 1.6 Estructura de carpetas que implementaremos

```
src/
├── features/
│   └── auth/
│       ├── auth.tsx              # ✅ Ya existe (UI del login)
│       ├── auth.test.tsx         # ❌ Crearemos (tests del componente)
│       ├── hooks/
│       │   ├── useLogin.ts       # ❌ Crearemos (lógica de login)
│       │   └── useLogin.test.ts  # ❌ Crearemos (tests del hook)
│       └── schemas/
│           └── auth.schema.ts    # ❌ Crearemos (validación Zod)
├── services/
│   ├── api/
│   │   ├── axios.config.ts       # ❌ Crearemos (config + interceptores)
│   │   └── axios.config.test.ts  # ❌ Crearemos (tests)
│   └── auth/
│       ├── auth.service.ts       # ❌ Crearemos (llamadas API)
│       └── auth.service.test.ts  # ❌ Crearemos (tests)
├── stores/
│   ├── useAuthStore.ts           # ✅ Ya existe (mejoraremos)
│   └── useAuthStore.test.ts      # ❌ Crearemos (tests)
└── routes/
    ├── protected.tsx             # ✅ Ya existe (mejoraremos)
    └── protected.test.tsx        # ❌ Crearemos (tests)
```

---

## Paso 2: Tests para AuthStore (TDD)

### Conceptos de Testing que Aprenderás

1. **Estructura de tests**: `describe`, `it`, `expect`, `beforeEach`
2. **Mocking**: Crear objetos falsos para simular dependencias
3. **Test isolation**: Cada test debe ser independiente
4. **AAA Pattern**: Arrange (preparar), Act (actuar), Assert (verificar)

### Conceptos de Zustand que Aprenderás

1. **getState()**: Obtener estado sin usar hooks
2. **setState()**: Modificar estado directamente
3. **Acciones**: Funciones que modifican el estado
4. **Persist middleware**: Guardar/recuperar desde localStorage

### Los 8 Tests que Implementaremos

1. ✅ Estado inicial limpio
2. ✅ Login exitoso
3. ✅ Logout completo
4. ✅ Actualización parcial de usuario
5. ✅ Prevenir actualización sin usuario
6. ✅ Persistencia en localStorage
7. ✅ Limpieza de localStorage
8. ✅ Hidratación desde localStorage

---

## Paso 2 (Implementación): Cómo escribir los tests

### Paso 2.1: Crear el archivo de tests

**Ubicación:** `/src/stores/useAuthStore.test.ts`

**Convención de nombres:**
- Si el archivo se llama `miArchivo.ts`
- Su test se llama `miArchivo.test.ts`

---

### Paso 2.2: Entender la estructura del archivo

```typescript
// 1. IMPORTS (traemos las herramientas que necesitamos)
import { describe, it, expect } from 'vitest'
import { useAuthStore } from './useAuthStore'

// 2. MOCKS (objetos falsos para simular dependencias)
const mockLocalStorage = { /* ... */ }

// 3. SUITE DE TESTS (agrupamos todos los tests relacionados)
describe('useAuthStore', () => {

  // 4. SETUP (preparación antes de cada test)
  beforeEach(() => { /* limpiar todo */ })

  // 5. TESTS INDIVIDUALES
  it('debe hacer X', () => { /* verificar X */ })
  it('debe hacer Y', () => { /* verificar Y */ })
})
```

**Analogía de la receta de cocina:**
1. Ingredientes (imports)
2. Preparar la cocina (mocks)
3. El menú del día (describe)
4. Lavar los trastes entre platos (beforeEach)
5. Cada platillo (tests individuales)

---

### Paso 2.3: Crear el mock de localStorage

**¿Qué es un mock?**
Un mock es un **objeto falso** que imita el comportamiento de algo real.

**¿Por qué lo necesitamos?**
- Los tests corren en Node.js (no en el navegador)
- Node.js **NO tiene** localStorage
- Necesitamos **simular** que existe

```typescript
const mockLocalStorage = (() => {
  // Almacén interno (como la "memoria" del localStorage)
  let store: Record<string, string> = {}

  return {
    // Obtener un valor
    getItem: (key: string) => store[key] || null,

    // Guardar un valor
    setItem: (key: string, value: string) => {
      store[key] = value
    },

    // Eliminar un valor
    removeItem: (key: string) => {
      delete store[key]
    },

    // Limpiar TODO
    clear: () => {
      store = {}
    },
  }
})()

// Reemplazamos el localStorage global con nuestro mock
vi.stubGlobal('localStorage', mockLocalStorage)
```

**¿Por qué `store` es un objeto?**
Porque localStorage funciona con pares clave-valor:
- `localStorage.setItem('nombre', 'Ana')` → `{ nombre: 'Ana' }`
- `localStorage.getItem('nombre')` → busca por clave

---

### Paso 2.4: Patrón AAA de un test

Cada test sigue el patrón **AAA**:

```typescript
it('descripción de lo que debe hacer', () => {
  // ARRANGE (Preparar)
  // - Configurar el escenario
  const datosDePrueba = { ... }

  // ACT (Actuar)
  // - Ejecutar la acción que queremos probar
  funcionQueEstamosTesteando(datosDePrueba)

  // ASSERT (Verificar)
  // - Comprobar que el resultado es el esperado
  expect(resultado).toBe(esperado)
})
```

**Analogía:**
- **ARRANGE**: Sacas los ingredientes de la nevera
- **ACT**: Cocinas el platillo
- **ASSERT**: Pruebas si sabe bien

---

### Paso 2.5: Primer test - Estado inicial

```typescript
it('debe inicializar con usuario null y no autenticado', () => {
  // ACT - Obtenemos el estado actual
  const state = useAuthStore.getState()

  // ASSERT - Verificamos
  expect(state.user).toBeNull()
  expect(state.isAuthenticated).toBe(false)
})
```

**Desglose:**
- `useAuthStore.getState()` = preguntarle al store: "¿Qué tienes ahora?"
- `expect(state.user).toBeNull()` = "Espero que user sea null"
- `.toBeNull()` = específico para null
- `.toBe(false)` = comparación estricta (===)

---

### Paso 2.6: Segundo test - Login

```typescript
it('debe autenticar usuario al hacer login', () => {
  // ARRANGE
  const mockUser: AuthUser = {
    id: 1,
    email: 'ana@casablanca.com',
    name: 'Ana García',
    role: 'client',
  }

  // ACT
  useAuthStore.getState().login(mockUser)

  // ASSERT
  const state = useAuthStore.getState()
  expect(state.user).toEqual(mockUser)
  expect(state.isAuthenticated).toBe(true)
})
```

**¿Por qué `toEqual` y no `toBe`?**
- `.toBe()` = compara por referencia (para primitivos)
- `.toEqual()` = compara por contenido (para objetos)

```typescript
// Ejemplo:
const obj1 = { name: 'Ana' }
const obj2 = { name: 'Ana' }

obj1 === obj2 // false (diferentes referencias)
expect(obj1).toEqual(obj2) // true (mismo contenido)
```

---

### Paso 2.7: beforeEach - Limpieza entre tests

```typescript
beforeEach(() => {
  // Limpiamos localStorage
  mockLocalStorage.clear()

  // Reseteamos el store
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
  })
})
```

**¿Por qué es necesario?**

Sin `beforeEach`:
```typescript
// Test 1: Login
it('login', () => {
  login({ name: 'Ana' })
  expect(user.name).toBe('Ana') // ✅
})

// Test 2: Estado inicial
it('estado inicial', () => {
  expect(user).toBeNull() // ❌ FALLA (Ana sigue ahí)
})
```

Con `beforeEach`:
```typescript
// Test 1
beforeEach() // Limpia
it('login', () => { /* ... */ }) // ✅

// Test 2
beforeEach() // Limpia (incluyendo a Ana)
it('estado inicial', () => { /* ... */ }) // ✅
```

**Cada test tiene un lienzo en blanco.**

---

### Paso 2.8: Test de Logout

```typescript
it('debe limpiar el estado al hacer logout', () => {
  // ARRANGE - Preparar un usuario logueado
  const mockUser: AuthUser = {
    id: 1,
    email: 'ana@casablanca.com',
    name: 'Ana García',
    role: 'client',
  }

  useAuthStore.setState({
    user: mockUser,
    isAuthenticated: true,
  })

  // ACT - Hacer logout
  useAuthStore.getState().logout()

  // ASSERT - Verificar limpieza
  const state = useAuthStore.getState()
  expect(state.user).toBeNull()
  expect(state.isAuthenticated).toBe(false)
})
```

**Concepto: `setState()` vs `login()`**

- `login(user)` = método de tu store con lógica compleja
- `setState({ ... })` = método de Zustand para establecer directamente

En tests usamos `setState()` para **preparar escenarios** sin depender de otros métodos.

**¿Por qué no usar `login()` en el ARRANGE?**
Porque estamos testeando `logout()`, no `login()`. Si usáramos `login()` y fallara, no sabríamos si el problema es el login o el logout. Usando `setState()` aislamos el test.

---

### Paso 2.9: Código completo del archivo de tests

Ver archivo completo en: `/src/stores/useAuthStore.test.ts`

---

## Conceptos Clave Aprendidos

### 1. Testing
- ✅ Estructura: `describe`, `it`, `expect`
- ✅ Patrón AAA: Arrange, Act, Assert
- ✅ Mocks: Objetos falsos para dependencias
- ✅ `beforeEach`: Limpieza entre tests
- ✅ `toBe()` vs `toEqual()`: Referencia vs contenido

### 2. Zustand
- ✅ `getState()`: Leer estado sin hooks
- ✅ `setState()`: Establecer estado directamente
- ✅ Acciones: `login()`, `logout()`, `updateUser()`
- ✅ Persist middleware: Auto-guardar en localStorage

### 3. TypeScript
- ✅ `Record<string, string>`: Objeto con claves y valores string
- ✅ `Partial<T>`: Hace todas las propiedades opcionales
- ✅ Type assertions: `!` indica que no es null
- ✅ Optional chaining: `?.` acceso seguro

---

## Preguntas de Comprensión

### Nivel Básico
1. ¿Qué hace `beforeEach()` y por qué es importante?
2. ¿Cuál es la diferencia entre `toEqual()` y `toBe()`?
3. ¿Por qué necesitamos un mock de localStorage?

### Nivel Intermedio
4. ¿Qué pasaría si NO limpiáramos el estado entre tests?
5. ¿Por qué el test de logout establece primero un usuario autenticado?
6. ¿Qué significa "inmutabilidad parcial" en `updateUser()`?

### Nivel Avanzado
7. ¿Por qué el test de hidratación requiere un enfoque diferente?
8. ¿Qué otros casos edge podrías testear para `updateUser()`?
9. ¿Cómo testearías un error de red al hacer login con una API real?

---

## Próximos Pasos

### Fase RED 🔴 (Actual)
1. ✅ Crear archivo `/src/stores/useAuthStore.test.ts`
2. ✅ Copiar código de tests
3. ✅ Ejecutar: `npm run test`
4. ✅ Ver tests FALLAR (esto es correcto!)

### Fase GREEN 🟢 (Siguiente)
5. Implementar/mejorar código en `useAuthStore.ts`
6. Hacer que los tests pasen uno por uno
7. Verificar cobertura de tests

### Fase REFACTOR 🔵
8. Optimizar código manteniendo tests verdes
9. Agregar casos edge adicionales
10. Documentar decisiones

---

## Referencias

- [Vitest Documentation](https://vitest.dev/)
- [Zustand Testing Guide](https://github.com/pmndrs/zustand#testing)
- [React Testing Library](https://testing-library.com/react)
- [TDD Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Última actualización:** 2025-10-04
**Autor:** Tutorial interactivo con Claude Code
