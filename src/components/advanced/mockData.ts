/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Customer, Supplier, Employee, MarketingCampaign, ExpiryStock } from '../../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001",
    name: "Ramesh Sharma",
    mobile: "9876543210",
    loyaltyPoints: 340,
    outstandingBalance: 1250,
    creditLimit: 5000,
    udhaarHistory: [
      { id: "TX-101", amount: 1500, type: "credit", date: "2026-05-20", description: "Monthly groceries purchase" },
      { id: "TX-102", amount: 250, type: "payment", date: "2026-05-25", description: "Partial payment (UPI)" },
    ]
  },
  {
    id: "CUST-002",
    name: "Sita Patel",
    mobile: "9988776655",
    loyaltyPoints: 580,
    outstandingBalance: 0,
    creditLimit: 7500,
    udhaarHistory: [
      { id: "TX-103", amount: 500, type: "credit", date: "2026-05-18", description: "Dairy oil refill pack" },
      { id: "TX-104", amount: 500, type: "payment", date: "2026-05-22", description: "Paid off in full" }
    ]
  },
  {
    id: "CUST-003",
    name: "Anil Goel",
    mobile: "9812345678",
    loyaltyPoints: 120,
    outstandingBalance: 3200,
    creditLimit: 4000,
    udhaarHistory: [
      { id: "TX-105", amount: 3200, type: "credit", date: "2026-06-01", description: "Rice bag, Atta bag on credit" }
    ]
  },
  {
    id: "CUST-004",
    name: "Priyanka Roy",
    mobile: "9334455667",
    loyaltyPoints: 920,
    outstandingBalance: 450,
    creditLimit: 10000,
    udhaarHistory: [
      { id: "TX-106", amount: 950, type: "credit", date: "2026-05-10", description: "Beauty cosmetics, ghee" },
      { id: "TX-107", amount: 500, type: "payment", date: "2026-05-15", description: "Cash paid" }
    ]
  },
  {
    id: "CUST-005",
    name: "Sunil Verma",
    mobile: "9445566778",
    loyaltyPoints: 85,
    outstandingBalance: 0,
    creditLimit: 3000,
    udhaarHistory: []
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "SUPP-001",
    name: "Shree Balaji Traders",
    mobile: "9811223344",
    company: "Balaji Rice & Grains Co.",
    outstanding: 4500,
    purchaseOrders: [
      {
        id: "PO-2026-001",
        supplierId: "SUPP-001",
        date: "2026-05-22",
        items: [
          { sku: "GR001", name: "Premium Basmati Rice", quantity: 50, price: 85 },
          { sku: "GR013", name: "Fortune Toor Dal", quantity: 20, price: 135 }
        ],
        total: 6950,
        status: "Received"
      }
    ]
  },
  {
    id: "SUPP-002",
    name: "ITC Distributors",
    mobile: "9911882233",
    company: "ITC Consumer Goods",
    outstanding: 0,
    purchaseOrders: [
      {
        id: "PO-2026-002",
        supplierId: "SUPP-002",
        date: "2026-05-28",
        items: [
          { sku: "GR002", name: "Ashirvaad Shudh Chakki Atta", quantity: 30, price: 370 }
        ],
        total: 11100,
        status: "Received"
      }
    ]
  },
  {
    id: "SUPP-003",
    name: "Amul Anand Dairy",
    mobile: "9224455667",
    company: "Amul Cooperative Gujarat",
    outstanding: 2300,
    purchaseOrders: []
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "EMP-001",
    name: "Amit Yadav",
    role: "Billing Cashier",
    mobile: "9955443322",
    salesContribution: 18450,
    attendance: {
      "2026-06-01": "Present",
      "2026-06-02": "Present",
      "2026-06-03": "Present"
    }
  },
  {
    id: "EMP-002",
    name: "Deepak Kumar",
    role: "Delivery & Stock Executive",
    mobile: "9112233445",
    salesContribution: 4200,
    attendance: {
      "2026-06-01": "Present",
      "2026-06-02": "Absent",
      "2026-06-03": "Present"
    }
  },
  {
    id: "EMP-003",
    name: "Pooja Singh",
    role: "Store Manager",
    mobile: "9870102033",
    salesContribution: 9300,
    attendance: {
      "2026-06-01": "Present",
      "2026-06-02": "Present",
      "2026-06-03": "Present"
    }
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "CAMP-001",
    title: "Monsoon Flat Discount",
    code: "MONSOON10",
    type: "Discount",
    value: 10, // 10% off
    minBillAmount: 1000,
    status: "Active"
  },
  {
    id: "CAMP-002",
    title: "Double Loyalty Points Extra",
    code: "LOYAL2X",
    type: "Points",
    value: 2, // 2x points multiplier
    minBillAmount: 500,
    status: "Active"
  },
  {
    id: "CAMP-003",
    title: "BOGO Snacks Madness",
    code: "SNACKBOGO",
    type: "BOGO",
    value: 1,
    minBillAmount: 300,
    status: "Paused"
  }
];

export const INITIAL_EXPIRY_STOCKS: ExpiryStock[] = [
  {
    sku: "DY004",
    name: "Amul Fresh Paneer Block",
    expiryDate: "2026-06-05", // near expiry
    batchNo: "B-PAN405",
    quantity: 4,
    discarded: false
  },
  {
    sku: "DY007",
    name: "Amul Taaza Milk",
    expiryDate: "2026-06-04", // very near
    batchNo: "B-MTZ702",
    quantity: 2,
    discarded: false
  },
  {
    sku: "BV010",
    name: "Paper Boat Aam Panna",
    expiryDate: "2026-05-20", // expired
    batchNo: "B-PP881",
    quantity: 5,
    discarded: false
  }
];
