import Donation, { DonationData, DonationRequest } from "../@types/donation";
import DonationInput from "../@types/donationInput";
import { DonationType } from "../@types/donationType";

/**
 * Create a donation from the input
 * @param donationInput the donation input
 * @param oldId the old id
 * @returns the donation
 */
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

/**
 * Create the statistics from the donations
 * @param donations the donations
 * @returns the statistics
 */
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

/**
 * Create a donation from the request
 * @param data the donation request
 * @returns the donation
 */
export const createDonationFromRequest = (data: DonationRequest): Donation => {
  return { ...data, date: new Date(data.date) };
};

export default createDonationFromInput;
