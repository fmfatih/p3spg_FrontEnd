// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { DeleteConfirmModal, Table } from "../../molecules";
import { Loading, StatusBar } from "../../atoms";
import {
  IUser,
  useGetUserList,
  useDeleteUser,
  DeleteUserRequest,
  useForgotPassword,
  useAuthorization,
} from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { PagingResponse } from "../../../hooks/_types";
import { downloadExcel } from "../../../util/downloadExcel";

function RenderStatus(props: GridRenderCellParams<any, string>) {
  const { value } = props;
  return <>{value && <StatusBar status={value} />}</>;
}

export const UserListingTable = () => {
  const theme = useTheme();
  const { showDelete, showUpdate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mutate: forgotPassword } = useForgotPassword();
  const [queryOptions, setQueryOptions] = React.useState({});
  const [tableData, setTableData] = useState<PagingResponse<Array<IUser>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const navigate = useNavigate();
  const { mutate: getUserList, isLoading } = useGetUserList();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const setSnackbar = useSetSnackBar();
  const { mutate: userDelete, isLoading: isDeleteLoading } = useDeleteUser();

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

    getUserList(requestPayload, {
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
    });
  }, [
    getUserList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions,
  ]);

  const handleResetPassword = React.useCallback(
    (tempUser: IUser) => () => {
      forgotPassword({
        email: tempUser.email,
        phoneNumber: `0${tempUser.phoneNumber}`,
      });
    },
    [forgotPassword]
  );

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setTableData(undefined);

    getUserList(
      {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
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

  const editRow = React.useCallback(
    (user: IUser) => () => {
      navigate("/user-management/user-identification", { state: user });
    },
    [navigate]
  );

  const deleteRow = React.useCallback(
    (user: IUser) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(user.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteUserRequest = { id: selectedRowId };

    userDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getUserList({
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

  const columns: GridColDef<IUser, any, any>[] = useMemo(() => {
    return [
      {
        field: "Aksiyonlar",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            !!showUpdate ? (
              <GridActionsCellItem
                label="Düzenle"
                onClick={editRow(params.row)}
                showInMenu
              />
            ) : (
              <></>
            ),
            !!showDelete ? (
              <GridActionsCellItem
                label="Sil"
                onClick={deleteRow(params.row)}
                showInMenu
              />
            ) : (
              <></>
            ),
            <GridActionsCellItem
              label="Parolayı Sıfırla"
              onClick={handleResetPassword(params.row)}
              showInMenu
            />,
          ];
        },
      },
      { field: "fullName", headerName: "Adı Soyadı", width: 200 },
      { field: "userTypeDesc", headerName: "Kullanıcı Tipi", width: 180 },
      {
        renderCell: RenderStatus,
        field: "status",
        headerName: "Durum",
        width: 100,
      },
      { field: "email", headerName: "E Posta", width: 300 },
      { field: "phoneNumber", headerName: "Telefon", width: 180 },
      { field: "merchantName", headerName: "Üye İşyeri Adı", width: 400 },
    ];
  }, [deleteRow, editRow, handleResetPassword, showDelete, showUpdate]);

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

    getUserList(requestPayload, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          function fieldValue(data) {
            return data.map((item) => {
              return {
               "Ad Soyad": item?.fullName,
               "Kullanıcı Tipi":item?.userTypeDesc,
                "Durum": item?.status,
                "Email": item?.email,
                "Telefon": item?.phoneNumber,
                "Üye İşyeri Numarası": item?.merchantId,
                "Üye İşyeri Adı": item?.merchantName,
                // "Kullanıcı Tipi": item?.userType,
                "Kullanıcı Rolü": item?.roles,
              };
            });
          }
          const refactoredData = fieldValue(data?.data?.result);
          downloadExcel(refactoredData || [], "Kullanıcı Listesi");
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
        {tableData && tableData.result && tableData.result.length > 0 && (
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
              rows={tableData.result}
              columns={columns}
              exportFileName="Kullanıcı Listesi"
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
