import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import DonationInput from "../../../@types/donationInput";
import { DonationType } from "../../../@types/donationType";

/**
 * Type input component for the donation type
 * @returns the component
 */
function TypeInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext<DonationInput>();

  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Type"
          select
          value={field.value}
          error={!!errors.type}
          helperText={errors.type && errors.type?.message}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            field.onChange(event.target.value);
          }}
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
