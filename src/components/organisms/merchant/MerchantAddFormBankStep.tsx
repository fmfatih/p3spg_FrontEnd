import { InputControl, SelectControl } from "../../molecules";
import { FormControl, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
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
  merchant?: IMerchant;
};

export const MerchantAddFormBankStep = ({
  merchant,
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

    if (merchant && merchant?.id > 0) {
      merchantBankUpdate(
        { ...request, id: merchant?.id || 0 },
        {
          onSuccess(data) {
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
        currencyCode: merchant?.currencyCode || "949",
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
                <SelectControl
                  sx={{ mr: isDesktop ? 3 : 0 }}
                  id="currencyCode"
                  control={control}
                  label="Para Birimi"
                  items={currencyCodeList}
                  defaultValue="949"
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
                <SelectControl
                  sx={{ mr: isDesktop ? 3 : 0 }}
                  id="bankCode"
                  control={control}
                  label="Banka Adı"
                  items={bankList}
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
