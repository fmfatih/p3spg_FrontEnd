// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
} from "@mui/x-data-grid";
import { DeleteConfirmModal, Table } from "../../molecules";
import {
  useGetRoleMenuList,
  useDeleteRoleMenu,
  DeleteRoleMenuRequest,
  useAuthorization,
} from "../../../hooks";
import { Loading } from "../../atoms";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";

export type RoleMenuListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: any }) => void;
  isMenuOpen?: boolean;
};

export const RoleMenuListingTable = ({
  onRowClick,
  isMenuOpen,
}: RoleMenuListingTableProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [queryOptions, setQueryOptions] = React.useState({});
  const { data, mutate: getRoleMenu, isLoading } = useGetRoleMenuList();
  const tableData = data?.data;
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const {showDelete, showUpdate} = useAuthorization();
  const setSnackbar = useSetSnackBar();
  const { mutate: roleMenuDelete, isLoading: isDeleteLoading } =
    useDeleteRoleMenu();

  useEffect(() => {
    if (!isMenuOpen) {
      getRoleMenu({
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
      });
    }
  }, [getRoleMenu, isMenuOpen, paginationModel.page, paginationModel.pageSize]);

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
    getRoleMenu(
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
    getRoleMenu,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);

    getRoleMenu(
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
    (menu: any) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(menu.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteRoleMenuRequest = { id: selectedRowId };

    roleMenuDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getRoleMenu({
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
          !!showDelete ?<GridActionsCellItem
            label="Sil"
            onClick={deleteRow(params.row)}
            showInMenu
          /> : <></>,
        ],
      },
      { field: "roleName", headerName: "Rol Adı", flex: 1 },
      { field: "menuName", headerName: "Menü Adı", flex: 1 },
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

    getRoleMenu(
      requestPayload,
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Rol Menü Listesi");
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
              exportFileName="Rol Menü Listesi"
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
