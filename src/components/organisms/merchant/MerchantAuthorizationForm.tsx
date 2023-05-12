import {
  useAddMerchantVPos,
  useGetMemberVPosList,
  useGetAllMerchantList,
  useAuthorization,
} from "../../../hooks";
import { Box, FormControl, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useEffect } from "react";
import { Button, Loading } from "../../atoms";
import { SelectControl, SwitchControl } from "../../molecules";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  merchantAuthFormSchema,
  MerchantAuthFormValuesType,
  merchantAuthInitialValues,
} from "./_formTypes";

export const MerchantAuthorizationForm = () => {
  const theme = useTheme();
  const {showCreate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mutate: getMemberVPosList, data: rawMemberVPosList } =
    useGetMemberVPosList();
  const { data: rawMerchantList, isLoading: isMerchantListLoading } =
    useGetAllMerchantList();
  const { mutate: addMerchantVPos, isLoading } = useAddMerchantVPos();
  const { control, watch, handleSubmit } = useForm<MerchantAuthFormValuesType>({
    resolver: zodResolver(merchantAuthFormSchema),
    defaultValues: merchantAuthInitialValues,
  });

  useEffect(() => {
    getMemberVPosList({
      orderBy: "CreateDate",
      orderByDesc: true,
      status: "ACTIVE",
    });
  }, [getMemberVPosList]);

  const merchantId = watch("merchantId");
  const navigate = useNavigate();
  const setSnackbar = useSetSnackBar();

  const merchantList = useMemo(() => {
    return rawMerchantList?.data?.map(
      (rawPosType: { merchantName: string; merchantId: number }) => {
        return {
          label: rawPosType.merchantName,
          value: `${rawPosType.merchantId}`,
        };
      }
    );
  }, [rawMerchantList?.data]);

  const onSubmit = (data: MerchantAuthFormValuesType) => {
    const bankCodes = [];
    for (const [key, value] of Object.entries(data.bankCodes)) {
      if (value) {
        bankCodes.push(key);
      }
    }
    data.bankCodes = bankCodes;
    addMerchantVPos(
      {
        ...data,
        merchantId: Number(data.merchantId),
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            navigate("/merchant-management/merchant-listing");
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
  };

  const handleBack = () => navigate("/dashboard");

  return (
    <>
      {(isMerchantListLoading || isLoading) && <Loading />}
      <Stack flex={1}>
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack width={isDesktop ? 800 : 'auto'} spacing={3} direction="row">
              <FormControl sx={{ flex: 1 }}>
                {merchantList && (
                  <SelectControl
                    sx={{ flex: 1 }}
                    items={merchantList}
                    label="İşyeri"
                    control={control}
                    id="merchantId"
                  />
                )}
              </FormControl>
              {isDesktop && <Box sx={{ flex: 1 }} />}
            </Stack>
            {rawMemberVPosList?.data?.length && (
              <Stack direction={isDesktop ? "row" : 'column'} flexWrap="wrap">
                {rawMemberVPosList?.data?.map((field: any) => (
                  <Box my={1} mr={isDesktop ? 3 : 0} flex="44%" sx={{ maxWidth: "sm" }}>
                    <SwitchControl
                      defaultValue={field.status === "ACTIVE" ? true : false}
                      isDisabled={!merchantId}
                      label={`${field.bankCode}-${field.bankName}`}
                      control={control}
                      id={`bankCodes.${field.bankCode}`}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack
          borderTop="1px solid #E6E9ED"
          py={2}
          direction="row"
          justifyContent="flex-end"
        >
          {!!showCreate && (
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              text={"Kaydet"}
            />
          )}
          <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
        </Stack>
      </Stack>
    </>
  );
};
