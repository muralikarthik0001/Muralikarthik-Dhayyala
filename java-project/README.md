# BANK ACCOUNT MANAGEMENT SYSTEM
### 2nd-Year B.Tech CSE Academic Java Mini Project
**Technologies:** Core Java • Java Swing GUI • JDBC • MySQL Database

---

## 1. Project Overview
The **Bank Account Management System** is a desktop application developed to demonstrate fundamental Object-Oriented Programming (OOP), Graphical User Interface (GUI) development with Java Swing, and database persistence using JDBC with MySQL.

### Core Features Implemented:
1. **Create Account:** Registers a new customer and assigns an account number with opening balance.
2. **View Account:** Fetches full customer profile and account information using relational queries.
3. **Deposit Money:** Credits money, updates the balance, and logs a `DEPOSIT` record in `TRANSACTION`.
4. **Withdraw Money:** Validates available balance, debits money, updates balance, and logs a `WITHDRAW` record.
5. **Check Balance:** Direct `SELECT` query returning current available funds.
6. **View Transactions:** Displays chronological deposits and withdrawals in a formatted `JTable`.
7. **Delete Account:** Safely deletes account and its transactions while preserving foreign key constraints.
8. **Exit:** Cleanly closes JDBC connections and exits the application.

---

## 2. Project Directory Structure
```
bank-account-management/
├── pom.xml                               # Maven build configuration
├── database.sql                          # MySQL schema & sample seed data
├── README.md                             # Documentation & Setup guide
├── run.bat                               # Windows 1-click run script
├── run.sh                                # Mac/Linux 1-click run script
└── src/
    ├── Main.java                         # Application entry point (EDT launch)
    ├── model/
    │   ├── Customer.java                 # Customer POJO (Encapsulation)
    │   ├── Account.java                  # Account POJO (Encapsulation)
    │   └── Transaction.java              # Transaction POJO (Encapsulation)
    ├── dao/
    │   ├── CustomerDAO.java              # CRUD operations for CUSTOMER table
    │   ├── AccountDAO.java               # CRUD operations for ACCOUNT table
    │   └── TransactionDAO.java           # CRUD operations for TRANSACTION table
    ├── util/
    │   └── DatabaseConnection.java       # JDBC Connection Manager (DriverManager)
    └── ui/
        ├── MainFrame.java                # Main Swing JFrame with 8 navigation buttons
        ├── CreateAccountPanel.java       # Form for registering customer & account
        └── AccountPanel.java             # Views for Deposit, Withdraw, Balance, JTable, Delete
```

---

## 3. Database Schema (MySQL)

Database name: `bank_management`

