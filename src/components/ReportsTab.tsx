/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Invoice } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  Calendar, 
  ArrowUpRight, 
  Package, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { CATEGORY_SALES_SUMMARY, WEEKLY_SALES_DATA } from '../data';

interface ReportsTabProps {
  products: Product[];
  invoices: Invoice[];
  onNavigateTab: (tab: 'DASHBOARD' | 'INVENTORY' | 'BILLING' | 'REPORTS' | 'PROFILE') => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  products,
  invoices,
  onNavigateTab
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // 1. Calculate Core Revenue Metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalOrders = invoices.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const estimatedProfit = totalRevenue * 0.18; // Simple 18% grocery net profit margin standard

  // 2. Compute Product Sales Breakdown
  const productSaleStats: { [sku: string]: { name: string; category: string; units: number; revenue: number } } = {};
  
  // Fill from invoices
  invoices.forEach(inv => {
    inv.items.forEach(it => {
      if (!productSaleStats[it.sku]) {
        const prodMatch = products.find(p => p.sku === it.sku);
        productSaleStats[it.sku] = {
          name: it.name,
          category: prodMatch?.category || 'Grocery',
          units: 0,
          revenue: 0
        };
      }
      productSaleStats[it.sku].units += it.quantity;
      productSaleStats[it.sku].revenue += it.quantity * it.price;
    });
  });

  const productBreakdownList = Object.values(productSaleStats)
    .sort((a, b) => b.revenue - a.revenue) // Sort by revenue
    .slice(0, 5);

  // 3. Low Stock list
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  // 4. Custom Category Share calculation
  const categorySalesMap: { [cat: string]: number } = {
    'Grocery': 0,
    'Beverages': 0,
    'Snacks': 0,
    'Dairy': 0
  };

  invoices.forEach(inv => {
    inv.items.forEach(it => {
      const prodCategory = products.find(p => p.sku === it.sku)?.category || 'Snacks';
      categorySalesMap[prodCategory] = (categorySalesMap[prodCategory] || 0) + (it.quantity * it.price);
    });
  });

  const totalCatSalesSum = Object.values(categorySalesMap).reduce((s, v) => s + v, 0) || 1;
  const categoryData = Object.entries(categorySalesMap).map(([cat, amount]) => ({
    category: cat,
    sales: amount,
    percentage: Math.round((amount / totalCatSalesSum) * 100),
    color: cat === 'Grocery' ? '#3B82F6' : // Blue
           cat === 'Dairy' ? '#10B981' : // Green
           cat === 'Snacks' ? '#F59E0B' : '#EC4899' // Amber / Pink
  }));

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 overflow-y-auto pb-24 select-none">
      
      {/* Header Banner */}
      <div className="bg-blue-600 text-white px-5 pt-4 pb-4 shadow-sm flex flex-col shrink-0">
        <h2 className="text-lg font-bold tracking-tight">Business Reports & Analytics</h2>
        <p className="text-[10px] text-blue-100/80">Real-time performance audit, volumes, and margins</p>
      </div>

      {/* Time-frequency Filter */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex gap-1 justify-center shrink-0">
        {(['daily', 'weekly', 'monthly'] as const).map(f => (
          <button
            key={f}
            onClick={() => setTimeframe(f)}
            className={`flex-1 text-[10px] font-black uppercase text-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
              timeframe === f 
                ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-250/50 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {f} Analysis
          </button>
        ))}
      </div>

      {/* Analytics Dashboard Panels */}
      <div className="p-4 space-y-4">
        
        {/* 1. Revenue Summaries Bento Box */}
        <div className="grid grid-cols-2 gap-3">
          
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Turnover</span>
            <span className="text-md font-black text-slate-800 tracking-tight block mt-1">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>
            <div className="text-[9px] text-emerald-600 font-bold flex items-center mt-1">
              <TrendingUp size={10} className="mr-0.5" /> +8.4% this week
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Invoices</span>
            <span className="text-md font-black text-slate-800 tracking-tight block mt-1">{totalOrders} Bills</span>
            <span className="text-[9px] text-slate-400 font-medium block mt-1">Avg 3.5 per day</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Average Order Value</span>
            <span className="text-md font-black text-slate-800 tracking-tight block mt-1">₹{avgOrderValue.toFixed(1)}</span>
            <span className="text-[9px] text-indigo-600 font-medium block mt-1">Average basket size</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Est Store Margin</span>
            <span className="text-md font-black text-emerald-600 tracking-tight block mt-1">₹{estimatedProfit.toFixed(0)}</span>
            <span className="text-[9px] text-emerald-600 font-bold block mt-1">~18% Average Profit</span>
          </div>

        </div>

        {/* 2. visual category split shares (Horizontal progress-shares) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Category Sales Share</h3>
          <p className="text-[10px] text-slate-400 mb-4">Percentage breakdown of checkout volume</p>

          <div className="space-y-3.5">
            {categoryData.map(c => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.color }}></span>
                    {c.category}
                  </span>
                  <span>₹{c.sales.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({c.percentage}%)</span>
                </div>
                
                {/* Horizontal Share progress */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Top Selling Products Section table */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Top Products Leaderboard</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-[9px] font-bold text-slate-400 uppercase">
                  <th className="pb-2.5">Product</th>
                  <th className="pb-2.5 text-center">Qty Sold</th>
                  <th className="pb-2.5 text-right font-bold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productBreakdownList.map((p, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors text-[11px]">
                    <td className="py-2.5">
                      <p className="font-extrabold text-slate-700 truncate max-w-[150px]">{p.name}</p>
                      <span className="text-[8px] uppercase tracking-wider bg-slate-100 text-slate-500 rounded px-1.5 mt-0.5 inline-block">{p.category}</span>
                    </td>
                    <td className="py-2 text-center text-slate-600 font-bold font-mono">{p.units} units</td>
                    <td className="py-2 text-right font-extrabold text-slate-800 font-mono">₹{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Critical stock alerts reports */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Restocking Report</h3>
              <p className="text-[10px] text-slate-400">Products currently below safety levels</p>
            </div>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
              lowStockProducts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              {lowStockProducts.length} Alerts
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl text-center text-[11px] text-green-700 font-bold">
              ✅ All store inventory items are optimally stocked. Excellent management!
            </div>
          ) : (
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {lowStockProducts.map(p => (
                <div key={p.sku} className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-[11px]">
                  <div>
                    <p className="font-bold text-slate-800 leading-tight">{p.name}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Supplier: {p.supplier}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-rose-600 font-mono bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full inline-block">
                      Only {p.stock} {p.unit} left
                    </span>
                    <p className="text-[9.5px] text-slate-400 mt-1">Min safety limit: {p.lowStockThreshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {lowStockProducts.length > 0 && (
            <button
              onClick={() => onNavigateTab("INVENTORY")}
              className="w-full mt-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer text-center"
            >
              Go to Inventory Stock Room →
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
