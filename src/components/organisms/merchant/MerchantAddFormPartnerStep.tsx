import {
  PhoneControl,
  InputControl,
  FormatInputControl,
} from "../../molecules";
import {
  Box,
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
import React from "react";

type MerchantAddFormCompanyStepProps = {
  onNext: () => void;
  onBack: () => void;
  merchant?: any;
  allData?: any;
  setAllData?: any;
};

export const MerchantAddFormPartnerStep = ({
  merchant,
  onNext,
  onBack,
  allData,
  setAllData,
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
      officialFullName: formValues.officialFullName,
      officialCitizenNumber: formValues.officialCitizenNumber,
      officialMobilePhone: formValues.officialMobilePhone,
      partnerOneFullName: formValues.partnerOneFullName,
     partnerOneCitizenNumber: formValues.partnerOneCitizenNumber,
      partnerOneMobilePhone: formValues.partnerOneMobilePhone,
      partnerTwoFullName: formValues.partnerTwoFullName,
      partnerTwoCitizenNumber: formValues.partnerTwoCitizenNumber,
      partnerTwoMobilePhone: formValues.partnerTwoMobilePhone,
      partnerThreeFullName: formValues.partnerThreeFullName,
      partnerThreeCitizenNumber: formValues.partnerThreeCitizenNumber,
      partnerThreeMobilePhone: formValues.partnerThreeMobilePhone,
      partnerFourFullName: formValues.partnerFourFullName,
      partnerFourCitizenNumber: formValues.partnerFourCitizenNumber,
      partnerFourMobilePhone: formValues.partnerFourMobilePhone,
      partnerFiveFullName: formValues.partnerFiveFullName,
      partnerFiveCitizenNumber: formValues.partnerFiveCitizenNumber,
      partnerFiveMobilePhone: formValues.partnerFiveMobilePhone,
    };

    setAllData({ ...allData, ...request });
console.log(allData);

    if ((merchant && merchant?.id > 0 && allData?.officialFullName) || (allData && allData?.officialFullName)) {
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
        officialFullName: merchant?.officialFullName || "",
        officialCitizenNumber:merchant?.officialCitizenNumber || "",
        officialMobilePhone: merchant?.officialMobilePhone || "",
        partnerOneFullName: merchant?.partnerOneFullName || "",
       partnerOneCitizenNumber: merchant?.partnerOneCitizenNumber || "",
        partnerOneMobilePhone: merchant?.partnerOneMobilePhone || "",
        partnerTwoFullName: merchant?.partnerTwoFullName || "",
        partnerTwoCitizenNumber: merchant?.partnerTwoCitizenNumber || "",
        partnerTwoMobilePhone: merchant?.partnerTwoMobilePhone || "",

        partnerThreeFullName: merchant?.partnerThreeFullName || "",
        partnerThreeCitizenNumber: merchant?.partnerThreeCitizenNumber || "",
        partnerThreeMobilePhone: merchant?.partnerThreeMobilePhone || "",

        partnerFourFullName: merchant?.partnerFourFullName || "",
        partnerFourCitizenNumber: merchant?.partnerFourCitizenNumber || "",
        partnerFourMobilePhone: merchant?.partnerFourMobilePhone || "",

        partnerFiveFullName: merchant?.partnerFiveFullName || "",
        partnerFiveCitizenNumber: merchant?.partnerFiveCitizenNumber || "",
        partnerFiveMobilePhone: merchant?.partnerFiveMobilePhone || "",
      });
    }
  }, [merchant, reset]);

  const PartnerInput = ({ id, name, citizenNumber, mobilePhone }) => (
    <>
      <Typography color="text.default" variant="overline">
        Ortak-{id} Bilgileri
      </Typography>
      <Stack
        width={isDesktop ? 800 : "auto"}
        spacing={4}
        direction={isDesktop ? "row" : "column"}
      >
        <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
          <InputControl
            sx={{ mr: isDesktop ? 3 : 0 }}
            id={name}
            control={control}
            label={`Ortak ${id} Ad Soyad`}
          />
        </FormControl>
        <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
          <InputControl
            sx={{ mr: isDesktop ? 3 : 0 }}
            id={citizenNumber}
            control={control}
            label={`Ortak ${id} Kimlik Numarası`}
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
            label={`Ortak ${id} Telefon Numarası`}
            control={control}
            id={mobilePhone}
            allowEmptyFormatting
            mask="_"
            format="0(###) ### ## ##"
          />
        </FormControl>
      </Stack>
    </>
  );
  const [partnersCount, setPartnersCount] = React.useState(0);

  const addPartner = () => {
    if (partnersCount < 5) {
      setPartnersCount(partnersCount + 1);
    } else {
      setSnackbar({
        severity: "error",
        isOpen: true,
        description: "5 ortaktan fazla ekleyemezsiniz",
      });
    }
  };

  const renderPartners = () => {
    const names = [
      "partnerOneFullName",
      "partnerTwoFullName",
      "partnerThreeFullName",
      "partnerFourFullName",
      "partnerFiveFullName",
    ];
    const citizenNumber = [
      "partnerOneCitizenNumber",
      "partnerTwoCitizenNumber",
      "partnerThreeCitizenNumber",
      "partnerFourCitizenNumber",
      "partnerFiveCitizenNumber",
    ];
    const mobilePhone = [
      "partnerOneMobilePhone",
      "partnerTwoMobilePhone",
      "partnerThreeMobilePhone",
      "partnerFourMobilePhone",
      "partnerFiveMobilePhone",
    ];
    let partners = [];
    for (let i = 0; i < partnersCount; i++) {
      partners.push(
        <PartnerInput
          id={i + 1}
          name={names[i]}
          citizenNumber={citizenNumber[i]}
          mobilePhone={mobilePhone[i]}
        />
      );
    }
    return partners;
  };

  return (
    <>
      {isLoading && <Loading />}
      <Stack pt={3} flex={1} justifyContent="space-between">
        <Stack px={isDesktop ? 4 : 2} mb={3} spacing={3}>
          <Typography color="text.default" variant="overline">
            Yetkili Kişi Bilgileri
          </Typography>
          <Stack
            width={isDesktop ? 800 : "auto"}
            spacing={3}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="officialFullName"
                control={control}
                label="Yetkili KişiAd Soyad"
              />
            </FormControl>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="officialCitizenNumber"
                control={control}
                label="Yetkili KişiKimlik Numarası"
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
                label="Yetkili Kişi Telefon Numarası"
                control={control}
                id="officialMobilePhone"
                allowEmptyFormatting
                mask="_"
                format="0(###) ### ## ##"
              />
            </FormControl>
          </Stack>
          {renderPartners()}
          {/* <Stack
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
          </Stack> */}
          <Stack
            borderTop="1px solid #E6E9ED"
            direction="row"
            py={2}
            px={4}
            justifyContent="flex-end"
            spacing={2}
          >
            <Button
              variant="contained"
              text="Ortak Ekle"
              onClick={addPartner}
            ></Button>
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
      </Stack>
    </>
  );
};
