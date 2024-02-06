import { DonationType } from "./donationType";

/**
 * Donation interface
 */
export default interface Donation {
  id: number;
  name: string;
  type: DonationType;
  quantity: number;
  date: Date;
}

/**
 * Donation context type
 */
export type DonationContextType = {
  donations: Donation[];
  donationEdition: Donation | undefined;
  donationTypeFilter: DonationType | undefined;
  changeDonationTypeFilter: (donationType: DonationType | undefined) => void;
  saveDonation: (donation: Donation) => void;
  updateDonation: (donation: Donation) => void;
  removeDonation: (id: number) => void;
  editDonation: (donation: Donation | undefined) => void;
};

/**
 * Donation data for statistics
 */
export type DonationData = {
  donationType: DonationType;
  numberDonation: number;
  quantity: number;
};

/**
 * Donation request
 */
export type DonationRequest = {
  id: number;
  name: string;
  type: DonationType;
  quantity: number;
  date: string;
};
