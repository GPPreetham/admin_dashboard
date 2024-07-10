import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { useContext, useState, useEffect } from "react";
import { useMediaQuery, Paper, IconButton } from "@mui/material";
import { ConfigContext } from "../../index";
import Sidebar from "./sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation } from "react-router-dom"; // Import useLocation

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ContentWrapper = styled(Box)(({ theme, open, isSmallScreen }) => ({
  flexGrow: 1,
  backgroundColor: "#ffffff", // Set background color to white
  padding: theme.spacing(3),
  marginLeft: () => {
    if (open && !isSmallScreen) {
      return drawerWidth; // Use the fixed drawer width when open and not on small screens
    } else if (!open && !isSmallScreen) {
      return theme.spacing(7); // Adjust this value based on your requirement
    } else {
      return 0; // No left margin when the drawer is closed on small screens
    }
  },
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingTop: theme.spacing(10), // Adjusted padding-top to create space below AppBar
  width: "100%", // Ensure the content takes full width of its container
  minWidth: `calc(50vw + ${drawerWidth}px)`, // Set min-width to ensure responsive behavior
  minHeight: "100vh", // Set minimum height to full viewport height
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
}));

const AccountDetails = () => {
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const [open, setOpen] = useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation(); // Get the current location

  const username = localStorage.getItem("username");
  const user_email = localStorage.getItem("email");

  const handleDrawerOpen = () => {
    if (!isSmallScreen) {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen]);

  // Determine the selected screen based on the pathname
  let selectedScreen = "AccountDetails";
  if (location.pathname.includes("manage-member")) {
    selectedScreen = "Manage Member";
  } else if (location.pathname.includes("transaction")) {
    selectedScreen = "Transaction";
  } else if (location.pathname.includes("manage-account")) {
    selectedScreen = "Manage Account";
  }

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    lastLogin: "Last login: Yesterday",
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open && !isSmallScreen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && !isSmallScreen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {config.project_title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        selectedScreen={selectedScreen}
      />
      <ContentWrapper open={open} isSmallScreen={isSmallScreen}>
        <DrawerHeader />
        <Typography variant="h6" gutterBottom>
          Account Details
        </Typography>
        <StyledPaper elevation={3}>
          <AccountCircleIcon
            sx={{ width: 150, height: 150, marginBottom: theme.spacing(2) }}
          />
          <Typography variant="h5">{username}</Typography>
          <Typography variant="subtitle1">{user_email}</Typography>
        </StyledPaper>
      </ContentWrapper>
    </Box>
  );
};

export default AccountDetails;
