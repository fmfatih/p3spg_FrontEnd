import * as zod from "zod";

export const menuAddProfileFormSchema = zod.object({
  name: zod.string().min(1, { message: "Please enter your phone number" }),
  parentId: zod.string().optional(),
  order: zod.string().min(1, { message: "Please enter your phone number" }),
  description: zod.any().optional(),
  url: zod.any().optional(),
  media: zod.any().optional(),
  feId: zod.string().optional(),
  feType: zod.string().min(1, { message: "Please enter your phone number" }),
  menuType: zod.string().min(1, { message: "Please enter your phone number" }),
  exactMatch: zod.boolean(),
  menuCode: zod.string().optional(),
});

export type MenuAddProfileFormSchemaFormValuesType = zod.infer<
  typeof menuAddProfileFormSchema
>;

export const menuAddProfileInitialValues: MenuAddProfileFormSchemaFormValuesType =
  {
    name: "",
    parentId: "",
    order: "",
    description: "",
    url: "",
    media: "",
    feId: "",
    feType: "",
    menuType: "",
    exactMatch: false,
    menuCode: "",
  };

export const messageAddProfileFormSchema = zod.object({
  key: zod.string().min(1, { message: "Please enter your phone number" }),
  externalErrorCode: zod.string().optional(),
  value: zod.string().min(1, { message: "Please enter your phone number" }),
  resourceType: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
  language: zod.string().min(1, { message: "Please enter your phone number" }),
});

export type MessageAddProfileFormSchemaFormValuesType = zod.infer<
  typeof messageAddProfileFormSchema
>;

export const messageAddProfileInitialValues: MessageAddProfileFormSchemaFormValuesType =
  {
    value: "",
    key: "",
    externalErrorCode: "",
    resourceType: "",
    language: "",
  };

export const userRoleAddFormSchema = zod.object({
  name: zod.string().min(1, { message: "Please enter your phone number" }),
  code: zod.string().min(1, { message: "Please enter your phone number" }),
  description: zod
    .string()
    .min(1, { message: "Please enter your phone number" }),
    order: zod.string().regex(/^\d+$/, 'Must be a number').transform(Number),
    userType: zod.number().nonnegative(),
});

export type UserRoleAddFormSchemaFormValuesType = zod.infer<
  typeof userRoleAddFormSchema
>;

export const userRoleAddInitialValues: UserRoleAddFormSchemaFormValuesType = {
  name: "",
  description: "",
  code: "",
  order: 0,  
  userType: 0,  

};

export const roleMenuAddFormSchema = zod.object({
  roleId: zod.preprocess((val) => String(val).trim(), zod.string().min(1)),
  menuIds: zod.any(),
  read: zod.boolean(),
  update: zod.boolean(),
  create: zod.boolean(),
  delete: zod.boolean(),
});

export type RoleMenuAddFormSchemaFormValuesType = zod.infer<
  typeof roleMenuAddFormSchema
>;

export const roleMenuAddInitialValues: RoleMenuAddFormSchemaFormValuesType = {
  roleId: "",
  menuIds: [],
  read: false,
  update: false,
  create: false,
  delete: false,
};

export const parameterAddFormSchema = zod.object({
  groupCode: zod.string().min(1, { message: "Please enter your phone number" }),
  key: zod.string().min(1, { message: "Please enter your phone number" }),
  value: zod.string().min(1, { message: "Please enter your phone number" }),
});

export type ParameterAddFormSchemaFormValuesType = zod.infer<
  typeof parameterAddFormSchema
>;

export const parameterAddInitialValues: ParameterAddFormSchemaFormValuesType = {
  groupCode: "",
  key: "",
  value: "",
};

export const nonsecureAddFormSchema = zod.object({
  merchantId: zod.any(),
  bankCode: zod.string().min(1, { message: "Please enter your phone number" }),
  threeDRequired: zod.boolean(),
  maxAmount: zod.preprocess((val) => String(val).trim(), zod.string().min(1)),
});

export type NonsecureAddFormSchemaFormValuesType = zod.infer<
  typeof nonsecureAddFormSchema
>;

export const nonsecureAddInitialValues: NonsecureAddFormSchemaFormValuesType = {
  merchantId: "",
  bankCode: "",
  threeDRequired: false,
  maxAmount: "",
};
