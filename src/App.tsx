import "./App.css";
import TabPanel from "./components/tab/TabPanel";
import { DonationProvider } from "./context/DonationContext";
import "./App.css";
import { Box } from "@mui/material";

function App() {
  return (
    <Box sx={{ backgroundColor: "#d2d5d9", height: "100%" }}>
      <div id="title">
        <div>Donation Management</div>
      </div>
      <DonationProvider>
        <TabPanel />
      </DonationProvider>
    </Box>
  );
}

export default App;
