import Transaction from './transaction';

export default interface GroupedTransactions {
  transactions: Transaction[];
  totalIncome: number;
  name: string;
}
