import Donation from "../@types/donation";
import DonationInput from "../@types/donationInput";
import { donationData } from "../resources/data/DonationData";

export default function createDonation(donationInput: DonationInput): Donation {
  const newId = donationData.length;
  return {
    id: newId,
    name: donationInput.name,
    type: donationInput.type,
    quantity: donationInput.quantity,
    date: donationInput.date,
  };
}
