# Decisiones Arquitectónicas - CasaBlancaR

## Convenciones de Estructura de Proyecto

### 1. Nomenclatura: `auth` vs `authentication`

**Decisión**: Usar `auth` como nombre de directorio

**Fecha**: 2025-10-04

**Contexto**:
- Existía inconsistencia con ambos directorios (`auth/` y `authentication/`)
- El código existente ya usaba la abreviatura "auth" en múltiples lugares

**Análisis**:

**Patrones existentes en el proyecto**:
- Store: `useAuthStore` (no `useAuthenticationStore`)
- Types: `AuthUser` (no `AuthenticationUser`)
- localStorage: `auth-storage`
- Rutas actuales: importan de `@features/auth/auth`

**Estándar de la industria**:
- NextAuth.js, Firebase Auth, Auth0 → todos usan "auth"
- Rutas comunes: `/auth/login`, `/api/auth`
- Convención universal en frameworks React 19

**Ventajas**:
1. ✅ Consistencia con código existente
2. ✅ Estándar de la industria
3. ✅ Imports más limpios: `@features/auth`
4. ✅ Rutas más ergonómicas: `/auth/login`
5. ✅ Más rápido de escribir sin ambigüedad

**Ubicación**: `/src/features/auth/` (scope local)

**Justificación de scope**:
- Login es usado únicamente por la feature de autenticación
- Otras features usan `useAuthStore` (global), no los componentes de auth
- Aplica la Scope Rule: 1 feature = local scope

---

### 2. Estructura de Stores por Carpetas

**Decisión**: Organizar stores en carpetas individuales

**Fecha**: 2025-10-04

**Estructura anterior**:
```
/stores/
├── useAuthStore.ts
├── useWorkspaceStore.ts
└── useTaskStore.ts
```

**Estructura adoptada**:
```
/stores/
├── useAuthStore/
│   ├── useAuthStore.ts
│   ├── useAuthStore.test.ts
│   └── index.ts
├── useWorkspaceStore/
│   ├── useWorkspaceStore.ts
│   ├── useWorkspaceStore.test.ts
│   └── index.ts
└── ...
```

**Beneficios**:
1. ✅ **Colocation de tests**: Tests junto al código que prueban
2. ✅ **Escalabilidad**: Espacio para selectors, utils, types específicos
3. ✅ **Imports limpios**: `import { useAuthStore } from '@/stores/useAuthStore'`
4. ✅ **TDD-friendly**: Facilita workflow RED-GREEN
5. ✅ **Organización**: Todo relacionado al store en un lugar

**Estructura expandida** (cuando sea necesario):
```
/stores/useAuthStore/
├── index.ts              # Re-export público
├── useAuthStore.ts       # Store principal
├── useAuthStore.test.ts  # Tests
├── selectors.ts          # Selectores memoizados (opcional)
└── types.ts              # Types específicos del store (opcional)
```

---

### 3. Contenido de la Feature `auth`

**Decisión**: Estructura completa de la feature de autenticación

**Fecha**: 2025-10-04

**Estructura**:
```
/src/features/auth/
├── Auth.tsx                          # Container principal
├── Auth.test.ts                      # Tests del container
│
├── components/                       # Componentes UI específicos
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── index.ts
│   ├── SignupForm/
│   │   ├── SignupForm.tsx
│   │   ├── SignupForm.test.tsx
│   │   └── index.ts
│   ├── ForgotPasswordForm/
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ForgotPasswordForm.test.tsx
│   │   └── index.ts
│   └── PasswordResetForm/
│       ├── PasswordResetForm.tsx
│       ├── PasswordResetForm.test.tsx
│       └── index.ts
│
├── hooks/                            # Hooks locales a auth
│   ├── useLogin.ts
│   ├── useLogin.test.ts
│   ├── useSignup.ts
│   ├── useSignup.test.ts
│   └── usePasswordReset.ts
│
├── services/                         # Llamadas API específicas
│   ├── authService.ts
│   └── authService.test.ts
│
├── utils/                            # Utilidades locales
│   ├── validation.ts                 # Validaciones email/password
│   ├── validation.test.ts
│   ├── tokenHelpers.ts               # Manejo de tokens JWT
│   └── tokenHelpers.test.ts
│
├── types/                            # Types específicos de auth
│   └── auth.types.ts                 # LoginFormData, SignupData, etc.
│
└── index.ts                          # Re-exports públicos
```

**Responsabilidades por carpeta**:

#### `components/`
- Formularios de autenticación (login, signup, reset)
- Componentes visuales exclusivos de auth
- **NO** componentes reutilizables globales

#### `hooks/`
- `useLogin()` - Lógica de login
- `useSignup()` - Lógica de registro
- `usePasswordReset()` - Recuperación de contraseña
- **NO** `useAuth()` (ese va en stores o global)

#### `services/`
- API calls específicas de autenticación
- `authService.login()`
- `authService.signup()`
- `authService.refreshToken()`

#### `utils/`
- Validaciones de email/password
- Helpers para tokens JWT
- Formateo de errores de auth
- **Solo** funciones usadas dentro de auth

#### `types/`
- Interfaces de formularios locales
- Types de respuestas API específicas
- **Solo** si NO son compartidos globalmente

**Regla de Scope**:
```
Si 2+ features lo usan → Global (/src/global/ o /src/types/)
Si solo auth lo usa → Local (/src/features/auth/)
```

**❌ Qué NO va aquí**:
- `useAuthStore` → `/src/stores/useAuthStore/`
- `AuthUser` type → `/src/types/user.types.ts`
- Guards/HOCs → `/src/global/components/` o `/src/guards/`
- Utilidades compartidas → `/src/utils/`

---

## Principios Generales

### Scope Rule
- **Local scope** (1 feature) → dentro de `/features/[feature]/`
- **Global scope** (2+ features) → `/src/global/` o `/src/[tipo]/`

### Colocation
- Tests siempre junto al archivo que prueban
- Types específicos junto al código que los usa
- Utils locales dentro de la feature

### Exports
- Cada carpeta tiene su `index.ts` para re-exports limpios
- Facilita refactoring y mantiene imports estables

---

**Última actualización**: 2025-10-04
