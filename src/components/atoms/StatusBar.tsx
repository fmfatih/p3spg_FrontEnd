import { Box, Typography } from "@mui/material";

type StatusBarProps = {
  status: 'ACTIVE' | "PASSIVE" | "BLOCKED" | string;
};

export const StatusBar = ({status}: StatusBarProps) => {
  return (
    <Box sx={{textAlign: 'center', width: 60, borderRadius: 2, backgroundColor: status === "ACTIVE" ? "success.extraLighter" : 'warning.extraLighter', border: `1px solid ${status === "ACTIVE" ? '#00B0A6' : "#ffb800"}`}}>
      <Typography variant="overline" color={status === "ACTIVE" ? "success.main" : 'warning.main'}>{status === "ACTIVE" ? 'Aktif' : 'Pasif'}</Typography>
    </Box>
  )
}
