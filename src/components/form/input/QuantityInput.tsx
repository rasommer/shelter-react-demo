import { TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import DonationInput from "../../../@types/donationInput";

function QuantityInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext<DonationInput>();

  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Quantity"
          value={field.value}
          inputProps={{ type: "number", min: 1 }}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
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

export default QuantityInput;
