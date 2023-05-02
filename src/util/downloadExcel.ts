import { default as dayjs } from "dayjs";
var XLSX = require("xlsx");

export const downloadExcel = (items: Array<any>, fileName?: string) => {
  const editedFileName =
    (fileName || "Dosya") +
    "_" +
    dayjs().format("DD/MM/YYYY HH:mm").toString() +
    ".xlsx";

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(items);
  XLSX.utils.book_append_sheet(workbook, worksheet, `Excel`);
  XLSX.writeFile(workbook, editedFileName);
};
