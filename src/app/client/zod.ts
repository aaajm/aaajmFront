import {z} from 'zod';

export const partnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  reason: z.string().min(10, 'Veuillez détailler vos motifs'),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  status: z.string().optional(),
});
