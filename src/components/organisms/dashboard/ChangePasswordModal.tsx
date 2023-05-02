import { IChangePasswordRequest, useChangePassword } from "../../../hooks";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { PasswordControl } from "../../molecules";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { Button } from "../..";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import {
  changePasswordFormSchema,
  ChangePasswordFormSchemaFormValuesType,
  changePasswordInitialValues,
} from "./_formTypes";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const { control, handleSubmit } =
    useForm<ChangePasswordFormSchemaFormValuesType>({
      resolver: zodResolver(changePasswordFormSchema),
      defaultValues: changePasswordInitialValues,
    });
  const setSnackbar = useSetSnackBar();
  const navigate = useNavigate();
  const { mutate: changePassword } = useChangePassword();

  const onSubmit = (data: any) => {
    const request: IChangePasswordRequest = {
      oldPassword: data.oldPassword,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    changePassword(request, {
      onSuccess: (data: any) => {
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
        navigate(0);
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

  return (
    <>
      <Modal
        sx={{ justifyContent: "center", alignItems: "center" }}
        open={isOpen}
        onClose={onClose}
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
            p={8}
            sx={{ backgroundColor: "white", width: 568, height: 500 }}
          >
            <Stack
              direction="row"
              sx={{
                borderRadius: 2,
                backgroundColor: "white",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography color="text.default" variant="h3">
                Parolamı Değiştir
              </Typography>
              <IconButton onClick={onClose} sx={{ justifyContent: "flex-end" }}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Typography
              color="text.default"
              variant="body1"
              flex={1}
              sx={{ mt: 2 }}
            >
              Parolanızı değiştirmeniz gerekmektedir. Lütfen aşağıdaki bilgileri
              doldurunuz.
            </Typography>
            <Box flex={1} sx={{ mt: 2 }}>
              <PasswordControl
                sx={{ width: "100%" }}
                defaultValue=""
                id="oldPassword"
                control={control}
                type="password"
                label="Şu Anki Şifre"
              />
            </Box>
            <Box flex={1} sx={{ mt: 2 }}>
              <PasswordControl
                sx={{ width: "100%" }}
                defaultValue=""
                id="password"
                control={control}
                type="password"
                label="Yeni Şifre"
              />
            </Box>
            <Box flex={1} sx={{ mt: 2 }}>
              <PasswordControl
                sx={{ width: "100%" }}
                defaultValue=""
                id="confirmPassword"
                control={control}
                type="password"
                label="Yeni Şifre (Tekrar)"
              />
            </Box>
            <Stack mt={5} justifyContent="center" alignItems="center">
              <Button
                onClick={handleSubmit(onSubmit)}
                sx={{ width: 240, mb: 3 }}
                size="medium"
                variant="contained"
                text="Onayla"
              />
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};
