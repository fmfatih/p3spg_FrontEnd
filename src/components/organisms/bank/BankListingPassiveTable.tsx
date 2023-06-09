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
  IMemberVPos,
  PagingResponse,
  useAuthorization,
  useGetMemberVPosList,
} from "../../../hooks";
import React from "react";
import { DeleteMemberVPosRequest, useMemberVPosDelete } from "../../../hooks";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";

function RenderStatus(props: GridRenderCellParams<any, string>) {
  const { value } = props;

  return <>{value && <StatusBar status={value} />}</>;
}

type BankListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: any }) => void;
};

export const BankListingPassiveTable = ({
  onRowClick,
}: BankListingTableProps) => {
  const theme = useTheme();
  const {showDelete, showUpdate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [queryOptions, setQueryOptions] = React.useState({});
  const [tableData, setTableData] =
    useState<PagingResponse<Array<IMemberVPos>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { mutate: getMemberVPosList, isLoading } = useGetMemberVPosList();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const { mutate: memberVPosDelete, isLoading: isDeleteLoading } =
    useMemberVPosDelete();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {

    const requestPayload = {
      size: paginationModel.pageSize,
      page: paginationModel.page,
      orderBy: "CreateDate",
      orderByDesc: true,
      status: "PASSIVE",
    };

    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }


    getMemberVPosList(
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
    getMemberVPosList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions
  ]);

  const deleteRow = React.useCallback(
    (memberVPos: IMemberVPos) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(memberVPos.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteMemberVPosRequest = { id: selectedRowId };

    memberVPosDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getMemberVPosList({
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

    getMemberVPosList(
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
    getMemberVPosList(
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
