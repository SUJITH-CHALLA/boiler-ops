
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("sqlite.db");

console.log("Running manual migration...");

// 1. Create Users Table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operator',
    created_at TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
  );
`);

// 2. Create Attendance Table
db.exec(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    date TEXT NOT NULL,
    shift TEXT NOT NULL,
    boiler_id TEXT NOT NULL,
    check_in_time INTEGER DEFAULT (CURRENT_TIMESTAMP) NOT NULL
  );
`);

// 3. Create Shift Logs Table
db.exec(`
  CREATE TABLE IF NOT EXISTS shift_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    shift TEXT NOT NULL,
    boiler_id TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    steam_pressure TEXT NOT NULL,
    steam_temp TEXT,
    fuel_type TEXT NOT NULL,
    fuel_consumed TEXT NOT NULL,
    blowdown_performed INTEGER NOT NULL DEFAULT 0,
    operator_name TEXT NOT NULL,
    remarks TEXT,
    created_by_id INTEGER NOT NULL REFERENCES users(id),
    created_at INTEGER DEFAULT (CURRENT_TIMESTAMP) NOT NULL
  );
`);

// 4. Create Breakdowns Table
db.exec(`
  CREATE TABLE IF NOT EXISTS breakdowns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    boiler_id TEXT NOT NULL,
    issue_description TEXT NOT NULL,
    downtime_minutes INTEGER NOT NULL,
    action_taken TEXT NOT NULL,
    created_by_id INTEGER NOT NULL REFERENCES users(id),
    created_at INTEGER DEFAULT (CURRENT_TIMESTAMP) NOT NULL
  );
`);

console.log("Tables created/verified.");

// 5. Seed Users
const start = async () => {
    const password = await bcrypt.hash("password123", 10);

    // Check if admin exists
    const admin = db.prepare("SELECT * FROM users WHERE email = ?").get("supervisor@boilerops.internal");

    if (!admin) {
        console.log("Creating Admin...");
        db.prepare(`
            INSERT INTO users (name, email, password, role) 
            VALUES (?, ?, ?, ?)
        `).run("Admin Supervisor", "supervisor@boilerops.internal", password, "supervisor");
    }

    // Check if operator exists
    const operator = db.prepare("SELECT * FROM users WHERE email = ?").get("operator@boilerops.internal");

    if (!operator) {
        console.log("Creating Operator...");
        db.prepare(`
            INSERT INTO users (name, email, password, role) 
            VALUES (?, ?, ?, ?)
        `).run("Operator John", "operator@boilerops.internal", password, "operator");
    }

    console.log("Database Setup Complete!");
};

start();
