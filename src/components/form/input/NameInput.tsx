import { TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import DonationInput from "../../../@types/donationInput";

/**
 * Name input component for the donation name
 * @returns the component
 */
function NameInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext<DonationInput>();

  return (
    <Controller
      name="name"
      control={control}
      defaultValue="test"
      render={({ field }) => (
        <TextField
          {...field}
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          value={field.value}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            field.onChange(event.target.value);
          }}
        />
      )}
    />
  );
}

export default NameInput;
