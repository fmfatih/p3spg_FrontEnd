import { IconButton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { Button } from "../atoms";
import { BaseModal } from "./BaseModal";
import { Sidebar } from "../organisms";

export type HeaderProps = {
  headerTitle: string;
  hideAddButton?: boolean;
  hideSearchBar?: boolean;
  hideDownloadButton?: boolean;
  onClickAddButton?: () => void;
  onClickDownloadButton?: () => void;
};

export const Header = ({
  onClickAddButton,
  onClickDownloadButton,
  hideAddButton = false,
  headerTitle,
}: HeaderProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMobileMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <Stack
        px={2}
        direction="row"
        alignItems="center"
        sx={{
          py: isDesktop ? 4 : 2,
          width: "100%",
          borderBottom: "1px solid #EFEFEF",
          backgroundColor: "white",
          justifyContent: "space-between",
        }}
      >
        <Stack flex={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text" variant={isDesktop ? "h3" : 'h4'}>
              {headerTitle}
            </Typography>
            {!isDesktop && (
              <IconButton onClick={handleMobileMenuOpen}>
                {isMenuOpen ? <CloseIcon/> : <MenuIcon />}
              </IconButton>
            )}
          </Stack>
        </Stack>
        <Stack spacing={3} direction="row">
          {isDesktop && !hideAddButton && (
            <Button
              onClick={onClickAddButton}
              size="small"
              variant="contained"
              text="+ Yeni Ekle"
            />
          )}
        </Stack>
      </Stack>
      {!isDesktop && (
        <BaseModal onClose={() => setIsMenuOpen(false)} title={''} isOpen={isMenuOpen}>
          <Sidebar onCloseMenu={() => setIsMenuOpen(false)}/>
        </BaseModal>
      )}
    </>
  );
};
