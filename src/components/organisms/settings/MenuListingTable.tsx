import React, { useEffect, useMemo, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  GridColDef,
  GridPaginationModel,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import { DeleteConfirmModal, Table } from "../../molecules";
import {
  DeleteMenuRequest,
  IMenu,
  useDeleteMenu,
  useGetMenuList,
} from "../../../hooks";
import { Loading } from "../../atoms";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";

export type MenuListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: IMenu }) => void;
  isMenuOpen?: boolean;
};

export const MenuListingTable = ({
  onRowClick,
  isMenuOpen,
}: MenuListingTableProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { data, mutate: getMenuList, isLoading } = useGetMenuList();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const setSnackbar = useSetSnackBar();
  const { mutate: menuDelete, isLoading: isDeleteLoading } = useDeleteMenu();
  const tableData = data?.data;

  useEffect(() => {
    if (!isMenuOpen) {
      getMenuList({
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
      });
    }
  }, [getMenuList, isMenuOpen, paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    getMenuList(
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
  }, [
    getMenuList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);

    getMenuList(
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
    (menu: IMenu) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(menu.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteMenuRequest = { id: selectedRowId };

    menuDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getMenuList({
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
      { field: "id", headerName: "Menü ID", width: 150 },
      { field: "name", headerName: "Menü Adı", width: 150 },
      { field: "menuType", headerName: "Menü Tipi", width: 150 },
      { field: "order", headerName: "Sıra No", width: 150 },
      { field: "description", headerName: "Menü Açıklaması", width: 150 },
      { field: "url", headerName: "Menü Url", width: 150 },
      { field: "media", headerName: "Menü İkon Bilgisi", width: 150 },
      { field: "feId", headerName: "Önyüz ID", width: 150 },
      { field: "feType", headerName: "Önyüz Menü Tipi", width: 150 },
      { field: "exactMatch", headerName: "Tam Eşleşme", width: 150 },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          //<GridActionsCellItem label="Düzenle" showInMenu />,
          <GridActionsCellItem
            label="Sil"
            onClick={deleteRow(params.row)}
            showInMenu
          />,
        ],
      },
    ];
  }, [deleteRow]);

  const onSave = () => {
    getMenuList(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Menü Listesi");
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

  const hasLoading = isLoading || isDeleteLoading;

  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} p={2}>
        {tableData?.result?.length && (
          <>
            <Table
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData.totalItems}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              isRowSelectable={() => false}
              onRowClick={onRowClick}
              disableColumnMenu
              rows={tableData.result}
              columns={columns}
              exportFileName="Menü Listesi"
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
