import {WritableSignal} from '@angular/core';
import z from 'zod';

export const albumSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Le titre est requis'),
  authorId: z.string().min(1, "L'ID de l'auteur est requis"),
});

export const partnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  reason: z.string().min(10, 'Veuillez détailler vos motifs'),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  status: z.string().optional(),
  address: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

export const createTopicSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  authorId: z.number().optional(),
  images: z.array(z.string()).optional(),
});

export const photoSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  categorie: z.string().optional(),
  description: z.string().optional(),
});

export const runZodValidation = <T>(
  value: any,
  schema: z.ZodType<T>,
  zodErrors: WritableSignal<Record<string, string | null>>
) => {
  const result = schema.safeParse(value);
  if (result.success) {
    zodErrors.set({});
  } else {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0] as string;
      fieldErrors[path] = issue.message;
    }
    zodErrors.set(fieldErrors);
  }
  return result;
};
