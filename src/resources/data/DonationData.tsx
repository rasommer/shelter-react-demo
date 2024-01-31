import dayjs from "dayjs";
import Donation from "../../@types/donation";
import { DonationType } from "../../@types/donationType";

export const donationData: Donation[] = [
  {
    id: Math.floor(Math.random() * 10000000),
    name: "John Doe",
    type: DonationType.Clothing,
    date: dayjs().add(5, "day").toDate(),
    quantity: 5,
  },
  {
    id: Math.floor(Math.random() * 10000000),
    name: "Albert Stein",
    type: DonationType.Canned_Goods,
    date: dayjs().add(2, "month").toDate(),
    quantity: 1,
  },
  {
    id: Math.floor(Math.random() * 10000000),
    name: "Joe Bloggs",
    type: DonationType.Canned_Goods,
    date: dayjs().add(1, "month").add(5, "days").toDate(),
    quantity: 6,
  },
];

export const removeDonation = (id: number) => {
  const index = donationData.findIndex((d) => d.id === id);
  if (index > -1) {
    donationData.splice(index, 1);
  }
};
