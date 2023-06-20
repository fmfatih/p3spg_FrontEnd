import { useEffect, useMemo, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
} from "@mui/x-data-grid";
import { DeleteConfirmModal, Table } from "../../molecules";
import {
  useGetParameterList,
  DeleteParameterRequest,
  useDeleteParameter,
  useAuthorization,
} from "../../../hooks";
import { Loading } from "../../atoms";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import React from "react";
import { downloadExcel } from "../../../util/downloadExcel";

export type ParameterListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: any }) => void;
  isModalOpen?: boolean;
};

export const ParameterListingTable = ({
  onRowClick,
  isModalOpen,
}: ParameterListingTableProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [queryOptions, setQueryOptions] = React.useState({});
  const {showDelete, showUpdate} = useAuthorization();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const {
    data: parameterData,
    mutate: getParameterList,
    isLoading,
  } = useGetParameterList();
  const tableData = parameterData?.data;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const setSnackbar = useSetSnackBar();
  const { mutate: parameterDelete, isLoading: isDeleteLoading } =
    useDeleteParameter();

  const deleteRow = React.useCallback(
    (parameter: any) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(parameter.id));
    },
    []
  );

  useEffect(() => {
    if (!isModalOpen) {
      getParameterList({
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
      });
    }
  }, [
    getParameterList,
    isModalOpen,
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

    getParameterList(
requestPayload
      ,{
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
    getParameterList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);

    getParameterList(
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

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteParameterRequest = { id: selectedRowId };

    parameterDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getParameterList({
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
        // getActions: (params) => [
        //   /*  <GridActionsCellItem
        //     onClick={editRow(params.row)}
        //     label="Düzenle"
        //     showInMenu
        //   />, */
        //   !!showDelete ? <GridActionsCellItem
        //     label="Sil"
        //     onClick={deleteRow(params.row)}
        //     showInMenu
        //   /> : null,
        // ],
        getActions: (params) => 
        !!showDelete 
          ? [<GridActionsCellItem
              label="Sil"
              onClick={() => deleteRow(params.row)}
              showInMenu
            />]
          : [],
      },
      { field: "id", headerName: "Parametre ID", flex: 1 },
      { field: "groupCode", headerName: "Group Kodu", flex: 1 },
      { field: "key", headerName: "Anahtar", flex: 1 },
      { field: "value", headerName: "Değer", flex: 1 },
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
    getParameterList(
  requestPayload,
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Parametre Listesi");
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
              exportFileName="Parametre Listesi"
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
