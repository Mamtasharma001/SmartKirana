/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Invoice, HelpStep } from './types';

// Let's define the 50 Sample Products
export const INITIAL_PRODUCTS: Product[] = [
  // GROCERY (18 Items)
  { sku: "GR001", name: "Premium Basmati Rice", category: "Grocery", price: 110, costPrice: 85, stock: 120, unit: "kg", supplier: "Shree Balaji Traders", lowStockThreshold: 20 },
  { sku: "GR002", name: "Ashirvaad Shudh Chakki Atta", category: "Grocery", price: 420, costPrice: 370, stock: 45, unit: "bag (10kg)", supplier: "ITC Distributors", lowStockThreshold: 10 },
  { sku: "GR003", name: "Fortune Mustard Oil", category: "Grocery", price: 165, costPrice: 145, stock: 60, unit: "Litre", supplier: "Adani Wilmar Ltd", lowStockThreshold: 15 },
  { sku: "GR004", name: "Tata Salt Lite", category: "Grocery", price: 28, costPrice: 22, stock: 150, unit: "kg", supplier: "Tata Consumer Products", lowStockThreshold: 25 },
  { sku: "GR005", name: "Madhur Pure Sugar", category: "Grocery", price: 48, costPrice: 41, stock: 15, unit: "kg", supplier: "Shree Balaji Traders", lowStockThreshold: 30 }, // LOW STOCK
  { sku: "GR006", name: "Amul Cow Ghee", category: "Grocery", price: 650, costPrice: 580, stock: 24, unit: "Litre", supplier: "Amul Anand Dairy", lowStockThreshold: 5 },
  { sku: "GR007", name: "Tata Tea Gold", category: "Grocery", price: 340, costPrice: 295, stock: 35, unit: "bag (500g)", supplier: "Tata Consumer Products", lowStockThreshold: 8 },
  { sku: "GR008", name: "Nescafe Classic Coffee", category: "Grocery", price: 185, costPrice: 160, stock: 40, unit: "jar (100g)", supplier: "Nestle Corp", lowStockThreshold: 10 },
  { sku: "GR009", name: "Catch Turmeric Powder", category: "Grocery", price: 35, costPrice: 28, stock: 80, unit: "packet (200g)", supplier: "DS Group", lowStockThreshold: 15 },
  { sku: "GR010", name: "Catch Coriander Powder", category: "Grocery", price: 40, costPrice: 32, stock: 75, unit: "packet (200g)", supplier: "DS Group", lowStockThreshold: 15 },
  { sku: "GR011", name: "Catch Red Chilli Powder", category: "Grocery", price: 55, costPrice: 45, stock: 4, unit: "packet (200g)", supplier: "DS Group", lowStockThreshold: 15 }, // LOW STOCK
  { sku: "GR012", name: "Fortune Soya Health Oil", category: "Grocery", price: 145, costPrice: 125, stock: 85, unit: "Litre", supplier: "Adani Wilmar Ltd", lowStockThreshold: 20 },
  { sku: "GR013", name: "Fortune Toor Dal", category: "Grocery", price: 160, costPrice: 135, stock: 8, unit: "kg", supplier: "Shree Balaji Traders", lowStockThreshold: 15 }, // LOW STOCK
  { sku: "GR014", name: "Fortune Kabuli Chana", category: "Grocery", price: 140, costPrice: 115, stock: 40, unit: "kg", supplier: "Shree Balaji Traders", lowStockThreshold: 12 },
  { sku: "GR015", name: "Rajdhani Besan", category: "Grocery", price: 90, costPrice: 76, stock: 50, unit: "packet (1kg)", supplier: "Rajdhani Foods", lowStockThreshold: 10 },
  { sku: "GR016", name: "Rajdhani Maida", category: "Grocery", price: 45, costPrice: 37, stock: 65, unit: "packet (1kg)", supplier: "Rajdhani Foods", lowStockThreshold: 10 },
  { sku: "GR017", name: "Rajdhani Poha", category: "Grocery", price: 55, costPrice: 45, stock: 3, unit: "packet (1kg)", supplier: "Rajdhani Foods", lowStockThreshold: 8 }, // LOW STOCK
  { sku: "GR018", name: "Fortune Moong Dal Split", category: "Grocery", price: 150, costPrice: 128, stock: 35, unit: "kg", supplier: "Shree Balaji Traders", lowStockThreshold: 10 },

  // BEVERAGES (11 Items)
  { sku: "BV001", name: "Coca Cola Double Chill", category: "Beverages", price: 40, costPrice: 32, stock: 120, unit: "can (300ml)", supplier: "Hindustan Coca-Cola", lowStockThreshold: 20 },
  { sku: "BV002", name: "Sprite Fizz Drink", category: "Beverages", price: 40, costPrice: 32, stock: 95, unit: "can (300ml)", supplier: "Hindustan Coca-Cola", lowStockThreshold: 20 },
  { sku: "BV003", name: "Thums Up Bold", category: "Beverages", price: 90, costPrice: 74, stock: 50, unit: "bottle (2L)", supplier: "Hindustan Coca-Cola", lowStockThreshold: 10 },
  { sku: "BV004", name: "Frooti Mango Drink", category: "Beverages", price: 20, costPrice: 15, stock: 240, unit: "tetrapak (150ml)", supplier: "Parle Agro", lowStockThreshold: 30 },
  { sku: "BV005", name: "Maaza Mango Juiciness", category: "Beverages", price: 75, costPrice: 62, stock: 6, unit: "bottle (1.2L)", supplier: "Hindustan Coca-Cola", lowStockThreshold: 15 }, // LOW STOCK
  { sku: "BV006", name: "Red Bull Energy Drink", category: "Beverages", price: 125, costPrice: 98, stock: 45, unit: "can (250ml)", supplier: "Red Bull India", lowStockThreshold: 10 },
  { sku: "BV007", name: "Tropicana Orange Delight", category: "Beverages", price: 110, costPrice: 88, stock: 32, unit: "Tetrapak (1L)", supplier: "PepsiCo India", lowStockThreshold: 8 },
  { sku: "BV008", name: "Amul Kool Koko", category: "Beverages", price: 35, costPrice: 28, stock: 80, unit: "bottle (200ml)", supplier: "Amul Anand Dairy", lowStockThreshold: 15 },
  { sku: "BV009", name: "Bisleri Mineral Water", category: "Beverages", price: 20, costPrice: 14, stock: 300, unit: "bottle (1L)", supplier: "Bisleri International", lowStockThreshold: 50 },
  { sku: "BV010", name: "Paper Boat Aam Panna", category: "Beverages", price: 35, costPrice: 27, stock: 5, unit: "pouch (250ml)", supplier: "Hector Beverages", lowStockThreshold: 12 }, // LOW STOCK
  { sku: "BV011", name: "Cadbury Bournvita", category: "Beverages", price: 220, costPrice: 190, stock: 18, unit: "jar (500g)", supplier: "Mondelez India", lowStockThreshold: 5 },

  // SNACKS (12 Items)
  { sku: "SN001", name: "Lay's Classic Salted", category: "Snacks", price: 20, costPrice: 16, stock: 180, unit: "packet (50g)", supplier: "PepsiCo India", lowStockThreshold: 30 },
  { sku: "SN002", name: "Lay's American Style Onion", category: "Snacks", price: 20, costPrice: 16, stock: 110, unit: "packet (50g)", supplier: "PepsiCo India", lowStockThreshold: 30 },
  { sku: "SN003", name: "Kurkure Masala Munch", category: "Snacks", price: 20, costPrice: 15, stock: 200, unit: "packet (75g)", supplier: "PepsiCo India", lowStockThreshold: 35 },
  { sku: "SN004", name: "Haldiram's Aloo Bhujia", category: "Snacks", price: 110, costPrice: 92, stock: 65, unit: "packet (400g)", supplier: "Haldiram Foods", lowStockThreshold: 10 },
  { sku: "SN005", name: "Haldiram's Panchrattan Mix", category: "Snacks", price: 120, costPrice: 100, stock: 8, unit: "packet (400g)", supplier: "Haldiram Foods", lowStockThreshold: 10 }, // LOW STOCK
  { sku: "SN006", name: "Parle-G Gold Biscuits", category: "Snacks", price: 10, costPrice: 8, stock: 500, unit: "packet (120g)", supplier: "Parle Products", lowStockThreshold: 80 },
  { sku: "SN007", name: "Britannia Good Day Butter", category: "Snacks", price: 30, costPrice: 24, stock: 190, unit: "packet (150g)", supplier: "Britannia Industries", lowStockThreshold: 25 },
  { sku: "SN008", name: "Oreo Original Chocolate", category: "Snacks", price: 35, costPrice: 28, stock: 140, unit: "packet (120g)", supplier: "Mondelez India", lowStockThreshold: 20 },
  { sku: "SN009", name: "Maggi 2-Min Masala Noodles", category: "Snacks", price: 14, costPrice: 11.5, stock: 450, unit: "packet (70g)", supplier: "Nestle Corp", lowStockThreshold: 100 },
  { sku: "SN010", name: "Yippee Magic Masala Noodles", category: "Snacks", price: 14, costPrice: 11.5, stock: 280, unit: "packet (70g)", supplier: "ITC Distributors", lowStockThreshold: 50 },
  { sku: "SN011", name: "KitKat 4-Finger Bar", category: "Snacks", price: 40, costPrice: 31, stock: 6, unit: "pcs", supplier: "Nestle Corp", lowStockThreshold: 15 }, // LOW STOCK
  { sku: "SN012", name: "Cadbury Dairy Milk Silk", category: "Snacks", price: 80, costPrice: 65, stock: 35, unit: "pcs (60g)", supplier: "Mondelez India", lowStockThreshold: 10 },

  // DAIRY (9 Items)
  { sku: "DY001", name: "Amul Butter Pasteurized", category: "Dairy", price: 55, costPrice: 48, stock: 90, unit: "pack (100g)", supplier: "Amul Anand Dairy", lowStockThreshold: 15 },
  { sku: "DY002", name: "Amul Cheese Slices 10N", category: "Dairy", price: 150, costPrice: 130, stock: 40, unit: "pack (200g)", supplier: "Amul Anand Dairy", lowStockThreshold: 10 },
  { sku: "DY003", name: "Mother Dairy Full Cream Milk", category: "Dairy", price: 68, costPrice: 61, stock: 120, unit: "Litre", supplier: "Mother Dairy Ltd", lowStockThreshold: 25 },
  { sku: "DY004", name: "Amul Fresh Paneer Block", category: "Dairy", price: 90, costPrice: 77, stock: 4, unit: "pack (200g)", supplier: "Amul Anand Dairy", lowStockThreshold: 12 }, // LOW STOCK
  { sku: "DY005", name: "Mother Dairy Fresh Curd", category: "Dairy", price: 35, costPrice: 29, stock: 110, unit: "cup (400g)", supplier: "Mother Dairy Ltd", lowStockThreshold: 20 },
  { sku: "DY006", name: "Yakult Probiotic Drink 5N", category: "Dairy", price: 95, costPrice: 81, stock: 35, unit: "pack (5N)", supplier: "Yakult Danone", lowStockThreshold: 8 },
  { sku: "DY007", name: "Amul Taaza Milk", category: "Dairy", price: 54, costPrice: 48, stock: 2, unit: "Litre", supplier: "Amul Anand Dairy", lowStockThreshold: 20 }, // LOW STOCK
  { sku: "DY008", name: "Gowardhan Paneer Block", category: "Dairy", price: 95, costPrice: 82, stock: 25, unit: "pack (200g)", supplier: "Parag Milk Foods", lowStockThreshold: 8 },
  { sku: "DY009", name: "Nandini Pasteurized Butter", category: "Dairy", price: 54, costPrice: 46, stock: 32, unit: "pack (100g)", supplier: "KMF Bangalore", lowStockThreshold: 8 }
];

