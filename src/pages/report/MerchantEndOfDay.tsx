import { AdminTemplate, MerchantEndOfDayComponent } from "../../components";

export const MerchantEndOfDay = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "İşyeri Hak Ediş Raporları",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <MerchantEndOfDayComponent />
    </AdminTemplate>
  );
};
