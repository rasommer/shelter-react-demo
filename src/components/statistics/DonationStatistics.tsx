import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { DonationContextType, DonationData } from "../../@types/donation";
import { DonationContext } from "../../context/DonationContext";
import { createStatistics } from "../../utils/utils";

function DonationStatistics() {
  const { donations } = React.useContext(
    DonationContext
  ) as DonationContextType;

  const statistics: DonationData[] = React.useMemo(
    () => createStatistics([...donations]),
    [donations]
  );

  return (
    <Box sx={{ width: "80%", margin: "auto" }}>
      <h2>Donations Statistics</h2>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="Donations">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Donation Type
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Number of Donations
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Quantity
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statistics.map((s) => (
                <TableRow key={s.donationType}>
                  <TableCell align="left">{s.donationType}</TableCell>
                  <TableCell align="right">{s.numberDonation}</TableCell>
                  <TableCell align="right">{s.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default DonationStatistics;
