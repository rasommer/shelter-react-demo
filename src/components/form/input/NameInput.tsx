import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import DonationInput from "../../../@types/donationInput";
import React from "react";

export type NameInputProp = {
  value?: string | undefined;
};

function NameInput(props: NameInputProp) {
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
            console.log(errors);

            field.onChange(event.target.value);
          }}
        />
      )}
    />
  );
}

export default NameInput;
