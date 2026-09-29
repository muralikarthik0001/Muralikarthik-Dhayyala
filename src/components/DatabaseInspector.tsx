import React, { useState } from 'react';
import { Account, Customer, Transaction } from '../types/bank';
import { Database, Table, Key, RotateCcw, Search, Play, CheckCircle } from 'lucide-react';

interface DatabaseInspectorProps {
  customers: Customer[];
  accounts: Account[];
  transactions: Transaction[];
  onResetDatabase: () => void;
}

export const DatabaseInspector: React.FC<DatabaseInspectorProps> = ({
  customers,
  accounts,
  transactions,
  onResetDatabase,
}) => {
  const [activeTable, setActiveTable] = useState<'CUSTOMER' | 'ACCOUNT' | 'TRANSACTION'>('ACCOUNT');
  const [searchTerm, setSearchTerm] = useState('');
  const [customQuery, setCustomQuery] = useState('SELECT * FROM ACCOUNT WHERE balance > 20000;');
  const [queryResult, setQueryResult] = useState<string | null>(null);

  // Filtered rows for active table
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) || 
    c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.customerId).includes(searchTerm)
  );

  const filteredAccounts = accounts.filter(a => 
    String(a.accountNo).includes(searchTerm) || 
    String(a.customerId).includes(searchTerm) || 
    a.accountType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t => 
    String(t.accountNo).includes(searchTerm) || 
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(t.transactionId).includes(searchTerm)
  );

  const handleRunQuery = () => {
    const q = customQuery.trim().toUpperCase();
    if (q.includes('FROM ACCOUNT')) {
      setActiveTable('ACCOUNT');
      setQueryResult(`Query executed successfully. Returned ${accounts.length} row(s) from table ACCOUNT.`);
    } else if (q.includes('FROM CUSTOMER')) {
      setActiveTable('CUSTOMER');
      setQueryResult(`Query executed successfully. Returned ${customers.length} row(s) from table CUSTOMER.`);
    } else if (q.includes('FROM TRANSACTION')) {
      setActiveTable('TRANSACTION');
      setQueryResult(`Query executed successfully. Returned ${transactions.length} row(s) from table TRANSACTION.`);
    } else {
      setQueryResult(`Query executed on MySQL schema 'bank_management'.`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-4 space-y-4 font-sans text-slate-100">
      
      {/* Header Bar */}
      <div className="bg-slate-800/90 backdrop-blur-xs border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                MySQL Database Inspector: <code className="text-sky-400 font-mono text-sm">bank_management</code>
              </h2>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full font-mono">
                ENGINE=InnoDB
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live relational tables reflecting changes made in the Java Swing UI in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset database to initial seed data?')) {
                onResetDatabase();
              }
            }}
            className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium border border-slate-600 flex items-center gap-1.5 transition-colors"
            title="Reset database to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
            <span>Reset Database Seed</span>
          </button>
        </div>
      </div>

      {/* SQL Interactive Query Bar */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono flex items-center gap-1.5 text-sky-400">
            <span>mysql&gt;</span>
            <span>Interactive SQL Console</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">PreparedStatement / JDBC Direct</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRunQuery()}
            className="flex-1 bg-slate-900 border border-slate-700 text-sky-200 font-mono text-xs px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Type SQL SELECT query..."
          />
          <button
            onClick={handleRunQuery}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute SQL</span>
          </button>
        </div>

        {queryResult && (
          <div className="text-[11px] text-emerald-400 font-mono bg-slate-900/80 px-2.5 py-1.5 rounded border border-emerald-800/40 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{queryResult}</span>
          </div>
        )}
      </div>

      {/* Table Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTable('ACCOUNT')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTable === 'ACCOUNT'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>ACCOUNT</span>
            <span className="bg-slate-900/60 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {accounts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTable('CUSTOMER')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTable === 'CUSTOMER'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>CUSTOMER</span>
            <span className="bg-slate-900/60 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTable('TRANSACTION')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTable === 'TRANSACTION'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>TRANSACTION</span>
            <span className="bg-slate-900/60 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {transactions.length}
            </span>
          </button>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={`Filter ${activeTable} rows...`}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Table Viewer */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
        
        {/* Table 1: ACCOUNT */}
        {activeTable === 'ACCOUNT' && (
          <div>
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-sky-300 font-semibold">
                TABLE: `ACCOUNT` (account_no PK, customer_id FK, account_type, balance)
              </span>
              <span className="text-[11px] text-slate-500">
                Foreign Key: customer_id -&gt; CUSTOMER(customer_id) ON DELETE CASCADE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-mono text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2.5 flex items-center gap-1.5">
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>account_no (PK)</span>
                    </th>
                    <th className="px-4 py-2.5">
                      <span>customer_id (FK)</span>
                    </th>
                    <th className="px-4 py-2.5">
                      <span>account_type</span>
                    </th>
                    <th className="px-4 py-2.5 text-right">
                      <span>balance (DECIMAL 10,2)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 font-mono">
                  {filteredAccounts.map(acc => (
                    <tr key={acc.accountNo} className="hover:bg-slate-700/40 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-sky-400">
                        {acc.accountNo}
                      </td>
                      <td className="px-4 py-2.5 text-slate-300">
                        {acc.customerId}
                      </td>
                      <td className="px-4 py-2.5 font-sans">
                        <span className="bg-slate-700 px-2 py-0.5 rounded text-[11px] text-slate-200">
                          {acc.accountType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">
                        ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {filteredAccounts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">
                        No rows found matching search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Table 2: CUSTOMER */}
        {activeTable === 'CUSTOMER' && (
          <div>
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-sky-300 font-semibold">
                TABLE: `CUSTOMER` (customer_id PK AUTO_INCREMENT, name, phone, address)
              </span>
              <span className="text-[11px] text-slate-500">
                Referenced by ACCOUNT
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-mono text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2.5 flex items-center gap-1.5">
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>customer_id (PK)</span>
                    </th>
                    <th className="px-4 py-2.5">
                      <span>name (VARCHAR 50)</span>
                    </th>
                    <th className="px-4 py-2.5">
                      <span>phone (VARCHAR 15)</span>
                    </th>
                    <th className="px-4 py-2.5">
                      <span>address (VARCHAR 100)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 font-sans">
                  {filteredCustomers.map(cust => (
                    <tr key={cust.customerId} className="hover:bg-slate-700/40 transition-colors">
                      <td className="px-4 py-2.5 font-bold font-mono text-sky-400">
                        {cust.customerId}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-white">
                        {cust.name}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">
                        {cust.phone}
                      </td>
                      <td className="px-4 py-2.5 text-slate-300">
                        {cust.address}
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">
                        No customer rows found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Table 3: TRANSACTION */}
        {activeTable === 'TRANSACTION' && (
          <div>
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-sky-300 font-semibold">
                TABLE: `TRANSACTION` (transaction_id PK, account_no FK, type, amount, transaction_date)
              </span>
              <span className="text-[11px] text-slate-500">
                Foreign Key: account_no -&gt; ACCOUNT(account_no) ON DELETE CASCADE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-mono text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2.5 flex items-center gap-1.5">
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>transaction_id</span>
                    </th>
                    <th className="px-4 py-2.5">
                      <span>account_no (FK)</span>
                    </th>
                    <th className="px-4 py-2.5 text-center">
                      <span>type</span>
                    </th>
                    <th className="px-4 py-2.5 text-right">
                      <span>amount (DECIMAL 10,2)</span>
                    </th>
                    <th className="px-4 py-2.5 text-center">
                      <span>transaction_date (TIMESTAMP)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 font-mono">
                  {filteredTransactions.map(tx => (
                    <tr key={tx.transactionId} className="hover:bg-slate-700/40 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-sky-400">
                        #{tx.transactionId}
                      </td>
                      <td className="px-4 py-2.5 text-slate-300 font-semibold">
                        {tx.accountNo}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'DEPOSIT'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">
                        ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-center text-slate-400 text-[11px]">
                        {tx.transactionDate}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500 italic font-sans">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
