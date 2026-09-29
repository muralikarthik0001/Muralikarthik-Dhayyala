export interface Customer {
  customerId: number;
  name: string;
  phone: string;
  address: string;
}

export interface Account {
  accountNo: number;
  customerId: number;
  accountType: 'Savings' | 'Current';
  balance: number;
}

export interface Transaction {
  transactionId: number;
  accountNo: number;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  transactionDate: string;
}

export interface JdbcLogEntry {
  id: string;
  timestamp: string;
  type: 'CONNECTION' | 'PREPARED_STMT' | 'EXECUTE_UPDATE' | 'EXECUTE_QUERY' | 'RESULT_SET' | 'EXCEPTION';
  sql?: string;
  params?: (string | number)[];
  details: string;
  status: 'SUCCESS' | 'ERROR' | 'INFO';
  durationMs: number;
}
