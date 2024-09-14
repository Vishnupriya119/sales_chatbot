// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');

// Create Express app
const app = express();
app.use(bodyParser.json()); // Middleware to parse incoming JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// MySQL connection pool setup
async function connectToDatabase() {
    try {
        // Create a connection pool with your MySQL credentials
        global.connectionPool = mysql.createPool({
            host: 'localhost',       // Your MySQL host
            user: 'root',            // Your MySQL username
            password: '',            // Your MySQL password
            database: 'sales',       // Your MySQL database name
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('Connected to MySQL database');
    } catch (err) {
        console.error('Error connecting to MySQL database:', err);
    }
}

// Initialize the database connection pool
connectToDatabase();

// API Endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const connection = await connectionPool.getConnection();

        // Handle general queries
        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hello')) {
            res.json({ reply: 'Hello! How can I assist you today?' });

        } else if (lowerCaseMessage.includes('how are you')) {
            res.json({ reply: 'I\'m good, thank you! How can I help you?' });

        } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
            res.json({ reply: 'You\'re welcome! If you have any more questions, feel free to ask.' });

        } else if (lowerCaseMessage.includes('bye')) {
            res.json({ reply: 'Goodbye! Have a great day!' });

        } else if (lowerCaseMessage.includes('total sales last week')) {
            const sql = `
                SELECT SUM(total_amount) AS total_sales 
                FROM sales_data
                WHERE sale_date BETWEEN CURDATE() - INTERVAL 7 DAY AND CURDATE();
            `;
            const [rows] = await connection.execute(sql);
            const totalSales = rows[0].total_sales || 0;
            res.json({ reply: `Total sales in the last week: $${totalSales}` });

        } else if (lowerCaseMessage.includes('total sales for')) {
            const product = message.split('for')[1].trim();
            const sql = `
                SELECT SUM(total_amount) AS total_sales 
                FROM sales_data
                WHERE product_name = ?;
            `;
            const [rows] = await connection.execute(sql, [product]);
            const totalSales = rows[0].total_sales || 0;
            res.json({ reply: `Total sales for ${product}: $${totalSales}` });

        } else if (lowerCaseMessage.includes('total sales on')) {
            const saleDate = message.split('on')[1].trim();
            const sql = `
                SELECT SUM(total_amount) AS total_sales 
                FROM sales_data
                WHERE sale_date = ?;
            `;
            const [rows] = await connection.execute(sql, [saleDate]);
            const totalSales = rows[0].total_sales || 0;
            res.json({ reply: `Total sales on ${saleDate}: $${totalSales}` });

        } else if (lowerCaseMessage.includes('total sales between')) {
            const dates = message.match(/\d{2}-\d{2}-\d{4}/g);
            const sql = `
                SELECT SUM(total_amount) AS total_sales 
                FROM sales_data
                WHERE sale_date BETWEEN ? AND ?;
            `;
            const [rows] = await connection.execute(sql, [dates[0], dates[1]]);
            const totalSales = rows[0].total_sales || 0;
            res.json({ reply: `Total sales between ${dates[0]} and ${dates[1]}: $${totalSales}` });

        } else if (lowerCaseMessage.includes('quantity sold for')) {
            const product = message.split('for')[1].trim();
            const sql = `
                SELECT SUM(quantity_sold) AS total_quantity 
                FROM sales_data
                WHERE product_name = ?;
            `;
            const [rows] = await connection.execute(sql, [product]);
            const totalQuantity = rows[0].total_quantity || 0;
            res.json({ reply: `Quantity sold for ${product}: ${totalQuantity}` });

        } else if (lowerCaseMessage.includes('highest sale on')) {
            const saleDate = message.split('on')[1].trim();
            const sql = `
                SELECT MAX(total_amount) AS highest_sale 
                FROM sales_data
                WHERE sale_date = ?;
            `;
            const [rows] = await connection.execute(sql, [saleDate]);
            const highestSale = rows[0].highest_sale || 0;
            res.json({ reply: `The highest sale on ${saleDate} was $${highestSale}` });

        } else if (lowerCaseMessage.includes('average sale for')) {
            const product = message.split('for')[1].trim();
            const sql = `
                SELECT AVG(total_amount) AS average_sale 
                FROM sales_data
                WHERE product_name = ?;
            `;
            const [rows] = await connection.execute(sql, [product]);
            const averageSale = rows[0].average_sale || 0;
            res.json({ reply: `The average sale for ${product} is $${averageSale.toFixed(2)}` });

        } else if (lowerCaseMessage.includes('total sales by product')) {
            const sql = `
                SELECT product_name, SUM(total_amount) AS total_sales 
                FROM sales_data
                GROUP BY product_name;
            `;
            const [rows] = await connection.execute(sql);
            const salesSummary = rows.map(row => `${row.product_name}: $${row.total_sales}`).join(', ');
            res.json({ reply: `Total sales by product: ${salesSummary}` });

        } else if (lowerCaseMessage.includes('total sales for year')) {
            const year = message.split('for year')[1].trim();
            const sql = `
                SELECT SUM(total_amount) AS total_sales 
                FROM sales_data
                WHERE YEAR(STR_TO_DATE(sale_date, '%d-%m-%Y')) = ?;
            `;
            const [rows] = await connection.execute(sql, [year]);
            const totalSales = rows[0].total_sales || 0;
            res.json({ reply: `Total sales for the year ${year}: $${totalSales}` });

        } else {
            res.json({ reply: `Sorry, I don't understand the question: ${message}` });
        }

        connection.release();

    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ reply: 'Database error occurred.' });
    }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