// Let's create exactly 20 Initial Historical Invoices spanning a few recent days
// Current date is June 3, 2026. Let's make invoices feel extremely authentic.
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "SK-2026-1025",
    date: "2026-06-03",
    time: "11:45",
    customerName: "Ramesh Sharma",
    customerMobile: "9876543210",
    paymentMethod: "UPI",
    items: [
      { sku: "GR002", name: "Ashirvaad Shudh Chakki Atta", quantity: 1, price: 420, unit: "bag (10kg)" },
      { sku: "DY001", name: "Amul Butter Pasteurized", quantity: 2, price: 55, unit: "pack (100g)" },
      { sku: "SN009", name: "Maggi 2-Min Masala Noodles", quantity: 10, price: 14, unit: "packet (70g)" }
    ],
    subtotal: 670,
    gst: 33.5,
    discount: 25,
    total: 678.5
  },
  {
    id: "SK-2026-1024",
    date: "2026-06-03",
    time: "10:15",
    customerName: "Sita Patel",
    customerMobile: "9988776655",
    paymentMethod: "Cash",
    items: [
      { sku: "GR001", name: "Premium Basmati Rice", quantity: 5, price: 110, unit: "kg" },
      { sku: "GR003", name: "Fortune Mustard Oil", quantity: 2, price: 165, unit: "Litre" },
      { sku: "DY005", name: "Mother Dairy Fresh Curd", quantity: 1, price: 35, unit: "cup (400g)" }
    ],
    subtotal: 915,
    gst: 45.75,
    discount: 50,
    total: 910.75
  },
  {
    id: "SK-2026-1023",
    date: "2026-06-02",
    time: "20:30",
    customerName: "Anil Goel",
    customerMobile: "9812345678",
    paymentMethod: "UPI",
    items: [
      { sku: "BV003", name: "Thums Up Bold", quantity: 3, price: 90, unit: "bottle (2L)" },
      { sku: "SN001", name: "Lay's Classic Salted", quantity: 5, price: 20, unit: "packet (50g)" },
      { sku: "SN007", name: "Britannia Good Day Butter", quantity: 4, price: 30, unit: "packet (150g)" }
    ],
    subtotal: 490,
    gst: 24.5,
    discount: 15,
    total: 499.5
  },
  {
    id: "SK-2026-1022",
    date: "2026-06-02",
    time: "19:10",
    customerName: "Priyanka Roy",
    customerMobile: "9334455667",
    paymentMethod: "Card",
    items: [
      { sku: "GR006", name: "Amul Cow Ghee", quantity: 1, price: 650, unit: "Litre" },
      { sku: "DY002", name: "Amul Cheese Slices 10N", quantity: 2, price: 150, unit: "pack (200g)" },
      { sku: "GR007", name: "Tata Tea Gold", quantity: 1, price: 340, unit: "bag (500g)" }
    ],
    subtotal: 1290,
    gst: 64.5,
    discount: 100,
    total: 1254.5
  },
  {
    id: "SK-2026-1021",
    date: "2026-06-02",
    time: "16:20",
    customerName: "Sunil Verma",
    customerMobile: "9445566778",
    paymentMethod: "Cash",
    items: [
      { sku: "GR004", name: "Tata Salt Lite", quantity: 2, price: 28, unit: "kg" },
      { sku: "GR005", name: "Madhur Pure Sugar", quantity: 3, price: 48, unit: "kg" },
      { sku: "SN004", name: "Haldiram's Aloo Bhujia", quantity: 1, price: 110, unit: "packet (400g)" }
    ],
    subtotal: 310,
    gst: 15.5,
    discount: 10,
    total: 315.5
  },
  {
    id: "SK-2026-1020",
    date: "2026-06-01",
    time: "18:45",
    customerName: "Vikram Malhotra",
    customerMobile: "9811223344",
    paymentMethod: "UPI",
    items: [
      { sku: "SN009", name: "Maggi 2-Min Masala Noodles", quantity: 12, price: 14, unit: "packet (70g)" },
      { sku: "BV006", name: "Red Bull Energy Drink", quantity: 4, price: 125, unit: "can (250ml)" },
      { sku: "SN003", name: "Kurkure Masala Munch", quantity: 6, price: 20, unit: "packet (75g)" }
    ],
    subtotal: 788,
    gst: 39.4,
    discount: 50,
    total: 777.4
  },
  {
    id: "SK-2026-1019",
    date: "2026-06-01",
    time: "12:10",
    customerName: "Kamlesh Mehta",
    customerMobile: "9223344556",
    paymentMethod: "Cash",
    items: [
      { sku: "GR002", name: "Ashirvaad Shudh Chakki Atta", quantity: 2, price: 420, unit: "bag (10kg)" },
      { sku: "GR012", name: "Fortune Soya Health Oil", quantity: 3, price: 145, unit: "Litre" }
    ],
    subtotal: 1275,
    gst: 63.75,
    discount: 80,
    total: 1258.75
  },
  {
    id: "SK-2026-1018",
    date: "2026-05-31",
    time: "20:15",
    customerName: "Reema Sen",
    customerMobile: "9778899001",
    paymentMethod: "UPI",
    items: [
      { sku: "DY003", name: "Mother Dairy Full Cream Milk", quantity: 4, price: 68, unit: "Litre" },
      { sku: "DY005", name: "Mother Dairy Fresh Curd", quantity: 2, price: 35, unit: "cup (400g)" },
      { sku: "SN006", name: "Parle-G Gold Biscuits", quantity: 10, price: 10, unit: "packet (120g)" }
    ],
    subtotal: 442,
    gst: 22.1,
    discount: 20,
    total: 444.1
  },
  {
    id: "SK-2026-1017",
    date: "2026-05-31",
    time: "18:00",
    customerName: "Bobby Deol",
    customerMobile: "9400030002",
    paymentMethod: "Card",
    items: [
      { sku: "BV011", name: "Cadbury Bournvita", quantity: 1, price: 220, unit: "jar (500g)" },
      { sku: "GR008", name: "Nescafe Classic Coffee", quantity: 1, price: 185, unit: "jar (100g)" },
      { sku: "GR006", name: "Amul Cow Ghee", quantity: 1, price: 650, unit: "Litre" }
    ],
    subtotal: 1055,
    gst: 52.75,
    discount: 55,
    total: 1052.75
  },
  {
    id: "SK-2026-1016",
    date: "2026-05-30",
    time: "19:40",
    customerName: "Aman Preet",
    customerMobile: "9123456000",
    paymentMethod: "UPI",
    items: [
      { sku: "SN012", name: "Cadbury Dairy Milk Silk", quantity: 2, price: 80, unit: "pcs (60g)" },
      { sku: "BV001", name: "Coca Cola Double Chill", quantity: 6, price: 40, unit: "can (300ml)" },
      { sku: "SN001", name: "Lay's Classic Salted", quantity: 5, price: 20, unit: "packet (50g)" }
    ],
    subtotal: 500,
    gst: 25.0,
    discount: 30,
    total: 495.0
  },
  {
    id: "SK-2026-1015",
    date: "2026-05-30",
    time: "13:15",
    paymentMethod: "Cash",
    items: [
      { sku: "GR001", name: "Premium Basmati Rice", quantity: 2, price: 110, unit: "kg" },
      { sku: "GR015", name: "Rajdhani Besan", quantity: 1, price: 90, unit: "packet (1kg)" },
      { sku: "GR016", name: "Rajdhani Maida", quantity: 1, price: 45, unit: "packet (1kg)" }
    ],
    subtotal: 355,
    gst: 17.75,
    discount: 10,
    total: 362.75
  },
  {
    id: "SK-2026-1014",
    date: "2026-05-29",
    time: "20:50",
    customerName: "Dr. Alok",
    customerMobile: "9988007711",
    paymentMethod: "UPI",
    items: [
      { sku: "DY006", name: "Yakult Probiotic Drink 5N", quantity: 3, price: 95, unit: "pack (5N)" },
      { sku: "DY002", name: "Amul Cheese Slices 10N", quantity: 1, price: 150, unit: "pack (200g)" }
    ],
    subtotal: 435,
    gst: 21.75,
    discount: 15,
    total: 441.75
  },
  {
    id: "SK-2026-1013",
    date: "2026-05-29",
    time: "18:25",
    paymentMethod: "Cash",
    items: [
      { sku: "BV009", name: "Bisleri Mineral Water", quantity: 12, price: 20, unit: "bottle (1L)" },
      { sku: "SN003", name: "Kurkure Masala Munch", quantity: 4, price: 20, unit: "packet (75g)" }
    ],
    subtotal: 320,
    gst: 16.0,
    discount: 0,
    total: 336.0
  },
  {
    id: "SK-2026-1012",
    date: "2026-05-28",
    time: "21:10",
    customerName: "Mrs. Singhal",
    customerMobile: "9456789123",
    paymentMethod: "Card",
    items: [
      { sku: "GR002", name: "Ashirvaad Shudh Chakki Atta", quantity: 3, price: 420, unit: "bag (10kg)" },
      { sku: "GR003", name: "Fortune Mustard Oil", quantity: 4, price: 165, unit: "Litre" },
      { sku: "DY001", name: "Amul Butter Pasteurized", quantity: 2, price: 55, unit: "pack (100g)" }
    ],
    subtotal: 2030,
    gst: 101.5,
    discount: 120,
    total: 2011.5
  },
  {
    id: "SK-2026-1011",
    date: "2026-05-28",
    time: "11:30",
    customerName: "Tushar Pant",
    customerMobile: "9870102030",
    paymentMethod: "UPI",
    items: [
      { sku: "SN007", name: "Britannia Good Day Butter", quantity: 6, price: 30, unit: "packet (150g)" },
      { sku: "SN008", name: "Oreo Original Chocolate", quantity: 3, price: 35, unit: "packet (120g)" },
      { sku: "BV008", name: "Amul Kool Koko", quantity: 4, price: 35, unit: "bottle (200ml)" }
    ],
    subtotal: 425,
    gst: 21.25,
    discount: 25,
    total: 421.25
  },
  {
    id: "SK-2026-1010",
    date: "2026-05-27",
    time: "19:05",
    customerName: "Rohit Dhawan",
    customerMobile: "9560334422",
    paymentMethod: "Cash",
    items: [
      { sku: "GR005", name: "Madhur Pure Sugar", quantity: 10, price: 48, unit: "kg" },
      { sku: "GR004", name: "Tata Salt Lite", quantity: 5, price: 28, unit: "kg" }
    ],
    subtotal: 620,
    gst: 31.0,
    discount: 40,
    total: 611.0
  },
  {
    id: "SK-2026-1009",
    date: "2026-05-27",
    time: "15:15",
    paymentMethod: "UPI",
    items: [
      { sku: "DY003", name: "Mother Dairy Full Cream Milk", quantity: 2, price: 68, unit: "Litre" },
      { sku: "SN006", name: "Parle-G Gold Biscuits", quantity: 5, price: 10, unit: "packet (120g)" },
      { sku: "GR014", name: "Fortune Kabuli Chana", quantity: 1, price: 140, unit: "kg" }
    ],
    subtotal: 326,
    gst: 16.3,
    discount: 10,
    total: 332.3
  },
  {
    id: "SK-2026-1008",
    date: "2026-05-27",
    time: "09:40",
    customerName: "Mohan Lal",
    customerMobile: "9911223399",
    paymentMethod: "Cash",
    items: [
      { sku: "GR002", name: "Ashirvaad Shudh Chakki Atta", quantity: 1, price: 420, unit: "bag (10kg)" },
      { sku: "GR018", name: "Fortune Moong Dal Split", quantity: 2, price: 150, unit: "kg" }
    ],
    subtotal: 720,
    gst: 36.0,
    discount: 50,
    total: 706.0
  },
  {
    id: "SK-2026-1007",
    date: "2026-05-26",
    time: "20:10",
    customerName: "Karan Johar",
    customerMobile: "9000100099",
    paymentMethod: "Card",
    items: [
      { sku: "GR011", name: "Catch Red Chilli Powder", quantity: 4, price: 55, unit: "packet (200g)" },
      { sku: "BV007", name: "Tropicana Orange Delight", quantity: 3, price: 110, unit: "Tetrapak (1L)" },
      { sku: "SN012", name: "Cadbury Dairy Milk Silk", quantity: 5, price: 80, unit: "pcs (60g)" }
    ],
    subtotal: 950,
    gst: 47.5,
    discount: 80,
    total: 917.5
  },
  {
    id: "SK-2026-1006",
    date: "2026-05-26",
    time: "17:35",
    customerName: "Mrs. Mehra",
    customerMobile: "9312345678",
    paymentMethod: "UPI",
    items: [
      { sku: "DY003", name: "Mother Dairy Full Cream Milk", quantity: 3, price: 68, unit: "Litre" },
      { sku: "DY001", name: "Amul Butter Pasteurized", quantity: 1, price: 55, unit: "pack (100g)" },
      { sku: "DY005", name: "Mother Dairy Fresh Curd", quantity: 2, price: 35, unit: "cup (400g)" }
    ],
    subtotal: 329,
    gst: 16.45,
    discount: 15,
    total: 330.45
  }
];

