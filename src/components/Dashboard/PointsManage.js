import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { useContext, useState, useEffect } from "react";
import {
  useMediaQuery,
  TextField,
  Button,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { ConfigContext } from "../../index";
import Sidebar from "./sidebar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import SnackbarContent from "@mui/material/SnackbarContent";
import appEndpoint from "../../appEndpoint.js";

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
}));

const PointsManage = () => {
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const [open, setOpen] = useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation(); // Get the current location

  const handleDrawerOpen = () => {
    if (!isSmallScreen) {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await appEndpoint.get("members");
      if (response.status === 200) {
        setMembers(response.data);
        setFilteredMembers(response.data); // Initialize filtered members with all members
      } else {
        console.error("Failed to fetch members.");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Determine the selected screen based on the pathname
  let selectedScreen = "PointsManage";
  if (location.pathname.includes("manage-member")) {
    selectedScreen = "Manage Member";
  } else if (location.pathname.includes("transaction")) {
    selectedScreen = "Transaction";
  } else if (location.pathname.includes("manage-account")) {
    selectedScreen = "Manage Account";
  }

  // State variables for form fields
  const [selectedMember, setSelectedMember] = useState(""); // Holds the member_id directly
  const [operationType, setOperationType] = useState("credit");
  const [points, setPoints] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state

    try {
      // Perform update points operation
      const response = await appEndpoint.post("transactions", {
        member_id: selectedMember,
        name: members.find((member) => member.member_id === selectedMember)
          ?.name,
        points_updated: points,
        description: `Points ${operationType}`,
        type: operationType,
        updated_by: "admin",
        status: "completed",
      });

      console.log("Transaction created successfully:", response.data);
      // Display success message
      setSuccessMessage("Transaction done successfully!");

      // Reset form fields after submission (optional)
      setSelectedMember("");
      setOperationType("credit");
      setPoints("");
    } catch (error) {
      console.error("Error creating transaction:", error);
      // Display error message
      setErrorMessage("Transaction Failed. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Snackbar close function
  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
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
          Points Management
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            select
            fullWidth
            label="Select Member"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            variant="outlined"
            margin="normal"
            required
          >
            {filteredMembers.map((member) => (
              <MenuItem key={member.id} value={member.member_id}>
                {member.name} ({member.member_id})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Operation Type"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            variant="outlined"
            margin="normal"
            required
          >
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="debit">Debit</MenuItem>
          </TextField>
          <TextField
            type="number"
            fullWidth
            label="Points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              inputProps: { min: 0, step: 1, pattern: "[0-9]*" },
              inputMode: "numeric",
              style: { MozAppearance: "textfield" }, // Hides the increment/decrement buttons in Firefox
            }} // Ensure positive numbers and remove increment/decrement buttons
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading} // Disable button during loading state
          >
            {loading ? "Updating..." : "Update Points"}
          </Button>
        </Box>
      </ContentWrapper>
      {/* Snackbar for success message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: theme.palette.success.main,
          }}
          message={successMessage}
        />
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: theme.palette.error.main,
          }}
          message={errorMessage}
        />
      </Snackbar>
    </Box>
  );
};

export default PointsManage;
