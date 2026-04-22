import {WritableSignal} from '@angular/core';
import z from 'zod';

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
