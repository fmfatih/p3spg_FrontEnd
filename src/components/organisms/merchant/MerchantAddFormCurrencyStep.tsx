// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import { InputControl, SelectControl, SwitchControl } from "../../molecules";
import { FormControl, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { Button, Loading } from "../../atoms";
import {
  IMerchant,
  useGetBankList,
  useGetCurrencyCodeList,
  useMerchantRestrictionAdd,
  useMerchantRestrictionUpdate,
} from "../../../hooks";
import { useEffect, useMemo } from "react";
import { useUserMerchantId } from "./Merchant.state";
import { useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fourthStepFormSchema,
  FourthStepFormValuesType,
  fourthStepInitialValues,
} from "./_formTypes";

type MerchantAddFormCompanyStepProps = {
  merchant?: IMerchant;
};

export const MerchantAddFormCurrencyStep = ({
  merchant,
}: MerchantAddFormCompanyStepProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { data: rawCurrencyCodeList } = useGetCurrencyCodeList({});
  const navigate = useNavigate();
  const setSnackbar = useSetSnackBar();
  const [merchantId] = useUserMerchantId();
  const { data: rawBankList } = useGetBankList({});
  const { mutate: merchantRestrictionAdd, isLoading } = useMerchantRestrictionAdd();
  const { mutate: merchantRestrictionUpdate, isUpdateLoading } =
    useMerchantRestrictionUpdate();
  const { control, reset, handleSubmit } = useForm<FourthStepFormValuesType>({
    resolver: zodResolver(fourthStepFormSchema),
    defaultValues: fourthStepInitialValues,
  });




  const onSubmit = ({
    try: tryCurrency,
    usd: usdCurrency,
    eur: eurCurrency,
  }: FourthStepFormValuesType) => {
    const request = {
      merchantId,
      try: tryCurrency,
      usd: usdCurrency,
      eur: eurCurrency,
    };
    
    
    // 
    if (merchant && merchant?.id > 0) {
      merchantRestrictionUpdate(
        { ...request, id: merchant?.id || 0 },
        {
          onSuccess(data) {
            if (data.isSuccess) {
              navigate("/merchant-management/merchant-listing");
              setSnackbar({
                severity: "success",
                isOpen: true,
                description: data.message,
              });
            } else {
              setSnackbar({
                severity: "error",
                isOpen: true,
                description: data.message,
              });
            }
          },
          onError: () => {
            setSnackbar({
              severity: "error",
              isOpen: true,
              description: "İşlem sırasında bir hata oluştu",
            });
          },
        }
      );
    } else {
      merchantRestrictionAdd(request, {
        onSuccess(data) {
          if (data.isSuccess) {
            navigate("/merchant-management/merchant-listing");
            setSnackbar({
              severity: "success",
              isOpen: true,
              description: data.message,
            });
          } else {
            setSnackbar({
              severity: "error",
              isOpen: true,
              description: data.message,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: "error",
            isOpen: true,
            description: "İşlem sırasında bir hata oluştu",
          });
        },
      });
    }
  };

  useEffect(() => {
    if (!!merchant && JSON.stringify(merchant) !== "{}") {
      reset({
      
        try: merchant.try,
        usd: merchant.usd,
        eur: merchant.eur,
        
      });

    }
  }, [merchant, reset]);

  
  return (
    <>
      {isLoading && <Loading />}
      <Stack pt={3} flex={1} justifyContent="space-between">
        <Stack px={isDesktop ? 4 : 1} spacing={3}>
        <Stack
              mb={3}
              width={isDesktop ? 1000 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <SwitchControl label="TRY" control={control} id="try"  isDisabled={true}/>
              <SwitchControl
                label="USD"
                control={control}
                id="usd"
              />
                     <SwitchControl label="EUR" control={control} id="eur" />
            </Stack>
     
        </Stack>
        <Stack
          borderTop="1px solid #E6E9ED"
          direction="row"
          py={2}
          px={4}
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            text="Kaydet"
            onClick={handleSubmit(onSubmit)}
          />
        </Stack>
      </Stack>
    </>
  );
};
