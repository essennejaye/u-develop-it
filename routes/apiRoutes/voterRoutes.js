const express = require('express');
const router = express.Router();
// database connection
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters
                ORDER BY last_name`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/voters/:id', (req, res) => {
    const sql = `SELECT * FROM voters
                WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: row ? 'success': 'not found',
            data: row
        });
    });
});

router.post ('/voters', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO voters (first_name, last_name, email)
                VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.email];
    db.run(sql, params, function(err, data) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        var result = {
            message: 'success',
            data: body,
            id: this.lastID
        }
        res.json(result);
    });
});

router.put('/voters/:id', (req, res) => {
    const errors = inputCheck(req.body, 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE voters SET email = ?
                WHERE id = ?`;
    const params = [req.body.email, req.params.id];
    db.run(sql, params, function(err, data) {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: req.body,
            changes: this.changes
        });
    });
});

router.delete('/voters/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
    db.run(sql, req.params.id, function (err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        var data = {
            message: this.changes ? 'succesfully deleted' : 'not found',
            changes: this.changes
        } 
        res.json(data);
    });
});

module.exports = router;