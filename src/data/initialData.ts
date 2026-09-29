import { Account, Customer, Transaction } from '../types/bank';

export const INITIAL_CUSTOMERS: Customer[] = [
  { customerId: 1, name: 'Rahul Sharma', phone: '9876543210', address: '42 MG Road, Bangalore' },
  { customerId: 2, name: 'Priya Patel', phone: '9123456780', address: '15 Nehru Nagar, Mumbai' },
  { customerId: 3, name: 'Amit Verma', phone: '9988776655', address: '7 Civil Lines, New Delhi' },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { accountNo: 1001, customerId: 1, accountType: 'Savings', balance: 25000.00 },
  { accountNo: 1002, customerId: 2, accountType: 'Savings', balance: 15000.00 },
  { accountNo: 1003, customerId: 3, accountType: 'Current', balance: 50000.00 },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { transactionId: 1, accountNo: 1001, type: 'DEPOSIT', amount: 25000.00, transactionDate: '2026-09-01 10:30:00' },
  { transactionId: 2, accountNo: 1002, type: 'DEPOSIT', amount: 15000.00, transactionDate: '2026-09-02 11:15:00' },
  { transactionId: 3, accountNo: 1003, type: 'DEPOSIT', amount: 50000.00, transactionDate: '2026-09-03 14:00:00' },
  { transactionId: 4, accountNo: 1001, type: 'DEPOSIT', amount: 5000.00, transactionDate: '2026-09-10 16:45:00' },
  { transactionId: 5, accountNo: 1001, type: 'WITHDRAW', amount: 2000.00, transactionDate: '2026-09-15 09:20:00' },
];

export interface ProjectFile {
  path: string;
  name: string;
  category: 'Source Code' | 'Config & Scripts' | 'Docs';
  language: string;
  content: string;
}

