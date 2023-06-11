import {
  ICommissionParameter,
  useAddCommissionParameter,
  useGetCardTypeList,
  useGetCommissionProfileList,
  useGetInstallmentCountSettingsList,
  useGetAllMerchantList,
  useGetAcquirerBankList,
  useGetPayment3DTrxSettingsList,
  useUpdateCommissionParameter,
  useAuthorization,
} from "../../../hooks";
import {
  Box,
  FormControl,
  useMediaQuery,
  useTheme,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Stack } from "@mui/system";
import { Button, Loading } from "../../atoms";
import { InputControl, SelectControl, SwitchControl } from "../../molecules";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import {
  bankAddFormSchema,
  BankAddFormSchemaFormValuesType,
  bankAddInitialValues,
} from "./_formTypes";
import { zodResolver } from "@hookform/resolvers/zod";

export const BankAddCommissionForm = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const setSnackbar = useSetSnackBar();
  const commissionParameter = useLocation()
    .state as unknown as ICommissionParameter;
  const {
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
  } = useForm<BankAddFormSchemaFormValuesType>({
    resolver: zodResolver(bankAddFormSchema),
    defaultValues: bankAddInitialValues,
  });
  const {showCreate} = useAuthorization();
  const { data: rawCommissionProfileList } = useGetCommissionProfileList({});
  const { data: rawMerchantList } = useGetAllMerchantList();
  const { data: rawCardTypeList } = useGetCardTypeList({});
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const { data: rawPayment3DTrxSettingsList } = useGetPayment3DTrxSettingsList(
    {}
  );
  const { data: rawInstallmentSettingsList } =
    useGetInstallmentCountSettingsList({});
  const { mutate: addCommisionParameter, isLoading } =
    useAddCommissionParameter();
  const { mutate: updateCommisionParameter } = useUpdateCommissionParameter();
  const navigate = useNavigate();
  const bankBlockedValue = watch("bankblocked");
  const merchantBlockedValue = watch("merchantblocked");

  const [selectedMerchant, setSelectedMerchant] = useState(null as any);
  const [selectedSubMerchant, setSelectedSubMerchant] = useState(null as any);

  const merchantList = useMemo(() => {
    return rawMerchantList?.data?.map(
      (merchant: { merchantName: string; merchantId: number }) => {
        return {
          label: `${merchant.merchantName}`,
          value: `${merchant.merchantId}`,
        };
      }
    );
  }, [rawMerchantList?.data]);

  const installmentCounts = useMemo(() => {
    return rawInstallmentSettingsList?.data?.map(
      (merchant: { key: string; value: string }) => {
        return {
          label: `${merchant.key}`,
          value: merchant.value,
        };
      }
    );
  }, [rawInstallmentSettingsList?.data]);

  const commissionProfileList = useMemo(() => {
    return rawCommissionProfileList?.data?.map(
      (commissionProfule: { name: string; code: string }) => {
        return {
          label: `${commissionProfule.name}`,
          value: commissionProfule.code,
        };
      }
    );
  }, [rawCommissionProfileList?.data]);

  const cardTypeList = useMemo(() => {
    return rawCardTypeList?.data?.map(
      (cardType: { key: string; value: string }) => {
        return {
          label: `${cardType.value}`,
          value: cardType.key,
        };
      }
    );
  }, [rawCardTypeList?.data]);

  const acquirerBankList = useMemo(() => {
    return rawAcquirerBankList?.data?.map(
      (bank: { bankCode: string; bankName: string }) => {
        return {
          label: `${bank.bankName}`,
          value: bank.bankCode,
        };
      }
    );
  }, [rawAcquirerBankList?.data]);

  const payment3DTrxSettingsList = useMemo(() => {
    return rawPayment3DTrxSettingsList?.data?.map(
      (resourceType: { value: string; key: string }) => {
        return {
          label: resourceType.value,
          value: `${resourceType.key}`,
        };
      }
    );
  }, [rawPayment3DTrxSettingsList?.data]);

  const onSubmit = ({
    profileCode,
    merchantId,
    submerchantId,
    onus,
    commissionFlag,
    international,
    amex,
    cardType,
    installment,
    bankcode,
    bankblocked,
    bankblockedday,
    bankcommission,
    merchantblocked,
    merchantblockedday,
    merchantcommission,
    merchantadditionalcommission,
    // customercommission,
    // customeradditionalcommission,
    minAmount,
    maxAmount,
    txnType,
  }: BankAddFormSchemaFormValuesType) => {
    const request = {
      profileCode,
      merchantId: Number(selectedMerchant?.value) || 0,
      submerchantId: Number(selectedSubMerchant?.value) || 0,
      txnType: txnType,
      onus: !!onus,
      commissionFlag: !!commissionFlag,
      international: !!international,
      amex: !!amex,
      cardType: international ?  "" : cardType,
      installment: Number(installment),
      bankcode,
      bankblocked: !!bankblocked,
      bankblockedday: Number(bankblockedday),
      bankcommission: Number(bankcommission),
      merchantblocked: !!merchantblocked,
      merchantblockedday: Number(merchantblockedday),
      merchantcommission: Number(merchantcommission),
      merchantadditionalcommission: Number(merchantadditionalcommission),
      // customercommission: Number(customercommission),
      // customeradditionalcommission: Number(customeradditionalcommission),
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
    };

    if (commissionParameter && Number(commissionParameter?.id) > 0) {
      updateCommisionParameter(
        {
          ...request,
          id: commissionParameter.id,
          //memberId: 1,
        },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              navigate("/commission-management/commission-listing");
              setSnackbar({
                severity: "success",
                isOpen: true,
                description: data.message,
              });
            } else {
              setSnackbar({
                severity: "error",
                description: data.message,
                isOpen: true,
              });
            }
          },
          onError: () => {
            setSnackbar({
              severity: "error",
              description: "İşlem sırasında bir hata oluştu",
              isOpen: true,
            });
          },
        }
      );
    } else {
      addCommisionParameter(request, {
        onSuccess: (data) => {
          if (data.isSuccess) {
            navigate("/commission-management/commission-listing");
            setSnackbar({
              severity: "success",
              isOpen: true,
              description: data.message,
            });
          } else {
            setSnackbar({
              severity: "error",
              description: data.message,
              isOpen: true,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: "error",
            description: "İşlem sırasında bir hata oluştu",
            isOpen: true,
          });
        },
      });
    }
  };

  useEffect(() => {
    if (!!commissionParameter && JSON.stringify(commissionParameter) !== "{}") {
      setSelectedMerchant({
        label: commissionParameter?.merchantName || "",
        value: commissionParameter?.merchantId,
      });
      setSelectedSubMerchant({
        label: commissionParameter?.submerchantName || "",
        value: commissionParameter?.submerchantId,
      });

      reset({
        profileCode: commissionParameter.profileCode,
        merchantId: {
          label: `${commissionParameter.merchantName}`,
          value: commissionParameter.merchantId,
        },
        submerchantId: {
          label: `${commissionParameter.submerchantName}`,
          value: commissionParameter.submerchantId,
        },
        onus: commissionParameter.onus,
        commissionFlag: commissionParameter.commissionFlag,
        international: commissionParameter.international,
        amex: commissionParameter.amex,
        txnType: commissionParameter.txnType,
        installment: `${commissionParameter.installment}`,
        bankcode: commissionParameter.bankcode,
        bankblocked: commissionParameter.bankblocked,
        bankblockedday: commissionParameter?.bankblockedday?.toString() || "",
        bankcommission: commissionParameter?.bankcommission?.toString() || "",
        // customercommission:
        //   commissionParameter?.customercommission?.toString() || "",
        // customeradditionalcommission:
        //   commissionParameter?.customeradditionalcommission?.toString() || "",
        minAmount: commissionParameter?.minAmount?.toString() || "",
        maxAmount: commissionParameter?.maxAmount?.toString() || "",
        cardType: commissionParameter.cardType,
        merchantblocked: commissionParameter.merchantblocked,
        merchantblockedday:
          commissionParameter?.merchantblockedday?.toString() || "",
        merchantcommission:
          commissionParameter?.merchantcommission?.toString() || "",
        merchantadditionalcommission:
          commissionParameter?.merchantadditionalcommission?.toString() || "",
      });
    }
  }, [commissionParameter, reset]);


  const handleBack = () => navigate("/dashboard");
  let internationalState = watch('international')


  return (
    <>
      {isLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
         <FormControl sx={{ flex: 1 }}>
  {commissionProfileList && (
    <Controller
      name="profileCode"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedProfile = commissionProfileList.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="profileCode"
            options={commissionProfileList}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedProfile || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Profil Kodu" />
            )}
          />
        );
      }}
    />
  )}
