# QR-Based Self-Service Kiosk System

A modern QR-based restaurant self-service ordering system that allows customers to view menus, place orders, and manage carts directly from their mobile devices. The system reduces queues, minimizes manual order handling, and improves overall operational efficiency. It is designed with performance, scalability, and security in mind.

---

## Overview

This application replaces traditional ordering methods with a QR-powered digital menu and ordering flow. Customers scan a QR code placed on a table or counter, browse the menu in real time, and place orders seamlessly from their own devices.

Restaurant owners get access to a centralized admin panel to manage menus, categories, pricing, availability, and orders.

---

## Key Features

### Customer Side
- Scan QR code to access the restaurant menu
- Browse menu categories and items in real time
- Add and remove items from the cart
- Mobile-first, responsive user interface
- Fast loading using cached data and optimized queries

### Admin / Restaurant Owner Side
- Secure authentication using Firebase
- Create and manage restaurant profiles
- Add, update, and delete menu categories and items
- Control item pricing and availability
- Role-based access control using Firestore security rules

---

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend / BaaS: Firebase  
  - Firestore (NoSQL Database)  
  - Firebase Authentication  
  - Firestore Security Rules
- State Management: React Context API
- Performance: Caching and optimized Firestore queries

---

## Performance and Optimization

- Cached restaurant and menu data to reduce repeated database reads
- Optimized Firestore queries for faster menu loading
- Reduced unnecessary re-renders using component-level state
- Responsive design optimized for mobile and low-end devices

---

## Security

- Firestore security rules with role-based authorization
- Only restaurant owners can update or delete their data
- Public read-only access for menu and item data
- Secure authentication via Firebase Authentication

---

## User Flow

1. Restaurant generates a QR code linked to its menu
2. Customer scans the QR code using a mobile device
3. Menu loads instantly in the browser
4. Customer adds items to the cart and manages the order
5. Order is placed digitally (payment integration ready)

---

## Project Structure

src/
├── components/
│ ├── admin/
│ ├── client/
│ └── ui/
├── context/
├── routes/
├── firebase/
└── utils/

---

## Use Cases

- College canteens
- Cafes and food courts
- Small to medium-sized restaurants
- Self-service kiosk systems

---

## Author

Naman Chaturvedi  
Full Stack Developer  
Focused on building scalable and production-ready SaaS applications