import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Stack } from "@mui/material";
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

const DonationForm = () => {
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

  const { donationEdition, editDonation, saveDonation } = React.useContext(
    DonationContext
  ) as DonationContextType;

  useEffect(() => {
    if (donationEdition) {
      methods.setValue("name", donationEdition.name);
      methods.setValue("type", donationEdition.type);
      methods.setValue("date", donationEdition.date);
      methods.setValue("quantity", donationEdition.quantity);
    }
  }, [donationEdition, methods]);

  const onSubmit: SubmitHandler<DonationInput> = (data: DonationInput) => {
    const donation = createDonationFromInput(data, donationEdition?.id);
    saveDonation(donation);
    methods.reset();
  };

  const handleReset = () => {
    editDonation(undefined);
    methods.reset();
  };

  return (
    <Container maxWidth="sm">
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
          <h2 style={{}}>New Donation</h2>
          <NameInput />
          <TypeInput />

          <DateInput />
          <QuantityInput />
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
    </Container>
  );
};

export default DonationForm;
