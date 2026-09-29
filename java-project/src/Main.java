import ui.MainFrame;

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
}
