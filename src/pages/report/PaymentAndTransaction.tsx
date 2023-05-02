import { AdminTemplate, PaymentAndTransactionFilter } from "../../components";

export const PaymentAndTransaction = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Ödeme ve İşlem Raporları",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <PaymentAndTransactionFilter />
    </AdminTemplate>
  );
};
