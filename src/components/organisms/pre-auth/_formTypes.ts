import * as zod from "zod";

export const addPreAuthFormSchema = zod.object({
  merchantId: zod.string(),
  cardHolderName: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  cardNumber: zod
    .preprocess((val) => String(val).replaceAll('_', '').trim(), zod.string().min(1, { message: "Please enter your phone number" })),
  lastUsingDate: zod.preprocess((val) => String(val).replaceAll('_', '').replaceAll('/', '').trim(), zod.string().min(1, { message: "Please enter your phone number" })),
  cvv: zod.string().length(3, { message: "Please enter your phone number" }),
  totalAmount: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  installmentCount: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  currency: zod.string().min(1, { message: "Please enter your phone number" }),
  orderId: zod.string().min(1, { message: "Please enter your phone number" }),
  use3D: zod.string().min(1, { message: "Please enter your phone number" }),
});

export type PreAuthAddFormValuesType = zod.infer<typeof addPreAuthFormSchema>;

export const initialPreAuthState: PreAuthAddFormValuesType = {
  merchantId: "",
  cardHolderName: "",
  cardNumber: "",
  lastUsingDate: "",
  cvv: "",
  totalAmount: "",
  installmentCount: "",
  currency: "",
  orderId: "",
  use3D: "",
};
