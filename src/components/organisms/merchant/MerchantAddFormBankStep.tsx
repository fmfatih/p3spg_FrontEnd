// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import { InputControl, SelectControl } from "../../molecules";
import {
  Autocomplete,
  Box,
  FormControl,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Button, Loading } from "../../atoms";
import {
  IMerchant,
  useGetBankList,
  useGetCurrencyCodeList,
  useMerchantBankAdd,
  useMerchantBankUpdate,
} from "../../../hooks";
import React, { useEffect, useMemo } from "react";
import { useUserMerchantId } from "./Merchant.state";
import { useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  thirdStepFormSchema,
  ThirdStepFormValuesType,
  thirdStepInitialValues,
} from "./_formTypes";

type MerchantAddFormCompanyStepProps = {
  onNext: () => void;
  onBack: () => void;
  merchant?: IMerchant;
  allData?: any;
  setAllData?: any;
};

export const MerchantAddFormBankStep = ({
  merchant,
  onNext,
  onBack,
  allData,
  setAllData,
}: MerchantAddFormCompanyStepProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { data: rawCurrencyCodeList } = useGetCurrencyCodeList({});
  const navigate = useNavigate();
  const setSnackbar = useSetSnackBar();
  const [merchantId] = useUserMerchantId();
  const { data: rawBankList } = useGetBankList({});
  const { mutate: merchantBankAdd, isLoading } = useMerchantBankAdd();
  const { mutate: merchantBankUpdate, isUpdateLoading } =
    useMerchantBankUpdate();
  const { control, reset, handleSubmit } = useForm<ThirdStepFormValuesType>({
    resolver: zodResolver(thirdStepFormSchema),
    defaultValues: thirdStepInitialValues,
  });

  const currencyCodeList = useMemo(() => {
    return rawCurrencyCodeList?.data?.map(
      (currencyCode: { value: string; key: string }) => {
        return {
          label: `${currencyCode.value}`,
          value: currencyCode.key,
        };
      }
    );
  }, [rawCurrencyCodeList?.data]);

  const bankList = useMemo(() => {
    return rawBankList?.data?.map((bank: { name: string; code: string }) => {
      return {
        label: `${bank.name}`,
        value: bank.code,
      };
    });
  }, [rawBankList?.data]);

  const onSubmit = ({
    currencyCode,
    iban,
    bankCode,
    accountOwner,
    ibanTwo,
    bankCodeTwo,
    currencyCodeTwo,
    accountOwnerTwo,
    currencyCodeThree,
    ibanThree,
    bankCodeThree,
    accountOwnerThree,
  }: ThirdStepFormValuesType) => {
    // const request = {
    //   merchantId,
    //   currencyCode: Number(currencyCode),
    //   iban,
    //   bankCode,
    //   accountOwner,
    //   currencyCodeTwo: Number(currencyCodeTwo) || 0,
    //   ibanTwo: ibanTwo || "",
    //   bankCodeTwo: bankCodeTwo || "",
    //   accountOwnerTwo: accountOwnerTwo || "",
    //   currencyCodeThree: Number(currencyCodeThree) || 0,
    //   ibanThree: ibanThree || "",
    //   bankCodeThree: bankCodeThree || "",
    //   accountOwnerThree: accountOwnerThree || "",
    // };

    // const request = 
    //   [
    //     { 
    //       currencyCode: Number(currencyCode), 
    //       iban, 
    //       bankCode, 
    //       accountOwner, 
    //       bankType: Number(1),
    //       merchantId,
    //     },
    //     {
    //       currencyCode: Number(currencyCodeTwo) || 0,
    //       iban: ibanTwo || "",
    //       bankCode: bankCodeTwo || "",
    //       accountOwner: accountOwnerTwo || "",
    //       bankType: Number(1),
    //       merchantId,
    //     },
    //     {
    //       currencyCode: Number(currencyCodeThree) || 0,
    //       iban: ibanThree || "",
    //       bankCode: bankCodeThree || "",
    //       accountOwner: accountOwnerThree || "",
    //       bankType: Number(1),
    //       merchantId,
    //     },
    //   ]

      const request = [
        { 
          currencyCode: Number(currencyCode), 
          iban, 
          bankCode, 
          accountOwner, 
          bankType: Number(1),
          merchantId,
        }
      ];
      
      if (currencyCodeTwo || ibanTwo || bankCodeTwo || accountOwnerTwo) {
        request.push({
          currencyCode: Number(currencyCodeTwo) || 0,
          iban: ibanTwo || "",
          bankCode: bankCodeTwo || "",
          accountOwner: accountOwnerTwo || "",
          bankType: Number(1),
          merchantId,
        });
      }
      
      if (currencyCodeThree || ibanThree || bankCodeThree || accountOwnerThree) {
        request.push({
          currencyCode: Number(currencyCodeThree) || 0,
          iban: ibanThree || "",
          bankCode: bankCodeThree || "",
          accountOwner: accountOwnerThree || "",
          bankType: Number(1),
          merchantId,
        });
      }
      
    
      // const requestUpdate = {
      //   merchantBanks:[
      //     { 
      //       currencyCode: Number(currencyCode), 
      //       iban, 
      //       bankCode, 
      //       accountOwner, 
      //       bankType: Number(1),
      //       merchantId,
      //     },
      //     {
      //       currencyCode: Number(currencyCodeTwo) || 0,
      //       iban: ibanTwo || "",
      //       bankCode: bankCodeTwo || "",
      //       accountOwner: accountOwnerTwo || "",
      //       bankType: Number(1),
      //       merchantId,
      //     },
      //     {
      //       currencyCode: Number(currencyCodeThree) || 0,
      //       iban: ibanThree || "",
      //       bankCode: bankCodeThree || "",
      //       accountOwner: accountOwnerThree || "",
      //       bankType: Number(1),
      //       merchantId,
      //     },
      //   ]
      // }
      const requestUpdate = {
        merchantBanks: [
          { 
            currencyCode: Number(currencyCode), 
            iban, 
            bankCode, 
            accountOwner, 
            bankType: Number(1),
            merchantId,
          }
        ]
      };
      
      if (currencyCodeTwo || ibanTwo || bankCodeTwo || accountOwnerTwo) {
        requestUpdate.merchantBanks.push({
          currencyCode: Number(currencyCodeTwo) || 0,
          iban: ibanTwo || "",
          bankCode: bankCodeTwo || "",
          accountOwner: accountOwnerTwo || "",
          bankType: Number(1),
          merchantId,
        });
      }
      
      if (currencyCodeThree || ibanThree || bankCodeThree || accountOwnerThree) {
        requestUpdate.merchantBanks.push({
          currencyCode: Number(currencyCodeThree) || 0,
          iban: ibanThree || "",
          bankCode: bankCodeThree || "",
          accountOwner: accountOwnerThree || "",
          bankType: Number(1),
          merchantId,
        });
      }
      

    

    setAllData({ ...allData, ...request });
    console.log(allData);
    
    if (
      (merchant && merchant?.id > 0 && allData?.iban) ||
      (allData && allData?.iban)
    ) {
      merchantBankUpdate(
        { ...requestUpdate, id: merchant?.id || 0 },
        {
          onSuccess(data) {
            onNext();
            if (data.isSuccess) {
              //navigate("/merchant-management/merchant-listing");

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
      merchantBankAdd(request, {
        onSuccess(data) {
          if (data.isSuccess) {
            //navigate("/merchant-management/merchant-listing");
            onNext();
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
      console.log(merchant[1])
      reset({
        currencyCode: merchant?.currencyCode?.toString(),
        iban: merchant?.iban || "",
        bankCode: merchant?.bankCode,
        accountOwner: merchant?.accountOwner || "",
        ibanTwo: merchant?.[1].ibanTwo || "", // Yeni alan
        ibanThree: merchant?.ibanThree || "", // Yeni alan
        currencyCodeTwo: merchant?.[1].currencyCodeTwo?.toString(),
        currencyCodeThree: merchant?.currencyCodeThree?.toString(),
        bankCodeTwo: merchant?.[1].bankCodeTwo,
        bankCodeThree: merchant?.bankCodeThree,
        accountOwnerTwo: merchant?.[1].accountOwnerTwo || "",
        accountOwnerThree: merchant?.accountOwnerThree || "",
      });
    }
  }, [merchant, reset]);
  const AccountInput = ({
    id,
    currencyCode,
    iban,
    bankCode,
    accountOwner,
    control,
    currencyCodeList,
    bankList,
  }) => (
    <Stack py={isDesktop ? 3 : 1} spacing={3}>
      <Stack
        width={isDesktop ? 800 : "auto"}
        spacing={3}
        direction={isDesktop ? "row" : "column"}
      >
        <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
          {currencyCodeList && (
            <Controller
              name={currencyCode} // Burada gelen değeri kullanıyoruz
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => {
                const selectedCurrency = currencyCodeList?.find(
                  (option) => option.value === value
                );

                return (
                  <Autocomplete
                    id={currencyCode} // Burada gelen değeri kullanıyoruz
                    options={currencyCodeList}
                    getOptionSelected={(option, value) =>
                      option.value === value
                    }
                    getOptionLabel={(option) => option.label}
                    value={selectedCurrency || null}
                    onChange={(_, newValue) => {
                      onChange(newValue ? newValue.value : "");
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Para Birimi" />
                    )}
                  />
                );
              }}
            />
          )}
        </FormControl>

        <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
          <InputControl
            sx={{ mr: isDesktop ? 3 : 0 }}
            id={iban} // Burada gelen değeri kullanıyoruz
            control={control}
            label="IBAN"
          />
        </FormControl>
      </Stack>
      <Stack
        pb={isDesktop ? 0 : 2}
        width={isDesktop ? 800 : "auto"}
        spacing={3}
        direction={isDesktop ? "row" : "column"}
      >
        <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
          {bankList && (
            <Controller
              name={bankCode}
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => {
                const selectedBank = bankList.find(
                  (option) => option.value === value
                );

                return (
                  <Autocomplete
                    id={bankCode}
                    options={bankList}
                    getOptionSelected={(option, value) =>
                      option.value === value
                    }
                    getOptionLabel={(option) => option.label}
                    value={selectedBank || null}
                    onChange={(_, newValue) => {
                      onChange(newValue ? newValue.value : "");
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Banka Adı" />
                    )}
                  />
                );
              }}
            />
          )}
        </FormControl>

        <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
          <InputControl
            sx={{ mr: isDesktop ? 3 : 0 }}
            id={accountOwner}
            control={control}
            label="Hesap Sahibi"
          />
        </FormControl>
      </Stack>
    </Stack>
  );

  const [accountsCount, setAccountsCount] = React.useState(1);

  const addAccount = () => {
    if (accountsCount < 3) {
      setAccountsCount(accountsCount + 1);
    } else {
      setSnackbar({
        severity: "error",
        isOpen: true,
        description: "Daha Fazla Hesap Ekleyemezsiniz",
      });
    }
  };

  const renderAccounts = () => {
    const currencyCodes = ["currencyCodeTwo", "currencyCodeThree"];
    const ibans = ["ibanTwo", "ibanThree"];
    const bankCodes = ["bankCodeTwo", "bankCodeThree"];
    const accountOwners = ["accountOwnerTwo", "accountOwnerThree"];
    let accounts = [];
    for (let i = 0; i < accountsCount - 1; i++) {
      // -1, orijinal formu saymamak için
      accounts.push(
        <AccountInput
          id={i + 2} // +2, orijinal formun id'sini aşmamak için
          currencyCode={currencyCodes[i]}
          iban={ibans[i]}
          bankCode={bankCodes[i]}
          accountOwner={accountOwners[i]}
          control={control} // kontrol ve listeleri AccountInput bileşenine aktar
          currencyCodeList={currencyCodeList}
          bankList={bankList}
        />
      );
    }
    return accounts;
  };

  return (
    <>
      {isLoading && <Loading />}
      <Stack pt={3} flex={1} justifyContent="space-between">
        <Stack px={isDesktop ? 4 : 1} spacing={3}>
          <Stack
            width={isDesktop ? 800 : "auto"}
            spacing={3}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              {currencyCodeList && (
                <Controller
                  name="currencyCode"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => {
                    const selectedCurrency = currencyCodeList?.find(
                      (option) => option.value === value
                    );

                    return (
                      <Autocomplete
                        id="currencyCode"
                        options={currencyCodeList}
                        defaultValue={currencyCodeList?.find(
                          (option) => option.value === merchant?.currencyCode
                        )}
                        getOptionSelected={(option, value) =>
                          option.value === value
                        }
                        getOptionLabel={(option) => option.label}
                        value={selectedCurrency || null}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue.value : "");
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Para Birimi" />
                        )}
                      />
                    );
                  }}
                />
              )}
            </FormControl>

            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="iban"
                control={control}
                label="IBAN"
              />
            </FormControl>
          </Stack>
          <Stack
            pb={isDesktop ? 0 : 2}
            width={isDesktop ? 800 : "auto"}
            spacing={3}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              {bankList && (
                <Controller
                  name="bankCode"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => {
                    const selectedBank = bankList.find(
                      (option) => option.value === value
                    );

                    return (
                      <Autocomplete
                        id="bankCode"
                        options={bankList}
                        getOptionSelected={(option, value) =>
                          option.value === value
                        }
                        getOptionLabel={(option) => option.label}
                        value={selectedBank || null}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue.value : "");
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Banka Adı" />
                        )}
                      />
                    );
                  }}
                />
              )}
            </FormControl>

            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="accountOwner"
                control={control}
                label="Hesap Sahibi"
              />
            </FormControl>
          </Stack>
          {renderAccounts()}
        </Stack>

        <Stack
          borderTop="1px solid #E6E9ED"
          direction="row"
          py={2}
          px={4}
          justifyContent="flex-end"
          spacing={2}
        >
          <Box>
            <Button
              variant="contained"
              onClick={addAccount}
              text="Hesap Ekle"
            />
          </Box>
          <Box>
            <Button variant="contained" text="Geri" onClick={onBack} />
          </Box>
          <Box>
            <Button
              variant="contained"
              text="Devam"
              onClick={handleSubmit(onSubmit)}
            />
          </Box>
        </Stack>
      </Stack>
    </>
  );
};
