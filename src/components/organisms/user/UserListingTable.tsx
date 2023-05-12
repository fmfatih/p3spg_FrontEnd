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
  const {showDelete, showUpdate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mutate: forgotPassword } = useForgotPassword();
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
  }, [
    getUserList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
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
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return(
            [
              !!showUpdate ? <GridActionsCellItem
                label="Düzenle"
                onClick={editRow(params.row)}
                showInMenu
              /> : <></>,
              !!showDelete ? <GridActionsCellItem
                label="Sil"
                onClick={deleteRow(params.row)}
                showInMenu
              /> : <></>,
              <GridActionsCellItem
                label="Parolayı Sıfırla"
                onClick={handleResetPassword(params.row)}
                showInMenu
              />,
            ]
          )
        },
      },
      { field: "fullName", headerName: "Adı Soyadı", width: 350 },
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
    getUserList(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Kullanıcı Listesi");
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
              disableColumnMenu
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
