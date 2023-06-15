// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  GridColDef,
  GridRowId,
  GridRenderCellParams,
  GridActionsCellItem,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { DeleteConfirmModal, Table } from "../../molecules";
import { Loading, StatusBar } from "../../atoms";
import {
  IMerchantVPos,
  PagingResponse,
  useAuthorization,
  useGetMerchantVPosList,
} from "../../../hooks";
import React from "react";
import { DeleteMerchantVPosRequest, useMerchantVPosDelete } from "../../../hooks";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";
import { useUserInfo } from "../../../store/User.state";

function RenderStatus(props: GridRenderCellParams<any, string>) {
  const { value } = props;

  return <>{value && <StatusBar status={value} />}</>;
}

type BusinessBankListingProps = {
  onRowClick?: (data: { id: GridRowId; row: any }) => void;
};

export const BusinessBankListingPassiveTable = ({
  onRowClick,
}: BusinessBankListingProps) => {
  const [userInfo] = useUserInfo();
  const theme = useTheme();
  const {showDelete, showUpdate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [queryOptions, setQueryOptions] = React.useState({});
  const [tableData, setTableData] =
    useState<PagingResponse<Array<IMerchantVPos>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { mutate: getMerchantVPosList, isLoading } = useGetMerchantVPosList();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const { mutate: merchantVPosDelete, isLoading: isDeleteLoading } =
    useMerchantVPosDelete();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    const requestPayload = {
      size: paginationModel.pageSize,
      page: paginationModel.page,
      orderBy: "CreateDate",
      orderByDesc: true,
      status: "PASSIVE",
      merchantId: userInfo ? Number(userInfo.merchantId) : undefined
    };

    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }
    getMerchantVPosList(
    requestPayload,
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
  }, [
    getMerchantVPosList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions
  ]);

  const deleteRow = React.useCallback(
    (merchantVPos: IMerchantVPos) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(merchantVPos.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteMerchantVPosRequest = { id: selectedRowId };

    merchantVPosDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getMerchantVPosList({
            size: paginationModel.pageSize,
            page: paginationModel.page,
            orderBy: "CreateDate",
            orderByDesc: true,
            status: "PASSIVE",
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

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setTableData(undefined);

    getMerchantVPosList(
      {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "PASSIVE",
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

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "update",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            !!showDelete ? <GridActionsCellItem
              label="Sil"
              onClick={deleteRow(params.row)}
              showInMenu
            /> : <></>,
          ];
        },
      },
      { field: "bankName", headerName: "Banka Adı", width: 400 },
      {
        field: "createUserName",
        headerName: "Son Güncelleyen Kullanıcı",
        width: 350,
      },
      { field: "updateDate", headerName: "Son Güncelleme Tarihi", width: 350 },
      {
        renderCell: RenderStatus,
        field: "status",
        headerName: "Durum",
        width: 100,
      },
    ];
  }, [deleteRow, showDelete]);

  const onSave = () => {
    const requestPayload = {
      size: -1,
      page: 0,
      orderBy: "CreateDate",
      orderByDesc: true,
      status: "PASSIVE",
    };

    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }
    getMerchantVPosList(
      requestPayload,
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Pasif Banka Listesi");
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

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleFilterChange = debounce((props) => {
    if (props === "clearFilter") {
      return setQueryOptions({});
    }
    if (props.value?.toString()?.length >= 1) {
      setQueryOptions(props);
    }
  }, 500);

  const hasLoading = isLoading || isDeleteLoading;
  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} py={2}>
        {tableData?.result && (
          <>
            <Table
             handleFilterChange={handleFilterChange}
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData.totalItems}
              onRowClick={onRowClick}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              isRowSelectable={() => false}
              // disableColumnMenu
              rows={tableData.result.filter(
                (item) => item.status === "PASSIVE"
              )}
              columns={columns}
              exportFileName="Pasif Banka Listesi"
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
    </>
  );
};
