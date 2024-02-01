import { DonationType } from "./donationType";

export default interface Donation {
  id: number;
  name: string;
  type: DonationType;
  quantity: number;
  date: Date;
}

export type DonationContextType = {
  donations: Donation[];
  donationEdition: Donation | undefined;
  donationTypeFilter: DonationType | null;
  changeDonationTypeFilter: (donationType: DonationType | null) => void;
  saveDonation: (donation: Donation) => void;
  updateDonation: (donation: Donation) => void;
  removeDonation: (id: number) => void;
  editDonation: (donation: Donation | undefined) => void;
};

export type DonationData = {
  donationType: DonationType;
  numberDonation: number;
  quantity: number;
};
