import { useLocation } from "react-router-dom";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";
import { Header, HeaderProps } from "../molecules";
import { Sidebar } from "../organisms";
import { initialUserInfoState, useUserInfo } from "../../store/User.state";
import dayjs from "dayjs";
import { useSetSnackBar } from "../../store/Snackbar.state";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../../common/storageKeys";
import { useGetUserMenuList } from "../../hooks";

export type AdminTemplateProps = PropsWithChildren<{
  headerProps: HeaderProps;
}>;

export const AdminTemplate = ({
  headerProps,
  children,
}: AdminTemplateProps) => {
  let title = "";
  const [hideSaveButton, setHideSaveButton] = useState(false);
  const pathNameSplitted = useLocation().pathname.split("/");
  const pathName = pathNameSplitted[pathNameSplitted.length - 1];
  const { data: userMenu } = useGetUserMenuList();
  userMenu?.data.forEach((menuItem) => {
    if (menuItem.childs?.length) {
      menuItem.childs.forEach((childMenu) => {
        if (childMenu.id === pathName) {
          title = childMenu.title;
        }
      });
    }
  });

  useEffect(() => {
    userMenu?.data.forEach((menuItem) => {
      if (menuItem.childs?.length) {
        menuItem.childs.forEach((childMenu) => {
          if (childMenu.id === pathName) {
            setHideSaveButton(!childMenu.create);
          }
        });
      }
    });
  }, [pathName, userMenu?.data]);

  const navigate = useNavigate();
  const theme = useTheme();
  const [userInfo, setUserInfo] = useUserInfo();
  const setSnackbar = useSetSnackBar();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const interval = setInterval(() => {
      const expiredDate = dayjs(
        localStorage.getItem(StorageKeys.expireDate)
      ).subtract(3, "hour");
      const now = dayjs(new Date());
      if (expiredDate.diff(now) < 0) {
        setSnackbar({
          severity: "error",
          description: "İşlem süreniz dolmuştur. Lütfen tekrar giriş yapınız.",
          isOpen: true,
        });
        setUserInfo(initialUserInfoState);
        localStorage.setItem(StorageKeys.bearerToken, "");
        navigate("/");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, setSnackbar, setUserInfo, userInfo.expireDate]);

  const isAddPage = pathName === "add";
  const hideButtonCondition =
    headerProps.hideAddButton ||
    pathName === "dashboard" ||
    pathName === "payment-reporting" ||
    pathName === "merchant-payment" ||
    pathName === "bank-payment" ||
    isAddPage ||
    hideSaveButton;

  return (
    <Stack direction="row">
      {isDesktop && <Sidebar />}
      <Stack minHeight={isDesktop ? undefined : "100vh"} flex={1}>
        {/* <Header {...headerProps} headerTitle={pathName === 'dashboard' ? "Ana Ekran" : title} hideAddButton={pathName === "dashboard" || pathName === "payment-reporting" || pathName === "merchant-payment" ||  pathName === "bank-payment" || hideSaveButton}/>  */}
        <Header
          {...headerProps}
          headerTitle={
            (pathName === "dashboard" ? "Ana Ekran" : title) ||
            headerProps.headerTitle
          }
          hideAddButton={hideButtonCondition}
        />
        {/* <Header
          {...headerProps}
          headerTitle={
            headerProps.headerTitle ||
            (pathName === "dashboard" ? "Ana Ekran" : title)
          }
          hideAddButton={hideButtonCondition}
        /> */}

        <Stack
          borderRadius={3}
          m={isDesktop ? 2 : 1}
          flex={1}
          sx={{ backgroundColor: "white" }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};
