import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Trash2, X, Search, Plus, ShieldCheck,
  Package, LogOut, Layers, BarChart3, Edit, Image as ImageIcon,
  Sun, Moon, MessageSquare, Clock, ArrowRight,
  ShoppingBag, Send, Star, Filter, Eye, Activity, CreditCard, Truck, PhoneCall,
  DollarSign, Bell, RefreshCw, BookOpen, Monitor, Gamepad2, Sparkles, CheckCircle2,
  Headphones, Tag, ChevronRight, UserCheck, Code, GraduationCap, ClipboardList, Landmark, Flame, ArrowLeft, ExternalLink
} from 'lucide-react';

const ADMIN_ACCOUNTS = [
  { username: "admin", password: "123" },
  { username: "dev", password: "mostafa1512" }
];

const STORE_CATEGORIES = [
  { id: 'cat-1', name: 'كتب خارجية', icon: BookOpen },
  { id: 'cat-2', name: 'اكواد', icon: Code },
  { id: 'cat-3', name: 'School Supplies', icon: GraduationCap },
  { id: 'cat-4', name: 'كتب مدرسين', icon: UserCheck },
  { id: 'cat-5', name: 'كتب تقيمات', icon: ClipboardList },
  { id: 'cat-6', name: 'كتب نهج الازهر', icon: Landmark }
];

const DEFAULT_BANNERS = [
  {
    id: 'b1',
    title: 'خصم يصل إلى 25% على الكتب الخارجية',
    subtitle: 'احصل على أفضل المناهج والكتب الخارجية لجميع المراحل الدراسية بأفضل سعر.',
    badge: 'عرض لفترة محدودة',
    bgGradient: 'from-blue-900 via-indigo-900 to-purple-950',
    borderColor: 'border-blue-500/30',
    productId: '',
    imageUrl: '',
    linkUrl: ''
  },
  {
    id: 'b2',
    title: 'تفعيل أكواد المنصات والدروس فوراً',
    subtitle: 'شحن ومتابعة لحظية لأكواد المحاضرات والمنصات التعليمية المعتمدة.',
    badge: 'تفعيل فوري ⚡',
    bgGradient: 'from-indigo-900 via-purple-900 to-pink-950',
    borderColor: 'border-indigo-500/30',
    productId: '',
    imageUrl: '',
    linkUrl: ''
  }
];

