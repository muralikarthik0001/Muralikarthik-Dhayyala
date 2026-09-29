package dao;

import model.Account;
import model.Customer;
import model.Transaction;
import util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * AccountDAO - Data Access Object for ACCOUNT table
 * Handles core banking operations: create, view, deposit, withdraw, check balance, delete.
 * Demonstrates JDBC PreparedStatement, ResultSet, and transaction consistency.
 */
public class AccountDAO {

    private final CustomerDAO customerDAO = new CustomerDAO();
    private final TransactionDAO transactionDAO = new TransactionDAO();

    /**
     * Checks if an account exists by account number.
     *
     * @param accountNo Account number to check
     * @return true if account exists, false otherwise
     * @throws SQLException on database error
     */
    public boolean accountExists(int accountNo) throws SQLException {
        String sql = "SELECT 1 FROM ACCOUNT WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, accountNo);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    /**
     * Inserts a new account record into the ACCOUNT table.
     *
     * @param account Account object with account_no, customer_id, account_type, balance
     * @return true if inserted, false otherwise
     * @throws SQLException on database error
     */
    public boolean insertAccount(Account account) throws SQLException {
        String sql = "INSERT INTO ACCOUNT (account_no, customer_id, account_type, balance) VALUES (?, ?, ?, ?)";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, account.getAccountNo());
            pstmt.setInt(2, account.getCustomerId());
            pstmt.setString(3, account.getAccountType());
            pstmt.setDouble(4, account.getBalance());

            return pstmt.executeUpdate() > 0;
        }
    }

    /**
     * Retrieves an account by account number.
     *
     * @param accountNo Account number
     * @return Account object if found, null otherwise
     * @throws SQLException on database error
     */
    public Account getAccountByNo(int accountNo) throws SQLException {
        String sql = "SELECT account_no, customer_id, account_type, balance FROM ACCOUNT WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, accountNo);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new Account(
                        rs.getInt("account_no"),
                        rs.getInt("customer_id"),
                        rs.getString("account_type"),
                        rs.getDouble("balance")
                    );
                }
            }
        }
        return null;
    }

    /**
     * Retrieves current balance for a given account number.
     *
     * @param accountNo Account number
     * @return current balance, or -1.0 if account does not exist
     * @throws SQLException on database error
     */
    public double getBalance(int accountNo) throws SQLException {
        String sql = "SELECT balance FROM ACCOUNT WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, accountNo);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble("balance");
                }
            }
        }
        return -1.0;
    }

    /**
     * Performs a deposit operation:
     * 1. Updates balance in ACCOUNT table (balance + amount).
     * 2. Inserts a record in TRANSACTION table with type 'DEPOSIT'.
     *
     * @param accountNo Target account number
     * @param amount Deposit amount (must be > 0)
     * @return New updated balance
     * @throws SQLException on database error or invalid account
     */
    public double deposit(int accountNo, double amount) throws SQLException {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero.");
        }

        Account account = getAccountByNo(accountNo);
        if (account == null) {
            throw new SQLException("Account number " + accountNo + " does not exist.");
        }

        double newBalance = account.getBalance() + amount;
        String updateSql = "UPDATE ACCOUNT SET balance = ? WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(updateSql)) {
            pstmt.setDouble(1, newBalance);
            pstmt.setInt(2, accountNo);
            int rows = pstmt.executeUpdate();

            if (rows > 0) {
                // Record in TRANSACTION table
                Transaction tx = new Transaction(accountNo, "DEPOSIT", amount);
                transactionDAO.insertTransaction(tx);
                return newBalance;
            } else {
                throw new SQLException("Failed to update balance for account " + accountNo);
            }
        }
    }

    /**
     * Performs a withdrawal operation:
     * 1. Validates sufficient balance.
     * 2. Updates balance in ACCOUNT table (balance - amount).
     * 3. Inserts a record in TRANSACTION table with type 'WITHDRAW'.
     *
     * @param accountNo Target account number
     * @param amount Withdrawal amount (must be > 0)
     * @return New updated balance
     * @throws SQLException on database error or insufficient balance
     */
    public double withdraw(int accountNo, double amount) throws SQLException {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be greater than zero.");
        }

        Account account = getAccountByNo(accountNo);
        if (account == null) {
            throw new SQLException("Account number " + accountNo + " does not exist.");
        }

        if (account.getBalance() < amount) {
            throw new SQLException("Insufficient balance! Current balance is ₹" + 
                                   String.format("%.2f", account.getBalance()) + 
                                   ", requested withdrawal is ₹" + String.format("%.2f", amount));
        }

        double newBalance = account.getBalance() - amount;
        String updateSql = "UPDATE ACCOUNT SET balance = ? WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(updateSql)) {
            pstmt.setDouble(1, newBalance);
            pstmt.setInt(2, accountNo);
            int rows = pstmt.executeUpdate();

            if (rows > 0) {
                // Record in TRANSACTION table
                Transaction tx = new Transaction(accountNo, "WITHDRAW", amount);
                transactionDAO.insertTransaction(tx);
                return newBalance;
            } else {
                throw new SQLException("Failed to update balance for account " + accountNo);
            }
        }
    }

    /**
     * Deletes an account:
     * 1. Deletes all associated transactions (foreign key requirement).
     * 2. Deletes the account row from ACCOUNT table.
     * 3. Deletes the customer if they have no other accounts remaining.
     *
     * @param accountNo Account number to delete
     * @return true if deleted successfully, false otherwise
     * @throws SQLException on database error
     */
    public boolean deleteAccount(int accountNo) throws SQLException {
        Account account = getAccountByNo(accountNo);
        if (account == null) {
            return false;
        }

        int customerId = account.getCustomerId();

        // 1. Delete transactions first
        transactionDAO.deleteTransactionsByAccountNo(accountNo);

        // 2. Delete account
        String deleteAccountSql = "DELETE FROM ACCOUNT WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();
        boolean deleted;

        try (PreparedStatement pstmt = conn.prepareStatement(deleteAccountSql)) {
            pstmt.setInt(1, accountNo);
            deleted = pstmt.executeUpdate() > 0;
        }

        // 3. Delete customer if no other accounts exist for this customer
        if (deleted && !customerDAO.hasActiveAccounts(customerId)) {
            customerDAO.deleteCustomer(customerId);
            System.out.println("Cleaned up orphaned customer record ID: " + customerId);
        }

        return deleted;
    }

    /**
     * Retrieves all accounts along with customer names for display/auditing.
     */
    public List<Account> getAllAccounts() throws SQLException {
        List<Account> list = new ArrayList<>();
        String sql = "SELECT account_no, customer_id, account_type, balance FROM ACCOUNT ORDER BY account_no ASC";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                list.add(new Account(
                    rs.getInt("account_no"),
                    rs.getInt("customer_id"),
                    rs.getString("account_type"),
                    rs.getDouble("balance")
                ));
            }
        }
        return list;
    }
}
