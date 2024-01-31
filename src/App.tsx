import React from "react";
import "./App.css";
import DonationForm from "./components/form/DonationForm";
import DonationTable from "./components/list/DonationTable";
import { DonationProvider } from "./context/DonationContext";

function App() {
  return (
    <DonationProvider>
      <div className="App">
        <DonationForm />
        <DonationTable />
      </div>
    </DonationProvider>
  );
}

export default App;
