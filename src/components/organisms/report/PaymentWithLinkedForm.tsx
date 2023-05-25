import React, { useEffect, useMemo, useState } from "react";
import {
  useGetAllMerchantList,
  useGetAcquirerBankList,
  useGetInstallmentCountSettingsList,
  useGetCurrencyCodeList,
  usePaymentWithLinked,
  IPaymentWithLinkedRequest,
  useAuthorization,
} from "../../../hooks";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  InputControl,
  DateTimePickerControl,
  SelectControl,
  FormatInputControl,
  NumericFormatInputControl,
} from "../../molecules";
import { Stack } from "@mui/system";
import {
  FormControl,
  TextField,
  Autocomplete,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Button, Loading } from "../../atoms";
import { useForm, Controller } from "react-hook-form";
import {
  paymentWithLinkedFormSchema,
  PaymentWithLinkedValuesType,
  paymentWithLinkedInitialValues,
} from "./_formTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { default as dayjs } from "dayjs";

export const PaymentWithLinkedForm = () => {
  const theme = useTheme();
  const { showCreate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const { data: rawMerchantList } = useGetAllMerchantList();
  const { data: rawInstallmentSettingsList } =
    useGetInstallmentCountSettingsList({});
  const { data: rawCurrencyCodeList } = useGetCurrencyCodeList({});
  const { mutate: paymentWithLinked, isLoading: isPaymentLoading } =
    usePaymentWithLinked();
  const setSnackbar = useSetSnackBar();
  const [currentUrl, setCurrentUrl] = useState(undefined);

  const { control, handleSubmit, setValue } =
    useForm<PaymentWithLinkedValuesType>({
      resolver: zodResolver(paymentWithLinkedFormSchema),
      defaultValues: paymentWithLinkedInitialValues,
    });

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

  const merchantList = useMemo(() => {
    return rawMerchantList?.data?.map(
      (rawPosType: { merchantName: string; merchantId: number }) => {
        return {
          label: rawPosType.merchantName,
          value: rawPosType.merchantId,
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

  const onSubmit = (formValues: PaymentWithLinkedValuesType) => {
    const request: IPaymentWithLinkedRequest = {
      bankCode: formValues.bankCode,
      orderId: formValues.orderId,
      merchantId: Number(formValues.merchantId),
      amount: formValues.amount.replace(".", "").replace(",", ""),
      installmentCount: formValues.installmentCount,
      description: formValues.description,
      currency: formValues.currency,
      userEmail: formValues.userEmail || "",
      userPhoneNumber: formValues.userPhoneNumber || "",
      expireMinute: dayjs(formValues.endDate).diff(
        dayjs(formValues.startDate),
        "minutes"
      ),
      memberId: 0,
    };

    paymentWithLinked(request, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setCurrentUrl(data?.data?.url);
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
  };

  useEffect(() => {
    setValue("startDate", dayjs());
    setValue("endDate", dayjs());
    setValue("installmentCount", "0");
  }, [setValue]);

  useEffect(() => {
    setValue("url", currentUrl);
  }, [currentUrl, setValue]);

  const hasLoading = isPaymentLoading;

  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {acquirerBankList && (
                  <Controller
                    name="bankCode"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedBank = acquirerBankList.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="bankCode"
                          options={acquirerBankList}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
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

              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  label="Sipariş Numarası"
                  control={control}
                  id="orderId"
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="merchantId"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            onChange={(event, selectedValue) => {
                              //setSelectedMerchant(selectedValue);
                              setValue("merchantId", selectedValue.value);
                            }}
                            id="merchantId"
                            options={merchantList}
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
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  label="Ürün Adı"
                  control={control}
                  id="description"
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <DateTimePickerControl
                  sx={{ flex: 1 }}
                  id="startDate"
                  control={control}
                  label="Başlangıç Tarihi"
                  minDate={dayjs()}
                  defaultValue={dayjs()}
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <DateTimePickerControl
                  sx={{ flex: 1 }}
                  id="endDate"
                  control={control}
                  label="Bitiş Tarihi"
                  defaultValue={dayjs()}
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {currencyCodeList && (
                  <Controller
                    name="currency"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedCurrency = currencyCodeList.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="currency"
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
                <NumericFormatInputControl
                  sx={{ flex: 1 }}
                  label="Tutar"
                  control={control}
                  id="amount"
                  adornmentText="TL"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "48.5%" : "100%" }}>
                {installmentCounts && (
                  <Controller
                    name="installmentCount"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedInstallment = installmentCounts.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="installmentCount"
                          options={installmentCounts}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
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
            </Stack>

            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  defaultValue=""
                  id={"userEmail"}
                  control={control}
                  label="E-Posta"
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <FormatInputControl
                  defaultValue=""
                  label="Telefon Numarası"
                  control={control}
                  id="userPhoneNumber"
                  allowEmptyFormatting
                  mask="_"
                  format="0(###) ### ## ##"
                />
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              width={isDesktop ? 800 : "auto"}
            >
              {!!showCreate && (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                  text={"Ödeme Lİnkİ Oluştur"}
                />
              )}
            </Stack>
            {currentUrl && (
              <Stack
                direction="row"
                justifyContent="center"
                width={isDesktop ? 800 : "auto"}
              >
                <FormControl sx={{ width: "50%" }}>
                  <InputControl
                    value={currentUrl}
                    defaultValue={currentUrl}
                    id={"url"}
                    control={control}
                    label=""
                    isDisabled
                  />
                </FormControl>
                <Tooltip title="Kopyala">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(currentUrl || "");
                    }}
                    edge="end"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
