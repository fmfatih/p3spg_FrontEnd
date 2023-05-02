import { AdminTemplate, PreAuthSalesForm } from "../../components";

export const PreAuthSalesAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Satış İşlemi",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <PreAuthSalesForm />
    </AdminTemplate>
  );
};
