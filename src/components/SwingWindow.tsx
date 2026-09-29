import React, { useState } from 'react';
import { Account, Customer, Transaction, JdbcLogEntry } from '../types/bank';
import { 
  Building2, 
  UserPlus, 
  UserCheck, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Scale, 
  History, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  RotateCcw
} from 'lucide-react';

interface SwingWindowProps {
  customers: Customer[];
  accounts: Account[];
  transactions: Transaction[];
  onAddAccount: (customer: Omit<Customer, 'customerId'>, account: Omit<Account, 'customerId'>) => { customerId: number };
  onDeposit: (accountNo: number, amount: number) => { newBalance: number };
  onWithdraw: (accountNo: number, amount: number) => { newBalance: number };
  onDeleteAccount: (accountNo: number) => boolean;
  addJdbcLog: (entry: Omit<JdbcLogEntry, 'id' | 'timestamp'>) => void;
  onSelectTab?: (tab: 'SWING' | 'DATABASE' | 'JDBC' | 'CODE' | 'VIVA') => void;
}

type ActiveView = 'CREATE' | 'VIEW' | 'DEPOSIT' | 'WITHDRAW' | 'BALANCE' | 'TRANSACTIONS' | 'DELETE';

interface ModalState {
  isOpen: boolean;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'CONFIRM';
  title: string;
  message: string | React.ReactNode;
  onConfirm?: () => void;
}

