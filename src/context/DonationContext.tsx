import React, { createContext, useEffect } from "react";
import Donation, {
  DonationContextType,
  DonationRequest,
} from "../@types/donation";
import { DonationType } from "../@types/donationType";
import { createDonationFromRequest } from "../utils/utils";

/**
 * Context for the donation data and operations
 */
export const DonationContext = createContext<DonationContextType | undefined>(
  undefined
);

/**
 * Provider for the donation context
 */
export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [donationData, setDonationData] = React.useState<Donation[]>([]);

  // Fetch the donation data from the json file
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

  /**
   * Save a donation
   * @param donation the donation to save
   * @returns void
   */
  const saveDonation = (donation: Donation) => {
    const index = donations?.findIndex((d) => d.id === donation.id);
    if (index === -1) {
      donations && setDonations([...donations, donation]);
    } else if (donations && index !== undefined) {
      donations[index] = donation;
      setDonations([...donations]);
    }
  };

  /**
   * Edit a donation
   * @param donation the donation to edit
   * @returns void
   */
  const editDonation = (donation: Donation | undefined) => {
    setDonationEdition(donation);
  };

  /**
   * Update a donation
   * @param donation the donation to update
   * @returns void
   */
  const updateDonation = (donation: Donation) => {
    const filteredDonations = donations?.filter((d) => d.id !== donation.id);
    filteredDonations && setDonations([...filteredDonations, donation]);
  };

  /**
   * Remove a donation
   * @param id the id of the donation to remove
   * @returns void
   */
  const removeDonation = (id: number) => {
    const foundIndex = donationData.findIndex((dd) => dd.id === id);
    if (foundIndex > -1) {
      donationData.splice(foundIndex, 1);
      setDonationData([...donationData]);
    }

    const filteredDonations = filterDonations(donationData, donationTypeFilter);
    setDonations([...filteredDonations]);
  };

  /**
   * Change the donation type filter
   * @param donationType the donation type to filter
   * @returns void
   */
  const changeDonationTypeFilter = (donationType: DonationType | undefined) => {
    setDonationTypeFilter(donationType);
  };

  /**
   * Filter the donations
   * @param donationsToFilter the donations to filter
   * @param donationType the donation type to filter
   * @returns the filtered donations
   */
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
