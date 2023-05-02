import { AdminTemplate, BankRedirectAddForm } from "../../components";

export const BankRedirectAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Sanal POS Banka Yönledirme Tanımlama",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <BankRedirectAddForm />
    </AdminTemplate>
  );
};