export const SwingWindow: React.FC<SwingWindowProps> = ({
  customers,
  accounts,
  transactions,
  onAddAccount,
  onDeposit,
  onWithdraw,
  onDeleteAccount,
  addJdbcLog,
}) => {
  const [activeView, setActiveView] = useState<ActiveView>('CREATE');

  // Modal dialog state (emulating JOptionPane)
  const [modal, setModal] = useState<ModalState | null>(null);

  // Form states
  // Create Account Form
  const [createForm, setCreateForm] = useState({
    name: '',
    phone: '',
    address: '',
    accountNo: '',
    accountType: 'Savings' as 'Savings' | 'Current',
    initialBalance: '1000.00'
  });

  // View Account Form
  const [viewAccNo, setViewAccNo] = useState('');
  const [viewResult, setViewResult] = useState<{ customer: Customer; account: Account } | null>(null);

  // Deposit Form
  const [depositForm, setDepositForm] = useState({ accountNo: '', amount: '' });

  // Withdraw Form
  const [withdrawForm, setWithdrawForm] = useState({ accountNo: '', amount: '' });

  // Check Balance Form
  const [balanceAccNo, setBalanceAccNo] = useState('');
  const [balanceResult, setBalanceResult] = useState<{ accountNo: number; balance: number } | null>(null);

  // Transactions Form
  const [txAccNo, setTxAccNo] = useState('');
  const [loadedTransactions, setLoadedTransactions] = useState<Transaction[] | null>(null);

  // Delete Account Form
  const [delAccNo, setDelAccNo] = useState('');

  // Close JOptionPane modal helper
  const closeModal = () => setModal(null);

  // Show JOptionPane helper
  const showOptionDialog = (type: 'INFO' | 'WARNING' | 'ERROR' | 'CONFIRM', title: string, message: string | React.ReactNode, onConfirm?: () => void) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  // 1. CREATE ACCOUNT HANDLER
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, address, accountNo, accountType, initialBalance } = createForm;

    // Validation 1: Required fields
    if (!name.trim() || !phone.trim() || !address.trim() || !accountNo.trim() || !initialBalance.trim()) {
      showOptionDialog('WARNING', 'Validation Error', 'All fields marked with * are required. Please fill them out.');
      return;
    }

    // Validation 2: Account Number format
    const parsedAccNo = parseInt(accountNo, 10);
    if (isNaN(parsedAccNo) || parsedAccNo <= 0) {
      showOptionDialog('ERROR', 'Validation Error', 'Account Number must be a positive integer.');
      return;
    }

    // Validation 3: Balance format
    const parsedBalance = parseFloat(initialBalance);
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      showOptionDialog('ERROR', 'Validation Error', 'Initial Balance must be a non-negative number.');
      return;
    }

    // Validation 4: Check if account exists
    const exists = accounts.some(a => a.accountNo === parsedAccNo);
    if (exists) {
      showOptionDialog('ERROR', 'Account Exists', `Account number ${parsedAccNo} already exists in the system!\nPlease choose another number.`);
      return;
    }

    try {
      const res = onAddAccount(
        { name: name.trim(), phone: phone.trim(), address: address.trim() },
        { accountNo: parsedAccNo, accountType, balance: parsedBalance }
      );

      showOptionDialog('INFO', 'Success', (
        <div className="space-y-1.5 text-xs text-slate-800 font-mono">
          <p className="font-bold text-emerald-800 text-sm mb-2">Account created successfully.</p>
          <div className="bg-slate-100 p-2.5 rounded border border-slate-300 space-y-1">
            <p><span className="text-slate-500 font-medium">Customer ID:</span> {res.customerId}</p>
            <p><span className="text-slate-500 font-medium">Account Number:</span> {parsedAccNo}</p>
            <p><span className="text-slate-500 font-medium">Customer Name:</span> {name.trim()}</p>
            <p><span className="text-slate-500 font-medium">Account Type:</span> {accountType}</p>
            <p><span className="text-slate-500 font-medium">Opening Balance:</span> ₹{parsedBalance.toFixed(2)}</p>
          </div>
        </div>
      ));

      // Reset form
      setCreateForm({
        name: '',
        phone: '',
        address: '',
        accountNo: '',
        accountType: 'Savings',
        initialBalance: '1000.00'
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Database error occurred';
      showOptionDialog('ERROR', 'Database Error', errorMsg);
    }
  };

  // 2. VIEW ACCOUNT HANDLER
  const handleFetchAccount = () => {
    if (!viewAccNo.trim()) {
      showOptionDialog('WARNING', 'Input Required', 'Please enter an account number.');
      return;
    }

    const parsedAccNo = parseInt(viewAccNo, 10);
    if (isNaN(parsedAccNo)) {
      showOptionDialog('ERROR', 'Format Error', 'Account number must be numeric.');
      return;
    }

    addJdbcLog({
      type: 'EXECUTE_QUERY',
      sql: 'SELECT * FROM ACCOUNT WHERE account_no = ?',
      params: [parsedAccNo],
      details: `AccountDAO.getAccountByNo(${parsedAccNo})`,
      status: 'INFO',
      durationMs: 4
    });

    const account = accounts.find(a => a.accountNo === parsedAccNo);
    if (!account) {
      setViewResult(null);
      showOptionDialog('ERROR', 'Account Not Found', `No account found with number: ${parsedAccNo}`);
      return;
    }

    const customer = customers.find(c => c.customerId === account.customerId);
    if (!customer) {
      showOptionDialog('ERROR', 'Data Integrity Error', `Customer record for Account ${parsedAccNo} is missing.`);
      return;
    }

    addJdbcLog({
      type: 'RESULT_SET',
      sql: 'SELECT * FROM CUSTOMER WHERE customer_id = ?',
      params: [account.customerId],
      details: `CustomerDAO.getCustomerById(${account.customerId}) -> Name: ${customer.name}`,
      status: 'SUCCESS',
      durationMs: 3
    });

    setViewResult({ customer, account });
  };

  // 3. DEPOSIT HANDLER
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const { accountNo, amount } = depositForm;

    if (!accountNo.trim() || !amount.trim()) {
      showOptionDialog('WARNING', 'Input Required', 'Both Account Number and Amount are required.');
      return;
    }

    const parsedAccNo = parseInt(accountNo, 10);
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAccNo) || isNaN(parsedAmount)) {
      showOptionDialog('ERROR', 'Format Error', 'Please enter valid numeric values for account and amount.');
      return;
    }

    if (parsedAmount <= 0) {
      showOptionDialog('ERROR', 'Validation Error', 'Deposit amount must be greater than zero.');
      return;
    }

    const account = accounts.find(a => a.accountNo === parsedAccNo);
    if (!account) {
      showOptionDialog('ERROR', 'Deposit Error', `Account number ${parsedAccNo} does not exist.`);
      return;
    }

    try {
      const res = onDeposit(parsedAccNo, parsedAmount);
      showOptionDialog('INFO', 'Deposit Success', (
        <div className="space-y-1.5 text-xs text-slate-800 font-mono">
          <p className="font-bold text-emerald-800 text-sm mb-2">Deposit Successful!</p>
          <div className="bg-slate-100 p-2.5 rounded border border-slate-300 space-y-1">
            <p><span className="text-slate-500 font-medium">Account Number:</span> {parsedAccNo}</p>
            <p><span className="text-slate-500 font-medium">Amount Deposited:</span> ₹{parsedAmount.toFixed(2)}</p>
            <p><span className="text-slate-500 font-medium">Updated Balance:</span> ₹{res.newBalance.toFixed(2)}</p>
            <p className="text-emerald-700 font-semibold text-[11px] pt-1">✓ Logged to TRANSACTION table</p>
          </div>
        </div>
      ));
      setDepositForm({ accountNo: '', amount: '' });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Deposit failed';
      showOptionDialog('ERROR', 'Deposit Error', errorMsg);
    }
  };

  // 4. WITHDRAW HANDLER
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const { accountNo, amount } = withdrawForm;

    if (!accountNo.trim() || !amount.trim()) {
      showOptionDialog('WARNING', 'Input Required', 'Both Account Number and Amount are required.');
      return;
    }

    const parsedAccNo = parseInt(accountNo, 10);
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAccNo) || isNaN(parsedAmount)) {
      showOptionDialog('ERROR', 'Format Error', 'Please enter valid numeric values for account and amount.');
      return;
    }

    if (parsedAmount <= 0) {
      showOptionDialog('ERROR', 'Validation Error', 'Withdrawal amount must be greater than zero.');
      return;
    }

    const account = accounts.find(a => a.accountNo === parsedAccNo);
    if (!account) {
      showOptionDialog('ERROR', 'Withdrawal Error', `Account number ${parsedAccNo} does not exist.`);
      return;
    }

    if (account.balance < parsedAmount) {
      showOptionDialog(
        'ERROR', 
        'Withdrawal Error', 
        `Insufficient balance! Current balance is ₹${account.balance.toFixed(2)}, requested withdrawal is ₹${parsedAmount.toFixed(2)}`
      );
      return;
    }

    try {
      const res = onWithdraw(parsedAccNo, parsedAmount);
      showOptionDialog('INFO', 'Withdrawal Success', (
        <div className="space-y-1.5 text-xs text-slate-800 font-mono">
          <p className="font-bold text-emerald-800 text-sm mb-2">Withdrawal Successful!</p>
          <div className="bg-slate-100 p-2.5 rounded border border-slate-300 space-y-1">
            <p><span className="text-slate-500 font-medium">Account Number:</span> {parsedAccNo}</p>
            <p><span className="text-slate-500 font-medium">Amount Debited:</span> ₹{parsedAmount.toFixed(2)}</p>
            <p><span className="text-slate-500 font-medium">Updated Balance:</span> ₹{res.newBalance.toFixed(2)}</p>
            <p className="text-emerald-700 font-semibold text-[11px] pt-1">✓ Logged to TRANSACTION table</p>
          </div>
        </div>
      ));
      setWithdrawForm({ accountNo: '', amount: '' });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Withdrawal failed';
      showOptionDialog('ERROR', 'Withdrawal Error', errorMsg);
    }
  };

  // 5. CHECK BALANCE HANDLER
  const handleCheckBalance = () => {
    if (!balanceAccNo.trim()) {
      showOptionDialog('WARNING', 'Input Required', 'Please enter an account number.');
      return;
    }

    const parsedAccNo = parseInt(balanceAccNo, 10);
    if (isNaN(parsedAccNo)) {
      showOptionDialog('ERROR', 'Format Error', 'Account number must be numeric.');
      return;
    }

    addJdbcLog({
      type: 'EXECUTE_QUERY',
      sql: 'SELECT balance FROM ACCOUNT WHERE account_no = ?',
      params: [parsedAccNo],
      details: `AccountDAO.getBalance(${parsedAccNo})`,
      status: 'INFO',
      durationMs: 3
    });

    const account = accounts.find(a => a.accountNo === parsedAccNo);
    if (!account) {
      setBalanceResult(null);
      showOptionDialog('ERROR', 'Account Not Found', `Account number ${parsedAccNo} does not exist.`);
      return;
    }

    setBalanceResult({ accountNo: parsedAccNo, balance: account.balance });
  };

  // 6. VIEW TRANSACTIONS HANDLER
  const handleLoadTransactions = () => {
    if (!txAccNo.trim()) {
      showOptionDialog('WARNING', 'Input Required', 'Please enter an account number.');
      return;
    }

    const parsedAccNo = parseInt(txAccNo, 10);
    if (isNaN(parsedAccNo)) {
      showOptionDialog('ERROR', 'Format Error', 'Account number must be numeric.');
      return;
    }

    const account = accounts.find(a => a.accountNo === parsedAccNo);
    if (!account) {
      setLoadedTransactions([]);
      showOptionDialog('ERROR', 'Account Not Found', `Account number ${parsedAccNo} does not exist.`);
      return;
    }

    addJdbcLog({
      type: 'EXECUTE_QUERY',
      sql: 'SELECT transaction_id, account_no, type, amount, transaction_date FROM TRANSACTION WHERE account_no = ? ORDER BY transaction_date DESC',
      params: [parsedAccNo],
      details: `TransactionDAO.getTransactionsByAccountNo(${parsedAccNo})`,
      status: 'SUCCESS',
      durationMs: 5
    });

    const txs = transactions.filter(t => t.accountNo === parsedAccNo);
    setLoadedTransactions(txs);

    if (txs.length === 0) {
      showOptionDialog('INFO', 'Information', `No transactions recorded yet for Account ${parsedAccNo}`);
    }
  };

  // 7. DELETE ACCOUNT HANDLER
  const handleDeleteAccount = () => {
    if (!delAccNo.trim()) {
      showOptionDialog('WARNING', 'Input Required', 'Please enter an account number to delete.');
      return;
    }

    const parsedAccNo = parseInt(delAccNo, 10);
    if (isNaN(parsedAccNo)) {
      showOptionDialog('ERROR', 'Format Error', 'Account number must be numeric.');
      return;
    }

    const account = accounts.find(a => a.accountNo === parsedAccNo);
    if (!account) {
      showOptionDialog('ERROR', 'Account Not Found', `Account number ${parsedAccNo} does not exist.`);
      return;
    }

    showOptionDialog(
      'CONFIRM',
      'Confirm Account Deletion',
      `Are you sure you want to permanently delete Account ${parsedAccNo}?\nAll transaction logs for this account will also be purged.`,
      () => {
        const success = onDeleteAccount(parsedAccNo);
        if (success) {
          showOptionDialog('INFO', 'Account Deleted', `Account ${parsedAccNo} and its related transactions have been deleted successfully.`);
          setDelAccNo('');
          if (viewResult?.account.accountNo === parsedAccNo) setViewResult(null);
          if (balanceResult?.accountNo === parsedAccNo) setBalanceResult(null);
          if (txAccNo === String(parsedAccNo)) setLoadedTransactions([]);
        } else {
          showOptionDialog('ERROR', 'Error', 'Failed to delete account.');
        }
      }
    );
  };

  // 8. EXIT SYSTEM HANDLER
  const handleExit = () => {
    showOptionDialog(
      'CONFIRM',
      'Exit Confirmation',
      'Are you sure you want to exit Bank Account Management System?',
      () => {
        addJdbcLog({
          type: 'CONNECTION',
          details: 'DatabaseConnection.closeConnection() -> Closed active MySQL socket connection.',
          status: 'INFO',
          durationMs: 1
        });
        showOptionDialog('INFO', 'System Exited', 'Application closed. In a desktop environment, this executes System.exit(0).');
      }
    );
  };

  // Pre-fill demo data helper
  const handleFillDemoAccount = () => {
    const nextAccNo = accounts.length > 0 ? Math.max(...accounts.map(a => a.accountNo)) + 1 : 1004;
    setCreateForm({
      name: 'Rohan Mehta',
      phone: '9876501234',
      address: '12 Lake View Residency, Bangalore',
      accountNo: String(nextAccNo),
      accountType: 'Savings',
      initialBalance: '5000.00'
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-3 bg-white rounded-lg shadow-2xl border border-slate-400 overflow-hidden flex flex-col font-sans select-none text-slate-800">
      
      {/* 1. Authentic Java Swing Desktop Window Titlebar */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-3 py-1.5 flex items-center justify-between border-b border-slate-600">
        <div className="flex items-center space-x-2 text-xs font-semibold tracking-wide">
          {/* Classic Java Coffee Cup Icon */}
          <span className="text-amber-400 text-sm font-serif">☕</span>
          <span>BANK ACCOUNT MANAGEMENT SYSTEM</span>
          <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-700/50">
            JFrame [Active]
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded-sm bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-[10px] text-slate-300 font-mono cursor-default">
            _
          </div>
          <div className="w-3.5 h-3.5 rounded-sm bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-[10px] text-slate-300 font-mono cursor-default">
            □
          </div>
          <div 
            onClick={handleExit}
            className="w-3.5 h-3.5 rounded-sm bg-red-600 hover:bg-red-700 flex items-center justify-center text-[10px] text-white font-mono cursor-pointer"
            title="Close Window (System.exit)"
          >
            ✕
          </div>
        </div>
      </div>

      {/* 2. Top Banner Header (Banking & Academic Mini Project info) */}
      <div className="bg-slate-900 text-slate-100 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-400" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
              BANK ACCOUNT MANAGEMENT SYSTEM
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            2nd Year B.Tech CSE Academic Java Mini Project • Core Java + Swing + JDBC + MySQL
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">DATABASE ENGINE</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MySQL: bank_management
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Body: Left Sidebar (8 Buttons) + Right Content Area (CardLayout) */}
      <div className="flex flex-col md:flex-row min-h-[480px] bg-slate-100">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-56 bg-slate-800 text-slate-200 border-r border-slate-700 p-3 flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </div>

            {/* 8 Required Buttons */}
            <button
              onClick={() => setActiveView('CREATE')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-2.5 transition-colors ${
                activeView === 'CREATE'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4 shrink-0 text-sky-300" />
              <span>Create Account</span>
            </button>

            <button
              onClick={() => setActiveView('VIEW')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-2.5 transition-colors ${
                activeView === 'VIEW'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0 text-sky-300" />
              <span>View Account</span>
            </button>

            <button
              onClick={() => setActiveView('DEPOSIT')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-2.5 transition-colors ${
                activeView === 'DEPOSIT'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Deposit Money</span>
            </button>

            <button
              onClick={() => setActiveView('WITHDRAW')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-2.5 transition-colors ${
                activeView === 'WITHDRAW'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ArrowUpFromLine className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Withdraw Money</span>
            </button>

            <button
              onClick={() => setActiveView('BALANCE')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-2.5 transition-colors ${
                activeView === 'BALANCE'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4 shrink-0 text-indigo-300" />
              <span>Check Balance</span>
            </button>

            <button
              onClick={() => setActiveView('TRANSACTIONS')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-2.5 transition-colors ${
                activeView === 'TRANSACTIONS'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <History className="w-4 h-4 shrink-0 text-cyan-300" />
              <span>View Transactions</span>
            </button>

            <button
              onClick={() => setActiveView('DELETE')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-2.5 transition-colors ${
                activeView === 'DELETE'
                  ? 'bg-red-700 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-red-950/60 hover:text-red-200'
              }`}
            >
              <Trash2 className="w-4 h-4 shrink-0 text-red-400" />
              <span>Delete Account</span>
            </button>
          </div>

          {/* Exit Button */}
          <div className="pt-4 border-t border-slate-700 mt-4">
            <button
              onClick={handleExit}
              className="w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center gap-2 bg-red-800/80 hover:bg-red-700 text-white transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Exit System</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area (Swing CardLayout emulation) */}
        <main className="flex-1 p-5 md:p-6 bg-slate-50 flex flex-col justify-between overflow-y-auto">
          
          {/* ==================================================== */}
          {/* 1. CREATE ACCOUNT VIEW */}
          {/* ==================================================== */}
          {activeView === 'CREATE' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Create New Bank Account</h2>
                  <p className="text-xs text-slate-500">
                    Registers record in <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">CUSTOMER</code> and opens account in <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">ACCOUNT</code>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoAccount}
                  className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors"
                  title="Fills realistic college presentation test data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fill Demo Data</span>
                </button>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/* Section 1: Customer Details */}
                <fieldset className="border border-slate-300 rounded p-4 bg-white shadow-xs">
                  <legend className="text-xs font-bold text-blue-900 px-2 uppercase tracking-wide">
                    Customer Information
                  </legend>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Customer Full Name: *
                      </label>
                      <input
                        type="text"
                        value={createForm.name}
                        onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                        placeholder="e.g. Rohan Mehta"
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number: *
                        </label>
                        <input
                          type="text"
                          value={createForm.phone}
                          onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                          placeholder="e.g. 9876501234"
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Residential Address: *
                        </label>
                        <input
                          type="text"
                          value={createForm.address}
                          onChange={e => setCreateForm({ ...createForm, address: e.target.value })}
                          placeholder="e.g. 12 Lake View, Bangalore"
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Section 2: Account Details */}
                <fieldset className="border border-slate-300 rounded p-4 bg-white shadow-xs">
                  <legend className="text-xs font-bold text-blue-900 px-2 uppercase tracking-wide">
                    Account Information
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Account Number: * (e.g. 1004)
                      </label>
                      <input
                        type="number"
                        value={createForm.accountNo}
                        onChange={e => setCreateForm({ ...createForm, accountNo: e.target.value })}
                        placeholder="1004"
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Account Type:
                      </label>
                      <select
                        value={createForm.accountType}
                        onChange={e => setCreateForm({ ...createForm, accountType: e.target.value as 'Savings' | 'Current' })}
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Initial Deposit (₹): *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={createForm.initialBalance}
                        onChange={e => setCreateForm({ ...createForm, initialBalance: e.target.value })}
                        placeholder="1000.00"
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 font-mono"
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreateForm({ name: '', phone: '', address: '', accountNo: '', accountType: 'Savings', initialBalance: '1000.00' })}
                    className="px-4 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Account</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* 2. VIEW ACCOUNT VIEW */}
          {/* ==================================================== */}
          {activeView === 'VIEW' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">View Account Details</h2>
                <p className="text-xs text-slate-500">
                  Retrieves relational join data of customer profile and account balance.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded border border-slate-300 shadow-xs">
                <label className="text-xs font-semibold text-slate-700 shrink-0">
                  Account Number:
                </label>
                <input
                  type="number"
                  value={viewAccNo}
                  onChange={e => setViewAccNo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFetchAccount()}
                  placeholder="e.g. 1001"
                  className="w-44 text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleFetchAccount}
                  className="px-4 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded text-xs font-semibold transition-colors"
                >
                  Fetch Account Details
                </button>
              </div>

              {viewResult && (
                <div className="bg-white border border-slate-300 rounded p-4 shadow-xs space-y-3 animate-fade-in">
                  <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-900 uppercase">
                      Account & Customer Record
                    </span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-medium">
                      Status: Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div className="text-slate-500 font-medium">Customer ID:</div>
                    <div className="font-mono text-slate-900 font-semibold">{viewResult.customer.customerId}</div>

                    <div className="text-slate-500 font-medium">Customer Name:</div>
                    <div className="text-slate-900 font-bold">{viewResult.customer.name}</div>

                    <div className="text-slate-500 font-medium">Phone Number:</div>
                    <div className="text-slate-900 font-mono">{viewResult.customer.phone}</div>

                    <div className="text-slate-500 font-medium">Residential Address:</div>
                    <div className="text-slate-900">{viewResult.customer.address}</div>

                    <div className="text-slate-500 font-medium">Account Number:</div>
                    <div className="font-mono text-slate-900 font-semibold">{viewResult.account.accountNo}</div>

                    <div className="text-slate-500 font-medium">Account Type:</div>
                    <div className="text-slate-900 font-medium">{viewResult.account.accountType}</div>

                    <div className="text-slate-500 font-medium">Current Balance:</div>
                    <div className="text-emerald-700 font-bold font-mono text-sm">
                      ₹{viewResult.account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 3. DEPOSIT VIEW */}
          {/* ==================================================== */}
          {activeView === 'DEPOSIT' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Deposit Money</h2>
                <p className="text-xs text-slate-500">
                  Updates balance in <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">ACCOUNT</code> and records entry in <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">TRANSACTION</code>.
                </p>
              </div>

              <form onSubmit={handleDeposit} className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Account Number: *
                  </label>
                  <input
                    type="number"
                    value={depositForm.accountNo}
                    onChange={e => setDepositForm({ ...depositForm, accountNo: e.target.value })}
                    placeholder="e.g. 1001"
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deposit Amount (₹): *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositForm.amount}
                    onChange={e => setDepositForm({ ...depositForm, amount: e.target.value })}
                    placeholder="e.g. 5000.00"
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    <span>Confirm Deposit</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* 4. WITHDRAW VIEW */}
          {/* ==================================================== */}
          {activeView === 'WITHDRAW' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Withdraw Money</h2>
                <p className="text-xs text-slate-500">
                  Debits balance after checking sufficiency, logging transaction with type <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">'WITHDRAW'</code>.
                </p>
              </div>

              <form onSubmit={handleWithdraw} className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Source Account Number: *
                  </label>
                  <input
                    type="number"
                    value={withdrawForm.accountNo}
                    onChange={e => setWithdrawForm({ ...withdrawForm, accountNo: e.target.value })}
                    placeholder="e.g. 1001"
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Withdrawal Amount (₹): *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={withdrawForm.amount}
                    onChange={e => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    placeholder="e.g. 2000.00"
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ArrowUpFromLine className="w-4 h-4" />
                    <span>Confirm Withdrawal</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* 5. CHECK BALANCE VIEW */}
          {/* ==================================================== */}
          {activeView === 'BALANCE' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Check Account Balance</h2>
                <p className="text-xs text-slate-500">
                  Fast single-query lookup from <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">ACCOUNT</code> table.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded border border-slate-300 shadow-xs">
                <label className="text-xs font-semibold text-slate-700 shrink-0">
                  Account Number:
                </label>
                <input
                  type="number"
                  value={balanceAccNo}
                  onChange={e => setBalanceAccNo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCheckBalance()}
                  placeholder="e.g. 1001"
                  className="w-44 text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCheckBalance}
                  className="px-4 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded text-xs font-semibold transition-colors"
                >
                  Query Balance
                </button>
              </div>

              {balanceResult && (
                <div className="bg-emerald-50 border border-emerald-300 rounded p-4 shadow-xs space-y-2 animate-fade-in">
                  <div className="text-xs text-emerald-800 font-medium">Account Details:</div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-600">Account No: </span>
                      <span className="text-sm font-bold font-mono text-slate-900">{balanceResult.accountNo}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-600">Available Funds: </span>
                      <span className="text-xl font-bold font-mono text-emerald-800">
                        ₹{balanceResult.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 6. VIEW TRANSACTIONS (JTable) VIEW */}
          {/* ==================================================== */}
          {activeView === 'TRANSACTIONS' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Account Transaction History</h2>
                <p className="text-xs text-slate-500">
                  Displays all recorded ledger items in an authentic Java Swing <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">JTable</code> component.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded border border-slate-300 shadow-xs">
                <label className="text-xs font-semibold text-slate-700 shrink-0">
                  Account Number:
                </label>
                <input
                  type="number"
                  value={txAccNo}
                  onChange={e => setTxAccNo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLoadTransactions()}
                  placeholder="e.g. 1001"
                  className="w-44 text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleLoadTransactions}
                  className="px-4 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded text-xs font-semibold transition-colors"
                >
                  Load Transactions
                </button>
              </div>

              {/* JTable Swing Representation */}
              <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden">
                <div className="bg-slate-200 px-3 py-2 border-b border-slate-300 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>JTable: DefaultTableModel</span>
                  <span className="text-[11px] font-normal text-slate-600 font-mono">
                    {loadedTransactions !== null ? `${loadedTransactions.length} Row(s)` : 'No Data Loaded'}
                  </span>
                </div>

                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                      <tr>
                        <th className="px-3 py-2 border-r border-slate-200 text-center font-mono">Transaction ID</th>
                        <th className="px-3 py-2 border-r border-slate-200 text-center">Type</th>
                        <th className="px-3 py-2 border-r border-slate-200 text-right font-mono">Amount (₹)</th>
                        <th className="px-3 py-2 text-center font-mono">Transaction Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      {loadedTransactions && loadedTransactions.length > 0 ? (
                        loadedTransactions.map(t => (
                          <tr key={t.transactionId} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-3 py-2 text-center font-mono text-slate-700 border-r border-slate-200">
                              #{t.transactionId}
                            </td>
                            <td className="px-3 py-2 text-center border-r border-slate-200">
                              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                t.type === 'DEPOSIT'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {t.type}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-mono font-semibold text-slate-900 border-r border-slate-200">
                              ₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-3 py-2 text-center font-mono text-slate-600 text-[11px]">
                              {t.transactionDate}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic text-xs">
                            {loadedTransactions === null
                              ? 'Enter an account number above and click "Load Transactions"'
                              : 'No transaction history found for this account.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 7. DELETE ACCOUNT VIEW */}
          {/* ==================================================== */}
          {activeView === 'DELETE' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-red-700">Delete Bank Account</h2>
                <p className="text-xs text-slate-500">
                  Permanently deletes an account record and cleans up related transaction records.
                </p>
              </div>

              {/* Warning box */}
              <div className="bg-red-50 border border-red-200 rounded p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-red-800 space-y-1">
                  <p className="font-bold">Foreign Key Cascading Notice:</p>
                  <p>
                    Deleting an account will first remove all related transaction rows from the <code className="bg-red-100 px-1 rounded font-mono">TRANSACTION</code> table to satisfy database foreign keys, then remove the account from <code className="bg-red-100 px-1 rounded font-mono">ACCOUNT</code>.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Number to Delete: *
                  </label>
                  <input
                    type="number"
                    value={delAccNo}
                    onChange={e => setDelAccNo(e.target.value)}
                    placeholder="e.g. 1003"
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Selector helper bar */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Sample Accounts:</span>
              {accounts.map(acc => (
                <button
                  key={acc.accountNo}
                  onClick={() => {
                    setViewAccNo(String(acc.accountNo));
                    setDepositForm(f => ({ ...f, accountNo: String(acc.accountNo) }));
                    setWithdrawForm(f => ({ ...f, accountNo: String(acc.accountNo) }));
                    setBalanceAccNo(String(acc.accountNo));
                    setTxAccNo(String(acc.accountNo));
                    setDelAccNo(String(acc.accountNo));
                  }}
                  className="font-mono bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded text-[11px] transition-colors"
                  title="Click to copy account number into forms"
                >
                  #{acc.accountNo} (₹{acc.balance.toFixed(0)})
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Total Accounts: {accounts.length} | Customers: {customers.length}
            </div>
          </div>
        </main>
      </div>

      {/* 4. Bottom Status Bar */}
      <footer className="bg-slate-200 border-t border-slate-300 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Connected to MySQL: bank_management (localhost:3306)</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>DriverManager.getConnection()</span>
          <span>•</span>
          <span>Swing Event Dispatch Thread (EDT)</span>
        </div>
      </footer>

      {/* ==================================================== */}
      {/* JOptionPane Modal Dialog Simulation */}
      {/* ==================================================== */}
      {modal && modal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl border-2 border-slate-400 w-full max-w-md overflow-hidden animate-scale-up font-sans">
            
            {/* Modal Title Bar */}
            <div className="bg-slate-800 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold border-b border-slate-700">
              <span className="flex items-center gap-1.5">
                <span>☕</span>
                <span>{modal.title}</span>
              </span>
              <button 
                onClick={closeModal} 
                className="hover:bg-slate-700 text-slate-300 w-4 h-4 rounded text-center flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex items-start gap-4 bg-slate-50">
              {modal.type === 'INFO' && <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />}
              {modal.type === 'WARNING' && <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />}
              {modal.type === 'ERROR' && <XCircle className="w-8 h-8 text-red-600 shrink-0" />}
              {modal.type === 'CONFIRM' && <Info className="w-8 h-8 text-blue-600 shrink-0" />}

              <div className="flex-1 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {modal.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-300 flex justify-end gap-2">
              {modal.type === 'CONFIRM' ? (
                <>
                  <button
                    onClick={closeModal}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium border border-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (modal.onConfirm) modal.onConfirm();
                      closeModal();
                    }}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
                  >
                    OK / Confirm
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className="px-5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
