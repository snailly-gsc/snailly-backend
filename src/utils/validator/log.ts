import { z } from 'zod';

export const getLogSchema = z.object({
  childId: z.union([z.string().uuid(), z.enum(['ALL'])]),
  period: z.enum(['daily', 'monthly', '']).optional(),
  month: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']).optional(),
  year: z.string().optional(),
  date: z.string().optional()
})
export const createLogSchema = z.object({
  childId: z.string().uuid({
    message: 'Data Anak Tidak Ditemukan'
  }),
  web_title: z.string(),
  url: z.string().url({
    message: 'Url Tidak Valid'
  }),
  web_description: z.string(),
})