### Tables:
1. **`CUSTOMER`**
   - `customer_id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR 50)
   - `phone` (VARCHAR 15)
   - `address` (VARCHAR 100)

2. **`ACCOUNT`**
   - `account_no` (INT, Primary Key)
   - `customer_id` (INT, Foreign Key referencing `CUSTOMER(customer_id)`)
   - `account_type` (VARCHAR 20)
   - `balance` (DECIMAL 10,2)

3. **`TRANSACTION`**
   - `transaction_id` (INT, Primary Key, Auto Increment)
   - `account_no` (INT, Foreign Key referencing `ACCOUNT(account_no)`)
   - `type` (VARCHAR 20 - 'DEPOSIT' or 'WITHDRAW')
   - `amount` (DECIMAL 10,2)
   - `transaction_date` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

---

## 4. Database Setup Instructions (MySQL)

### Option A: Using MySQL Command Line Client
1. Open the MySQL Command Line Client or Terminal:
   ```bash
   mysql -u root -p
   ```
2. Enter your MySQL root password.
3. Run the provided SQL script:
   ```sql
   source /path/to/database.sql;
   ```
   Or execute directly:
   ```bash
   mysql -u root -p < database.sql
   ```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench and connect to your Local Instance (Port 3306).
2. Click **File -> Open SQL Script...** and select `database.sql`.
3. Click the **Execute (Lightning Bolt)** icon to run the script.
4. Refresh the **Schemas** panel on the left to verify `bank_management` with all 3 tables (`CUSTOMER`, `ACCOUNT`, `TRANSACTION`).

---

## 5. MySQL Connection Configuration

Open `src/util/DatabaseConnection.java` and adjust lines 18-20 if your MySQL username or password differs:
```java
// Location: src/util/DatabaseConnection.java
private static final String URL = "jdbc:mysql://localhost:3306/bank_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
private static final String USERNAME = "root";  // Your MySQL user
private static final String PASSWORD = "root";  // Change to your MySQL password
```

---

## 6. How to Run in IntelliJ IDEA

1. Open **IntelliJ IDEA**.
2. Click **File -> Open...** and select the `bank-account-management` folder (or where `pom.xml` is located).
3. If prompted, select **Open as Project** (Maven project).
4. IntelliJ will automatically download `mysql-connector-j-8.3.0.jar` specified in `pom.xml`.
5. Navigate to `src/Main.java`.
6. Right-click inside `Main.java` and choose **Run 'Main.main()'**.
7. The Swing GUI window will open.

*(If not using Maven: Go to `File -> Project Structure -> Libraries -> + -> Java -> Select mysql-connector-j-8.x.jar`).*

---

## 7. How to Run in Eclipse IDE

1. Open **Eclipse IDE**.
2. Go to **File -> Import... -> Existing Projects into Workspace** (or **Existing Maven Projects**).
3. Browse and select the project folder.
4. If it's a standard Java Project, add the MySQL JDBC Driver:
   - Right-click project -> **Build Path -> Configure Build Path...**
   - Go to **Libraries** tab -> **Add External JARs...**
   - Select your downloaded `mysql-connector-j-8.x.jar`.
   - Click **Apply and Close**.
5. Expand `src` -> Right-click `Main.java` -> **Run As -> Java Application**.

---

## 8. College Presentation Demo Flow

Follow this sequence to demonstrate all required functionality to your professor:

1. **Step 1: Create Account**
   - Click `[ Create Account ]`.
   - Fill: Name (`Rohan Mehta`), Phone (`9876501234`), Address (`12 Lake View, Bangalore`), Account Number (`1004`), Type (`Savings`), Initial Balance (`5000.00`).
   - Click `[ Create Account ]`.
   - Verify success dialog: "Account created successfully."

2. **Step 2: View Account**
   - Click `[ View Account ]`.
   - Enter `1004` and click `Fetch Account Details`.
   - Verify that Rohan's name, phone, address, and balance (`₹5000.00`) are retrieved from the database.

3. **Step 3: Deposit Money**
   - Click `[ Deposit ]`.
   - Enter Account Number `1004`, Amount `2500.00`.
   - Click `Confirm Deposit`.
   - Dialog confirms updated balance: `₹7500.00`.

4. **Step 4: Check Balance**
   - Click `[ Check Balance ]`.
   - Enter Account Number `1004`.
   - Click `Query Balance` -> Instant verification shows `₹7500.00`.

5. **Step 5: Withdraw Money**
   - Click `[ Withdraw ]`.
   - Enter Account Number `1004`, Amount `1500.00`.
   - Click `Confirm Withdrawal`.
   - Dialog confirms updated balance: `₹6000.00`.
   - *(Optional test: Try withdrawing ₹10000.00 to show "Insufficient balance!" validation).*

6. **Step 6: View Transactions**
   - Click `[ View Transactions ]`.
   - Enter `1004` and click `Load Transactions`.
   - The `JTable` lists both transactions (`DEPOSIT ₹2500.00` and `WITHDRAW ₹1500.00`) with precise timestamps.

7. **Step 7: Verification in MySQL**
   - Open MySQL Terminal or Workbench and run:
     ```sql
     SELECT * FROM ACCOUNT WHERE account_no = 1004;
     SELECT * FROM TRANSACTION WHERE account_no = 1004;
     ```
   - Show the professor that every GUI action in Java corresponds directly to rows in MySQL.

8. **Step 8: Delete Account**
   - Click `[ Delete Account ]`.
   - Enter `1004`, confirm deletion prompt.
   - Run query in MySQL to demonstrate cascade deletion of transactions and account.

---

## 9. Key Viva Questions & Answers

**Q1: Why do we use PreparedStatement instead of Statement?**
> **Answer:** `PreparedStatement` precompiles SQL statements on the database server, making execution faster when called repeatedly. More importantly, it uses parameter placeholders (`?`) to prevent SQL Injection attacks and automatically handles escaping of quotes and data types.

**Q2: What is the purpose of DAO (Data Access Object) pattern?**
> **Answer:** It separates low-level data accessing operations (SQL queries, JDBC connections) from high-level business logic and UI. This ensures clean code, reusability, and encapsulation.

**Q3: How does transaction consistency work when depositing or withdrawing?**
> **Answer:** In `AccountDAO`, when a deposit or withdrawal occurs, the account balance is updated with `executeUpdate()`, and a corresponding audit record is inserted into the `TRANSACTION` table to preserve a complete financial history.

**Q4: How does Foreign Key cascading work here?**
> **Answer:** `ACCOUNT` has `FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id) ON DELETE CASCADE`, and `TRANSACTION` has `FOREIGN KEY (account_no) REFERENCES ACCOUNT(account_no) ON DELETE CASCADE`. When an account is deleted, all related transaction rows are cleaned up automatically or sequentially in Java to avoid orphaned records.

**Q5: What is the Event Dispatch Thread (EDT) in Java Swing?**
> **Answer:** Swing GUI components are not thread-safe. All UI creation and event handling should run on a single dedicated thread called the Event Dispatch Thread (EDT). We achieve this by launching via `SwingUtilities.invokeLater(...)`.