// Weekly sales data analytics (May 27 to June 3, 2026)
// This fits the line charts
export const WEEKLY_SALES_DATA = [
  { day: "Wed (27)", sales: 1649.3, activeInvoices: 3 },
  { day: "Thu (28)", sales: 2432.75, activeInvoices: 2 },
  { day: "Fri (29)", sales: 777.75, activeInvoices: 2 },
  { day: "Sat (30)", sales: 857.75, activeInvoices: 2 },
  { day: "Sun (31)", sales: 1496.85, activeInvoices: 2 },
  { day: "Mon (01)", sales: 2036.15, activeInvoices: 2 },
  { day: "Tue (02)", sales: 2069.5, activeInvoices: 3 },
  { day: "Wed (03)", sales: 1589.25, activeInvoices: 2 }
];

// Category split (Pie chart) calculated dynamically from invoices or initialized here for reporting ease
export const CATEGORY_SALES_SUMMARY = [
  { category: "Grocery", sales: 8450, percentage: 46, color: "#3B82F6" }, // Blue
  { category: "Dairy", sales: 4220, percentage: 23, color: "#10B981" }, // Green
  { category: "Snacks", sales: 3450, percentage: 19, color: "#F59E0B" }, // Amber
  { category: "Beverages", sales: 2200, percentage: 12, color: "#EC4899" } // Pink
];

