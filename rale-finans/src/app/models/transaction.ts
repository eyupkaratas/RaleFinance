export default interface Transaction {
  id: number;
  dateTime: Date;
  amount: number;
  isIncome: number;
  category: string;
}
