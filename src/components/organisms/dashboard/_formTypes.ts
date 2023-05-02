import * as zod from "zod";

export const forgotPasswordFormSchema = zod.object({
  email: zod.string().min(1, { message: "Please enter your phone number" }),
  phoneNumber: zod
    .string()
    .min(9, { message: "Please enter your phone number" }),
});

export type ForgotPasswordFormSchemaFormValuesType = zod.infer<
  typeof forgotPasswordFormSchema
>;

export const forgotPasswordInitialValues: ForgotPasswordFormSchemaFormValuesType =
  {
    email: "",
    phoneNumber: "",
  };

export const changePasswordFormSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    password: zod.string().min(4),
    confirmPassword: zod.string().min(4),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export type ChangePasswordFormSchemaFormValuesType = zod.infer<
  typeof changePasswordFormSchema
>;

export const changePasswordInitialValues: ChangePasswordFormSchemaFormValuesType =
  {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  };
