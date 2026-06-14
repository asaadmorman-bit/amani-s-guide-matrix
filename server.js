import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database', 'secure_mesh.db');

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/system-status', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all("SELECT * FROM profiles", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ initialized: rows.length > 0, profiles: rows });
        db.close();
    });
});

// Dynamic Onboarding Setup Matrix
app.post('/api/onboarding/initialize', (req, res) => {
    const { profilesSetup } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        const profileStmt = db.prepare(`INSERT INTO profiles (name, description, is_onboarded) VALUES (?, ?, 1)`);
        const paramStmt = db.prepare(`INSERT INTO matrix_state (id, profile_id, category, name, value, status) VALUES (?, ?, ?, ?, ?, 'Nominal')`);
        const agentStmt = db.prepare(`INSERT INTO custom_agents (profile_id, name, purpose, api_token) VALUES (?, ?, ?, ?)`);
        const kbStmt = db.prepare(`INSERT OR REPLACE INTO agent_knowledge_base (profile_id, knowledge_key, knowledge_value) VALUES (?, ?, ?)`);

        profilesSetup.forEach((prof) => {
            profileStmt.run(prof.name, prof.description, function(err) {
                if (err) return;
                const newProfileId = this.lastID;

                if (prof.parameters) {
                    prof.parameters.forEach((p, idx) => {
                        paramStmt.run(`${newProfileId}-${Date.now()}-${idx}`, newProfileId, prof.category || 'General', p.name, p.value);
                    });
                }

                if (prof.agents) {
                    prof.agents.forEach((a) => {
                        const token = 'am_tok_' + Math.random().toString(36).substring(2, 15);
                        agentStmt.run(newProfileId, a.name, a.purpose, token);
                    });
                }

                if (prof.initialStrategy) {
                    Object.entries(prof.initialStrategy).forEach(([key, val]) => {
                        kbStmt.run(newProfileId, key, val);
                    });
                }
            });
        });

        profileStmt.finalize();
        paramStmt.finalize();
        agentStmt.finalize();
        kbStmt.finalize();

        res.json({ success: true });
        db.close();
    });
});

// Expanded Scoped Profile State Data Fetcher
app.get('/api/state/:profileId', (req, res) => {
    const { profileId } = req.params;
    const db = new sqlite3.Database(dbPath);
    
    db.all("SELECT id, category, name, value, status FROM matrix_state WHERE profile_id = ?", [profileId], (err, params) => {
        db.all("SELECT id, name, purpose, status FROM custom_agents WHERE profile_id = ?", [profileId], (err2, agents) => {
            db.all("SELECT id, knowledge_key, knowledge_value FROM agent_knowledge_base WHERE profile_id = ?", [profileId], (err3, strategy) => {
                db.all("SELECT id, assigned_agent, task_type, status, created_at FROM agent_tasks_queue WHERE profile_id = ? ORDER BY id DESC LIMIT 5", [profileId], (err4, tasks) => {
                    res.json({
                        trackedParameters: params || [],
                        customAgents: agents || [],
                        strategyAssets: strategy || [],
                        activeTasks: tasks || []
                    });
                    db.close();
                });
            });
        });
    });
});

// Inject New Task Request Into the Queue for Agents to Process
app.post('/api/tasks/dispatch', (req, res) => {
    const { profileId, taskType, payload, assignedAgent } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.run(`INSERT INTO agent_tasks_queue (profile_id, assigned_agent, task_type, payload) VALUES (?, ?, ?, ?)`,
        [profileId, assignedAgent, taskType, JSON.stringify(payload)],
        function(err) {
            if (err) { db.close(); return res.status(500).json({ error: err.message }); }
            res.json({ success: true, taskId: this.lastID });
            db.close();
        }
    );
});

// Write parameters manually
app.post('/api/fields', (req, res) => {
    const { profileId, category, name, value } = req.body;
    const db = new sqlite3.Database(dbPath);
    db.run(`INSERT INTO matrix_state (id, profile_id, category, name, value, status) VALUES (?, ?, ?, ?, ?, 'Nominal')`,
        [String(Date.now()), profileId, category, name, value],
        (err) => {
            if (err) { db.close(); return res.status(500).json({ error: err.message }); }
            db.all("SELECT id, category, name, value, status FROM matrix_state WHERE profile_id = ?", [profileId], (err, rows) => {
                res.json({ trackedParameters: rows });
                db.close();
            });
        }
    );
});

// Register Custom Agent
app.post('/api/agents/register', (req, res) => {
    const { profileId, name, purpose } = req.body;
    const db = new sqlite3.Database(dbPath);
    const token = 'am_tok_' + Math.random().toString(36).substring(2, 15);
    db.run(`INSERT INTO custom_agents (profile_id, name, purpose, api_token) VALUES (?, ?, ?, ?)`,
        [profileId, name, purpose, token],
        function(err) {
            if (err) { db.close(); return res.status(500).json({ error: err.message }); }
            res.json({ success: true, token });
            db.close();
        }
    );
});

// Secure API endpoint for agent execution loops
app.post('/api/agent/execute-pulse', (req, res) => {
    const agentToken = req.headers['authorization']?.split(' ')[1];
    const { logEntry, updateParameters } = req.body; // updateParameters expects array of objects: { name, value, status }

    if (!agentToken) return res.status(401).json({ error: "Unauthorized" });
    const db = new sqlite3.Database(dbPath);

    db.get(`SELECT id, profile_id, name FROM custom_agents WHERE api_token = ?`, [agentToken], (err, agent) => {
        if (err || !agent) { db.close(); return res.status(403).json({ error: "Forbidden" }); }

        db.serialize(() => {
            db.run(`UPDATE custom_agents SET status = 'Active' WHERE id = ?`, [agent.id]);
            db.run(`INSERT INTO agent_audit_logs (profile_id, agent_name, action_executed) VALUES (?, ?, ?)`, [agent.profile_id, agent.name, logEntry]);

            if (updateParameters && Array.isArray(updateParameters)) {
                const pStmt = db.prepare(`UPDATE matrix_state SET value = ?, status = ?, last_updated = CURRENT_TIMESTAMP WHERE profile_id = ? AND name = ?`);
                updateParameters.forEach(param => {
                    pStmt.run(param.value, param.status || 'Nominal', agent.profile_id, param.name);
                });
                pStmt.finalize();
            }

            db.run(`UPDATE custom_agents SET status = 'Idle' WHERE id = ?`, [agent.id], () => {
                res.json({ success: true });
                db.close();
            });
        });
    });
});

app.listen(8000, '0.0.0.0', () => {
    console.log('🛡️ STRATEGIC AGENT INTEGRATION ARCHITECTURE CORE ONLINE // PORT 8000');
});
