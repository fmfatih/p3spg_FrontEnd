import { ICommissionProfileForPage, useAddCommissionParameterFiles, useAddCommissionProfile, useAuthorization, useUpdateCommissionProfile } from "../../../hooks";
import { Box, Card, CardContent, FormControl, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useRef, useState } from "react";

export const BankAddBulkCommissionUploadForm = () => {
  const navigate = useNavigate();
  // const {showCreate} = useAuthorization();
  const theme = useTheme();
  // const commissionProfile = useLocation()
  // .state as unknown as ICommissionProfileForPage;
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  // const { control, reset, handleSubmit } =
  //   useForm<BankAddProfileFormSchemaFormValuesType>({
  //     resolver: zodResolver(bankAddProfileFormSchema),
  //   });
  const setSnackbar = useSetSnackBar();

  // const { mutate: commissionFilesUpload,isLoading } = useAddCommissionParameterFiles();



  const FileUpdload = ({  }) => {

    const [responseData, setResponseData] = useState([])
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const { mutate: commissionFilesUpload} = useAddCommissionParameterFiles();
    
    const checkFileExtension = (file) => {
      const acceptedExtension = 'xlsx';
      const currentExtension = file.name.split('.').pop();
      return currentExtension === acceptedExtension;
  };

  const fileInput = useRef(); 

  const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
          if (checkFileExtension(selectedFile)) {
              setFile(selectedFile);
          } else {
              setFile(null);
              fileInput.current.value = ''; 
              setSnackbar({
                  severity: "error",
                  isOpen: true,
                  description: "Lütfen .xlsx formatında dosya yükleyiniz",
              });
          }
      }
  };
    
    const handleSubmit = async () => {
    

      if (!file) return;

    
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      commissionFilesUpload(formData, {
        onSuccess: (data) => {
          setLoading(false);
          // setFile(null); 
          setResponseData(data)
          if (data.isSuccess) {
            setSnackbar({
              severity: "success",
              isOpen: true,
              description: data.message || "Dosya başarıyla Yüklendi",
            });
          } else {
            setSnackbar({
              severity: "error",
              isOpen: true,
              description: data.message || "Dosya yüklenirken bir hata oluştu",
            });
          }
        },
        onError: (error) => {
          setLoading(false);
          // setFile(null); 
          setSnackbar({
            severity: "error",
            isOpen: true,
            description: "İşlem sırasında bir hata oluştu",
          });
        },
      });
    }
    return (
      <>

    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            variant="outlined"
            fullWidth
            type="file"
            onChange={handleFileChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputRef={fileInput}
            sx={{ height: '56px' }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
          text="Yükle"
            variant="contained"
            color="primary"
            disabled={!file || loading}
            onClick={handleSubmit}
            fullWidth
            sx={{ height: '55px' }}
          >
            Yükle
          </Button>
        </Grid>
      </Grid>
    </Box>
    {responseData?.data && (
  <Card sx={{ minWidth: 275, marginTop: 4 }}>
    <CardContent>
      <Typography variant="h3" component="div" color="primary" gutterBottom>
        İşlem Bilgileri
      </Typography>
      <Typography variant="h5" gutterBottom>
        Toplam Kayıt: {responseData.data?.totalRecord}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Başarılı Kayıt: {responseData?.data?.successRecord}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Başarısız Kayıt: {responseData?.data?.failRecord}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Hata Mesajları:
      </Typography>
      {responseData?.errorMessages && responseData?.errorMessages?.length > 0 ? (
  responseData?.errorMessages?.map((error, index) => (
    <Typography key={index} variant="body2" color="error">
      {error}
    </Typography>
  ))
) : (
  <Box display="flex" alignItems="center" gap={1}>
    <CheckCircleIcon color="success" fontSize="large" />
    <Typography variant="body1" style={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
      Herhangi Bir Hata Yok
    </Typography>
  </Box>
)}
    </CardContent>
  </Card>
)}


      </>
    );
  };

  const DownloadButton = () => {
    const fileURL = process.env.PUBLIC_URL + "/files/Sanal-Pos-Toplu-Komisyon-Yükleme.xlsx"; 
    return (
        <Button variant="contained" text="KOMİSYON YÜKLEME DOSYASINI İNDİR" color="primary" href={fileURL} download        sx={{ height: '55px' }}>
            Dosyayı İndir
        </Button>
    );
};


  const handleBack = () => navigate("/commission-management/commission-codedefinition");

  return (
    <>
     
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack spacing={3}>
              <Stack
                spacing={3}
                width={isDesktop ? 800 : "auto"}
                direction="column"
              >
                    <FormControl sx={{ flex: 1 }}>
          <DownloadButton/>
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
         <FileUpdload/>
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
{/* {!showCreate && (
  <Button
    onClick={handleSubmit(onSubmit)}
    variant="contained"
    text={commissionProfile && commissionProfile.id > 0 ? "Güncelle" : "Kaydet"}
  />
)} */}


          <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
        </Stack>
      </Stack>
    </>
  );
};
