import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import DonationInput from "../../../@types/donationInput";
import { DonationType } from "../../../@types/donationType";

export type TypeInputProp = {
  value?: DonationType | undefined;
};

function TypeInput(props: TypeInputProp) {
  const { value } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext<DonationInput>();
  const [donationType, setDonationType] = React.useState<DonationType>(
    DonationType.Art_Craft_Supplies
  );
  React.useEffect(() => {
    if (value !== undefined && value !== donationType) {
      setDonationType(value);
    } else if (value === undefined) {
      setDonationType(DonationType.Art_Craft_Supplies);
    }
  }, [value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDonationType(event.target.value as DonationType);
  };

  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Type"
          select
          value={donationType}
          defaultValue={donationType}
          error={!!errors.type}
          helperText={errors.type && errors.type?.message}
          onChange={handleChange}
        >
          {Object.values(DonationType).map((dt) => (
            <MenuItem key={dt} value={dt}>
              {dt.valueOf()}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

export default TypeInput;
