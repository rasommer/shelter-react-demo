import React, { createContext } from "react";
import Donation, { DonationContextType } from "../@types/donation";
import { DonationType } from "../@types/donationType";
import { donationData } from "../resources/data/DonationData";

export const DonationContext = createContext<DonationContextType | undefined>(
  undefined
);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [donations, setDonations] = React.useState([...donationData]);
  const [donationEdition, setDonationEdition] = React.useState<
    Donation | undefined
  >(undefined);
  const [donationTypeFilter, setDonationTypeFilter] = React.useState<
    DonationType | undefined
  >(undefined);

  const saveDonation = (donation: Donation) => {
    const index = donations.findIndex((d) => d.id === donation.id);
    if (index === -1) {
      setDonations([...donations, donation]);
    } else {
      donations[index] = donation;
      setDonations([...donations]);
    }
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

  const changeDonationTypeFilter = (donationType: DonationType | undefined) => {
    setDonationTypeFilter(donationType);
    if (donationType === undefined) {
      setDonations([...donationData]);
      return;
    }
    const filtered = filterDonations(donationData, donationType);
    setDonations(filtered);
  };

  const filterDonations = (
    donationsToFilter: Donation[],
    donationType: DonationType | undefined
  ): Donation[] => {
    if (donationType !== undefined) {
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
