import {
  InputControl,
  PhoneControl,
  SelectControl,
  FormatInputControl,
} from "../../molecules";
import {
  FormControl,
  Stack,
  useMediaQuery,
  useTheme,
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Button, Loading } from "../../atoms";
import { useEffect, useMemo, useState } from "react";
import {
  IMerchant,
  useGetCityList,
  useGetDistrictList,
  useMerchantAddressAdd,
  useMerchantAddressUpdate,
} from "../../../hooks";
import { useUserMerchantId } from "./Merchant.state";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  secondStepFormSchema,
  SecondStepFormValuesType,
  secondStepInitialValues,
} from "./_formTypes";

type MerchantAddFormCompanyStepProps = {
  onNext: () => void;
  onBack: () => void;
  merchant?: any;
  allData?: any;
  setAllData?: any;
};

export const MerchantAddFormAddressStep = ({
  merchant,
  onNext,
  onBack,
  allData,
  setAllData,
}: MerchantAddFormCompanyStepProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { data: rawCityList } = useGetCityList({});
  const setSnackbar = useSetSnackBar();
  const { mutate: addMerchantAddress, isLoading } = useMerchantAddressAdd();
  const { mutate: updateMerchantAddress, isUpdateLoading } =
    useMerchantAddressUpdate();
  const [selectedCity, setSelectedCity] = useState(null as any);
  const [selectedDistrict, setSelectedDistrict] = useState(null as any);

  const [districtList, setDistrictList] = useState([]);
  const { mutate: getDistrictList } = useGetDistrictList();
  const { control, handleSubmit, watch, reset, setValue, getValues } =
    useForm<SecondStepFormValuesType>({
      resolver: zodResolver(secondStepFormSchema),
      defaultValues: secondStepInitialValues,
    });
  //const selectedCity = watch("cityId");
  const [merchantId] = useUserMerchantId();

  useEffect(() => {
    selectedCity &&
      getDistrictList(
        { cityCode: `${selectedCity.value}` },
        {
          onSuccess(data) {
            const tempData = data?.data?.map(
              (item: { name: string; id: string }) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              }
            );
            setDistrictList(tempData);
       
            if(tempData) {
              const foundDistrict = tempData?.find((d: { label: string; value: string }) => Number(d.value) === merchant.districtId);
              if (foundDistrict) {
                setSelectedDistrict(foundDistrict?.value);
              }
            }
          },
        }
      );
  }, [getDistrictList, selectedCity, setSelectedCity]);

  const cityList = useMemo(() => {
    return rawCityList?.data?.map((city: { name: string; id: number }) => {
      return {
        label: city.name,
        value: `${city.id}`,
      };
    });

  }, [rawCityList?.data]);
  useEffect(() => {
    if(cityList) {
      const foundCity = cityList?.find((city: { label: string; value: string }) => city.value === merchant.cityCode?.toString() || merchant.cityId?.toString());
      if (foundCity) {
        setSelectedCity(foundCity);
      }
    }
  }, [cityList, setSelectedCity, merchant.cityCode]);
  

  const onSubmit = ({
    zipCode,
    phoneNumber,
    //secondaryPhoneNumber,
    faxNumber,
    mobilePhoneNumber,
    emailAddress1,
    emailAddress2,
    districtId,
    cityId,
    addressLine1,
    addressLine2,
  }: SecondStepFormValuesType) => {
    const request = {
      merchantId,
      addressLine1,
      //secondaryPhoneNumber: `${secondaryPhoneNumber}`,
      phoneNumber: phoneNumber.length === 10 ? phoneNumber : "",
      mobilePhoneNumber:
        mobilePhoneNumber.length === 10 ? mobilePhoneNumber : "",
      faxNumber: faxNumber.length === 10 ? faxNumber : "",
      addressLine2: addressLine2 || "",
      cityId: selectedCity ? Number(selectedCity.value) : 0,
      districtId: Number(districtId),
      zipCode,
      emailAddress1: emailAddress1?.length > 0 ? emailAddress1 : "",
      emailAddress2: emailAddress2?.length > 0 ? emailAddress2 : "",
      countryCode: "TR",
      primaryAddress: true,
    };
    if ((merchant && merchant?.id > 0 && allData?.addressLine1) || (allData && allData?.addressLine1)) {
      updateMerchantAddress(
        { ...request, id: merchant?.id || 0  },
        {
          onSuccess(data) {
            if (data.isSuccess) {
              setAllData({ ...allData, ...request });
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
      addMerchantAddress(request, {
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
      const foundCity = cityList?.find(city => city.value === merchant?.cityCode?.toString());
      if (foundCity) {
        setSelectedCity(foundCity);
      }
      setSelectedDistrict(merchant?.districtId);
      setValue("districtId", selectedDistrict?.toString());
      reset({
        addressLine1: merchant?.addressLine1,
        cityId: foundCity?.id || selectedCity,
        mobilePhoneNumber: merchant?.mobilePhoneNumber,
        zipCode: merchant?.zipCode,
        emailAddress1: merchant?.emailAddress1,
        addressLine2: merchant?.addressLine2,
        districtId: merchant?.districtId,
        emailAddress2: merchant?.emailAddress2 || "",
        faxNumber: merchant?.faxNumber,
        phoneNumber: merchant?.phoneNumber,
        //secondaryPhoneNumber: merchant.secondaryPhoneNumber,
      });
    }
  }, [merchant, reset]);
  return (
    <>
      {isLoading && <Loading />}
      <Stack pt={3} flex={1} justifyContent="space-between">
        <Stack pb={3} px={isDesktop ? 4 : 1} spacing={3}>
          <FormControl sx={{ width: isDesktop ? 800 : "100%" }}>
            <InputControl
              sx={{ mr: isDesktop ? 3 : 0 }}
              id="addressLine1"
              control={control}
              label="Adres"
            />
          </FormControl>
          <FormControl sx={{ width: isDesktop ? 800 : "100%" }}>
            <InputControl
              sx={{ mr: isDesktop ? 3 : 0 }}
              id="addressLine2"
              control={control}
              label="Adres Satırı 2"
            />
          </FormControl>
          <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              {cityList && (
           <Controller
           control={control}
           name="cityId"
           render={({
             field: { onChange, value },
             fieldState: { error },
           }) => {
             return (
               <Autocomplete
                 sx={{ mr: isDesktop ? 3 : 0 }}
                 id="cityId"
                 options={cityList}
                 value={selectedCity || null}
                 onChange={(event, selectedValue) => {
                   setSelectedCity(selectedValue);
                   onChange(selectedValue ? selectedValue.value : "");
                 }}
                 getOptionLabel={(option: {
                   label: string;
                   value: number;
                 }) => option.label}
                 renderInput={(params) => (
                   <TextField {...params} label="İl" />
                 )}
               />
             );
           }}
         />
         
              )}
            </FormControl>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              {districtList ? (
                <Controller
                  name="districtId"
                  control={control}
                  defaultValue={selectedDistrict}
                  render={({ field: { onChange, value } }) => {
                    const selectedDistrictItem = districtList?.find(
                      (option) => option.value === value
                    );

                    return (
                      <Autocomplete
                        id="districtId"
                        options={districtList}
                        getOptionSelected={(option, value) =>
                          option.value === value
                        }
                        sx={{ mr: isDesktop ? 3 : 0 }}
                        getOptionLabel={(option) => option.label}
                        value={selectedDistrictItem || null}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue.value : "");
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="İlçe" />
                        )}
                      />
                    );
                  }}
                />
              ) : (
                <SelectControl
                  sx={{ mr: isDesktop ? 3 : 0 }}
                  id="districtId"
                  control={control}
                  label="İlçe"
                  items={[{ label: "Şehir Seçimi Yapmalısınız", value: "-1" }]}
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
              <FormatInputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                defaultValue=""
                label="Cep Telefonu Numarası"
                control={control}
                id="mobilePhoneNumber"
                allowEmptyFormatting
                mask="_"
                format="0(###) ### ## ##"
              />
            </FormControl>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="zipCode"
                control={control}
                label="Posta Kodu"
              />
            </FormControl>
          </Stack>
          <Stack
            width={isDesktop ? 800 : "auto"}
            spacing={3}
            direction={isDesktop ? "row" : "column"}
          >
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="emailAddress1"
                control={control}
                label="E-Posta"
              />
            </FormControl>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <InputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                id="emailAddress2"
                control={control}
                label="2. E-Posta"
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
                sx={{ mr: isDesktop ? 3 : 0 }}
                defaultValue=""
                label="Fax Numarası"
                control={control}
                id="faxNumber"
                allowEmptyFormatting
                mask="_"
                format="0(###) ### ## ##"
              />
            </FormControl>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
              <FormatInputControl
                sx={{ mr: isDesktop ? 3 : 0 }}
                defaultValue=""
                label="Sabit Telefon"
                control={control}
                id="phoneNumber"
                allowEmptyFormatting
                mask="_"
                format="0(###) ### ## ##"
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
