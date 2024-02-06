import { Button, MenuItem, Stack, TextField } from "@mui/material";
import React from "react";
import { DonationType } from "../../@types/donationType";
import { DonationContext } from "../../context/DonationContext";
import { DonationContextType } from "../../@types/donation";

/**
 * Donation type filter component
 */
function DonationTypeFilter() {
  const { changeDonationTypeFilter } = React.useContext(
    DonationContext
  ) as DonationContextType;

  const [donationType, setDonationType] = React.useState<
    DonationType | undefined
  >(undefined);

  /**
   * Handle the choose filter event
   * @returns void
   */
  const handleChooseFilter = () => {
    changeDonationTypeFilter(donationType);
  };

  /**
   * Handle the clear filter event
   * @returns void
   */
  const handleClearFilter = () => {
    setDonationType(undefined);
    changeDonationTypeFilter(undefined);
  };

  /**
   * Handle the change event
   * @param event the event to handle
   * @returns void
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== null) {
      const donationTypeValue = event.target.value;
      const found = Object.entries(DonationType).find(
        (entry) => entry[0] === donationTypeValue
      )?.[0];
      if (found !== undefined) {
        setDonationType(found as DonationType);
      }
    }
  };

  return (
    <Stack direction="row">
      <TextField
        select
        defaultValue={donationType === undefined ? "" : donationType}
        sx={{ margin: "5px", width: "200px" }}
        value={donationType === undefined ? "" : donationType}
        onChange={handleChange}
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
