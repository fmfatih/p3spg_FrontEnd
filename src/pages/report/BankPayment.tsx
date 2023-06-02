
import { AdminTemplate, BankPaymentComponent  } from "../../components";

export const BankPayment = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Banka Hak Ediş Raporları",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
    <BankPaymentComponent/>
    </AdminTemplate>
  );
};