export const JAVA_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'src/Main.java',
    name: 'Main.java',
    category: 'Source Code',
    language: 'java',
    content: `import ui.MainFrame;
import javax.swing.*;

/**
 * Main Application Entry Point
 * Bank Account Management System
 * 
 * 2nd-Year B.Tech CSE Mini Project
 * Demonstrates: Core Java, OOP, Java Swing GUI, JDBC, MySQL
 */
public class Main {
    public static void main(String[] args) {
        // Set Look and Feel for modern appearance
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception e) {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ex) {
                // Default to standard Swing theme if Nimbus is unavailable
            }
        }

        // Launch GUI safely on the Event Dispatch Thread (EDT)
        SwingUtilities.invokeLater(() -> {
            MainFrame mainFrame = new MainFrame();
            mainFrame.setVisible(true);
        });
    }
}`
  },
  {
    path: 'src/model/Customer.java',
    name: 'Customer.java',
    category: 'Source Code',
    language: 'java',
    content: `package model;

/**
 * Customer Model Class
 * Represents a customer entity in the bank_management database.
 * Demonstrates: OOP Encapsulation (private fields, constructors, getters & setters).
 */
public class Customer {
    private int customerId;
    private String name;
    private String phone;
    private String address;

    // Default Constructor
    public Customer() {
    }

    // Parameterized Constructor (without ID - for creating new customer)
    public Customer(String name, String phone, String address) {
        this.name = name;
        this.phone = phone;
        this.address = address;
    }

    // Parameterized Constructor (with ID - for retrieving from database)
    public Customer(int customerId, String name, String phone, String address) {
        this.customerId = customerId;
        this.name = name;
        this.phone = phone;
        this.address = address;
    }

    // Getters and Setters (Encapsulation)
    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Customer [ID=" + customerId + ", Name=" + name + ", Phone=" + phone + ", Address=" + address + "]";
    }
}`
  },
  {
    path: 'src/model/Account.java',
    name: 'Account.java',
    category: 'Source Code',
    language: 'java',
    content: `package model;

/**
 * Account Model Class
 * Represents a bank account entity in the bank_management database.
 * Demonstrates: OOP Encapsulation (private fields, constructors, getters & setters).
 */
public class Account {
    private int accountNo;
    private int customerId;
    private String accountType; // "Savings" or "Current"
    private double balance;

    // Default Constructor
    public Account() {
    }

    // Parameterized Constructor
    public Account(int accountNo, int customerId, String accountType, double balance) {
        this.accountNo = accountNo;
        this.customerId = customerId;
        this.accountType = accountType;
        this.balance = balance;
    }

    // Getters and Setters
    public int getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(int accountNo) {
        this.accountNo = accountNo;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    @Override
    public String toString() {
        return "Account [AccountNo=" + accountNo + ", CustomerID=" + customerId + 
               ", Type=" + accountType + ", Balance=₹" + balance + "]";
    }
}`
  },
  {
    path: 'src/model/Transaction.java',
    name: 'Transaction.java',
    category: 'Source Code',
    language: 'java',
    content: `package model;

import java.sql.Timestamp;

/**
 * Transaction Model Class
 * Represents a financial transaction (DEPOSIT, WITHDRAW) in the bank_management database.
 * Demonstrates: OOP Encapsulation (private fields, constructors, getters & setters).
 */
public class Transaction {
    private int transactionId;
    private int accountNo;
    private String type; // "DEPOSIT" or "WITHDRAW"
    private double amount;
    private Timestamp transactionDate;

    // Default Constructor
    public Transaction() {
    }

    // Parameterized Constructor (without ID and timestamp - for recording new transaction)
    public Transaction(int accountNo, String type, double amount) {
        this.accountNo = accountNo;
        this.type = type;
        this.amount = amount;
    }

    // Parameterized Constructor (with all fields - for retrieving from database)
    public Transaction(int transactionId, int accountNo, String type, double amount, Timestamp transactionDate) {
        this.transactionId = transactionId;
        this.accountNo = accountNo;
        this.type = type;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }

    // Getters and Setters
    public int getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(int transactionId) {
        this.transactionId = transactionId;
    }

    public int getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(int accountNo) {
        this.accountNo = accountNo;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Timestamp getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Timestamp transactionDate) {
        this.transactionDate = transactionDate;
    }

    @Override
    public String toString() {
        return "Transaction [ID=" + transactionId + ", AccountNo=" + accountNo + 
               ", Type=" + type + ", Amount=₹" + amount + ", Date=" + transactionDate + "]";
    }
}`
  },
  {
    path: 'src/dao/CustomerDAO.java',
    name: 'CustomerDAO.java',
    category: 'Source Code',
    language: 'java',
    content: `package dao;

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

    public boolean deleteCustomer(int customerId) throws SQLException {
        String sql = "DELETE FROM CUSTOMER WHERE customer_id = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, customerId);
            return pstmt.executeUpdate() > 0;
        }
    }
}`
  },
  {
    path: 'src/dao/AccountDAO.java',
    name: 'AccountDAO.java',
    category: 'Source Code',
    language: 'java',
    content: `package dao;

import model.Account;
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
 */
public class AccountDAO {

    private final CustomerDAO customerDAO = new CustomerDAO();
    private final TransactionDAO transactionDAO = new TransactionDAO();

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
                Transaction tx = new Transaction(accountNo, "DEPOSIT", amount);
                transactionDAO.insertTransaction(tx);
                return newBalance;
            } else {
                throw new SQLException("Failed to update balance for account " + accountNo);
            }
        }
    }

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
                Transaction tx = new Transaction(accountNo, "WITHDRAW", amount);
                transactionDAO.insertTransaction(tx);
                return newBalance;
            } else {
                throw new SQLException("Failed to update balance for account " + accountNo);
            }
        }
    }

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
        }

        return deleted;
    }

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
}`
  },
  {
    path: 'src/dao/TransactionDAO.java',
    name: 'TransactionDAO.java',
    category: 'Source Code',
    language: 'java',
    content: `package dao;

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

    public int deleteTransactionsByAccountNo(int accountNo) throws SQLException {
        String sql = "DELETE FROM TRANSACTION WHERE account_no = ?";
        Connection conn = DatabaseConnection.getConnection();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, accountNo);
            return pstmt.executeUpdate();
        }
    }
}`
  },
  {
    path: 'src/util/DatabaseConnection.java',
    name: 'DatabaseConnection.java',
    category: 'Source Code',
    language: 'java',
    content: `package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseConnection Utility Class
 * Manages the JDBC connection to the MySQL database 'bank_management'.
 */
public class DatabaseConnection {

    // Database credentials configuration
    // EDIT THESE CONSTANTS TO MATCH YOUR LOCAL MYSQL CONFIGURATION:
    private static final String URL = "jdbc:mysql://localhost:3306/bank_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USERNAME = "root";  // Default MySQL user
    private static final String PASSWORD = "root";  // Change to your MySQL password

    private static Connection connection = null;

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("❌ MySQL JDBC Driver not found! Ensure mysql-connector-j.jar is in classpath.");
            e.printStackTrace();
        }
    }

    private DatabaseConnection() {
    }

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        }
        return connection;
    }

    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}`
  },
  {
    path: 'src/ui/MainFrame.java',
    name: 'MainFrame.java',
    category: 'Source Code',
    language: 'java',
    content: `package ui;

import util.DatabaseConnection;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.MatteBorder;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.sql.Connection;

/**
 * MainFrame
 * Main desktop application window for BANK ACCOUNT MANAGEMENT SYSTEM.
 * Integrates navigation menu, CardLayout panels, status bar, and window lifecycle.
 */
public class MainFrame extends JFrame {

    private final JPanel contentArea;
    private final CardLayout cardLayout;

    private final CreateAccountPanel createAccountPanel;
    private final AccountPanel accountPanel;

    private final JLabel statusLabel;
    private JButton activeButton = null;

    public MainFrame() {
        setTitle("BANK ACCOUNT MANAGEMENT SYSTEM");
        setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        setSize(980, 680);
        setMinimumSize(new Dimension(850, 580));
        setLocationRelativeTo(null); // Center on screen

        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                handleExit();
            }
        });

        JPanel rootPanel = new JPanel(new BorderLayout());
        setContentPane(rootPanel);

        // Header, Sidebar, and Content Cards
        rootPanel.add(createHeaderPanel(), BorderLayout.NORTH);
        rootPanel.add(createSidebarPanel(), BorderLayout.WEST);

        cardLayout = new CardLayout();
        contentArea = new JPanel(cardLayout);
        contentArea.setBackground(new Color(248, 250, 252));

        createAccountPanel = new CreateAccountPanel();
        accountPanel = new AccountPanel();

        contentArea.add(createAccountPanel, "CREATE_ACCOUNT");
        contentArea.add(accountPanel, "ACCOUNT_OPS");
        rootPanel.add(contentArea, BorderLayout.CENTER);

        // Bottom Status Bar
        JPanel statusBar = new JPanel(new BorderLayout());
        statusBar.setBackground(new Color(241, 245, 249));
        statusBar.setBorder(new CompoundBorder(
            new MatteBorder(1, 0, 0, 0, new Color(203, 213, 225)),
            new EmptyBorder(6, 16, 6, 16)
        ));

        statusLabel = new JLabel("Checking MySQL Database connection...");
        statusLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        statusLabel.setForeground(new Color(71, 85, 105));

        JLabel techBadge = new JLabel("Core Java • Swing • JDBC • MySQL");
        techBadge.setFont(new Font("Segoe UI", Font.BOLD, 11));
        techBadge.setForeground(new Color(100, 116, 139));

        statusBar.add(statusLabel, BorderLayout.WEST);
        statusBar.add(techBadge, BorderLayout.EAST);
        rootPanel.add(statusBar, BorderLayout.SOUTH);

        checkDatabaseStatus();
    }

    private JPanel createHeaderPanel() {
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(new Color(15, 23, 42));
        header.setBorder(new EmptyBorder(16, 24, 16, 24));

        JPanel titleBlock = new JPanel(new GridLayout(2, 1, 0, 2));
        titleBlock.setOpaque(false);

        JLabel title = new JLabel("BANK ACCOUNT MANAGEMENT SYSTEM");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(Color.WHITE);

        JLabel subtitle = new JLabel("2nd Year B.Tech CSE Mini Project | Core Java + JDBC + MySQL");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        subtitle.setForeground(new Color(148, 163, 184));

        titleBlock.add(title);
        titleBlock.add(subtitle);
        header.add(titleBlock, BorderLayout.WEST);

        JLabel logoBadge = new JLabel("🏛️ APEX BANK");
        logoBadge.setFont(new Font("Segoe UI", Font.BOLD, 16));
        logoBadge.setForeground(new Color(56, 189, 248));
        header.add(logoBadge, BorderLayout.EAST);

        return header;
    }

    private JPanel createSidebarPanel() {
        JPanel sidebar = new JPanel();
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setPreferredSize(new Dimension(220, 0));
        sidebar.setBackground(new Color(30, 41, 59));
        sidebar.setBorder(new CompoundBorder(
            new MatteBorder(0, 0, 0, 1, new Color(51, 65, 85)),
            new EmptyBorder(15, 12, 15, 12)
        ));

        // 8 Required Buttons: Create, View, Deposit, Withdraw, Balance, Transactions, Delete, Exit
        JButton btnCreate = createNavButton("➕ Create Account", () -> cardLayout.show(contentArea, "CREATE_ACCOUNT"));
        JButton btnView = createNavButton("👤 View Account", () -> {
            accountPanel.showView("VIEW_ACCOUNT");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        JButton btnDeposit = createNavButton("💰 Deposit Money", () -> {
            accountPanel.showView("DEPOSIT");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        JButton btnWithdraw = createNavButton("💸 Withdraw Money", () -> {
            accountPanel.showView("WITHDRAW");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        JButton btnBalance = createNavButton("⚖️ Check Balance", () -> {
            accountPanel.showView("CHECK_BALANCE");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        JButton btnTransactions = createNavButton("📜 View Transactions", () -> {
            accountPanel.showView("TRANSACTIONS");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        JButton btnDelete = createNavButton("🗑️ Delete Account", () -> {
            accountPanel.showView("DELETE_ACCOUNT");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });

        sidebar.add(btnCreate);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));
        sidebar.add(btnView);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));
        sidebar.add(btnDeposit);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));
        sidebar.add(btnWithdraw);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));
        sidebar.add(btnBalance);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));
        sidebar.add(btnTransactions);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));
        sidebar.add(btnDelete);

        sidebar.add(Box.createVerticalGlue());

        JButton btnExit = createNavButton("🚪 Exit System", this::handleExit);
        btnExit.setBackground(new Color(185, 28, 28));
        sidebar.add(btnExit);

        btnCreate.doClick();
        return sidebar;
    }

    private JButton createNavButton(String text, Runnable action) {
        JButton btn = new JButton(text);
        btn.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));
        btn.setPreferredSize(new Dimension(196, 40));
        btn.setAlignmentX(Component.LEFT_ALIGNMENT);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setForeground(new Color(241, 245, 249));
        btn.setBackground(new Color(51, 65, 85));
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setBorder(new EmptyBorder(8, 14, 8, 14));
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));

        btn.addActionListener(e -> {
            if (activeButton != null && activeButton != btn) {
                activeButton.setBackground(new Color(51, 65, 85));
            }
            if (!text.contains("Exit")) {
                btn.setBackground(new Color(37, 99, 235));
                activeButton = btn;
            }
            action.run();
        });
        return btn;
    }

    private void checkDatabaseStatus() {
        SwingWorker<Boolean, Void> worker = new SwingWorker<>() {
            @Override
            protected Boolean doInBackground() {
                try {
                    Connection conn = DatabaseConnection.getConnection();
                    return conn != null && !conn.isClosed();
                } catch (Exception e) {
                    return false;
                }
            }
            @Override
            protected void done() {
                try {
                    if (get()) {
                        statusLabel.setText("● Connected to MySQL: bank_management (localhost:3306)");
                        statusLabel.setForeground(new Color(22, 101, 52));
                    } else {
                        statusLabel.setText("○ MySQL Not Connected - Check DatabaseConnection.java credentials");
                        statusLabel.setForeground(new Color(185, 28, 28));
                    }
                } catch (Exception e) {
                    statusLabel.setText("○ MySQL Connection Error");
                }
            }
        };
        worker.execute();
    }

    private void handleExit() {
        int confirm = JOptionPane.showConfirmDialog(
            this,
            "Are you sure you want to exit Bank Account Management System?",
            "Exit Confirmation",
            JOptionPane.YES_NO_OPTION,
            JOptionPane.QUESTION_MESSAGE
        );

        if (confirm == JOptionPane.YES_OPTION) {
            DatabaseConnection.closeConnection();
            dispose();
            System.exit(0);
        }
    }
}`
  },
  {
    path: 'src/ui/CreateAccountPanel.java',
    name: 'CreateAccountPanel.java',
    category: 'Source Code',
    language: 'java',
    content: `package ui;

import dao.AccountDAO;
import dao.CustomerDAO;
import model.Account;
import model.Customer;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import java.awt.*;
import java.awt.event.ActionEvent;

/**
 * CreateAccountPanel
 * Form for registering a new customer and opening their bank account.
 */
public class CreateAccountPanel extends JPanel {

    private final JTextField nameField;
    private final JTextField phoneField;
    private final JTextField addressField;
    private final JTextField accountNoField;
    private final JComboBox<String> accountTypeCombo;
    private final JTextField balanceField;

    private final CustomerDAO customerDAO = new CustomerDAO();
    private final AccountDAO accountDAO = new AccountDAO();

    public CreateAccountPanel() {
        setLayout(new BorderLayout(15, 15));
        setBorder(new EmptyBorder(20, 25, 20, 25));
        setBackground(new Color(245, 247, 250));

        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setOpaque(false);
        JLabel titleLabel = new JLabel("Create New Bank Account");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        titleLabel.setForeground(new Color(24, 43, 73));
        headerPanel.add(titleLabel, BorderLayout.NORTH);
        add(headerPanel, BorderLayout.NORTH);

        JPanel formContainer = new JPanel();
        formContainer.setLayout(new BoxLayout(formContainer, BoxLayout.Y_AXIS));
        formContainer.setOpaque(false);

        // Customer Group
        JPanel customerGroup = new JPanel(new GridLayout(3, 2, 12, 12));
        customerGroup.setOpaque(false);
        customerGroup.setBorder(new CompoundBorder(
            new TitledBorder(new LineBorder(new Color(203, 213, 225), 1, true), " Customer Information "),
            new EmptyBorder(15, 15, 15, 15)
        ));

        nameField = new JTextField();
        phoneField = new JTextField();
        addressField = new JTextField();

        customerGroup.add(new JLabel("Customer Full Name: *"));
        customerGroup.add(nameField);
        customerGroup.add(new JLabel("Phone Number: *"));
        customerGroup.add(phoneField);
        customerGroup.add(new JLabel("Residential Address: *"));
        customerGroup.add(addressField);
        formContainer.add(customerGroup);

        formContainer.add(Box.createRigidArea(new Dimension(0, 15)));

        // Account Group
        JPanel accountGroup = new JPanel(new GridLayout(3, 2, 12, 12));
        accountGroup.setOpaque(false);
        accountGroup.setBorder(new CompoundBorder(
            new TitledBorder(new LineBorder(new Color(203, 213, 225), 1, true), " Account Information "),
            new EmptyBorder(15, 15, 15, 15)
        ));

        accountNoField = new JTextField();
        accountTypeCombo = new JComboBox<>(new String[]{"Savings", "Current"});
        balanceField = new JTextField("1000.00");

        accountGroup.add(new JLabel("Account Number: * (e.g. 1001)"));
        accountGroup.add(accountNoField);
        accountGroup.add(new JLabel("Account Type:"));
        accountGroup.add(accountTypeCombo);
        accountGroup.add(new JLabel("Initial Deposit Balance (₹): *"));
        accountGroup.add(balanceField);
        formContainer.add(accountGroup);

        formContainer.add(Box.createRigidArea(new Dimension(0, 20)));

        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 0));
        buttonPanel.setOpaque(false);

        JButton clearBtn = new JButton("Reset Form");
        clearBtn.addActionListener(e -> clearForm());

        JButton submitBtn = new JButton("Create Account");
        submitBtn.setBackground(new Color(16, 185, 129));
        submitBtn.setForeground(Color.WHITE);
        submitBtn.addActionListener(this::handleCreateAccount);

        buttonPanel.add(clearBtn);
        buttonPanel.add(submitBtn);
        formContainer.add(buttonPanel);

        add(new JScrollPane(formContainer), BorderLayout.CENTER);
    }

    private void handleCreateAccount(ActionEvent e) {
        String name = nameField.getText().trim();
        String phone = phoneField.getText().trim();
        String address = addressField.getText().trim();
        String accNoStr = accountNoField.getText().trim();
        String accType = (String) accountTypeCombo.getSelectedItem();
        String balanceStr = balanceField.getText().trim();

        if (name.isEmpty() || phone.isEmpty() || address.isEmpty() || accNoStr.isEmpty() || balanceStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "All fields marked with * are required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            int accountNo = Integer.parseInt(accNoStr);
            double balance = Double.parseDouble(balanceStr);

            if (accountNo <= 0 || balance < 0) {
                JOptionPane.showMessageDialog(this, "Account number and initial balance must be valid positive numbers.", "Validation Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            if (accountDAO.accountExists(accountNo)) {
                JOptionPane.showMessageDialog(this, "Account number " + accountNo + " already exists!", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            Customer customer = new Customer(name, phone, address);
            int customerId = customerDAO.insertCustomer(customer);

            Account account = new Account(accountNo, customerId, accType, balance);
            boolean accCreated = accountDAO.insertAccount(account);

            if (accCreated) {
                JOptionPane.showMessageDialog(this,
                    "Account created successfully.\n\n" +
                    "Customer ID: " + customerId + "\\n" +
                    "Account Number: " + accountNo + "\\n" +
                    "Opening Balance: ₹" + String.format("%.2f", balance),
                    "Success", JOptionPane.INFORMATION_MESSAGE);
                clearForm();
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearForm() {
        nameField.setText("");
        phoneField.setText("");
        addressField.setText("");
        accountNoField.setText("");
        accountTypeCombo.setSelectedIndex(0);
        balanceField.setText("1000.00");
    }
}`
  },
  {
    path: 'src/ui/AccountPanel.java',
    name: 'AccountPanel.java',
    category: 'Source Code',
    language: 'java',
    content: `package ui;

import dao.AccountDAO;
import dao.CustomerDAO;
import dao.TransactionDAO;
import model.Account;
import model.Customer;
import model.Transaction;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

/**
 * AccountPanel
 * Provides dedicated views for banking operations:
 * - View Account
 * - Deposit Money
 * - Withdraw Money
 * - Check Balance
 * - View Transactions (JTable)
 * - Delete Account
 */
public class AccountPanel extends JPanel {

    private final AccountDAO accountDAO = new AccountDAO();
    private final CustomerDAO customerDAO = new CustomerDAO();
    private final TransactionDAO transactionDAO = new TransactionDAO();

    private final CardLayout cardLayout;
    private final JPanel containerPanel;

    // View Account
    private JTextField viewAccNoField;
    private JLabel viewCustIdLabel, viewNameLabel, viewPhoneLabel, viewAddressLabel, viewAccNoLabel, viewAccTypeLabel, viewBalanceLabel;
    private JPanel viewResultCard;

    // Deposit & Withdraw
    private JTextField depAccNoField, depAmountField;
    private JTextField withAccNoField, withAmountField;

    // Check Balance
    private JTextField balAccNoField;
    private JLabel balResultAccNo, balResultAmount;
    private JPanel balResultCard;

    // Transactions Table
    private JTextField txAccNoField;
    private JTable txTable;
    private DefaultTableModel txTableModel;
    private JLabel txSummaryLabel;

    // Delete Account
    private JTextField delAccNoField;

    public AccountPanel() {
        cardLayout = new CardLayout();
        containerPanel = new JPanel(cardLayout);
        setLayout(new BorderLayout());
        setOpaque(false);

        containerPanel.add(buildViewAccountPanel(), "VIEW_ACCOUNT");
        containerPanel.add(buildDepositPanel(), "DEPOSIT");
        containerPanel.add(buildWithdrawPanel(), "WITHDRAW");
        containerPanel.add(buildCheckBalancePanel(), "CHECK_BALANCE");
        containerPanel.add(buildTransactionsPanel(), "TRANSACTIONS");
        containerPanel.add(buildDeleteAccountPanel(), "DELETE_ACCOUNT");

        add(containerPanel, BorderLayout.CENTER);
    }

    public void showView(String viewName) {
        cardLayout.show(containerPanel, viewName);
    }

    private JPanel buildViewAccountPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("View Account Details");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        header.add(title, BorderLayout.NORTH);
        panel.add(header, BorderLayout.NORTH);

        JPanel body = new JPanel();
        body.setLayout(new BoxLayout(body, BoxLayout.Y_AXIS));
        body.setOpaque(false);

        JPanel inputBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        inputBar.setOpaque(false);
        inputBar.add(new JLabel("Enter Account Number:"));
        viewAccNoField = new JTextField(12);
        JButton searchBtn = new JButton("Fetch Account Details");
        searchBtn.addActionListener(e -> {
            try {
                int accNo = Integer.parseInt(viewAccNoField.getText().trim());
                Account acc = accountDAO.getAccountByNo(accNo);
                if (acc == null) {
                    viewResultCard.setVisible(false);
                    JOptionPane.showMessageDialog(this, "Account not found: " + accNo, "Not Found", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                Customer cust = customerDAO.getCustomerById(acc.getCustomerId());
                viewCustIdLabel.setText(String.valueOf(acc.getCustomerId()));
                viewNameLabel.setText(cust != null ? cust.getName() : "N/A");
                viewPhoneLabel.setText(cust != null ? cust.getPhone() : "N/A");
                viewAddressLabel.setText(cust != null ? cust.getAddress() : "N/A");
                viewAccNoLabel.setText(String.valueOf(acc.getAccountNo()));
                viewAccTypeLabel.setText(acc.getAccountType());
                viewBalanceLabel.setText("₹" + String.format("%.2f", acc.getBalance()));
                viewResultCard.setVisible(true);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        inputBar.add(viewAccNoField);
        inputBar.add(searchBtn);
        body.add(inputBar);

        viewResultCard = new JPanel(new GridLayout(7, 2, 12, 12));
        viewResultCard.setBackground(Color.WHITE);
        viewResultCard.setBorder(new CompoundBorder(new LineBorder(new Color(203, 213, 225), 1, true), new EmptyBorder(20, 20, 20, 20)));
        viewResultCard.setVisible(false);

        viewCustIdLabel = new JLabel("-");
        viewNameLabel = new JLabel("-");
        viewPhoneLabel = new JLabel("-");
        viewAddressLabel = new JLabel("-");
        viewAccNoLabel = new JLabel("-");
        viewAccTypeLabel = new JLabel("-");
        viewBalanceLabel = new JLabel("-");

        viewResultCard.add(new JLabel("Customer ID:")); viewResultCard.add(viewCustIdLabel);
        viewResultCard.add(new JLabel("Customer Name:")); viewResultCard.add(viewNameLabel);
        viewResultCard.add(new JLabel("Phone Number:")); viewResultCard.add(viewPhoneLabel);
        viewResultCard.add(new JLabel("Residential Address:")); viewResultCard.add(viewAddressLabel);
        viewResultCard.add(new JLabel("Account Number:")); viewResultCard.add(viewAccNoLabel);
        viewResultCard.add(new JLabel("Account Type:")); viewResultCard.add(viewAccTypeLabel);
        viewResultCard.add(new JLabel("Current Balance:")); viewResultCard.add(viewBalanceLabel);

        body.add(viewResultCard);
        panel.add(body, BorderLayout.CENTER);
        return panel;
    }

    private JPanel buildDepositPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JLabel title = new JLabel("Deposit Money");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        panel.add(title, BorderLayout.NORTH);

        JPanel formCard = new JPanel(new GridLayout(2, 2, 15, 15));
        formCard.setBackground(Color.WHITE);
        formCard.setBorder(new CompoundBorder(new LineBorder(new Color(203, 213, 225), 1, true), new EmptyBorder(25, 25, 25, 25)));

        depAccNoField = new JTextField(15);
        depAmountField = new JTextField(15);
        formCard.add(new JLabel("Target Account Number: *")); formCard.add(depAccNoField);
        formCard.add(new JLabel("Deposit Amount (₹): *")); formCard.add(depAmountField);

        JButton depositBtn = new JButton("Confirm Deposit");
        depositBtn.setBackground(new Color(16, 185, 129));
        depositBtn.setForeground(Color.WHITE);
        depositBtn.addActionListener(e -> {
            try {
                int accNo = Integer.parseInt(depAccNoField.getText().trim());
                double amount = Double.parseDouble(depAmountField.getText().trim());
                double newBal = accountDAO.deposit(accNo, amount);
                JOptionPane.showMessageDialog(this, "Deposit Successful! Updated Balance: ₹" + String.format("%.2f", newBal), "Success", JOptionPane.INFORMATION_MESSAGE);
                depAccNoField.setText("");
                depAmountField.setText("");
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(), "Deposit Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        JPanel container = new JPanel();
        container.setLayout(new BoxLayout(container, BoxLayout.Y_AXIS));
        container.setOpaque(false);
        container.add(formCard);
        container.add(Box.createRigidArea(new Dimension(0, 15)));
        container.add(depositBtn);
        panel.add(container, BorderLayout.CENTER);
        return panel;
    }

    private JPanel buildWithdrawPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JLabel title = new JLabel("Withdraw Money");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        panel.add(title, BorderLayout.NORTH);

        JPanel formCard = new JPanel(new GridLayout(2, 2, 15, 15));
        formCard.setBackground(Color.WHITE);
        formCard.setBorder(new CompoundBorder(new LineBorder(new Color(203, 213, 225), 1, true), new EmptyBorder(25, 25, 25, 25)));

        withAccNoField = new JTextField(15);
        withAmountField = new JTextField(15);
        formCard.add(new JLabel("Source Account Number: *")); formCard.add(withAccNoField);
        formCard.add(new JLabel("Withdrawal Amount (₹): *")); formCard.add(withAmountField);

        JButton withdrawBtn = new JButton("Confirm Withdrawal");
        withdrawBtn.setBackground(new Color(239, 68, 68));
        withdrawBtn.setForeground(Color.WHITE);
        withdrawBtn.addActionListener(e -> {
            try {
                int accNo = Integer.parseInt(withAccNoField.getText().trim());
                double amount = Double.parseDouble(withAmountField.getText().trim());
                double newBal = accountDAO.withdraw(accNo, amount);
                JOptionPane.showMessageDialog(this, "Withdrawal Successful! Updated Balance: ₹" + String.format("%.2f", newBal), "Success", JOptionPane.INFORMATION_MESSAGE);
                withAccNoField.setText("");
                withAmountField.setText("");
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(), "Withdrawal Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        JPanel container = new JPanel();
        container.setLayout(new BoxLayout(container, BoxLayout.Y_AXIS));
        container.setOpaque(false);
        container.add(formCard);
        container.add(Box.createRigidArea(new Dimension(0, 15)));
        container.add(withdrawBtn);
        panel.add(container, BorderLayout.CENTER);
        return panel;
    }

    private JPanel buildCheckBalancePanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JLabel title = new JLabel("Check Account Balance");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        panel.add(title, BorderLayout.NORTH);

        JPanel body = new JPanel();
        body.setLayout(new BoxLayout(body, BoxLayout.Y_AXIS));
        body.setOpaque(false);

        JPanel inputBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        inputBar.setOpaque(false);
        inputBar.add(new JLabel("Account Number:"));
        balAccNoField = new JTextField(12);
        JButton checkBtn = new JButton("Query Balance");
        checkBtn.addActionListener(e -> {
            try {
                int accNo = Integer.parseInt(balAccNoField.getText().trim());
                double bal = accountDAO.getBalance(accNo);
                if (bal < 0) {
                    balResultCard.setVisible(false);
                    JOptionPane.showMessageDialog(this, "Account number " + accNo + " does not exist.", "Not Found", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                balResultAccNo.setText(String.valueOf(accNo));
                balResultAmount.setText("₹" + String.format("%.2f", bal));
                balResultCard.setVisible(true);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        inputBar.add(balAccNoField);
        inputBar.add(checkBtn);
        body.add(inputBar);

        balResultCard = new JPanel(new GridLayout(2, 2, 15, 15));
        balResultCard.setBackground(Color.WHITE);
        balResultCard.setBorder(new CompoundBorder(new LineBorder(new Color(203, 213, 225), 1, true), new EmptyBorder(20, 25, 20, 25)));
        balResultCard.setVisible(false);

        balResultAccNo = new JLabel("-");
        balResultAmount = new JLabel("-");
        balResultCard.add(new JLabel("Account Number:")); balResultCard.add(balResultAccNo);
        balResultCard.add(new JLabel("Available Balance:")); balResultCard.add(balResultAmount);

        body.add(balResultCard);
        panel.add(body, BorderLayout.CENTER);
        return panel;
    }

    private JPanel buildTransactionsPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JLabel title = new JLabel("Account Transaction History");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        panel.add(title, BorderLayout.NORTH);

        JPanel content = new JPanel(new BorderLayout(10, 10));
        content.setOpaque(false);

        JPanel queryBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        queryBar.setOpaque(false);
        queryBar.add(new JLabel("Account Number:"));
        txAccNoField = new JTextField(12);
        JButton loadBtn = new JButton("Load Transactions");
        queryBar.add(txAccNoField);
        queryBar.add(loadBtn);

        txSummaryLabel = new JLabel("");
        queryBar.add(txSummaryLabel);
        content.add(queryBar, BorderLayout.NORTH);

        String[] columns = {"Transaction ID", "Type", "Amount (₹)", "Transaction Date"};
        txTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        txTable = new JTable(txTableModel);
        content.add(new JScrollPane(txTable), BorderLayout.CENTER);

        loadBtn.addActionListener(e -> {
            try {
                int accNo = Integer.parseInt(txAccNoField.getText().trim());
                if (!accountDAO.accountExists(accNo)) {
                    JOptionPane.showMessageDialog(this, "Account " + accNo + " does not exist.", "Not Found", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                List<Transaction> list = transactionDAO.getTransactionsByAccountNo(accNo);
                txTableModel.setRowCount(0);
                for (Transaction t : list) {
                    txTableModel.addRow(new Object[]{
                        t.getTransactionId(),
                        t.getType(),
                        "₹" + String.format("%.2f", t.getAmount()),
                        t.getTransactionDate() != null ? t.getTransactionDate().toString() : "Recent"
                    });
                }
                txSummaryLabel.setText("Found " + list.size() + " records");
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        panel.add(content, BorderLayout.CENTER);
        return panel;
    }

    private JPanel buildDeleteAccountPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JLabel title = new JLabel("Delete Account");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(220, 38, 38));
        panel.add(title, BorderLayout.NORTH);

        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setOpaque(false);

        JPanel formCard = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 15));
        formCard.setBackground(Color.WHITE);
        formCard.setBorder(new CompoundBorder(new LineBorder(new Color(203, 213, 225), 1, true), new EmptyBorder(15, 20, 15, 20)));

        delAccNoField = new JTextField(12);
        formCard.add(new JLabel("Account Number to Delete:"));
        formCard.add(delAccNoField);

        JButton deleteBtn = new JButton("Permanently Delete Account");
        deleteBtn.setBackground(new Color(220, 38, 38));
        deleteBtn.setForeground(Color.WHITE);
        deleteBtn.addActionListener(e -> {
            try {
                int accNo = Integer.parseInt(delAccNoField.getText().trim());
                if (!accountDAO.accountExists(accNo)) {
                    JOptionPane.showMessageDialog(this, "Account " + accNo + " does not exist.", "Not Found", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to delete Account " + accNo + "?", "Confirm", JOptionPane.YES_NO_OPTION);
                if (confirm == JOptionPane.YES_OPTION) {
                    accountDAO.deleteAccount(accNo);
                    JOptionPane.showMessageDialog(this, "Account " + accNo + " deleted successfully.", "Deleted", JOptionPane.INFORMATION_MESSAGE);
                    delAccNoField.setText("");
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        formCard.add(deleteBtn);
        content.add(formCard);

        panel.add(content, BorderLayout.CENTER);
        return panel;
    }
}`
  },
  {
    path: 'database.sql',
    name: 'database.sql',
    category: 'Config & Scripts',
    language: 'sql',
    content: `-- =======================================================
-- BANK ACCOUNT MANAGEMENT SYSTEM - DATABASE SCRIPT
-- Academic Mini Project: 2nd Year B.Tech CSE
-- Database: MySQL
-- =======================================================

CREATE DATABASE IF NOT EXISTS bank_management;
USE bank_management;

DROP TABLE IF EXISTS TRANSACTION;
DROP TABLE IF EXISTS ACCOUNT;
DROP TABLE IF EXISTS CUSTOMER;

CREATE TABLE CUSTOMER (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE ACCOUNT (
    account_no INT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE TRANSACTION (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    account_no INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_no) REFERENCES ACCOUNT(account_no) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sample Seed Data
INSERT INTO CUSTOMER (customer_id, name, phone, address) VALUES
(1, 'Rahul Sharma', '9876543210', '42 MG Road, Bangalore'),
(2, 'Priya Patel', '9123456780', '15 Nehru Nagar, Mumbai'),
(3, 'Amit Verma', '9988776655', '7 Civil Lines, New Delhi');

INSERT INTO ACCOUNT (account_no, customer_id, account_type, balance) VALUES
(1001, 1, 'Savings', 25000.00),
(1002, 2, 'Savings', 15000.00),
(1003, 3, 'Current', 50000.00);

INSERT INTO TRANSACTION (transaction_id, account_no, type, amount, transaction_date) VALUES
(1, 1001, 'DEPOSIT', 25000.00, '2026-09-01 10:30:00'),
(2, 1002, 'DEPOSIT', 15000.00, '2026-09-02 11:15:00'),
(3, 1003, 'DEPOSIT', 50000.00, '2026-09-03 14:00:00'),
(4, 1001, 'DEPOSIT', 5000.00, '2026-09-10 16:45:00'),
(5, 1001, 'WITHDRAW', 2000.00, '2026-09-15 09:20:00');`
  },
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'Config & Scripts',
    language: 'xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.bank</groupId>
    <artifactId>bank-account-management</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- MySQL JDBC Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src</sourceDirectory>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <mainClass>Main</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'run.bat',
    name: 'run.bat',
    category: 'Config & Scripts',
    language: 'bat',
    content: `@echo off
echo ========================================================
echo   BANK ACCOUNT MANAGEMENT SYSTEM - Windows Run Script
echo ========================================================
if not exist bin mkdir bin
echo Compiling Java source files...
javac -d bin -cp ".;lib/mysql-connector-j-8.3.0.jar" src/model/*.java src/dao/*.java src/util/*.java src/ui/*.java src/Main.java
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed! Ensure JDK 11+ is installed.
    pause
    exit /b %ERRORLEVEL%
)
echo Compilation successful! Launching Application...
java -cp "bin;lib/mysql-connector-j-8.3.0.jar;." Main
pause`
  },
  {
    path: 'run.sh',
    name: 'run.sh',
    category: 'Config & Scripts',
    language: 'bash',
    content: `#!/bin/bash
mkdir -p bin
echo "Compiling Java source files..."
javac -d bin -cp ".:lib/*" src/model/*.java src/dao/*.java src/util/*.java src/ui/*.java src/Main.java
if [ $? -ne 0 ]; then
    echo "[ERROR] Compilation failed! Ensure JDK 11+ is installed."
    exit 1
fi
echo "Launching Swing Application..."
java -cp "bin:lib/*:." Main`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Docs',
    language: 'markdown',
    content: `# BANK ACCOUNT MANAGEMENT SYSTEM
### 2nd-Year B.Tech CSE Academic Java Mini Project
**Technologies:** Core Java • Java Swing GUI • JDBC • MySQL Database

## Quick Setup Guide
1. Import database: \`mysql -u root -p < database.sql\`
2. Set credentials in \`src/util/DatabaseConnection.java\`
3. Run \`mvn compile exec:java\` or execute \`run.bat\` / \`run.sh\`
`
  }
];

