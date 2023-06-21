import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  FormControl,
  TextField,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import Snackbar from '@mui/material/Snackbar';
import { GridCloseIcon } from '@mui/x-data-grid';

export  const DocumentUpload= ({ control }) => {
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [selectedFileIndex, setSelectedFileIndex] = useState();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const fileInputRef = useRef(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
  
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'doc', 'pdf', 'xlsx'];

    const handleUploadClick = (file, url) => {
      const extension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(extension)) {
        setFiles([...files, {file, url}]); 
      } else {
        setSnackbarMessage('Bu dosya türüne izin verilmiyor. Lütfen .jpg, .png, .doc, .pdf veya .xlsx bir dosya yükleyin.');
        setSnackbarOpen(true);
      }
    };
    
    const handleRemoveClick = (index) => {
      setSelectedFileIndex(index);
      setOpen(true);
    };
  
    const handleRemoveConfirm = () => {
      setFiles(files.filter((_, index) => index !== selectedFileIndex));
      setOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
  
    const handleRemoveCancel = () => {
      setOpen(false);
    };

    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
        setModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setModalOpen(false);
        setModalImage(null);
      };
    

  return (
    <>
     <Stack spacing={3} direction="row" width={isDesktop ? 800 : 'auto'}>
         <FormControl>
        <Controller
          control={control}
          name="files"
          render={({ field: { onChange } }) => (
            <TextField
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                const fileObjects = Array.from(e.target.files).map(file => ({file, url: URL.createObjectURL(file)}));
                onChange(fileObjects.map(fileObject => fileObject.file));
                fileObjects.forEach(fileObject => handleUploadClick(fileObject.file, fileObject.url));
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              multiple
            />
          )}
        />
<Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  {files.map((fileObject, index) => (
    <div key={index} style={{ position: 'relative', margin: '10px 0' }}>
      <div style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {fileObject.file.type === 'application/pdf' ? (
          <img src="/path/to/pdf_icon.png" alt={`preview ${index}`} style={{ width: '50px', height: '50px' }}/>
        ) : (
          <img src="/path/to/file_icon.png" alt={`preview ${index}`} style={{ width: '50px', height: '50px' }}/>
        )}
        <div style={{ fontSize: '12px', marginTop: '5px' }}>
          {fileObject.file.name}
        </div>
      </div>
      <Button style={{ position: 'absolute', top: 0, right: -25 }} onClick={() => handleRemoveClick(index)}>X</Button>
    </div>
  ))}
</Box>


      </FormControl>
      </Stack>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
      >
    <DialogContent>
    {modalImage && modalImage.includes('.pdf') ? (
      <object data={modalImage} type="application/pdf" width="100%" height="100%"/>
    ) : (
      <img src={modalImage} alt="modal-view" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    )}
  </DialogContent>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleRemoveCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Dökümanı silmek istediğinize emin misiniz?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bu işlemi geri alamazsınız.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveCancel}>Hayır</Button>
          <Button onClick={handleRemoveConfirm} autoFocus>
            Evet
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar 
  open={snackbarOpen} 
  autoHideDuration={6000} 
  onClose={() => setSnackbarOpen(false)} 
  message={snackbarMessage}
  action={
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
        <GridCloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  }
/>
    </>
  );
};
