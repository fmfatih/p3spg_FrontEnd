import { AdminTemplate, BankAddCommissionForm } from "../../components";

export const BankAddCommission = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Üye İşyeri Komisyon Tanımlama",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <BankAddCommissionForm />
    </AdminTemplate>
  );
};
