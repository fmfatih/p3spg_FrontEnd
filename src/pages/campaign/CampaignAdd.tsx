import { AdminTemplate, CampaignAddForm } from "../../components";

export const CampaignAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Kampanya Tanımlama",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <CampaignAddForm />
    </AdminTemplate>
  );
};
