import { DonationType } from "./donationType";

export default interface DonationInput {
  name: string;
  type: DonationType;
  quantity: number;
  date: Date;
}
