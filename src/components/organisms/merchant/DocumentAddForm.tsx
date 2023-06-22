// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useGetAllMerchantList, useGetDocumentDocumentSettings, useGetMerchantTypeList, useGetPosTypeList } from '../../../hooks';
import { useUserInfo } from "../../../store/User.state";
import React, { useEffect, useMemo, useState } from 'react'
import { useForm, Controller,useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, Autocomplete, TextField, Checkbox, useTheme, useMediaQuery, Box, Typography, CircularProgress } from "@mui/material";
import { Button, Loading } from "../../atoms";
import { Stack } from "@mui/system";
import { DocumentFormValuesType, documentFormSchema } from './_formTypes';
import {
    CheckboxesControl,
    InputControl,
    RadioButtonsControl,
    SelectControl,
    DatePickerControl,
  } from "../../molecules";
import { DocumentUpload } from '../../upload';



export const DocumentAddForm = () => {
    const theme = useTheme();
    const { data: rawMerchantList } = useGetAllMerchantList();
//     const { data: rawMerchantTypes, isLoading: isMerchantTypeLoading } =
// useGetMerchantTypeList({});
// const { data: rawPosTypes, isLoading: isPosTypeLoading } = useGetPosTypeList(
//     {}
//   );
  const { mutate: getDocumentDocumentSettings, isLoading } = useGetDocumentDocumentSettings();

    const [userInfo] = useUserInfo();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [loading, setLoading] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
    // const { handleSubmit, control, setValue, getValues } =
    // useForm<DocumentFormValuesType>({
    //   resolver: zodResolver(documentFormSchema),
    // });

    const { handleSubmit, control, setValue, getValues,watch } = useForm<DocumentFormValuesType & { documents: Array<{ label: string; file: File }> }>({
      resolver: zodResolver(documentFormSchema),
      defaultValues: {
        companyType: 0,
        posType: 0,
        // diğer form alanları için varsayılan değerler buraya eklenebilir
      },
    });

    const { fields, append,remove } = useFieldArray({
      control,
      name: 'documents',
    });

    console.log(fields);
    
    const companyType = Number(watch('companyType'));
    const posType = Number(watch('posType'));

    
    useEffect(() => {
      if (companyType && posType) {
        const req = {
          companyType: companyType,
          posType: posType,
        };
    
        getDocumentDocumentSettings(req, {
          onSuccess: (response) => {
            remove();
              if (response?.data && Array.isArray(response.data)) {
                
                  
                  response.data.forEach(item => {
                 
                      if (item?.documentType) {
                          const tempOBJ: any = {
                              key: "documentType",
                              label: item.documentType,
                              type: "string",
                              value: "",
                          };
                          append(tempOBJ);
                      }
                  });
              }
          },
      });
      }
    }, [
      append,
      getDocumentDocumentSettings,
      remove,
      watch,
      companyType,
      posType,
    ]);
    
    
  



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

const posTypes = useMemo(() => {
  const updatedPosTypes = [
    {
      label: "Sanal POS Başvuru Evrakları",
      value: "Sanal Pos",
    },
    {
      label: "Mobil POS Başvuru Evrakları",
      value: "Fiziksel Pos",
    },
    {
      label: "Fiziksel POS Başvuru Evrakları",
      value: "Mobil Pos",
    },
  ];

  return updatedPosTypes.map((posType, index) => {
    return {
      ...posType,
      value: index + 1,
    };
  });
}, []);




const merchantTypes = useMemo(() => {
  const updatedMerchantTypes = [
    {
      label: "Şahıs Şirketi",
      value: 1,
    },
    {
      label: "Şirket",
      value: 2,
    },
  ];

  return updatedMerchantTypes.map((merchantType) => {
    return {
      label: merchantType.label,
      value: Number(merchantType.value),
    };
  });
}, []);


      

      const onSubmit = async (data) => {
        setLoading(true);
        const fileBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(data.files[0]); // Veriyi 'files' alanından alıyoruz
          setLoading(false);
        });
      
        const request = {
          file: fileBase64,
          merchantType: data.merchantType,
          merchantId: data.merchantId,
          posList: data.posList
        };
      
        // request'ı kullanarak API çağrısı yapabilirsiniz
      };
      
      

  return (
   <>
   {isLoading ? (
  <Loading />
) : (
  <Stack flex={1} justifyContent="space-between">
  <Stack flex={1} p={2}>
    <Stack spacing={4}>
      <Stack spacing={3} direction="row" width={isDesktop ? 800 : 'auto'}>
        <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
          {merchantList && (
            <Controller
              control={control}
              name="merchantId"
              render={() => {
                return (
                  <>
                    <Autocomplete
                      sx={{ mr: isDesktop ? 2 : 0 }}
                      id="merchantId"
                      onChange={(event, selectedValue) => {
                        setValue("merchantId", selectedValue);
                      }}
                      options={merchantList}
                      //defaultValue={selectedMerchant}
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

      <Stack
          width={isDesktop ? 800 : "auto"}
          spacing={4}
          direction={isDesktop ? "row" : "column"}
        >
          <Box sx={{ width: isDesktop ? "50%" : "100%" }}>
            <Typography color="text.default" variant="overline">
              İşyeri Tipi
            </Typography>
            <RadioButtonsControl
  row
  id="companyType"
  control={control}
  items={merchantTypes}
/>

          </Box>

          <Box sx={{ width: isDesktop ? "50%" : "100%" }}>
            <Typography color="text.default" variant="overline">
            POS Tipi
            </Typography>
       
            <RadioButtonsControl
  row
  id="posType"
  control={control}
  items={posTypes}
/>
    
          </Box>
        </Stack>
        <Stack spacing={3}>
<Stack sx={{ width: isDesktop ? "50%" : '100%' }}>


{/* {fields?.length ? (
  <Stack direction="row" flexWrap="wrap">
    {fields?.map((field, index) => {
      return (
        <Box key={field.id} my={1} mr={3} flex="44%">
          <InputControl
            defaultValue=""
            sx={{ width: "100%" }}
            id={`parameters.${index}.value`}
            label={field.label} 
            control={control}
          />
        </Box>
      );
    })}
  </Stack>
) : null} */}

{fields?.length ? (
  <Stack direction="row" flexWrap="wrap">
    {fields?.map((field, index) => {
      return (
        <Box key={field.id} my={1} mr={3} flex="44%">
          <DocumentUpload
            control={control}
            label={field.label}
          />
        </Box>
      );
    })}
  </Stack>
) : null}

</Stack>
{/* <DocumentUpload control={control}/> */}

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
      </Stack>
      </Stack>
      </Stack>

)}
   
          </>
  )

}

