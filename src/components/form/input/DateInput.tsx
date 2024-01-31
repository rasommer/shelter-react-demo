import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import DonationInput from "../../../@types/donationInput";
import React from "react";

export type DateInputProp = {
  value?: Date | undefined;
};

function DateInput(props: DateInputProp) {
  const { control } = useFormContext<DonationInput>();
  const { value } = props;
  const [donationDate, setDonationDate] = React.useState<Dayjs>(
    value === undefined ? dayjs().add(1, "day") : dayjs(value)
  );
  React.useEffect(() => {
    if (value !== undefined && dayjs(value) !== donationDate) {
      setDonationDate(dayjs(value));
    } else if (value === undefined) {
      setDonationDate(dayjs().add(1, "day"));
    }
  }, [value]);

  const maxDate = dayjs().add(3, "year");

  return (
    <Controller
      name="type"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            name="date"
            label="Date"
            inputRef={field.ref}
            value={donationDate}
            disablePast
            minDate={donationDate}
            maxDate={maxDate}
            onChange={(date) => {
              if (date !== null) {
                setDonationDate(date);
              }
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
}

export default DateInput;
