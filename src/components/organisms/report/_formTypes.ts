import * as zod from "zod";

export const paymentAndTransactionFormSchema = zod.object({
  startDate: zod.any(),
  endDate: zod.any(),
  transactionType: zod.string(),
  orderId: zod.string(),
  cardNumber: zod.string(),
  authCode: zod.string(),
  status: zod.string(),
  bankCode: zod.string(),
  refundAmount: zod.string(),
});

export type PaymentAndTransactionValuesType = zod.infer<
  typeof paymentAndTransactionFormSchema
>;

export const paymentAndTransactionInitialValues: PaymentAndTransactionValuesType =
  {
    startDate: null,
    endDate: null,
    transactionType: "",
    orderId: "",
    cardNumber: "",
    authCode: "",
    status: "",
    bankCode: "",
    refundAmount: "",
  };




  export const merchantPaymentFormSchema = zod.object({
    date: zod.unknown(),
    paymentFlag:zod.any().optional(),
    merchantId:zod.any().optional()
  });
  
  export type MerchantPaymentValuesType = zod.infer<
    typeof merchantPaymentFormSchema
  >;
  
  export const merchantPaymentInitialValues: MerchantPaymentValuesType =
    {
      merchantId:0,
 
      // endOfDate: null,
      paymentFlag:null
      // endDate: null,
      // transactionType: "",
      // orderId: "",
      // cardNumber: "",
      // authCode: "",
      // status: "",
      // bankCode: "",
      // refundAmount: "",
    };





    export const bankPaymentFormSchema = zod.object({
      date: zod.any(),
      bankCode:zod.any()
      // endDate: zod.any(),
      // transactionType: zod.string(),
      // orderId: zod.string(),
      // cardNumber: zod.string(),
      // authCode: zod.string(),
      // status: zod.string(),
      // bankCode: zod.string(),
      // refundAmount: zod.string(),
    });
    
    export type BankPaymentValuesType = zod.infer<
      typeof bankPaymentFormSchema
    >;
    
    export const bankPaymentInitialValues: BankPaymentValuesType =
      {
        bankCode:"",
    
      };




export const paymentWithLinkedFormSchema = zod
  .object({
    bankCode: zod.string().min(1),
    orderId: zod.string(),
    merchantId: zod.number(),
    amount: zod.string().min(1, { message: "Please enter your phone number" }),
    installmentCount: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    description: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    currency: zod
      .string()
      .min(1, { message: "Please enter your phone number" }),
    userEmail: zod
      .string()
      .trim()
      .regex(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), "")
      .optional()
      .or(zod.literal("")),
    userPhoneNumber: zod.preprocess(
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
    startDate: zod.any(),
    endDate: zod.any(),
    url: zod.any(),
  })
  .refine((data) => data.userEmail !== data.userPhoneNumber, {
    message: "Passwords don't match",
    path: ["userEmail"], // path of error
  })
  .refine((data) => data.userEmail !== data.userPhoneNumber, {
    message: "Passwords don't match",
    path: ["userPhoneNumber"], // path of error
  });

export type PaymentWithLinkedValuesType = zod.infer<
  typeof paymentWithLinkedFormSchema
>;

export const paymentWithLinkedInitialValues: PaymentWithLinkedValuesType = {
  bankCode: "",
  orderId: "",
  merchantId: 0,
  amount: "",
  installmentCount: "",
  description: "",
  currency: "",
  userEmail: undefined,
  userPhoneNumber: "",
  startDate: null,
  endDate: null,
  url: undefined,
};

export const paymentWithLinkedListFormSchema = zod.object({
  merchantID: zod.number(),
  status: zod.string(),
});

export type PaymentWithLinkedListValuesType = zod.infer<
  typeof paymentWithLinkedListFormSchema
>;

export const paymentWithLinkedListInitialValues: PaymentWithLinkedListValuesType =
  {
    merchantID: 0,
    status: "",
  };
