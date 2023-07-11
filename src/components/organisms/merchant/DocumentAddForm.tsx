// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  useDocumentAdd,
  useDocumentDelete,
  useGetAllMerchantList,
  useGetDocumentDocumentSettings,
  useGetMerchantTypeList,
  useGetPosTypeList,
} from "../../../hooks";
import { useUserInfo } from "../../../store/User.state";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  Autocomplete,
  TextField,
  Checkbox,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Button, Loading } from "../../atoms";
import { Stack } from "@mui/system";
import { DocumentFormValuesType, documentFormSchema } from "./_formTypes";
import {
  CheckboxesControl,
  InputControl,
  RadioButtonsControl,
  SelectControl,
  DatePickerControl,
  FormatInputControl,
} from "../../molecules";
import { DocumentUpload } from "../../upload";
import { useLocation } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";

export const DocumentAddForm = () => {
  const theme = useTheme();
  const { data: rawMerchantList } = useGetAllMerchantList();
  //     const { data: rawMerchantTypes, isLoading: isMerchantTypeLoading } =
  // useGetMerchantTypeList({});
  // const { data: rawPosTypes, isLoading: isPosTypeLoading } = useGetPosTypeList(
  //     {}
  //   );
  const merchant = useLocation().state as unknown as IMerchant | undefined;
  const { mutate: getDocumentDocumentSettings, isLoading } =
    useGetDocumentDocumentSettings();
  const { mutate: documentAdd } = useDocumentAdd();
  const { mutate: deleteDocument } = useDocumentDelete();
  const [userInfo] = useUserInfo();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const setSnackbar = useSetSnackBar();
  // const { handleSubmit, control, setValue, getValues } =
  // useForm<DocumentFormValuesType>({
  //   resolver: zodResolver(documentFormSchema),
  // });

  const { handleSubmit, control, setValue, getValues, watch } = useForm<
    DocumentFormValuesType & {
      documents: Array<{ label: string; file: File; documentInfoId: number }>;
    }
  >({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      files: [],
      companyType: 0,
      posType: 0,
    },
  });
  const [selectResponse, setSelectResponse] = useState([]);
  const [allFile, setAllFile] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  

  const merchantId = watch("merchantId");
  const taxNumber = watch("taxNumber");
  const companyType = Number(watch("companyType"));
  const posType = Number(watch("posType"));

console.log(taxNumber);


  useEffect(() => {
    setSelectedMerchant(merchantId);
  }, [merchantId]);

  useEffect(() => {
    if (companyType && posType) {
      const req = {
        companyType: companyType,
        posType: posType,
      };

      getDocumentDocumentSettings(req, {
        onSuccess: (response) => {
          setSelectResponse(response);
          remove();
          if (response?.data && Array.isArray(response.data)) {
            const items = [];
            response.data.forEach((item) => {
              if (item?.documentType) {
                const tempOBJ: any = {
                  key: "documentType",
                  label: item.documentType,
                  documentInfoId: item.id,
                  type: "string",
                  value: "",
                  mandatory: item.mandatory
                };
                console.log(tempOBJ);
                
                append(tempOBJ);
                items.push(tempOBJ)
              }
            });
            setAllFile(items)
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

  console.log(merchantId);
  

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

    console.log(allFile, data.files);

    const dto = data.files.map((item) => ({
      companyType: Number(data.companyType),
      posType: Number(data.posType),
      taxNumber:taxNumber || "",
      merchantId: merchantId.value || 0,
      idNumber: data.idNumber,
      documentInfoId: item.documentInfoId,
    }));

    const formData = new FormData();

    data.files.forEach((item, index) => {
      formData.append(`files`, item.file);
    });

    let hasAllFile = true;
    allFile.forEach(element => {
      if(element.mandatory) {
        const file = data.files.find(file => file.documentInfoId === element.documentInfoId);

        if(!file) {
          hasAllFile = false;
          return;
        }
      }
    });
    

    if(!hasAllFile) {
      setSnackbar({
        severity: "error",
        isOpen: true,
        description: "* ile belirtilen zorunlu alanları doldurun.",
      });
      return;
    }


    formData.append("dto", JSON.stringify(dto));

    documentAdd(formData, {
      onSuccess: (data) => {
        setLoading(false);
        if (data.isSuccess) {
          setSnackbar({
            severity: "success",
            isOpen: true,
            description: "Dosyalar başarıyla yüklendi",
          });
        } else {
          setSnackbar({
            severity: "error",
            isOpen: true,
            description: data.message || "Dosya yüklenirken bir hata oluştu",
          });
        }
      },
      onError: (error) => {
        setLoading(false);
        setSnackbar({
          severity: "error",
          isOpen: true,
          description: "İşlem sırasında bir hata oluştu",
        });
      },
    });
  };

 

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Stack flex={1} justifyContent="space-between">
          <Stack flex={1} p={2}>
            <Stack spacing={4}>
              <Stack
                spacing={3}
                direction="row"
                width={isDesktop ? 800 : "auto"}
              >
                <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                  {merchantList && (
                    <Controller
                      control={control}
                      name="merchantId"
                      render={({ field, fieldState }) => {
                        return (
                          <>
                            <Autocomplete
                              sx={{ mr: isDesktop ? 2 : 0 }}
                              id="merchantId"
                          
                              onChange={(event, selectedValue) => {
                                // setValue("merchantId", selectedValue);
                                setValue("merchantId", selectedValue)
                                field.onChange(selectedValue);
                              }}
                              options={merchantList}
                              defaultValue={selectedMerchant}
                              getOptionLabel={(option: {
                                label: string;
                                value: number;
                              }) => option.label}
                              renderInput={(params) => (
                                <TextField {...params} label="Üye İşyeri"   error={fieldState.invalid}/>
                              )}
                            />
                          </>
                        );
                      }}
                    />
                  )}
                </FormControl>
                <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                  <FormatInputControl
                    sx={{ flex: 1 }}
                    label="VKN"
                    name="taxNumber"
                    // disabled={merchantId}
                    control={control}
                    id="taxNumber"
                    format="##########"
                    allowEmptyFormatting
                    mask="_"
                  />
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
                <Stack sx={{ width: isDesktop ? "800px" : "100%" }}>
                  {fields?.length ? (
                    <Stack direction="row" flexWrap="wrap">
                      {fields?.map((field, index) => {
                        return (
                          <Box key={field.id} my={1} mr={0} flex="100%">
                            <DocumentUpload
                              control={control}
                              label={field.label}
                              mandatory={field.mandatory}
                              documentInfoId={field.documentInfoId}
                              setValue={setValue}
                              getValues={getValues}
                              // onDelete={handleDelete}
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : null}
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
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};
