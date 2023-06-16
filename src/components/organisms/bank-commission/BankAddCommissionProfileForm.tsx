import { ICommissionProfileForPage, useAddCommissionProfile, useAuthorization, useUpdateCommissionProfile } from "../../../hooks";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const BankAddCommissionProfileForm = () => {
  const navigate = useNavigate();
  const {showCreate} = useAuthorization();
  const theme = useTheme();
  const commissionProfile = useLocation()
  .state as unknown as ICommissionProfileForPage;
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { control, reset, handleSubmit } =
    useForm<BankAddProfileFormSchemaFormValuesType>({
      resolver: zodResolver(bankAddProfileFormSchema),
    });
  const setSnackbar = useSetSnackBar();
  const { mutate: addCommissionProfile, isLoading } = useAddCommissionProfile();
  const { mutate: updateCommissionProfile, isLoading: updateLoading } = useUpdateCommissionProfile()



  
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

    if (commissionProfile && Number(commissionProfile?.id) > 0) {
      updateCommissionProfile(
        {
          ...request,
          id: commissionProfile.id,
        },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              navigate('/commission-management/commission-codedefinition');
              setSnackbar({
                severity: 'success',
                isOpen: true,
                description: data.message,
              });
            } else {
              setSnackbar({
                severity: 'error',
                description: data.message,
                isOpen: true,
              });
            }
          },
          onError: () => {
            setSnackbar({
              severity: 'error',
              description: 'İşlem sırasında bir hata oluştu',
              isOpen: true,
            });
          },
        }
      );
    } else {
      addCommissionProfile(request, {
        onSuccess: (data) => {
          if (data.isSuccess) {
            navigate('/commission-management/commission-codedefinition');
            reset({
              name: '',
              code: '',
              description: '',
            });
            setSnackbar({
              severity: 'success',
              isOpen: true,
              description: data.message,
            });
          } else {
            setSnackbar({
              severity: 'error',
              description: data.message,
              isOpen: true,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: 'error',
            description: 'İşlem sırasında bir hata oluştu',
            isOpen: true,
          });
        },
      });
    }
  };

  useEffect(() => {
    if (!!commissionProfile && JSON.stringify(commissionProfile) !== "{}") {
      reset({
        description: commissionProfile.description,
        name: commissionProfile.name,
        code: commissionProfile.code,
      });
    }
  }, [commissionProfile, reset]);

  const handleBack = () => navigate("/dashboard");

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
{!showCreate && (
  <Button
    onClick={handleSubmit(onSubmit)}
    variant="contained"
    text={commissionProfile && commissionProfile.id > 0 ? "Güncelle" : "Kaydet"}
  />
)}


          <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
        </Stack>
      </Stack>
    </>
  );
};
