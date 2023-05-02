import { useNavigate } from "react-router-dom";
import { AdminTemplate, MerchantListingTable } from "../../components";

export const MerchantList = () => {
  const navigate = useNavigate();

  const handleAddButton = () => navigate("/merchant-management/merchant-identification");

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "İşyeri Listeleme",
        onClickAddButton: handleAddButton,
      }}
    >
      <MerchantListingTable onRowClick={() => {}} />
    </AdminTemplate>
  );
};
