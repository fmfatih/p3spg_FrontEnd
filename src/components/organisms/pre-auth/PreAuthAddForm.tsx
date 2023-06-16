import { Stack } from "@mui/system";
import {
  FormControl,
  Autocomplete,
  TextField,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Button } from "../../atoms";
import {
  useGetAllMerchantList,
  useGetInstallmentCountSettingsList,
  useGetCurrencyCodeList,
  useGetPaymentModelSettingsList,
  usePaymentPreAuth,
  IPaymentPreAuthRequest,
  useAuthorization,
} from "../../../hooks";
import { useMemo, useState } from "react";
import {
  InputControl,
  FormatInputControl,
  SelectControl,
  NumericFormatInputControl,
  BaseModal,
} from "../../molecules";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addPreAuthFormSchema,
  PreAuthAddFormValuesType,
  initialPreAuthState,
} from "./_formTypes";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { useUserInfo } from "../../../store/User.state";

export const PreAuthAddForm = () => {
  const [html, setHtml] = useState();
  const [isHtmlOpen, setIsHtmlOpen] = useState(false);
  const {showCreate} = useAuthorization();
  const [userInfo] = useUserInfo();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { control, handleSubmit } =
    useForm<PreAuthAddFormValuesType>({
      resolver: zodResolver(addPreAuthFormSchema),
      defaultValues: initialPreAuthState,
    });
  const setSnackbar = useSetSnackBar();

  const { data: rawMerchantList } = useGetAllMerchantList();
  const { data: rawInstallmentSettingsList } =
    useGetInstallmentCountSettingsList({});
  const { data: rawCurrencyCodeList } = useGetCurrencyCodeList({});
  const { data: rawPaymentModelList } = useGetPaymentModelSettingsList({});
  const { mutate: paymentPreAuth } = usePaymentPreAuth();
  const [selectedMerchantId, setSelectedMerchantId] = useState(0);

  // const merchantList = useMemo(() => {
  //   return rawMerchantList?.data?.map(
  //     (merchant: { merchantName: string; merchantId: number }) => {
  //       return {
  //         label: `${merchant.merchantName}`,
  //         value: merchant.merchantId,
  //       };
  //     }
  //   );
  // }, [rawMerchantList?.data]);

  const merchantList = useMemo(() => {
 
    if (userInfo.merchantId == 0) {
        return rawMerchantList?.data?.map(
            (rawPosType: { merchantName: string; merchantId: number }) => {
                return {
                    label: rawPosType.merchantName,
                    value: rawPosType.merchantId,
                };
            }
        );
    } else {
        return rawMerchantList?.data
            ?.filter((rawPosType: { merchantName: string; merchantId: number }) => {
                return rawPosType.merchantId === Number(userInfo.merchantId);
            })
            .map((filteredMerchant) => {
                return {
                    label: filteredMerchant.merchantName,
                    value: filteredMerchant.merchantId,
                };
            });
    }
}, [rawMerchantList?.data, userInfo?.merchantId]);

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

  const paymentModelList = useMemo(() => {
    return rawPaymentModelList?.data?.map(
      (currencyCode: { value: string; key: string }) => {
        return {
          label: `${currencyCode.key}`,
          value: `${currencyCode.key}`,
        };
      }
    );
  }, [rawPaymentModelList?.data]);

  const onSubmit = (formValues: PreAuthAddFormValuesType) => {
    const expiryDates = formValues.lastUsingDate
      .trim()
      .replace(/\s/g, "")
      .replace(/\/+$/, "");

    const request: IPaymentPreAuthRequest = {
      cardNumber: formValues.cardNumber.trim().replace(/\s/g, ""),
      expiryDateMonth: expiryDates.charAt(0) + expiryDates.charAt(1),
      expiryDateYear: "20" + expiryDates.charAt(2) + expiryDates.charAt(3),
      cvv: formValues.cvv,
      cardHolderName: formValues.cardHolderName,
      merchantId: selectedMerchantId,
      totalAmount: formValues.totalAmount.replace(".", "").replace(",", ""),
      memberId: 1,
      txnType: "PreAuth",
      installmentCount: formValues.installmentCount,
      currency: formValues.currency,
      orderId: formValues.orderId,
      use3D: formValues.use3D === "3D" ? true : false,
    };

    paymentPreAuth(request, {
      onSuccess: (data) => {
        if(formValues.use3D === "3D") {
          setHtml(data);
          setIsHtmlOpen(true);
          setTimeout(() => {
            const form = document.querySelector('[name="downloadForm"]') as unknown as HTMLFormElement;
            form && form.submit();
          }, 1000);
        };
        if (data.isSuccess) {
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

  return (
    <>
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction="row">
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="merchantId"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            sx={{ mr: isDesktop ? 1 : 0 }}
                            id="merchantId"
                            options={merchantList}
                            //defaultValue={merchantList[0]}
                            onChange={(event, selectedValue) => {
                              setSelectedMerchantId(selectedValue.value);
                            }}
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
            </Stack>
            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction={isDesktop ? "row" : "column"}>
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  sx={{ flex: 1 }}
                  label="Kart Sahibinin Adı Soyadı"
                  control={control}
                  id="cardHolderName"
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <FormatInputControl
                  sx={{ flex: 1 }}
                  label="Kart Numarası"
                  control={control}
                  id="cardNumber"
                  format="#### #### #### ####"
                  allowEmptyFormatting
                  mask="_"
                />
              </FormControl>
            </Stack>

            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction={isDesktop ? "row" : "column"}>
              <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
                <FormatInputControl
                  label="Son Kullanma Tarihi"
                  control={control}
                  id="lastUsingDate"
                  format="## / ##"
                  allowEmptyFormatting
                  mask="_"
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
                <InputControl
                  sx={{ flex: 1 }}
                  label="CVV2"
                  control={control}
                  id="cvv"
                  numeric
                  maxLength={3}
                />
              </FormControl>
            </Stack>
            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction={isDesktop ? "row" : "column"}>
              <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
                <InputControl
                  sx={{ flex: 1 }}
                  label="Sipariş Numarası"
                  control={control}
                  id="orderId"
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
                <NumericFormatInputControl
                  sx={{ flex: 1 }}
                  label="Çekilecek Tutar"
                  control={control}
                  id="totalAmount"
                  adornmentText="TL"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                />
              </FormControl>
            </Stack>
            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction={isDesktop ? "row" : "column"}>
              <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
                {installmentCounts && (
                  <SelectControl
                    id="installmentCount"
                    control={control}
                    label="Taksit Sayısı"
                    items={installmentCounts}
                  />
                )}
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
                {currencyCodeList && (
                  <SelectControl
                    id="currency"
                    control={control}
                    label="Para Birimi"
                    items={currencyCodeList}
                  />
                )}
              </FormControl>
            </Stack>
            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction={isDesktop ? "row" : "column"}>
              <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
                {paymentModelList && (
                  <SelectControl
                    sx={{ mr: isDesktop ? 1 : 0 }}
                    id="use3D"
                    control={control}
                    label="Ödeme Modeli"
                    items={paymentModelList}
                  />
                )}
              </FormControl>
            </Stack>
            <Stack direction={isDesktop ? "row" : "column"} justifyContent="flex-end" width={isDesktop ? 800 : 'auto'}>
              {!!showCreate && (
                <Button
                  sx={{ width: 100 }}
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                  text={"Öde"}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {html && (
        <BaseModal onClose={() => setIsHtmlOpen(false)} title={''} isOpen={isHtmlOpen}>
          <div dangerouslySetInnerHTML={{__html: html}}></div>
        </BaseModal>
      )}
    </>
  );
};
