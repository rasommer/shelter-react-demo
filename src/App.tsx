import React from "react";
import "./App.css";
import DonationForm from "./components/form/DonationForm";
import DonationTable from "./components/list/DonationTable";
import { DonationProvider } from "./context/DonationContext";
import DonationStatistics from "./components/statistics/DonationStatistics";

function App() {
  return (
    <DonationProvider>
      <div className="App">
        <DonationForm />
        <DonationTable />
        <DonationStatistics />
      </div>
    </DonationProvider>
  );
}

export default App;
