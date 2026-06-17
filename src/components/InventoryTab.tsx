/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Package, 
  Tag, 
  Grid, 
  User, 
  AlertTriangle, 
  X, 
  Save, 
  Info,
  BadgeAlert,
  Printer,
  Check
} from 'lucide-react';

// Code 39 character mapping (1 for wide/black bar, 0 for narrow/white bar/gap)
const code39Map: { [key: string]: string } = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101',
  '$': '100100100101', '/': '100100101001', '+': '100101001001', '%': '101001001001'
};

const getCode39Bars = (sku: string): boolean[] => {
  // Sanitize input SKU to allowable Code 39 characters
  const cleanSku = sku.toUpperCase().split('').map(char => {
    return code39Map[char] ? char : ' ';
  }).join('');

  const normalizedSku = `*${cleanSku}*`;
  let sequence = '';
  for (let i = 0; i < normalizedSku.length; i++) {
    const char = normalizedSku[i];
    const encoded = code39Map[char] || code39Map[' '];
    sequence += encoded + '0'; // narrow white space separator
  }
  return sequence.split('').map(char => char === '1');
};

const generateQrGrid = (sku: string) => {
  const size = 21; // 21x21 QR Code Version 1 Matrix
  const grid = Array(size).fill(null).map(() => Array(size).fill(false));

  // Position finders (7x7) at corners
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[row + r][col + c] = isBorder || isInner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Dotted timing belts
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Hash from SKU to make it deterministic
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash << 5) - hash + sku.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isTopLeftFinder = r < 8 && c < 8;
      const isTopRightFinder = r < 8 && c >= size - 8;
      const isBottomLeftFinder = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!isTopLeftFinder && !isTopRightFinder && !isBottomLeftFinder && !isTiming) {
        const cellSeed = Math.abs(Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453);
        grid[r][c] = (cellSeed * 10) % 2 > 1;
      }
    }
  }

  return grid;
};

interface InventoryTabProps {
  products: Product[];
  onAddProduct: (newProd: Product) => void;
  onUpdateStock: (sku: string, newStock: number) => void;
  openAddProductDirectly: boolean;
  onCloseAddProductDirectly: () => void;
  storeName?: string;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
  openAddProductDirectly,
  onCloseAddProductDirectly,
  storeName = 'Apna Kirana Store'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Grocery' | 'Beverages' | 'Snacks' | 'Dairy'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(openAddProductDirectly);

  // States for Barcode label generation & printable sheet modal
  const [labelProduct, setLabelProduct] = useState<Product | null>(null);
  const [activeLabelType, setActiveLabelType] = useState<'BARCODE' | 'QR'>('BARCODE');
  const [printSuccessFeedback, setPrintSuccessFeedback] = useState<string>('');

