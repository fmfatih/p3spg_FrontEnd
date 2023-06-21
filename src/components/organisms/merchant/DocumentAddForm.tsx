// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useGetAllMerchantList, useGetMerchantTypeList, useGetPosTypeList } from '../../../hooks';
import { useUserInfo } from "../../../store/User.state";
import React, { useMemo, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
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
    const { data: rawMerchantTypes, isLoading: isMerchantTypeLoading } =
useGetMerchantTypeList({});
const { data: rawPosTypes, isLoading: isPosTypeLoading } = useGetPosTypeList(
    {}
  );
    const [userInfo] = useUserInfo();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [loading, setLoading] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
    // const { handleSubmit, control, setValue, getValues } =
    // useForm<DocumentFormValuesType>({
    //   resolver: zodResolver(documentFormSchema),
    // });

    const { handleSubmit, control, setValue,getValues } = useForm<DocumentFormValuesType & { file: File }>({
        resolver: zodResolver(documentFormSchema),
      });




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

    const merchantTypes = useMemo(() => {
        return rawMerchantTypes?.data?.map(
          (merchantType: { value: string; key: number }) => {
            return {
              label: merchantType.value,
              value: `${merchantType.key}`,
            };
          }
        );
      }, [rawMerchantTypes?.data]);

      const posTypes = useMemo(() => {
        return rawPosTypes?.data?.map(
          (rawPosType: { key: string; value: string }) => {
            return {
              label: rawPosType.value,
              value: rawPosType.key,
            };
          }
        );
      }, [rawPosTypes?.data]);

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
                {merchantTypes && (
                  <RadioButtonsControl
                    row
                    id="merchantType"
                    control={control}
                    defaultValue={merchantTypes[0]?.value}
                    items={merchantTypes}
                  />
                )}
              </Box>
              <Box sx={{ width: isDesktop ? "50%" : "100%" }}>
                <Typography color="text.default" variant="overline">
                  POS Tipi
                </Typography>
                {posTypes && (
                  <CheckboxesControl
                    row
                    id="posList"
                    control={control}
                    items={posTypes}
                  />
                )}
              </Box>
            </Stack>
            <Stack spacing={3}>

<DocumentUpload control={control}/>

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
   
  )
}

