import Donation, { DonationData, DonationRequest } from "../@types/donation";
import DonationInput from "../@types/donationInput";
import { DonationType } from "../@types/donationType";

const createDonationFromInput = (
  donationInput: DonationInput,
  oldId: number | undefined
): Donation => {
  return {
    id: oldId ? oldId : Math.random(),
    name: donationInput.name,
    type: donationInput.type,
    quantity: donationInput.quantity,
    date: donationInput.date,
  };
};

export const createStatistics = (donations: Donation[]): DonationData[] => {
  const donationDataset: DonationData[] = [];

  const donationTypeKeys = Object.values(DonationType);
  donationTypeKeys.forEach((t) => {
    const filtered = donations.filter((d) => d.type === t);
    if (filtered.length > 0) {
      const total = filtered
        .map((f) => f.quantity)
        .reduce((total, quantity) => total + quantity);
      donationDataset.push({
        donationType: t,
        numberDonation: filtered.length,
        quantity: total,
      });
    }
  });

  return donationDataset;
};

export const createDonationFromRequest = (data: DonationRequest): Donation => {
  return { ...data, date: new Date(data.date) };
};

export default createDonationFromInput;
