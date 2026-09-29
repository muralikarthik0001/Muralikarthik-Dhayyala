package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseConnection Utility Class
 * Manages the JDBC connection to the MySQL database 'bank_management'.
 *
 * Demonstrates:
 * - DriverManager
 * - Connection
 * - Exception Handling (SQLException, ClassNotFoundException)
 */
public class DatabaseConnection {

    // Database credentials configuration
    // EDIT THESE 3 CONSTANTS TO MATCH YOUR LOCAL MYSQL CONFIGURATION:
    private static final String URL = "jdbc:mysql://localhost:3306/bank_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USERNAME = "root";  // Default MySQL user
    private static final String PASSWORD = "root";  // Change to your MySQL password (e.g., "root", "1234", "admin")

    private static Connection connection = null;

    // Load MySQL JDBC Driver in static block
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("❌ MySQL JDBC Driver not found! Ensure mysql-connector-j.jar is in classpath.");
            e.printStackTrace();
        }
    }

    // Private constructor to prevent instantiation (Utility class)
    private DatabaseConnection() {
    }

    /**
     * Obtains an active connection to the MySQL database.
     * Reuses existing connection if still open and valid, otherwise establishes a new one.
     *
     * @return Connection object to bank_management database
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            try {
                connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
                System.out.println("✅ Connected to MySQL Database: bank_management");
            } catch (SQLException e) {
                System.err.println("❌ Failed to connect to MySQL database!");
                System.err.println("Error message: " + e.getMessage());
                System.err.println("Hint: Make sure MySQL server is running on localhost:3306 and database 'bank_management' exists.");
                throw e;
            }
        }
        return connection;
    }

    /**
     * Closes the active database connection safely.
     */
    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
                System.out.println("🔒 Database connection closed.");
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
