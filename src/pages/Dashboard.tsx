import {
  useGetDashboardTransactionList,
  useGetDashboardBankList,
} from "../hooks";
import { Stack } from "@mui/system";
import { AdminTemplate, DashboardWidget } from "../components";
import { useEffect } from "react";
import { Container,Grid,useMediaQuery, useTheme } from "@mui/material";

export const Dashboard = () => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
const isWideScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { data: dashboardTransactionList, mutate: getDashboardTransactionList } =
    useGetDashboardTransactionList();
  const { data: dashboardBankList, mutate: getDashboardBankList } = useGetDashboardBankList();

  useEffect(() => {
    getDashboardTransactionList(
      { period: "DAILY" },
    );
  }, [getDashboardTransactionList]);

  useEffect(() => {
    getDashboardBankList(
      { period: "DAILY" },
    );
  }, [getDashboardBankList]);

  const handleTransaction = (
    value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
  ) => {
    getDashboardTransactionList(
      { period: value },
    );
  };

  const handleBankList = (value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") => {
    getDashboardBankList(
      { period: value },
    );
  };
  const isLargeScreen = useMediaQuery('(min-width: 1440px)');

  return (
    <AdminTemplate
      headerProps={{ headerTitle: "Ana Ekran", hideAddButton: true }}
    >
     
     <Stack p={isDesktop ? 3 : 0} mb={isDesktop ? 0 : 2} maxWidth={isLargeScreen ? '1200px' : (isDesktop ? '700px' : '100%')}>
  <DashboardWidget
    onDateClick={handleTransaction}
    items={dashboardTransactionList?.data || []}
    widgetTitle="Satış Tipi"
  />
</Stack>
<Stack p={isDesktop ? 3 : 0} maxWidth={isLargeScreen ? '1200px' : (isDesktop ? '700px' : '100%')}>
  <DashboardWidget
    onDateClick={handleBankList}
    items={dashboardBankList?.data || []}
    widgetTitle="Banka Satış"
  />
</Stack>
    </AdminTemplate>
  );
};
