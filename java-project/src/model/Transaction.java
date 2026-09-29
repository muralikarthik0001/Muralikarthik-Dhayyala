package model;

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
}
