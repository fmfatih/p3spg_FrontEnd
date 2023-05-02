import {
  PhoneControl,
  InputControl,
  FormatInputControl,
} from "../../molecules";
import {
  FormControl,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Button, Loading } from "../../atoms";
import {
  IMerchantPartnerAddRequest,
  useMerchantPartnerAdd,
  IMerchant,
  useMerchantPartnerUpdate,
} from "../../../hooks";
import { useEffect } from "react";
import { useUserMerchantId } from "./Merchant.state";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import {
  partnerStepFormSchema,
  PartnerStepFormValuesType,
  partnerStepInitialValues,
} from "./_formTypes";
import { zodResolver } from "@hookform/resolvers/zod";

type MerchantAddFormCompanyStepProps = {
  onNext: () => void;
  merchant?: any;
};

export const MerchantAddFormPartnerStep = ({
  merchant,
  onNext,
}: MerchantAddFormCompanyStepProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mutate: addMerchantPartner, isLoading } = useMerchantPartnerAdd();
  const { mutate: updateMerchantPartner, isUpdateLoading } =
    useMerchantPartnerUpdate();

  const [merchantId] = useUserMerchantId();

  const { control, reset, handleSubmit } = useForm<PartnerStepFormValuesType>({
    resolver: zodResolver(partnerStepFormSchema),
    defaultValues: partnerStepInitialValues,
  });

  const setSnackbar = useSetSnackBar();

  const onSubmit = (formValues: PartnerStepFormValuesType) => {
    const request: IMerchantPartnerAddRequest = {
      merchantId: merchantId,
      partnerOneFullName: formValues.partnerOneFullName,
      partnerOneCitizenNumber: formValues.partnerOneCitizenNumber,
      partnerOneMobilePhone: formValues.partnerOneMobilePhone,
      partnerTwoFullName: formValues.partnerTwoFullName,
      partnerTwoCitizenNumber: formValues.partnerTwoCitizenNumber,
      partnerTwoMobilePhone: formValues.partnerTwoMobilePhone,
    };

    if (merchant && merchant?.id > 0) {
      updateMerchantPartner(
        { ...request, id: merchant?.id || 0 },
        {
          onSuccess(data) {
            if (data.isSuccess) {
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
        }
      );
    } else {
      addMerchantPartner(request, {
        onSuccess(data) {
          if (data.isSuccess) {
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
        partnerOneFullName: merchant?.partnerOneFullName,
        partnerOneCitizenNumber: merchant?.partnerOneCitizenNumber || "",
        partnerOneMobilePhone: merchant?.partnerOneMobilePhone || "",
        partnerTwoFullName: merchant?.partnerTwoFullName || "",
        partnerTwoCitizenNumber: merchant?.partnerTwoCitizenNumber || "",
        partnerTwoMobilePhone: merchant?.partnerTwoMobilePhone || "",
      });
    }
  }, [merchant, reset]);

  return (
    <>
      {isLoading && <Loading />}
      <Stack pt={3} flex={1} justifyContent="space-between">
        <Stack px={isDesktop ? 4 : 2} mb={3} spacing={3}>
          <Typography color="text.default" variant="overline">
            Ortak-1 Bilgileri
          </Typography>
          <Stack
            width={isDesktop ? 800 : "auto"}
            spacing={3}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="partnerOneFullName"
                control={control}
                label="Ortak 1 Ad Soyad"
              />
            </FormControl>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="partnerOneCitizenNumber"
                control={control}
                label="Ortak 1 Kimlik Numarası"
                numeric
                maxLength={11}
              />
            </FormControl>
          </Stack>
          <Stack
            width={isDesktop ? 800 : "auto"}
            spacing={3}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <FormatInputControl
                sx={{ mr: isDesktop ? 4 : 0 }}
                defaultValue=""
                label="Ortak 1 Telefon Numarası"
                control={control}
                id="partnerOneMobilePhone"
                allowEmptyFormatting
                mask="_"
                format="0(###) ### ## ##"
              />
            </FormControl>
          </Stack>
          <Typography color="text.default" variant="overline">
            Ortak-2 Bilgileri
          </Typography>
          <Stack
            width={isDesktop ? 800 : "auto"}
            spacing={4}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="partnerTwoFullName"
                control={control}
                label="Ortak 2 Ad Soyad"
              />
            </FormControl>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="partnerTwoCitizenNumber"
                control={control}
                label="Ortak 2 Kimlik Numarası"
                numeric
                maxLength={11}
              />
            </FormControl>
          </Stack>
          <Stack
            width={isDesktop ? 800 : "auto"}
            spacing={3}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <FormatInputControl
                sx={{ mr: isDesktop ? 4 : 0 }}
                defaultValue=""
                label="Ortak 2 Telefon Numarası"
                control={control}
                id="partnerTwoMobilePhone"
                allowEmptyFormatting
                mask="_"
                format="0(###) ### ## ##"
              />
            </FormControl>
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
              text="Devam"
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
