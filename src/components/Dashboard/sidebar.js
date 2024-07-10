import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const DrawerComp = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenus, setOpenMenus] = React.useState({
    "manage-member": false,
    "manage-account": false,
  });

  const handleSubMenuClick = (menu) => {
    setOpenMenus((prevOpenMenus) => ({
      ...prevOpenMenus,
      [menu]: !prevOpenMenus[menu],
    }));
  };

  const navigateTo = (route) => {
    navigate(route);
  };

  const isSubMenuOpen = (menu) => {
    return openMenus[menu];
  };

  const isSubMenuSelected = (menu, submenu) => {
    // Check if the current location matches either the menu or submenu
    if (menu === "manage-member") {
      return (
        location.pathname.includes("membermanage") ||
        location.pathname.includes("pointsmanage")
      );
    }

    return (
      location.pathname.includes(menu) || location.pathname.includes(submenu)
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigateTo("/login");
  };

  return (
    <DrawerComp variant="permanent" open={open}>
      <DrawerHeader>
        {open ? (
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        ) : null}
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => navigateTo("/dashboard")}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              backgroundColor:
                location.pathname === "/dashboard"
                  ? theme.palette.action.selected
                  : "transparent",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => handleSubMenuClick("manage-member")}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              backgroundColor: isSubMenuSelected(
                "manage-member",
                "membermanage"
              )
                ? theme.palette.action.selected
                : "transparent",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <GroupIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Member"
              sx={{ opacity: open ? 1 : 0 }}
            />
            {open &&
              (isSubMenuOpen("manage-member") ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              ))}
          </ListItemButton>
          <Collapse
            in={isSubMenuOpen("manage-member")}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() => navigateTo("/membermanage")}
                sx={{
                  pl: 4,
                  backgroundColor:
                    location.pathname === "/membermanage"
                      ? theme.palette.action.selected
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Member Management" />
              </ListItemButton>
              <ListItemButton
                onClick={() => navigateTo("/pointsmanage")}
                sx={{
                  pl: 4,
                  backgroundColor:
                    location.pathname === "/pointsmanage"
                      ? theme.palette.action.selected
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                  <AccountBalanceWalletIcon />
                </ListItemIcon>
                <ListItemText primary="Points Management" />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>

        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => navigateTo("/transaction")}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              backgroundColor:
                location.pathname === "/transaction"
                  ? theme.palette.action.selected
                  : "transparent",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <SyncAltIcon />
            </ListItemIcon>
            <ListItemText
              primary="Transaction"
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => handleSubMenuClick("manage-account")}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              backgroundColor:
                isSubMenuSelected("manage-account", "accountdetails") ||
                isSubMenuSelected("manage-account", "logout")
                  ? theme.palette.action.selected
                  : "transparent",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Account"
              sx={{ opacity: open ? 1 : 0 }}
            />
            {open &&
              (isSubMenuOpen("manage-account") ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              ))}
          </ListItemButton>
          <Collapse
            in={isSubMenuOpen("manage-account")}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() => navigateTo("/accountdetails")}
                sx={{
                  pl: 4,
                  backgroundColor:
                    location.pathname === "/accountdetails"
                      ? theme.palette.action.selected
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Account Details" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleLogout()}
                sx={{
                  pl: 4,
                  backgroundColor:
                    location.pathname === "/login"
                      ? theme.palette.action.selected
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>
      </List>
      <Divider />
    </DrawerComp>
  );
};

export default Sidebar;
