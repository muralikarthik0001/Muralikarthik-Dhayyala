package dao;

import model.Customer;
import util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * CustomerDAO - Data Access Object for CUSTOMER table
 * Performs CRUD operations on the CUSTOMER table using JDBC PreparedStatement and ResultSet.
 */
public class CustomerDAO {

    /**
     * Inserts a new customer record into the CUSTOMER table.
     * Uses PreparedStatement with RETURN_GENERATED_KEYS to retrieve the auto-generated customer_id.
     *
     * @param customer Customer object containing name, phone, address
     * @return Generated customer_id, or -1 if insertion fails
     * @throws SQLException on database error
     */
    public int insertCustomer(Customer customer) throws SQLException {
        String sql = "INSERT INTO CUSTOMER (name, phone, address) VALUES (?, ?, ?)";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, customer.getName());
            pstmt.setString(2, customer.getPhone());
            pstmt.setString(3, customer.getAddress());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating customer failed, no rows affected.");
            }

            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int id = generatedKeys.getInt(1);
                    customer.setCustomerId(id);
                    return id;
                } else {
                    throw new SQLException("Creating customer failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Retrieves a customer by their unique customer_id.
     *
     * @param customerId ID of customer to find
     * @return Customer object if found, null otherwise
     * @throws SQLException on database error
     */
    public Customer getCustomerById(int customerId) throws SQLException {
        String sql = "SELECT customer_id, name, phone, address FROM CUSTOMER WHERE customer_id = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, customerId);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new Customer(
                        rs.getInt("customer_id"),
                        rs.getString("name"),
                        rs.getString("phone"),
                        rs.getString("address")
                    );
                }
            }
        }
        return null;
    }

    /**
     * Checks if a customer has any remaining active accounts.
     *
     * @param customerId ID of customer to check
     * @return true if customer has one or more accounts, false otherwise
     * @throws SQLException on database error
     */
    public boolean hasActiveAccounts(int customerId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM ACCOUNT WHERE customer_id = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, customerId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }

    /**
     * Deletes a customer by their customer_id.
     *
     * @param customerId ID of customer to delete
     * @return true if deleted successfully, false otherwise
     * @throws SQLException on database error
     */
    public boolean deleteCustomer(int customerId) throws SQLException {
        String sql = "DELETE FROM CUSTOMER WHERE customer_id = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, customerId);
            return pstmt.executeUpdate() > 0;
        }
    }
}
