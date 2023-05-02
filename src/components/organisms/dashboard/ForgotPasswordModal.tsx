import { useForgotPassword, IForgotPasswordRequest } from "../../../hooks";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { InputControl, PhoneControl } from "../../molecules";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { Button, Loading } from "../..";
import CloseIcon from "@mui/icons-material/Close";

import {
  forgotPasswordFormSchema,
  ForgotPasswordFormSchemaFormValuesType,
  forgotPasswordInitialValues,
} from "./_formTypes";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal = ({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) => {
  const { control, reset, handleSubmit } =
    useForm<ForgotPasswordFormSchemaFormValuesType>({
      resolver: zodResolver(forgotPasswordFormSchema),
      defaultValues: forgotPasswordInitialValues,
    });
  const setSnackbar = useSetSnackBar();
  const { mutate: forgotPassword } = useForgotPassword();

  const onSubmit = (data: any) => {
    const request: IForgotPasswordRequest = {
      email: data.email,
      phoneNumber: `05${data.phoneNumber}`,
    };

    forgotPassword(request, {
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
                Parolamı Unuttum
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
              Telefon numaranızı ve e-posta adresinizi girerek parolanızı
              sıfırlayın.
            </Typography>
            <Box flex={1} sx={{ mt: 2 }}>
              <PhoneControl
                sx={{ width: "100%" }}
                label="Telefon Numarası"
                control={control}
                id="phoneNumber"
              />
            </Box>
            <Box flex={1} sx={{ mt: 2 }}>
              <InputControl
                sx={{ width: "100%" }}
                defaultValue=""
                id={"email"}
                control={control}
                label="E-Posta"
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
