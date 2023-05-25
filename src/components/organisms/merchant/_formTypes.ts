import * as zod from "zod";
import { default as dayjs } from "dayjs";

export const firstStepFormSchema = zod.object({
  parentMerchantId: zod.any().optional(),
  merchantStatusType: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  merchantType: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  posList: zod.any(),
  merchantName: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  tradeName: zod.string().min(1, { message: "Please enter your phone number" }),
  tradeRegistrationNumber: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  commissionProfileCode: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  webSite: zod.string().min(1, { message: "Please enter your phone number" }),
  taxNumber: zod
    .string()
    .length(10, { message: "Must be exactly 10 characters long" }),
  taxOfficeCode: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  citizenshipNumber: zod
    .string()
    .length(11, { message: "Please enter your phone number" })
    .optional()
    .or(zod.literal("")),
  mcc: zod.any(),
  openingDate: zod.any(),
  aggreementDate: zod.any().optional(),
  foundationDate: zod.any(),
  closedDate: zod.any().optional(),
  city: zod.any(),
});

export type FirstStepFormValuesType = zod.infer<typeof firstStepFormSchema>;

export const firstStepInitialValues: FirstStepFormValuesType = {
  citizenshipNumber: "",
  parentMerchantId: "",
  merchantStatusType: "",
  openingDate: dayjs(),
  aggreementDate: dayjs(),
  foundationDate: "",
  city: null,
  merchantName: "",
  tradeName: "",
  tradeRegistrationNumber: "",
  commissionProfileCode: "",
  webSite: "",
  taxNumber: "",
  taxOfficeCode: "",
  mcc: null,
  posList: {},
  merchantType: "",
  closedDate: null,
};

export const secondStepFormSchema = zod.object({
  addressLine1: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  addressLine2: zod.string().optional(),
  cityId: zod.any(),
  districtId: zod.string().or(zod.number()),
  mobilePhoneNumber: zod.preprocess(
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
  zipCode: zod.string().optional(),
  emailAddress1: zod.string(),
  emailAddress2: zod.string().optional(),
  faxNumber: zod.preprocess(
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
  phoneNumber: zod.preprocess(
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
});

export type SecondStepFormValuesType = zod.infer<typeof secondStepFormSchema>;

export const secondStepInitialValues: SecondStepFormValuesType = {
  addressLine1: "",
  addressLine2: "",
  cityId: null,
  districtId: "",
  mobilePhoneNumber: "",
  zipCode: "",
  emailAddress1: "",
  emailAddress2: "",
  faxNumber: "",
  phoneNumber: "",
};

export const thirdStepFormSchema = zod.object({
  currencyCode: zod.string(),
  iban: zod
    .string()
    .regex(
      new RegExp(
        /^([A-Z]{2}[ '+'\\'+'-]?[0-9]{2})(?=(?:[ '+'\\'+'-]?[A-Z0-9]){9,30}$)((?:[ '+'\\'+'-]?[A-Z0-9]{3,5}){2,7})([ '+'\\'+'-]?[A-Z0-9]{1,3})?$/
      ),
      "Name should contain only alphabets"
    ),
  bankCode: zod.string().min(1, { message: "Please enter your phone number" }),
  accountOwner: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
});

export type ThirdStepFormValuesType = zod.infer<typeof thirdStepFormSchema>;

export const thirdStepInitialValues: ThirdStepFormValuesType = {
  currencyCode: "",
  bankCode: "",
  iban: "",
  accountOwner: "",
};


export const fourthStepFormSchema = zod.object({
  try: zod.boolean(),
  usd: zod.boolean(),
  eur: zod.boolean(),
});

export type FourthStepFormValuesType = zod.infer<typeof fourthStepFormSchema>;

export const fourthStepInitialValues: FourthStepFormValuesType = {
  try: true,
  usd: false,
  eur: false,
};



export const partnerStepFormSchema = zod.object({
  partnerOneFullName: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  partnerOneCitizenNumber: zod
    .string()
    .min(11, { message: "Please enter your phone number" }),
  partnerOneMobilePhone: zod.preprocess(
    (val) =>
      String(val)
        .slice(1)
        .replaceAll("_", "")
        .replaceAll("(", "")
        .replaceAll(")", "")
        .replaceAll(" ", "")
        .trim(),
    zod.string().optional()
  ),
  partnerTwoFullName: zod.preprocess(
    (val) => String(val).trim(),
    zod.string().optional()
  ),
  partnerTwoCitizenNumber: zod.preprocess(
    (val) => String(val).trim(),
    zod.string().optional()
  ),
  partnerTwoMobilePhone: zod.preprocess(
    (val) =>
      String(val)
        .slice(1)
        .replaceAll("_", "")
        .replaceAll("(", "")
        .replaceAll(")", "")
        .replaceAll(" ", "")
        .trim(),
    zod.string().optional()
  ),
});

export type PartnerStepFormValuesType = zod.infer<typeof partnerStepFormSchema>;

export const partnerStepInitialValues: PartnerStepFormValuesType = {
  partnerOneFullName: "",
  partnerOneCitizenNumber: "",
  partnerOneMobilePhone: "",
  partnerTwoFullName: "",
  partnerTwoCitizenNumber: "",
  partnerTwoMobilePhone: "",
};

export const merchantAuthFormSchema = zod.object({
  merchantId: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  bankCodes: zod.any(),
});

export type MerchantAuthFormValuesType = zod.infer<
  typeof merchantAuthFormSchema
>;

export const merchantAuthInitialValues: MerchantAuthFormValuesType = {
  merchantId: "",
  bankCodes: {},
};
