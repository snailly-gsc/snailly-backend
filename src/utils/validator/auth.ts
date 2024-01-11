import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3, { message: 'Minimal Nama 3 Karakter' }).regex(/^[a-zA-Z\s]*$/, { message: 'Nama Harus Berupa Huruf' }),
  password: z.string().min(8, { message: 'Minimal Password 8 Karakter' }),
  confirmPassword: z.string().min(8, { message: 'Minimal Password 8 Karakter' }),
})
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Password Dan Confirm Password Tidak Sama',
      })
    }
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Minimal Password 8 Karakter' }),
})