  // Helper to highlight matching text as yellow background
  const highlightText = (text: string, highlight: string) => {
    if (!highlight || !highlight.trim()) {
      return <>{text}</>;
    }
    try {
      const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);
      return (
        <>
          {parts.map((p, i) => 
            regex.test(p) ? (
              <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5 font-bold">
                {p}
              </mark>
            ) : (
              p
            )
          )}
        </>
      );
    } catch (e) {
      return <>{text}</>;
    }
  };

  // Sync state with parent dashboard quick actions
  React.useEffect(() => {
    if (openAddProductDirectly) {
      setIsAddOpen(true);
    }
  }, [openAddProductDirectly]);

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const sku = "PRD" + String(products.length + 100).padStart(3, '0');
    
    const newProd: Product = {
      sku,
      name: String(data.get('name')),
      category: data.get('category') as any,
      price: Number(data.get('price')),
      costPrice: Number(data.get('costPrice') || Number(data.get('price')) * 0.85),
      stock: Number(data.get('stock')),
      unit: String(data.get('unit') || 'pcs'),
      supplier: String(data.get('supplier') || 'Alternative Distributor'),
      lowStockThreshold: Number(data.get('lowStockThreshold') || 10)
    };

    onAddProduct(newProd);
    setIsAddOpen(false);
    onCloseAddProductDirectly();
    alert(`Successfully added ${newProd.name} to catalogue with SKU: ${sku}`);
  };

  // Modify stock in details panel
  const [tempStock, setTempStock] = useState<number | null>(null);

  const handleSaveStock = () => {
    if (selectedProduct && tempStock !== null) {
      onUpdateStock(selectedProduct.sku, tempStock);
      setSelectedProduct({
        ...selectedProduct,
        stock: tempStock
      });
      setTempStock(null);
      alert('Stock quantity updated successfully.');
    }
  };

  // Category filter utilities
  const categories: ('All' | 'Grocery' | 'Beverages' | 'Snacks' | 'Dairy')[] = [
    'All', 'Grocery', 'Beverages', 'Snacks', 'Dairy'
  ];

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden select-none">
      
      {/* Header Panel */}
      <div className="bg-blue-600 text-white px-5 pt-4 pb-4 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Inventory Stock Room</h2>
            <p className="text-[10px] text-blue-100/80">Manage products, shelf stock, and suppliers</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md transition-all cursor-pointer"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        {/* Search Bar element */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by Name, SKU or Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-white text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-semibold"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* category pills filter */}
      <div className="bg-white px-4 py-2 border-b border-slate-100 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeCategory === c 
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Active listing of items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-24">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Products Found: {filteredProducts.length} items
        </p>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center flex flex-col items-center">
            <Package className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No products match your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search bar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {filteredProducts.map((p) => {
              const isLowStock = p.stock <= p.lowStockThreshold;
              return (
                <div
                  key={p.sku}
                  onClick={() => {
                    setSelectedProduct(p);
                    setTempStock(p.stock);
                  }}
                  className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs hover:border-blue-400 cursor-pointer flex justify-between items-center transition-all hover:translate-x-0.5 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Category specific colored placeholder squares */}
                    <div className={`w-11 h-11 rounded-xl shrink-0 flex flex-col justify-center items-center font-bold text-[10px] ${
                      p.category === 'Grocery' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      p.category === 'Dairy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      p.category === 'Snacks' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-pink-50 text-pink-600 border border-pink-100'
                    }`}>
                      <Package size={16} />
                      <span className="text-[8px] tracking-wide uppercase font-black">{p.category.slice(0, 3)}</span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-800 leading-snug truncate">
                        {highlightText(p.name, searchTerm)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        <span className="text-[9px] font-mono font-extrabold text-slate-400 bg-slate-50 px-1 border border-slate-100 rounded">
                          {p.sku}
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-600">
                          ₹{p.price} • {p.unit}
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-bold">
                          Supplier: <span className="text-slate-500 font-sans font-medium">{highlightText(p.supplier, searchTerm)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Quantity showing Alerts if below warning limit */}
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-black ${isLowStock ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                      Qty: {p.stock}
                    </p>
                    {isLowStock ? (
                      <span className="text-[8px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full font-bold border border-rose-100 mt-1 inline-block">
                        Low Stock Alert
                      </span>
                    ) : (
                      <span className="text-[8px] text-slate-400 font-bold block mt-1">Safe Level</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detailed Spec Modal Overlay */}
      {selectedProduct && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50">
          <div className="bg-white rounded-t-[28px] w-full max-h-[85%] overflow-y-auto p-5 shadow-2xl animate-slide-up flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Product Details
                </span>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-slate-400 border border-slate-200">
                  <Package size={28} className="text-slate-500 mb-0.5" />
                  <span className="text-[8px] uppercase">{selectedProduct.category}</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">{highlightText(selectedProduct.name, searchTerm)}</h3>
                  <p className="text-xs text-slate-500 mt-1">Supplier: <span className="font-bold text-slate-600">{highlightText(selectedProduct.supplier, searchTerm)}</span></p>
                  <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Barcode: {selectedProduct.sku}</p>
                </div>
              </div>

              {/* Grid of Spec Data */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Selling Unit Cost</span>
                  <p className="text-xs font-black text-slate-700">₹{selectedProduct.price} per {selectedProduct.unit}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Wholesale/Cost Price</span>
                  <p className="text-xs font-black text-slate-700">₹{selectedProduct.costPrice} per {selectedProduct.unit}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Alert Warning Threshold</span>
                  <p className="text-xs font-black text-rose-600">Below {selectedProduct.lowStockThreshold} {selectedProduct.unit}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Sales Category</span>
                    <p className="text-xs font-black text-indigo-700 uppercase">{selectedProduct.category}</p>
                  </div>
                </div>
              </div>

              {/* Retail Shelf & Sticker Label Generator */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-4 space-y-3 print:hidden">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-blue-600 font-bold">🏷️</span> Shelf Label Generator
                  </h4>
                  {/* Format switcher */}
                  <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[9px] font-black font-sans">
                    <button
                      type="button"
                      onClick={() => setActiveLabelType('BARCODE')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        activeLabelType === 'BARCODE' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Barcode 1D
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLabelType('QR')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        activeLabelType === 'QR' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      QR Code
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  Select standard Code 39 format for laser scanner guns, or high-density QR layouts for phone scanning.
                </p>

                {/* Simulated thermal retail sticky label */}
                <div className="bg-white p-3 border border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-2 relative shadow-xs max-w-[280px] mx-auto group hover:border-blue-300 transition-colors">
                  {/* Store Branding */}
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 select-none">
                    {storeName} Label
                  </div>

                  {/* Dynamic Graphic Preview */}
                  {activeLabelType === 'BARCODE' ? (
                    <div className="flex flex-col items-center w-full">
                      {/* Render Vector-perfect Code 39 Bars */}
                      <div className="flex h-11 w-full justify-center items-stretch bg-white px-2 mt-1 select-none">
                        {getCode39Bars(selectedProduct.sku).map((isBlack, idx) => (
                          <div
                            key={idx}
                            className={`h-[40px] ${isBlack ? 'bg-black' : 'bg-white'}`}
                            style={{ width: '1.5px' }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono font-black tracking-[0.2em] text-slate-700 mt-1 select-all">
                        *{selectedProduct.sku.toUpperCase()}*
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-1 bg-white">
                      {/* Render Vector 21x21 QR Code using absolute grid repeating columns style */}
                      <div 
                        className="bg-white p-1 aspect-square w-[80px] h-[80px]"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(21, minmax(0, 1fr))' }}
                      >
                        {generateQrGrid(selectedProduct.sku).map((row, rIdx) => 
                          row.map((isBlack, cIdx) => (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className={isBlack ? 'bg-black' : 'bg-white'}
                            />
                          ))
                        )}
                      </div>
                      <span className="text-[9px] font-mono font-extrabold text-blue-600 mt-1 uppercase tracking-wider">
                        {selectedProduct.sku}
                      </span>
                    </div>
                  )}

                  {/* Metadata Divider */}
                  <div className="w-full border-t border-slate-100 my-1 pt-1.5 text-center">
                    <div className="text-[11px] font-black text-slate-800 leading-tight truncate">
                      {selectedProduct.name}
                    </div>
                    <div className="text-xs font-black text-slate-900 mt-0.5">
                      ₹{selectedProduct.price} <span className="text-[9px] font-bold text-slate-400">per {selectedProduct.unit}</span>
                    </div>
                    <div className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">
                      CAT: {selectedProduct.category} • {selectedProduct.supplier}
                    </div>
                  </div>

                  {/* Tiny print corner badges */}
                  <div className="absolute top-1 right-1.5 text-[7px] font-mono font-black text-slate-300">
                    1 x 1" Label
                  </div>
                </div>

                {/* Label printing control center */}
                <button
                  type="button"
                  onClick={() => {
                    setLabelProduct(selectedProduct);
                    try {
                      // Custom high-frequency sound of instant thermal printing hardware
                      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                      const oscillator = audioCtx.createOscillator();
                      const gainNode = audioCtx.createGain();
                      oscillator.type = 'sawtooth';
                      oscillator.frequency.setValueAtTime(450, audioCtx.currentTime);
                      oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
                      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
                      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                      oscillator.connect(gainNode);
                      gainNode.connect(audioCtx.destination);
                      oscillator.start();
                      oscillator.stop(audioCtx.currentTime + 0.2);
                    } catch(e) {}
                  }}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-150 font-extrabold text-[10px] uppercase py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={13} className="animate-bounce" /> Open Print & Thermal Sticker Preview
                </button>
              </div>

              {/* Stock Level editing actions */}
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200">
                <h4 className="text-xs font-extrabold text-amber-800 flex items-center gap-1 mb-2">
                  <SlidersHorizontal size={14} /> Quick Stock Restock Counter
                </h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => tempStock !== null && setTempStock(Math.max(0, tempStock - 1))}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 outline-none text-center rounded-xl py-1 cursor-pointer font-mono"
                  >
                    - Less
                  </button>
                  <input
                    type="number"
                    value={tempStock !== null ? tempStock : ''}
                    onChange={(e) => setTempStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 text-center text-xs p-1 bg-white border border-slate-300 rounded-xl font-bold font-mono outline-none"
                  />
                  <button
                    onClick={() => tempStock !== null && setTempStock(tempStock + 1)}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 outline-none text-center rounded-xl py-1 cursor-pointer font-mono"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions to register edits to stock level */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleSaveStock}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-colors cursor-pointer flex justify-center items-center gap-1"
              >
                <Save size={13} /> Save Quantity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Dialog Modal Overlay */}
      {isAddOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-2xl w-full max-w-[350px] p-5 shadow-2xl relative animate-scale-up max-h-[90%] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddOpen(false);
                onCloseAddProductDirectly();
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full cursor-pointer"
            >
              <X size={15} />
            </button>

            <h3 className="text-md font-bold text-slate-800 mb-1">Add New Catalogue Item</h3>
            <p className="text-xs text-slate-400 mb-4">Input specifications for your retail stock</p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Britannia Bourbon Biscuits"
                  required
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-700 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Stock Category</label>
                <select
                  name="category"
                  required
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-700"
                >
                  <option value="Grocery">Grocery / Flour / Spices</option>
                  <option value="Beverages">Beverages / Soft Drinks</option>
                  <option value="Snacks">Snacks / Biscuits</option>
                  <option value="Dairy">Dairy / Curd / Milk</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 45"
                    required
                    min={1}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-700 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    name="costPrice"
                    placeholder="e.g. 38"
                    min={1}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-700 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Initial Stock</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="e.g. 150"
                    required
                    min={0}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-700 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Unit Type</label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g. Litre, kg, block"
                    required
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-700 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Low Warning Limit</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    placeholder="e.g. 15"
                    defaultValue={10}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-700 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Suppling Partner</label>
                  <input
                    type="text"
                    name="supplier"
                    placeholder="e.g. Nestle India"
                    defaultValue="General Distributor"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    onCloseAddProductDirectly();
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-colors cursor-pointer flex justify-center items-center gap-1"
                >
                  <Save size={14} /> Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Thermal Printer Sticker Simulation Panel */}
      {labelProduct && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col justify-between p-5 z-50 text-white animate-fade-in print:bg-white print:text-black">
          {/* Top Bar (Hidden on print) */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                POS Label Station
              </span>
            </div>
            <button
              onClick={() => {
                setLabelProduct(null);
                setPrintSuccessFeedback('');
              }}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer transition-colors"
              title="Close Panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Central Workspace */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto space-y-6">
            
            {/* The Printer Machine Visual wrapper (Hidden on print) */}
            <div className="w-full max-w-[280px] bg-slate-850 border-t-4 border-slate-700 rounded-b-2xl shadow-2xl flex flex-col items-center pt-3 pb-6 px-4 shrink-0 print:hidden relative border-x border-b border-slate-850/50">
              
              {/* Status LCD Display */}
              <div className="w-full bg-emerald-950/85 border border-emerald-500/35 p-2 rounded-lg mb-4 font-mono text-[9px] text-emerald-400 flex justify-between items-center select-none">
                <span>ONLINE // READY</span>
                <span className="text-[8px] opacity-75">{activeLabelType === 'BARCODE' ? '1D CODE39' : '2D QRCODE'}</span>
              </div>

              {/* Thermal Feed Paper Roller Slot */}
              <div className="w-full h-2 bg-slate-950 rounded-full border-t border-slate-700 shadow-inner relative flex justify-center mb-1">
                {/* Simulated sticker exiting paper slot */}
                <div className="absolute top-1 max-w-[220px] w-full bg-white text-slate-900 rounded-b-lg p-3.5 shadow-xl border-l border-r border-b border-slate-200 animate-slide-up origin-top">
                  
                  {/* Real printable design card */}
                  <div className="flex flex-col items-center justify-center space-y-2.5 text-center">
                    <div className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 select-none">
                      {storeName}
                    </div>

                    {activeLabelType === 'BARCODE' ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="flex h-12 w-full justify-center items-stretch bg-white px-2 mt-1 select-none">
                          {getCode39Bars(labelProduct.sku).map((isBlack, idx) => (
                            <div
                              key={idx}
                              className={`h-[45px] ${isBlack ? 'bg-black' : 'bg-white'}`}
                              style={{ width: '1.25px' }}
                            />
                          ))}
                        </div>
                        <span className="text-[9.5px] font-mono font-black tracking-[0.25em] text-slate-800 mt-1.5 select-all">
                          *{labelProduct.sku.toUpperCase()}*
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-1 bg-white border border-slate-100 rounded-lg">
                        <div 
                          className="bg-white p-1 aspect-square w-[80px] h-[80px]"
                          style={{ display: 'grid', gridTemplateColumns: 'repeat(21, minmax(0, 1fr))' }}
                        >
                          {generateQrGrid(labelProduct.sku).map((row, rIdx) => 
                            row.map((isBlack, cIdx) => (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className={isBlack ? 'bg-black' : 'bg-white'}
                              />
                            ))
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-black text-blue-600 mt-1 uppercase tracking-wider">
                          {labelProduct.sku}
                        </span>
                      </div>
                    )}

                    <div className="w-full border-t border-slate-200 my-1 pt-2">
                      <div className="text-xs font-black text-slate-900 leading-tight">
                        {labelProduct.name}
                      </div>
                      <div className="text-sm font-black text-slate-950 mt-0.5">
                        ₹{labelProduct.price} <span className="text-[9px] font-bold text-slate-400">per {labelProduct.unit}</span>
                      </div>
                      <div className="text-[8px] font-mono text-slate-400 uppercase mt-1">
                        Supplier: {labelProduct.supplier}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Feed LED indicator */}
              <div className="absolute bottom-2 right-4 flex items-center gap-1.5 select-none text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[7px] font-mono tracking-widest font-extrabold pb-[1px]">FEED STATUS</span>
              </div>
            </div>

            {/* Print Action Buttons (Hidden on print) */}
            <div className="w-full max-w-[280px] space-y-2.5 print:hidden">
              <button
                onClick={() => {
                  try {
                    // Simulating hardware motor whirring sound of a high-speed small receipt/sticker thermal device
                    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    let currentT = audioCtx.currentTime;
                    for (let i = 0; i < 4; i++) {
                      const oscillator = audioCtx.createOscillator();
                      const gainNode = audioCtx.createGain();
                      oscillator.type = 'sawtooth';
                      oscillator.frequency.setValueAtTime(400 - (i * 50), currentT);
                      gainNode.gain.setValueAtTime(0.04, currentT);
                      gainNode.gain.exponentialRampToValueAtTime(0.001, currentT + 0.15);
                      oscillator.connect(gainNode);
                      gainNode.connect(audioCtx.destination);
                      oscillator.start(currentT);
                      oscillator.stop(currentT + 0.15);
                      currentT += 0.12;
                    }
                  } catch(e) {}

                  setPrintSuccessFeedback("✓ Simulated Adhesive Label Printed! Check paper feed slot below.");
                  setTimeout(() => {
                    setPrintSuccessFeedback('');
                  }, 4000);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/10"
              >
                <Printer size={15} /> Simulate Label Print Run
              </button>

              <button
                onClick={() => {
                  try {
                    window.print();
                  } catch (e) {
                    alert("A print request was triggered. Open right-click browser print context if inside a sandboxed wrapper frame.");
                  }
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Trigger System Print / PDF
              </button>
            </div>

            {/* Instructions (Hidden on print) */}
            <div className="text-center max-w-[280px] space-y-2 print:hidden shrink-0">
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Physical thermal label rolls can be printed block-by-block. System-triggered print sets boundaries to label dimensions.
              </p>
              {printSuccessFeedback && (
                <p className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-pulse">
                  {printSuccessFeedback}
                </p>
              )}
            </div>

            {/* Standalone raw print layout for actual device window printing */}
            <div className="hidden print:block w-[2.2in] h-[2.2in] bg-white text-black p-4 m-0 font-sans text-center border border-black/10">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1">{storeName}</div>
              
              {activeLabelType === 'BARCODE' ? (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-full justify-center items-stretch bg-white">
                    {getCode39Bars(labelProduct.sku).map((isBlack, idx) => (
                      <div
                        key={idx}
                        className={`h-[42px] ${isBlack ? 'bg-black' : 'bg-white'}`}
                        style={{ width: '1.5px' }}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-mono font-bold tracking-[0.2em] mt-1">
                    *{labelProduct.sku.toUpperCase()}*
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div 
                    className="bg-white p-1 aspect-square w-[90px] h-[90px] mx-auto border border-black/5"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(21, minmax(0, 1fr))' }}
                  >
                    {generateQrGrid(labelProduct.sku).map((row, rIdx) => 
                      row.map((isBlack, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={isBlack ? 'bg-black' : 'bg-white'}
                        />
                      ))
                    )}
                  </div>
                  <div className="text-[10px] font-mono font-bold mt-1 uppercase">
                    {labelProduct.sku}
                  </div>
                </div>
              )}

              <div className="border-t border-black/30 mt-2 pt-2">
                <div className="text-[11px] font-black">{labelProduct.name}</div>
                <div className="text-sm font-black mt-0.5">₹{labelProduct.price}</div>
                <div className="text-[7px] font-mono text-gray-500 mt-1 uppercase">
                  {labelProduct.category} • SUPPLIER: {labelProduct.supplier}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom action row (Hidden on print) */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono print:hidden shrink-0">
            <span>SMARTKIRANA TERMINAL // REG-01</span>
            <button
              onClick={() => {
                setLabelProduct(null);
                setPrintSuccessFeedback('');
              }}
              className="text-blue-400 font-bold uppercase cursor-pointer hover:text-blue-300"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
