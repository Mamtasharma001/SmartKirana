/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Invoice, InvoiceItem } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Percent, 
  Receipt, 
  Check, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Printer, 
  X,
  FileSpreadsheet,
  Camera,
  History,
  Clock,
  Share2,
  Download
} from 'lucide-react';

interface BillingTabProps {
  products: Product[];
  invoices: Invoice[];
  onGenerateInvoice: (invoice: Invoice) => void;
  onNavigateTab: (tab: 'DASHBOARD' | 'INVENTORY' | 'BILLING' | 'REPORTS' | 'PROFILE') => void;
  cart: { [sku: string]: { product: Product; quantity: number } };
  onAddToCart: (product: Product) => void;
  onDecreaseCartQty: (sku: string) => void;
  onRemoveFromCart: (sku: string) => void;
  onClearCart: () => void;
}

export const BillingTab: React.FC<BillingTabProps> = ({
  products,
  invoices,
  onGenerateInvoice,
  onNavigateTab,
  cart,
  onAddToCart,
  onDecreaseCartQty,
  onRemoveFromCart,
  onClearCart
}) => {
  // Billing States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Grocery' | 'Beverages' | 'Snacks' | 'Dairy'>('All');
  const [currPayment, setCurrPayment] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [discountInput, setDiscountInput] = useState<number>(0);
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [viewMode, setViewMode] = useState<'cart' | 'history'>('cart');
  const [isCatalogCollapsed, setIsCatalogCollapsed] = useState(false);

  // Live Camera Barcode/QR Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scanMessage, setScanMessage] = useState<string>('');
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Invoice Preview State
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // Synthesize instant POS barcode register beep!
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000 Hz beep
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15); // Fade out
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn("AudioContext beep failed: ", e);
    }
  };

  const handleScannedCode = (code: string) => {
    const foundProduct = products.find(
      p => p.sku.toLowerCase() === code.trim().toLowerCase() || p.name.toLowerCase() === code.trim().toLowerCase()
    );
    
    if (foundProduct) {
      addToCart(foundProduct);
      playBeep();
      setScanMessage(`Scanned: ${foundProduct.name} (+1)`);
      setTimeout(() => setScanMessage(''), 1500);
    } else {
      setScanMessage(`Code: "${code}" not found in Apna catalog`);
      setTimeout(() => setScanMessage(''), 2000);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      setIsScanning(true);
    } catch (err) {
      console.error("Camera access failed: ", err);
      alert("⚠️ Camera Access Error: SmartKirana needs video stream permissions to scan physical barcodes. Clear camera permissions and try again.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsScanning(false);
  };

  // Real-time Barcode Detection Web API scan effect runs recursively
  React.useEffect(() => {
    let active = true;
    let detector: any = null;

    if (isScanning && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      
      // Check for native BarcodeDetector API support
      if ('BarcodeDetector' in window) {
        try {
          // @ts-ignore
          detector = new window.BarcodeDetector({ 
            formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'ean_8'] 
          });
        } catch (e) {
          console.warn("BarcodeDetector Web API formats init error: ", e);
        }
      }

      const scanFrame = async () => {
        if (!active || !isScanning || !videoRef.current || !detector) return;
        try {
          const symbols = await detector.detect(videoRef.current);
          if (symbols && symbols.length > 0) {
            const code = symbols[0].rawValue;
            handleScannedCode(code);
            // Delay slightly to prevent rapid scanning of same barcode
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        } catch (err) {
          // ignore detection frame parsing errors
        }
        if (active && isScanning) {
          requestAnimationFrame(scanFrame);
        }
      };

      if (detector) {
        requestAnimationFrame(scanFrame);
      }
    }

    return () => {
      active = false;
    };
  }, [isScanning, cameraStream]);

  // Cleanup camera stream automatically on unmount to save battery & device indicators
  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Filter products for fast checkout search
  const displayProducts = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Adding item to cart
  const addToCart = onAddToCart;

  // Decreasing cart quantity
  const decreaseQuantity = onDecreaseCartQty;

  // Removing item from cart
  const removeFromCart = onRemoveFromCart;

  const getCartValues = () => {
    return Object.values(cart) as Array<{ product: Product; quantity: number }>;
  };

  const getSubtotal = () => {
    return getCartValues().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const cartItemsCount = getCartValues().reduce((sum, item) => sum + item.quantity, 0);

  // Calculations
  const subtotal = getSubtotal();
  const gst = parseFloat((subtotal * 0.05).toFixed(2)); // Standard 5% retail GST split
  const totalWithGst = subtotal + gst;
  const finalTotal = Math.max(0, parseFloat((totalWithGst - discountInput).toFixed(2)));

  // Generate Receipt Flow
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) {
      alert('Your billing cart is empty! Add products first.');
      return;
    }

    const randNum = Math.floor(Math.random() * 900) + 100;
    const invoiceNo = `SK-2026-10${randNum}`;
    const now = new Date();
    const dateStr = "2026-06-03"; // Consistent with core system time
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const items: InvoiceItem[] = getCartValues().map(item => ({
      sku: item.product.sku,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      unit: item.product.unit
    }));

    const nextInvoice: Invoice = {
      id: invoiceNo,
      date: dateStr,
      time: timeStr,
      items,
      subtotal,
      gst,
      discount: discountInput,
      total: finalTotal,
      paymentMethod: currPayment,
      customerName: custName || undefined,
      customerMobile: custMobile || undefined
    };

    // Save permanently to memory state
    onGenerateInvoice(nextInvoice);
    setPreviewInvoice(nextInvoice);
  };

  // Clean form and cart
  const handleClearCart = () => {
    onClearCart();
    setCustName('');
    setCustMobile('');
    setDiscountInput(0);
    setPreviewInvoice(null);
  };

  const handlePrintMock = () => {
    alert("🖨️ Simulating direct ESC/POS push instructions to Bluetooth thermal device...");
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden select-none transition-colors duration-200">
      
      {/* Header Row */}
      <div className="bg-blue-600 text-white px-5 pt-4 pb-3.5 shadow-sm flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Express Billing POS</h2>
          <p className="text-[10px] text-blue-100/80">Add items, configure discount & tap pay</p>
        </div>
        <div className="flex bg-blue-700 rounded-full px-3 py-1 items-center gap-1.5 text-xs font-black">
          <ShoppingCart size={13} className="text-emerald-300" />
          <span>{cartItemsCount} Items</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dynamic Live Barcode Camera Scanner Drawer Panel */}
        {isScanning && (
          <div className="bg-slate-900 border-b border-slate-800 flex flex-col p-3 relative shrink-0 text-white z-20">
            {/* Scanned success green feedback screen saver */}
            {scanMessage && (
              <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center z-50 text-center p-3 animate-pulse">
                <Check className="text-white animate-bounce" size={24} />
                <p className="text-xs font-black uppercase tracking-wider mt-1.5">{scanMessage}</p>
                <span className="text-[9px] text-emerald-100 font-medium">BEEP! Added to checkout register</span>
              </div>
            )}

            {/* Header info */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Live Device Camera Barcode Scanner</span>
              </div>
              <button 
                type="button"
                onClick={stopCamera} 
                className="text-[9px] uppercase font-black tracking-wider text-rose-400 hover:bg-rose-950/50 hover:text-white px-2 py-0.5 bg-rose-950/20 rounded border border-rose-900/40 cursor-pointer"
              >
                Close Scanner
              </button>
            </div>

            {/* Viewfinder and Catalog Quick Tap Simulator */}
            <div className="grid grid-cols-5 gap-3 h-[115px]">
              
              {/* Camera Viewfinder */}
              <div className="col-span-2 bg-black rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center">
                {cameraStream ? (
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <span className="block text-[8px] text-slate-500 font-mono tracking-wider animate-pulse">Initializing camera...</span>
                  </div>
                )}

                {/* Laser scanline */}
                <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10B981] top-1/2 animate-scan-laser z-10"></div>
                
                {/* HUD Overlay brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
              </div>

              {/* Handheld SKU Simulator block */}
              <div className="col-span-3 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] text-slate-400 font-medium leading-normal mb-1">
                    Hold a barcode up to your camera, or tap a catalog item below to test simulated instant scanned entry:
                  </p>
                </div>

                {/* Badge list of products for direct simulated trigger */}
                <div className="grid grid-cols-2 gap-1 overflow-y-auto max-h-[75px] pr-0.5 scrollbar-thin">
                  {products.slice(0, 6).map((p) => (
                    <button
                      key={p.sku}
                      type="button"
                      onClick={() => handleScannedCode(p.sku)}
                      className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg text-left text-[8.5px] font-bold border border-slate-700/60 transition-colors flex flex-col justify-between cursor-pointer group"
                    >
                      <span className="truncate w-full text-slate-200 group-hover:text-white leading-tight font-sans">{p.name}</span>
                      <span className="text-[7.5px] font-mono uppercase text-emerald-400 mt-1">
                        Tap to Register
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom device metadata */}
            <div className="mt-1.5 text-[7.5.px] text-slate-500 font-mono flex justify-between select-none">
              <span>SCAN FEED: ENVIRONMENT REAR LENS DEFAULT</span>
              <span>SYNTHESIZED BEAPER: ENABLED (1000 HZ)</span>
            </div>
          </div>
        )}

        {/* UPPER PANEL: Catalog Selection List for express billing */}
        <div className={`bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col p-3 shrink-0 transition-all duration-300 overflow-hidden ${isCatalogCollapsed ? 'h-[58px]' : 'h-[37%]'}`}>
          <div className="flex gap-2 items-center">
            {/* Minimal search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={viewMode === 'cart' ? "Types to lookup items..." : "Search ID, name, mobile..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-[11px] bg-slate-50 dark:bg-slate-800 active:bg-white dark:active:bg-slate-850 text-slate-800 dark:text-slate-100 placeholder-slate-400 pl-8 pr-12 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 font-semibold outline-none transition-colors"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400">
                <Search size={12} />
              </span>

              {/* Barcode Camera Scanner Trigger Button inside the input */}
              <button
                type="button"
                onClick={() => {
                  if (isScanning) {
                    stopCamera();
                  } else {
                    startCamera();
                  }
                }}
                className={`absolute right-1.5 top-1.5 p-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer transition-colors ${
                  isScanning 
                    ? 'bg-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-755'
                }`}
                title="Toggle Live Camera Barcode/QR Scanner"
              >
                <Camera size={12} className={isScanning ? 'animate-pulse' : ''} />
              </button>
            </div>

            {/* Collapse/Expand Toggle Button */}
            <button
              type="button"
              onClick={() => setIsCatalogCollapsed(!isCatalogCollapsed)}
              className="px-2.5 py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-105 dark:hover:bg-slate-750 active:scale-95 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
              title={isCatalogCollapsed ? "Click to show full item catalog grid" : "Collapse catalog grid to maximize billing form"}
            >
              {isCatalogCollapsed ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
              <span className="hidden xs:inline">{isCatalogCollapsed ? 'Catalog' : 'Collapse'}</span>
            </button>
          </div>

          {!isCatalogCollapsed && (
            <>
              {/* Scrolling category list */}
              <div className="flex gap-1 overflow-x-auto whitespace-nowrap py-1.5 scrollbar-none max-w-full shrink-0 border-t border-slate-50 dark:border-slate-850 mt-2">
                {['All', 'Grocery', 'Snacks', 'Dairy', 'Beverages'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Selection List Grid */}
              <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-1.5 pr-1 mt-1 scrollbar-thin">
                {displayProducts.slice(0, 20).map(p => {
                  const inCartCount = cart[p.sku]?.quantity || 0;
                  return (
                    <div
                      key={p.sku}
                      onClick={() => addToCart(p)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        inCartCount > 0 
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-inner' 
                          : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate leading-tight">{p.name}</h4>
                        <p className="text-[9px] text-slate-400 dark:text-slate-450 mt-0.5 font-sans">₹{p.price}/{p.unit} • <span className={p.stock <= p.lowStockThreshold ? 'text-rose-500 font-bold' : ''}>Stk: {p.stock}</span></p>
                      </div>
                      <div className="shrink-0">
                        {inCartCount > 0 ? (
                          <span className="bg-emerald-500 text-white font-black text-[10px] h-5 w-5 rounded-full flex items-center justify-center animate-scale-up">
                            {inCartCount}
                          </span>
                        ) : (
                          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-650 p-1 rounded-lg block">
                            <Plus size={10} />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
           {/* LOWER PANEL: Active Cart Details and Checkout options */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          
          <div className="flex justify-between items-center px-4 py-2 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100/60 dark:bg-slate-900 transition-colors duration-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode('cart')}
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cart' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                Cart ({cartItemsCount})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('history')}
                id="view-transaction-history-tab"
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'history' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                History ({invoices.length})
              </button>
            </div>
            {viewMode === 'cart' && cartItemsCount > 0 && (
              <button 
                onClick={handleClearCart} 
                className="text-[9px] text-rose-500 hover:text-rose-600 font-extrabold hover:underline cursor-pointer transition-colors animate-fade-in"
              >
                Clear Cart
              </button>
            )}
          </div>

          {viewMode === 'cart' ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
              
              {/* Added Cart Items separately scrollable */}
              <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200 divide-y divide-slate-100/60 dark:divide-slate-850 scrollbar-thin p-3 pb-4">
                {cartItemsCount === 0 ? (
                  <div className="w-full min-h-[180px] flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs select-none">
                    <ShoppingCart className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-2" />
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Add products to build checkout list</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 animate-pulse">Tap catalogue items above for rapid addition</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 select-none">Added Cart Items</h3>
                    {getCartValues().map(({ product, quantity }) => (
                      <div key={product.sku} className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-750 flex justify-between items-center shadow-xs animate-fade-in select-none">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">{product.name}</p>
                          <p className="text-[9px] text-slate-450 dark:text-slate-400 mt-0.5 font-sans">₹{product.price} × {quantity} • Total ₹{product.price * quantity}</p>
                        </div>

                        {/* Quantity adjustments */}
                        <div className="flex items-center gap-1.5 flex-none">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(product.sku)}
                            className="p-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-[11px] font-black text-slate-700 dark:text-slate-355 min-w-[12px] text-center font-mono">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="p-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.sku)}
                            className="p-1 text-rose-500 hover:text-rose-600 rounded ml-1 cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout configuration and fields form: STICKY AT THE BOTTOM */}
              {cartItemsCount > 0 && (
                <form onSubmit={handleCheckoutSubmit} className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 pb-[76px] space-y-2.5 shrink-0 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] select-none">
                  {/* Customer details info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 select-none">Customer Name (Opt)</label>
                      <input
                        type="text"
                        placeholder="Customer name"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full text-[11px] p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-705 rounded-lg outline-none font-bold text-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 select-none">Mobile (Opt)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Mobile number"
                        value={custMobile}
                        onChange={(e) => setCustMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-[11px] p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-705 rounded-lg outline-none font-bold text-slate-700 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Discount inputs and Payment pills */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 select-none">Cash Discount (₹)</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          min={0}
                          max={subtotal}
                          value={discountInput || ''}
                          onChange={(e) => setDiscountInput(parseInt(e.target.value) || 0)}
                          className="w-full text-[11px] p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-705 rounded-lg outline-none font-black text-slate-850 dark:text-white pr-5 font-mono"
                        />
                        <Percent size={10} className="absolute right-1.5 top-2 text-slate-400 dark:text-slate-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 select-none">Payment Method</label>
                      <div className="flex bg-slate-50 dark:bg-slate-800 p-0.5 border border-slate-100 dark:border-slate-705 rounded-lg gap-0.5">
                        {(['Cash', 'UPI', 'Card'] as const).map(pm => (
                          <button
                            key={pm}
                            type="button"
                            onClick={() => setCurrPayment(pm)}
                            className={`flex-1 text-[9px] font-black text-center py-1 rounded-md transition-colors cursor-pointer ${
                              currPayment === pm 
                                ? 'bg-blue-600 text-white' 
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                            }`}
                          >
                            {pm}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clean, space-saving Calculations Block */}
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg text-[10px] border border-slate-100 dark:border-slate-800 font-semibold space-y-0.5">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 leading-none">
                      <span>Subtotal: ₹{subtotal.toFixed(2)} + GST(5%): ₹{gst.toFixed(2)}</span>
                      {discountInput > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">-₹{discountInput.toFixed(2)} Disc</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-slate-800 pt-1.5 mt-1 bg-slate-100/50 dark:bg-slate-800 -mx-2 px-2 -mb-2 rounded-b-lg">
                      <span className="text-blue-700 dark:text-blue-400 font-extrabold uppercase tracking-widest text-[9px]">Total Net Bill</span>
                      <span className="text-blue-700 dark:text-blue-450 font-mono text-sm font-black">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* ACTION: PROCESS RECEIPT */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-[11px] py-2.5 rounded-xl shadow-md shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1 mt-1 animate-pulse-subtle"
                  >
                    <Receipt size={12} />
                    <span>Process & Generate Receipt</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* TRANSACTION HISTORY LIST VIEW */
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 pb-20">
              {invoices.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 shrink-0 bg-white dark:bg-slate-900 animate-fade-in">
                  <History className="w-10 h-10 text-slate-200 dark:text-slate-850 mb-2" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No transactions recorded yet</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Complete virtual checkout cycles above to view summaries</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-thin">
                  {(() => {
                    const filteredInvoices = invoices.filter(inv => {
                      if (!searchTerm) return true;
                      const term = searchTerm.toLowerCase();
                      return inv.id.toLowerCase().includes(term) ||
                             (inv.customerName && inv.customerName.toLowerCase().includes(term)) ||
                             (inv.customerMobile && inv.customerMobile.includes(term));
                    });

                    if (filteredInvoices.length === 0) {
                      return (
                        <div className="text-center py-10 px-4 animate-fade-in">
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No matching transactions found</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Try refining your ID, name, or phone search</p>
                        </div>
                      );
                    }

                    return filteredInvoices.map((it) => {
                      const payMethodColors = {
                        Cash: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-105 dark:border-blue-900/30',
                        UPI: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-105 dark:border-emerald-900/30',
                        Card: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-105 dark:border-amber-900/30'
                      }[it.paymentMethod] || 'bg-slate-50 dark:bg-slate-850 text-slate-500';

                      const totalItemsCount = it.items.reduce((sum, item) => sum + item.quantity, 0);

                      return (
                        <div key={it.id} className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-750 transition-all flex flex-col justify-between shadow-xs animate-fade-in">
                          <div className="flex justify-between items-start mb-1.5">
                            <div>
                              <span className="text-[11px] font-black tracking-wider text-slate-800 dark:text-white font-mono">{it.id}</span>
                              <div className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                                <Clock size={10} />
                                <span>{it.date} • {it.time}</span>
                              </div>
                            </div>
                            <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md ${payMethodColors}`}>
                              {it.paymentMethod}
                            </span>
                          </div>

                          {/* Customer Tag Info if populated */}
                          {(it.customerName || it.customerMobile) && (
                            <div className="mb-2 text-[10px] text-slate-600 dark:text-slate-300 font-semibold bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100/60 dark:border-slate-800/60 flex items-center gap-1.5">
                              {it.customerName && <span className="font-bold text-slate-700 dark:text-slate-200">👤 {it.customerName}</span>}
                              {it.customerMobile && <span className="text-slate-455 dark:text-slate-500 font-mono text-[9px] font-normal">+91 {it.customerMobile}</span>}
                            </div>
                          )}

                          {/* Purchased Items summary */}
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2.5 leading-relaxed">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{totalItemsCount} products:</span>{' '}
                            <span className="italic">
                              {it.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                            </span>
                          </div>

                          {/* Action view details link */}
                          <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-1">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Charge</span>
                              <span className="text-xs font-black text-blue-600 dark:text-blue-450 font-mono">₹{it.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPreviewInvoice(it)}
                              className="text-[9.5px] font-black uppercase text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}

        </div>

        </div>

      {/* RETAIL MONOSPACE THERMAL RECEIPT PREVIEW PANEL */}
      {previewInvoice && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col justify-end z-[100] p-4 select-text">
          <div className="bg-white rounded-t-[28px] w-full max-h-[92%] flex flex-col justify-between overflow-hidden shadow-2xl animate-slide-up">
            
            {/* Header controls select-all */}
            <div className="bg-slate-100 flex justify-between items-center p-3 border-b border-slate-200">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1 uppercase">
                <Printer size={13} className="text-blue-600" /> ESC/POS Thermal Receipt
              </span>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="p-1 bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* MONOSPACE RECEIPT PAPER CONTAINER */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-200 font-mono text-[11px] text-slate-800 flex justify-center">
              <div className="bg-white w-[80mm] max-w-full p-4 shadow-lg border border-slate-300 min-h-[460px] flex flex-col justify-between selection:bg-amber-100">
                
                {/* Store Credentials Header */}
                <div className="text-center">
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">*** SMARTKIRANA STORE ***</h3>
                  <p className="text-[10px] mt-0.5">Sector 15, Huda Market, Gurugram</p>
                  <p className="text-[10px]">Phone: +91 98765 43210</p>
                  <p className="text-[9px] text-slate-400 uppercase mt-1">GSTIN: 06AABCDE1234F1Z5</p>
                  <p className="text-[10px] leading-tight select-none">---------------------------------</p>
                </div>

                {/* Invoice Data */}
                <div className="space-y-0.5">
                  <div className="flex justify-between">
                    <span>INVOICE:</span>
                    <span className="font-bold">{previewInvoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DATE:</span>
                    <span>{previewInvoice.date} • {previewInvoice.time}</span>
                  </div>
                  {previewInvoice.customerName && (
                    <div className="flex justify-between border-t border-slate-100 pt-0.5">
                      <span>CUSTOMER:</span>
                      <span className="truncate">{previewInvoice.customerName}</span>
                    </div>
                  )}
                  {previewInvoice.customerMobile && (
                    <div className="flex justify-between">
                      <span>PHONE:</span>
                      <span>+91 {previewInvoice.customerMobile}</span>
                    </div>
                  )}
                  <p className="text-[10px] leading-tight select-none">=================================</p>
                </div>

                {/* Items Header */}
                <div className="space-y-1">
                  <div className="flex justify-between font-black text-slate-950">
                    <span className="w-1/2">ITEM NAME</span>
                    <span className="w-1/6 text-right">QTY</span>
                    <span className="w-1/6 text-right">RATE</span>
                    <span className="w-1/6 text-right">TOTAL</span>
                  </div>
                  <p className="text-[10px] leading-tight select-none">---------------------------------</p>

                  {/* Items List */}
                  <div className="space-y-1">
                    {previewInvoice.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between leading-snug">
                        <span className="w-1/2 truncate font-bold text-slate-950">{it.name}</span>
                        <span className="w-1/6 text-right font-mono">{it.quantity}</span>
                        <span className="w-1/6 text-right font-mono">₹{it.price}</span>
                        <span className="w-1/6 text-right font-bold text-slate-950 font-mono">₹{it.quantity * it.price}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] leading-tight select-none">---------------------------------</p>
                </div>

                {/* calculations summary */}
                <div className="space-y-0.5 text-right font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{previewInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>GST simple (5.00%):</span>
                    <span>₹{previewInvoice.gst.toFixed(2)}</span>
                  </div>
                  {previewInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount (Store VIP):</span>
                      <span>-₹{previewInvoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <p className="text-[10px] leading-tight select-none">=================================</p>
                  
                  <div className="flex justify-between font-black text-slate-950 text-xs py-0.5 uppercase bg-slate-50 border border-dotted border-slate-400 px-1.5">
                    <span>NET CHARGEABLE:</span>
                    <span>₹{previewInvoice.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment method and footer credentials */}
                <div className="text-center pt-3 mt-1.5">
                  <span className="border border-double border-slate-800 font-black px-3 py-0.5 uppercase text-[10px] inline-block mb-2">
                    PAID VIA {previewInvoice.paymentMethod}
                  </span>

                  {/* UPI QR Code Mock Illustration */}
                  {previewInvoice.paymentMethod === 'UPI' && (
                    <div className="flex flex-col items-center gap-1 my-2 bg-slate-50 p-2 rounded-xl">
                      {/* Generates customized QR element */}
                      <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white relative">
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white border border-slate-950"></div>
                        <div className="absolute top-1 right-1 w-3 h-3 bg-white border border-slate-950"></div>
                        <div className="absolute bottom-1 left-1 w-3 h-3 bg-white border border-slate-950"></div>
                        <div className="w-8 h-8 border border-white flex flex-wrap gap-0.5 p-0.5">
                          <div className="w-1.5 h-1.5 bg-white"></div>
                          <div className="w-1.5 h-1.5 bg-slate-500"></div>
                          <div className="w-1.5 h-1.5 bg-white"></div>
                          <div className="w-1.5 h-1.5 bg-white"></div>
                        </div>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400">Scan to pay ₹{previewInvoice.total.toFixed(2)}</span>
                    </div>
                  )}

                  <p className="text-[10px] font-bold text-slate-950 uppercase mt-2">THANK YOU FOR YOUR VISIT!</p>
                  <p className="text-[9px] text-slate-400 italic">SmartKirana Digital POS Receipt</p>
                </div>

              </div>
            </div>

            {/* Bottom Actions printable */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const text = `*** ${previewInvoice.customerName ? previewInvoice.customerName + ', ' : ''}Apna Kirana Store Digital Invoice ***\nInvoice No: ${previewInvoice.id}\nDate: ${previewInvoice.date} • ${previewInvoice.time}\n\nItems:\n${previewInvoice.items.map((it, idx) => `${idx + 1}. ${it.name} x${it.quantity} = ₹${it.quantity * it.price}`).join('\n')}\n\nSubtotal: ₹${previewInvoice.subtotal.toFixed(2)}\nGST: ₹${previewInvoice.gst.toFixed(2)}\nDiscount Applied: ₹${previewInvoice.discount.toFixed(2)}\nTotal Paid: ₹${previewInvoice.total.toFixed(2)} (${previewInvoice.paymentMethod})\n\nThank you for shopping at Apna Kirana!`;
                    const link = `https://wa.me/91${previewInvoice.customerMobile || '9876543210'}?text=${encodeURIComponent(text)}`;
                    window.open(link, '_blank');
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>Share WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    const text = `*** SMARTKIRANA DIGI-RECEIPT ***\nInvoice No: ${previewInvoice.id}\nDate: ${previewInvoice.date} • ${previewInvoice.time}\n------------------------\n${previewInvoice.items.map((it) => `${it.name.padEnd(16)} x${it.quantity}  ₹${it.price}`).join('\n')}\n------------------------\nSubtotal:  ₹${previewInvoice.subtotal.toFixed(2)}\nGST (5%):  ₹${previewInvoice.gst.toFixed(2)}\nDiscount: -₹${previewInvoice.discount.toFixed(2)}\nTotal Paid: ₹${previewInvoice.total.toFixed(2)}\nPayment Method: ${previewInvoice.paymentMethod}\n========================\nThank you for your visit!`;
                    const blob = new Blob([text], { type: 'text/plain' });
                    const blobURL = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobURL;
                    link.download = `Invoice_${previewInvoice.id}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobURL);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-750 hover:opacity-90 text-white font-bold text-xs py-2.5 rounded-xl flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Invoice</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  Create New Bill
                </button>
                <button
                  onClick={handlePrintMock}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-colors cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Printer size={13} />
                  <span>Simulate Print</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
