/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Product, Invoice, NotificationItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_INVOICES, WEEKLY_SALES_DATA } from './data';
import { MobileFrame } from './components/MobileFrame';
import { SplashView } from './components/SplashView';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';

import { DashboardTab } from './components/DashboardTab';
import { InventoryTab } from './components/InventoryTab';
import { BillingTab } from './components/BillingTab';
import { ReportsTab } from './components/ReportsTab';
import { ProfileTab } from './components/ProfileTab';

import { NotificationsView } from './components/NotificationsView';
import { HelpSupportView } from './components/HelpSupportView';
import { SubscriptionView } from './components/SubscriptionView';

import { Language, t } from './lang';
import { SecurityPinScreen } from './components/advanced/SecurityPinScreen';
import { AdvancedSaaSModules } from './components/advanced/AdvancedSaaSModules';

import { 
  FolderPlus, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  User, 
  Bell, 
  HelpCircle,
  BadgeAlert,
  Languages,
  Shield,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Theme State (global default)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('smartkirana_theme') as 'light' | 'dark') || 'light';
  });

  // Toggle theme action
  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('smartkirana_theme', next);
      return next;
    });
  };

  // Sync theme with document class (standard Tailwind class-based dark mode)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- SaaS states ---
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('smartkirana_lang') as Language) || 'en';
  });

  const handleToggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('smartkirana_lang', next);
      return next;
    });
  };

  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isSaaSOpen, setIsSaaSOpen] = useState<boolean>(false);

  // 1. Root Screen States: SPLASH | LOGIN | SIGNUP | APP
  const [currentScreen, setCurrentScreen] = useState<'SPLASH' | 'LOGIN' | 'SIGNUP' | 'APP'>('SPLASH');
  
  // 2. Active Bottom Navigation Tab
  const [currentTab, setCurrentTab] = useState<'DASHBOARD' | 'INVENTORY' | 'BILLING' | 'REPORTS' | 'PROFILE'>('DASHBOARD');

  // 3. User & Store States
  const [storeName, setStoreName] = useState('Apna Kirana Store');
  const [ownerName, setOwnerName] = useState('Suresh Patel');
  const [mobileNum, setMobileNum] = useState('9876543210');
  const [dailySalesTarget, setDailySalesTarget] = useState<number>(() => {
    const cached = localStorage.getItem('smartkirana_daily_sales_target');
    return cached ? parseInt(cached, 10) : 2000;
  });

  // 4. Shared Inventory Catalog and Invoice History States (In-Memory for prototype lifespan)
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // 5. Dynamic Sales Progress stats
  const [weeklySales, setWeeklySales] = useState(WEEKLY_SALES_DATA);

  // 6. Active Notification Logs
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // 7. Component Overlay Flags
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [openAddProduct, setOpenAddProduct] = useState(false);

  // 8. Lifted Billing Cart State with instant stock adjustments
  const [cart, setCart] = useState<{ [sku: string]: { product: Product; quantity: number } }>({});

  // Initialize initial dataset inside useEffect
  useEffect(() => {
    // Read from localStorage if existing, or use standard dummy data
    const cachedProds = localStorage.getItem('smartkirana_products');
    const cachedInvoices = localStorage.getItem('smartkirana_invoices');
    const cachedNotifs = localStorage.getItem('smartkirana_notifications');

    if (cachedProds) {
      setProducts(JSON.parse(cachedProds));
    } else {
      setProducts(INITIAL_PRODUCTS);
    }

    if (cachedInvoices) {
      setInvoices(JSON.parse(cachedInvoices));
    } else {
      setInvoices(INITIAL_INVOICES);
    }

    // Default notifications setup if empty
    if (cachedNotifs) {
      setNotifications(JSON.parse(cachedNotifs));
    } else {
      setNotifications([
        {
          id: "NOT-001",
          title: "⚠️ Low Stock alert: Pure Sugar",
          description: "Madhur Pure Sugar stock fell below limit! Left with only 15 kg. Restock immediately from Shree Balaji Traders.",
          timestamp: "10 mins ago",
          type: "lowStock",
          read: false
        },
        {
          id: "NOT-002",
          title: "🎉 Daily Turnover Goal Reached!",
          description: "Congratulations! Today's aggregates crossed ₹1,500 milestone. Customer footfall is 18% higher than yesterday.",
          timestamp: "1 hr ago",
          type: "milestone",
          read: false
        },
        {
          id: "NOT-003",
          title: "🗓️ Premium Subscription renewal",
          description: "Your SmartPro ₹99 subscription will process auto-renewal on June 10, 2026 via registered BHIM UPI.",
          timestamp: "3 hrs ago",
          type: "subscription",
          read: false
        }
      ]);
    }
  }, []);

  // Write changes persistently to localStorage to maintain mock data state
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('smartkirana_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (invoices.length > 0) {
      localStorage.setItem('smartkirana_invoices', JSON.stringify(invoices));
    }
  }, [invoices]);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('smartkirana_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smartkirana_daily_sales_target', dailySalesTarget.toString());
  }, [dailySalesTarget]);

  // Authenticate Success triggers
  const handleAuthSuccess = (name: string, shop: string, num: string) => {
    setOwnerName(name);
    setStoreName(shop);
    setMobileNum(num);
    
    // Auto-setup congratulations notice
    const greetingNotice: NotificationItem = {
      id: `GREET-${Date.now()}`,
      title: "🔐 Authenticated Successfully",
      description: `Welcome back to SmartKirana, ${name}! Logged into '${shop}' securely. Handheld POS system is standing by.`,
      timestamp: "Just Now",
      type: "alert",
      read: false
    };
    setNotifications(prev => [greetingNotice, ...prev]);
    setCurrentScreen('APP');
  };

  // Add Product to catalog list in-memory
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    
    // Log Notification log
    const addNotice: NotificationItem = {
      id: `ADD-${Date.now()}`,
      title: `📦 Catalogue Addition: ${newProd.name}`,
      description: `Successfully added ${newProd.name} under ${newProd.category} category. Shelf pricing is specified as ₹${newProd.price}.`,
      timestamp: "Just Now",
      type: "alert",
      read: false
    };
    setNotifications(prev => [addNotice, ...prev]);
  };

  // Restock adjust stock directly
  const handleUpdateStock = (sku: string, nextStock: number) => {
    setProducts(prev => prev.map(p => p.sku === sku ? { ...p, stock: nextStock } : p));
  };

  // Lifted Cart & Real-time stock-deducting handlers
  const handleAddToCart = (product: Product) => {
    const currentProduct = products.find(p => p.sku === product.sku);
    if (!currentProduct || currentProduct.stock <= 0) {
      alert(`Cannot add more. Solid stock limit reached! Only ${currentProduct ? currentProduct.stock : 0} available.`);
      return;
    }

    // Deduct stock in master list immediately
    setProducts(prev => prev.map(p => p.sku === product.sku ? { ...p, stock: p.stock - 1 } : p));

    // Add or increment in cart
    setCart(prev => {
      const existing = prev[product.sku];
      return {
        ...prev,
        [product.sku]: {
          product: { ...currentProduct, stock: currentProduct.stock - 1 },
          quantity: (existing ? existing.quantity : 0) + 1
        }
      };
    });
  };

  const handleDecreaseCartQty = (sku: string) => {
    const existing = cart[sku];
    if (!existing) return;

    // Return stock to master list
    setProducts(prev => prev.map(p => p.sku === sku ? { ...p, stock: p.stock + 1 } : p));

    // Decrement or remove from cart
    setCart(prev => {
      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[sku];
        return copy;
      } else {
        return {
          ...prev,
          [sku]: {
            ...existing,
            quantity: existing.quantity - 1
          }
        };
      }
    });
  };

  const handleRemoveFromCart = (sku: string) => {
    const existing = cart[sku];
    if (!existing) return;

    // Return all cart stock to master list
    setProducts(prev => prev.map(p => p.sku === sku ? { ...p, stock: p.stock + existing.quantity } : p));

    // Remove from cart
    setCart(prev => {
      const copy = { ...prev };
      delete copy[sku];
      return copy;
    });
  };

  const handleClearCart = () => {
    setProducts(prev => prev.map(p => {
      const cartItem = cart[p.sku];
      if (cartItem) {
        return { ...p, stock: p.stock + cartItem.quantity };
      }
      return p;
    }));
    setCart({});
  };

  // Billing checkout submission: deduct stock and calculate graphs
  const handleGenerateInvoice = (newInvoice: Invoice) => {
    // 1. Append invoice to overall billing log ledger
    setInvoices(prev => [newInvoice, ...prev]);

    // 2. We don't need to adjust products stock levels because they were already reduced as items were added to the cart!
    // But we still want to trigger low stock notification warnings!
    newInvoice.items.forEach(item => {
      const currentProduct = products.find(p => p.sku === item.sku);
      if (currentProduct) {
        const finalStock = currentProduct.stock;
        const wasAboveStock = (finalStock + item.quantity) > currentProduct.lowStockThreshold;
        const isLowNow = finalStock <= currentProduct.lowStockThreshold;

        if (wasAboveStock && isLowNow) {
          const lowNotice: NotificationItem = {
            id: `LOW-${Date.now()}-${currentProduct.sku}`,
            title: `⚠️ Critical Stock Alert`,
            description: `'${currentProduct.name}' count fell to ${finalStock} ${currentProduct.unit}. Please order backup stock from supplier: ${currentProduct.supplier}.`,
            timestamp: "Just Now",
            type: "lowStock",
            read: false
          };
          setNotifications(prev => [lowNotice, ...prev]);
        }
      }
    });

    // 3. Increment milestone push for large baskets
    if (newInvoice.total >= 800) {
      const milestoneNotice: NotificationItem = {
        id: `MIL-${Date.now()}`,
        title: "🔥 High Sales Achievement!",
        description: `Bumper sales recorded! Generated checkout billing totals of ₹${newInvoice.total} from buyer ${newInvoice.customerName || "walk-in visitor"}.`,
        timestamp: "Just Now",
        type: "milestone",
        read: false
      };
      setNotifications(prev => [milestoneNotice, ...prev]);
    }

    // 4. Update the Weekly Trend Line Chart dynamically! (Adding transaction value to today's summary)
    setWeeklySales(prevSales => {
      return prevSales.map((dayData, index) => {
        // Today is Wednesday June 3 (represented as index 7: "Wed (03)")
        if (index === prevSales.length - 1) {
          return {
            ...dayData,
            sales: dayData.sales + newInvoice.total
          };
        }
        return dayData;
      });
    });

    // 5. Commit checkout complete: clear cart state without returning products stock level (since they are sold)
    setCart({});
  };

  // Editing profile fields
  const handleUpdateStoreDetails = (updatedOwner: string, updatedStore: string) => {
    setOwnerName(updatedOwner);
    setStoreName(updatedStore);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Count unread notifications
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <MobileFrame>
      
      {/* 0. PIN Lock Active */}
      {isLocked && (
        <SecurityPinScreen 
          lang={lang} 
          onUnlock={() => setIsLocked(false)} 
        />
      )}
      
      {/* 1. Splash Screen Lifecycle */}
      {currentScreen === 'SPLASH' && (
        <SplashView onComplete={() => setCurrentScreen('LOGIN')} />
      )}

      {/* 2. Login Screen */}
      {currentScreen === 'LOGIN' && (
        <LoginView
          onLoginSuccess={handleAuthSuccess}
          onNavigateToSignup={() => setCurrentScreen('SIGNUP')}
        />
      )}

      {/* 3. Signup Registration Screen */}
      {currentScreen === 'SIGNUP' && (
        <SignupView
          onSignupSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setCurrentScreen('LOGIN')}
        />
      )}

      {/* 4. Core Application View */}
      {currentScreen === 'APP' && (
        <div id="smartkirana-app" className="w-full h-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden relative transition-colors duration-200">
          
          {/* Main Visual Header Row */}
          <div className="bg-blue-600 dark:bg-slate-900 text-white px-5 py-3 border-b border-blue-700/40 dark:border-slate-800/80 flex justify-between items-center shrink-0 z-40 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider uppercase flex items-center gap-1">
                Smart<span className="text-emerald-400 font-extrabold lowercase italic">kirana</span>
              </span>
            </div>

            {/* Quick Actions overlay icons */}
            <div className="flex items-center gap-2.5">
              
              {/* Admin Hub Button */}
              <button
                onClick={() => setIsSaaSOpen(true)}
                title="SaaS Admin Suite"
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 active:bg-white/25 px-2 py-1 rounded-xl text-white font-black text-[10px] uppercase cursor-pointer border border-white/10 transition-all select-none font-mono"
              >
                <Sparkles size={11} className="text-amber-300 animate-pulse" />
                <span>Admin Hub</span>
              </button>

              {/* Language Switch */}
              <button
                onClick={handleToggleLang}
                title="Language Switcher"
                className="h-7 w-7 flex items-center justify-center bg-white/10 hover:bg-white/15 text-blue-100 hover:text-white rounded-lg cursor-pointer transition-colors"
              >
                <Languages size={15} />
              </button>
              
              {/* Notifications bell trigger */}
              <button
                onClick={() => setShowNotifications(true)}
                title="View Notifications"
                className="relative p-1 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-rose-600 text-[9px] font-black font-sans text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* FAQ Help Support Trigger */}
              <button
                onClick={() => setShowHelp(true)}
                title="Get Help FAQS"
                className="p-1 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              >
                <HelpCircle size={18} />
              </button>

            </div>
          </div>

          {/* Core viewports dynamic router */}
          <div className="flex-1 w-full overflow-hidden relative">
            
            {currentTab === 'DASHBOARD' && (
              <DashboardTab
                products={products}
                invoices={invoices}
                weeklySales={weeklySales}
                dailySalesTarget={dailySalesTarget}
                onOpenAddProduct={() => {
                  setCurrentTab('INVENTORY');
                  setOpenAddProduct(true);
                }}
                onNavigateTab={(tab) => {
                  setCurrentTab(tab);
                  setOpenAddProduct(false);
                }}
              />
            )}

            {currentTab === 'INVENTORY' && (
              <InventoryTab
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateStock={handleUpdateStock}
                openAddProductDirectly={openAddProduct}
                onCloseAddProductDirectly={() => setOpenAddProduct(false)}
                storeName={storeName}
              />
            )}

            {currentTab === 'BILLING' && (
              <BillingTab
                products={products}
                invoices={invoices}
                onGenerateInvoice={handleGenerateInvoice}
                onNavigateTab={setCurrentTab}
                cart={cart}
                onAddToCart={handleAddToCart}
                onDecreaseCartQty={handleDecreaseCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
              />
            )}

            {currentTab === 'REPORTS' && (
              <ReportsTab
                products={products}
                invoices={invoices}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'PROFILE' && (
              <ProfileTab
                storeName={storeName}
                ownerName={ownerName}
                mobile={mobileNum}
                dailySalesTarget={dailySalesTarget}
                onUpdateDailyTarget={setDailySalesTarget}
                onOpenHelp={() => setShowHelp(true)}
                onOpenNotifications={() => setShowNotifications(true)}
                onOpenSubscription={() => setShowSubscription(true)}
                onUpdateStoreDetails={handleUpdateStoreDetails}
                onLogout={() => {
                  const confirmLogout = window.confirm("Are you sure you want to log out of SmartKirana?");
                  if (confirmLogout) {
                    handleClearCart();
                    setCurrentScreen('LOGIN');
                    setCurrentTab('DASHBOARD');
                  }
                }}
                theme={theme}
                onToggleTheme={handleToggleTheme}
              />
            )}

          </div>

          {/* High-Fidelity Bottom Navigation Tab Rail */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800/80 flex justify-around items-center px-2 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] z-40 select-none rounded-t-2xl transition-colors duration-200">
            
            {/* Dashboard Tab element */}
            <button
              onClick={() => {
                setCurrentTab('DASHBOARD');
                setOpenAddProduct(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors rounded-xl ${
                currentTab === 'DASHBOARD' ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400'
              }`}
            >
              <LayoutDashboard size={18} className="stroke-[2.5]" />
              <span className="text-[9px] mt-1 tracking-wide uppercase font-black">Home</span>
            </button>

            {/* Inventory Tab element */}
            <button
              onClick={() => {
                setCurrentTab('INVENTORY');
                setOpenAddProduct(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors rounded-xl ${
                currentTab === 'INVENTORY' ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400'
              }`}
            >
              <Package size={18} className="stroke-[2.5]" />
              <span className="text-[9px] mt-1 tracking-wide uppercase font-black">Inventory</span>
            </button>

            {/* Billing checkout Tab element */}
            <button
              onClick={() => {
                setCurrentTab('BILLING');
                setOpenAddProduct(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors rounded-xl ${
                currentTab === 'BILLING' ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400'
              }`}
            >
              <ShoppingCart size={18} className="stroke-[2.5]" />
              <span className="text-[9px] mt-1 tracking-wide uppercase font-black">Billing</span>
            </button>

            {/* Reports Charts Tab element */}
            <button
              onClick={() => {
                setCurrentTab('REPORTS');
                setOpenAddProduct(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors rounded-xl ${
                currentTab === 'REPORTS' ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400'
              }`}
            >
              <BarChart3 size={18} className="stroke-[2.5]" />
              <span className="text-[9px] mt-1 tracking-wide uppercase font-black">Charts</span>
            </button>

            {/* Profile Tab element */}
            <button
              onClick={() => {
                setCurrentTab('PROFILE');
                setOpenAddProduct(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors rounded-xl ${
                currentTab === 'PROFILE' ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400'
              }`}
            >
              <User size={18} className="stroke-[2.5]" />
              <span className="text-[9px] mt-1 tracking-wide uppercase font-black">Profile</span>
            </button>

          </div>

          {/* OVERLAY MODULES: RENDERED AS TOP LEVEL COHERENT VIEWS */}

          {/* Notifications Overlays drawer */}
          {showNotifications && (
            <NotificationsView
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onClearAll={handleClearAllNotifications}
              onMarkRead={handleMarkNotificationRead}
              onNavigateToStock={() => {
                setCurrentTab('INVENTORY');
                setShowNotifications(false);
              }}
            />
          )}

          {/* FAQ support guide drawer overlay */}
          {showHelp && (
            <HelpSupportView
              onClose={() => setShowHelp(false)}
            />
          )}

          {/* Premium Subscription plan details drawer overlay */}
          {showSubscription && (
            <SubscriptionView
              onClose={() => setShowSubscription(false)}
            />
          )}

          {/* Advanced SaaS Admin Hub Drawer */}
          {isSaaSOpen && (
            <AdvancedSaaSModules
              products={products}
              onUpdateProducts={setProducts}
              invoices={invoices}
              onUpdateInvoices={setInvoices}
              lang={lang}
              onToggleLang={handleToggleLang}
              isOpen={isSaaSOpen}
              onClose={() => setIsSaaSOpen(false)}
            />
          )}

        </div>
      )}

    </MobileFrame>
  );
}
