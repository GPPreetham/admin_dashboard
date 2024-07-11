import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { useContext, useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { ConfigContext } from "../../index";
import Sidebar from "./sidebar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  MenuItem,
  Select,
  Button,
  TablePagination,
} from "@mui/material";
import appEndpoint from "../../appEndpoint.js"; // Assuming appEndpoint.js contains API endpoints

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
  backgroundColor: "#ffffff",
  padding: theme.spacing(3),
  marginLeft: () => {
    if (open && !isSmallScreen) {
      return drawerWidth;
    } else if (!open && !isSmallScreen) {
      return theme.spacing(7);
    } else {
      return 0;
    }
  },
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingTop: theme.spacing(10),
  width: "100%",
  minWidth: `calc(50vw + ${drawerWidth}px)`,
  minHeight: "100vh",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ffffff",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: "100%",
}));

const Transaction = () => {
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const [open, setOpen] = useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [memberId, setMemberId] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    fetchMembers(); // Fetch members data on component mount
  }, []);

  const fetchMembers = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await appEndpoint.get("members");
      if (response.status === 200) {
        setMembers(response.data); // Set members state
        setLoading(false); // Reset loading state
      } else {
        setLoading(false); // Reset loading state
        console.error("Failed to fetch members.");
      }
    } catch (error) {
      setLoading(false); // Reset loading state
      console.error("Error fetching members:", error);
    }
  };

  const handleMemberIdChange = (event) => {
    setMemberId(event.target.value);
    setShowTransactions(false);
  };

  const handleViewTransactions = async () => {
    if (memberId) {
      try {
        const response = await appEndpoint.get(
          `/transactions/history/${memberId}`
        );
        if (response.status === 200) {
          setFilteredTransactions(response.data);
          setShowTransactions(true);
        } else {
          console.error("Failed to fetch transaction history.");
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    } else {
      setShowTransactions(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        selectedScreen={"Transaction"}
      />
      <ContentWrapper open={open} isSmallScreen={isSmallScreen}>
        <DrawerHeader />
        <Typography variant="h6" gutterBottom sx={{ paddingTop: 10 }}>
          Transaction Management
        </Typography>
        <StyledPaper elevation={3}>
          {loading ? (
            <Typography>Loading members...</Typography>
          ) : (
            <Select
              value={memberId}
              onChange={handleMemberIdChange}
              variant="outlined"
              fullWidth
              displayEmpty
              renderValue={(selected) => {
                if (selected === "") {
                  return (
                    <Typography style={{ color: "#757575" }}>
                      Select Member ID
                    </Typography>
                  );
                }
                return selected;
              }}
            >
              {members.map((member) => (
                <MenuItem key={member.member_id} value={member.member_id}>
                  {member.name} ({member.member_id})
                </MenuItem>
              ))}
            </Select>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewTransactions}
            disabled={!memberId}
            sx={{ whiteSpace: "nowrap", marginTop: theme.spacing(2) }}
          >
            View Transactions
          </Button>
        </StyledPaper>
        {showTransactions && memberId && filteredTransactions.length > 0 && (
          <StyledPaper elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Operation Type</TableCell>
                  {/* <TableCell>Credited By</TableCell> */}
                  <TableCell>Credited Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredTransactions.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredTransactions
                ).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.name}</TableCell> {/* User Name */}
                    <TableCell>{transaction.member_id}</TableCell>{" "}
                    {/* Member ID */}
                    <TableCell>{transaction.type}</TableCell>{" "}
                    {/* Operation Type */}
                    {/* <TableCell>{transaction.updated_by}</TableCell>{" "} */}
                    {/* Credited By */}
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleString()}
                    </TableCell>{" "}
                    {/* Credited Date */}
                    <TableCell>{transaction.status}</TableCell> {/* Status */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </StyledPaper>
        )}

        {/* Display message if there are no transactions */}
        {showTransactions && memberId && filteredTransactions.length === 0 && (
          <Typography
            variant="body1"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            No transactions found for the selected member
          </Typography>
        )}

        {/* Loading indicator or error message */}
      </ContentWrapper>
    </Box>
  );
};

export default Transaction;
