import { IMerchant } from "@/hooks";
import {
  Stack,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MerchantAddFormAddressStep } from "./MerchantAddFormAddressStep";
import { MerchantAddFormBankStep } from "./MerchantAddFormBankStep";
import { MerchantAddFormCompanyStep } from "./MerchantAddFormCompanyStep";
import { MerchantAddFormPartnerStep } from "./MerchantAddFormPartnerStep";
import { MerchantAddFormCurrencyStep } from "./MerchantAddFormCurrencyStep";

const steps = [
  "Şirket Bilgileri",
  "Yetkili Kişi Bilgileri",
  "Adres Bilgileri",
  "Banka Bilgileri",
  "Para Birimi Kısıtlama",
];

export const MerchantAddForm = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
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

  // const handleBack = () => {
  //   let newSkipped = skipped;

  //   // Update the skipped state if current step was skipped
  //   if (isStepSkipped(activeStep)) {
  //     newSkipped = new Set(newSkipped.values());
  //     newSkipped.delete(activeStep);
  //     setSkipped(newSkipped);
  //   }

  //   // Check if the active step is not the first one to avoid going to negative steps
  //   if (activeStep > 0) {
  //     setActiveStep((prevActiveStep) => prevActiveStep - 1);
  //   }
  // };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const [allData, setAllData] = React.useState({});

  React.useEffect(() => {
    if (merchant?.id) {
      setAllData({ ...allData, ...merchant });
    }
  }, [merchant]);

  console.log(allData)

  return (
    <Stack flex={1}>
      <Stack>
        <Stepper
          sx={{ px: isDesktop ? 4 : 1, py: 2 }}
          orientation={isDesktop ? "horizontal" : "vertical"}
          activeStep={activeStep}
        >
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
        <MerchantAddFormCompanyStep
          merchant={merchant?.id ? merchant : allData}
          onNext={handleNext}
          allData={allData}
          setAllData={setAllData}
        />
      )}
      {activeStep === 1 && (
        <MerchantAddFormPartnerStep
          merchant={merchant?.officialFullName? merchant : allData}
          onNext={handleNext}
          onBack={handleBack}
          allData={allData}
          setAllData={setAllData}
        />
      )}
      {activeStep === 2 && (
        <MerchantAddFormAddressStep
          merchant={merchant?.addressLine1?merchant:allData}
          onNext={handleNext}
          onBack={handleBack}
          allData={allData}
          setAllData={setAllData}
        />
      )}
      {activeStep === 3 && (
        <MerchantAddFormBankStep
          merchant={merchant?.iban?merchant:allData}
          onNext={handleNext}
          onBack={handleBack}
          allData={allData}
          setAllData={setAllData}
        />
      )}
      {activeStep === 4 && (
        <MerchantAddFormCurrencyStep
          merchant={merchant?.try?merchant:allData}
          onBack={handleBack}
          allData={allData}
          setAllData={setAllData}
        />
      )}
    </Stack>
  );
};
