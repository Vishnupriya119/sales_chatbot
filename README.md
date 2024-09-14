# sales_chatbot
# Retail Chatbot for Sales Analytics
This project is a retail chatbot that helps users interact with sales data, providing insights on total sales, quantity sold, and other queries using natural language. The chatbot can handle both sales-related queries and general queries such as greetings.

## Features

- **Sales Data Query**: Users can ask questions like:
  - Total sales in the last week
  - Total sales for a specific product
  - Quantity sold for a specific product
  - Highest sale on a specific date
  - Total sales between two dates
  
- **General Queries**: The chatbot can also handle simple greetings and general conversations.

- **LLM Integration**: The chatbot is integrated with an open-source LLM (GPT-J) to handle more complex queries.

- **Front-end Interface**: The chatbot has a colorful and user-friendly front-end interface with type indicators.

## Tech Stack

- **Backend**: Node.js, Express

- **Database**: MySQL

- **Front-end**: HTML, CSS, JavaScript

- **LLM**: GPT-J via Hugging Face Hub

- **Deployment**: Can be deployed via Vercel, GitHub, or any other cloud platform.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/retail-chatbot.git
   cd retail-chatbot

ithub.com/yourusername/retail-chatbot.git
cd retail-chatbot
Install dependencies:

bash
Copy code
npm install
Setup the MySQL Database:

## Create a MySQL database called sales.
Run the following SQL script to create the required table:
sql
Copy code
CREATE TABLE sales_data (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_date DATE,
    product_name VARCHAR(255),
    sale_amount DECIMAL(10, 2),
    quantity_sold INT,
    total_amount DECIMAL(10, 2)
);
Run the server:

bash
Copy code
node server.js
Access the chatbot: Open your browser and go to http://localhost:3000.

## Usage
-**Query Examples**
-**Total Sales Last Week:**
-**"What are the total sales in the last week?"**
Total Sales for a Specific Product:
"What are the total sales for Electronics?"
Quantity Sold for a Specific Product:
"What is the quantity sold for Mobiles?"
General Queries
"Hi, how are you?"
"Goodbye!"
