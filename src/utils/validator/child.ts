import { z } from 'zod';

export const createChildSchema = z.object({
  name: z.string().min(3, { message: 'Minimal Nama 3 Karakter' }).regex(/^[a-zA-Z\s]*$/, { message: 'Nama Harus Berupa Huruf' }),
})

export const getChildSchema = z.object({
  childId: z.string().uuid({
    message: 'Data Anak Tidak Ditemukan'
  }),
})

export const updateChildSchema = z.object({
  childId: z.string().uuid({
    message: 'Data Anak Tidak Ditemukan'
  }),
  name: z.string().min(3, { message: 'Minimal Nama 3 Karakter' }).regex(/^[a-zA-Z\s]*$/, { message: 'Nama Harus Berupa Huruf' }),
})