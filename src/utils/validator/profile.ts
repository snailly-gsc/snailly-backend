import {z} from 'zod'

export const updateProfileSchema = z.object({
  id: z.string().uuid({
    message: 'Akun Tidak Ditemukan'
  }),
  name: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  oldPassword: z.string().min(6).max(255).optional(),
  newPassword: z.string().min(6).max(255).optional(),
  confirmPassword: z.string().min(6).max(255).optional(),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      path: ['confirmPassword'],
      code: z.ZodIssueCode.custom,
      message: 'Password Dan Confirm Password Tidak Sama',
    })
  }
});
