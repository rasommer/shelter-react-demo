import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import DonationForm from "../form/DonationForm";
import DonationTable from "../list/DonationTable";
import DonationStatistics from "../statistics/DonationStatistics";

function TabPanel() {
  const [visibleTab, setVisibleTab] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setVisibleTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "60%",
        margin: "auto",
        backgroundColor: "#ffffff",
        height: "calc(95% - 58px)",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs onChange={handleChange} value={visibleTab}>
          <Tab label="Donation Form" />
          <Tab label="List of Donations" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>

      <div style={{ display: visibleTab === 0 ? "block" : "none" }}>
        <DonationForm />
      </div>
      <div style={{ display: visibleTab === 1 ? "block" : "none" }}>
        <DonationTable />
      </div>
      <div style={{ display: visibleTab === 2 ? "block" : "none" }}>
        <DonationStatistics />
      </div>
    </Box>
  );
}

export default TabPanel;