export interface VivaItem {
  id: number;
  question: string;
  category: 'JDBC' | 'OOP' | 'Java Swing' | 'MySQL' | 'Architecture';
  answer: string;
  keyPoints: string[];
}

export const VIVA_QUESTIONS: VivaItem[] = [
  {
    id: 1,
    category: 'JDBC',
    question: 'Why did you use PreparedStatement instead of Statement in this project?',
    answer: 'PreparedStatement precompiles the SQL query on the database server, which provides better execution speed when executed repeatedly. More importantly, it uses parameterized placeholders (?) that automatically escape and sanitize values, completely preventing SQL Injection attacks. It also handles date, timestamp, and numeric type conversions cleanly.',
    keyPoints: [
      'Precompiled query execution on MySQL server',
      'Protects against SQL Injection vulnerabilities',
      'Automatic handling of quotes and data types'
    ]
  },
  {
    id: 2,
    category: 'Architecture',
    question: 'What is the Data Access Object (DAO) pattern and why is it used here?',
    answer: 'The DAO pattern separates the low-level data access logic (SQL queries, JDBC Connection handling, ResultSet iteration) from the user interface and business models. In this project, CustomerDAO, AccountDAO, and TransactionDAO isolate all SQL code so that if the database schema or query changes, UI classes like MainFrame or CreateAccountPanel do not need to be modified.',
    keyPoints: [
      'Separation of Concerns (SoC)',
      'Loose coupling between GUI and MySQL database',
      'Centralized query logic and exception handling'
    ]
  },
  {
    id: 3,
    category: 'OOP',
    question: 'How is Encapsulation demonstrated in your project classes?',
    answer: 'Encapsulation is demonstrated in the model classes (Customer.java, Account.java, Transaction.java). All data members (like customerId, balance, accountNo) are declared with private access modifiers, preventing direct external mutation. Access and modification are provided strictly via public getters and setters, and constructors enforce proper state initialization.',
    keyPoints: [
      'Private data fields in model classes',
      'Public getters and setters for controlled access',
      'Default and parameterized constructors'
    ]
  },
  {
    id: 4,
    category: 'JDBC',
    question: 'What is the difference between executeQuery() and executeUpdate() in JDBC?',
    answer: 'executeQuery() is used for SQL SELECT statements and returns a ResultSet object containing the rows matching the query. executeUpdate() is used for DDL/DML statements like INSERT, UPDATE, DELETE and returns an integer representing the number of rows affected by the operation.',
    keyPoints: [
      'executeQuery() -> Returns ResultSet (used in Check Balance, View Account)',
      'executeUpdate() -> Returns int row count (used in Deposit, Withdraw, Delete)',
      'ResultSet must be closed or handled in try-with-resources'
    ]
  },
  {
    id: 5,
    category: 'MySQL',
    question: 'How do you handle Foreign Key constraints when deleting an account?',
    answer: 'The TRANSACTION table has a foreign key referencing ACCOUNT(account_no). In AccountDAO.deleteAccount(), we delete the corresponding transaction records first with TransactionDAO.deleteTransactionsByAccountNo(accountNo) before deleting the account record itself. In MySQL schema, we also defined ON DELETE CASCADE for relational integrity.',
    keyPoints: [
      'Child rows in TRANSACTION deleted before parent row in ACCOUNT',
      'ON DELETE CASCADE defined in database.sql',
      'Checks if customer has other accounts before removing customer record'
    ]
  },
  {
    id: 6,
    category: 'Java Swing',
    question: 'What is the Event Dispatch Thread (EDT) and why use SwingUtilities.invokeLater()?',
    answer: 'Swing components are not thread-safe. To prevent race conditions, UI freezing, and unpredictable graphics rendering glitches, all Swing component creation and updates should run on a single background thread known as the Event Dispatch Thread (EDT). Calling SwingUtilities.invokeLater() schedules the MainFrame creation onto the EDT.',
    keyPoints: [
      'Swing is single-threaded and not thread-safe',
      'Prevents GUI freeze and concurrency collisions',
      'Recommended standard by Java official documentation'
    ]
  },
  {
    id: 7,
    category: 'Java Swing',
    question: 'Which Layout Managers are used in your GUI design?',
    answer: 'We used BorderLayout for the overall window structure (North header, West sidebar, Center cards, South status bar), CardLayout for switching smoothly between CreateAccount and Account operation panels, GridLayout for form fields, and BoxLayout / FlowLayout for button alignment.',
    keyPoints: [
      'BorderLayout for main frame regions',
      'CardLayout for panel switching without closing windows',
      'GridLayout for structured 2-column input forms'
    ]
  },
  {
    id: 8,
    category: 'JDBC',
    question: 'What does Class.forName("com.mysql.cj.jdbc.Driver") do?',
    answer: 'Class.forName() dynamically loads the MySQL JDBC driver class bytecode into JVM memory. When loaded, the driver registers itself with the JDBC DriverManager static registry, allowing DriverManager.getConnection() to establish socket connections to the MySQL server.',
    keyPoints: [
      'Dynamically loads MySQL Driver bytecode into JVM',
      'Registers driver with java.sql.DriverManager',
      'com.mysql.cj is the modern Type 4 pure Java driver package'
    ]
  }
];
