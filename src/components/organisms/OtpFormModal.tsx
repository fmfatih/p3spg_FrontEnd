import { useCountdown, useValidateOtp, useReSendOtp } from "../../hooks";
import {
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import OtpField from "react-otp-field";
import { useNavigate } from "react-router-dom";
import { Button, Loading } from "..";
import { useUserInfo } from "../../store/User.state";
import { useSetSnackBar } from "../../store/Snackbar.state";

import { ChangePasswordModal } from "../../components";

const COUNTDOWN_SECONDS = 90;

interface OtpFormModalProps {
  isOpen: boolean;
}

export const OtpFormModal = ({ isOpen }: OtpFormModalProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mutate: validateOtp, isLoading } = useValidateOtp();
  const { mutate: reSendOtp } = useReSendOtp();
  const [userInfo] = useUserInfo();
  const { minutesText, secondsText, resetCountdown } = useCountdown(COUNTDOWN_SECONDS);
  const [value, setValue] = useState("");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    if (value.length === 6) {
      validateOtp(
        { otpCode: value },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              if (userInfo.systemPassword) {
                setIsChangePasswordModalOpen(true);
              } else {
                setSnackbar({
                  severity: "success",
                  isOpen: true,
                  description: data.message,
                });
                navigate("/dashboard");
              }
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
    }
  }, [navigate, validateOtp, value, userInfo]);

  const callReSendOtp = () => {
    reSendOtp(
      {},
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
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
      }
    );
  };

  return (
    <>
      {isLoading && <Loading />}
      <Modal
        sx={{ justifyContent: "center", alignItems: "center" }}
        open={isOpen}
      >
        <Stack
          sx={{
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack
            borderRadius={2}
            p={isDesktop ? 8 : 2}
            sx={{
              backgroundColor: "white",
              width: isDesktop ? 568 : "90%",
              height: 500,
            }}
          >
            <Typography mb={2} color="text.default" variant="h3">
              Onay Kodu
            </Typography>
            <Typography
              color="text.default"
              variant="body1"
            >{`Lütfen ${userInfo.phoneNumber} numaralı telefona gönderilen onay kodunu girin. Telefon numarası doğru değilse yardım adımından destek alabilirisiniz.`}</Typography>
            <Typography
              my={isDesktop ? 5 : 2}
              color="text.subtle"
              variant="h4"
              sx={{ textAlign: "center" }}
            >{`${minutesText}:${secondsText}`}</Typography>
            <OtpField
              value={value}
              onChange={setValue}
              numInputs={6}
              onChangeRegex={/^([0-9]{0,})$/}
              autoFocus
              isTypeNumber
              inputProps={{ className: "otp-field__input", disabled: false }}
            />
            <Stack mt={5} justifyContent="center" alignItems="center">
              <Button
                onClick={() => console.log("")}
                sx={{ width: 240, mb: 3 }}
                size="medium"
                variant="contained"
                text="Onayla"
              />
              <Link
                component="button"
                variant="body2"
                sx={{ alignItems: "rigth" }}
                onClick={() => {
                  callReSendOtp();
                  resetCountdown();
                }}
              >
                <Typography
                  sx={{ textAlign: "center", textDecoration: "underline" }}
                  color="primary.dark"
                  variant="body2"
                >
                  Tekrar Gönder
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Modal>

      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => {
            setIsChangePasswordModalOpen(false);
            navigate(0);
          }}
        />
      )}
    </>
  );
};
