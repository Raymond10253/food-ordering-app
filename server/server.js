const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');
const { verifyToken, optionalAuth } = require('./middleware/auth');
const { Connection } = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/register', async(req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message: 'name, email and password are required.'});
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [normalizedEmail]
        );
        if (existing.length > 0) {
            return res.status(409).json({ message: 'An account with this email alredy exists.'});
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password,saltRounds);

        const [result] = await db.query(
            'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
            [name.trim(), normalizedEmail, phone || null, passwordHash]
        );

        const user = {
            id: result.insertId,
            name: name.trim(),
            email: normalizedEmail,
            phone: phone || '',
        };

        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '7d' });

        res.status(201).json({message: 'Registration successful', user, token });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({message: 'Server error during registration.'});
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: 'Email and password are required.'});
        }

        const normalizedEmail = email.trim().toLowerCase();
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?', 
            [normalizedEmail]
        );

        if (rows.length === 0) {
            return res.status(401).json({message: 'Invalid email or password.' });
        }

        const dbUser = rows[0];
        const isMatch = await bcrypt.compare(password, dbUser.password_hash);

        if (!isMatch) {
            return res.status(401).json({message: 'Incorrect password.'});
        }

        const user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone || '',
        };

        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '7d' });

        res.json({message: 'Login successful', user, token});
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({message: 'Server error during login'});
    }
});

app.get('/api/restaurants', async (req, res) => {
    try {
        const [restaurants]= await db.query(
            'SELECT * FROM restaurants ORDER BY rating DESC'
        );
        const [menuItems] = await db.query(
            'SELECT * FROM menu_items'
        );

        const combined = restaurants.map((rest) => ({
            ...rest,
            menu: menuItems
                .filter((item) => item.restaurant_id === rest.id)
                .map((item) => ({
                    ...item,
                    restaurant_name: rest.name,
                })),
        }));

        res.json(combined);
    } catch (err) {
        console.error('Fetch restaurant error:',err);
        res.status(500).json({message: 'Failed to load restaurants.'});
    }
});

app.get('/api/menu/search', async (req, res) => {
    try {
        const q = `%${(req.query.q || '').trim()}%`;
        const [items] = await db.query(
            `SELECT m.*, r.name AS restaurant_name
            FROM menu_items m
            JOIN restaurants r ON m.restaurant_id = r.id
            WHERE m.name LIKE ? OR m.description LIKE ? OR r.name LIKE ?`,
            [q, q, q]
        );
        res.json(items);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({message: 'Search failed.'});
    }
});

app.post('/api/orders', optionalAuth, async (req, res) => {
    const connection = await db.getConnection();
    try {
        const {
            restaurant_id,
            items,
            delivery_address,
            delivery_notes,
            contact_phone,
            payment_method,
            payment_phone,
            subtotal,
            delivery_fee,
            tax,
            discount,
            total_amount,
        } = req.body;
        
        if (!items || items.length === 0 || !delivery_address || !contact_phone) {
            return res.status(400).json({message: 'Missing fields required'});
        }

        await connection.beginTransaction();

        const userId = req.user ? req.user.id : null;

        const [orderResult] = await connection.query(
            `INSERT INTO order
            (user_id, restaurant_id, delivery_address, delivery_notes, contact_phone,
                payment_method, payment_phone, subtotal, delivery_fee, tax, discount, total_amount, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Order confirmed')`,
                [
                    userId,
                    restaurant_id || 1,
                    delivery_address,
                    delivery_notes || '',
                    contact_phone,
                    payment_method || 'mpesa',
                    payment_phone || null,
                    subtotal,
                    delivery_fee,
                    tax,
                    discount || 0,
                    total_amount,
                ]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                `INSERT INTO order_items (order_id, menu_item_id, name, quantity, unit_price)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.menu_item_id,
                    item.name,
                    item.quantity,
                    item.unit_price
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Order placed successfully!',
            order: {
                id: orderId,
                status: 'Order Confirmed',
                restaurant_id,
                items,
                delivery_address,
                payment_method,
                total_amount,
                created_at: new Date().toISOString(),
            },
        });
    } catch (err) {
        await connection.rollback();
        console.error('Create order error:', err);
        res.status(500).json({message: 'Failed to Place order.' });
    } finally {
        connection.release();
    }
});

app.get('/api/orders',verifyToken, async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, r.name AS restaurant_name
            FROM orders o
            LEFT JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        for (const order of orders) {
            const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            order.items = items;
        }

        res.json(orders);
    } catch (err) {
        console.error('Fetch orders error:', err);
        res.status(500).json({message: 'Failed to fetch orders.'});
    }
});

app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const {status} = req.body;
        const validStatuses = ['Order Confirmed', 'Preparing Food', 'Out for delivery', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({message: 'Invalid order status.' });
        }

        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({message: 'Order status updated.', status });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({message: 'Failed to update order status.'});
    }
});

app.post('/api/reviews', verifyToken, async (req, res) => {
    try {
        const {restaurant_id, order_id, rating, comment} =req.body;

        if (!restaurant_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).jsuon({message: 'Vlid restaurant ID and rating(1-5) are required.'});
        }

        await db.query(
            'INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, restaurant_id, order_id || null, rating, comment || '']
        );

        const [[stats]] = await db.query(
            'SELECT ROUND(AVG(rating), 1) AS avgRating, COUNT(*) AS totalReviews FROM reviews WHERE restaurant_id = ?',
            [restaurant_id]
        );

        await db.query(
            'UPDATE restaurants SET rating = ?, reviews_count = ? WHERE id = ?',
            [stats.avgRating || rating, stats.totalReviews, restaurant_id]
        );

        res.status(201).json({
            message: 'Review submitted!',
            rating: stats.avgRating,
            reviews_count: stats.totalReviews,
        });
    } catch (err) {
        console.error('Review error:', err);
        res.status(500).json({message: 'Failed to submit review.'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`CraveDash API server running on PORT ${PORT}`);
});