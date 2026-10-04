import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Trash2, X, GraduationCap, 
  Search, Plus, ShieldCheck,
  Package, LogOut, Layers, BarChart3,
  Sun, Moon, CheckCircle, MessageSquare, Clock,
  ShoppingBag, Send, AlertCircle, Star, Filter, Eye, Check, Activity, User, CreditCard, Truck, PhoneCall,
  DollarSign, TrendingUp, Bell, CheckSquare, RefreshCw, PieChart
} from 'lucide-react';

// حسابات الأدمن المتاحة
const ADMIN_ACCOUNTS = [
  { username: "admin", password: "123" },
  { username: "dev", password: "mostafa1512" }
];

const DEFAULT_CATEGORIES = [
  { id: 'sec', name: 'مذكرات وكتب SEC' },
  { id: 'tools', name: 'حاسبات وأدوات' },
  { id: 'supplies', name: 'مستلزمات مكتبية' }
];

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'مذكرة المراجعة النهائية - الرياضيات',
    category: 'sec',
    price: 85,
    description: 'مراجعة شاملة لجميع أجزاء المنهج مع حل أسئلة الامتحانات السابقة.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=60',
    badge: 'الأكثر مبيعاً',
    inStock: true,
    rating: 5
  },
  {
    id: '2',
    name: 'حاسبة علمية متطورة Casio',
    category: 'tools',
    price: 450,
    description: 'حاسبة برمجية معتمدة للامتحانات الرسمية.',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&auto=format&fit=crop&q=60',
    badge: 'جديد',
    inStock: true,
    rating: 4.8
  }
];

