import {
  IResource,
  useAddResource,
  useGetResourceTypeSettingsList,
  useUpdateResource,
} from "../../../hooks";
import { Box, Stack } from "@mui/material";
import {
  BaseModal,
  BaseModalProps,
  InputControl,
  RadioButtonsControl,
} from "../../molecules";
import { Button } from "../../atoms";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  messageAddProfileFormSchema,
  MessageAddProfileFormSchemaFormValuesType,
  messageAddProfileInitialValues,
} from "./_formTypes";

export type MessageAddModalProps = BaseModalProps & {
  title?: string;
  message?: IResource;
};

export const MessageAddModal = ({
  message,
  onClose,
  isOpen,
  title = "Mesaj Ekle",
}: MessageAddModalProps) => {
  const { control, reset, handleSubmit } =
    useForm<MessageAddProfileFormSchemaFormValuesType>({
      resolver: zodResolver(messageAddProfileFormSchema),
      defaultValues: messageAddProfileInitialValues,
    });
  const { mutate: addResource } = useAddResource();
  const { mutate: updateResource } = useUpdateResource();
  const { data: rawResourceTypeList } = useGetResourceTypeSettingsList({});
  const setSnackbar = useSetSnackBar();

  const resourceTypeList = useMemo(() => {
    return rawResourceTypeList?.data?.map(
      (resourceType: { value: string; key: string }) => {
        return {
          label: resourceType.value,
          value: `${resourceType.key}`,
        };
      }
    );
  }, [rawResourceTypeList?.data]);

  const onSubmit = (data: any) => {
    const request = {
      ...data,
      resourceType: Number(data.resourceType),
    };

    if (message && message?.id > 0) {
      updateResource(
        { ...request, id: message.id },
        {
          onSuccess(data) {
            if (data.isSuccess) {
              onClose();
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
        }
      );
    } else {
      addResource(request, {
        onSuccess(data) {
          if (data.isSuccess) {
            onClose();
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
    }
  };

  useEffect(() => {
    if (!!message && JSON.stringify(message) !== "{}") {
      reset({
        key: message.key,
        value: message.value,
        resourceType: `${message.resourceType}`,
        language: message.language,
        externalErrorCode: undefined,
      });
    }
  }, [reset, message]);

  return (
    <BaseModal onClose={onClose} title={title} isOpen={isOpen}>
      <Stack flex={1} p={4}>
        {/* !!! --- FORM --- !!! */}
        <Stack spacing={2} flex={1}>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Box flex={1}>
              <InputControl
                size="medium"
                sx={{ flex: 1, width: "100%" }}
                id="key"
                label="Mesaj Kodu"
                control={control}
              />
            </Box>
            <Box flex={1}>
              <InputControl
                size="medium"
                sx={{ flex: 1, width: "100%" }}
                id="externalErrorCode"
                label="Entegrasyon Mesaj Kodu"
                control={control}
              />
            </Box>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Box flex={1}>
              <InputControl
                size="medium"
                sx={{ flex: 1, width: "100%" }}
                id="value"
                label="Mesaj Açıklaması"
                control={control}
              />
            </Box>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Box flex={1}>
              {resourceTypeList && (
                <RadioButtonsControl
                  row
                  title="Mesaj Türü"
                  control={control}
                  id="resourceType"
                  items={resourceTypeList}
                />
              )}
            </Box>
            <Box flex={1}>
              <RadioButtonsControl
                row
                title="Mesaj Dili"
                control={control}
                id="language"
                items={[
                  { label: "Türkçe", value: "TR" },
                  { label: "İngilizce", value: "EN" },
                ]}
              />
            </Box>
          </Stack>
        </Stack>
        {/* !!! --- Button --- !!! */}
        <Stack justifyContent="flex-end" alignItems="center" direction="row">
          <Button
            variant="contained"
            text={message ? "Güncelle" : "Ekle"}
            onClick={handleSubmit(onSubmit)}
          />
        </Stack>
      </Stack>
    </BaseModal>
  );
};