const DEFAULT_PRODUCTS = [];

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

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sec_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(c => ({
        ...c,
        icon: STORE_CATEGORIES.find(sc => sc.name === c.name)?.icon || Sparkles
      }));
    }
    return STORE_CATEGORIES;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sec_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('sec_banners');
    return saved ? JSON.parse(saved) : DEFAULT_BANNERS;
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
      { id: 'LOG-1', user: 'system', action: 'تشغيل واجهة متجر SEC والمزامنة اللحظية', timestamp: new Date().toLocaleString('ar-EG') }
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
  const [activeBanner, setActiveBanner] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [checkoutStep, setCheckoutStep] = useState('cart'); 
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newComplaint, setNewComplaint] = useState({ name: '', phone: '', message: '' });
  
  const [newProduct, setNewProduct] = useState({ 
    name: '', category: categories[0]?.id || 'cat-1', price: '', description: '', imagesInput: '', badge: 'جديد', inStock: true, isTopSelling: false
  });

  const [bannerForm, setBannerForm] = useState({
    id: null, title: '', subtitle: '', badge: 'عرض خاص', productId: '', bgGradient: 'from-blue-900 via-indigo-900 to-purple-950', imageUrl: '', linkUrl: ''
  });

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
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

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sec_orders') {
        const newOrders = JSON.parse(e.newValue || '[]');
        if (newOrders.length > orders.length) {
          playNotificationSound();
          showToast('🔔 طلب جديد وصل الآن إلى لوحة التحكم!');
        }
        setOrders(newOrders);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [orders.length]);

  useEffect(() => {
    if (banners.length === 0) return;
    const bannerTimer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  useEffect(() => { 
    const categoriesToSave = categories.map(({ icon, ...rest }) => rest);
    localStorage.setItem('sec_categories', JSON.stringify(categoriesToSave)); 
  }, [categories]);

  useEffect(() => { localStorage.setItem('sec_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sec_banners', JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem('sec_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('sec_complaints', JSON.stringify(complaints)); }, [complaints]);
  useEffect(() => { localStorage.setItem('sec_activity_logs', JSON.stringify(activityLogs)); }, [activityLogs]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addLog = (user, action) => {
    const newLog = {
      id: 'LOG-' + Date.now(),
      user: user || currentUser || 'عميل',
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
      showToast(`مرحباً بك ${foundUser.username} في لوحة التحكم! 👋`);
      addLog(foundUser.username, 'تسجيل دخول إلى لوحة الإدارة');
    } else {
      setLoginError('اسم المستخدم أو كلمة السر غير صحيحة');
    }
  };

  const handleAdminLogout = () => {
    addLog(currentUser, 'تسجيل الخروج من لوحة التحكم');
    setIsAdminLoggedIn(false);
    setCurrentUser('');
    window.history.pushState({}, '', '/');
    setIsAdminPath(false);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.title && !bannerForm.imageUrl) return;

    if (bannerForm.id) {
      setBanners(prev => prev.map(b => b.id === bannerForm.id ? { ...bannerForm } : b));
      addLog(currentUser, `تعديل السلايد: (${bannerForm.title || 'سلايد صورة'})`);
      showToast('تم تعديل السلايد بنجاح!');
    } else {
      const created = { ...bannerForm, id: 'b-' + Date.now() };
      setBanners(prev => [...prev, created]);
      addLog(currentUser, `إضافة سلايد جديد: (${bannerForm.title || 'سلايد صورة'})`);
      showToast('تم إضافة السلايد بنجاح!');
    }
    setBannerForm({ id: null, title: '', subtitle: '', badge: 'عرض خاص', productId: '', bgGradient: 'from-blue-900 via-indigo-900 to-purple-950', imageUrl: '', linkUrl: '' });
  };

  const handleDeleteBanner = (id) => {
    if (confirm('هل أنت تأكد من حذف هذا السلايد؟')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      addLog(currentUser, `حذف السلايد رقم (${id})`);
      showToast('تم حذف السلايد.');
    }
  };

  const handleBannerClick = (banner) => {
    if (banner.linkUrl) {
      window.open(banner.linkUrl, '_blank');
      return;
    }
    if (banner.productId) {
      const prod = products.find(p => String(p.id) === String(banner.productId));
      if (prod) {
        setSelectedProduct(prod);
        setActiveImageIndex(0);
        return;
      }
    }
    setSelectedCategory('all');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addLog(currentUser, `تغيير حالة الطلب (${orderId}) إلى: ${newStatus}`);
    showToast(`تم تحديث حالة الطلب إلى: ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (confirm(`هل تريد بالتأكيد حذف الطلب رقم ${orderId}؟`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      addLog(currentUser, `حذف الطلب رقم: (${orderId})`);
      showToast('تم حذف الطلب بنجاح');
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const createdCat = { id: 'cat-' + Date.now(), name: newCategoryName.trim(), icon: Sparkles };
    setCategories((prev) => [...prev, createdCat]);
    addLog(currentUser, `إضافة تصنيف جديد: (${newCategoryName.trim()})`);
    setNewCategoryName('');
    showToast('تم إضافة القسم بنجاح!');
  };

  const handleDeleteCategory = (id) => {
    const target = categories.find((c) => String(c.id) === String(id));
    if (confirm('هل أنت تأكد من حذف هذا القسم؟')) {
      setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));
      addLog(currentUser, `حذف قسم: (${target?.name || id})`);
      showToast('تم الحذف بنجاح.');
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const rawImages = newProduct.imagesInput.split(/[\n,]+/).map(img => img.trim()).filter(Boolean);
    const finalImages = rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=60'];

    const item = { 
      ...newProduct, 
      id: 'p-' + Date.now(), 
      price: Number(newProduct.price),
      category: String(newProduct.category || categories[0]?.id || 'cat-1'),
      rating: 5,
      isTopSelling: newProduct.isTopSelling,
      images: finalImages,
      image: finalImages[0]
    };
    setProducts((prev) => [item, ...prev]);
    addLog(currentUser, `نشر منتج جديد: (${newProduct.name}) بسعر ${newProduct.price} ج.م`);
    setNewProduct({ name: '', category: categories[0]?.id || 'cat-1', price: '', description: '', imagesInput: '', badge: 'جديد', inStock: true, isTopSelling: false });
    showToast('تم نشر المنتج في المتجر!');
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
    addLog('عميل', `إرسال رسالة/استفسار من رقم (${newComplaint.phone})`);
    setNewComplaint({ name: '', phone: '', message: '' });
    setIsComplaintOpen(false);
    showToast('تم إرسال رسالتك وسنرد عليك فوراً! 💬');
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
    showToast('تمت الإضافة للسلة بنجاح! 🛒');
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

  const grandTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.qty, 0), [cart]);

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) return;

    let paymentMethodLabel = '';
    if (paymentMethod === 'cod') paymentMethodLabel = 'الدفع عند الاستلام (COD)';
    if (paymentMethod === 'card') paymentMethodLabel = 'بطاقة بنكية / محفظة إلكترونية';
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

    setOrders((prev) => [newOrder, ...prev]);
    playNotificationSound();
    addLog(customerInfo.name, `إنشاء طلب جديد رقم (${newOrder.id}) بقيمة ${grandTotal} ج.م [طريقة الدفع: ${paymentMethodLabel}]`);

    if (paymentMethod === 'whatsapp') {
      const itemsList = cart.map(i => `- ${i.name} (${i.qty}x)`).join('\n');
      const message = `مرحباً متجر SEC، أريد تأكيد الطلب رقم *${orderId}*\n\n*الاسم:* ${customerInfo.name}\n*الهاتف:* ${customerInfo.phone}\n*العنوان:* ${customerInfo.address}\n\n*المنتجات:*\n${itemsList}\n\n*الإجمالي:* ${grandTotal} ج.م`;
      window.open(`https://wa.me/201000000000?text=${encodeURIComponent(message)}`);
    }

    setCart([]);
    setIsCartOpen(false);
    setCheckoutStep('cart');
    setCustomerInfo({ name: '', phone: '', address: '' });
    showToast('تم إرسال طلبك بنجاح! وسيرسل إشعار لحظي للأدمن 🚀');
  };

  const revenueStats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const completedRevenue = orders.filter(o => o.status === 'مكتمل' || o.status === 'تم الدفع (إلكتروني)').reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const pendingRevenue = orders.filter(o => o.status === 'قيد الانتظار' || o.status === 'قيد التوصيل').reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    
    return { totalRevenue, completedRevenue, pendingRevenue, avgOrderValue };
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
    <div className={`min-h-screen font-['Cairo'] relative overflow-x-hidden transition-colors duration-500 selection:bg-blue-600 selection:text-white ${
      darkMode ? 'bg-[#080d1a] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`} dir="rtl">

      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 z-[9999] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs border border-blue-400/30"
          >
            <Bell className="w-4 h-4 animate-bounce"/>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050811]">
            <div className="relative text-center z-10 flex flex-col items-center">
              <div className="p-4 bg-blue-600/20 rounded-3xl border border-blue-500/30 shadow-2xl mb-4 animate-pulse">
                <ShoppingBag className="w-12 h-12 text-blue-400"/>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">SEC</h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          {!isAdminPath && (
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-[11px] py-1.5 px-4 text-center font-bold flex justify-center items-center gap-2 border-b border-white/10">
              <Sparkles className="w-3.5 h-3.5 animate-spin"/>
              <span>أهلاً بكم في متجر SEC - عروض خيالية وحصرية على جميع الكتب والمستلزمات والأكواد!</span>
            </div>
          )}

          <header className={`sticky top-0 z-40 backdrop-blur-2xl border-b px-4 md:px-8 py-3.5 flex justify-between items-center shadow-md ${
            darkMode ? 'bg-[#0b1329]/90 border-slate-800/80' : 'bg-white/90 border-slate-200/80'
          }`}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { window.history.pushState({}, '', '/'); setIsAdminPath(false); setSelectedProduct(null); }}>
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-white"/>
              </div>
              <div>
                <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">SEC</h1>
                <p className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SEC STORE</p>
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
                  darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
              </button>

              {isAdminPath && isAdminLoggedIn && (
                <button onClick={handleAdminLogout} className="py-2.5 px-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all">
                  <LogOut className="w-4 h-4"/>
                  <span>الخروج</span>
                </button>
              )}

              {!isAdminPath && (
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className={`relative p-2.5 border rounded-2xl flex items-center gap-2 transition-all hover:scale-105 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 text-blue-500"/>
                  {cart.length > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cart.reduce((a, c) => a + c.qty, 0)}
                    </span>
                  )}
                </button>
              )}
            </div>
          </header>

          {isAdminPath ? (
            !isAdminLoggedIn ? (
              <div className="min-h-[80vh] flex items-center justify-center px-4 relative z-10">
                <div className={`w-full max-w-md border rounded-3xl p-8 shadow-2xl backdrop-blur-xl ${
                  darkMode ? 'bg-[#0b1329]/90 border-slate-800' : 'bg-white/90 border-slate-200'
                }`}>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-8 h-8 text-blue-400"/>
                    </div>
                    <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>لوحة أدمن متجر SEC</h2>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>إدارة الأوامر والمنتجات والسلايدر المباشر</p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1 block`}>اسم المستخدم</label>
                      <input
                        type="text"
                        placeholder="admin أو dev"
                        required
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className={`w-full p-3.5 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-1 block`}>كلمة المرور</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={`w-full p-3.5 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    {loginError && <p className="text-xs text-rose-500 font-bold text-center">{loginError}</p>}
                    <button 
                      type="submit" 
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-blue-500/20"
                    >
                      دخول لوحة التحكم
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
                <aside className={`w-full lg:w-64 border-b lg:border-b-0 lg:border-l p-4 flex flex-row lg:flex-col gap-2 shrink-0 ${
                  darkMode ? 'bg-[#080d1a] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="hidden lg:block px-3 py-2 mb-2">
                    <p className={`text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider`}>نظام الإدارة المباشر</p>
                  </div>

                  {[
                    { id: 'dashboard', label: 'الإحصائيات العامة', icon: BarChart3 },
                    { id: 'banners', label: 'إدارة السلايدر (البنرات)', icon: ImageIcon, badge: banners.length },
                    { id: 'revenue', label: 'تجميع الأرباح والخزينة', icon: DollarSign },
                    { id: 'orders', label: 'الطلبات المباشرة', icon: ShoppingBag, badge: orders.length },
                    { id: 'products', label: 'المنتجات والمخزون', icon: Package },
                    { id: 'categories', label: 'الأقسام والتصنيفات', icon: Layers },
                    { id: 'complaints', label: 'الشكاوى والرسائل', icon: MessageSquare, badge: complaints.filter(c => !c.read).length },
                    { id: 'logs', label: 'سجل العمليات', icon: Activity }
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = adminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setAdminTab(item.id)}
                        className={`flex-1 lg:flex-initial p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                          active 
                            ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30' 
                            : darkMode ? 'text-slate-400 hover:bg-slate-800/50' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4"/>
                          <span>{item.label}</span>
                        </div>
                        {item.badge > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            active ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </aside>

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
                  
                  {adminTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>لوحة التحكم والأداء Live</h2>
                          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>مراقبة الأوامر الواردة والإحصائيات الحية</p>
                        </div>
                        <button onClick={playNotificationSound} className="py-2 px-3 bg-blue-600/10 border border-blue-500/30 text-blue-500 text-xs rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                          <Bell className="w-3.5 h-3.5"/>
                          <span>اختبار نغمة التنبيه</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>إجمالي الطلبات</span>
                            <ShoppingBag className="w-5 h-5 text-blue-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-blue-500">{orders.length}</h3>
                          <p className="text-[10px] text-emerald-500 mt-2">تحديث لحظي بدون إعادة تحميل</p>
                        </div>

                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>إجمالي المبيعات</span>
                            <DollarSign className="w-5 h-5 text-emerald-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-emerald-500">{revenueStats.totalRevenue} ج.م</h3>
                          <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-2`}>مجموع المبيعات الكلية</p>
                        </div>

                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>عدد المنتجات</span>
                            <Package className="w-5 h-5 text-indigo-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-indigo-500">{products.length}</h3>
                          <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-2`}>منتج معروض في متجر SEC</p>
                        </div>

                        <div className={`p-6 rounded-3xl border transition-transform hover:scale-[1.02] ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>الرسائل والشكاوى</span>
                            <MessageSquare className="w-5 h-5 text-rose-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-rose-500">{complaints.length}</h3>
                          <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-2`}>{complaints.filter(c => !c.read).length} غير مقروءة</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'banners' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-sm mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {bannerForm.id ? 'تعديل السلايد الحالي' : 'إضافة سلايدر إعلاني جديد'}
                        </h3>

                        <form onSubmit={handleSaveBanner} className="space-y-4">
                          <div>
                            <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>رابط صورة كامل للسلايد (اختياري - يظهر كبنر صورة كامل)</label>
                            <input
                              type="url"
                              placeholder="https://example.com/banner-image.jpg"
                              value={bannerForm.imageUrl || ''}
                              onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />
                            <p className="text-[10px] text-slate-500 mt-1">إذا تم وضع رابط صورة، سيتم عرض الصورة كبنر كامل. إن تركته فارغاً سيعتمد السلايدر على العنوان والنص الخلفي.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>عنوان السلايد الرئيسي</label>
                              <input
                                type="text"
                                placeholder="خصم يصل إلى 25%..."
                                value={bannerForm.title}
                                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>الشارة الترويجية (Badge)</label>
                              <input
                                type="text"
                                placeholder="عرض محدود / جديد..."
                                value={bannerForm.badge}
                                onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>الوصف الفرعي</label>
                            <input
                              type="text"
                              placeholder="تفاصيل العرض..."
                              value={bannerForm.subtitle}
                              onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>ربط برابط انتقال خارجي Link URL (اختياري)</label>
                              <input
                                type="url"
                                placeholder="https://external-link.com"
                                value={bannerForm.linkUrl || ''}
                                onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>أو ربطه بمنتج معين داخل المتجر</label>
                              <select
                                value={bannerForm.productId}
                                onChange={(e) => setBannerForm({ ...bannerForm, productId: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                              >
                                <option value="">بدون ربط (تصفح العامة)</option>
                                {products.map(p => (
                                  <option key={p.id} value={p.id}>{p.name} ({p.price} ج.م)</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button type="submit" className="py-3 px-6 bg-blue-600 text-white font-bold text-xs rounded-2xl hover:bg-blue-500 transition-all">
                              {bannerForm.id ? 'حفظ التعديلات' : 'إضافة السلايد'}
                            </button>
                            {bannerForm.id && (
                              <button 
                                type="button" 
                                onClick={() => setBannerForm({ id: null, title: '', subtitle: '', badge: 'عرض خاص', productId: '', bgGradient: 'from-blue-900 via-indigo-900 to-purple-950', imageUrl: '', linkUrl: '' })}
                                className="py-3 px-6 bg-slate-700 text-white font-bold text-xs rounded-2xl"
                              >
                                إلغاء
                              </button>
                            )}
                          </div>
                        </form>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-sm mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>السلايدات الحالية ({banners.length})</h3>
                        <div className="space-y-3">
                          {banners.map((b) => (
                            <div key={b.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                              <div className="flex items-center gap-3">
                                {b.imageUrl && (
                                  <img src={b.imageUrl} alt="" className="w-16 h-12 object-cover rounded-xl border border-slate-700" />
                                )}
                                <div>
                                  <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-md font-bold mb-1 inline-block">{b.badge}</span>
                                  <h4 className={`font-bold text-xs ${darkMode ? 'text-white' : 'text-slate-900'}`}>{b.title || 'سلايد صورة بدون عنوان'}</h4>
                                  <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{b.subtitle}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setBannerForm(b)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all" title="تعديل">
                                  <Edit className="w-4 h-4"/>
                                </button>
                                <button onClick={() => handleDeleteBanner(b.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all" title="حذف">
                                  <Trash2 className="w-4 h-4"/>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'revenue' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>التقرير المالي والخزينة</h2>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>تفاصيل التدفقات المالية المكتملة وقيد التحصيل</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>الأرباح المُحصلة والمكتملة</span>
                          <h3 className="text-3xl font-black text-emerald-500 my-2">{revenueStats.completedRevenue} ج.م</h3>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg border border-emerald-500/20">جاهزة للسحب/التحويل</span>
                        </div>

                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>أرباح قيد التوصيل والتحصيل</span>
                          <h3 className="text-3xl font-black text-amber-500 my-2">{revenueStats.pendingRevenue} ج.م</h3>
                          <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg border border-amber-500/20">مع المناديب والشركاء</span>
                        </div>

                        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>متوسط قيمة الطلب</span>
                          <h3 className="text-3xl font-black text-sky-500 my-2">{revenueStats.avgOrderValue} ج.م</h3>
                          <span className="text-[10px] bg-sky-500/10 text-sky-500 px-2.5 py-1 rounded-lg border border-sky-500/20">معدل العميل</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'orders' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className={`flex justify-between items-center mb-6 pb-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                          <div>
                            <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>إدارة الأوامر والطلبات المباشرة ({orders.length})</h3>
                            <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>تحديث ألوان وحالات الطلبات وحذفها فوراً</p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-xs">
                            <thead>
                              <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                                <th className="py-3 px-2">رقم الطلب</th>
                                <th className="py-3 px-2">العميل والهاتف</th>
                                <th className="py-3 px-2">العنوان</th>
                                <th className="py-3 px-2">طريقة الدفع</th>
                                <th className="py-3 px-2">المنتجات</th>
                                <th className="py-3 px-2">الإجمالي</th>
                                <th className="py-3 px-2">الحالة</th>
                                <th className="py-3 px-2 text-center">إجراءات</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                              {orders.map((ord) => (
                                <tr key={ord.id} className="hover:bg-slate-800/10 transition-colors">
                                  <td className="py-3.5 px-2 font-bold text-blue-500">{ord.id}</td>
                                  <td className="py-3.5 px-2">
                                    <div className="font-bold">{ord.customerName}</div>
                                    <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{ord.phone}</div>
                                  </td>
                                  <td className="py-3.5 px-2 max-w-[140px] truncate">{ord.address}</td>
                                  <td className="py-3.5 px-2 font-bold text-blue-400">{ord.paymentMethod}</td>
                                  <td className="py-3.5 px-2">
                                    {ord.items ? ord.items.map((it, idx) => (
                                      <div key={idx} className="text-[11px]">{it.name} <span className="text-blue-500 font-bold">({it.qty}x)</span></div>
                                    )) : `${ord.itemsCount} عناصر`}
                                  </td>
                                  <td className="py-3.5 px-2 font-black text-emerald-500">{ord.total} ج.م</td>
                                  <td className="py-3.5 px-2">
                                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                                      ord.status === 'مكتمل' || ord.status === 'تم الدفع (إلكتروني)' 
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                        : ord.status === 'قيد التوصيل'
                                        ? 'bg-sky-500/10 text-sky-500 border-sky-500/20'
                                        : ord.status === 'ملغي'
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}>
                                      {ord.status}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-2">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <select
                                        value={ord.status}
                                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                        className={`p-1.5 rounded-xl text-[10px] font-bold border ${
                                          darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                                        }`}
                                      >
                                        <option value="قيد الانتظار">قيد الانتظار</option>
                                        <option value="قيد التوصيل">قيد التوصيل</option>
                                        <option value="مكتمل">مكتمل</option>
                                        <option value="ملغي">ملغي</option>
                                      </select>

                                      <button 
                                        onClick={() => handleDeleteOrder(ord.id)}
                                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all"
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
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className={`flex items-center gap-2 mb-6 border-b pb-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                          <Plus className="w-5 h-5 text-blue-500"/>
                          <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>إضافة منتج أو خدمة جديدة للمتجر</h3>
                        </div>

                        <form onSubmit={handleAddProductSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>اسم المنتج / الخدمة *</label>
                              <input
                                type="text"
                                placeholder="مثال: كتاب خارجي أو كود"
                                required
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>السعر (ج.م) *</label>
                              <input
                                type="number"
                                placeholder="120"
                                required
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-300 text-slate-900'}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>القسم *</label>
                              <select
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>روابط الصور (يمكن إضافة أكثر من صورة بالفصل بينهما بفصلة أو سطر جديد)</label>
                            <textarea
                              rows="2"
                              placeholder="https://image1.jpg, https://image2.jpg"
                              value={newProduct.imagesInput}
                              onChange={(e) => setNewProduct({ ...newProduct, imagesInput: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>وصف المنتج</label>
                            <textarea
                              rows="2"
                              placeholder="مواصفات أو مميزات المنتج..."
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="py-3.5 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-blue-500/20"
                          >
                            نشر المنتج بالمتجر
                          </button>
                        </form>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-sm mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>المنتجات المعروضة ({products.length})</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-xs">
                            <thead>
                              <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                                <th className="py-3 px-2">المنتج</th>
                                <th className="py-3 px-2">القسم</th>
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
                                      <img src={p.image || p.images?.[0]} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-slate-700" />
                                      <span className="font-bold">{p.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 text-slate-400">{categories.find(c => String(c.id) === String(p.category))?.name || 'عام'}</td>
                                  <td className="py-3 px-2 font-black text-blue-500">{p.price} ج.م</td>
                                  <td className="py-3 px-2">
                                    <button 
                                      onClick={() => toggleStockStatus(p.id)}
                                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                                        p.inStock ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                      }`}
                                    >
                                      {p.inStock ? 'متوفر' : 'نفذت الكمية'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-2">
                                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
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

                  {adminTab === 'categories' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-sm mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>إضافة قسم جديد لمتجر SEC</h3>
                        <form onSubmit={handleAddCategory} className="flex gap-3">
                          <input
                            type="text"
                            placeholder="اسم القسم الجديد..."
                            required
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className={`flex-1 p-3.5 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                          />
                          <button type="submit" className="py-3.5 px-6 bg-blue-600 text-white font-bold text-xs rounded-2xl hover:bg-blue-500 transition-all">إضافة القسم</button>
                        </form>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-sm mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>الأقسام الحالية ({categories.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {categories.map((cat) => (
                            <div key={cat.id} className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                              <span className="font-bold text-xs">{cat.name}</span>
                              <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'complaints' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-sm mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>صندوق الرسائل والاستفسارات ({complaints.length})</h3>
                        <div className="space-y-3">
                          {complaints.map((cmp) => (
                            <div key={cmp.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                              cmp.read ? darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200' : 'bg-blue-500/10 border-blue-500/30'
                            }`}>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-xs">{cmp.name || 'عميل'}</h4>
                                  <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>({cmp.phone})</span>
                                </div>
                                <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{cmp.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'logs' && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-sm mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>سجل العمليات (Logs)</h3>
                        <div className="space-y-2">
                          {activityLogs.map((log) => (
                            <div key={log.id} className={`p-3 rounded-xl border text-xs flex justify-between ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                              <span><strong className="text-blue-500">{log.user}:</strong> {log.action}</span>
                              <span className="text-[10px] text-slate-400">{log.timestamp}</span>
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

            <>
              {selectedProduct ? (
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className={`mb-6 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4"/>
                    <span>الرجوع للمتجر</span>
                  </button>

                  <div className={`p-6 md:p-8 rounded-3xl border shadow-2xl ${
                    darkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-700/50 mb-4 bg-black/20">
                          <img 
                            src={(selectedProduct.images && selectedProduct.images[activeImageIndex]) || selectedProduct.image} 
                            alt={selectedProduct.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {selectedProduct.images && selectedProduct.images.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {selectedProduct.images.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`w-16 h-16 rounded-xl border overflow-hidden shrink-0 transition-all ${
                                  activeImageIndex === idx ? 'border-blue-500 scale-105 ring-2 ring-blue-500/30' : 'border-slate-700 opacity-60'
                                }`}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover"/>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg border border-blue-500/20 mb-3 inline-block">
                            {categories.find(c => String(c.id) === String(selectedProduct.category))?.name || 'عام'}
                          </span>
                          <h1 className="text-2xl md:text-3xl font-black mb-4">{selectedProduct.name}</h1>
                          
                          <div className="mb-6">
                            <h3 className="text-xs font-bold text-slate-400 mb-2">وصف المنتج:</h3>
                            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              {selectedProduct.description || 'لا يوجد وصف تفصيلي متوفر لهذا المنتج حالياً.'}
                            </p>
                          </div>

                          <div className="text-3xl font-black text-blue-500 mb-6">{selectedProduct.price} ج.م</div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-800">
                          <button
                            onClick={() => addToCart(selectedProduct)}
                            disabled={!selectedProduct.inStock}
                            className={`w-full py-4 font-black text-sm rounded-2xl transition-all shadow-xl ${
                              selectedProduct.inStock 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white shadow-blue-500/20' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {selectedProduct.inStock ? 'إضافة للسلة وإتمام الشراء 🛒' : 'نفذت الكمية'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <section className={`py-10 px-4 md:px-8 text-center border-b relative ${
                    darkMode ? 'bg-gradient-to-b from-[#0b1329] to-[#080d1a] border-slate-800/80' : 'bg-gradient-to-b from-blue-50 to-slate-50 border-slate-200'
                  }`}>
                    <div className="max-w-3xl mx-auto">
                      <h2 className={`text-3xl md:text-4xl font-black mb-3 ${darkMode ? 'bg-gradient-to-r from-blue-300 via-indigo-200 to-white bg-clip-text text-transparent' : 'text-slate-900'}`}>
                        أهلاً بك في متجر SEC
                      </h2>
                      <p className={`text-xs md:text-sm mb-6 max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        وجهتك الموثوقة للحصول على الكتب، الأكواد، المستلزمات والحلول التعليمية بأفضل الأسعار.
                      </p>
                      
                      <div className="relative max-w-lg mx-auto">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                        <input
                          type="text"
                          placeholder="ابحث عن كتاب، كود، أو مستلزمات..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full pr-11 pl-4 py-3.5 border rounded-2xl text-xs focus:outline-none focus:border-blue-500 transition-all ${
                            darkMode ? 'bg-[#0e172e] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                  </section>

                  {banners.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
                      <div className={`relative overflow-hidden rounded-3xl border shadow-2xl ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeBanner}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => handleBannerClick(banners[activeBanner])}
                            className={`relative rounded-3xl cursor-pointer text-white min-h-[180px] md:min-h-[240px] flex flex-col justify-end p-6 md:p-8 ${
                              banners[activeBanner].imageUrl ? 'bg-cover bg-center' : `bg-gradient-to-r ${banners[activeBanner].bgGradient || 'from-blue-900 to-indigo-900'}`
                            }`}
                            style={banners[activeBanner].imageUrl ? { backgroundImage: `url(${banners[activeBanner].imageUrl})` } : {}}
                          >
                            {banners[activeBanner].imageUrl && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-3xl" />
                            )}

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10 relative">
                              <div className="space-y-2 max-w-xl">
                                {banners[activeBanner].badge && (
                                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[11px] font-black border border-white/20 inline-block">
                                    {banners[activeBanner].badge}
                                  </span>
                                )}
                                {banners[activeBanner].title && (
                                  <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                                    {banners[activeBanner].title}
                                  </h3>
                                )}
                                {banners[activeBanner].subtitle && (
                                  <p className="text-xs text-slate-100 leading-relaxed">
                                    {banners[activeBanner].subtitle}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3 z-10 shrink-0">
                                <button className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2">
                                  <span>تصفح العرض الآن</span>
                                  {banners[activeBanner].linkUrl ? <ExternalLink className="w-4 h-4"/> : <ChevronRight className="w-4 h-4 rotate-180"/>}
                                </button>
                              </div>
                            </div>

                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                              {banners.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => { e.stopPropagation(); setActiveBanner(idx); }}
                                  className={`h-1.5 rounded-full transition-all ${
                                    activeBanner === idx ? 'w-6 bg-blue-400' : 'w-2 bg-white/40'
                                  }`}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </section>
                  )}

                  <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {selectedCategory === 'all' ? 'التصنيفات' : `التصنيف: ${categories.find(c => String(c.id) === String(selectedCategory))?.name || ''}`}
                        </h3>
                        <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>اختر التصنيف لتصفح المنتجات المتاحة</p>
                      </div>

                      {selectedCategory !== 'all' && (
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="px-4 py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl border border-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                          <span>عرض كل المنتجات</span>
                          <ArrowLeft className="w-3.5 h-3.5"/>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${
                          selectedCategory === 'all'
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                            : darkMode ? 'bg-[#0d1527] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <Layers className="w-6 h-6 text-blue-500"/>
                        <span className="text-xs font-bold">الكل</span>
                      </button>

                      {categories.map((cat) => {
                        const active = String(selectedCategory) === String(cat.id);
                        const IconComponent = cat.icon || Sparkles;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${
                              active
                                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                                : darkMode ? 'bg-[#0d1527] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <IconComponent className="w-6 h-6 text-indigo-500"/>
                            <span className="text-xs font-bold text-center">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    <div className={`flex justify-between items-center mb-8 pb-3 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <h3 className={`text-lg font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Package className="w-5 h-5 text-blue-500"/>
                        <span>المنتجات المعروضة ({filteredProducts.length})</span>
                      </h3>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div className={`text-center py-16 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                        لا توجد منتجات متوفرة حالياً لهذا التصنيف.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                          <div 
                            key={product.id} 
                            onClick={() => { setSelectedProduct(product); setActiveImageIndex(0); }}
                            className={`border rounded-3xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500/40 ${
                              darkMode ? 'bg-[#0d1527] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                            }`}
                          >
                            <div>
                              <div className={`h-48 rounded-2xl mb-4 overflow-hidden border relative group ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                                <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                {product.badge && (
                                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md">
                                    {product.badge}
                                  </span>
                                )}
                              </div>
                              <h3 className={`font-bold text-sm mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</h3>
                              <p className={`text-[11px] mb-4 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{product.description}</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-blue-500 font-black text-lg">{product.price} ج.م</span>
                                {!product.inStock && <span className="text-rose-500 text-[10px] font-bold">غير متوفر</span>}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                disabled={!product.inStock}
                                className={`w-full py-3 font-bold text-xs rounded-2xl transition-all hover:scale-[1.02] ${
                                  product.inStock 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-blue-600/20' 
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                              >
                                {product.inStock ? 'إضافة للسلة' : 'غير متوفر حالياً'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}

              <button
                onClick={() => setIsComplaintOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all border-2 border-white/20"
                title="إرسال شكوى أو استفسار"
              >
                <MessageSquare className="w-6 h-6"/>
              </button>

            </>
          )}

          <AnimatePresence>
            {isCartOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-end">
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto ${
                    darkMode ? 'bg-[#0b1329] text-slate-100' : 'bg-white text-slate-900'
                  }`}
                >
                  <div>
                    <div className={`flex justify-between items-center pb-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-blue-500"/>
                        <h3 className="font-bold text-sm">
                          {checkoutStep === 'cart' ? 'سلة تسوق متجر SEC' : 'إتمام المشتريات والدفع'}
                        </h3>
                      </div>
                      <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}>
                        <X className="w-5 h-5 text-slate-400 hover:text-white"/>
                      </button>
                    </div>

                    {checkoutStep === 'cart' ? (
                      <div className="py-4 space-y-3">
                        {cart.length === 0 ? (
                          <div className={`text-center py-16 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30"/>
                            سلة المشتريات فارغة حالياً
                          </div>
                        ) : (
                          cart.map((item) => (
                            <div key={item.id} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex items-center gap-3">
                                <img src={item.image || item.images?.[0]} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-slate-700" />
                                <div>
                                  <h4 className="text-xs font-bold mb-1">{item.name}</h4>
                                  <span className="text-xs text-blue-500 font-black">{item.price} ج.م</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1.5 border rounded-xl p-1 ${darkMode ? 'border-slate-800 bg-black/20' : 'border-slate-300 bg-white'}`}>
                                  <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center font-black rounded-lg text-xs">-</button>
                                  <span className="text-xs font-bold px-1">{item.qty}</span>
                                  <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center font-black rounded-lg text-xs">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl">
                                  <Trash2 className="w-4 h-4"/>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <form id="checkout-form" onSubmit={handleCompleteOrder} className="py-4 space-y-5">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-blue-500">1. بيانات العميل والتوصيل</h4>
                          <div>
                            <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>الاسم بالكامل *</label>
                            <input
                              type="text"
                              required
                              placeholder="أحمد علي"
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>رقم الهاتف *</label>
                            <input
                              type="tel"
                              required
                              placeholder="010XXXXXXXX"
                              value={customerInfo.phone}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[11px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>العنوان بالتفصيل *</label>
                            <input
                              type="text"
                              required
                              placeholder="المحافظة - المنطقة - الشارع"
                              value={customerInfo.address}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                              className={`w-full p-3 border rounded-2xl text-xs ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className={`pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} mt-4`}>
                      <div className="flex justify-between items-center text-xs mb-4 font-bold">
                        <span>إجمالي المنتجات ({cart.reduce((a, c) => a + c.qty, 0)}):</span>
                        <span className="text-blue-500 text-base font-black">{grandTotal} ج.م</span>
                      </div>

                      {checkoutStep === 'cart' ? (
                        <button 
                          onClick={() => setCheckoutStep('checkout')} 
                          className="w-full py-3.5 bg-blue-600 text-white font-black rounded-2xl text-xs hover:bg-blue-500 transition-all shadow-lg"
                        >
                          المتابعة لاختيار الدفع والتوصيل 👈
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setCheckoutStep('cart')}
                            className="py-3.5 px-4 bg-slate-700 text-white font-bold rounded-2xl text-xs"
                          >
                            رجوع
                          </button>
                          <button 
                            type="submit"
                            form="checkout-form"
                            className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl text-xs hover:brightness-110 transition-all shadow-lg"
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
