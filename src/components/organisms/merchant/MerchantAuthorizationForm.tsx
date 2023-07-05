import {
  useAddMerchantVPos,
  useGetMemberVPosList,
  useGetAllMerchantList,
  useAuthorization,
  useGetMerchantVPosGetListById,
  useTestNonsecure,
  useMerchantVPosUpdate,
} from '../../../hooks';
import { Autocomplete, Box, FormControl, Stack, Switch, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo, useEffect, useState } from 'react';
import { Button, Loading } from '../../atoms';
import { InputControl, SelectControl, SwitchControl } from '../../molecules';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSetSnackBar } from '../../../store/Snackbar.state';
import { zodResolver } from '@hookform/resolvers/zod';
import { merchantAuthFormSchema, MerchantAuthFormValuesType, merchantAuthInitialValues } from './_formTypes';
import { useUserInfo } from '../../../store/User.state';

export const MerchantAuthorizationForm = () => {
  const theme = useTheme();
  const { showCreate } = useAuthorization();
  const [userInfo] = useUserInfo();
  const [isUpdate, setIsUpdate] = useState(false);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mutate: getMemberVPosList, data: rawMemberVPosList } = useGetMemberVPosList();
  const { mutate: getMerchantVpostGetListById, isLoading: isMerchantVposGetListById } = useGetMerchantVPosGetListById();
  const { data: rawMerchantList, isLoading: isMerchantListLoading } = useGetAllMerchantList();
  const { mutate: addMerchantVPos, isLoading } = useAddMerchantVPos();
  const { mutate: merchantVPosUpdate } = useMerchantVPosUpdate();

  const handleBack = () => navigate('/dashboard');
  const navigate = useNavigate();
  const { control, watch, handleSubmit, setValue, register } = useForm<MerchantAuthFormValuesType>({
    resolver: zodResolver(merchantAuthFormSchema),
    defaultValues: merchantAuthInitialValues,
  });

  const merchantId = watch('merchantId');
  const [listData, setListData] = React.useState([]);

  useEffect(() => {
    getMemberVPosList({
      orderBy: 'CreateDate',
      orderByDesc: true,
      status: 'ACTIVE',
    });
  }, [getMemberVPosList]);

  useEffect(() => {
    if (merchantId) {
      getMerchantVpostGetListById(
        { id: merchantId },
        {
          onSuccess: (newData) => {
            if (newData.isSuccess) {
              setIsUpdate(true);
              // Update listData based on the newData
              const updatedListData = listData.map((data) => {
                // Find the new data for this bankCode
                const newDataForBank = newData.data?.find((newBankData: any) => newBankData.bankCode === data.bankCode);

                // If we have new data for this bank, update the defaultBank
                if (newDataForBank) {
                  return { ...data, defaultBank: newDataForBank.defaultBank };
                } else {
                  // Otherwise, return the original data
                  return data;
                }
              });

              setListData(updatedListData);
            } else {
              setIsUpdate(false);
            }
          },
          onError: () => {
            setSnackbar({
              severity: 'error',
              description: 'İşlem sırasında bir hata oluştu',
              isOpen: true,
            });
          },
        }
      );
    }
  }, [merchantId]);

  const setSnackbar = useSetSnackBar();

  const merchantList = useMemo(() => {
    if (userInfo.merchantId == 0) {
      return rawMerchantList?.data?.map((rawPosType: { merchantName: string; merchantId: number }) => {
        return {
          label: rawPosType.merchantName,
          value: rawPosType.merchantId,
        };
      });
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

  const onSubmit = (data: any) => {
    const merchantId = data?.merchantId;
    // Tüm default banakları al
    let defaultBankArray = listData.map((item) => item.defaultBank);
    // tüm bankCodeları al
    let bankCodeArray = listData.map((item) => item.bankCode);

    let refactoredData = {
      merchantId: merchantId,

      bankCodes: bankCodeArray,
    };

    if (isUpdate) {
      // Update ise defaultBank Ekle.
      refactoredData.defaultBank = defaultBankArray;
      merchantVPosUpdate(refactoredData, {
        onSuccess: (data) => {
          if (data.isSuccess) {
            navigate('/merchant-management/merchant-listing');
            setSnackbar({
              severity: 'success',
              isOpen: true,
              description: data.message,
            });
          } else {
            setSnackbar({
              severity: 'error',
              isOpen: true,
              description: data.message,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: 'error',
            isOpen: true,
            description: 'İşlem sırasında bir hata oluştu',
          });
        },
      });
    } else {
      addMerchantVPos(refactoredData, {
        onSuccess: (data) => {
          if (data.isSuccess) {
            navigate('/merchant-management/merchant-listing');
            setSnackbar({
              severity: 'success',
              isOpen: true,
              description: data.message,
            });
          } else {
            setSnackbar({
              severity: 'error',
              isOpen: true,
              description: data.message,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: 'error',
            isOpen: true,
            description: 'İşlem sırasında bir hata oluştu',
          });
        },
      });
    }
  };

  useEffect(() => {
    if (rawMemberVPosList?.data) {
      // Eğer memberPos varsa, listDataya bas.
      setListData(rawMemberVPosList?.data || []);
    }
  }, [rawMemberVPosList]);

  return (
    <>
      {(isMerchantListLoading || isLoading) && <Loading />}
      <Stack flex={1}>
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction="row">
              <FormControl sx={{ flex: 1 }}>
                {merchantList && (
                  <Controller
                    name="merchantId"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedMerchant = merchantList.find((option) => option.value === value);

                      return (
                        <Autocomplete
                          id="merchantId"
                          options={merchantList}
                          getOptionSelected={(option, value) => option.value === value}
                          getOptionLabel={(option) => option.label}
                          value={selectedMerchant || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : '');
                          }}
                          renderInput={(params) => <TextField {...params} label="İşyeri" />}
                        />
                      );
                    }}
                  />
                )}


         
              </FormControl>
            
            </Stack>
              {isDesktop && <Box sx={{ flex: 1 }} />}
              <Stack direction={isDesktop ? 'row' : 'column'} flexWrap="wrap">
                  {listData?.map((field: any, index: any) => (
                    <Box my={1} mr={isDesktop ? 3 : 0} flex="44%" sx={{ maxWidth: 'sm' }}>
                      <Stack
                        key={index}
                        py={1}
                        px={2}
                        justifyContent="space-between"
                        alignItems="center"
                        flex={1}
                        direction="row"
                        borderRadius={1}
                        border={`1px solid ${!merchantId ? '#ADB6C4' : '#c4c4c4'}`}>
                        <Typography
                          color={!merchantId ? '#ADB6C4' : '#41414D'}>{`${field.bankCode}-${field.bankName}`}</Typography>
                        <Switch
                          disabled={!merchantId}
                          checked={field.defaultBank ? true : false}
                          onChange={(e) => {
                            // Burada tıklanan field'ın defaultBankını, setListData içerisine setleme işlemi
                            const newListData = [...listData];

                            newListData[index].defaultBank = e.target.checked;

                            setListData(newListData);
                          }}
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
          </Stack>
        </Stack>
        <Stack borderTop="1px solid #E6E9ED" py={2} direction="row" justifyContent="flex-end">
          {!!showCreate && (
            <Button onClick={handleSubmit(onSubmit)} variant="contained" text={isUpdate ? 'Güncelle' : 'Kaydet'} />
          )}
          <Button onClick={handleBack} sx={{ mx: 2 }} text={'Iptal'} />
        </Stack>
      </Stack>
    </>
  );
};
