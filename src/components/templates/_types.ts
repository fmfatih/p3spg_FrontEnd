import * as zod from 'zod';

export const signInFormSchema = zod.object({
  email: zod
    .string()
    .email('Invalid email address')
    .min(1, {message: 'Please enter your email address'}),
  password: zod.string().min(1, {message: 'Please enter your password'}),
});

export type SignInFormValuesType = zod.infer<typeof signInFormSchema>;
