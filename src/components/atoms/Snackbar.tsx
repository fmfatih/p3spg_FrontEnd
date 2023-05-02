import MuiSnackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSnackBar } from "../../store/Snackbar.state";

export const Snackbar = () => {
  const [snackbar, setSnackbar] = useSnackBar();
  const handleClose = () =>
    setSnackbar({ isOpen: false, severity: "success", description: "" });

  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={handleClose}
      open={snackbar.isOpen}
      autoHideDuration={6000}
      sx={{ width: 400, height: 100 }}
    >
      <MuiAlert
        severity={snackbar.severity}
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {snackbar.description}
      </MuiAlert>
    </MuiSnackbar>
  );
};
