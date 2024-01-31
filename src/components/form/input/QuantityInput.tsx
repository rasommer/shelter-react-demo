import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import DonationInput from "../../../@types/donationInput";

export type QuantityInputProp = {
  value?: number | undefined;
};

function QuantityInput(props: QuantityInputProp) {
  const { value } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext<DonationInput>();
  const [quantity, setQuantity] = React.useState<number>(1);
  useEffect(() => {
    console.log(value);
    console.log(quantity);

    if (value !== undefined && value != quantity) {
      setQuantity(value);
    } else if (value === undefined) {
      setQuantity(1);
    }
  }, [value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Quantity"
          value={quantity}
          inputProps={{ type: "number", min: 1 }}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
          onChange={handleChange}
        />
      )}
    />
  );
}

export default QuantityInput;
