import { Button, MenuItem, Stack, TextField } from "@mui/material";
import React from "react";
import { DonationType } from "../../@types/donationType";
import { DonationContext } from "../../context/DonationContext";
import { DonationContextType } from "../../@types/donation";

function DonationTypeFilter() {
  const { changeDonationTypeFilter, donationTypeFilter } = React.useContext(
    DonationContext
  ) as DonationContextType;

  const [donationType, setDonationType] = React.useState<DonationType | null>(
    donationTypeFilter
  );

  const handleChooseFilter = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setDonationType(donationType);
    changeDonationTypeFilter(donationType);
  };

  const handleClearFilter = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setDonationType(null);
    changeDonationTypeFilter(null);
  };
  return (
    <Stack direction="row">
      <TextField
        select
        defaultValue={donationType === null ? "" : donationType}
        sx={{ margin: "5px", width: "200px" }}
        value={donationType === null ? "" : donationType}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.value !== null) {
            const donationTypeValue = event.target.value;
            const found = Object.entries(DonationType).find(
              (entry) => entry[0] === donationTypeValue
            )?.[0];
            if (found !== undefined) {
              setDonationType(found as DonationType);
            }
          }
        }}
      >
        {Object.keys(DonationType).map((dt) => (
          <MenuItem key={dt} value={dt}>
            {Object.entries(DonationType).find((entry) => entry[0] === dt)?.[1]}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "16px" }}
        onClick={handleChooseFilter}
      >
        Filter
      </Button>
      <Button
        variant="contained"
        color="secondary"
        style={{ margin: "16px" }}
        onClick={handleClearFilter}
      >
        Clear
      </Button>
    </Stack>
  );
}

export default DonationTypeFilter;
