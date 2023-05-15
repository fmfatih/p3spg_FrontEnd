import * as zod from "zod";

export const addUserFormSchema = zod.object({
  email: zod
    .string()
    .email("Invalid email address")
    .min(1, { message: "Please enter your email address" }),
  fullName: zod.string().min(1, { message: "Please enter your name" }),
  phoneNumber: zod.preprocess(
    (val) =>
      String(val)
        .slice(1)
        .replaceAll("_", "")
        .replaceAll("(", "")
        .replaceAll(")", "")
        .replaceAll(" ", "")
        .trim(),
    zod.string().min(10)
  ),
  status: zod.any(),
  merchant: zod.any(),
  userType: zod.string().min(1, { message: "Please enter your user type" }),
  roleIds: zod.any(),
});

export type UserAddFormValuesType = zod.infer<typeof addUserFormSchema>;
