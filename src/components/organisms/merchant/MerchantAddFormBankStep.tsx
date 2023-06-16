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
import { useEffect, useMemo } from "react";
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
  }: ThirdStepFormValuesType) => {
    const request = {
      merchantId,
      currencyCode: Number(currencyCode),
      iban,
      bankCode,
      accountOwner,
    };
    setAllData({ ...allData, ...request });
    if (
      (merchant && merchant?.id > 0 && allData?.iban) ||
      (allData && allData?.iban)
    ) {
      merchantBankUpdate(
        { ...request, id: merchant?.id || 0 },
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
      reset({
        currencyCode: merchant?.currencyCode?.toString(),
        iban: merchant?.iban || "",
        bankCode: merchant?.bankCode,
        accountOwner: merchant?.accountOwner || "",
      });
    }
  }, [merchant, reset]);

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
