import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Stack } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { DonationContextType } from "../../@types/donation";
import DonationInput from "../../@types/donationInput";
import { DonationType } from "../../@types/donationType";
import { DonationContext } from "../../context/DonationContext";
import createDonationFromInput from "../../utils/utils";
import DateInput from "./input/DateInput";
import NameInput from "./input/NameInput";
import QuantityInput from "./input/QuantityInput";
import TypeInput from "./input/TypeInput";

/**
 * Schema for the donation form
 */
const schema = yup.object().shape({
  name: yup.string().trim().min(3).required(),
  type: yup.mixed<DonationType>().oneOf(Object.values(DonationType)).required(),
  quantity: yup.number().required().positive(),
  date: yup
    .date()
    .required()
    .min(dayjs().add(1, "day").toDate())
    .max(dayjs().add(3, "year")),
});

/**
 * Donation form component and it's used to create or edit a donation
 */
const DonationForm = () => {
  /*
   * useForm is a hook provided by react-hook-form library that allows to create a form with validation
   * and it returns an object with the form methods and state
   */
  const methods = useForm<DonationInput>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      date: dayjs().add(1, "day").toDate(),
      quantity: 1,
      type: DonationType.Art_Craft_Supplies,
    },
  });

  /*
   * useContext is a hook provided by react that allows to use the context
   * and it returns the current context value for DonationContext
   */
  const { donationEdition, editDonation, saveDonation } = React.useContext(
    DonationContext
  ) as DonationContextType;

  /*
   * useEffect is a hook provided by react that allows to perform side effects in function components
   * and it runs after the render of the component
   * Provides the values for the form when the donationEdition is not undefined
   */
  useEffect(() => {
    if (donationEdition) {
      methods.setValue("name", donationEdition.name);
      methods.setValue("type", donationEdition.type);
      methods.setValue("date", donationEdition.date);
      methods.setValue("quantity", donationEdition.quantity);
    }
  }, [donationEdition, methods]);

  /*
   * onSubmit is a function that is called when the form is submitted
   * and it receives the form data as a parameter
   * It creates a donation from the form data and saves it
   */
  const onSubmit: SubmitHandler<DonationInput> = (data: DonationInput) => {
    const donation = createDonationFromInput(data, donationEdition?.id);
    saveDonation(donation);
    methods.reset();
  };

  /*
   * handleReset is a function that is called when the form is reset
   * and it resets the form and the donationEdition
   */
  const handleReset = () => {
    editDonation(undefined);
    methods.reset();
  };

  return (
    <Box>
      <FormProvider {...methods}>
        <Stack
          spacing={2}
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={methods.handleSubmit(onSubmit)}
          alignItems="center"
          margin={5}
        >
          <Stack direction="row">
            <NameInput />
            <TypeInput />
          </Stack>
          <Stack direction="row">
            <DateInput />
            <QuantityInput />
          </Stack>
          <Stack direction="row">
            <Button variant="contained" type="submit" sx={{ margin: "5px" }}>
              {donationEdition === undefined ? "Submit" : "Update"}
            </Button>
            <Button
              variant="contained"
              type="reset"
              sx={{ margin: "5px" }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Box>
  );
};

export default DonationForm;
