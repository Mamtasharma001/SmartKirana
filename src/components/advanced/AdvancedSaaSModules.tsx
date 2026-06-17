/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Invoice, Customer, Supplier, Employee, MarketingCampaign, ExpiryStock, UdhaarTransaction, PurchaseOrderItem, PurchaseOrder } from '../../types';
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Layers, 
  Percent, 
  Barcode, 
  MapPin, 
  BadgeAlert, 
  Plus, 
  Search, 
  Phone, 
  Receipt, 
  Send, 
  Share2, 
  Check, 
  UserPlus, 
  AlertCircle, 
  Calendar, 
  CheckSquare, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import { t, Language } from '../../lang';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_SUPPLIERS, 
  INITIAL_EMPLOYEES, 
  INITIAL_CAMPAIGNS, 
  INITIAL_EXPIRY_STOCKS 
} from './mockData';

interface AdvancedSaaSModulesProps {
  products: Product[];
  onUpdateProducts: (updated: Product[]) => void;
  invoices: Invoice[];
  onUpdateInvoices: (updated: Invoice[]) => void;
  lang: Language;
  onToggleLang: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedSaaSModules: React.FC<AdvancedSaaSModulesProps> = ({
  products,
  onUpdateProducts,
  invoices,
  onUpdateInvoices,
  lang,
  onToggleLang,
  isOpen,
  onClose
}) => {
  // --- Backing SaaS Data States ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [expiryStocks, setExpiryStocks] = useState<ExpiryStock[]>([]);

  // --- Sub-Tab Selection ---
  type SaaSSection = 'CUSTOMERS' | 'UDHAAR' | 'SUPPLIERS' | 'FORECAST' | 'EMPLOYEES' | 'MARKETING' | 'SMART_INV';
  const [activeSec, setActiveSec] = useState<SaaSSection>('CUSTOMERS');

  // --- Local Search Term ---
  const [saasSearch, setSaasSearch] = useState('');

  // --- Modal Helpers ---
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showAddExpiry, setShowAddExpiry] = useState(false);

