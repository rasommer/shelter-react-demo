import { DonationType } from "./donationType";

/**
 * Donation input interface
 */
export default interface DonationInput {
  name: string;
  type: DonationType;
  quantity: number;
  date: Date;
}
