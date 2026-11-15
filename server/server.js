const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) =>{
    try {
        const [rows] =await pool.query('SELECT 1 + 1 AS connected');
        res.json({
            status: 'success',
            message: 'Food ordering API is running',
            dbStatus: rows[0].connected === 2 ? 'Connected to MySQL' : 'Check failed'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Database Connection failed',
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});