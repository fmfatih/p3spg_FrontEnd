import * as zod from "zod";

export const addBankFormSchema = zod
  .object({
    mail: zod.string(),
    fullName: zod.string(),
    phoneNumber: zod.preprocess(
      (val) =>
        String(val)
          .slice(1)
          .replaceAll("_", "")
          .replaceAll("(", "")
          .replaceAll(")", "")
          .replaceAll(" ", "")
          .trim(),
      zod.string().min(10).optional().or(zod.literal(""))
    ),
    officePhone: zod.preprocess(
      (val) =>
        String(val)
          .slice(1)
          .replaceAll("_", "")
          .replaceAll("(", "")
          .replaceAll(")", "")
          .replaceAll(" ", "")
          .trim(),
      zod.string()
    ),
    description: zod.string().optional(),
    webAddress: zod.string().optional(),
    bankCode: zod.string(),
    parameters: zod.any().array(),
    merchantID: zod.any(),
  })
  .refine(
    (data) => {
      if (!data.merchantID) {
        return !!data.fullName;
      } else {
        return true;
      }
    },
    {
      message: "Passwords don't match",
      path: ["fullName"], // path of error
    }
  )
  .refine(
    (data) => {
      if (!data.merchantID) {
        return !!data.phoneNumber;
      } else {
        return true;
      }
    },
    {
      message: "Passwords don't match",
      path: ["phoneNumber"], // path of error
    }
  )
  .refine(
    (data) => {
      if (!data.merchantID) {
        return !!data.mail;
      } else {
        return true;
      }
    },
    {
      message: "Passwords don't match",
      path: ["mail"], // path of error
    }
  )
  .refine(
    (data) => {
      if (!data.merchantID) {
        return !!data.bankCode;
      } else {
        return !!data.bankCode;
      }
    },
    {
      message: "Passwords don't match",
      path: ["bankCode"], // path of error
    }
  );

export type BankAddFormValuesType = zod.infer<typeof addBankFormSchema>;

export const initialState: BankAddFormValuesType = {
  mail: "",
  fullName: "",
  phoneNumber: "",
  bankCode: "",
  description: "",
  parameters: [],
  merchantID: null,
};

export const addBankRedirectFormSchema = zod.object({
  onusRouting: zod.boolean(),
  merchantId: zod.number().min(1, { message: "Please enter your name" }),
  issuerCardBankCodes: zod.any(),
  issuerCardType: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  merchantVposBankCode: zod.any(),
  transactionSubType: zod.string(),
});

export type BankAddRedirectFormValuesType = zod.infer<
  typeof addBankRedirectFormSchema
>;

export const initialBankAddRedirectState: BankAddRedirectFormValuesType = {
  onusRouting: true,
  merchantId: 0,
  issuerCardBankCodes: [],
  issuerCardType: "",
  merchantVposBankCode: null,
  transactionSubType: "",
};
