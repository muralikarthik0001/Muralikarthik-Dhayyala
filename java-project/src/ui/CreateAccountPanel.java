package ui;

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
 * Demonstrates Swing components: JPanel, JLabel, JTextField, JComboBox, JButton, JOptionPane.
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

        // Header Panel
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setOpaque(false);
        JLabel titleLabel = new JLabel("Create New Bank Account");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        titleLabel.setForeground(new Color(24, 43, 73));

        JLabel subtitleLabel = new JLabel("Enter customer and account details to register in MySQL database");
        subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitleLabel.setForeground(new Color(100, 116, 139));

        headerPanel.add(titleLabel, BorderLayout.NORTH);
        headerPanel.add(subtitleLabel, BorderLayout.SOUTH);
        add(headerPanel, BorderLayout.NORTH);

        // Form Center Panel
        JPanel formContainer = new JPanel();
        formContainer.setLayout(new BoxLayout(formContainer, BoxLayout.Y_AXIS));
        formContainer.setOpaque(false);

        // Section 1: Customer Details
        JPanel customerGroup = new JPanel(new GridLayout(3, 2, 12, 12));
        customerGroup.setOpaque(false);
        customerGroup.setBorder(new CompoundBorder(
            new TitledBorder(new LineBorder(new Color(203, 213, 225), 1, true), " Customer Information ",
                TitledBorder.LEADING, TitledBorder.TOP, new Font("Segoe UI", Font.BOLD, 14), new Color(30, 58, 138)),
            new EmptyBorder(15, 15, 15, 15)
        ));

        nameField = createStyledTextField();
        phoneField = createStyledTextField();
        addressField = createStyledTextField();

        customerGroup.add(createFieldLabel("Customer Full Name: *"));
        customerGroup.add(nameField);
        customerGroup.add(createFieldLabel("Phone Number: *"));
        customerGroup.add(phoneField);
        customerGroup.add(createFieldLabel("Residential Address: *"));
        customerGroup.add(addressField);

        formContainer.add(customerGroup);
        formContainer.add(Box.createRigidArea(new Dimension(0, 15)));

        // Section 2: Account Details
        JPanel accountGroup = new JPanel(new GridLayout(3, 2, 12, 12));
        accountGroup.setOpaque(false);
        accountGroup.setBorder(new CompoundBorder(
            new TitledBorder(new LineBorder(new Color(203, 213, 225), 1, true), " Account Information ",
                TitledBorder.LEADING, TitledBorder.TOP, new Font("Segoe UI", Font.BOLD, 14), new Color(30, 58, 138)),
            new EmptyBorder(15, 15, 15, 15)
        ));

        accountNoField = createStyledTextField();
        accountTypeCombo = new JComboBox<>(new String[]{"Savings", "Current"});
        accountTypeCombo.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        accountTypeCombo.setBackground(Color.WHITE);

        balanceField = createStyledTextField();
        balanceField.setText("1000.00");

        accountGroup.add(createFieldLabel("Account Number: * (e.g. 1001)"));
        accountGroup.add(accountNoField);
        accountGroup.add(createFieldLabel("Account Type:"));
        accountGroup.add(accountTypeCombo);
        accountGroup.add(createFieldLabel("Initial Deposit Balance (₹): *"));
        accountGroup.add(balanceField);

        formContainer.add(accountGroup);
        formContainer.add(Box.createRigidArea(new Dimension(0, 20)));

        // Buttons Panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 0));
        buttonPanel.setOpaque(false);

        JButton clearBtn = new JButton("Reset Form");
        clearBtn.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        clearBtn.setBackground(new Color(226, 232, 240));
        clearBtn.setForeground(new Color(51, 65, 85));
        clearBtn.setFocusPainted(false);
        clearBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        clearBtn.addActionListener(e -> clearForm());

        JButton submitBtn = new JButton("Create Account");
        submitBtn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        submitBtn.setBackground(new Color(16, 185, 129));
        submitBtn.setForeground(Color.WHITE);
        submitBtn.setFocusPainted(false);
        submitBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        submitBtn.addActionListener(this::handleCreateAccount);

        buttonPanel.add(clearBtn);
        buttonPanel.add(submitBtn);

        formContainer.add(buttonPanel);

        JScrollPane scrollPane = new JScrollPane(formContainer);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);

        add(scrollPane, BorderLayout.CENTER);
    }

    private JLabel createFieldLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(new Font("Segoe UI", Font.BOLD, 13));
        label.setForeground(new Color(51, 65, 85));
        return label;
    }

    private JTextField createStyledTextField() {
        JTextField tf = new JTextField();
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        tf.setBorder(new CompoundBorder(
            new LineBorder(new Color(203, 213, 225), 1, true),
            new EmptyBorder(6, 10, 6, 10)
        ));
        return tf;
    }

    private void handleCreateAccount(ActionEvent e) {
        String name = nameField.getText().trim();
        String phone = phoneField.getText().trim();
        String address = addressField.getText().trim();
        String accNoStr = accountNoField.getText().trim();
        String accType = (String) accountTypeCombo.getSelectedItem();
        String balanceStr = balanceField.getText().trim();

        // Validation 1: Required fields check
        if (name.isEmpty() || phone.isEmpty() || address.isEmpty() || accNoStr.isEmpty() || balanceStr.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                "All fields marked with * are required. Please fill them out.",
                "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        // Validation 2: Account Number format
        int accountNo;
        try {
            accountNo = Integer.parseInt(accNoStr);
            if (accountNo <= 0) {
                JOptionPane.showMessageDialog(this,
                    "Account Number must be a positive integer.",
                    "Validation Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this,
                "Account Number must be a numeric value.",
                "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Validation 3: Balance format and amount
        double balance;
        try {
            balance = Double.parseDouble(balanceStr);
            if (balance < 0) {
                JOptionPane.showMessageDialog(this,
                    "Initial Balance cannot be negative.",
                    "Validation Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this,
                "Initial Balance must be a valid numeric amount.",
                "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        try {
            // Check if account already exists
            if (accountDAO.accountExists(accountNo)) {
                JOptionPane.showMessageDialog(this,
                    "Account number " + accountNo + " already exists in the system!\nPlease choose another number.",
                    "Account Exists", JOptionPane.ERROR_MESSAGE);
                return;
            }

            // Step 1: Insert Customer
            Customer customer = new Customer(name, phone, address);
            int customerId = customerDAO.insertCustomer(customer);

            // Step 2: Insert Account
            Account account = new Account(accountNo, customerId, accType, balance);
            boolean accCreated = accountDAO.insertAccount(account);

            if (accCreated) {
                JOptionPane.showMessageDialog(this,
                    "Account created successfully.\n\n" +
                    "Customer ID: " + customerId + "\n" +
                    "Account Number: " + accountNo + "\n" +
                    "Customer Name: " + name + "\n" +
                    "Account Type: " + accType + "\n" +
                    "Opening Balance: ₹" + String.format("%.2f", balance),
                    "Success", JOptionPane.INFORMATION_MESSAGE);
                clearForm();
            } else {
                JOptionPane.showMessageDialog(this,
                    "Failed to create account record in database.",
                    "Database Error", JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this,
                "Database error: " + ex.getMessage(),
                "Error", JOptionPane.ERROR_MESSAGE);
            ex.printStackTrace();
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
}
