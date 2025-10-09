import { z } from 'zod'

/**
 * Esquema de validación para el formulario de login
 *
 * Reglas de validación:
 * - Email: requerido y formato válido
 * - Password: requerido, mínimo 8 caracteres
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('El email no es válido'),

  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

/**
 * Tipo inferido del esquema de login
 * TypeScript automáticamente infiere los tipos desde el schema
 */
export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Esquema de validación para el formulario de registro
 *
 * Reglas de validación:
 * - Email: requerido y formato válido
 * - Name: requerido, mínimo 2 caracteres
 * - Password: requerido, mínimo 8 caracteres, debe contener mayúscula, minúscula y número
 * - ConfirmPassword: debe coincidir con password
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El email no es válido'),

  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),

  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),

  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'], // Error se muestra en el campo confirmPassword
})

/**
 * Tipo inferido del esquema de signup
 */
export type SignupFormData = z.infer<typeof signupSchema>