</FormControl>


<FormControl sx={{ flex: 1 }}>
  {payment3DTrxSettingsList && (
    <Controller
      name="txnType"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedTrxType = payment3DTrxSettingsList.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="txnType"
            options={payment3DTrxSettingsList}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedTrxType || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="İşlem Tipi" />
            )}
          />
        );
      }}
    />
  )}
</FormControl>

            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ flex: 1 }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="merchantId"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            onChange={(event, selectedValue) => {
                              setSelectedMerchant(selectedValue);
                              setValue("merchantId", selectedValue?.value || 0);
                            }}
                            id="merchantId"
                            options={merchantList}
                            value={selectedMerchant}
                            getOptionLabel={(option: {
                              label: string;
                              value: number;
                            }) => option.label}
                            renderInput={(params) => (
                              <TextField {...params} label="Üye İşyeri" />
                            )}
                          />
                        </>
                      );
                    }}
                  />
                )}
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="submerchantId"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            onChange={(event, selectedValue) => {
                              setSelectedSubMerchant(selectedValue);
                              setValue(
                                "submerchantId",
                                selectedValue?.value || 0
                              );
                            }}
                            id="submerchantId"
                            options={merchantList}
                            value={selectedSubMerchant}
                            getOptionLabel={(option: {
                              label: string;
                              value: string;
                            }) => option.label}
                            renderInput={(params) => (
                              <TextField {...params} label="Alt Üye İşyeri" />
                            )}
                          />
                        </>
                      );
                    }}
                  />
                )}
              </FormControl>
            </Stack>

            <Stack
              mb={3}
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <SwitchControl label="Onus" control={control} id="onus" />
              <SwitchControl
                label="International"
                control={control}
                id="international"
              />
            </Stack>
            <Stack
              mb={22}
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <Box flex={1}>
                <SwitchControl label="Amex" control={control} id="amex" />
              </Box>
              <FormControl sx={{ flex: 1 }}>
  {cardTypeList && (
    <Controller
      name="cardType"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedCardType = cardTypeList.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="cardType"
            options={cardTypeList}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedCardType || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Kart Tipi" disabled={internationalState}/>
            )}
            disabled={internationalState}
          />
        );
      }}
    />
  )}
