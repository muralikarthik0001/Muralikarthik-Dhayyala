package ui;

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

        // Confirmation on window close
        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                handleExit();
            }
        });

        // Main Layout container
        JPanel rootPanel = new JPanel(new BorderLayout());
        setContentPane(rootPanel);

        // 1. Top Header Banner
        JPanel headerPanel = createHeaderPanel();
        rootPanel.add(headerPanel, BorderLayout.NORTH);

        // 2. Left Navigation Menu (8 Required Buttons)
        JPanel sidebarPanel = createSidebarPanel();
        rootPanel.add(sidebarPanel, BorderLayout.WEST);

        // 3. Central Content Cards
        cardLayout = new CardLayout();
        contentArea = new JPanel(cardLayout);
        contentArea.setBackground(new Color(248, 250, 252));

        createAccountPanel = new CreateAccountPanel();
        accountPanel = new AccountPanel();

        contentArea.add(createAccountPanel, "CREATE_ACCOUNT");
        contentArea.add(accountPanel, "ACCOUNT_OPS");

        rootPanel.add(contentArea, BorderLayout.CENTER);

        // 4. Bottom Status Bar
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

        // Test DB connection in background
        checkDatabaseStatus();
    }

    private JPanel createHeaderPanel() {
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(new Color(15, 23, 42)); // Deep Navy Slate
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
        logoBadge.setForeground(new Color(56, 189, 248)); // Cyan
        header.add(logoBadge, BorderLayout.EAST);

        return header;
    }

    private JPanel createSidebarPanel() {
        JPanel sidebar = new JPanel();
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setPreferredSize(new Dimension(220, 0));
        sidebar.setBackground(new Color(30, 41, 59)); // Slate 800
        sidebar.setBorder(new CompoundBorder(
            new MatteBorder(0, 0, 0, 1, new Color(51, 65, 85)),
            new EmptyBorder(15, 12, 15, 12)
        ));

        JLabel menuTitle = new JLabel("MAIN MENU");
        menuTitle.setFont(new Font("Segoe UI", Font.BOLD, 11));
        menuTitle.setForeground(new Color(148, 163, 184));
        menuTitle.setBorder(new EmptyBorder(0, 8, 10, 0));
        sidebar.add(menuTitle);

        // 8 Required Buttons
        JButton btnCreate = createNavButton("➕ Create Account", () -> {
            cardLayout.show(contentArea, "CREATE_ACCOUNT");
        });
        sidebar.add(btnCreate);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        JButton btnView = createNavButton("👤 View Account", () -> {
            accountPanel.showView("VIEW_ACCOUNT");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        sidebar.add(btnView);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        JButton btnDeposit = createNavButton("💰 Deposit Money", () -> {
            accountPanel.showView("DEPOSIT");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        sidebar.add(btnDeposit);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        JButton btnWithdraw = createNavButton("💸 Withdraw Money", () -> {
            accountPanel.showView("WITHDRAW");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        sidebar.add(btnWithdraw);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        JButton btnBalance = createNavButton("⚖️ Check Balance", () -> {
            accountPanel.showView("CHECK_BALANCE");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        sidebar.add(btnBalance);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        JButton btnTransactions = createNavButton("📜 View Transactions", () -> {
            accountPanel.showView("TRANSACTIONS");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        sidebar.add(btnTransactions);
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        JButton btnDelete = createNavButton("🗑️ Delete Account", () -> {
            accountPanel.showView("DELETE_ACCOUNT");
            cardLayout.show(contentArea, "ACCOUNT_OPS");
        });
        sidebar.add(btnDelete);

        sidebar.add(Box.createVerticalGlue()); // Push Exit to bottom

        JButton btnExit = createNavButton("🚪 Exit System", this::handleExit);
        btnExit.setBackground(new Color(185, 28, 28)); // Dark red
        sidebar.add(btnExit);

        // Select Create Account by default
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
                btn.setBackground(new Color(37, 99, 235)); // Highlight blue
                activeButton = btn;
            }
            action.run();
        });

        return btn;
    }

    private void checkDatabaseStatus() {
        SwingWorker<Boolean, Void> worker = new SwingWorker<>() {
            String message = "";

            @Override
            protected Boolean doInBackground() {
                try {
                    Connection conn = DatabaseConnection.getConnection();
                    return conn != null && !conn.isClosed();
                } catch (Exception e) {
                    message = e.getMessage();
                    return false;
                }
            }

            @Override
            protected void done() {
                try {
                    if (get()) {
                        statusLabel.setText("● Connected to MySQL: bank_management (localhost:3306)");
                        statusLabel.setForeground(new Color(22, 101, 52)); // Green
                    } else {
                        statusLabel.setText("○ MySQL Not Connected - Check DatabaseConnection.java credentials");
                        statusLabel.setForeground(new Color(185, 28, 28)); // Red
                    }
                } catch (Exception e) {
                    statusLabel.setText("○ MySQL Connection Error: " + message);
                    statusLabel.setForeground(new Color(185, 28, 28));
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
}
