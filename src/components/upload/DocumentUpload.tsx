


import React, { useState } from "react";
import axios from "axios";
import { axiosInstance } from "../../config/axios";
import { Button, TextField } from "@mui/material";

export const DocumentUpload = ({label,documentInfoId, control, setValue,getValues}) => {
  const [files, setFiles] = useState([]);  // dosyalar ve onların documentInfoId'leri burada tutulacak

  const handleFileUpload = (documentInfoId: number) => (event: any) => {
    // Yeni dosya oluştur
    const newFile = { file: event.target.files[0], documentInfoId };
  
    // Mevcut dosyaları al
    const currentFiles = getValues('files');
  
    // Yeni dosyayı mevcut dosyalara ekleyip durumu güncelle
    setValue('files', [...currentFiles, newFile], { shouldValidate: true });
  };
  
  
  return (
    <form>
<TextField
  type="file"
  id="file"
  label={label}
  InputLabelProps={{
    shrink: true,
  }}
  variant="outlined"
  InputProps={{
    multiple: true,
    onChange: handleFileUpload(documentInfoId),
  }}
/>
    </form>
  );
};
















// import React, { useState } from "react";
// import axios from "axios";
// import { axiosInstance } from "../../config/axios";
// import { Button, TextField } from "@mui/material";

// export const DocumentUpload = ({label,documentInfoId, control, setValue}) => {
//   // const handleFileUpload = (event: any) => {
//   //   const files = event.target.files;
//   //   const formData = new FormData();

//   //   for (let i = 0; i < files.length; i++) {
//   //     formData.append("files", files[i]);
//   //   }

//   //   console.log(formData);
//   // };
  
//   // const handleFileUpload = (event: any) => {
//   //   const files = Array.from(event.target.files);
//   //   setValue('files', files, { shouldValidate: true });
//   // };

//   const handleFileUpload = (event: any) => {
//     const files = Array.from(event.target.files).map(file => ({ file, documentInfoId }));
//     setValue('files', files, { shouldValidate: true });
//   };
  

//   return (
//     <form>
//       {/* <label htmlFor="file">{label}</label>
//       <input type="file" id="file" multiple onChange={handleFileUpload} /> */}
//   <TextField
//   type="file"
//   id="file"
//   label={label}
//   InputLabelProps={{
//     shrink: true,
//   }}
//   variant="outlined"
//   InputProps={{
//     multiple: true,
//     onChange: handleFileUpload,
//   }}
// />
//     </form>
//   );
// };
