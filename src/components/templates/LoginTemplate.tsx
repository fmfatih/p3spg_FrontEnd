import {
  Stack,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { LoginBG, Logo150 } from "../../assets/images";
import { Button, Loading } from "../atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputControl, PasswordControl } from "../molecules";
import { signInFormSchema, SignInFormValuesType } from "./_types";
import { OtpFormModal, ForgotPasswordModal } from "../organisms";
import { useLogin } from "../../hooks";
import { useState } from "react";
import { StorageKeys } from "../../common/storageKeys";
import { axiosInstance } from "../../config/axios";
import { useUserInfo } from "../../store/User.state";
import { useSetSnackBar } from "../../store/Snackbar.state";

export const LoginTemplate = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { mutate: login, isLoading } = useLogin();
  const setSnackbar = useSetSnackBar();
  const [, setUserInfo] = useUserInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const { handleSubmit, control } = useForm<SignInFormValuesType>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit = ({ email, password }: SignInFormValuesType) => {
    login(
      { email, password },
      {
        onSuccess(data) {
          if (data.isSuccess) {
            setIsModalOpen(true);
            setUserInfo(data.data);
            localStorage.setItem(StorageKeys.bearerToken, data.data.token);
            localStorage.setItem(StorageKeys.userName, data.data.fullName);
            localStorage.setItem(StorageKeys.order, data.data.order);
            localStorage.setItem(StorageKeys.expireDate, data.data.expireDate);
            localStorage.setItem(StorageKeys.merchantId, data.data.merchantId);
            localStorage.setItem(
              StorageKeys.systemPassword,
              data.data.systemPassword
            );
            localStorage.setItem(
              StorageKeys.merchantName,
              data.data.merchantName
            );

            axiosInstance.interceptors.request.use(
              (config) => {
                config.headers["Authorization"] = `Bearer ${data.data.token}`;
                return config;
              },
              (error) => {
                return Promise.reject(error);
              }
            );
          } else {
            setSnackbar({
              severity: "error",
              description: data.message,
              isOpen: true,
            });
          }
        },
      }
    );
  };

  return (
    <>
      {isLoading && <Loading />}
      <Stack
        direction={isDesktop ? "row" : "column"}
        height={isDesktop ? "100vh" : "auto"}
        overflow={isDesktop ? "hidden" : "auto"}
      >
        <Stack>
          <img
     style={{
      height: isDesktop ? "100vh" : "400px",
      width: isLargeScreen ? '650px' : (isDesktop ? '100%' : '100%'),
      paddingRight:"5px",
      objectFit: isMediumScreen ? "cover" : "fill",
      objectPosition: "center",  
      overflow: isDesktop ? "auto" : "hidden",
  }}
            src={LoginBG}
            alt="login background"
          />
        </Stack>
        <Stack
          mt={isDesktop ? 0 : -12}
          flex={isDesktop ? 1 : "auto"}
          justifyContent="center"
          alignItems="center"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSubmit(onSubmit)();
            }
          }}
        >
          <Stack
            spacing={3}
            borderRadius={4}
            backgroundColor={isDesktop ? "#FFF" : "#FFF"}
            p={isDesktop ? 6 : 4}
            border="1px solid gray"
            width={isDesktop ? "456px" : "90%"}
            height={505}
          >
            <Stack justifyContent="center" alignItems="center" height={50}>
              <img width={100} src={Logo150} alt="logo" />
            </Stack>
            <Typography variant="h3">Giriş Yap</Typography>
            <InputControl
              defaultValue=""
              id={"email"}
              control={control}
              label="E-Posta"
            />
            <PasswordControl
              defaultValue=""
              id="password"
              control={control}
              type="password"
              label="Şifre"
            />

            <Link
              component="button"
              variant="body2"
              sx={{ alignItems: "rigth" }}
              onClick={() => {
                setIsForgotModalOpen(true);
              }}
            >
              Parolamı unuttum
            </Link>
            <Stack mt={2} alignItems="center">
              <Button
                onClick={handleSubmit(onSubmit)}
                sx={{ width: 240, mb: 3 }}
                size="large"
                variant="contained"
                text="Giriş Yap"
              />
              <Link
                component="button"
                variant="body2"
                target="_blank"
                onClick={() => {
                  window.open(
                    "https://www.ahlpay.com.tr",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Henüz bir hesabınız yok mu?
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {isModalOpen && <OtpFormModal isOpen={isModalOpen} />}
      {isForgotModalOpen && (
        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => {
            setIsForgotModalOpen(false);
          }}
        />
      )}
    </>
  );
};
