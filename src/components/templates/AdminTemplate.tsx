import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { PropsWithChildren, useEffect } from "react";
import { Header, HeaderProps } from "../molecules";
import { Sidebar } from "../organisms";
import { initialUserInfoState, useUserInfo } from "../../store/User.state";
import dayjs from "dayjs";
import { useSetSnackBar } from "../../store/Snackbar.state";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../../common/storageKeys";

export type AdminTemplateProps = PropsWithChildren<{
  headerProps: HeaderProps;
}>;

export const AdminTemplate = ({
  headerProps,
  children,
}: AdminTemplateProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [userInfo, setUserInfo] = useUserInfo();
  const setSnackbar = useSetSnackBar();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));


  useEffect(() => {
    const interval = setInterval(() => {
      const expiredDate = dayjs(localStorage.getItem(StorageKeys.expireDate)).subtract(3, 'hour');
      const now = dayjs(new Date());
      if(expiredDate.diff(now) < 0){
        setSnackbar({
          severity: "error",
          description: 'İşlem süreniz dolmuştur. Lütfen tekrar giriş yapınız.',
          isOpen: true,
        });
        setUserInfo(initialUserInfoState);
        localStorage.setItem(StorageKeys.bearerToken, "");
        navigate("/");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, setSnackbar, setUserInfo, userInfo.expireDate])
  
  return (
    <Stack direction="row">
      {isDesktop && <Sidebar />}
      <Stack minHeight={isDesktop ? undefined : '100vh'} flex={1}>
        <Header {...headerProps} />
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
