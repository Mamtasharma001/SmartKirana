/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, Invoice } from '../types';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  IndianRupee, 
  ChevronRight, 
  PlusCircle, 
  ShoppingCart, 
  BarChart3, 
  ArrowUpRight,
  Target
} from 'lucide-react';

interface DashboardTabProps {
  products: Product[];
  invoices: Invoice[];
  onNavigateTab: (tab: 'DASHBOARD' | 'INVENTORY' | 'BILLING' | 'REPORTS' | 'PROFILE') => void;
  onOpenAddProduct: () => void;
  weeklySales: { day: string; sales: number }[];
  dailySalesTarget: number;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  products,
  invoices,
  onNavigateTab,
  onOpenAddProduct,
  weeklySales,
  dailySalesTarget
}) => {
  // 1. Calculate Summary Stats
  const todayDateStr = "2026-06-03"; // Mocked active date

  const todaySales = invoices
    .filter(inv => inv.date === todayDateStr)
    .reduce((sum, inv) => sum + inv.total, 0);

  const monthlyRevenue = invoices
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalProductsCount = products.length;

  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);
  const lowStockCount = lowStockItems.length;

  // 2. Calculate Top Products based on aggregate invoices
  const productSalesMap: { [sku: string]: { name: string; category: string; count: number; rev: number } } = {};
  invoices.forEach(inv => {
    inv.items.forEach(it => {
      if (!productSalesMap[it.sku]) {
        // Find category from existing products or fallback
        const original = products.find(p => p.sku === it.sku);
        productSalesMap[it.sku] = {
          name: it.name,
          category: original?.category || 'Snacks',
          count: 0,
          rev: 0
        };
      }
      productSalesMap[it.sku].count += it.quantity;
      productSalesMap[it.sku].rev += it.quantity * it.price;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // 3. Setup Custom SVG Line Chart coordinates with clean visual details
  const maxSales = Math.max(...weeklySales.map(d => d.sales), 1000);
  const chartHeight = 120;
  const chartWidth = 330;
  const paddingLeft = 32;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 20;

  const points = weeklySales.map((d, index) => {
    const x = paddingLeft + (index / (weeklySales.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = paddingTop + (1 - d.sales / maxSales) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, sales: d.sales, label: d.day.split(' ')[0] };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z` 
    : '';

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 overflow-y-auto pb-20 select-none">
      
      {/* Welcome Banner Row */}
      <div className="bg-blue-600 text-white px-5 pt-4 pb-14 rounded-b-[24px] shadow-sm flex justify-between items-center relative">
        <div className="absolute top-2 left-10 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
        <div>
          <span className="text-xs bg-blue-700 font-bold px-2.5 py-0.5 rounded-full text-blue-100 uppercase tracking-wider">
            Today Dashboard
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-1">Hello, Suresh Patel</h2>
          <p className="text-[11px] text-blue-100/80">Apna Kirana Store • GSTIN Active</p>
        </div>
        <div className="text-right">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center shadow-inner">
            <p className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">Today's Profit</p>
            <p className="text-sm font-black text-emerald-300">₹{(todaySales * 0.18).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area Grid (Negative margin offsets welcome banner) */}
      <div className="px-4 -mt-10 flex-col space-y-4">

        {/* Daily Target Progress Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Target size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-tight">Daily Target Tracker</h3>
                <p className="text-[10px] text-slate-400">Owner Goal Progress Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-800">
                ₹{todaySales.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </span>
              <span className="text-[9px] text-slate-400 block leading-tight">
                Goal: ₹{dailySalesTarget}
              </span>
            </div>
          </div>

          {/* Progress bar structure */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0">
              <span>{dailySalesTarget > 0 ? Math.min(100, Math.round((todaySales / dailySalesTarget) * 100)) : 0}% Completed</span>
              {(dailySalesTarget > 0 ? Math.min(100, Math.round((todaySales / dailySalesTarget) * 100)) : 0) >= 100 ? (
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Target Met!</span>
              ) : (
                <span>₹{Math.max(0, dailySalesTarget - todaySales).toLocaleString('en-IN')} Remaining</span>
              )}
            </div>
            
            {/* Real elegant micro-designed progress bar container */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/40">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${dailySalesTarget > 0 ? Math.min(100, Math.round((todaySales / dailySalesTarget) * 100)) : 0}%` }}
              >
                {/* Subtle light shimmer animation internally inside progress fill */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Dynamic footer summary description */}
          <p className="text-[11px] leading-snug text-slate-500 font-medium">
            {(dailySalesTarget > 0 ? Math.min(100, Math.round((todaySales / dailySalesTarget) * 100)) : 0) >= 100 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                🎉 Awesome! Apna Kirana Store has met today's ₹{dailySalesTarget} goal! Let's build some more bills.
              </span>
            ) : (dailySalesTarget > 0 ? Math.min(100, Math.round((todaySales / dailySalesTarget) * 100)) : 0) >= 75 ? (
              <span>
                🔥 <span className="font-bold text-slate-700 font-sans">Almost there!</span> Only ₹{Math.max(0, dailySalesTarget - todaySales)} left to hit today's Target of ₹{dailySalesTarget}. Excellent work!
              </span>
            ) : (
              <span>
                💡 Keep going Suresh Patel! Target is ₹{dailySalesTarget}, ₹{Math.max(0, dailySalesTarget - todaySales)} left. Tip: Check the Billing tab for express walk-ins.
              </span>
            )}
          </p>
        </div>

        {/* 1. Summary Cards Dashboard Grid */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Today's Sales Card */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-2">
              <IndianRupee size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Today's Sales</p>
              <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-0.5">₹{todaySales.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</h3>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1 bg-emerald-50 w-max px-1.5 py-0.5 rounded-full">
                <ArrowUpRight size={10} /> +12% vs y'day
              </span>
            </div>
          </div>

          {/* Monthly Sales Card */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-2">
              <TrendingUp size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Monthly Sales</p>
              <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-0.5">₹{monthlyRevenue.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</h3>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1 bg-emerald-50 w-max px-1.5 py-0.5 rounded-full">
                <ArrowUpRight size={10} /> Goal 85%
              </span>
            </div>
          </div>

          {/* Total Catalog Products Card */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-2">
              <Package size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Products</p>
              <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-0.5">{totalProductsCount} Items</h3>
              <span className="text-[9px] text-slate-500 font-medium block mt-1 hover:underline cursor-pointer" onClick={() => onNavigateTab('INVENTORY')}>
                Manage Catalog →
              </span>
            </div>
          </div>

          {/* Low Stock alerting count card */}
          <div className={`p-3.5 rounded-2xl border shadow-sm flex flex-col justify-between transition-colors ${
            lowStockCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-100'
          }`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl mb-2 ${
              lowStockCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-600'
            }`}>
              <AlertTriangle size={16} className={lowStockCount > 0 ? 'animate-bounce' : ''} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Low Stock</p>
              <h3 className={`text-md font-extrabold tracking-tight mt-0.5 ${
                lowStockCount > 0 ? 'text-amber-700' : 'text-slate-800'
              }`}>
                {lowStockCount} Products
              </h3>
              {lowStockCount > 0 ? (
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold mt-1 inline-block animate-pulse">
                  Requires Restock
                </span>
              ) : (
                <span className="text-[9px] text-slate-500 font-medium block mt-1">All stocks safe</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Quick Actions Section */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">Quick Counter Operations</h3>
          <div className="grid grid-cols-4 gap-2">
            
            <button 
              onClick={() => onNavigateTab("BILLING")}
              className="flex flex-col items-center p-2 rounded-xl bg-blue-50/50 hover:bg-blue-50 text-blue-700 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mb-1.5">
                <ShoppingCart size={18} className="text-blue-700" />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">Create Bill</span>
            </button>

            <button 
              onClick={onOpenAddProduct}
              className="flex flex-col items-center p-2 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-1.5">
                <PlusCircle size={18} className="text-emerald-700" />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">Add Product</span>
            </button>

            <button 
              onClick={() => onNavigateTab("INVENTORY")}
              className="flex flex-col items-center p-2 rounded-xl bg-purple-50/50 hover:bg-purple-50 text-purple-700 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center mb-1.5">
                <Package size={18} className="text-purple-700" />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">Inventory</span>
            </button>

            <button 
              onClick={() => onNavigateTab("REPORTS")}
              className="flex flex-col items-center p-2 rounded-xl bg-amber-50/50 hover:bg-amber-50 text-amber-700 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center mb-1.5">
                <BarChart3 size={18} className="text-amber-700" />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">View Charts</span>
            </button>

          </div>
        </div>

        {/* 3. Sales Overview Weekly Chart */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-2.5">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Weekly Sales Trend</h3>
              <p className="text-[10px] text-slate-400">Total volume sold past 8 days</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              7D Revenue Tracker
            </span>
          </div>

          {/* SVG Custom Rendered Line Graph with High Fidelity details */}
          <div className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28">
              {/* Grids */}
              <line x1={paddingLeft} y1={paddingTop} x2={chartWidth - paddingRight} y2={paddingTop} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3" />
              <line x1={paddingLeft} y1={chartHeight / 2} x2={chartWidth - paddingRight} y2={chartHeight / 2} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3" />
              <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} stroke="#CBD5E1" strokeWidth="1" />

              {/* Weekly Trend Line Shadow Area */}
              {areaPath && <path d={areaPath} fill="url(#blue-area-gradient)" opacity="0.15" />}

              {/* Core Line path */}
              <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data Node Points */}
              {points.map((p, index) => (
                <g key={index}>
                  <circle cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
                  <text x={p.x} y={chartHeight - 4} textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="bold">
                    {p.label}
                  </text>
                  {/* Values on Node Top */}
                  {index % 2 === 0 && (
                    <text x={p.x} y={p.y - 6} textAnchor="middle" fill="#334155" fontSize="8" fontWeight="bold">
                      ₹{Math.round(p.sales)}
                    </text>
                  )}
                </g>
              ))}

              {/* Defining Gradients */}
              <defs>
                <linearGradient id="blue-area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 4. Top Selling Products Section */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Top Selling Items</h3>
              <p className="text-[10px] text-slate-400">Products with highest volume sold</p>
            </div>
            <button 
              onClick={() => onNavigateTab("REPORTS")}
              className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center"
            >
              Full Analysis <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-2.5">
            {topProducts.map((p, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    index === 0 ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    index === 1 ? 'bg-slate-100 text-slate-600' :
                    index === 2 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 leading-tight">{p.name}</h4>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-md uppercase font-bold mt-0.5 inline-block">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-slate-800">{p.count} sold</p>
                  <p className="text-[9px] text-slate-400">Total ₹{p.rev}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Low Stock Alerts Row */}
        {lowStockCount > 0 && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-1.5 text-rose-800">
                <AlertTriangle size={15} className="animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider">Critical Stock Alerts ({lowStockCount})</h3>
              </div>
              <button 
                onClick={() => onNavigateTab("INVENTORY")}
                className="text-[10px] font-bold text-rose-700 underline"
              >
                Restock Items
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {lowStockItems.slice(0, 2).map((item, index) => (
                <div key={index} className="bg-white p-2 rounded-xl border border-rose-100 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 truncate leading-tight">{item.name}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">SKU: {item.sku}</p>
                  </div>
                  <div className="flex justify-between items-baseline mt-2 pt-1 border-t border-slate-50">
                    <span className="text-[9px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full font-bold">
                      Only {item.stock} left
                    </span>
                    <span className="text-[9px] text-slate-400 italic">Thres: {item.lowStockThreshold}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
