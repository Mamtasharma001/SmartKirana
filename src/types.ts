/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  sku: string;
  name: string;
  category: 'Grocery' | 'Beverages' | 'Snacks' | 'Dairy';
  price: number; // selling price
  costPrice: number; // purchase price for profit calculation
  stock: number;
  unit: string;
  supplier: string;
  lowStockThreshold: number;
  imageUrl?: string;
}

export interface InvoiceItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Invoice {
  id: string; // e.g. INV-2026-0001
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card';
  customerName?: string;
  customerMobile?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'lowStock' | 'milestone' | 'subscription' | 'alert';
  read: boolean;
}

export interface HelpStep {
  question: string;
  answer: string;
  category: string;
}

// ================= SAAS ADVANCED MODULE TYPES =================

export interface UdhaarTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'payment'; // credit = added udhaar, payment = cash paid to settle udhaar
  date: string;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  loyaltyPoints: number;
  outstandingBalance: number;
  creditLimit: number;
  udhaarHistory: UdhaarTransaction[];
}

export interface PurchaseOrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  date: string;
  items: PurchaseOrderItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Received';
}

export interface Supplier {
  id: string;
  name: string;
  mobile: string;
  company: string;
  outstanding: number; // money we owe them
  purchaseOrders: PurchaseOrder[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  mobile: string;
  salesContribution: number;
  attendance: { [date: string]: 'Present' | 'Absent' }; // date is YYYY-MM-DD
}

export interface MarketingCampaign {
  id: string;
  title: string;
  code: string;
  type: 'Discount' | 'BOGO' | 'Points';
  value: number; // e.g. 10% discount, 2x points
  minBillAmount: number;
  status: 'Active' | 'Paused';
}

export interface ExpiryStock {
  sku: string;
  name: string;
  expiryDate: string; // YYYY-MM-DD
  batchNo: string;
  quantity: number;
  discarded: boolean;
}

