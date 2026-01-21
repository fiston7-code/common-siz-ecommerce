// lib/validations/checkout.ts
import { z } from 'zod'

export const KINSHASA_COMMUNES = [
  'Bandalungwa',
  'Barumbu',
  'Bumbu',
  'Gombe',
  'Kalamu',
  'Kasa-Vubu',
  'Kimbanseke',
  'Kinshasa',
  'Kintambo',
  'Kisenso',
  'Lemba',
  'Limete',
  'Lingwala',
  'Makala',
  'Maluku',
  'Masina',
  'Matete',
  'Mont-Ngafula',
  'Ndjili',
  'Ngaba',
  'Ngaliema',
  'Ngiri-Ngiri',
  'Nsele',
  'Selembao',
] as const

const phoneRegex = /^\+243[0-9]{9}$/

export const checkoutSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  
  phone: z.string()
    .regex(phoneRegex, 'Le numéro doit être au format +243XXXXXXXXX'),
  
  whatsapp: z.string()
    .regex(phoneRegex, 'Le numéro WhatsApp doit être au format +243XXXXXXXXX')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('Email invalide')
    .optional()
    .or(z.literal('')),
  
  commune: z.enum(KINSHASA_COMMUNES, {
    message: 'Veuillez sélectionner une commune'
  }),
  
  quartier: z.string().min(2, 'Le quartier doit contenir au moins 2 caractères'),
  
  avenue: z.string().min(3, "L'adresse doit contenir au moins 3 caractères"),
  
  reference_point: z.string().min(3, 'votre point de reference doit contenir au moins 3 caractères'),
  
  delivery_instructions: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>




// // lib/validations/checkout.ts
// import { z } from 'zod'

// // Liste des 24 communes de Kinshasa
// export const KINSHASA_COMMUNES = [
//   'Bandalungwa',
//   'Barumbu',
//   'Bumbu',
//   'Gombe',
//   'Kalamu',
//   'Kasa-Vubu',
//   'Kimbanseke',
//   'Kinshasa',
//   'Kintambo',
//   'Kisenso',
//   'Lemba',
//   'Limete',
//   'Lingwala',
//   'Makala',
//   'Maluku',
//   'Masina',
//   'Matete',
//   'Mont-Ngafula',
//   'Ndjili',
//   'Ngaba',
//   'Ngaliema',
//   'Ngiri-Ngiri',
//   'Nsele',
//   'Selembao',
// ] as const

// export const checkoutSchema = z.object({
//   // Informations client
//   name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
//   phone: z
//     .string()
//     .regex(/^\+243[0-9]{9}$/, 'Format invalide. Utilisez +243XXXXXXXXX'),
//   whatsapp: z
//     .string()
//     .regex(/^\+243[0-9]{9}$/, 'Format invalide. Utilisez +243XXXXXXXXX')
//     .optional()
//     .or(z.literal('')),
//   email: z
//     .string()
//     .email('Email invalide')
//     .optional()
//     .or(z.literal('')),

//   // Adresse de livraison
//   commune: z.enum(KINSHASA_COMMUNES, {
//     required_error: 'Veuillez sélectionner une commune',
//   }),
//   quartier: z.string().min(2, 'Le quartier est requis'),
//   avenue: z.string().min(2, "L'avenue est requise"),
//   reference_point: z.string().optional(),
//   delivery_instructions: z.string().optional(),
// })

// export type CheckoutFormData = z.infer<typeof checkoutSchema>