import { AdminTemplate, PaymentWithLinkedListFilter } from "../../components";

export const PaymentWithLinkedList = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Linkli Ödeme Listeleme",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <PaymentWithLinkedListFilter />
    </AdminTemplate>
  );
};
