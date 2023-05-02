import * as zod from "zod";

export const bankAddFormSchema = zod
  .object({
    profileCode: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    merchantId: zod.any(),
    submerchantId: zod.any(),
    onus: zod.boolean(),
    international: zod.boolean(),
    amex: zod.boolean(),
    bankcode: zod.string(),
    installment: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    bankblocked: zod.boolean(),
    bankblockedday: zod.string(),
    bankcommission: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    //bankAdditionalCommission: zod.string(),
    merchantblocked: zod.boolean(),
    merchantblockedday: zod.string(),
    merchantcommission: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    merchantadditionalcommission: zod.string(),
    customercommission: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    customeradditionalcommission: zod.string(),
    minAmount: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    maxAmount: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    cardType: zod.string(),
    txnType: zod.string().min(1, { message: "Please enter your phone number" }),
  })
  .refine(
    (data) => {
      if (!data.onus) {
        return true;
      } else {
        return !!data.bankcode;
      }
    },
    {
      message: "Please enter your phone number",
      path: ["bankcode"],
    }
  );

export type BankAddFormSchemaFormValuesType = zod.infer<
  typeof bankAddFormSchema
>;

export const bankAddInitialValues: BankAddFormSchemaFormValuesType = {
  profileCode: "",
  merchantId: null,
  submerchantId: null,
  onus: false,
  international: false,
  amex: false,
  installment: "",
  bankcode: "",
  bankblocked: false,
  bankblockedday: "",
  bankcommission: "",
  customercommission: "",
  customeradditionalcommission: "",
  //bankAdditionalCommission: "",
  minAmount: "",
  maxAmount: "",
  cardType: "",
  merchantblocked: false,
  merchantblockedday: "",
  merchantcommission: "",
  merchantadditionalcommission: "",
  txnType: "",
};

export const bankAddProfileFormSchema = zod.object({
  name: zod.string().min(1, { message: "Please enter your phone number" }),
  code: zod.string().min(1, { message: "Please enter your phone number" }),
  description: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
});

export type BankAddProfileFormSchemaFormValuesType = zod.infer<
  typeof bankAddProfileFormSchema
>;

export const bankAddProfileInitialValues: BankAddProfileFormSchemaFormValuesType =
  {
    name: "",
    code: "",
    description: "",
  };
