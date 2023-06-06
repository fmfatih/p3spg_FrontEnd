import {
  Box,
  IconButton,
  Link,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "../atoms";
import { PieChart } from "react-minimal-pie-chart";
import {
  IDashboardTransaction,
  useGetDashboardTransactionDetail,
} from "../../hooks";

const Dates = [
  { label: "Günlük", value: "DAILY" },
  { label: "Haftalık", value: "WEEKLY" },
  { label: "Aylık", value: "MONTHLY" },
  { label: "Yıllık", value: "YEARLY" },
];

export type TransactionItemProps = {
  description: string;
  value: string;
  bankCode?: string;
  key2: string;
  onDetailClick?(): void;
};

const TransactionItem = ({
  description,
  value,
  key2,
  bankCode,
  onDetailClick,
}: TransactionItemProps) => {
  return (
    <Stack flex={1} width={275} p={2} border="1px solid #E7F5FB">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">{description}</Typography>
        {bankCode && (
          <Link style={{ cursor: "pointer" }} onClick={onDetailClick}>
            Detay
          </Link>
        )}
      </Stack>
      <Typography>{value} İşlem</Typography>
      <Typography variant="h4">{key2}</Typography>
    </Stack>
  );
};

export type DashboardWidgetProps = {
  items: Array<IDashboardTransaction>;
  onDateClick(value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"): void;
  widgetTitle?: string;
};

export const DashboardWidget = ({
  items,
  onDateClick,
  widgetTitle,
}: DashboardWidgetProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [isOpen, setIsOpen] = useState(false);
  const { data: transactionDetail, mutate: getDashboardTransactionDetail } =
    useGetDashboardTransactionDetail();
  const [date, setDate] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">(
    "DAILY"
  );
  const handleOpenDetail = (item: IDashboardTransaction) => {
    setIsOpen(true);
    item?.bankCode &&
      getDashboardTransactionDetail({
        period: date,
        bankCode: item.bankCode,
      });
  };
  const isDesktopH = window.innerWidth >= 1500;
  const isMediumScreen = useMediaQuery('(min-width: 900px) and (max-width: 1024px)');
  return (
    <>
      <Stack
        flex={1}
        sx={{ boxShadow: 2, borderRadius: 3 }}
        width="100%"
        px={isDesktop ? 3 : 1}
        py={isDesktop ? 4 : 2}
      >
        <Stack
          width="100%"
          direction={isDesktop ? "row" : "column"}
          justifyContent={isDesktop ? "space-between" : "flex-start"}
          alignItems={isDesktop ? "center" : "flex-start"}
        >
          <Typography mb={isDesktop ? 0 : 2} variant="h4">
            {widgetTitle}
          </Typography>
          <Stack
            spacing={1}
            sx={{ backgroundColor: "primary.extraLighter" }}
            direction="row"
            flexWrap="wrap"
            flex={isDesktop ? "" : 1}
            justifyContent={isDesktop ? "flex-start" : "center"}
            borderRadius={2}
            p={1}
          >
            {Dates.map((item: any) => {
              const handleActive = () => {
                setDate(item.value);
                onDateClick(item.value);
              };
              return (
                <Button
                  onClick={handleActive}
                  sx={{
                    backgroundColor:
                      item.value === date ? "primary.main" : null,
                    color: item.value === date ? "#FFF" : null,
                    mb: isDesktop ? 0 : 1,
                    height: 38,
                  }}
                  text={item.label}
                />
              );
            })}
          </Stack>
        </Stack>
        <Stack
          flexWrap="wrap"
          width={isDesktop ? 880 : "auto"}
          mt={3}
          direction={isDesktopH ? "row" : "column"}
        >
          {items.map((item, index) => (
            <Stack m={1}>
              <TransactionItem
                key={`${index}-${item.key}-${item.description}-${item.value}`}
                bankCode={item.bankCode}
                description={item.description}
                value={item.value}
                key2={`${item.key} TL`}
                onDetailClick={() => handleOpenDetail(item)}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
      {isOpen && (
        <Modal
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={isOpen}
        >
          <Stack
            sx={{
              borderRadius: 2,
              width: 400,
              height: 435,
              backgroundColor: "#FFF",
            }}
          >
            <Stack
              direction="row"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                backgroundColor: "white",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">{``}</Typography>
              <IconButton onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Stack flex={1} px={4}>
              <Stack height={220}>
                {transactionDetail?.data ? (
                  <PieChart
                    lineWidth={32}
                    data={transactionDetail?.data.map((transaction) => {
                      return {
                        title: transaction.value,
                        value: Number(transaction.key.replace(",", ".")),
                        color:
                          transaction.description === "Satış"
                            ? "#00B0A6"
                            : transaction.description === "İptal"
                            ? "#EEAB00"
                            : "#F5004A",
                      };
                    })}
                  />
                ) : null}
              </Stack>
              <Stack spacing={2} pt={4}>
                {transactionDetail?.data.map((transaction) => (
                  <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Stack flex={1} spacing={2} alignItems="center" direction="row">
                      <Box
                        bgcolor={
                          transaction.description === "Satış"
                            ? "#00B0A6"
                            : transaction.description === "İptal"
                            ? "#EEAB00"
                            : "#F5004A"
                        }
                        width="16px"
                        height="16px"
                        borderRadius={2}
                      />
                      <Typography color="#41414D" variant="h5">
                        {transaction.description}
                      </Typography>
                    </Stack>
                    <Typography
                      fontSize={14}
                      color="#41414D"
                      textAlign="right"
                      width={55}
                    >{`${transaction.value} adet`}</Typography>
                    <Typography
                      fontSize={14}
                      color="#41414D"
                      flex={1}
                      textAlign="right"
                    >{`${transaction.key} TL`}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Modal>
      )}
    </>
  );
};
