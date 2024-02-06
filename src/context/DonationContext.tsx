import React, { createContext, useEffect } from "react";
import Donation, {
  DonationContextType,
  DonationRequest,
} from "../@types/donation";
import { DonationType } from "../@types/donationType";
import { createDonationFromRequest } from "../utils/utils";

export const DonationContext = createContext<DonationContextType | undefined>(
  undefined
);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [donationData, setDonationData] = React.useState<Donation[]>([]);
  const fetchJson = async () => {
    const response = await fetch("./resources/data/DonationData.json");

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: DonationRequest[] = await response.json();
    const donations = data.map<Donation>((d) => createDonationFromRequest(d));
    setDonationData([...donations]);
  };
  useEffect(() => {
    fetchJson();
  }, []);

  const [donations, setDonations] = React.useState<Donation[]>([
    ...donationData,
  ]);
  useEffect(() => {
    setDonations([...donationData]);
  }, [donationData]);

  const [donationEdition, setDonationEdition] = React.useState<
    Donation | undefined
  >(undefined);
  const [donationTypeFilter, setDonationTypeFilter] = React.useState<
    DonationType | undefined
  >(undefined);

  const saveDonation = (donation: Donation) => {
    const index = donations?.findIndex((d) => d.id === donation.id);
    if (index === -1) {
      donations && setDonations([...donations, donation]);
    } else if (donations && index !== undefined) {
      donations[index] = donation;
      setDonations([...donations]);
    }
  };

  const editDonation = (donation: Donation | undefined) => {
    setDonationEdition(donation);
  };

  const updateDonation = (donation: Donation) => {
    const filteredDonations = donations?.filter((d) => d.id !== donation.id);
    filteredDonations && setDonations([...filteredDonations, donation]);
  };

  const removeDonation = (id: number) => {
    const foundIndex = donationData.findIndex((dd) => dd.id === id);
    if (foundIndex > -1) {
      donationData.splice(foundIndex, 1);
      setDonationData([...donationData]);
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
