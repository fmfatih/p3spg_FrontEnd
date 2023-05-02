import { useAddCommissionProfile } from "../../../hooks";
import { FormControl, useMediaQuery, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { Button, Loading } from "../../atoms";
import { InputControl } from "../../molecules";
import { useForm } from "react-hook-form";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import {
  bankAddProfileFormSchema,
  BankAddProfileFormSchemaFormValuesType,
} from "./_formTypes";
import { zodResolver } from "@hookform/resolvers/zod";

export const BankAddCommissionProfileForm = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { control, reset, handleSubmit } =
    useForm<BankAddProfileFormSchemaFormValuesType>({
      resolver: zodResolver(bankAddProfileFormSchema),
    });
  const setSnackbar = useSetSnackBar();
  const { mutate: addCommissionProfile, isLoading } = useAddCommissionProfile();

  const onSubmit = ({
    description,
    name,
    code,
  }: BankAddProfileFormSchemaFormValuesType) => {
    const request = {
      description,
      code,
      name,
    };

    addCommissionProfile(request, {
      onSuccess(data) {
        if (data.isSuccess) {
          reset({
            name: "",
            code: "",
            description: "",
          });
          setSnackbar({
            severity: "success",
            isOpen: true,
            description: data.message,
          });
        } else {
          setSnackbar({
            severity: "error",
            isOpen: true,
            description: data.message,
          });
        }
      },
      onError: () => {
        setSnackbar({
          severity: "error",
          isOpen: true,
          description: "İşlem sırasında bir hata oluştu",
        });
      },
    });
  };

  return (
    <>
      {isLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction="row"
              >
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    id="name"
                    control={control}
                    label="Komisyon Adı"
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    id="code"
                    control={control}
                    label="Komisyon Kodu"
                  />
                </FormControl>
              </Stack>
            </Stack>
            <Stack spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction="row"
              >
                <FormControl sx={{ flex: 1 }}>
                  <InputControl
                    id="description"
                    control={control}
                    label="Açıklama"
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          borderTop="1px solid #E6E9ED"
          py={2}
          pr={2}
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            text={"Kaydet"}
          />
        </Stack>
      </Stack>
    </>
  );
};