  // --- Form States Customer ---
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustLimit, setNewCustLimit] = useState(5000);

  // --- Form States Supplier ---
  const [newSuppName, setNewSuppName] = useState('');
  const [newSuppMobile, setNewSuppMobile] = useState('');
  const [newSuppCompany, setNewSuppCompany] = useState('');

  // --- Form States Employee ---
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Billing Cashier');
  const [newEmpMobile, setNewEmpMobile] = useState('');

  // --- Form States Campaign ---
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampCode, setNewCampCode] = useState('');
  const [newCampType, setNewCampType] = useState<'Discount' | 'BOGO' | 'Points'>('Discount');
  const [newCampValue, setNewCampValue] = useState(10);
  const [newCampMin, setNewCampMin] = useState(500);

  // --- Udhaar actions ---
  const [activeCustForUdhaar, setActiveCustForUdhaar] = useState<Customer | null>(null);
  const [udhaarAmount, setUdhaarAmount] = useState<number>(0);
  const [udhaarDesc, setUdhaarDesc] = useState('');
  const [udhaarType, setUdhaarType] = useState<'credit' | 'payment'>('credit');

  // --- Purchase Order actions ---
  const [activeSuppForPO, setActiveSuppForPO] = useState<Supplier | null>(null);
  const [poItems, setPoItems] = useState<{ sku: string; quantity: number }[]>([]);

  // --- Expiry Management ---
  const [newExpSku, setNewExpSku] = useState('');
  const [newExpDays, setNewExpDays] = useState(30);
  const [newExpBatch, setNewExpBatch] = useState('BTCH-401');
  const [newExpQty, setNewExpQty] = useState(10);

  // --- Barcode Trigger State ---
  const [activeBarcodeSku, setActiveBarcodeSku] = useState<string | null>(null);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);

  // Load from Storage
  useEffect(() => {
    const storCust = localStorage.getItem('smartkirana_saas_customers');
    const storSupp = localStorage.getItem('smartkirana_saas_suppliers');
    const storEmp = localStorage.getItem('smartkirana_saas_employees');
    const storCamp = localStorage.getItem('smartkirana_saas_campaigns');
    const storExp = localStorage.getItem('smartkirana_saas_expiry');

    if (storCust) setCustomers(JSON.parse(storCust));
    else setCustomers(INITIAL_CUSTOMERS);

    if (storSupp) setSuppliers(JSON.parse(storSupp));
    else setSuppliers(INITIAL_SUPPLIERS);

    if (storEmp) setEmployees(JSON.parse(storEmp));
    else setEmployees(INITIAL_EMPLOYEES);

    if (storCamp) setCampaigns(JSON.parse(storCamp));
    else setCampaigns(INITIAL_CAMPAIGNS);

    if (storExp) setExpiryStocks(JSON.parse(storExp));
    else setExpiryStocks(INITIAL_EXPIRY_STOCKS);
  }, []);

  // Save to Storage helper functions
  const saveCustomers = (updated: Customer[]) => {
    setCustomers(updated);
    localStorage.setItem('smartkirana_saas_customers', JSON.stringify(updated));
  };

  const saveSuppliers = (updated: Supplier[]) => {
    setSuppliers(updated);
    localStorage.setItem('smartkirana_saas_suppliers', JSON.stringify(updated));
  };

  const saveEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    localStorage.setItem('smartkirana_saas_employees', JSON.stringify(updated));
  };

  const saveCampaigns = (updated: MarketingCampaign[]) => {
    setCampaigns(updated);
    localStorage.setItem('smartkirana_saas_campaigns', JSON.stringify(updated));
  };

  const saveExpiry = (updated: ExpiryStock[]) => {
    setExpiryStocks(updated);
    localStorage.setItem('smartkirana_saas_expiry', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  // ================= CRUDS & LOGIC =================

  // Add Customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustMobile) return;
    const isDup = customers.some(c => c.mobile === newCustMobile);
    if (isDup) {
      alert("Customer with this mobile already exists!");
      return;
    }
    const cap: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: newCustName,
      mobile: newCustMobile,
      loyaltyPoints: 10, // 10 sign up welcome points
      outstandingBalance: 0,
      creditLimit: newCustLimit,
      udhaarHistory: []
    };
    saveCustomers([...customers, cap]);
    setNewCustName('');
    setNewCustMobile('');
    setNewCustLimit(5000);
    setShowAddCustomer(false);
  };

  // Add Supplier
  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuppName || !newSuppMobile || !newSuppCompany) return;
    const sap: Supplier = {
      id: `SUPP-00${suppliers.length + 1}`,
      name: newSuppName,
      mobile: newSuppMobile,
      company: newSuppCompany,
      outstanding: 0,
      purchaseOrders: []
    };
    saveSuppliers([...suppliers, sap]);
    setNewSuppName('');
    setNewSuppMobile('');
    setNewSuppCompany('');
    setShowAddSupplier(false);
  };

  // Add Employee
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpMobile) return;
    const eap: Employee = {
      id: `EMP-00${employees.length + 1}`,
      name: newEmpName,
      role: newEmpRole,
      mobile: newEmpMobile,
      salesContribution: 0,
      attendance: {}
    };
    saveEmployees([...employees, eap]);
    setNewEmpName('');
    setNewEmpMobile('');
    setShowAddEmployee(false);
  };

  // Toggle Employee Attendance (June 3, 2026)
  const toggleAttendance = (empId: string, day: string = "2026-06-03") => {
    const updated = employees.map(emp => {
      if (emp.id === empId) {
        const current = emp.attendance[day] || 'Absent';
        const next = current === 'Present' ? 'Absent' : 'Present';
        return {
          ...emp,
          attendance: { ...emp.attendance, [day]: next }
        };
      }
      return emp;
    });
    saveEmployees(updated);
  };

  // Add Campaign Offer
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || !newCampCode) return;
    const cap: MarketingCampaign = {
      id: `CAMP-00${campaigns.length + 1}`,
      title: newCampTitle,
      code: newCampCode.toUpperCase(),
      type: newCampType,
      value: newCampValue,
      minBillAmount: newCampMin,
      status: 'Active'
    };
    saveCampaigns([...campaigns, cap]);
    setNewCampTitle('');
    setNewCampCode('');
    setNewCampValue(10);
    setNewCampMin(500);
    setShowAddCampaign(false);
  };

  // Campaign Status toggle
  const toggleCampaignStatus = (id: string) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' as const };
      }
      return c;
    });
    saveCampaigns(updated);
  };

  // Expiry Stock Discard item
  const discardExpiryItem = (sku: string, batchNo: string) => {
    const updated = expiryStocks.map(exp => {
      if (exp.sku === sku && exp.batchNo === batchNo) {
        return { ...exp, discarded: true };
      }
      return exp;
    });
    saveExpiry(updated);
    // reduce actual product stock to 0 or remove quantity
    const targetExp = expiryStocks.find(e => e.sku === sku && e.batchNo === batchNo);
    if (targetExp) {
      const remainingProducts = products.map(p => {
        if (p.sku === sku) {
          return { ...p, stock: Math.max(0, p.stock - targetExp.quantity) };
        }
        return p;
      });
      onUpdateProducts(remainingProducts);
    }
  };

  // Smart Expiry Add
  const handleAddExpiryRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.sku === newExpSku);
    if (!prod) return;

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + newExpDays);
    const dateString = expDate.toISOString().split('T')[0];

    const exp: ExpiryStock = {
      sku: newExpSku,
      name: prod.name,
      expiryDate: dateString,
      batchNo: newExpBatch,
      quantity: newExpQty,
      discarded: false
    };

    saveExpiry([...expiryStocks, exp]);
    setNewExpSku('');
    setNewExpQty(10);
    setNewExpBatch(`BTCH-${Math.floor(Math.random() * 900) + 100}`);
    setShowAddExpiry(false);
  };

  // Udhaar Settle Transaction execution
  const processUdhaarAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustForUdhaar || udhaarAmount <= 0) return;

    const diff = udhaarType === 'credit' ? udhaarAmount : -udhaarAmount;
    // Check points reward (1 point per ₹10 spent/credit partial)
    const extraPoints = udhaarType === 'credit' ? Math.floor(udhaarAmount * 0.1) : 0;

    const updated = customers.map(c => {
      if (c.id === activeCustForUdhaar.id) {
        const nextBalance = Math.max(0, c.outstandingBalance + diff);
        const trans: UdhaarTransaction = {
          id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
          amount: udhaarAmount,
          type: udhaarType,
          date: new Date().toISOString().split('T')[0],
          description: udhaarDesc || (udhaarType === 'credit' ? "Credit Added (Udhaar)" : "Credit Payment received")
        };
        return {
          ...c,
          outstandingBalance: nextBalance,
          loyaltyPoints: c.loyaltyPoints + extraPoints,
          udhaarHistory: [trans, ...c.udhaarHistory]
        };
      }
      return c;
    });

    saveCustomers(updated);
    setUdhaarAmount(0);
    setUdhaarDesc('');
    setActiveCustForUdhaar(null);
  };

  // Purchase Order generation
  const createPurchaseOrder = (supplierId: string) => {
    const supp = suppliers.find(s => s.id === supplierId);
    if (!supp) return;

    // Filter products supplied by this supplier
    const suppProducts = products.filter(p => p.supplier === supp.name || p.supplier === supp.company);
    const orderItems: PurchaseOrderItem[] = suppProducts
      .filter(p => p.stock <= p.lowStockThreshold)
      .map(p => ({
        sku: p.sku,
        name: p.name,
        quantity: Math.max(10, p.lowStockThreshold * 2 - p.stock), // standard restock formula
        price: p.costPrice // buy price
      }));

    if (orderItems.length === 0 && suppProducts.length > 0) {
      // purchase order of best-sellers or placeholder items to fill up
      orderItems.push({
        sku: suppProducts[0].sku,
        name: suppProducts[0].name,
        quantity: 20,
        price: suppProducts[0].costPrice
      });
    }

    if (orderItems.length === 0) {
      alert("No matched catalog products for this supplier. Please add supplied items first!");
      return;
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const po: PurchaseOrder = {
      id: `PO-2026-00${supp.purchaseOrders.length + 3}`,
      supplierId: supp.id,
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      total,
      status: 'Pending'
    };

    const updated = suppliers.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          purchaseOrders: [po, ...s.purchaseOrders]
        };
      }
      return s;
    });

    saveSuppliers(updated);
    alert(`Success! Generated PO draft ${po.id} worth ₹${total} sent to ${supp.name}`);
  };

  // Settle PO and mark "Received", which inflates the inventory stock!
  const receivePurchaseOrder = (supplierId: string, poId: string) => {
    const supp = suppliers.find(s => s.id === supplierId);
    if (!supp) return;

    const targetPO = supp.purchaseOrders.find(p => p.id === poId);
    if (!targetPO || targetPO.status === 'Received') return;

    // Inflate product stock volumes
    const updatedProducts = products.map(prod => {
      const matchItem = targetPO.items.find(it => it.sku === prod.sku);
      if (matchItem) {
        return { ...prod, stock: prod.stock + matchItem.quantity };
      }
      return prod;
    });
    onUpdateProducts(updatedProducts);

    // Update PO status
    const updatedSuppliers = suppliers.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          outstanding: s.outstanding + targetPO.total,
          purchaseOrders: s.purchaseOrders.map(p => {
            if (p.id === poId) return { ...p, status: 'Received' as const };
            return p;
          })
        };
      }
      return s;
    });

    saveSuppliers(updatedSuppliers);
    alert(`Received order ${poId}! Inventory levels have been increased automatically.`);
  };

  // Pay Supplier outstanding
  const paySupplierSettle = (suppId: string, paymentAmt: number) => {
    if (paymentAmt <= 0) return;
    const supp = suppliers.find(s => s.id === suppId);
    if (!supp || supp.outstanding <= 0) return;

    const actualPay = Math.min(paymentAmt, supp.outstanding);
    const updated = suppliers.map(s => {
      if (s.id === suppId) {
        return {
          ...s,
          outstanding: s.outstanding - actualPay
        };
      }
      return s;
    });
    saveSuppliers(updated);
    alert(`Recorded payment of ₹${actualPay} to ${supp.name}. Remaining dues: ₹${supp.outstanding - actualPay}`);
  };

  // --- COMPUTE INTELLIGENT FORECASTING / DEMAND PREDICTIONS ---
  const handleAIInsightsCalculation = () => {
    // Basic linear analysis of historical invoice dates
    const dailyAverage = invoices.length > 0 
      ? invoices.reduce((sum, inv) => sum + inv.total, 0) / 8 
      : 1200;

    // Demand probability formulas
    const forecastingList = products.map(p => {
      // calculate sold count
      let soldCount = 0;
      invoices.forEach(inv => {
        inv.items.forEach(it => {
          if (it.sku === p.sku) soldCount += it.quantity;
        });
      });

      const velocity = soldCount / 8; // items per day
      const daysLeft = velocity > 0 ? (p.stock / velocity) : 999;
      
      let priority: 'HIGH' | 'MED' | 'LOW' = 'LOW';
      let recommendation = "Stock safe";

      if (daysLeft < 3 || p.stock === 0) {
        priority = 'HIGH';
        recommendation = `Critically low! Order ${p.lowStockThreshold * 2} units from ${p.supplier}`;
      } else if (daysLeft < 7) {
        priority = 'MED';
        recommendation = `Near-term depletion risk. Recommend order in 48h`;
      }

      return {
        sku: p.sku,
        name: p.name,
        stock: p.stock,
        soldCount,
        daysLeft: daysLeft === 999 ? '∞' : Math.round(daysLeft),
        priority,
        recommendation,
        supplier: p.supplier
      };
    });

    const highPriorityCount = forecastingList.filter(f => f.priority === 'HIGH').length;

    return {
      dailyAverage,
      tomorrowPrediction: dailyAverage * 1.14, // positive coefficient based on footfalls
      sevenDayRevenuePrediction: dailyAverage * 7.45,
      forecastingList: forecastingList.sort((a,b) => {
        if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
        if (a.priority === 'MED' && b.priority === 'LOW') return -1;
        return 1;
      }),
      highPriorityCount
    };
  };

  const aiStats = handleAIInsightsCalculation();

  // Draw simulated Barcode
  const drawBarcodeLines = (sku: string) => {
    // return visual bars of varying widths
    const charCodeSum = sku.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const barsCount = 20;
    const bars = [];
    for (let i = 0; i < barsCount; i++) {
       // deterministic height and width based on sku characters
       const width = ((charCodeSum + i * 7) % 4) + 1; 
       const isGap = (charCodeSum + i * 3) % 2 === 0 && i !== 0 && i !== barsCount - 1;
       bars.push({ width, isGap });
    }
    return (
      <div className="flex h-12 bg-white px-3 py-1 items-stretch justify-center select-none border border-slate-100 rounded-md">
        {bars.map((b, idx) => (
          <div 
            key={idx} 
            className={`w-[2px] ${b.isGap ? 'bg-transparent' : 'bg-black'}`} 
            style={{ width: `${b.width * 1.5}px` }}
          />
        ))}
      </div>
    );
  };

  // Settle filter searches
  const filteredCust = customers.filter(c => {
    if (!saasSearch) return true;
    const t = saasSearch.toLowerCase();
    return c.name.toLowerCase().includes(t) || c.mobile.includes(t);
  });

  const filteredSupp = suppliers.filter(s => {
    if (!saasSearch) return true;
    const t = saasSearch.toLowerCase();
    return s.name.toLowerCase().includes(t) || s.company.toLowerCase().includes(t) || s.mobile.includes(t);
  });

  const filteredEmp = employees.filter(e => {
    if (!saasSearch) return true;
    const t = saasSearch.toLowerCase();
    return e.name.toLowerCase().includes(t) || e.role.toLowerCase().includes(t);
  });

  // Calculate global summary counts
  const totalUdhaarOutstanding = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const totalSupplierOutstanding = suppliers.reduce((sum, s) => sum + s.outstanding, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-2 animate-fade-in select-none">
      <div className="w-full max-w-lg h-[92vh] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-150 dark:border-slate-800">
        
        {/* Header Block with Language switcher and Settle details */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-850 text-white px-4 pt-4 pb-3 flex flex-col shrink-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full border border-white/10 uppercase tracking-widest font-bold flex items-center gap-1">
              <Sparkles size={10} className="text-amber-400 animate-spin" />
              Kirana SaaS Admin Engine
            </span>
            <div className="flex gap-2.5 items-center">
              <button 
                onClick={onToggleLang}
                className="text-[9px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg border border-white/15 cursor-pointer"
                title="Switch Language (English / Hindi)"
              >
                {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
              </button>
              <button 
                onClick={onClose}
                className="text-white hover:text-red-200 text-xs font-black bg-black/20 hover:bg-black/40 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div className="flex justify-between items-end mt-2">
            <div>
              <h2 className="text-md font-black tracking-tight">{lang === 'en' ? 'Enterprise CRM & Ledger Hub' : 'उधार एवं बहीखाता एडमिन पैनल'}</h2>
              <p className="text-[9px] text-slate-200/80 mt-0.5">Shopify & Vyapar Enterprise Dashboard Engine • v2026.1</p>
            </div>
            
            <div className="text-right flex gap-3">
              <div className="bg-black/15 px-2.5 py-1 rounded-xl border border-white/5 text-center shadow-inner">
                <p className="text-[8px] uppercase tracking-wider text-slate-350 font-bold">{t('outstanding', lang).slice(0, 11)}</p>
                <p className="text-[11px] font-black text-rose-300">₹{totalUdhaarOutstanding}</p>
              </div>
              <div className="bg-black/15 px-2.5 py-1 rounded-xl border border-white/5 text-center shadow-inner">
                <p className="text-[8px] uppercase tracking-wider text-slate-350 font-bold">We Owe Supply</p>
                <p className="text-[11px] font-black text-blue-200 font-mono">₹{totalSupplierOutstanding}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection Buttons Scroller */}
        <div className="flex bg-slate-100 dark:bg-slate-900 overflow-x-auto min-h-[44px] shrink-0 border-b border-slate-200 dark:border-slate-800/80 p-1 gap-1 items-center scrollbar-none">
          {[
            { id: 'CUSTOMERS', icon: <Users size={12} />, label: t('customers', lang) },
            { id: 'UDHAAR', icon: <BookOpen size={12} />, label: t('udhaar_book', lang) },
            { id: 'SUPPLIERS', icon: <Layers size={12} />, label: t('suppliers', lang) },
            { id: 'SMART_INV', icon: <BadgeAlert size={12} />, label: 'Tag & Expiry' },
            { id: 'FORECAST', icon: <TrendingUp size={12} />, label: t('insights', lang) },
            { id: 'MARKETING', icon: <Percent size={12} />, label: t('marketing', lang) },
            { id: 'EMPLOYEES', icon: <Briefcase size={12} />, label: t('employees', lang) }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSec(tab.id as SaaSSection);
                setSaasSearch('');
              }}
              className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeSec === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search bar inside SaaS Hub */}
        {['CUSTOMERS', 'UDHAAR', 'SUPPLIERS', 'EMPLOYEES'].includes(activeSec) && (
          <div className="px-3 pt-2 pb-1 shrink-0 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                placeholder={`${saasSearch ? saasSearch : 'Search catalog names, companies, phone logs...'}`}
                value={saasSearch}
                onChange={(e) => setSaasSearch(e.target.value)}
                className="w-full text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-8 pr-12 py-1.5 rounded-xl text-slate-800 dark:text-white outline-none"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400">
                <Search size={12} />
              </span>
              {saasSearch && (
                <button onClick={() => setSaasSearch('')} className="absolute right-2.5 top-2 text-slate-400 text-xs hover:text-black">✕</button>
              )}
            </div>
          </div>
        )}

        {/* CORE SCROLLABLE PORTAL WORKSPACE */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50 dark:bg-slate-900/20 scrollbar-thin">
          
          {/* ================= 1. CUSTOMERS SUB-TAB ================= */}
          {activeSec === 'CUSTOMERS' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{t('customers', lang)} ({filteredCust.length})</h3>
                  <p className="text-[10px] text-slate-400">Manage Loyalty points system & credit limits</p>
                </div>
                <button
                  onClick={() => setShowAddCustomer(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus size={12} />
                  <span>New Customer</span>
                </button>
              </div>

              {/* Customer addition toggle screen */}
              {showAddCustomer && (
                <form onSubmit={handleCreateCustomer} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 mb-2.5 animate-fade-in shadow-md">
                  <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Configure New Customer profile</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Customer Name</label>
                      <input 
                        type="text" required placeholder="e.g. Ramesh" 
                        value={newCustName} onChange={(e) => setNewCustName(e.target.value)}
                        className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Mobile No</label>
                      <input 
                        type="tel" required maxLength={10} placeholder="9911..."
                        value={newCustMobile} onChange={(e) => setNewCustMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase">Credit Trust Limit (₹)</label>
                    <input 
                      type="number" min={500} max={25000} step={500}
                      value={newCustLimit} onChange={(e) => setNewCustLimit(parseInt(e.target.value) || 5000)}
                      className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowAddCustomer(false)} className="text-[9px] font-bold uppercase text-slate-400 px-3 py-1 bg-slate-100 rounded-md">Cancel</button>
                    <button type="submit" className="text-[9px] font-bold uppercase bg-blue-600 text-white px-3 py-1 rounded-md">Add Account</button>
                  </div>
                </form>
              )}

              {filteredCust.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500 font-bold">No customer accounts match search</p>
                </div>
              ) : (
                filteredCust.map(cust => (
                  <div key={cust.id} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-800 dark:text-white">{cust.name}</h4>
                          <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded-md font-mono">{cust.id}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone size={10} /> +91 {cust.mobile}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-black border border-amber-100 dark:border-amber-900/30">
                          🌟 {cust.loyaltyPoints} points
                        </span>
                        <p className="text-[8px] text-slate-400 mt-1">Outstanding: ₹{cust.outstandingBalance} / ₹{cust.creditLimit}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-800/60 pt-2.5 mt-2.5">
                      <div className="text-[9px] text-slate-400">
                        Total Udhaar Bills: <span className="font-bold text-slate-650">{cust.udhaarHistory.length} ledger logs</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setActiveCustForUdhaar(cust);
                          setActiveSec('UDHAAR');
                        }}
                        className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md cursor-pointer flex items-center gap-1"
                      >
                        <BookOpen size={10} />
                        <span>Manage Ledger</span>
                      </button>
                    </div>

                  </div>
                ))
              )}

            </div>
          )}

          {/* ================= 2. UDHAAR BOOK (KHATABOOK) ================= */}
          {activeSec === 'UDHAAR' && (
            <div className="space-y-3">
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{t('udhaar_book', lang)} Ledger</h3>
                  <p className="text-[10px] text-slate-404">Track credit balance outstanding & send reminder alerts</p>
                </div>
              </div>

              {/* Udhaar ledger adjust form */}
              {activeCustForUdhaar && (
                <form onSubmit={processUdhaarAdjustment} className="bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-850 p-3 rounded-xl border border-blue-150 space-y-2.5 animate-fade-in">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-blue-700">
                    <span>Ledger adjustment: {activeCustForUdhaar.name}</span>
                    <button type="button" onClick={() => setActiveCustForUdhaar(null)} className="text-slate-400 font-extrabold">✕ Cancel</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Adjustment Type</label>
                      <select 
                        value={udhaarType} onChange={(e) => setUdhaarType(e.target.value as 'credit' | 'payment')}
                        className="w-full text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-lg text-slate-805"
                      >
                        <option value="credit">Add Udhaar (Credit)</option>
                        <option value="payment">Receive Settle (Payment)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Transaction Amount (₹)</label>
                      <input 
                        type="number" required min={1} max={activeCustForUdhaar.creditLimit}
                        value={udhaarAmount || ''} onChange={(e) => setUdhaarAmount(parseInt(e.target.value) || 0)}
                        className="w-full text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-lg text-slate-805 text-left font-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase">Short description / details (Optional)</label>
                    <input 
                      type="text" placeholder="e.g. Month rations, atta pack, tea..."
                      value={udhaarDesc} onChange={(e) => setUdhaarDesc(e.target.value)}
                      className="w-full text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-lg text-slate-805 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] py-2 rounded-xl"
                  >
                    Post Ledger Entry
                  </button>
                </form>
              )}

              {customers.filter(c => c.outstandingBalance > 0 || c.udhaarHistory.length > 0).length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400">All customers outstanding cleared!</p>
                  <p className="text-[10px] text-slate-500 mt-1">Tap CRM tab above to give credit to any customer.</p>
                </div>
              ) : (
                customers
                  .filter(c => c.outstandingBalance > 0 || c.udhaarHistory.length > 0)
                  .map(c => {
                    const progressVal = Math.min(100, Math.round((c.outstandingBalance / c.creditLimit) * 100));
                    
                    // Reminders templates
                    const templateMsg = `Hi ${c.name}, deep thanks for shopping at Apna Kirana. A friendly reminder of your outstanding Udhaar balance of ₹${c.outstandingBalance}. Please clear it online or at checkout. Have a great day!`;
                    const whatsappLink = `https://wa.me/91${c.mobile}?text=${encodeURIComponent(templateMsg)}`;

                    return (
                      <div key={c.id} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">{c.name}</h4>
                            <p className="text-[9px] text-slate-400">+91 {c.mobile}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-rose-500 font-mono">₹{c.outstandingBalance}</span>
                            <p className="text-[8px] text-slate-400">Limit: ₹{c.creditLimit}</p>
                          </div>
                        </div>

                        {/* Credit limit visual loader */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[8px] text-slate-400 uppercase font-bold">
                            <span>Limit safety utilization</span>
                            <span>{progressVal}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${progressVal > 80 ? 'bg-rose-500' : progressVal > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${progressVal}%` }}
                            />
                          </div>
                        </div>

                        {/* Actions block: Reminds & ledger additions */}
                        <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-1">
                          
                          <a 
                            href={whatsappLink} target="_blank" rel="noreferrer"
                            className="text-[9px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare size={11} />
                            <span>WhatsApp Remind</span>
                          </a>

                          <button 
                            onClick={() => setActiveCustForUdhaar(c)}
                            className="text-[9px] font-black text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={11} />
                            <span>Adjust Ledger</span>
                          </button>
                        </div>

                        {/* Expanded mini-bills history log */}
                        {c.udhaarHistory.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-lg text-[9px] font-semibold text-slate-600 dark:text-slate-400 space-y-1">
                            <p className="font-bold text-[8.5px] uppercase text-slate-400">Ledger Statement:</p>
                            {c.udhaarHistory.slice(0, 2).map((h, i) => (
                              <div key={i} className="flex justify-between">
                                <span className={h.type === 'credit' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                  {h.type === 'credit' ? '← Credit given' : '→ Settle payment'} ({h.date})
                                </span>
                                <span className="font-mono">₹{h.amount}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })
              )}

            </div>
          )}

          {/* ================= 3. SUPPLIER HUB & ORDERS ================= */}
          {activeSec === 'SUPPLIERS' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{t('supplier_orders', lang)}</h3>
                  <p className="text-[10px] text-slate-400">Trigger standard PO restocks & manage accounts payable</p>
                </div>
                <button
                  onClick={() => setShowAddSupplier(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>New Supplier</span>
                </button>
              </div>

              {showAddSupplier && (
                <form onSubmit={handleCreateSupplier} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 animate-fade-in shadow-md">
                  <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Configure New Supplier</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Contact Name</label>
                      <input 
                        type="text" required placeholder="e.g. Ramesh Goel" 
                        value={newSuppName} onChange={(e) => setNewSuppName(e.target.value)}
                        className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Mobile No</label>
                      <input 
                        type="tel" required maxLength={10} placeholder="9811..."
                        value={newSuppMobile} onChange={(e) => setNewSuppMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase">Company/Business Name</label>
                    <input 
                      type="text" required placeholder="e.g. ITC Distributors"
                      value={newSuppCompany} onChange={(e) => setNewSuppCompany(e.target.value)}
                      className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowAddSupplier(false)} className="text-[9px] font-bold uppercase text-slate-400 px-3 py-1 bg-slate-100 rounded-md">Cancel</button>
                    <button type="submit" className="text-[9px] font-bold uppercase bg-blue-600 text-white px-3 py-1 rounded-md">Save Supplier</button>
                  </div>
                </form>
              )}

              {filteredSupp.map((supp) => (
                <div key={supp.id} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white">{supp.company}</h4>
                      <p className="text-[9px] text-slate-400">👤 {supp.name} • Mob: +91 {supp.mobile}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 px-2 py-0.5 rounded-md">
                        Dues We Owe: ₹{supp.outstanding}
                      </span>
                    </div>
                  </div>

                  {/* Purchase Orders summaries */}
                  {supp.purchaseOrders.length > 0 && (
                    <div className="space-y-1 bg-slate-100/60 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-2 rounded-lg text-[9px] font-semibold text-slate-650 dark:text-slate-400">
                      <p className="font-extrabold text-[8px] text-slate-400 uppercase tracking-wide">Purchase Orders:</p>
                      {supp.purchaseOrders.map((po, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-white dark:border-slate-800 last:border-b-0">
                          <div>
                            <span className="font-bold text-slate-700 dark:text-slate-350">{po.id}</span> • ₹{po.total} ({po.date})
                          </div>
                          {po.status === 'Pending' ? (
                            <button
                              onClick={() => receivePurchaseOrder(supp.id, po.id)}
                              className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded-md cursor-pointer animate-pulse"
                            >
                              Receive Order
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">✓ Received</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Settle pay actions & Generate restock order drafts */}
                  <div className="flex gap-2 justify-end pt-1">
                    {supp.outstanding > 0 && (
                      <button
                        onClick={() => {
                          const val = parseInt(prompt(`Enter cash payment value to settle ${supp.company} (Max ₹${supp.outstanding}):`) || '');
                          if (val > 0) paySupplierSettle(supp.id, val);
                        }}
                        className="text-[9px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/25 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Settle Dues
                      </button>
                    )}
                    <button
                      onClick={() => createPurchaseOrder(supp.id)}
                      className="text-[9px] font-black text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={11} />
                      <span>One-Tap PO Draft</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= 4. INTEL FORECAST & DEMAND ================= */}
          {activeSec === 'FORECAST' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-3 rounded-2xl border border-indigo-850 space-y-2">
                <h4 className="text-[10px] font-bold tracking-widest text-indigo-305 uppercase flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={12} className="text-amber-300" />
                  Gemini-Integrated Business Forecasting
                </h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white/10 p-2 rounded-xl border border-white/5">
                    <p className="text-[8px] text-indigo-200 font-bold uppercase tracking-wide">Avg Daily Bill volume</p>
                    <p className="text-sm font-black font-mono">₹{Math.round(aiStats.dailyAverage)}</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl border border-white/5">
                    <p className="text-[8px] text-indigo-200 font-bold uppercase tracking-wide">Tomorrow's Prediction</p>
                    <p className="text-sm font-black text-amber-300 font-mono">₹{Math.round(aiStats.tomorrowPrediction)}</p>
                  </div>
                </div>
                <p className="text-[9.5px] leading-relaxed text-indigo-150">
                  ⚡ <strong>SaaS Analysis:</strong> Weekly sales trend shows high 14% increment coefficient tomorrow due to active Monsoon promotion and high milk purchase frequency.
                </p>
              </div>

              {/* Demand Forecasting table list */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-800 dark:text-white">Active Product Depletion Runout forecasts</h4>
                  <span className="text-[8px] text-indigo-600 dark:text-indigo-400 font-bold">Updated real-time</span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {aiStats.forecastingList.slice(0, 8).map((f, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-xs">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{f.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          Velocity: {f.soldCount > 0 ? `${(f.soldCount/8).toFixed(1)}/day` : 'Quiet'} • Stock: {f.stock} • Runout: <span className="font-black text-slate-700 dark:text-slate-350">{f.daysLeft} days</span>
                        </p>
                        <p className="text-[8px] text-indigo-600 dark:text-indigo-400 font-semibold">{f.recommendation}</p>
                      </div>

                      <div className="shrink-0">
                        {f.priority === 'HIGH' ? (
                          <span className="text-[8px] font-black bg-rose-500 text-white px-2 py-1 rounded-md animate-pulse">CRITICAL</span>
                        ) : f.priority === 'MED' ? (
                          <span className="text-[8px] font-black bg-amber-500 text-white px-2 py-1 rounded-md">WARNING</span>
                        ) : (
                          <span className="text-[8px] font-black bg-emerald-500 text-white px-2  py-1 rounded-md">SAFE</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= 5. EMPLOYEE DESK ================= */}
          {activeSec === 'EMPLOYEES' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{t('employees', lang)} Hub</h3>
                  <p className="text-[10px] text-slate-404">Check active cashier counters & daily attendance status</p>
                </div>
                <button
                  onClick={() => setShowAddEmployee(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add Employee</span>
                </button>
              </div>

              {showAddEmployee && (
                <form onSubmit={handleCreateEmployee} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 animate-fade-in shadow-md">
                  <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Configure Employee Profile</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Employee Name</label>
                      <input 
                        type="text" required placeholder="e.g. Ramesh" 
                        value={newEmpName} onChange={(e) => setNewEmpName(e.target.value)}
                        className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-805 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-405 uppercase">Mobile No</label>
                      <input 
                        type="tel" required maxLength={10} placeholder="9922..."
                        value={newEmpMobile} onChange={(e) => setNewEmpMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-805 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase">Store Assignment/Role</label>
                    <select
                      value={newEmpRole} onChange={(e) => setNewEmpRole(e.target.value)}
                      className="w-full text-xs p-1.5 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 outline-none"
                    >
                      <option value="Billing Cashier">Billing Cashier (काउंटर ऑपरेटर)</option>
                      <option value="Delivery & Stock Executive">Delivery & Stock Executive (डिलीवरी)</option>
                      <option value="Store Manager">Store Manager (मैनेजर)</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowAddEmployee(false)} className="text-[9px] font-bold uppercase text-slate-400 px-3 py-1 bg-slate-100 rounded-md">Cancel</button>
                    <button type="submit" className="text-[9px] font-bold uppercase bg-blue-600 text-white px-3 py-1 rounded-md">Add Employee</button>
                  </div>
                </form>
              )}

              {filteredEmp.map(emp => {
                const attendedToday = emp.attendance["2026-06-03"] === 'Present';
                
                return (
                  <div key={emp.id} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                        {emp.name}
                        <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 py-0.2 rounded-md font-bold">{emp.role}</span>
                      </h4>
                      <p className="text-[9px] text-slate-400 mt-1">Mob: +91 {emp.mobile} • Sales tracked: ₹{emp.id === 'EMP-001' ? '₹18,450' : '₹4,200'}</p>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <button
                        onClick={() => toggleAttendance(emp.id)}
                        className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                          attendedToday 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-200' 
                            : 'bg-rose-50 dark:bg-rose-955/20 text-rose-700 px-2 py-1 border border-rose-200'
                        }`}
                      >
                        {attendedToday ? '✓ Present' : '✕ Absent'}
                      </button>
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* ================= 6. MARKETING & OFFERS ================= */}
          {activeSec === 'MARKETING' && (
            <div className="space-y-3">
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{t('marketing_center', lang)}</h3>
                  <p className="text-[10px] text-slate-404">Activate shop discount coupons, WhatsApp templates list</p>
                </div>
                <button
                  onClick={() => setShowAddCampaign(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Launch Campaign</span>
                </button>
              </div>

              {showAddCampaign && (
                <form onSubmit={handleCreateCampaign} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-205 dark:border-slate-800 space-y-2.5 animate-fade-in shadow-md">
                  <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Configure Discount Code Campaign</h4>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase">Offer / Campaign Title</label>
                    <input 
                      type="text" required placeholder="e.g. Diwali Shubh flat discount"
                      value={newCampTitle} onChange={(e) => setNewCampTitle(e.target.value)}
                      className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Campaign Promo Code</label>
                      <input 
                        type="text" required placeholder="DIWALI50"
                        value={newCampCode} onChange={(e) => setNewCampCode(e.target.value)}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-808 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Discount Value (%, ₹, multiplier)</label>
                      <input 
                        type="number" required min={1} max={100}
                        value={newCampValue || ''} onChange={(e) => setNewCampValue(parseInt(e.target.value) || 0)}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-808 font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Campaign Type</label>
                      <select
                        value={newCampType} onChange={(e) => setNewCampType(e.target.value as 'Discount' | 'BOGO' | 'Points')}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-808"
                      >
                        <option value="Discount">Flat Discount (%)</option>
                        <option value="BOGO">BOGO Buy 1 Get 1</option>
                        <option value="Points">Loyalty Bonus Multiplier</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Min Bill limit (₹)</label>
                      <input 
                        type="number" min={100} step={100}
                        value={newCampMin} onChange={(e) => setNewCampMin(parseInt(e.target.value) || 500)}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-105 rounded-lg text-slate-808"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowAddCampaign(false)} className="text-[9px] font-bold uppercase text-slate-400 px-3 py-1 bg-slate-100 rounded-md">Cancel</button>
                    <button type="submit" className="text-[9px] font-bold uppercase bg-blue-600 text-white px-3 py-1 rounded-md">Launch Offer</button>
                  </div>
                </form>
              )}

              {campaigns.map(camp => (
                <div key={camp.id} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                      {camp.title}
                      <span className="text-[8.5px] bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 px-1.5 py-0.2 rounded-md font-bold font-mono">{camp.code}</span>
                    </h4>
                    <p className="text-[9px] text-slate-400 mt-1">
                      Type: {camp.type === 'Discount' ? `Flat ${camp.value}% off` : camp.type === 'Points' ? `${camp.value}x reward points multiplier` : `BOGO Free buy limit`} • Min Bill: ₹{camp.minBillAmount}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCampaignStatus(camp.id)}
                      className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        camp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {camp.status === 'Active' ? 'Active' : 'Paused'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Promo whatsapp message templates container */}
              <div className="bg-slate-100/50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-3 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Share2 size={12} />
                  WhatsApp Promotion Broadcast templates
                </p>
                <div className="p-2.5 bg-white dark:bg-slate-850 rounded-xl space-y-1.5 text-[10px] font-semibold text-slate-650 dark:text-slate-350 border border-slate-100">
                  <p className="font-bold text-blue-700">📣 Monsoon Blast Deal template:</p>
                  <p className="italic">"Greetings from ${t('welcome', lang)}! 🌧️ Defeat the monsoon blues with fresh grocery stock. Get FLAT 10% OFF on all bills above ₹1,000 using code MONSOON10! Drop-by now!"</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("Greetings from Apna Kirana! 🌧️ Defeat the monsoon blues with fresh grocery stock. Get FLAT 10% OFF on all bills above ₹1,000 using code MONSOON10! Drop-by now!");
                      alert("Monsoon template copied! Share directly via WhatsApp Broadcast list.");
                    }}
                    className="text-[8.5px] font-black uppercase text-indigo-650 hover:underline cursor-pointer"
                  >
                    Copy Broadcast Draft text
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= 7. SMART EXPIRY & BARCODES ================= */}
          {activeSec === 'SMART_INV' && (
            <div className="space-y-3">
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{t('expiry_tracking', lang)} & Barcodes</h3>
                  <p className="text-[10px] text-slate-404">Review product shelf lives, batch codes, generate Barcode graphics</p>
                </div>
                <button
                  onClick={() => setShowAddExpiry(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add Expiry Log</span>
                </button>
              </div>

              {showAddExpiry && (
                <form onSubmit={handleAddExpiryRecord} className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-205 dark:border-slate-800 space-y-2.5 animate-fade-in shadow-md">
                  <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Configure Expiry Log</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Select Product SKU</label>
                      <select
                        value={newExpSku} required onChange={(e) => setNewExpSku(e.target.value)}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-808"
                      >
                        <option value="">Choose item...</option>
                        {products.map(p => (
                          <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Expiry Cycle (Days from today)</label>
                      <input 
                        type="number" required min={3} max={365}
                        value={newExpDays} onChange={(e) => setNewExpDays(parseInt(e.target.value) || 30)}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-808 font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Batch Number</label>
                      <input 
                        type="text" required placeholder="BAT-901"
                        value={newExpBatch} onChange={(e) => setNewExpBatch(e.target.value)}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-808 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Tracked Qty</label>
                      <input 
                        type="number" required min={1}
                        value={newExpQty} onChange={(e) => setNewExpQty(parseInt(e.target.value) || 5)}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-808 font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowAddExpiry(false)} className="text-[9px] font-bold uppercase text-slate-400 px-3 py-1 bg-slate-100 rounded-md">Cancel</button>
                    <button type="submit" className="text-[9px] font-bold uppercase bg-blue-600 text-white px-3 py-1 rounded-md">Save Record</button>
                  </div>
                </form>
              )}

              {/* Expiry alerts listing */}
              <div className="space-y-2">
                {expiryStocks.slice(0, 5).map((exp, idx) => {
                  const daysLeft = Math.round((new Date(exp.expiryDate).getTime() - new Date("2026-06-03").getTime()) / (1000 * 3650 / 3.65 / 100));
                  const isExpired = daysLeft <= 0;
                  const isNear = daysLeft > 0 && daysLeft <= 10;

                  return (
                    <div key={idx} className={`p-2.5 rounded-xl border flex justify-between items-center ${
                      exp.discarded ? 'bg-slate-100/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60' :
                      isExpired ? 'bg-rose-50 border-rose-150 text-rose-800 dark:bg-rose-950/20' :
                      isNear ? 'bg-amber-50 border-amber-150 text-amber-800' : 'bg-white border-slate-150'
                    }`}>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{exp.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          Batch: {exp.batchNo} • Qty: {exp.quantity} units • Expiry: <span className="font-bold underline">{exp.expiryDate}</span>
                        </p>
                        {!exp.discarded && (
                          <p className="text-[8px] font-extrabold mt-0.5">
                            {isExpired ? '🚨 ALREADY EXPIRED!' : isNear ? `⏳ Expires in ${daysLeft} days!` : `✓ Safe for ${daysLeft} days`}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 flex gap-2">
                        {exp.discarded ? (
                          <span className="text-[8.5px] font-extrabold text-slate-450 italic">Discarded</span>
                        ) : (
                          <button
                            onClick={() => discardExpiryItem(exp.sku, exp.batchNo)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-black text-[8px] uppercase px-2 py-1 rounded-md cursor-pointer"
                          >
                            Discard
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Barcode representation drawer slider */}
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl p-3 bg-slate-50 dark:bg-slate-900 space-y-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Barcode size={12} />
                  SaaS Unified Barcode catalog rendering
                </p>                  
                
                <div className="grid grid-cols-2 gap-2">
                  {products.slice(0, 4).map(p => (
                    <div 
                      key={p.sku} 
                      onClick={() => setActiveBarcodeSku(p.sku)} 
                      className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 cursor-pointer text-center space-y-1.5 transition-all relative"
                    >
                      <h5 className="text-[9px] font-extrabold text-slate-700 dark:text-slate-200 truncate">{p.name}</h5>
                      {drawBarcodeLines(p.sku)}
                      <span className="text-[8px] font-bold font-mono text-slate-400 uppercase">SKU: {p.sku}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Dynamic bottom detail status showing total bills processed in applet */}
        <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 shrink-0 border-t border-slate-150 dark:border-slate-800/80 flex justify-between items-center text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info size={12} className="text-blue-500" />
            <span>Store: Suresh Patel Apna Kirana</span>
          </div>
          <span className="font-mono text-[9px]">Calculated: {invoices.length} historical invoices</span>
        </div>

      </div>
    </div>
  );
};
