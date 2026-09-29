package model;

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
}
