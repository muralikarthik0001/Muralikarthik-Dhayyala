package ui;

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
import javax.swing.table.DefaultTableCellRenderer;
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

    // View Account UI components
    private JTextField viewAccNoField;
    private JLabel viewCustIdLabel;
    private JLabel viewNameLabel;
    private JLabel viewPhoneLabel;
    private JLabel viewAddressLabel;
    private JLabel viewAccNoLabel;
    private JLabel viewAccTypeLabel;
    private JLabel viewBalanceLabel;
    private JPanel viewResultCard;

    // Deposit UI
    private JTextField depAccNoField;
    private JTextField depAmountField;

    // Withdraw UI
    private JTextField withAccNoField;
    private JTextField withAmountField;

    // Check Balance UI
    private JTextField balAccNoField;
    private JLabel balResultAccNo;
    private JLabel balResultAmount;
    private JPanel balResultCard;

    // Transactions UI
    private JTextField txAccNoField;
    private JTable txTable;
    private DefaultTableModel txTableModel;
    private JLabel txSummaryLabel;

    // Delete Account UI
    private JTextField delAccNoField;

    public AccountPanel() {
        cardLayout = new CardLayout();
        containerPanel = new JPanel(cardLayout);
        setLayout(new BorderLayout());
        setOpaque(false);

        // Add subpanels to CardLayout
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

    // ==========================================
    // 1. VIEW ACCOUNT
    // ==========================================
    private JPanel buildViewAccountPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        // Header
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("View Account Details");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(24, 43, 73));
        JLabel subtitle = new JLabel("Enter an account number to fetch complete customer and balance records");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(100, 116, 139));
        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);
        panel.add(header, BorderLayout.NORTH);

        // Content
        JPanel body = new JPanel();
        body.setLayout(new BoxLayout(body, BoxLayout.Y_AXIS));
        body.setOpaque(false);

        // Input bar
        JPanel inputBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        inputBar.setOpaque(false);
        inputBar.add(new JLabel("Enter Account Number:"));
        viewAccNoField = createTextField(12);
        JButton searchBtn = createPrimaryButton("Fetch Account Details");
        searchBtn.addActionListener(e -> handleFetchAccount());
        inputBar.add(viewAccNoField);
        inputBar.add(searchBtn);
        body.add(inputBar);

        // Result Card
        viewResultCard = new JPanel(new GridLayout(7, 2, 12, 12));
        viewResultCard.setBorder(new CompoundBorder(
            new LineBorder(new Color(203, 213, 225), 1, true),
            new EmptyBorder(20, 25, 20, 25)
        ));
        viewResultCard.setBackground(Color.WHITE);
        viewResultCard.setVisible(false);

        viewCustIdLabel = new JLabel("-");
        viewNameLabel = new JLabel("-");
        viewPhoneLabel = new JLabel("-");
        viewAddressLabel = new JLabel("-");
        viewAccNoLabel = new JLabel("-");
        viewAccTypeLabel = new JLabel("-");
        viewBalanceLabel = new JLabel("-");
        viewBalanceLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        viewBalanceLabel.setForeground(new Color(16, 185, 129));

        addDetailRow(viewResultCard, "Customer ID:", viewCustIdLabel);
        addDetailRow(viewResultCard, "Customer Name:", viewNameLabel);
        addDetailRow(viewResultCard, "Phone Number:", viewPhoneLabel);
        addDetailRow(viewResultCard, "Residential Address:", viewAddressLabel);
        addDetailRow(viewResultCard, "Account Number:", viewAccNoLabel);
        addDetailRow(viewResultCard, "Account Type:", viewAccTypeLabel);
        addDetailRow(viewResultCard, "Current Balance:", viewBalanceLabel);

        body.add(Box.createRigidArea(new Dimension(0, 15)));
        body.add(viewResultCard);
        panel.add(body, BorderLayout.CENTER);

        return panel;
    }

    private void handleFetchAccount() {
        String accStr = viewAccNoField.getText().trim();
        if (accStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter an account number.", "Input Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            int accNo = Integer.parseInt(accStr);
            Account account = accountDAO.getAccountByNo(accNo);
            if (account == null) {
                viewResultCard.setVisible(false);
                JOptionPane.showMessageDialog(this, "No account found with number: " + accNo, "Account Not Found", JOptionPane.ERROR_MESSAGE);
                return;
            }

            Customer customer = customerDAO.getCustomerById(account.getCustomerId());
            viewCustIdLabel.setText(String.valueOf(account.getCustomerId()));
            viewNameLabel.setText(customer != null ? customer.getName() : "N/A");
            viewPhoneLabel.setText(customer != null ? customer.getPhone() : "N/A");
            viewAddressLabel.setText(customer != null ? customer.getAddress() : "N/A");
            viewAccNoLabel.setText(String.valueOf(account.getAccountNo()));
            viewAccTypeLabel.setText(account.getAccountType());
            viewBalanceLabel.setText("₹" + String.format("%.2f", account.getBalance()));

            viewResultCard.setVisible(true);
            viewResultCard.revalidate();
            viewResultCard.repaint();

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Account number must be numeric.", "Format Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ==========================================
    // 2. DEPOSIT
    // ==========================================
    private JPanel buildDepositPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("Deposit Money");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(24, 43, 73));
        JLabel subtitle = new JLabel("Credit funds to an active account. Automatically logs to TRANSACTION table.");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(100, 116, 139));
        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);
        panel.add(header, BorderLayout.NORTH);

        JPanel formCard = new JPanel(new GridLayout(2, 2, 15, 15));
        formCard.setBorder(new CompoundBorder(
            new LineBorder(new Color(203, 213, 225), 1, true),
            new EmptyBorder(25, 25, 25, 25)
        ));
        formCard.setBackground(Color.WHITE);

        depAccNoField = createTextField(15);
        depAmountField = createTextField(15);

        formCard.add(new JLabel("Target Account Number: *"));
        formCard.add(depAccNoField);
        formCard.add(new JLabel("Deposit Amount (₹): *"));
        formCard.add(depAmountField);

        JButton depositBtn = createPrimaryButton("Confirm Deposit");
        depositBtn.setBackground(new Color(16, 185, 129));
        depositBtn.addActionListener(e -> handleDeposit());

        JPanel container = new JPanel();
        container.setLayout(new BoxLayout(container, BoxLayout.Y_AXIS));
        container.setOpaque(false);
        container.add(formCard);
        container.add(Box.createRigidArea(new Dimension(0, 15)));

        JPanel btnRow = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        btnRow.setOpaque(false);
        btnRow.add(depositBtn);
        container.add(btnRow);

        panel.add(container, BorderLayout.CENTER);
        return panel;
    }

    private void handleDeposit() {
        String accStr = depAccNoField.getText().trim();
        String amtStr = depAmountField.getText().trim();

        if (accStr.isEmpty() || amtStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Both Account Number and Amount are required.", "Input Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            int accNo = Integer.parseInt(accStr);
            double amount = Double.parseDouble(amtStr);

            if (amount <= 0) {
                JOptionPane.showMessageDialog(this, "Deposit amount must be greater than zero.", "Validation Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            double newBalance = accountDAO.deposit(accNo, amount);
            JOptionPane.showMessageDialog(this,
                "Deposit Successful!\n\n" +
                "Account Number: " + accNo + "\n" +
                "Amount Deposited: ₹" + String.format("%.2f", amount) + "\n" +
                "Updated Balance: ₹" + String.format("%.2f", newBalance) + "\n" +
                "Transaction recorded in database.",
                "Deposit Success", JOptionPane.INFORMATION_MESSAGE);

            depAccNoField.setText("");
            depAmountField.setText("");

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter valid numeric values for account and amount.", "Format Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Deposit Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ==========================================
    // 3. WITHDRAW
    // ==========================================
    private JPanel buildWithdrawPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("Withdraw Money");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(24, 43, 73));
        JLabel subtitle = new JLabel("Debit funds from an active account with balance validation and transaction logging.");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(100, 116, 139));
        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);
        panel.add(header, BorderLayout.NORTH);

        JPanel formCard = new JPanel(new GridLayout(2, 2, 15, 15));
        formCard.setBorder(new CompoundBorder(
            new LineBorder(new Color(203, 213, 225), 1, true),
            new EmptyBorder(25, 25, 25, 25)
        ));
        formCard.setBackground(Color.WHITE);

        withAccNoField = createTextField(15);
        withAmountField = createTextField(15);

        formCard.add(new JLabel("Source Account Number: *"));
        formCard.add(withAccNoField);
        formCard.add(new JLabel("Withdrawal Amount (₹): *"));
        formCard.add(withAmountField);

        JButton withdrawBtn = createPrimaryButton("Confirm Withdrawal");
        withdrawBtn.setBackground(new Color(239, 68, 68)); // Warning Red
        withdrawBtn.addActionListener(e -> handleWithdraw());

        JPanel container = new JPanel();
        container.setLayout(new BoxLayout(container, BoxLayout.Y_AXIS));
        container.setOpaque(false);
        container.add(formCard);
        container.add(Box.createRigidArea(new Dimension(0, 15)));

        JPanel btnRow = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        btnRow.setOpaque(false);
        btnRow.add(withdrawBtn);
        container.add(btnRow);

        panel.add(container, BorderLayout.CENTER);
        return panel;
    }

    private void handleWithdraw() {
        String accStr = withAccNoField.getText().trim();
        String amtStr = withAmountField.getText().trim();

        if (accStr.isEmpty() || amtStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Both Account Number and Amount are required.", "Input Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            int accNo = Integer.parseInt(accStr);
            double amount = Double.parseDouble(amtStr);

            if (amount <= 0) {
                JOptionPane.showMessageDialog(this, "Withdrawal amount must be greater than zero.", "Validation Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            double newBalance = accountDAO.withdraw(accNo, amount);
            JOptionPane.showMessageDialog(this,
                "Withdrawal Successful!\n\n" +
                "Account Number: " + accNo + "\n" +
                "Amount Debited: ₹" + String.format("%.2f", amount) + "\n" +
                "Updated Balance: ₹" + String.format("%.2f", newBalance) + "\n" +
                "Transaction recorded in database.",
                "Withdrawal Success", JOptionPane.INFORMATION_MESSAGE);

            withAccNoField.setText("");
            withAmountField.setText("");

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter valid numeric values for account and amount.", "Format Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Withdrawal Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ==========================================
    // 4. CHECK BALANCE
    // ==========================================
    private JPanel buildCheckBalancePanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("Check Account Balance");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(24, 43, 73));
        JLabel subtitle = new JLabel("Fast real-time SQL SELECT query on current account balance");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(100, 116, 139));
        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);
        panel.add(header, BorderLayout.NORTH);

        JPanel body = new JPanel();
        body.setLayout(new BoxLayout(body, BoxLayout.Y_AXIS));
        body.setOpaque(false);

        JPanel inputBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        inputBar.setOpaque(false);
        inputBar.add(new JLabel("Account Number:"));
        balAccNoField = createTextField(12);
        JButton checkBtn = createPrimaryButton("Query Balance");
        checkBtn.addActionListener(e -> handleCheckBalance());
        inputBar.add(balAccNoField);
        inputBar.add(checkBtn);
        body.add(inputBar);

        balResultCard = new JPanel(new GridLayout(2, 2, 15, 15));
        balResultCard.setBorder(new CompoundBorder(
            new LineBorder(new Color(203, 213, 225), 1, true),
            new EmptyBorder(20, 25, 20, 25)
        ));
        balResultCard.setBackground(Color.WHITE);
        balResultCard.setVisible(false);

        balResultAccNo = new JLabel("-");
        balResultAmount = new JLabel("-");
        balResultAmount.setFont(new Font("Segoe UI", Font.BOLD, 20));
        balResultAmount.setForeground(new Color(16, 185, 129));

        addDetailRow(balResultCard, "Account Number:", balResultAccNo);
        addDetailRow(balResultCard, "Available Balance:", balResultAmount);

        body.add(Box.createRigidArea(new Dimension(0, 15)));
        body.add(balResultCard);
        panel.add(body, BorderLayout.CENTER);

        return panel;
    }

    private void handleCheckBalance() {
        String accStr = balAccNoField.getText().trim();
        if (accStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter an account number.", "Input Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            int accNo = Integer.parseInt(accStr);
            double bal = accountDAO.getBalance(accNo);

            if (bal < 0) {
                balResultCard.setVisible(false);
                JOptionPane.showMessageDialog(this, "Account number " + accNo + " does not exist.", "Account Not Found", JOptionPane.ERROR_MESSAGE);
                return;
            }

            balResultAccNo.setText(String.valueOf(accNo));
            balResultAmount.setText("₹" + String.format("%.2f", bal));
            balResultCard.setVisible(true);
            balResultCard.revalidate();
            balResultCard.repaint();

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Account number must be numeric.", "Format Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ==========================================
    // 5. VIEW TRANSACTIONS (JTable)
    // ==========================================
    private JPanel buildTransactionsPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("Account Transaction History");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(24, 43, 73));
        JLabel subtitle = new JLabel("Displays chronological deposits and withdrawals in a JTable retrieved from TRANSACTION");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(100, 116, 139));
        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);
        panel.add(header, BorderLayout.NORTH);

        JPanel content = new JPanel(new BorderLayout(10, 10));
        content.setOpaque(false);

        JPanel queryBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        queryBar.setOpaque(false);
        queryBar.add(new JLabel("Account Number:"));
        txAccNoField = createTextField(12);
        JButton loadBtn = createPrimaryButton("Load Transactions");
        loadBtn.addActionListener(e -> handleLoadTransactions());
        queryBar.add(txAccNoField);
        queryBar.add(loadBtn);

        txSummaryLabel = new JLabel("Enter account number to view transactions");
        txSummaryLabel.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        txSummaryLabel.setForeground(new Color(100, 116, 139));
        queryBar.add(txSummaryLabel);

        content.add(queryBar, BorderLayout.NORTH);

        // JTable setup
        String[] columns = {"Transaction ID", "Type", "Amount (₹)", "Transaction Date"};
        txTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // read-only table
            }
        };

        txTable = new JTable(txTableModel);
        txTable.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        txTable.setRowHeight(28);
        txTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
        txTable.getTableHeader().setBackground(new Color(226, 232, 240));
        txTable.setSelectionBackground(new Color(219, 234, 254));
        txTable.setGridColor(new Color(226, 232, 240));

        // Center align text
        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(JLabel.CENTER);
        for (int i = 0; i < txTable.getColumnCount(); i++) {
            txTable.getColumnModel().getColumn(i).setCellRenderer(centerRenderer);
        }

        JScrollPane tableScroll = new JScrollPane(txTable);
        tableScroll.setBorder(new LineBorder(new Color(203, 213, 225), 1, true));
        content.add(tableScroll, BorderLayout.CENTER);

        panel.add(content, BorderLayout.CENTER);
        return panel;
    }

    private void handleLoadTransactions() {
        String accStr = txAccNoField.getText().trim();
        if (accStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter an account number.", "Input Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            int accNo = Integer.parseInt(accStr);

            if (!accountDAO.accountExists(accNo)) {
                txTableModel.setRowCount(0);
                txSummaryLabel.setText("Account not found");
                JOptionPane.showMessageDialog(this, "Account number " + accNo + " does not exist.", "Account Not Found", JOptionPane.ERROR_MESSAGE);
                return;
            }

            List<Transaction> transactions = transactionDAO.getTransactionsByAccountNo(accNo);
            txTableModel.setRowCount(0);

            for (Transaction t : transactions) {
                txTableModel.addRow(new Object[]{
                    t.getTransactionId(),
                    t.getType(),
                    "₹" + String.format("%.2f", t.getAmount()),
                    t.getTransactionDate() != null ? t.getTransactionDate().toString() : "Recent"
                });
            }

            txSummaryLabel.setText("Found " + transactions.size() + " transaction(s) for Account " + accNo);

            if (transactions.isEmpty()) {
                JOptionPane.showMessageDialog(this, "No transactions recorded yet for Account " + accNo, "Information", JOptionPane.INFORMATION_MESSAGE);
            }

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Account number must be numeric.", "Format Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ==========================================
    // 6. DELETE ACCOUNT
    // ==========================================
    private JPanel buildDeleteAccountPanel() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 30, 25, 30));
        panel.setBackground(new Color(245, 247, 250));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("Delete Account");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(220, 38, 38));
        JLabel subtitle = new JLabel("Permanently closes an account and cascades deletion to associated transactions");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(100, 116, 139));
        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);
        panel.add(header, BorderLayout.NORTH);

        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setOpaque(false);

        JPanel warningBox = new JPanel(new BorderLayout());
        warningBox.setBackground(new Color(254, 242, 242));
        warningBox.setBorder(new CompoundBorder(
            new LineBorder(new Color(252, 165, 165), 1, true),
            new EmptyBorder(12, 15, 12, 15)
        ));
        JLabel warnText = new JLabel("<html><b>Warning:</b> Deleting an account will first remove all related transaction rows from the TRANSACTION table to maintain foreign key integrity, then remove the account from ACCOUNT. If the customer holds no other accounts, their profile is also deleted.</html>");
        warnText.setForeground(new Color(153, 27, 27));
        warningBox.add(warnText, BorderLayout.CENTER);
        content.add(warningBox);
        content.add(Box.createRigidArea(new Dimension(0, 20)));

        JPanel formCard = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 15));
        formCard.setBorder(new CompoundBorder(
            new LineBorder(new Color(203, 213, 225), 1, true),
            new EmptyBorder(15, 20, 15, 20)
        ));
        formCard.setBackground(Color.WHITE);

        formCard.add(new JLabel("Account Number to Delete:"));
        delAccNoField = createTextField(12);
        formCard.add(delAccNoField);

        JButton deleteBtn = new JButton("Permanently Delete Account");
        deleteBtn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        deleteBtn.setBackground(new Color(220, 38, 38));
        deleteBtn.setForeground(Color.WHITE);
        deleteBtn.setFocusPainted(false);
        deleteBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        deleteBtn.addActionListener(e -> handleDeleteAccount());
        formCard.add(deleteBtn);

        content.add(formCard);
        panel.add(content, BorderLayout.CENTER);

        return panel;
    }

    private void handleDeleteAccount() {
        String accStr = delAccNoField.getText().trim();
        if (accStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter an account number to delete.", "Input Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            int accNo = Integer.parseInt(accStr);

            if (!accountDAO.accountExists(accNo)) {
                JOptionPane.showMessageDialog(this, "Account number " + accNo + " does not exist.", "Account Not Found", JOptionPane.ERROR_MESSAGE);
                return;
            }

            int confirm = JOptionPane.showConfirmDialog(
                this,
                "Are you sure you want to permanently delete Account " + accNo + "?\nAll transaction logs for this account will also be purged.",
                "Confirm Account Deletion",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.WARNING_MESSAGE
            );

            if (confirm == JOptionPane.YES_OPTION) {
                boolean success = accountDAO.deleteAccount(accNo);
                if (success) {
                    JOptionPane.showMessageDialog(this,
                        "Account " + accNo + " and its related transactions have been deleted successfully.",
                        "Account Deleted", JOptionPane.INFORMATION_MESSAGE);
                    delAccNoField.setText("");
                } else {
                    JOptionPane.showMessageDialog(this, "Failed to delete account.", "Error", JOptionPane.ERROR_MESSAGE);
                }
            }

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Account number must be numeric.", "Format Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    // Helper utilities for UI creation
    private JTextField createTextField(int columns) {
        JTextField tf = new JTextField(columns);
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        tf.setBorder(new CompoundBorder(
            new LineBorder(new Color(203, 213, 225), 1, true),
            new EmptyBorder(6, 10, 6, 10)
        ));
        return tf;
    }

    private JButton createPrimaryButton(String text) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setBackground(new Color(30, 58, 138));
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private void addDetailRow(JPanel parent, String labelText, JLabel valueLabel) {
        JLabel lbl = new JLabel(labelText);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lbl.setForeground(new Color(71, 85, 105));
        valueLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        parent.add(lbl);
        parent.add(valueLabel);
    }
}