export default function App() {
  const [isAdminPath, setIsAdminPath] = useState(false);

  useEffect(() => {
    const checkPath = () => {
      setIsAdminPath(window.location.pathname.includes('/admin'));
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  const [darkMode, setDarkMode] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // LocalStorage States
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sec_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sec_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('sec_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('sec_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('sec_activity_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'LOG-1', user: 'system', action: 'تهيئة النظام وسجل العمليات', timestamp: new Date().toLocaleString('ar-EG') }
    ];
  });

  const [adminTab, setAdminTab] = useState('dashboard');
  const [showIntro, setShowIntro] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  // Checkout Form States
  const [checkoutStep, setCheckoutStep] = useState('cart'); 
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  // Form States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newComplaint, setNewComplaint] = useState({ name: '', phone: '', message: '' });
  const [newProduct, setNewProduct] = useState({ 
    name: '', category: categories[0]?.id || 'sec', price: '', description: '', image: '', badge: 'جديد', inStock: true 
  });

  // الصوت والتنبيه اللحظي للطلبات الجديدة
  const prevOrdersLength = useRef(orders.length);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  // المزامنة والتحديث اللحظي عبر المتصفحات/  
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sec_orders') {
        const newOrders = JSON.parse(e.newValue || '[]');
        if (newOrders.length > orders.length) {
          playNotificationSound();
          showToast(' طلب جديد وصل الآن إلى المتجر!');
        }
        setOrders(newOrders);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [orders.length]);

  useEffect(() => {
    localStorage.setItem('sec_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sec_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sec_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sec_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('sec_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addLog = (user, action) => {
    const newLog = {
      id: 'LOG-' + Date.now(),
      user: user || currentUser || 'زائر',
      action,
      timestamp: new Date().toLocaleString('ar-EG')
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const foundUser = ADMIN_ACCOUNTS.find(
      (acc) => acc.username === loginForm.username && acc.password === loginForm.password
    );

    if (foundUser) {
      setIsAdminLoggedIn(true);
      setCurrentUser(foundUser.username);
      setLoginForm({ username: '', password: '' });
      setLoginError('');
      showToast(`مرحباً بك ${foundUser.username}! 👋`);
      addLog(foundUser.username, 'تسجيل دخول إلى لوحة التحكم');
    } else {
      setLoginError('اسم المستخدم أو كلمة السر غير صحيحة ');
    }
  };

  const handleAdminLogout = () => {
    addLog(currentUser, 'تسجيل الخروج من لوحة التحكم');
    setIsAdminLoggedIn(false);
    setCurrentUser('');
    window.history.pushState({}, '', '/');
    setIsAdminPath(false);
  };

  // إدارة الطلبات (تغيير الحالة والحذف)
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addLog(currentUser, `تغيير حالة الطلب (${orderId}) إلى: ${newStatus}`);
    showToast(`تم تحديث حالة الطلب إلى: ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (confirm(`هل تريد بالتأكيد حذف الطلب رقم ${orderId}؟`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      addLog(currentUser, `حذف الطلب رقم: (${orderId})`);
      showToast('تم حذف الطلب بنجاح ');
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const createdCat = { id: 'cat-' + Date.now(), name: newCategoryName.trim() };
    setCategories((prev) => [...prev, createdCat]);
    addLog(currentUser, `إضافة كتالوج جديد: (${newCategoryName.trim()})`);
    setNewCategoryName('');
    showToast('تم إضافة الكتالوج بنجاح! ');
  };

  const handleDeleteCategory = (id) => {
    const target = categories.find((c) => String(c.id) === String(id));
    if (confirm('هل أنت تأكد من حذف هذا الكتالوج؟')) {
      setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));
      addLog(currentUser, `حذف كتالوج: (${target?.name || id})`);
      showToast('تم الحذف بنجاح.');
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const item = { 
      ...newProduct, 
      id: Date.now().toString(), 
      price: Number(newProduct.price),
      category: String(newProduct.category || categories[0]?.id || 'sec'),
      rating: 5,
      image: newProduct.image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=60'
    };
    setProducts((prev) => [item, ...prev]);
    addLog(currentUser, `نشر منتج جديد: (${newProduct.name}) بسعر ${newProduct.price} ج.م`);
    setNewProduct({ name: '', category: categories[0]?.id || 'sec', price: '', description: '', image: '', badge: 'جديد', inStock: true });
    showToast('تم نشر المنتج في المتجر! ');
  };

  const handleDeleteProduct = (id) => {
    const target = products.find((p) => String(p.id) === String(id));
    if (confirm('هل أنت تأكد من حذف هذا المنتج؟')) {
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      addLog(currentUser, `حذف منتج: (${target?.name || id})`);
      showToast('تم حذف المنتج.');
    }
  };

  const toggleStockStatus = (id) => {
    let updatedName = '';
    let newStatus = false;

    setProducts((prev) => prev.map(p => {
      if (String(p.id) === String(id)) {
        updatedName = p.name;
        newStatus = !p.inStock;
        return { ...p, inStock: !p.inStock };
      }
      return p;
    }));

    addLog(currentUser, `تغيير حالة توفر المنتج (${updatedName}) إلى: ${newStatus ? 'متوفر' : 'غير متوفر'}`);
  };

  const handleSendComplaint = (e) => {
    e.preventDefault();
    if (!newComplaint.message || !newComplaint.phone) return;
    const item = {
      id: 'CMP-' + Date.now(),
      ...newComplaint,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setComplaints((prev) => [item, ...prev]);
    addLog('زبون', `إرسال شكوى جديدة من رقم (${newComplaint.phone})`);
    setNewComplaint({ name: '', phone: '', message: '' });
    setIsComplaintOpen(false);
    showToast('تم إرسال رسالتك وسنقرأها فوراً! ');
  };

  const toggleComplaintRead = (id) => {
    setComplaints((prev) => prev.map(c => String(c.id) === String(id) ? { ...c, read: true } : c));
    addLog(currentUser, `قراءة الشكوى رقم: (${id})`);
  };

  const addToCart = (product) => {
    if (!product.inStock) return;
    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return prev.map((item) => String(item.id) === String(product.id) ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast('تم إضافة المنتج لسلة التسوق! ');
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (String(item.id) === String(id)) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  // إتمام الطلب وتفعيل التنبيه اللحظي
  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) return;

    let paymentMethodLabel = '';
    if (paymentMethod === 'cod') paymentMethodLabel = 'الدفع عند الاستلام (COD)';
    if (paymentMethod === 'card') paymentMethodLabel = 'بطاقة بنكية / أونلاين محلي';
    if (paymentMethod === 'whatsapp') paymentMethodLabel = 'تحويل وإتمام عبر الواتساب';

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address || 'لم يحدد العنوان',
      total: grandTotal,
      paymentMethod: paymentMethodLabel,
      date: new Date().toISOString().split('T')[0],
      status: paymentMethod === 'card' ? 'تم الدفع (إلكتروني)' : 'قيد الانتظار',
      items: cart.map(item => ({ name: item.name, qty: item.qty, price: item.price }))
    };

    // حفظ الطلب وإطلاق الإشعار والصوت
    setOrders((prev) => [newOrder, ...prev]);
    playNotificationSound();
    addLog(customerInfo.name, `إنشاء طلب جديد رقم (${newOrder.id}) بقيمة ${grandTotal} ج.م [طريقة الدفع: ${paymentMethodLabel}]`);

    if (paymentMethod === 'whatsapp') {
      const itemsList = cart.map(i => `- ${i.name} (${i.qty}x)`).join('\n');
      const message = `مرحباً، أريد تأكيد الطلب رقم *${orderId}*\n\n*الاسم:* ${customerInfo.name}\n*الهاتف:* ${customerInfo.phone}\n*العنوان:* ${customerInfo.address}\n\n*المنتجات:*\n${itemsList}\n\n*الإجمالي:* ${grandTotal} ج.م`;
      window.open(`https://wa.me/201000000000?text=${encodeURIComponent(message)}`);
    }

    setCart([]);
    setIsCartOpen(false);
    setCheckoutStep('cart');
    setCustomerInfo({ name: '', phone: '', address: '' });
    showToast('تم إرسال طلبك بنجاح وسيرسل إشعار لحظي للأدمن ');
  };

  const grandTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.qty, 0), [cart]);

  // إحصائيات الأرباح والمؤشرات المالية
  const revenueStats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const completedRevenue = orders.filter(o => o.status === 'مكتمل' || o.status === 'تم الدفع (إلكتروني)').reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const pendingRevenue = orders.filter(o => o.status === 'قيد الانتظار' || o.status === 'قيد التوصيل').reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    
    // المبيعات حسب طريقة الدفع
    const codRevenue = orders.filter(o => o.paymentMethod?.includes('COD')).reduce((a, c) => a + Number(c.total), 0);
    const cardRevenue = orders.filter(o => o.paymentMethod?.includes('بطاقة')).reduce((a, c) => a + Number(c.total), 0);
    const whatsappRevenue = orders.filter(o => o.paymentMethod?.includes('الواتساب')).reduce((a, c) => a + Number(c.total), 0);

    return { totalRevenue, completedRevenue, pendingRevenue, avgOrderValue, codRevenue, cardRevenue, whatsappRevenue };
  }, [orders]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || String(p.category) === String(selectedCategory);
      const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const adminFilteredProducts = useMemo(() => {
    return products.filter(p => (p.name || '').toLowerCase().includes(adminSearchTerm.toLowerCase().trim()));
  }, [products, adminSearchTerm]);

  return (
    <div className={`min-h-screen font-['Cairo'] relative overflow-x-hidden transition-colors duration-500 selection:bg-[#D4AF37] selection:text-black ${
      darkMode ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`} dir="rtl">

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 z-[9999] bg-gradient-to-r from-amber-400 to-[#D4AF37] text-black font-black py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs"
          >
            <Bell className="w-4 h-4 animate-bounce"/>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${darkMode ? 'bg-[#030712]' : 'bg-slate-50'}`}>
            <div className="relative text-center z-10 flex flex-col items-center">
              <div className="p-4 bg-gradient-to-tr from-amber-500/20 via-yellow-400/10 to-transparent rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-xl mb-4">
                <GraduationCap className="w-14 h-14 text-[#D4AF37]"/>
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-amber-200 via-[#D4AF37] to-yellow-500 bg-clip-text text-transparent">SEC STORE</h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          {/* Header */}
          <header className={`sticky top-0 z-40 backdrop-blur-2xl border-b px-4 md:px-8 py-3.5 flex justify-between items-center shadow-sm ${
            darkMode ? 'bg-[#090d16]/90 border-slate-800/80' : 'bg-white/90 border-slate-200/80'
          }`}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { window.history.pushState({}, '', '/'); setIsAdminPath(false); }}>
              <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-amber-300/5 rounded-2xl border border-amber-500/30 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-[#D4AF37]"/>
              </div>
              <div>
                <h1 className="text-lg font-black bg-gradient-to-r from-amber-300 via-[#D4AF37] to-yellow-500 bg-clip-text text-transparent">SEC STORE</h1>
                <p className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>المنصة التعليمية الشاملة</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdminPath && isAdminLoggedIn && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>متصل لحظياً (Live)</span>
                </div>
              )}

              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-2xl border transition-all hover:scale-105 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-400/50' : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400/50'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
              </button>

              {isAdminPath && isAdminLoggedIn && (
                <button onClick={handleAdminLogout} className="py-2.5 px-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all hover:shadow-lg hover:shadow-red-500/20">
                  <LogOut className="w-4 h-4"/>
                  <span>الخروج</span>
                </button>
              )}

              {!isAdminPath && (
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className={`relative p-2.5 border rounded-2xl flex items-center gap-2 transition-all hover:scale-105 hover:border-amber-400/50 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 text-[#D4AF37]"/>
                  {cart.length > 0 && (
                    <span className="bg-amber-400 text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cart.reduce((a, c) => a + c.qty, 0)}
                    </span>
                  )}
                </button>
              )}
            </div>
          </header>

          {/* لوحة تحكم الأدمن */}
          {isAdminPath ? (
            !isAdminLoggedIn ? (
              <div className="min-h-[80vh] flex items-center justify-center px-4 relative z-10">
                <div className={`w-full max-w-md border rounded-3xl p-8 shadow-2xl backdrop-blur-xl ${
                  darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white/90 border-slate-200'
                }`}>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-3xl flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-8 h-8 text-[#D4AF37]"/>
                    </div>
                    <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>تسجيل دخول الأدمن</h2>
                    <p className="text-xs text-slate-400 mt-1">لوحة الإدارة والتحكم بالأوامر والمنتجات</p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 mb-1 block">اسم المستخدم</label>
                      <input
                        type="text"
                        placeholder="admin أو dev"
                        required
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className={`w-full p-3.5 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 mb-1 block">كلمة المرور</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={`w-full p-3.5 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                      />
                    </div>
                    {loginError && <p className="text-xs text-red-500 font-bold text-center">{loginError}</p>}
                    <button 
                      type="submit" 
                      className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-[#D4AF37] text-black font-black text-xs rounded-2xl hover:brightness-110 transition-all hover:shadow-lg hover:shadow-amber-400/20"
                    >
                      دخول لوحة التحكم
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
                {/* Sidebar */}
                <aside className={`w-full lg:w-64 border-b lg:border-b-0 lg:border-l p-4 flex flex-row lg:flex-col gap-2 shrink-0 ${
                  darkMode ? 'bg-[#0c1322] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="hidden lg:block px-3 py-2 mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">لوحة الإدارة والتحكم</p>
                  </div>

                  {[
                    { id: 'dashboard', label: 'الإحصائيات العامة', icon: BarChart3 },
                    { id: 'revenue', label: 'تجميع الأرباح والمبيعات', icon: DollarSign },
                    // { id: 'analytics', label: 'مؤشرات الأداء (Analytics)', icon: TrendingUp },
                    { id: 'orders', label: 'الطلبات المباشرة', icon: ShoppingBag, badge: orders.length },
                    { id: 'products', label: 'المنتجات والمخزون', icon: Package },
                    { id: 'categories', label: 'الكتالوجات والتصنيفات', icon: Layers },
                    { id: 'complaints', label: 'الشكاوى والرسائل', icon: MessageSquare, badge: complaints.filter(c => !c.read).length },
                    { id: 'logs', label: 'سجل العمليات', icon: Activity }
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = adminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setAdminTab(item.id)}
                        className={`flex-1 lg:flex-initial p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all hover:scale-[1.02] ${
                          active 
                            ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-400/20' 
                            : darkMode ? 'text-slate-400 hover:bg-slate-800/50' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4"/>
                          <span>{item.label}</span>
                        </div>
                        {item.badge > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            active ? 'bg-black text-amber-400' : 'bg-amber-400 text-black'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </aside>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
                  
                  {/* Dashboard Tab */}
                  {adminTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-black">نظرة عامة على النظام</h2>
                          <p className="text-xs text-slate-400">استقبال لحظي ومباشر للطلبات الميدانية</p>
                        </div>
                        <button onClick={playNotificationSound} className="py-2 px-3 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs rounded-xl font-bold flex items-center gap-2 hover:bg-amber-400 hover:text-black transition-all">
                          <Bell className="w-3.5 h-3.5"/>
                          <span>تجربة نغمة الإشعار</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">إجمالي الطلبات</span>
                            <ShoppingBag className="w-5 h-5 text-amber-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-[#D4AF37]">{orders.length}</h3>
                          <p className="text-[10px] text-emerald-400 mt-2">تحديث مباشر بدون تنشيط</p>
                        </div>

                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">إجمالي الإيرادات</span>
                            <DollarSign className="w-5 h-5 text-emerald-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-emerald-400">{revenueStats.totalRevenue} ج.م</h3>
                          <p className="text-[10px] text-slate-400 mt-2">مجموع المبيعات الكلية</p>
                        </div>

                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">إجمالي المنتجات</span>
                            <Package className="w-5 h-5 text-amber-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-[#D4AF37]">{products.length}</h3>
                          <p className="text-[10px] text-slate-400 mt-2">منتج معروض بالمتجر</p>
                        </div>

                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">الشكاوى والاستفسارات</span>
                            <MessageSquare className="w-5 h-5 text-rose-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-rose-400">{complaints.length}</h3>
                          <p className="text-[10px] text-slate-400 mt-2">{complaints.filter(c => !c.read).length} لم تتم قراءتها</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Revenue Tab - شاشة تجميع الأرباح */}
                  {adminTab === 'revenue' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-black">شاشة تجميع الأرباح والتجميع المالي</h2>
                          <p className="text-xs text-slate-400">تفاصيل الخزينة والمبيعات حسب وسيلة الدفع</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-xs text-slate-400">الأرباح المُحصلة (المكتملة)</span>
                          <h3 className="text-3xl font-black text-emerald-400 my-2">{revenueStats.completedRevenue} ج.م</h3>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20">جاهزة للتحويل</span>
                        </div>

                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-xs text-slate-400">أرباح قيد التوصيل والتحصيل</span>
                          <h3 className="text-3xl font-black text-amber-400 my-2">{revenueStats.pendingRevenue} ج.م</h3>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/20">مع مندوب التوصيل</span>
                        </div>

                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-xs text-slate-400">متوسط قيمة الطلب الواحد</span>
                          <h3 className="text-3xl font-black text-sky-400 my-2">{revenueStats.avgOrderValue} ج.م</h3>
                          <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-lg border border-sky-500/20">معدل شراء العميل</span>
                        </div>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-sm mb-6">توزيع المبيعات حسب طرق الدفع</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="w-4 h-4 text-amber-400"/>
                              <span className="text-xs font-bold">الدفع عند الاستلام (COD)</span>
                            </div>
                            <p className="text-xl font-black text-white">{revenueStats.codRevenue} ج.م</p>
                          </div>

                          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-4 h-4 text-sky-400"/>
                              <span className="text-xs font-bold">بطاقات والدفع الإلكتروني</span>
                            </div>
                            <p className="text-xl font-black text-white">{revenueStats.cardRevenue} ج.م</p>
                          </div>

                          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-2 mb-2">
                              <PhoneCall className="w-4 h-4 text-emerald-400"/>
                              <span className="text-xs font-bold">تحويلات الواتساب</span>
                            </div>
                            <p className="text-xl font-black text-white">{revenueStats.whatsappRevenue} ج.م</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analytics Tab - شاشة مؤشر الأداء
                  {adminTab === 'analytics' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-black">شاشة المؤشرات والتحليلات البيانية</h2>
                        <p className="text-xs text-slate-400">رسم بياني توضيحي لمعدل الطلبات ونسب الإنجاز</p>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-sm mb-6">مؤشر نمو الطلبات والمبيعات (أسبوعي)</h3>
                        
                        Visual Chart Bars
                        <div className="h-48 flex items-end justify-between gap-3 pt-8 pb-2 px-4 border-b border-slate-800">
                          {[
                            { day: 'السبت', val: 40 },
                            { day: 'الأحد', val: 65 },
                            { day: 'الإثنين', val: 30 },
                            { day: 'الثلاثاء', val: 85 },
                            { day: 'الأربعاء', val: 50 },
                            { day: 'الخميس', val: 95 },
                            { day: 'الجمعة', val: 70 }
                          ].map((bar, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                              <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">{bar.val}%</span>
                              <div 
                                style={{ height: `${bar.val}%` }} 
                                className="w-full bg-gradient-to-t from-amber-500 to-[#D4AF37] rounded-t-xl group-hover:brightness-125 transition-all shadow-lg shadow-amber-500/20"
                              ></div>
                              <span className="text-[10px] text-slate-400 mt-2">{bar.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <h4 className="font-bold text-xs mb-3 text-slate-300">مؤشر معدل نجاح الطلبات</h4>
                          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex">
                            <div className="bg-emerald-500 h-full" style={{ width: '75%' }}></div>
                            <div className="bg-amber-400 h-full" style={{ width: '15%' }}></div>
                            <div className="bg-rose-500 h-full" style={{ width: '10%' }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold mt-2">
                            <span className="text-emerald-400">75% مكتمل</span>
                            <span className="text-amber-400">15% جاري التوصيل</span>
                            <span className="text-rose-400">10% ملغي</span>
                          </div>
                        </div>

                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <h4 className="font-bold text-xs mb-3 text-slate-300">مؤشر الإقبال على الكتالوجات</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[11px] font-bold mb-1">
                                <span>مذكرات وكتب SEC</span>
                                <span className="text-amber-400">65%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-400 h-full" style={{ width: '65%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] font-bold mb-1">
                                <span>حاسبات وأدوات</span>
                                <span className="text-sky-400">35%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-sky-400 h-full" style={{ width: '35%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* Orders Tab - مع إضافة زر الإجراءات وحذف الطلب */}
                  {adminTab === 'orders' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                          <div>
                            <h3 className="font-bold text-sm">إدارة الأوامر والطلبات الحية ({orders.length})</h3>
                            <p className="text-[11px] text-slate-400">يمكنك تحديث حالة أي طلب أو حذفه فوراً</p>
                          </div>
                          <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin"/>
                            استقبال لحظي
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-xs">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400">
                                <th className="py-3 px-2">رقم الطلب</th>
                                <th className="py-3 px-2">العميل والهاتف</th>
                                <th className="py-3 px-2">العنوان</th>
                                <th className="py-3 px-2">طريقة الدفع</th>
                                <th className="py-3 px-2">المنتجات</th>
                                <th className="py-3 px-2">الإجمالي</th>
                                <th className="py-3 px-2">الحالة</th>
                                <th className="py-3 px-2 text-center">إجراءات الأدمن</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                              {orders.map((ord) => (
                                <tr key={ord.id} className="hover:bg-slate-800/20 transition-colors">
                                  <td className="py-3.5 px-2 font-bold text-amber-400">{ord.id}</td>
                                  <td className="py-3.5 px-2">
                                    <div className="font-bold">{ord.customerName}</div>
                                    <div className="text-[10px] text-slate-400">{ord.phone}</div>
                                  </td>
                                  <td className="py-3.5 px-2 text-slate-300 max-w-[140px] truncate">{ord.address}</td>
                                  <td className="py-3.5 px-2 font-bold text-amber-300/80">{ord.paymentMethod}</td>
                                  <td className="py-3.5 px-2 text-slate-300">
                                    {ord.items ? ord.items.map((it, idx) => (
                                      <div key={idx} className="text-[11px]">{it.name} <span className="text-amber-400 font-bold">({it.qty}x)</span></div>
                                    )) : `${ord.itemsCount} عناصر`}
                                  </td>
                                  <td className="py-3.5 px-2 font-black text-[#D4AF37]">{ord.total} ج.م</td>
                                  <td className="py-3.5 px-2">
                                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                                      ord.status === 'مكتمل' || ord.status === 'تم الدفع (إلكتروني)' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                        : ord.status === 'قيد التوصيل'
                                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                        : ord.status === 'ملغي'
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                      {ord.status}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-2">
                                    <div className="flex items-center justify-center gap-1.5">
                                      {/* قائمة زر إجراء تغيير الحالة */}
                                      <select
                                        value={ord.status}
                                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                        className={`p-1.5 rounded-xl text-[10px] font-bold border ${
                                          darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                                        }`}
                                      >
                                        <option value="قيد الانتظار">قيد الانتظار</option>
                                        <option value="قيد التوصيل">قيد التوصيل</option>
                                        <option value="مكتمل">مكتمل</option>
                                        <option value="ملغي">ملغي</option>
                                      </select>

                                      {/* زر حذف الطلب */}
                                      <button 
                                        onClick={() => handleDeleteOrder(ord.id)}
                                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl hover:scale-105 transition-all"
                                        title="حذف الطلب"
                                      >
                                        <Trash2 className="w-3.5 h-3.5"/>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products Tab */}
                  {adminTab === 'products' && (
                    <div className="space-y-8">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-6 border-b pb-4 border-slate-800">
                          <Plus className="w-5 h-5 text-amber-400"/>
                          <h3 className="font-bold text-sm">إضافة منتج جديد</h3>
                        </div>

                        <form onSubmit={handleAddProductSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 mb-1 block">اسم المنتج *</label>
                              <input
                                type="text"
                                placeholder="مثال: مذكرة الرياضيات"
                                required
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-400 mb-1 block">السعر (ج.م) *</label>
                              <input
                                type="number"
                                placeholder="85"
                                required
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-400 mb-1 block">الكتالوج *</label>
                              <select
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-400 mb-1 block">رابط صورة المنتج (URL)</label>
                              <input
                                type="url"
                                placeholder="https://..."
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-400 mb-1 block">الشارة (Badge)</label>
                              <input
                                type="text"
                                placeholder="الأكثر مبيعاً"
                                value={newProduct.badge}
                                onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-400 mb-1 block">حالة التوفر</label>
                              <select
                                value={newProduct.inStock ? 'true' : 'false'}
                                onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.value === 'true' })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                              >
                                <option value="true">متوفر في المخزون</option>
                                <option value="false">غير متوفر</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 mb-1 block">وصف المنتج</label>
                            <textarea
                              rows="2"
                              placeholder="تفاصيل المنتج..."
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="py-3.5 px-8 bg-amber-400 text-black font-black text-xs rounded-2xl hover:bg-amber-300 hover:scale-[1.02] transition-all shadow-lg shadow-amber-400/10"
                          >
                            نشر المنتج
                          </button>
                        </form>
                      </div>

                      {/* Products List Table */}
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                          <h3 className="font-bold text-sm">المنتجات الحالية ({products.length})</h3>
                          <div className="relative w-full sm:w-64">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                            <input
                              type="text"
                              placeholder="بحث عن منتج..."
                              value={adminSearchTerm}
                              onChange={(e) => setAdminSearchTerm(e.target.value)}
                              className={`w-full pr-9 pl-3 py-2 border rounded-xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                            />
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-xs">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400">
                                <th className="py-3 px-2">المنتج</th>
                                <th className="py-3 px-2">الكتالوج</th>
                                <th className="py-3 px-2">السعر</th>
                                <th className="py-3 px-2">الحالة</th>
                                <th className="py-3 px-2">حذف</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                              {adminFilteredProducts.map((p) => (
                                <tr key={p.id}>
                                  <td className="py-3 px-2">
                                    <div className="flex items-center gap-3">
                                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-slate-800" />
                                      <span className="font-bold">{p.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 text-slate-400">{categories.find(c => String(c.id) === String(p.category))?.name || 'عام'}</td>
                                  <td className="py-3 px-2 font-black text-[#D4AF37]">{p.price} ج.م</td>
                                  <td className="py-3 px-2">
                                    <button 
                                      onClick={() => toggleStockStatus(p.id)}
                                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                                        p.inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                      }`}
                                    >
                                      {p.inStock ? 'متوفر' : 'غير متوفر'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-2">
                                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl hover:scale-110 transition-all">
                                      <Trash2 className="w-4 h-4"/>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Categories Tab */}
                  {adminTab === 'categories' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-sm mb-4">إضافة كتالوج جديد</h3>
                        <form onSubmit={handleAddCategory} className="flex gap-3">
                          <input
                            type="text"
                            placeholder="اسم الكتالوج الجديد..."
                            required
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className={`flex-1 p-3.5 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                          />
                          <button type="submit" className="py-3.5 px-6 bg-amber-400 text-black font-bold text-xs rounded-2xl hover:bg-amber-300 hover:scale-105 transition-all">إضافة</button>
                        </form>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-sm mb-4">الكتالوجات الحالية ({categories.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {categories.map((cat) => (
                            <div key={cat.id} className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                              <span className="font-bold text-xs">{cat.name}</span>
                              <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl hover:scale-110 transition-all">
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Complaints Tab */}
                  {adminTab === 'complaints' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-sm mb-4">صندوق الشكاوى والرسائل ({complaints.length})</h3>
                        <div className="space-y-3">
                          {complaints.length === 0 ? (
                            <p className="text-slate-500 text-xs text-center py-6">لا توجد شكاوى حالياً</p>
                          ) : (
                            complaints.map((cmp) => (
                              <div key={cmp.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                                cmp.read ? darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200' : 'bg-amber-500/10 border-amber-500/30'
                              }`}>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-xs">{cmp.name || 'عميل'}</h4>
                                    <span className="text-[10px] text-slate-400">({cmp.phone})</span>
                                    <span className="text-[10px] text-slate-500">{cmp.date}</span>
                                  </div>
                                  <p className="text-xs text-slate-300">{cmp.message}</p>
                                </div>
                                {!cmp.read && (
                                  <button onClick={() => toggleComplaintRead(cmp.id)} className="py-2 px-4 bg-amber-400 text-black font-bold text-[10px] rounded-xl hover:bg-amber-300">
                                    تحديد كـ "تمت القراءة"
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Logs Tab */}
                  {adminTab === 'logs' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-amber-400"/>
                            <h3 className="font-bold text-sm">سجل عمليات أدمن النظام (Audit Log)</h3>
                          </div>
                          <span className="text-xs text-slate-400 font-bold">{activityLogs.length} إجراء مُسجل</span>
                        </div>

                        <div className="space-y-3">
                          {activityLogs.map((log) => (
                            <div key={log.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                                  {log.user}
                                </div>
                                <span className="text-xs font-medium text-slate-200">{log.action}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold shrink-0">{log.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </main>
              </div>
            )
          ) : (

            /* Storefront Interface */
            <>
              <section className="py-12 px-6 text-center border-b border-slate-800/60 relative">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-3xl font-black mb-3">
                    متجر <span className="text-[#D4AF37]">SEC</span> التعليمي
                  </h2>
                  <p className="text-xs text-slate-400 mb-6">احصل على المذكرات المستلزمات التعليمية بسهولة</p>
                  
                  <div className="relative max-w-md mx-auto">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                    <input
                      type="text"
                      placeholder="ابحث عن المذكرة أو المنتج..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pr-11 pl-4 py-3 border rounded-2xl text-xs focus:outline-none focus:border-[#D4AF37] ${
                        darkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </section>

              <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:scale-105 ${
                      selectedCategory === 'all' 
                        ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-400/20' 
                        : darkMode ? 'bg-[#0f172a] text-slate-300 border border-slate-800' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    الكل ({products.length})
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:scale-105 ${
                        String(selectedCategory) === String(cat.id) 
                          ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-400/20' 
                          : darkMode ? 'bg-[#0f172a] text-slate-300 border border-slate-800' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                    لا توجد منتجات مضافة حالياً.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className={`border rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-amber-400/40 ${
                          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="h-44 rounded-2xl mb-4 overflow-hidden bg-slate-900 border border-slate-800 relative group">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {product.badge && (
                              <span className="absolute top-3 right-3 bg-amber-400 text-black text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 mb-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400"/>
                            <span className="text-[11px] font-bold text-slate-400">{product.rating || 5}.0</span>
                          </div>
                          <h3 className={`font-bold text-sm mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</h3>
                          <p className={`text-[11px] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{product.description}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[#D4AF37] font-black text-base">{product.price} ج.م</span>
                            {!product.inStock && <span className="text-rose-400 text-[10px] font-bold">غير متوفر</span>}
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className={`w-full py-3 font-bold text-xs rounded-2xl transition-all hover:scale-[1.02] ${
                              product.inStock 
                                ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-400/10' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {product.inStock ? 'إضافة للسلة' : 'غير متوفر'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Floating Complaints Button */}
              <button
                onClick={() => setIsComplaintOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-amber-400 to-[#D4AF37] text-black rounded-full shadow-2xl hover:scale-110 transition-all border-2 border-white/20 group"
                title="إرسال شكوى أو استفسار"
              >
                <MessageSquare className="w-6 h-6"/>
              </button>

              {/* Complaints Modal */}
              <AnimatePresence>
                {isComplaintOpen && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl ${
                        darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-amber-400"/>
                          <h3 className="font-bold text-sm">إرسال شكوى أو اقتراح</h3>
                        </div>
                        <button onClick={() => setIsComplaintOpen(false)}><X className="w-5 h-5 text-slate-400"/></button>
                      </div>

                      <form onSubmit={handleSendComplaint} className="space-y-4">
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">الاسم</label>
                          <input
                            type="text"
                            placeholder="اسمك (اختياري)"
                            value={newComplaint.name}
                            onChange={(e) => setNewComplaint({ ...newComplaint, name: e.target.value })}
                            className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">رقم الهاتف *</label>
                          <input
                            type="tel"
                            placeholder="010XXXXXXXX"
                            required
                            value={newComplaint.phone}
                            onChange={(e) => setNewComplaint({ ...newComplaint, phone: e.target.value })}
                            className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">الرسالة / الشكوى *</label>
                          <textarea
                            rows="3"
                            placeholder="اكتب تفاصيل الشكوى أو الاقتراح..."
                            required
                            value={newComplaint.message}
                            onChange={(e) => setNewComplaint({ ...newComplaint, message: e.target.value })}
                            className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                          />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-amber-400 text-black font-black text-xs rounded-2xl hover:bg-amber-300 transition-all flex items-center justify-center gap-2">
                          <Send className="w-4 h-4"/>
                          <span>إرسال الرسالة</span>
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Cart & Multi-Option Checkout Drawer */}
          <AnimatePresence>
            {isCartOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-end">
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto ${
                    darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-amber-400"/>
                        <h3 className="font-bold text-sm">
                          {checkoutStep === 'cart' ? 'سلة التسوق' : 'إتمام المشتريات والدفع'}
                        </h3>
                      </div>
                      <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}>
                        <X className="w-5 h-5 text-slate-400 hover:text-white"/>
                      </button>
                    </div>

                    {checkoutStep === 'cart' ? (
                      <div className="py-4 space-y-3">
                        {cart.length === 0 ? (
                          <div className="text-center py-16 text-slate-500 text-xs">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30"/>
                            السلة فارغة حالياً
                          </div>
                        ) : (
                          cart.map((item) => (
                            <div key={item.id} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-slate-800" />
                                <div>
                                  <h4 className="text-xs font-bold mb-1">{item.name}</h4>
                                  <span className="text-xs text-[#D4AF37] font-black">{item.price} ج.م</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 border border-slate-800 rounded-xl p-1 bg-black/20">
                                  <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center font-black rounded-lg hover:bg-slate-800 text-xs">-</button>
                                  <span className="text-xs font-bold px-1">{item.qty}</span>
                                  <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center font-black rounded-lg hover:bg-slate-800 text-xs">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                  <Trash2 className="w-4 h-4"/>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      /* Checkout Form Step */
                      <form id="checkout-form" onSubmit={handleCompleteOrder} className="py-4 space-y-5">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-amber-400">1. تفاصيل العميل والعنوان</h4>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">الاسم بالكامل *</label>
                            <input
                              type="text"
                              required
                              placeholder="أحمد محمد"
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">رقم الهاتف للتواصل *</label>
                            <input
                              type="tel"
                              required
                              placeholder="010XXXXXXXX"
                              value={customerInfo.phone}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">عنوان التوصيل التفصيلي *</label>
                            <input
                              type="text"
                              required
                              placeholder="المحافظة - المنطقة - اسم الشارع"
                              value={customerInfo.address}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
                            />
                          </div>
                        </div>

                        {/* الخيارات الثلاثة للدفع */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-amber-400">2. اختر وسيلة الدفع المناسبة</h4>

                          <div 
                            onClick={() => setPaymentMethod('cod')}
                            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              paymentMethod === 'cod' ? 'border-amber-400 bg-amber-400/10' : darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Truck className="w-5 h-5 text-amber-400"/>
                              <div>
                                <h5 className="text-xs font-bold">الدفع عند الاستلام (COD)</h5>
                                <p className="text-[10px] text-slate-400">الدفع نقداً عند توصيل الطلب إلى باب المنزل</p>
                              </div>
                            </div>
                            <input type="radio" checked={paymentMethod === 'cod'} onChange={() => {}} className="accent-amber-400"/>
                          </div>

                          <div 
                            onClick={() => setPaymentMethod('card')}
                            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              paymentMethod === 'card' ? 'border-amber-400 bg-amber-400/10' : darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-amber-400"/>
                              <div>
                                <h5 className="text-xs font-bold">ديبت / كريديت كارت / وسيلة محلية</h5>
                                <p className="text-[10px] text-slate-400">دفع إلكتروني آمن عبر الفيزا أو المحافظ الإلكترونية</p>
                              </div>
                            </div>
                            <input type="radio" checked={paymentMethod === 'card'} onChange={() => {}} className="accent-amber-400"/>
                          </div>

                          <div 
                            onClick={() => setPaymentMethod('whatsapp')}
                            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              paymentMethod === 'whatsapp' ? 'border-emerald-500 bg-emerald-500/10' : darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <PhoneCall className="w-5 h-5 text-emerald-400"/>
                              <div>
                                <h5 className="text-xs font-bold">إتمام الطلب عبر واتساب</h5>
                                <p className="text-[10px] text-slate-400">إرسال تفاصيل الفاتورة وتأكيدها مباشرة عبر المحادثة</p>
                              </div>
                            </div>
                            <input type="radio" checked={paymentMethod === 'whatsapp'} onChange={() => {}} className="accent-emerald-400"/>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="pt-4 border-t border-slate-800 mt-4">
                      <div className="flex justify-between items-center text-xs mb-4 font-bold">
                        <span>إجمالي المنتجات ({cart.reduce((a, c) => a + c.qty, 0)}):</span>
                        <span className="text-[#D4AF37] text-base font-black">{grandTotal} ج.م</span>
                      </div>

                      {checkoutStep === 'cart' ? (
                        <button 
                          onClick={() => setCheckoutStep('checkout')} 
                          className="w-full py-3.5 bg-amber-400 text-black font-black rounded-2xl text-xs hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10"
                        >
                          المتابعة لاختيار الدفع والتوصيل 👈
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setCheckoutStep('cart')}
                            className="py-3.5 px-4 bg-slate-800 text-slate-300 font-bold rounded-2xl text-xs hover:bg-slate-700"
                          >
                            رجوع
                          </button>
                          <button 
                            type="submit"
                            form="checkout-form"
                            className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-[#D4AF37] text-black font-black rounded-2xl text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-400/20"
                          >
                            تأكيد الطلب والدفع ({grandTotal} ج.م)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}