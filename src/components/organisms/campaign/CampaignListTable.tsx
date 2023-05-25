import React, { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  TextField,
  Checkbox,
  TextFieldProps,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { default as dayjs } from "dayjs";
import {
  GridColDef,
  GridActionsCellItem,
  GridPaginationModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import {
  useGetAcquirerBankList,
  useGetCampaignList,
  useGetCardBinList,
  DeleteCampaignRequest,
  useCampaignDelete,
  PagingResponse,
  useAuthorization,
} from "../../../hooks";
import { Button, Loading } from "../../atoms";
import {
  DatePickerControl,
  SelectControl,
  Table,
  DeleteConfirmModal,
} from "../../molecules";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";

export const CampaignListTable = () => {
  const theme = useTheme();
  const {showDelete, showUpdate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [tableData, setTableData] = useState<PagingResponse<Array<any>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const { data: rawCardBinList } = useGetCardBinList({});
  const { control, handleSubmit, setValue, getValues } = useForm();
  const { mutate: getCampaignList } = useGetCampaignList();
  const [selectedBins, setSelectedBins] = useState([] as any);
  const setSnackbar = useSetSnackBar();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const { mutate: campaignDelete } = useCampaignDelete();

  const acquirerBankList = useMemo(() => {
    return rawAcquirerBankList?.data?.map(
      (bank: { bankCode: string; bankName: string }) => {
        return {
          label: `${bank.bankName}`,
          value: bank.bankCode,
        };
      }
    );
  }, [rawAcquirerBankList?.data]);

  const cardBinList = useMemo(() => {
    return rawCardBinList?.data?.map((bank: { bin: string }) => {
      return {
        label: `${bank.bin}`,
        value: bank.bin,
      };
    });
  }, [rawCardBinList?.data]);

  const onSubmit = (formValues: any) => {
    setTableData(undefined);
    getCampaignList(
      {
        bankCode: formValues.bankCode,
        cardBin: selectedBins,
        startDate: dayjs(formValues.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(formValues.endDate).format("YYYY-MM-DD"),
        size: paginationModel.pageSize,
        page: paginationModel.page,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setTableData(data.data);
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
      }
    );
  };

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setTableData(undefined);
    getCampaignList(
      {
        bankCode: getValues("bankCode"),
        cardBin: selectedBins,
        startDate: dayjs(getValues("startDate")).format("YYYY-MM-DD"),
        endDate: dayjs(getValues("endDate")).format("YYYY-MM-DD"),
        size: paginationModel.pageSize,
        page: paginationModel.page,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setTableData(data?.data);
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

  const handleBinListChange = (event: any, selectedValues: any) => {
    setSelectedBins([]);
    let list: Array<string> = [];
    selectedValues.map((e: { label: string; value: string }) => {
      list.push(e.label);
    });
    setSelectedBins(list);
  };

  const deleteRow = React.useCallback(
    (campaign: any) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(campaign.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteCampaignRequest = { id: selectedRowId };

    campaignDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getCampaignList({
            bankCode: getValues("bankCode"),
            cardBin: selectedBins,
            startDate: dayjs(getValues("startDate")).format("YYYY-MM-DD"),
            endDate: dayjs(getValues("endDate")).format("YYYY-MM-DD"),
            size: paginationModel.pageSize,
            page: paginationModel.page,
          });
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
          !!showDelete ? <GridActionsCellItem
            label="Sil"
            onClick={deleteRow(params.row)}
            showInMenu
          /> : <></>,
        ],
      },
      {
        field: "startDateFormatted",
        headerName: "Başlangıç Tarihi",
        width: 200,
      },
      { field: "endDateFormatted", headerName: "Bitiş Tarihi", width: 200 },
      {
        field: "systemDateFormatted",
        headerName: "Oluşturma Tarihi",
        width: 200,
      },
      {
        field: "status",
        headerName: "Statü",
        width: 150,
      },
      {
        field: "merchantId",
        headerName: "Üye İşyeri Numarası",
        width: 200,
      },
      {
        field: "merchantName",
        headerName: "Üye İşyeri Adı",
        width: 370,
        editable: true,
      },
      { field: "cardBin", headerName: "Kart Bin", width: 200 },
      { field: "bankCode", headerName: "Banka Kodu", width: 150 },
      { field: "bankName", headerName: "Banka Adı", width: 220 },
      { field: "cardTypeDesc", headerName: "Kart Tipi", width: 200 },
      {
        field: "discountRate",
        headerName: "Kampanya Oranı",
        width: 150,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} %`;
        },
      },
      {
        field: "minAmount",
        headerName: "En Düşük Tutar",
        width: 170,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "maxAmount",
        headerName: "En Yüksek Tutar",
        width: 170,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
    ];
  }, [deleteRow, showDelete]);

  const onSave = () => {
    console.log("burda");
    getCampaignList(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
        startDate: dayjs(getValues("startDate")).format("YYYY-MM-DD"),
        endDate: dayjs(getValues("endDate")).format("YYYY-MM-DD"),
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Kampanya Listesi");
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

  return (
    <>
      {false && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack
              spacing={3}
              direction="row"
              width={isDesktop ? 1308 : "auto"}
            >
              <FormControl sx={{ flex: 1 }}>
                <DatePickerControl
                  sx={{ flex: 1 }}
                  id="startDate"
                  control={control}
                  label="Kampanya Başlangıç Tarihi"
                  defaultValue={dayjs().add(-1, "day")}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <DatePickerControl
                  sx={{ flex: 1 }}
                  id="endDate"
                  control={control}
                  label="Kampanya Bitiş Tarihi"
                  defaultValue={dayjs()}
                />
              </FormControl>
            </Stack>
            <Stack
              spacing={3}
              direction="row"
              width={isDesktop ? 1308 : "auto"}
            >
       <FormControl sx={{ flex: 1 }}>
  {acquirerBankList && (
    <Controller
      name="bankCode"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedBank = acquirerBankList.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="bankCode"
            options={acquirerBankList}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedBank || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Banka" />
            )}
          />
        );
      }}
    />
  )}
</FormControl>

              <FormControl sx={{ flex: 1 }}>
                {cardBinList && (
                  <Controller
                    control={control}
                    name="cardBin"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <Autocomplete
                          multiple
                          id="cardBin"
                          onChange={(event, selectedValue) => {
                            handleBinListChange(event, selectedValue);
                            setValue("cardBins", selectedValue);
                          }}
                          options={cardBinList}
                          disableCloseOnSelect
                          getOptionLabel={(option: {
                            label: string;
                            value: string;
                          }) => option.label}
                          renderOption={(
                            props: JSX.IntrinsicAttributes &
                              React.ClassAttributes<HTMLLIElement> &
                              React.LiHTMLAttributes<HTMLLIElement>,
                            option: {
                              value: unknown;
                              label:
                                | string
                                | number
                                | boolean
                                | React.ReactElement<
                                    any,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | React.ReactFragment
                                | React.ReactPortal
                                | null
                                | undefined;
                            },
                            { selected }: any
                          ) => (
                            <li {...props}>
                              <Checkbox
                                style={{ marginRight: 8 }}
                                checked={selected}
                                value={value}
                              />
                              {option.label}
                            </li>
                          )}
                          renderInput={(
                            params: JSX.IntrinsicAttributes & TextFieldProps
                          ) => (
                            <TextField
                              {...params}
                              label="Kart Bin"
                              placeholder=""
                            />
                          )}
                        />
                      );
                    }}
                  />
                )}
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
              />
            </Stack>
          </Stack>
          <Stack flex={1} mt={2}>
            {tableData?.result?.length && (
              <>
                <Table
                  paginationModel={paginationModel}
                  onPaginationModelChange={handleChangePagination}
                  paginationMode="server"
                  rowCount={tableData.totalItems}
                  sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
                  isRowSelectable={() => false}
                  disableColumnMenu
                  rows={tableData.result}
                  columns={columns}
                  autoHeight={!isDesktop}
                  exportFileName="Kampanya Listesi"
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
