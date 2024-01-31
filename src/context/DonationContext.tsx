import React, { createContext } from "react";
import { donationData } from "../resources/data/DonationData";
import Donation, { DonationContextType } from "../@types/donation";
import { DonationType } from "../@types/donationType";

export const DonationContext = createContext<DonationContextType | null>(null);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [donations, setDonations] = React.useState([...donationData]);
  const [donationEdition, setDonationEdition] = React.useState<
    Donation | undefined
  >(undefined);
  const [donationTypeFilter, setDonationTypeFilter] =
    React.useState<DonationType | null>(null);

  const saveDonation = (donation: Donation) => {
    const newDonation: Donation = {
      id: Math.random(),
      name: donation.name,
      type: donation.type,
      quantity: donation.quantity,
      date: donation.date,
    };
    setDonations([...donations, newDonation]);
  };

  const editDonation = (donation: Donation | undefined) => {
    setDonationEdition(donation);
  };

  const updateDonation = (donation: Donation) => {
    const filteredDonations = donations.filter((d) => d.id !== donation.id);
    setDonations([...filteredDonations, donation]);
  };

  const removeDonation = (id: number) => {
    const foundIndex = donationData.findIndex((dd) => dd.id === id);
    if (foundIndex > -1) {
      donationData.splice(foundIndex, 1);
    }

    const filteredDonations = filterDonations(donationData, donationTypeFilter);
    setDonations([...filteredDonations]);
  };

  const changeDonationTypeFilter = (donationType: DonationType | null) => {
    setDonationTypeFilter(donationType);
    if (donationType === null) {
      setDonations([...donationData]);
      return;
    }
    const filtered = filterDonations(donationData, donationType);
    setDonations(filtered);
  };

  const filterDonations = (
    donationsToFilter: Donation[],
    donationType: DonationType | null
  ): Donation[] => {
    if (donationType !== null) {
      const filtered = donationsToFilter.filter((dd) => {
        const value = Object.entries(DonationType).find(
          (e) => e[0] === donationType
        )?.[1];
        return dd.type === value;
      });
      return filtered;
    }
    return donationsToFilter;
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        saveDonation,
        updateDonation,
        removeDonation,
        donationEdition,
        donationTypeFilter,
        changeDonationTypeFilter,
        editDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
