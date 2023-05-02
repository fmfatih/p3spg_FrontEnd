import * as zod from "zod";

export const addCampaignFormSchema = zod.object({
  merchantId: zod.any(),
  cardBins: zod.any(),
  bankCode: zod.string(),
  cardType: zod.string(),
  discountRate: zod.string(),
  minAmount: zod.string(),
  maxAmount: zod.string(),
  startDate: zod.any(),
  endDate: zod.any(),
});

export type CampaignAddFormValuesType = zod.infer<typeof addCampaignFormSchema>;
