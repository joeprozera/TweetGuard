const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./usernames.db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Check if username exists
app.get('/check-username', (req, res) => {
    const username = req.query.username;
    db.get('SELECT * FROM usernames WHERE username = ?', [username], (err, row) => {
        if (row) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    });
});

// Add username
app.post('/add-username', (req, res) => {
    const username = req.body.username;
    if (!username.startsWith('@') || username.includes(' ')) {
        return res.json({ success: false, message: 'Invalid username format.' });
    }

    db.run('INSERT INTO usernames (username) VALUES (?)', [username], (err) => {
        if (err) {
            res.json({ success: false, message: 'Username already followed.' });
        } else {
            res.json({ success: true, message: 'Username followed successfully.' });
        }
    });
});

// List usernames
app.get('/list-usernames', (req, res) => {
    db.all('SELECT * FROM usernames ORDER BY added_on DESC', [], (err, rows) => {
        res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
