/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SwingWindow } from './components/SwingWindow';
import { DatabaseInspector } from './components/DatabaseInspector';
import { JdbcConsole } from './components/JdbcConsole';
import { CodeExplorer } from './components/CodeExplorer';
import { VivaGuide } from './components/VivaGuide';
import { DemoFlowBar } from './components/DemoFlowBar';
import { 
  Customer, 
  Account, 
  Transaction, 
  JdbcLogEntry 
} from './types/bank';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_ACCOUNTS, 
  INITIAL_TRANSACTIONS 
} from './data/initialData';
import { 
  Monitor, 
  Database, 
  Terminal, 
  FolderTree, 
  GraduationCap, 
  Layers, 
  Building2,
  CheckCircle2,
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'SWING' | 'DATABASE' | 'JDBC' | 'CODE' | 'VIVA'>('SWING');

  // Database state in memory / localStorage
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('bank_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('bank_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bank_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // JDBC execution logs
  const [jdbcLogs, setJdbcLogs] = useState<JdbcLogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'CONNECTION',
      sql: undefined,
      params: undefined,
      details: 'DriverManager.getConnection("jdbc:mysql://localhost:3306/bank_management", "root", "root")',
      status: 'SUCCESS',
      durationMs: 12
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'EXECUTE_QUERY',
      sql: 'SELECT * FROM ACCOUNT',
      params: [],
      details: 'Loaded initial seed records from MySQL database bank_management',
      status: 'SUCCESS',
      durationMs: 6
    }
  ]);

  // Demo walkthrough step
  const [demoStep, setDemoStep] = useState<number>(1);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bank_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('bank_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('bank_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Add JDBC Log Entry
  const addJdbcLog = (entry: Omit<JdbcLogEntry, 'id' | 'timestamp'>) => {
    const newLog: JdbcLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setJdbcLogs(prev => [newLog, ...prev]);
  };

  // 1. ADD ACCOUNT (CustomerDAO.insertCustomer + AccountDAO.insertAccount)
  const handleAddAccount = (
    customerData: Omit<Customer, 'customerId'>,
    accountData: Omit<Account, 'customerId'>
  ) => {
    const newCustId = customers.length > 0 ? Math.max(...customers.map(c => c.customerId)) + 1 : 1;
    const newCustomer: Customer = {
      customerId: newCustId,
      ...customerData
    };

    const newAccount: Account = {
      ...accountData,
      customerId: newCustId
    };

    // Log PreparedStatement for CUSTOMER
    addJdbcLog({
      type: 'PREPARED_STMT',
      sql: 'INSERT INTO CUSTOMER (name, phone, address) VALUES (?, ?, ?)',
      params: [customerData.name, customerData.phone, customerData.address],
      details: `CustomerDAO.insertCustomer() -> Generated customer_id = ${newCustId}`,
      status: 'SUCCESS',
      durationMs: 8
    });

    // Log PreparedStatement for ACCOUNT
    addJdbcLog({
      type: 'PREPARED_STMT',
      sql: 'INSERT INTO ACCOUNT (account_no, customer_id, account_type, balance) VALUES (?, ?, ?, ?)',
      params: [accountData.accountNo, newCustId, accountData.accountType, accountData.balance],
      details: `AccountDAO.insertAccount() -> Created Account ${accountData.accountNo}`,
      status: 'SUCCESS',
      durationMs: 7
    });

    setCustomers(prev => [...prev, newCustomer]);
    setAccounts(prev => [...prev, newAccount]);

    return { customerId: newCustId };
  };

  // 2. DEPOSIT (AccountDAO.deposit)
  const handleDeposit = (accountNo: number, amount: number) => {
    const acc = accounts.find(a => a.accountNo === accountNo);
    if (!acc) throw new Error(`Account ${accountNo} not found.`);

    const newBal = acc.balance + amount;

    // Log UPDATE query
    addJdbcLog({
      type: 'EXECUTE_UPDATE',
      sql: 'UPDATE ACCOUNT SET balance = ? WHERE account_no = ?',
      params: [newBal, accountNo],
      details: `AccountDAO.deposit(${accountNo}, ₹${amount}) -> New Balance: ₹${newBal.toFixed(2)}`,
      status: 'SUCCESS',
      durationMs: 5
    });

    // Log TRANSACTION INSERT
    const newTxId = transactions.length > 0 ? Math.max(...transactions.map(t => t.transactionId)) + 1 : 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    addJdbcLog({
      type: 'PREPARED_STMT',
      sql: 'INSERT INTO TRANSACTION (account_no, type, amount, transaction_date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      params: [accountNo, 'DEPOSIT', amount],
      details: `TransactionDAO.insertTransaction() -> Recorded DEPOSIT tx #${newTxId}`,
      status: 'SUCCESS',
      durationMs: 4
    });

    setAccounts(prev => prev.map(a => a.accountNo === accountNo ? { ...a, balance: newBal } : a));
    setTransactions(prev => [
      {
        transactionId: newTxId,
        accountNo,
        type: 'DEPOSIT',
        amount,
        transactionDate: nowStr
      },
      ...prev
    ]);

    return { newBalance: newBal };
  };

  // 3. WITHDRAW (AccountDAO.withdraw)
  const handleWithdraw = (accountNo: number, amount: number) => {
    const acc = accounts.find(a => a.accountNo === accountNo);
    if (!acc) throw new Error(`Account ${accountNo} not found.`);
    if (acc.balance < amount) throw new Error(`Insufficient balance! Available: ₹${acc.balance.toFixed(2)}`);

    const newBal = acc.balance - amount;

    // Log UPDATE query
    addJdbcLog({
      type: 'EXECUTE_UPDATE',
      sql: 'UPDATE ACCOUNT SET balance = ? WHERE account_no = ?',
      params: [newBal, accountNo],
      details: `AccountDAO.withdraw(${accountNo}, ₹${amount}) -> New Balance: ₹${newBal.toFixed(2)}`,
      status: 'SUCCESS',
      durationMs: 5
    });

    // Log TRANSACTION INSERT
    const newTxId = transactions.length > 0 ? Math.max(...transactions.map(t => t.transactionId)) + 1 : 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    addJdbcLog({
      type: 'PREPARED_STMT',
      sql: 'INSERT INTO TRANSACTION (account_no, type, amount, transaction_date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      params: [accountNo, 'WITHDRAW', amount],
      details: `TransactionDAO.insertTransaction() -> Recorded WITHDRAW tx #${newTxId}`,
      status: 'SUCCESS',
      durationMs: 4
    });

    setAccounts(prev => prev.map(a => a.accountNo === accountNo ? { ...a, balance: newBal } : a));
    setTransactions(prev => [
      {
        transactionId: newTxId,
        accountNo,
        type: 'WITHDRAW',
        amount,
        transactionDate: nowStr
      },
      ...prev
    ]);

    return { newBalance: newBal };
  };

  // 4. DELETE ACCOUNT (AccountDAO.deleteAccount)
  const handleDeleteAccount = (accountNo: number): boolean => {
    const acc = accounts.find(a => a.accountNo === accountNo);
    if (!acc) return false;

    // Log CASCADE delete transactions first
    addJdbcLog({
      type: 'EXECUTE_UPDATE',
      sql: 'DELETE FROM TRANSACTION WHERE account_no = ?',
      params: [accountNo],
      details: `TransactionDAO.deleteTransactionsByAccountNo(${accountNo}) -> Purged related foreign key child rows`,
      status: 'SUCCESS',
      durationMs: 6
    });

    // Log DELETE ACCOUNT
    addJdbcLog({
      type: 'EXECUTE_UPDATE',
      sql: 'DELETE FROM ACCOUNT WHERE account_no = ?',
      params: [accountNo],
      details: `AccountDAO.deleteAccount(${accountNo}) -> Deleted account record from MySQL`,
      status: 'SUCCESS',
      durationMs: 5
    });

    // Delete customer if they have no other accounts
    const otherAccounts = accounts.filter(a => a.accountNo !== accountNo && a.customerId === acc.customerId);
    if (otherAccounts.length === 0) {
      addJdbcLog({
        type: 'EXECUTE_UPDATE',
        sql: 'DELETE FROM CUSTOMER WHERE customer_id = ?',
        params: [acc.customerId],
        details: `CustomerDAO.deleteCustomer(${acc.customerId}) -> Cleaned up customer profile`,
        status: 'SUCCESS',
        durationMs: 4
      });
      setCustomers(prev => prev.filter(c => c.customerId !== acc.customerId));
    }

    setTransactions(prev => prev.filter(t => t.accountNo !== accountNo));
    setAccounts(prev => prev.filter(a => a.accountNo !== accountNo));

    return true;
  };

  // Reset database to initial seed
  const handleResetDatabase = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem('bank_customers');
    localStorage.removeItem('bank_accounts');
    localStorage.removeItem('bank_transactions');

    addJdbcLog({
      type: 'CONNECTION',
      sql: 'SOURCE database.sql',
      details: 'Database restored to initial seed dataset (3 Customers, 3 Accounts, 5 Transactions)',
      status: 'INFO',
      durationMs: 15
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Application Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  BANK ACCOUNT MANAGEMENT SYSTEM
                </h1>
                <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full font-mono">
                  Core Java • Swing • JDBC • MySQL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                2nd-Year B.Tech CSE Academic Java Mini Project
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('SWING')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                activeTab === 'SWING'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Java Swing GUI</span>
            </button>

            <button
              onClick={() => setActiveTab('DATABASE')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                activeTab === 'DATABASE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>MySQL Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('JDBC')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                activeTab === 'JDBC'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>JDBC Trace</span>
              <span className="bg-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono text-slate-300">
                {jdbcLogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('CODE')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                activeTab === 'CODE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4 text-amber-400" />
              <span>Source Code & ZIP</span>
            </button>

            <button
              onClick={() => setActiveTab('VIVA')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                activeTab === 'VIVA'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>College Viva & Demo</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-4">
        
        {/* Interactive Demo Flow Bar (Always visible or toggled) */}
        <DemoFlowBar
          currentStep={demoStep}
          onSetStep={setDemoStep}
          onSelectOperation={(op) => {
            if (op === 'DB') {
              setActiveTab('DATABASE');
            } else {
              setActiveTab('SWING');
            }
          }}
        />

        {/* Tab 1: Live Java Swing Desktop App Simulation */}
        {activeTab === 'SWING' && (
          <div className="space-y-4 animate-fade-in">
            <SwingWindow
              customers={customers}
              accounts={accounts}
              transactions={transactions}
              onAddAccount={handleAddAccount}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onDeleteAccount={handleDeleteAccount}
              addJdbcLog={addJdbcLog}
              onSelectTab={setActiveTab}
            />

            {/* Quick Live Preview of Database Rows below the Swing Window */}
            <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active MySQL Database: <strong className="text-white">bank_management</strong></span>
                <span className="text-slate-600">|</span>
                <span>{accounts.length} Accounts</span>
                <span className="text-slate-600">|</span>
                <span>{transactions.length} Transactions</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('DATABASE')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition-colors"
                >
                  Inspect DB Tables →
                </button>
                <button
                  onClick={() => setActiveTab('JDBC')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition-colors"
                >
                  View JDBC Log Stream →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MySQL Database Inspector */}
        {activeTab === 'DATABASE' && (
          <div className="animate-fade-in">
            <DatabaseInspector
              customers={customers}
              accounts={accounts}
              transactions={transactions}
              onResetDatabase={handleResetDatabase}
            />
          </div>
        )}

        {/* Tab 3: Real-Time JDBC Trace Console */}
        {activeTab === 'JDBC' && (
          <div className="animate-fade-in">
            <JdbcConsole
              logs={jdbcLogs}
              onClearLogs={() => setJdbcLogs([])}
            />
          </div>
        )}

        {/* Tab 4: Java Project Source Code & Download ZIP */}
        {activeTab === 'CODE' && (
          <div className="animate-fade-in">
            <CodeExplorer />
          </div>
        )}

        {/* Tab 5: College Viva Guide & Setup Guide */}
        {activeTab === 'VIVA' && (
          <div className="animate-fade-in">
            <VivaGuide />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            BANK ACCOUNT MANAGEMENT SYSTEM • 2nd Year B.Tech CSE Mini Project
          </div>
          <div className="flex items-center gap-3">
            <span>Java 17/21</span>
            <span>•</span>
            <span>MySQL 8.x Connector/J</span>
            <span>•</span>
            <span>Swing GUI Framework</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
