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
  const { value } = props;
  const [name, setName] = React.useState<string>("");

  return (
    <Controller
      name="name"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Name"
          type="text"
          value={value === undefined ? name : value}
          helperText={errors.name && errors.name?.message}
          InputLabelProps={value === undefined ? {} : { shrink: true }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
        />
      )}
    />
  );
}

export default NameInput;
