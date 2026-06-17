# SmartKirana

### A Modern SaaS Platform for Indian Kirana Stores

Inventory Management • Billing • Customer Credit • Business Analytics • AI Insights

A production-inspired SaaS application that digitizes the daily operations of Indian kirana stores through a modern mobile-first interface. SmartKirana combines inventory management, billing, customer credit tracking, supplier management, employee management, analytics, and AI-powered business insights into a single platform.

---

# Overview

SmartKirana is a modern SaaS application designed for small grocery stores and retail businesses. It replaces traditional notebook-based record keeping with an intuitive digital solution that streamlines inventory, billing, customer management, and business analytics.

The project showcases modern frontend architecture, scalable component design, multilingual support, responsive UI, subscription-based SaaS architecture, and Google Gemini integration for intelligent business recommendations.

---

# Highlights

* Mobile-first SaaS architecture
* Modern React 19 application
* Fully responsive interface
* Type-safe development with TypeScript
* AI-powered business recommendations
* English and Hindi language support
* Dark and Light themes
* Modular component architecture
* Scalable folder structure
* Production-inspired UI/UX
* Subscription-based premium modules
* Secure AI integration through Express backend

---

# Features

## Core Modules

| Module               | Description                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Dashboard            | Real-time overview of sales, profit, revenue, low-stock alerts, weekly trends, and daily sales targets |
| Inventory Management | Product catalog with SKU, pricing, stock levels, suppliers, barcode generation, and inventory tracking |
| Billing System       | Fast GST invoice generation supporting Cash, UPI, and Card payments                                    |
| Reports & Analytics  | Weekly and monthly reports with sales trends, profit analysis, and best-selling products               |
| Store Profile        | Store settings, owner information, language preferences, themes, and business configuration            |

---

## SmartPro Modules

| Module                        | Description                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| Customer Credit (Udhaar Book) | Record customer credit, repayments, and WhatsApp payment reminders                      |
| Customer CRM                  | Loyalty points, purchase history, outstanding balances, and credit limits               |
| Supplier Management           | Purchase orders, supplier tracking, and outstanding payment management                  |
| Employee Management           | Staff profiles, attendance, assigned roles, and performance tracking                    |
| Marketing Center              | Discount campaigns, loyalty rewards, promotional offers, and coupon management          |
| Expiry Management             | Batch-wise expiry monitoring and damaged stock tracking                                 |
| Barcode Generator             | Barcode creation for inventory products                                                 |
| AI Insights                   | Revenue forecasting, demand prediction, and product recommendations using Google Gemini |
| Security Center               | PIN authentication with simulated biometric protection                                  |

---

## Platform Features

* English and Hindi language support
* Persistent language preferences
* Dark and Light theme
* Mobile device simulator interface
* Splash screen and authentication flow
* Notification center
* Help and FAQ section
* Subscription management
* Responsive layout
* Modern animations
* Local storage persistence

---

# Architecture

```text
                 React + TypeScript Client
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Dashboard         Inventory          Billing
        │                  │                  │
        └───────────────Reports───────────────┘
                           │
                     SmartPro Modules
                           │
                           ▼
                    Express.js Backend
                           │
                           ▼
                    Google Gemini API
```

---

# Technology Stack

| Category   | Technologies                                      |
| ---------- | ------------------------------------------------- |
| Frontend   | React 19, TypeScript 5.8, Tailwind CSS v4, Vite 6 |
| Backend    | Express.js                                        |
| Runtime    | Node.js                                           |
| AI         | Google Gemini API                                 |
| Animations | Motion                                            |
| Icons      | Lucide React                                      |

---

# Getting Started

## Prerequisites

* Node.js 18 or later
* Google Gemini API Key

---

## Installation

```bash
# Clone the repository

git clone https://github.com/your-username/smartkirana.git

# Navigate to the project

cd smartkirana

# Install dependencies

npm install

# Configure environment variables

cp .env.example.txt .env

# Add your Gemini API key

GEMINI_API_KEY=your_api_key_here

# Start the development server

npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Demo Credentials

| Field         | Value                             |
| ------------- | --------------------------------- |
| Mobile Number | Any valid number (Prototype Mode) |
| Security PIN  | `1234`                            |

---

# Project Structure

```text
smartkirana/
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── data.ts
│   ├── types.ts
│   ├── lang.ts
│   │
│   └── components/
│       ├── MobileFrame.tsx
│       ├── SplashView.tsx
│       ├── LoginView.tsx
│       ├── SignupView.tsx
│       ├── DashboardTab.tsx
│       ├── InventoryTab.tsx
│       ├── BillingTab.tsx
│       ├── ReportsTab.tsx
│       ├── ProfileTab.tsx
│       ├── NotificationsView.tsx
│       ├── HelpSupportView.tsx
│       ├── SubscriptionView.tsx
│       │
│       └── advanced/
│           ├── AdvancedSaaSModules.tsx
│           ├── SecurityPinScreen.tsx
│           └── mockData.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Subscription Model

SmartKirana follows a freemium SaaS business model.

### Free Plan

* Dashboard
* Inventory Management
* Billing System
* Basic Reports
* Up to 50 Products

### SmartPro (₹99/month)

* Customer Credit Management
* CRM
* Supplier Management
* Employee Management
* Marketing Center
* Expiry Tracking
* AI Insights
* Security PIN
* Advanced Analytics

Premium functionality is managed through the subscription layer implemented within the application.

---

# AI Integration

SmartKirana integrates Google Gemini to provide intelligent business recommendations.

Current AI capabilities include:

* Seven-day revenue forecasting
* Demand prediction
* Product restocking recommendations
* Best-selling product identification
* Business performance insights

The Gemini API is securely accessed through an Express backend proxy to prevent client-side API key exposure.

---

# Available Scripts

```bash
npm run dev        # Start development server

npm run build      # Build production version

npm run preview    # Preview production build

npm run lint       # TypeScript validation

npm run clean      # Remove build files
```

---

# Roadmap

* [ ] Camera-based barcode scanner
* [ ] Firebase Authentication
* [ ] Cloud database synchronization
* [ ] Multi-device data sync
* [ ] Progressive Web App (PWA)
* [ ] Offline mode
* [ ] WhatsApp Business API integration
* [ ] GST return export
* [ ] Voice search in Hindi
* [ ] Multi-store management
* [ ] Role-based access control
* [ ] Sales forecasting dashboard
* [ ] Receipt printer integration

---

# Author

**Mamta Sharma**

B.Tech Computer Science Engineering

Manav Rachna University

SmartKirana was developed as a production-inspired SaaS project demonstrating modern frontend development, scalable application architecture, AI integration, and user-centered design for India's retail ecosystem.

---

# License

Licensed under the Apache License 2.0.

See the `LICENSE` file for more information.

---

SmartKirana demonstrates how modern web technologies and artificial intelligence can simplify retail operations for millions of small businesses.

Developed by **Mamta Sharma**
