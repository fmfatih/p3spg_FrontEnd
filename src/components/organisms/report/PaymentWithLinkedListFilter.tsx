// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  paymentWithLinkedListFormSchema,
  PaymentWithLinkedListValuesType,
  paymentWithLinkedListInitialValues,
} from "./_formTypes";
import { Stack } from "@mui/system";
import {
  FormControl,
  Autocomplete,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Button, Loading } from "../../atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectControl, Table, DeleteConfirmModal } from "../../molecules";
import { downloadExcel } from "../../../util/downloadExcel";

import {
  useGetAllMerchantList,
  useGetLinkedPaymentStatusList,
  IPaymentWithLinkedListRequest,
  useGetPaymentWithLinkedList,
  usePassiveLinkedPayment,
  IPaymentWithLinkedListItem,
  useAuthorization,
} from "../../../hooks";
import { PagingResponse } from "../../../hooks/_types";
import {
  GridColDef,
  GridActionsCellItem,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { useSetSnackBar } from "../../../store/Snackbar.state";

export const PaymentWithLinkedListFilter = () => {
  const { showDelete, showUpdate } = useAuthorization();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { data: rawMerchantList } = useGetAllMerchantList();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { data: rawLinkedPaymentStatusList } = useGetLinkedPaymentStatusList(
    {}
  );
  const {
    mutate: GetPaymentWithLinkedList,
    isLoading: isGetPaymentWithLinkedListLoading,
  } = useGetPaymentWithLinkedList();
  const {
    mutate: passiveLinkedPayment,
    isLoading: isPassiveLinkedPaymentLoading,
  } = usePassiveLinkedPayment();
  const setSnackbar = useSetSnackBar();
  const [tableData, setTableData] = useState<
    PagingResponse<IPaymentWithLinkedListItem[]> | undefined
  >();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState();
  const { control, handleSubmit, setValue, watch } =
    useForm<PaymentWithLinkedListValuesType>({
      resolver: zodResolver(paymentWithLinkedListFormSchema),
      defaultValues: paymentWithLinkedListInitialValues,
    });
  const merchantID = watch("merchantID");
  const status = watch("status");

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

  const paymentstatusList = useMemo(() => {
    return rawLinkedPaymentStatusList?.data?.map(
      (merchant: { key: string; value: string }) => {
        return {
          label: `${merchant.value}`,
          value: merchant.key,
        };
      }
    );
  }, [rawLinkedPaymentStatusList?.data]);

  const onSubmit = (formValues: PaymentWithLinkedListValuesType) => {
    setTableData(undefined);
    const request: IPaymentWithLinkedListRequest = {
      merchantID: formValues.merchantID,
      status: formValues.status,
      size: paginationModel.pageSize,
      page: paginationModel.page,
    };

    GetPaymentWithLinkedList(request, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setTableData(data?.data);
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

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setTableData(undefined);
    const request: IPaymentWithLinkedListRequest = {
      merchantID,
      status,
      size: model.pageSize,
      page: model.page,
    };

    GetPaymentWithLinkedList(request, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setTableData(data?.data);
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

  const deleteRow = React.useCallback(
    (transaction: any) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(transaction.orderId);
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest = { orderId: selectedRowId };

    passiveLinkedPayment(deleteRequest, {
      onSuccess: (data: any) => {
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

    handleCloseDeleteModal();
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          !!showDelete ? (
            <GridActionsCellItem
              label="Sil"
              onClick={deleteRow(params.row)}
              showInMenu
            />
          ) : (
            <></>
          ),
        ],
      },
      { field: "merchantId", headerName: "Üye İşyeri No.", width: 150 },
      { field: "merchantName", headerName: "Üye İşyeri Adı", width: 430 },
      {
        field: "linkCreatedDate",
        headerName: "Link Oluşturma Tarihi",
        width: 220,
      },
      {
        field: "linkExpiredDate",
        headerName: "Link Geçerlilik Tarihi",
        width: 220,
      },
      { field: "status", headerName: "Durum", width: 200 },
    ];
  }, [deleteRow, showDelete]);

  const onSave = () => {
    GetPaymentWithLinkedList(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Linkli Ödeme Listesi");
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
      }
    );
  };
  

  const hasLoading =
    isGetPaymentWithLinkedListLoading || isPassiveLinkedPaymentLoading;
  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack
              spacing={3}
              direction="row"
              width={isDesktop ? 1308 : "auto"}
            >
              <FormControl sx={{ width: "50%" }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="merchantID"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            onChange={(event, selectedValue) => {
                              //setSelectedMerchant(selectedValue);
                              setValue("merchantID", selectedValue.value);
                            }}
                            id="merchantID"
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
              <FormControl sx={{ flex: 1 }}>
                {paymentstatusList ? (
                  <Controller
                    name="status"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedStatus = paymentstatusList.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="status"
                          options={paymentstatusList}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedStatus || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="İşlem Durumu" />
                            
                          )}
                          
                        />
                        
                      );
                    }}
                  />
                ) : null}
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              width={isDesktop ? 1308 : "auto"}
            >
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                text={"ARA"}
                sx={{ width: 150 }}
              />
            </Stack>
          </Stack>
          <Stack flex={1} mt={2}>
            {tableData && tableData?.result?.length > 0 && (
              <>
                <Table
                  paginationModel={paginationModel}
                  onPaginationModelChange={handleChangePagination}
                  paginationMode="server"
                  rowCount={tableData.totalItems}
                  getRowId={(row) => row.orderId}
                  sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
                  autoHeight
                  isRowSelectable={() => false}
                  disableColumnMenu
                  rows={tableData.result}
                  columns={columns}
                  exportFileName="Linkli Ödeme Listesi"
                  onSave={() => onSave()}
                />
                <DeleteConfirmModal
                  isOpen={isDeleteModalOpen}
                  onClose={handleCloseDeleteModal}
                  onConfirm={() => handleDeleteConfirm()}
                ></DeleteConfirmModal>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
