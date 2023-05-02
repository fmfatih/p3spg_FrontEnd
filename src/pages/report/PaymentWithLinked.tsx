import { AdminTemplate, PaymentWithLinkedForm } from "../../components";

export const PaymentWithLinked = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Linkli Ödeme",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <PaymentWithLinkedForm />
    </AdminTemplate>
  );
};