</FormControl>

            </Stack>
            <Stack
              mb={3}
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
             <FormControl sx={{ flex: 1 }}>
  {installmentCounts && (
    <Controller
      name="installment"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedInstallment = installmentCounts.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="installment"
            options={installmentCounts}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedInstallment || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Taksit Sayısı" />
            )}
          />
        );
      }}
    />
  )}
</FormControl>

              <FormControl sx={{ flex: 1 }}>
  {acquirerBankList && (
    <Controller
      name="bankcode"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedBank = acquirerBankList.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="bankcode"
            options={acquirerBankList}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedBank || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Banka" />
            )}
          />
        );
      }}
    />
  )}
</FormControl>
            </Stack>
            <Stack mb={3} spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction={isDesktop ? "row" : "column"}
              >
                <FormControl sx={{ flex: 1 }}>
                  <SwitchControl
                    label="Banka Blokesi"
                    control={control}
                    id="bankblocked"
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    isDisabled={!bankBlockedValue}
                    id="bankblockedday"
                    control={control}
                    label="Banka Bloke Gün"
                  />
                </FormControl>
              </Stack>
            </Stack>
            <Stack mb={3} spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction={isDesktop ? "row" : "column"}
              >
                <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                  <InputControl
                    sx={{ mr: isDesktop ? 2 : 0 }}
                    numeric
                    id="bankcommission"
                    control={control}
                    label="Banka Komisyonu"
                    adornmentText="%"
                  />
                </FormControl>
                <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <SwitchControl label="Komisyon Yansıt" control={control} id="commissionFlag" />
                </FormControl>
              </Stack>
              
        
            </Stack>
            <Stack mb={3} spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction={isDesktop ? "row" : "column"}
              >
                <FormControl sx={{ flex: 1 }}>
                  <SwitchControl
                    id="merchantblocked"
                    label="İşyeri Blokesi"
                    control={control}
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    isDisabled={!merchantBlockedValue}
                    id="merchantblockedday"
                    control={control}
                    label="İşyeri Bloke Gün"
                  />
                </FormControl>
              </Stack>
            </Stack>
            <Stack mb={3} spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction={isDesktop ? "row" : "column"}
              >
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    id="merchantcommission"
                    control={control}
                    label="Üye İşyeri Komisyon Oranı"
                    adornmentText="%"
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    id="merchantadditionalcommission"
                    control={control}
                    label="Üye İşyeri Ücreti"
                    adornmentText="TL"
                  />
                </FormControl>
              </Stack>
            </Stack>
            {/* <Stack mb={3} spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction={isDesktop ? "row" : "column"}
              >
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    id="customercommission"
                    control={control}
                    label="Müşteri Komisyon Oranı"
                    adornmentText="%"
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    id="customeradditionalcommission"
                    control={control}
                    label="Müşteri İşlem Ücreti"
                    adornmentText="TL"
                  />
                </FormControl>
              </Stack>
            </Stack> */}
            <Stack mb={3} spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction={isDesktop ? "row" : "column"}
              >
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    id="minAmount"
                    control={control}
                    label="Minimum Tutar"
                    adornmentText="TL"
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    numeric
                    id="maxAmount"
                    control={control}
                    label="Maksimum Tutar"
                    adornmentText="TL"
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          borderTop="1px solid #E6E9ED"
          py={2}
          direction="row"
          justifyContent="flex-end"
        >
          {!!showCreate && (
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              text={
                commissionParameter && Number(commissionParameter?.id) > 0
                  ? "Güncelle"
                  : "Kaydet"
              }
            />
          )}
          <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
        </Stack>
      </Stack>
    </>
  );
};
