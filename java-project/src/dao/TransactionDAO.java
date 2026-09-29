package dao;

import model.Transaction;
import util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * TransactionDAO - Data Access Object for TRANSACTION table
 * Handles logging and retrieving bank account transactions using JDBC.
 */
public class TransactionDAO {

    /**
     * Inserts a new transaction record into the TRANSACTION table.
     *
     * @param transaction Transaction object with account_no, type (DEPOSIT/WITHDRAW), and amount
     * @return true if inserted, false otherwise
     * @throws SQLException on database error
     */
    public boolean insertTransaction(Transaction transaction) throws SQLException {
        String sql = "INSERT INTO TRANSACTION (account_no, type, amount) VALUES (?, ?, ?)";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, transaction.getAccountNo());
            pstmt.setString(2, transaction.getType());
            pstmt.setDouble(3, transaction.getAmount());

            return pstmt.executeUpdate() > 0;
        }
    }

    /**
     * Retrieves all transaction records associated with a specific account number.
     * Ordered by transaction_date DESC so newest transactions appear first.
     *
     * @param accountNo Account number to query
     * @return List of Transaction objects
     * @throws SQLException on database error
     */
    public List<Transaction> getTransactionsByAccountNo(int accountNo) throws SQLException {
        List<Transaction> list = new ArrayList<>();
        String sql = "SELECT transaction_id, account_no, type, amount, transaction_date " +
                     "FROM TRANSACTION WHERE account_no = ? ORDER BY transaction_date DESC, transaction_id DESC";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, accountNo);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Transaction t = new Transaction(
                        rs.getInt("transaction_id"),
                        rs.getInt("account_no"),
                        rs.getString("type"),
                        rs.getDouble("amount"),
                        rs.getTimestamp("transaction_date")
                    );
                    list.add(t);
                }
            }
        }
        return list;
    }

    /**
     * Deletes all transaction records associated with an account number.
     * Called before deleting an account to satisfy Foreign Key constraints.
     *
     * @param accountNo Account number whose transactions should be deleted
     * @return Number of deleted transaction records
     * @throws SQLException on database error
     */
    public int deleteTransactionsByAccountNo(int accountNo) throws SQLException {
        String sql = "DELETE FROM TRANSACTION WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, accountNo);
            return pstmt.executeUpdate();
        }
    }
}
