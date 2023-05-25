import { Logo150 } from "../../assets/images";
import { Box, IconButton, Stack, Typography, Link, useTheme, useMediaQuery } from "@mui/material";
import {
  DashboardIcon,
  UserIcon,
} from "../../assets/icons";
import { NavigationItem } from "../molecules";
import { initialUserInfoState, useUserInfo } from "../../store/User.state";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../../common/storageKeys";
import { useGetUserMenuList } from "../../hooks";

export type SidebarProps = {
  onCloseMenu?: () => void;
}

export const Sidebar = ({onCloseMenu}: SidebarProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { data: userMenu } = useGetUserMenuList();
  const [userInfo, setUserInfo] = useUserInfo();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserInfo(initialUserInfoState);
    localStorage.setItem(StorageKeys.bearerToken, "");
    localStorage.setItem(StorageKeys.expireDate, "");
    navigate("/");
  };

  const getShortName = (name: string) => {
    const splittedName = name.split(" ");
    const size = splittedName.length;
    if (size > 1)
      return (
        splittedName[0]?.charAt(0).toUpperCase() +
        splittedName[size - 1].charAt(0).toUpperCase()
      );

    return "";
  };

  
  
  return (
    <Box maxWidth={isDesktop ? 260 : undefined}>
      <Stack
        sx={{
          borderRight: "1px solid #EFEFEF",
          backgroundColor: "white",
          px: 2,
          pt: isDesktop ? 3 : 0,
          height: isDesktop ? "100vh" : 'auto',
          overflow: "scroll",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          {isDesktop && (
            <Stack
              alignItems={isDesktop ? "center" : 'space-between'}
              justifyContent={isDesktop ? "center" : 'space-between'}
              pb={isDesktop ? 4 : 0}
              direction={isDesktop ? "column" : 'row'}
              borderBottom="1px solid #C0C0C7"
              height={isDesktop ? 100 : 'auto'}
            >
              <Link href="/dashboard">
                <img width={isDesktop ? 100 : 50} src={Logo150} alt="logo" />
              </Link>
            </Stack>
          )}
          <Stack>
            <NavigationItem
              url="dashboard"
              title="Ana Ekran"
              Icon={DashboardIcon}
            />
            {userMenu?.data?.map((menuItem) => (
              <NavigationItem
                url={menuItem.id}
                title={menuItem.title}
                Icon={UserIcon}
                navItems={
                  menuItem?.childs
                    ? menuItem?.childs?.map((childItem) => {
                        return {
                          text: childItem.title,
                          url: `${menuItem.id}/${childItem.id}`,
                        };
                      })
                    : undefined
                }
              />
            ))}
          </Stack>
        </Stack>
        <Stack
          sx={{ borderTop: "1px solid #C0C0C7", py: 3, cursor: "pointer" }}
          direction="row"
        >
          <Stack
            sx={{
              mr: 1,
              width: 38,
              height: 38,
              borderRadius: 20,
              backgroundColor: "#0C9FDC",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography color="text.onDark" variant="h5">
              {getShortName(userInfo.fullName)}
            </Typography>
          </Stack>
          <Stack
            flex={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                sx={{ lineHeight: 1.25 }}
                variant="overline"
                color="text.subtle"
              >
                Merhaba
              </Typography>
              <Typography sx={{ lineHeight: 1.25 }} variant="body2">
                {userInfo.fullName}
              </Typography>
            </Box>
            <IconButton onClick={handleLogout}>
              <ExitToAppIcon color="error" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
