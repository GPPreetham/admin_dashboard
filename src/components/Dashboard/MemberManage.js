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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
  TextField,
  IconButton,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
  Snackbar,
} from "@mui/material";
import { ConfigContext } from "../../index";
import Sidebar from "./sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "./MemberManage.css";
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
  minHeight: "100vh", // Set minimum height to full viewport height
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ffffff",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: "100%", // Ensure the Paper component takes full width of its container
}));

const MemberManage = () => {
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const [open, setOpen] = useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    // member_id: "",
    //points: "",
  });
  const [isAddMode, setIsAddMode] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarMessageType, setSnackbarMessageType] = useState("success");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const handleSnackbarOpen = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarMessageType(type);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const fetchMembers = async () => {
    try {
      const response = await appEndpoint.get("members");
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        console.error("Failed to fetch members.");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModalOpen = () => {
    setIsAddMode(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setIsAddMode(true);
    // Clear new member form fields on modal close
    setNewMember({
      name: "",
      email: "",
      // member_id: "",
      // points: "",
    });
  };

  const handleEditMember = (user) => {
    setIsAddMode(false);
    setNewMember({
      id: user.id,
      name: user.name,
      email: user.email,
      member_id: user.member_id,
      points: user.points,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  // const handleAddMember = async () => {
  //   try {
  //     const response = await appEndpoint.post("/members/add", {
  //       member_id: newMember.member_id,
  //       name: newMember.name,
  //       email: newMember.email,
  //       points: newMember.points,
  //     });
  //     if (response.status === 200) {
  //       fetchMembers();
  //       setMessage("Member added successfully.");
  //       setMessageType("success");
  //       handleModalClose();
  //     } else {
  //       console.error("Failed to add member.");
  //       setMessage("Failed to add member.");
  //       setMessageType("error");
  //     }
  //   } catch (error) {
  //     console.error("Error adding member:", error);
  //     setMessage("Failed to add member.");
  //     setMessageType("error");
  //   }
  // };

  const handleAddMember = async (event) => {
    event.preventDefault();
    const { member_id, name, email, points } = newMember;
    if (!member_id || !name || !email || !points) {
      handleSnackbarOpen("Please fill in all fields.", "error");
      return;
    }
    const payload = { member_id, name, email, points };

    try {
      console.log(">>>>>", payload);
      const response = await appEndpoint.post("members", payload);
      if (response.status === 200) {
        handleSnackbarOpen("Member added successfully.", "success");
        fetchMembers();
        handleModalClose();
      } else {
        console.error("Failed to add member:", response.data.message);
        handleSnackbarOpen("Failed to add member.", "error");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      handleSnackbarOpen("Failed to add member. (Error)", "error");
    }
  };

  const handleUpdateMember = async (event) => {
    event.preventDefault();
    const { name, email, points } = newMember;
    const payload = { name, email, points };
    try {
      const response = await appEndpoint.put(
        `members/${newMember.member_id}`,
        payload
      );
      if (response.status === 200) {
        handleSnackbarOpen("Member updated successfully.", "success");
        fetchMembers();
        handleModalClose();
      } else {
        console.error("Failed to update member.");
        handleSnackbarOpen("Failed to update member.", "error");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      handleSnackbarOpen("Failed to update member. (Error)", "error");
    }
  };

  // const handleDeleteMember = async (memberId) => {
  //   try {
  //     const response = await appEndpoint.delete(`members/${memberId}`);
  //     if (response.status === 200) {
  //       fetchMembers();
  //       setMessage("Member deleted successfully.");
  //       setMessageType("success");
  //     } else {
  //       console.error("Failed to delete member.");
  //       setMessage("Failed to delete member.");
  //       setMessageType("error");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting member:", error);
  //     setMessage("Failed to delete member.");
  //     setMessageType("error");
  //   }
  // };

  const handleDeleteMember = async (memberId) => {
    setMemberToDelete(memberId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await appEndpoint.delete(`members/${memberToDelete}`);
      if (response.status === 200) {
        fetchMembers();
        handleSnackbarOpen("Member deleted successfully.", "success");
      } else {
        console.error("Failed to delete member.");
        handleSnackbarOpen("Failed to delete member.", "error");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      handleSnackbarOpen("Failed to delete member. (Error)", "error");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.member_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open && !isSmallScreen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(!open)}
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
        handleDrawerClose={() => setOpen(false)}
        selectedScreen={"MemberManage"}
      />
      <ContentWrapper
        open={open}
        isSmallScreen={isSmallScreen}
        className="content"
      >
        <DrawerHeader />
        <Typography variant="h6" gutterBottom>
          Member Management
        </Typography>
        <StyledPaper elevation={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: theme.spacing(2),
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                classes: {
                  root: "search-field-root",
                  adornedStart: "search-field-adorned-start",
                },
              }}
              InputLabelProps={{
                classes: {
                  root: "search-label-root",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: theme.spacing(2), whiteSpace: "nowrap" }}
              onClick={handleModalOpen}
            >
              Add Member
            </Button>
          </Box>
        </StyledPaper>
        <StyledPaper elevation={3}>
          {filteredUsers.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.member_id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.points}</TableCell>
                    <TableCell>
                      <IconButton
                        color="gray-color"
                        size="small"
                        onClick={() => handleEditMember(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteMember(user.member_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No users found.</Typography>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </StyledPaper>
        <Dialog
          open={modalOpen}
          onClose={handleModalClose}
          fullWidth
          maxWidth="sm"
          classes={{ root: "dialog-root", paper: "dialog-paper" }}
        >
          <DialogTitle style={{ textAlign: "center", color: "#000000" }}>
            {isAddMode ? "Add New Member" : "Update Member"}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <form onSubmit={isAddMode ? handleAddMember : handleUpdateMember}>
              <div className="form-row">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newMember.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newMember.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Render member_id and points only when adding a new member */}
              {isAddMode && (
                <>
                  <div className="form-row">
                    <label htmlFor="member_id">Member ID:</label>
                    <input
                      type="text"
                      id="member_id"
                      name="member_id"
                      value={newMember.member_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label htmlFor="points">Points:</label>
                    <input
                      type="number"
                      id="points"
                      name="points"
                      value={newMember.points}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}
              <DialogActions className="dialog-actions">
                <Button
                  variant="outlined"
                  onClick={handleModalClose}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {isAddMode ? "Add" : "Update"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </ContentWrapper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        fullWidth
        maxWidth="sm"
        classes={{ root: "dialog-root", paper: "dialog-paper" }}
      >
        <DialogTitle style={{ textAlign: "center", color: "#000000" }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="body1">
            Are you sure you want to delete this member?
          </Typography>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            color="primary"
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SnackbarContent
          sx={{
            backgroundColor:
              snackbarMessageType === "success"
                ? theme.palette.success.main
                : theme.palette.error.main,
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </Box>
  );
};

export default MemberManage;
