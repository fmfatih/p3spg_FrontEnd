import { useNavigate } from "react-router-dom";
import { AdminTemplate, CampaignListTable } from "../../components";

export const CampaignList = () => {
  const navigate = useNavigate();

  const handleAddButton = () => navigate("/campaign-management/campaign-definition");

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Kampanya Listeleme",
        onClickAddButton: handleAddButton,
      }}
    >
      <CampaignListTable/>
    </AdminTemplate>
  );
};
