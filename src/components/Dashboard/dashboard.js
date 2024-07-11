import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { useContext, useState, useEffect } from "react";
import { useMediaQuery, Grid } from "@mui/material";
import { ConfigContext } from "../../index";
import Sidebar from "./sidebar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
//import { useLocation } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./dashboard.css";
import appEndpoint from "../../appEndpoint.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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
}));

const Dashboard = () => {
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const [open, setOpen] = useState(true); // Initialize open state to true
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  //const location = useLocation();

  // State to hold barData
  const [barData, setBarData] = useState({
    labels: [], // Empty initial labels
    datasets: [
      {
        label: "Members Enrolled",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [], // Empty initial data
      },
    ],
  });

  // State to hold pieData
  const [pieData, setPieData] = useState({
    labels: ["Points Earned", "Points Redeemed"],
    datasets: [
      {
        label: "Points Transaction",
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
        data: [], // Initial empty data
      },
    ],
  });

  // State to hold lineData
  const [lineData, setLineData] = useState({
    labels: [], // Initialize labels array
    datasets: [
      {
        label: "Transaction Trend",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
    ],
  });

  useEffect(() => {
    fetchMemberCounts();
    fetchPieData();
    fetchLineData();
  }, []);

  const fetchMemberCounts = async () => {
    try {
      const response = await appEndpoint.get("members");
      if (response.status === 200) {
        const memberData = response.data;
        const countsByMonth = calculateCountsByMonth(memberData);
        updateBarData(countsByMonth);
      } else {
        console.error("Failed to fetch members.");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchPieData = async () => {
    try {
      const response = await appEndpoint.get("transactions/all");
      if (response.status === 200) {
        const totalPointsCredited = response.data.totalPointsCredited;
        const totalPointsDebited = response.data.totalPointsDebited;

        const updatedPieData = {
          labels: ["Points Earned", "Points Redeemed"],
          datasets: [
            {
              label: "Points Transaction",
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB"],
              data: [totalPointsCredited, totalPointsDebited], // Assign fetched data
            },
          ],
        };

        setPieData(updatedPieData);
      } else {
        console.error("Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchLineData = async () => {
    try {
      const response = await appEndpoint.get("transactions/all");
      if (response.status === 200) {
        const transactions = response.data.transactions;

        // Calculate counts for each month
        const currentDate = new Date();
        const labels = [];
        const data = Array(6).fill(0); // Initialize data array with 6 zeros

        // Initialize labels array with the last 6 months from current month
        for (let i = 5; i >= 0; i--) {
          const month = new Date(currentDate);
          month.setMonth(month.getMonth() - i);
          labels.push(month.toLocaleString("default", { month: "short" }));
        }

        // Count transactions for each month
        transactions.forEach((transaction) => {
          const createdAt = new Date(transaction.created_at);
          const monthIndex = labels.findIndex(
            (label) =>
              label === createdAt.toLocaleString("default", { month: "short" })
          );
          if (monthIndex !== -1) {
            data[monthIndex]++;
          }
        });

        // Update lineData state with fetched data
        const updatedLineData = {
          labels: labels,
          datasets: [
            {
              ...lineData.datasets[0],
              data: data,
            },
          ],
        };
        setLineData(updatedLineData);
      } else {
        console.error("Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculateCountsByMonth = (memberData) => {
    const currentDate = new Date();
    const months = [];
    const counts = Array(6).fill(0); // Initialize counts array with 6 zeros

    // Initialize months array with the last 6 months from current month
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate);
      month.setMonth(month.getMonth() - i);
      months.push(month.toLocaleString("default", { month: "short" }));
    }

    // Count enrollments for each month
    memberData.forEach((member) => {
      const createdAt = new Date(member.created_at);
      const monthIndex = months.findIndex(
        (month) =>
          month === createdAt.toLocaleString("default", { month: "short" })
      );
      if (monthIndex !== -1) {
        counts[monthIndex]++;
      }
    });

    return counts;
  };

  const updateBarData = (countsByMonth) => {
    // Update labels and data with counts for last 6 months
    const updatedData = {
      labels: countsByMonth.map((_, index) => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - (5 - index));
        return currentDate.toLocaleString("default", { month: "short" });
      }),
      datasets: [
        {
          ...barData.datasets[0],
          data: countsByMonth,
        },
      ],
    };
    setBarData(updatedData);
  };

  const handleDrawerOpen = () => {
    if (!isSmallScreen) {
      // Only open if not on small screen
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen]);

  // Use selectedScreen as needed in the UI

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
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {config.project_title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        selectedScreen={"Dashboard"} // Pass selectedScreen if needed by Sidebar
      />
      <ContentWrapper
        className="content-wrapper"
        open={open}
        isSmallScreen={isSmallScreen}
      >
        <DrawerHeader />
        {/* <Typography variant="h6" gutterBottom>
          Dashboard
        </Typography> */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div className="chart-container">
              <Typography variant="h6" gutterBottom className="chart-title">
                Member Enrolled Trend
              </Typography>
              <div className="chart">
                <Bar data={barData} />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="chart-container">
              <Typography variant="h6" gutterBottom className="chart-title">
                Points Transaction
              </Typography>
              <div className="chart">
                <Pie data={pieData} />
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="chart-container">
              <Typography variant="h6" gutterBottom className="chart-title">
                Transaction Trend
              </Typography>
              <div className="chart">
                <Line data={lineData} />
              </div>
            </div>
          </Grid>
        </Grid>
      </ContentWrapper>
    </Box>
  );
};

export default Dashboard;
