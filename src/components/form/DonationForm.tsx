import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import NameInput from "./input/NameInput";
import TypeInput from "./input/TypeInput";
import { Button, Container, Stack } from "@mui/material";
import DateInput from "./input/DateInput";
import QuantityInput from "./input/QuantityInput";
import DonationInput from "../../@types/donationInput";
import { DonationType } from "../../@types/donationType";
import React from "react";
import { DonationContext } from "../../context/DonationContext";
import { DonationContextType } from "../../@types/donation";

const DonationForm = () => {
  // const minDate = dayjs().add(1, "day").toDate();
  // const maxDate = dayjs().add(3, "year").toDate();

  const schema = yup.object().shape({
    name: yup.string().trim().min(3).required(),
    type: yup
      .mixed<DonationType>()
      .oneOf(Object.values(DonationType))
      .required(),
    quantity: yup.number().required().positive(),
    date: yup.date().required(),
  });

  const methods = useForm<DonationInput>({
    resolver: yupResolver(schema),
  });
  const { donationEdition, editDonation } = React.useContext(
    DonationContext
  ) as DonationContextType;

  const onSubmit: SubmitHandler<DonationInput> = (data: DonationInput) =>
    console.log(data);

  const handleReset = () => {
    editDonation(undefined);
    methods.reset();
    methods.setValue("type", DonationType.Art_Craft_Supplies);
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
          <h2 style={{ marginLeft: 40 }}>New Donation</h2>
          <NameInput value={donationEdition?.name} />
          <TypeInput value={donationEdition?.type} />

          <DateInput value={donationEdition?.date} />
          <QuantityInput value={donationEdition?.quantity} />
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
