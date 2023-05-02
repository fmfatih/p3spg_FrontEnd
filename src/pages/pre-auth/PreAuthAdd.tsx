import { AdminTemplate, PreAuthAddForm } from "../../components";

export const PreAuthAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Ön Provizyon İşlemi",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <PreAuthAddForm />
    </AdminTemplate>
  );
};
