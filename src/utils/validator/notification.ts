import { z } from 'zod'

export const getNotificationSchema = z.string().uuid({
  message: 'Data Orang Tua Tidak Ditemukan'
})

export const createNotificationSchema = z.object({
  childId: z.string().uuid({
    message: 'Data Anak Tidak Ditemukan'
  })
})