// FAQS for Help & Support
export const MOCK_FAQS: HelpStep[] = [
  {
    category: "Adding Products",
    question: "How do I add a new item or product to my catalog?",
    answer: "Go to the Inventory tab and click on the 'Add Product' button. Enter the product title, select a category, input the selling price, and specify the active stock quantity. Once you click save, the item becomes instantly searchable in your store and is available for instant checkout billing!"
  },
  {
    category: "Billing System",
    question: "How do I create an invoice and process customer payments?",
    answer: "Navigate to the Billing screen. You can search for products or browse categories to add items directly to the virtual grocery cart. You can tweak product volumes via the plus/minus buttons. Provide the buyer's details, select the preferred payment system (Cash, UPI, or Card), and click Generate Invoice to view and simulate printable thermal receipts."
  },
  {
    category: "Inventory Alerts",
    question: "How do low inventory notifications get generated?",
    answer: "Every item has a configured 'Low Stock Alert Threshold'. When billing operations lower product volumes below this threshold level, the app creates a critical status warning. These items are instantly highlighted on the Main Dashboard, reported in low-stock analytics, and sent as custom Push Notifications."
  },
  {
    category: "Thermal Receipt Printing",
    question: "Can I print receipts generated by SmartKirana?",
    answer: "Yes! SmartKirana creates standard standard 80mm thermal receipt formats. These layout formats are compatible with standard ESC/POS Bluetooth or Wi-Fi thermal receipt printers. When you click Generate, you can download or send the copy to any connected print device."
  },
  {
    category: "Reports and Exporting",
    question: "Can I export grocery store performance reports?",
    answer: "Absolutely! The Reports dashboard generates real-time breakdowns of daily, weekly, and monthly sales graphs, category shares, and active stock lists. In the future production version, these charts can be exported directly as customized PDF reports or Excel sheets."
  }
];
