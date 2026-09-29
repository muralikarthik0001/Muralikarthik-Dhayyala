package model;

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
}
