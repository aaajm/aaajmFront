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

export const signinSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const createTopicSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(10, 'La description doit être plus longue'),
});

