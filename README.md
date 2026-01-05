# Payment Gateway System

A simplified payment gateway implementation inspired by platforms like Razorpay and Stripe.  
This project supports merchant order creation, multi-method payments (UPI & Card), and a hosted checkout page with proper API authentication and database persistence.

---

## 🚀 Features

- Merchant authentication using **API Key & Secret**
- Order creation and retrieval
- Payment processing with:
  - **UPI (VPA validation)**
  - **Card (Luhn validation, network detection)**
- Hosted **Checkout Page** for customers
- Payment status lifecycle (`processing → success / failed`)
- Public and authenticated API separation
- PostgreSQL database with proper schema & indexing
- Optional pagination for payments
- Dockerized setup using **Docker & Docker Compose**

---

## 🧠 Tech Stack

- **Backend**: Node.js, Express  
- **Database**: PostgreSQL  
- **Frontend**: React (Dashboard + Checkout)  
- **Auth**: API Key & API Secret  
- **Payments**: Mocked (UPI & Card)  
- **Containerization**: Docker, Docker Compose  

---

## 🔐 Test Merchant Credentials

These credentials are auto-seeded on application startup:

API Key: key_test_abc123
API Secret: secret_test_xyz789



---

## 🗄️ Backend Setup (Local)

```bash
cd backend
npm install
node index.js

## Backend runs on:

http://localhost:8000


## 📦 Core APIs

### Orders
POST /api/v1/orders
GET  /api/v1/orders/:id
GET  /api/v1/orders/:id/public

### Payments
POST /api/v1/payments              (Authenticated)
POST /api/v1/payments/public       (Checkout)
GET  /api/v1/payments
GET  /api/v1/payments/stats
GET  /api/v1/payments/:id

### Authentication Headers (Protected APIs)
X-Api-Key:    key_test_abc123
X-Api-Secret: secret_test_xyz789

## 🧩 Checkout Page (Hosted Payment)
cd checkout-page
npm install
npm start

### Open in browser:

http://localhost:3001/checkout?order_id=order_xxxxx

### UPI

user@paytm


### Card

Card Number: 4111111111111111
Expiry:     12/30
CVV:        123
Name:       John Doe

## 📊 Dashboard (Optional UI)
cd frontend
npm install
npm start


### Open:

http://localhost:3000/dashboard


## 🐳 Docker Setup

Run all services together using Docker Compose:

docker-compose up --build


This starts:

Backend API → http://localhost:8000

Checkout Page → http://localhost:3001

Dashboard → http://localhost:3000

PostgreSQL Database

## 📁 Project Structure

payment-gateway/
├── backend/
├── checkout-page/
├── frontend/
├── docker-compose.yml
├── README.md