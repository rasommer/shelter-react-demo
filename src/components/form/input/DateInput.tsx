import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import DonationInput from "../../../@types/donationInput";

/**
 * Date input component for the donation date
 * @returns the component
 */
function DateInput() {
  const { control } = useFormContext<DonationInput>();

  return (
    <Controller
      name="date"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            inputRef={field.ref}
            value={dayjs(field.value)}
            minDate={dayjs().add(1, "days")}
            maxDate={dayjs().add(3, "year")}
            onChange={(value) => {
              if (value) {
                field.onChange(value?.toDate());
              }
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
}

export default DateInput;
