import { IMerchant } from "@/hooks";
import { Stack, Stepper, Step, StepLabel, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MerchantAddFormAddressStep } from "./MerchantAddFormAddressStep";
import { MerchantAddFormBankStep } from "./MerchantAddFormBankStep";
import { MerchantAddFormCompanyStep } from "./MerchantAddFormCompanyStep";
import { MerchantAddFormPartnerStep } from "./MerchantAddFormPartnerStep";

const steps = [
  "Şirket Bilgileri",
  "Yetkili Kişi Bilgileri",
  "Adres Bilgileri",
  "Banka Bilgileri",
];

export const MerchantAddForm = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const merchant = useLocation().state as unknown as IMerchant | undefined;

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  return (
    <Stack flex={1}>
      <Stack>
        <Stepper sx={{ px: isDesktop ? 4 : 1, py: 2 }} orientation={isDesktop ? "horizontal" : "vertical"} activeStep={activeStep}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Stack>
      {activeStep === 0 && (
        <MerchantAddFormCompanyStep merchant={merchant} onNext={handleNext} />
      )}
      {activeStep === 1 && (
        <MerchantAddFormPartnerStep merchant={merchant} onNext={handleNext} />
      )}
      {activeStep === 2 && (
        <MerchantAddFormAddressStep merchant={merchant} onNext={handleNext} />
      )}
      {activeStep === 3 && <MerchantAddFormBankStep merchant={merchant} />}
    </Stack>
  );
};
