export interface Block {
  number: string;
  transactions: Transaction[];
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  input: string;
  value: string;
  type: TransactionType;
  gasLimit?: string;
  gasPrice?: string;
  nonce?: number;
  timestamp?: number;
  status?: 'success' | 'failed' | 'pending';
}

export type TransactionType = 'transfer' | 'swap' | 'mint' | 'burn' | 'stake' | 'other';