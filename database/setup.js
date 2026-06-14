import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(new URL('secure_mesh.db', import.meta.url).pathname);

db.serialize(() => {
    // 👤 1. Core Profiles Table
    db.run(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        is_onboarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 📊 2. Parameter Matrix Table
    db.run(`CREATE TABLE IF NOT EXISTS matrix_state (
        id TEXT PRIMARY KEY,
        profile_id INTEGER,
        category TEXT,
        name TEXT,
        value TEXT,
        status TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    )`);

    // 🤖 3. Custom User Agents Table
    db.run(`CREATE TABLE IF NOT EXISTS custom_agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        purpose TEXT NOT NULL,
        api_token TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'Idle',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    )`);

    // 🧠 4. NEW: Core Strategy & Knowledge Base Engine
    // Stores parameters like monthly budget limits, target posting frequency, market watchlists
    db.run(`CREATE TABLE IF NOT EXISTS agent_knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        knowledge_key TEXT NOT NULL, 
        knowledge_value TEXT NOT NULL,
        last_sync DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        UNIQUE(profile_id, knowledge_key)
    )`);

    // 📋 5. NEW: Unified Task Queue and Automation Scheduler
    // For dispatching posting schedules, trend processing, and budgeting triggers
    db.run(`CREATE TABLE IF NOT EXISTS agent_tasks_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        assigned_agent TEXT,
        task_type TEXT NOT NULL, -- 'POSTING_SUGGESTION', 'BUDGET_AUDIT', 'TREND_SCRAPE'
        payload TEXT,            -- Structured JSON of target instructions
        status TEXT DEFAULT 'Pending', -- 'Pending', 'Processing', 'Executed'
        execute_after DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    )`);

    // 📜 6. Historical Log Vault
    db.run(`CREATE TABLE IF NOT EXISTS agent_audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        agent_name TEXT,
        action_executed TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    )`);

    console.log("🛡️ STRATEGY & DISPATCH READY SECURE MESH INITIALIZED");
});
db.close();
