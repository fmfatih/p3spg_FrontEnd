import React, { useState } from "react";
import axios from "axios";
import { axiosInstance } from "../../config/axios";

export const DocumentUpload = () => {
  const handleFileUpload = (event: any) => {
    const files = event.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    console.log(formData);
  };

  return (
    <form>
      <label htmlFor="file">File Upload:</label>
      <input type="file" id="file" multiple onChange={handleFileUpload} />
    </form>
  );
};
