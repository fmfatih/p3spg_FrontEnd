// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  GridActionsCellItem,
  GridPaginationModel,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import { DeleteConfirmModal, Table } from "../../molecules";
import { IRole, useAuthorization, useGetRoleList } from "../../../hooks";
import { Loading } from "../../atoms";
import { DeleteRoleRequest, useDeleteRole } from "../../../hooks";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";

export type RoleListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: IRole }) => void;
  isModalClosed?: boolean;
};

export const RoleListingTable = ({
  onRowClick,
  isModalClosed,
}: RoleListingTableProps) => {
  const theme = useTheme();
  const {showDelete, showUpdate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [queryOptions, setQueryOptions] = React.useState({});
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { data: getData, mutate: getRoleList, isLoading } = useGetRoleList();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const setSnackbar = useSetSnackBar();
  const tableData = getData?.data;
  const { mutate: roleDelete, isLoading: isDeleteLoading } = useDeleteRole();

  useEffect(() => {
    if (!isModalClosed) {
      getRoleList({
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
      });
    }
  }, [
    getRoleList,
    isModalClosed,
    paginationModel.page,
    paginationModel.pageSize,
  ]);

  useEffect(() => {
    const requestPayload = {
      size: paginationModel.pageSize,
      page: paginationModel.page,
      orderBy: "CreateDate",
      orderByDesc: true,
    };
    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }

    getRoleList(
requestPayload,
      {
        onSuccess: (data) => {
          if (!data.isSuccess) {
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
    getRoleList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);

    getRoleList(
      {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
      },
      {
        onSuccess: (data) => {
          if (!data.isSuccess) {
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

  const deleteRow = React.useCallback(
    (role: any) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(role.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteRoleRequest = { id: selectedRowId };

    roleDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getRoleList({
            size: paginationModel.pageSize,
            page: paginationModel.page,
            orderBy: "CreateDate",
            orderByDesc: true,
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
      { field: "id", headerName: "Rol ID", flex: 1 },
      { field: "code", headerName: "Rol Kodu", flex: 1 },
      { field: "name", headerName: "Rol Adı", flex: 1 },
      { field: "order", headerName: "Order", flex: 1 },
      { field: "userType", headerName: "Kullanıcı Tipi", flex: 1 },
      { field: "description", headerName: "Açıklama", flex: 1 },
    ];
  }, [deleteRow, showDelete]);

  const onSave = () => {
    const requestPayload = {
      size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
    };

    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }

    getRoleList(
    requestPayload,
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Rol Listesi");
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
      <Stack flex={1} p={2}>
        {tableData?.result?.length && (
          <>
            <Table
              handleFilterChange={handleFilterChange}
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData.totalItems}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              isRowSelectable={() => false}
              // disableColumnMenu
              onRowClick={!!showUpdate ? onRowClick : () => null}
              rows={tableData.result}
              columns={columns}
              exportFileName="Rol Listesi"
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
