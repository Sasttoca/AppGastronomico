import React, { useState, useEffect, useMemo } from 'react';

// --- DATOS INICIALES SEMILLA (Estilo Villavicencio / Comida Rápida Colombiana) ---
const INITIAL_INGREDIENTS = [
  { id: 'ing-1', name: 'Pan de Hamburguesa Brioche', stock: 50, minStock: 10, unit: 'Und' },
  { id: 'ing-2', name: 'Carne de Res Molida (150g)', stock: 45, minStock: 10, unit: 'Und' },
  { id: 'ing-3', name: 'Queso Siete Cueros Rallado', stock: 5000, minStock: 1000, unit: 'g' },
  { id: 'ing-4', name: 'Salchicha Americana Premium', stock: 40, minStock: 10, unit: 'Und' },
  { id: 'ing-5', name: 'Maíz Tierno Dulce', stock: 3000, minStock: 800, unit: 'g' },
  { id: 'ing-6', name: 'Papas Cabello de Ángel', stock: 2500, minStock: 500, unit: 'g' },
  { id: 'ing-7', name: 'Salsa Tártara de la Casa', stock: 40, minStock: 10, unit: 'Porciones' },
  { id: 'ing-8', name: 'Tocina Ahumada Crujiente', stock: 1500, minStock: 400, unit: 'g' },
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Hamburguesa La Llanera',
    price: 18000,
    category: 'Hamburguesas',
    description: 'Carne premium de 150g, queso siete cueros fundido, tocino crujiente, salsa tártara artesanal y papas cabello de ángel.',
    recipe: [
      { ingredientId: 'ing-1', quantity: 1 },
      { ingredientId: 'ing-2', quantity: 1 },
      { ingredientId: 'ing-3', quantity: 120 },
      { ingredientId: 'ing-7', quantity: 1 },
      { ingredientId: 'ing-8', quantity: 50 },
      { ingredientId: 'ing-6', quantity: 30 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Perro Caliente Súper Especial',
    price: 13000,
    category: 'Perros Calientes',
    description: 'Salchicha de alta calidad, queso siete cueros derretido, papas cabello de ángel crujientes, maíz dulce y salsa tártara.',
    recipe: [
      { ingredientId: 'ing-4', quantity: 1 },
      { ingredientId: 'ing-3', quantity: 80 },
      { ingredientId: 'ing-5', quantity: 40 },
      { ingredientId: 'ing-6', quantity: 25 },
      { ingredientId: 'ing-7', quantity: 1 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Mazorcada Tres Quesos con Tocino',
    price: 16500,
    category: 'Mazorcas',
    description: 'Desgranado de maíz tierno, bañado en salsa de la casa, coronado con abundante queso siete cueros gratinado y tocino picado.',
    recipe: [
      { ingredientId: 'ing-5', quantity: 180 },
      { ingredientId: 'ing-3', quantity: 150 },
      { ingredientId: 'ing-8', quantity: 60 },
      { ingredientId: 'ing-6', quantity: 40 },
      { ingredientId: 'ing-7', quantity: 2 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Papas Locas con Queso',
    price: 9000,
    category: 'Acompañamientos',
    description: 'Porción generosa de papas de la casa, queso fundido y salsas especiales.',
    recipe: [
      { ingredientId: 'ing-6', quantity: 150 },
      { ingredientId: 'ing-3', quantity: 60 },
      { ingredientId: 'ing-7', quantity: 1 }
    ]
  }
];

const INITIAL_ORDERS = [
  {
    id: 'PED-101',
    customer: 'Juan Pablo Cárdenas',
    items: [{ productId: 'prod-1', quantity: 2 }, { productId: 'prod-4', quantity: 1 }],
    total: 45000,
    status: 'Entregado',
    date: '2026-05-20T19:30:00.000Z',
    notes: 'Sin cebolla en la hamburguesa.'
  },
  {
    id: 'PED-102',
    customer: 'Camila Serna',
    items: [{ productId: 'prod-2', quantity: 1 }],
    total: 13000,
    status: 'En Cocina',
    date: '2026-05-20T21:15:00.000Z',
    notes: 'Bien dorada la salchicha.'
  },
  {
    id: 'PED-103',
    customer: 'Eduar Alejandro',
    items: [{ productId: 'prod-3', quantity: 1 }, { productId: 'prod-1', quantity: 1 }],
    total: 34500,
    status: 'Pendiente',
    date: '2026-05-20T21:40:00.000Z',
    notes: 'Extra tártara por favor.'
  }
];

export default function App() {
  // --- ESTADOS ---
  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem('fastfood_ingredients');
    return saved ? JSON.parse(saved) : INITIAL_INGREDIENTS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('fastfood_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('fastfood_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modales y formularios de edición
  const [isIngModalOpen, setIsIngModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Carrito de pedidos
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Notificaciones internas personalizadas en lugar de alert()
  const [notification, setNotification] = useState(null);

  // Persistencia local para demostración fluida
  useEffect(() => {
    localStorage.setItem('fastfood_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('fastfood_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fastfood_orders', JSON.stringify(orders));
  }, [orders]);

  // Mostrar alertas transitorias
  const showAlert = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- LOGICA DE VERIFICACIÓN DE DISPONIBILIDAD ---
  // Calcula cuántas porciones/unidades de un producto se pueden preparar con el stock actual de ingredientes
  const calculateMaxPreparable = (product) => {
    if (!product.recipe || product.recipe.length === 0) return 99;
    let maxQuantity = Infinity;
    
    product.recipe.forEach((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      if (!ing) {
        maxQuantity = 0;
        return;
      }
      const possible = Math.floor(ing.stock / item.quantity);
      if (possible < maxQuantity) {
        maxQuantity = possible;
      }
    });
    
    return maxQuantity === Infinity ? 0 : maxQuantity;
  };

  // --- LOGICA DE PEDIDOS ---
  const addToCart = (product) => {
    const maxPoss = calculateMaxPreparable(product);
    const existing = cart.find(item => item.product.id === product.id);
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (currentQtyInCart + 1 > maxPoss) {
      showAlert(`No hay suficientes ingredientes en inventario para preparar más "${product.name}".`, 'error');
      return;
    }

    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    showAlert(`"${product.name}" agregado al pedido.`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find(i => i.product.id === productId);
    const maxPoss = calculateMaxPreparable(item.product);
    
    if (newQty > maxPoss) {
      showAlert(`Inventario insuficiente. Solo se pueden preparar ${maxPoss} porciones.`, 'error');
      return;
    }

    setCart(cart.map(i => i.product.id === productId ? { ...i, quantity: newQty } : i));
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showAlert('Por favor, ingresa el nombre del cliente.', 'warning');
      return;
    }
    if (cart.length === 0) {
      showAlert('El pedido actual está vacío.', 'warning');
      return;
    }

    // 1. Reducir stock del inventario automáticamente
    const updatedIngredients = [...ingredients];
    let stockError = false;

    cart.forEach(({ product, quantity }) => {
      product.recipe.forEach(recipeItem => {
        const ingIndex = updatedIngredients.findIndex(i => i.id === recipeItem.ingredientId);
        if (ingIndex !== -1) {
          const requiredQty = recipeItem.quantity * quantity;
          if (updatedIngredients[ingIndex].stock < requiredQty) {
            stockError = true;
          } else {
            updatedIngredients[ingIndex].stock -= requiredQty;
          }
        }
      });
    });

    if (stockError) {
      showAlert('Error crítico: Algunos ingredientes se agotaron durante el procesamiento.', 'error');
      return;
    }

    // 2. Generar id único correlativo de pedido
    const newId = `PED-${orders.length + 101}`;
    const newOrder = {
      id: newId,
      customer: customerName,
      items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
      total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      status: 'Pendiente',
      date: new Date().toISOString(),
      notes: orderNotes
    };

    // 3. Confirmar cambios
    setIngredients(updatedIngredients);
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCustomerName('');
    setOrderNotes('');
    showAlert(`¡Pedido ${newId} registrado con éxito y enviado a cocina!`);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // Si se cancela el pedido, retornamos los ingredientes al stock de forma lógica
    if (newStatus === 'Cancelado') {
      const orderToCancel = orders.find(o => o.id === orderId);
      if (orderToCancel && orderToCancel.status !== 'Cancelado') {
        const restoredIngredients = [...ingredients];
        orderToCancel.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product && product.recipe) {
            product.recipe.forEach(recipeItem => {
              const ingIndex = restoredIngredients.findIndex(i => i.id === recipeItem.ingredientId);
              if (ingIndex !== -1) {
                restoredIngredients[ingIndex].stock += (recipeItem.quantity * item.quantity);
              }
            });
          }
        });
        setIngredients(restoredIngredients);
      }
    }

    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showAlert(`Pedido ${orderId} actualizado a: ${newStatus}`);
  };

  // --- CRUD INGREDIENTES ---
  const handleSaveIngredient = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const stock = parseFloat(formData.get('stock'));
    const minStock = parseFloat(formData.get('minStock'));
    const unit = formData.get('unit');

    if (editingIngredient) {
      setIngredients(ingredients.map(i => i.id === editingIngredient.id ? { ...i, name, stock, minStock, unit } : i));
      showAlert('Ingrediente actualizado correctamente.');
    } else {
      const newIng = {
        id: `ing-${Date.now()}`,
        name,
        stock,
        minStock,
        unit
      };
      setIngredients([...ingredients, newIng]);
      showAlert('Ingrediente añadido al inventario.');
    }
    setIsIngModalOpen(false);
    setEditingIngredient(null);
  };

  const handleDeleteIngredient = (id) => {
    // Verificar si el ingrediente es parte de alguna receta activa
    const linkedProducts = products.filter(p => p.recipe.some(r => r.ingredientId === id));
    if (linkedProducts.length > 0) {
      showAlert(`No se puede eliminar. Este ingrediente es requerido en la receta de: ${linkedProducts.map(p => p.name).join(', ')}`, 'warning');
      return;
    }
    setIngredients(ingredients.filter(i => i.id !== id));
    showAlert('Ingrediente eliminado.');
  };

  // --- CRUD PRODUCTOS ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const price = parseFloat(formData.get('price'));
    const category = formData.get('category');
    const description = formData.get('description');

    // Procesar receta dinámica
    const recipe = [];
    ingredients.forEach(ing => {
      const qty = parseFloat(formData.get(`recipe_${ing.id}`));
      if (qty && qty > 0) {
        recipe.push({ ingredientId: ing.id, quantity: qty });
      }
    });

    if (recipe.length === 0) {
      showAlert('La receta debe contener al menos un ingrediente.', 'warning');
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, name, price, category, description, recipe } : p));
      showAlert('Producto del menú actualizado.');
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        name,
        price,
        category,
        description,
        recipe
      };
      setProducts([...products, newProd]);
      showAlert('Nuevo producto agregado con éxito.');
    }
    setIsProdModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showAlert('Producto removido del menú.');
  };

  // --- CÁLCULOS ESTADÍSTICOS (REPORTES) ---
  const statistics = useMemo(() => {
    const activeOrders = orders.filter(o => o.status !== 'Cancelado');
    const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const activeCount = orders.filter(o => o.status === 'Pendiente' || o.status === 'En Cocina').length;
    
    // Alertas de inventario crítico
    const lowStockAlerts = ingredients.filter(i => i.stock <= i.minStock).length;

    // Conteo de productos más vendidos
    const productSalesCount = {};
    activeOrders.forEach(o => {
      o.items.forEach(item => {
        productSalesCount[item.productId] = (productSalesCount[item.productId] || 0) + item.quantity;
      });
    });

    let topProduct = { name: 'Ninguno', quantity: 0 };
    Object.entries(productSalesCount).forEach(([id, qty]) => {
      const p = products.find(prod => prod.id === id);
      if (p && qty > topProduct.quantity) {
        topProduct = { name: p.name, quantity: qty };
      }
    });

    return {
      totalSales,
      activeCount,
      lowStockAlerts,
      topProductName: topProduct.name,
      topProductQty: topProduct.quantity
    };
  }, [orders, ingredients, products]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased selection:bg-amber-500 selection:text-slate-900">
      
      {/* --- NOTIFICACIONES --- */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-2xl border transition-all transform translate-y-0 ${
          notification.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-200' :
          notification.type === 'warning' ? 'bg-amber-900/90 border-amber-500 text-amber-200' :
          'bg-emerald-950/95 border-emerald-500 text-emerald-100'
        }`}>
          <div className="w-2 h-2 rounded-full animate-ping bg-current" />
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                SaborGlow POS
              </h1>
              <p className="text-xs text-slate-400">Sistema Inteligente para Emprendimientos Gastronómicos</p>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              )},
              { id: 'pedidos', label: 'Registrar Pedido', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )},
              { id: 'cocina', label: 'Monitor Cocina', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              )},
              { id: 'productos', label: 'Menú/Recetas', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              )},
              { id: 'inventario', label: 'Inventario', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V4" /></svg>
              )},
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* =========================================================
            PANEL PRINCIPAL / DASHBOARD
           ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Resumen de Operación</h2>
                <p className="text-slate-400 text-sm">Rendimiento en tiempo real y alertas de insumos claves.</p>
              </div>
              <div className="text-sm bg-slate-950/40 py-2 px-3 rounded-lg border border-slate-800 text-slate-300">
                Ubicación: <span className="text-amber-400 font-semibold">Villavicencio, Meta</span>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/45 p-5 rounded-2xl border border-slate-700/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full transition-all group-hover:bg-amber-500/10" />
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total de Ventas</p>
                <p className="text-2xl font-extrabold text-amber-400 mt-2">${statistics.totalSales.toLocaleString('es-CO')} COP</p>
                <p className="text-xs text-slate-400 mt-1">Órdenes consolidadas activas</p>
              </div>

              <div className="bg-slate-800/45 p-5 rounded-2xl border border-slate-700/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full transition-all group-hover:bg-indigo-500/10" />
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pedidos por Despachar</p>
                <p className="text-2xl font-extrabold text-indigo-400 mt-2">{statistics.activeCount}</p>
                <p className="text-xs text-slate-400 mt-1">Pendientes + En cocina</p>
              </div>

              <div className="bg-slate-800/45 p-5 rounded-2xl border border-slate-700/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full transition-all group-hover:bg-red-500/10" />
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Alertas de Stock</p>
                <p className="text-2xl font-extrabold text-red-400 mt-2">{statistics.lowStockAlerts}</p>
                <p className="text-xs text-slate-400 mt-1">Ingredientes por agotarse</p>
              </div>

              <div className="bg-slate-800/45 p-5 rounded-2xl border border-slate-700/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full transition-all group-hover:bg-emerald-500/10" />
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Producto Estrella</p>
                <p className="text-md font-bold text-emerald-400 mt-2 truncate">{statistics.topProductName}</p>
                <p className="text-xs text-slate-400 mt-1">{statistics.topProductQty} unidades vendidas</p>
              </div>
            </div>

            {/* Alertas de Stock Crítico y Actividad Reciente */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Inventario con Alerta Crítica */}
              <div className="lg:col-span-1 bg-slate-800/30 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-md text-slate-100 flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Alertas de Insumos
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full font-bold">Crítico</span>
                  </div>
                  
                  <div className="mt-4 space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
                    {ingredients.filter(i => i.stock <= i.minStock).length === 0 ? (
                      <p className="text-slate-500 text-sm text-center py-8">¡Excelente! Todos los ingredientes tienen stock saludable.</p>
                    ) : (
                      ingredients.filter(i => i.stock <= i.minStock).map(ing => (
                        <div key={ing.id} className="p-3 bg-slate-900/60 rounded-xl border border-red-500/20 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{ing.name}</p>
                            <p className="text-[10px] text-red-400 mt-0.5">Stock mínimo requerido: {ing.minStock} {ing.unit}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-red-500">{ing.stock}</span>
                            <span className="text-xs text-slate-400 ml-1">{ing.unit}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('inventario')}
                  className="mt-4 w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Abastecer Inventario
                </button>
              </div>

              {/* Monitor de Pedidos Activos Rápidos */}
              <div className="lg:col-span-2 bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-md text-slate-100">Cola de Órdenes Recientes</h3>
                  <button 
                    onClick={() => setActiveTab('cocina')} 
                    className="text-xs text-amber-400 font-semibold hover:underline"
                  >
                    Ver monitor de cocina &rarr;
                  </button>
                </div>
                <div className="mt-4 space-y-3 overflow-y-auto max-h-80">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2.5 h-2.5 rounded-full ${
                          order.status === 'Pendiente' ? 'bg-amber-500 animate-pulse' :
                          order.status === 'En Cocina' ? 'bg-indigo-500 animate-pulse' :
                          order.status === 'Entregado' ? 'bg-emerald-500' : 'bg-slate-600'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-200">{order.id}</span>
                            <span className="text-slate-400 text-xs">| {order.customer}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {order.items.map(item => {
                              const prod = products.find(p => p.id === item.productId);
                              return `${item.quantity}x ${prod ? prod.name : 'Desconocido'}`;
                            }).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                        <span className="text-sm font-extrabold text-amber-500">${order.total.toLocaleString('es-CO')}</span>
                        <div className="flex gap-1">
                          {order.status === 'Pendiente' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'En Cocina')}
                              className="px-2.5 py-1 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-lg hover:bg-indigo-600/40 transition-all"
                            >
                              Cocinar
                            </button>
                          )}
                          {order.status === 'En Cocina' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Entregado')}
                              className="px-2.5 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-lg hover:bg-emerald-600/40 transition-all"
                            >
                              Entregar
                            </button>
                          )}
                          <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg ${
                            order.status === 'Pendiente' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            order.status === 'En Cocina' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            order.status === 'Entregado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MÓDULO: REGISTRAR PEDIDOS (INTERFAZ TÁCTIL POS)
           ========================================================= */}
        {activeTab === 'pedidos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Listado de Productos del Menú */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold">Menú Táctil</h2>
                  <p className="text-xs text-slate-400">Selecciona los productos y controla la disponibilidad en tiempo real.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(product => {
                  const maxPreps = calculateMaxPreparable(product);
                  const isOutOfStock = maxPreps <= 0;
                  
                  return (
                    <div 
                      key={product.id}
                      onClick={() => !isOutOfStock && addToCart(product)}
                      className={`group p-4 rounded-2xl border text-left flex flex-col justify-between h-44 transition-all cursor-pointer ${
                        isOutOfStock 
                          ? 'bg-slate-900/40 border-slate-800/80 opacity-50 cursor-not-allowed'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 hover:border-amber-500/50 hover:-translate-y-0.5'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOutOfStock ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {isOutOfStock ? 'Sin Insumos' : `Disp: ${maxPreps} unds`}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-200 mt-1.5 group-hover:text-amber-400 transition-colors">{product.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-800/80 pt-2.5">
                        <span className="text-md font-extrabold text-amber-500">${product.price.toLocaleString('es-CO')}</span>
                        <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carrito de Compras / Facturación de Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 sticky top-24 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                    <span>Pedido Actual</span>
                    <span className="text-xs font-bold px-2 py-1 bg-amber-500/10 text-amber-400 rounded-lg">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                    </span>
                  </h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <svg className="w-12 h-12 mx-auto text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-sm">Agrega productos del menú táctil para armar el pedido.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-72 overflow-y-auto mb-4 pr-1 scrollbar-thin">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">${(item.product.price * item.quantity).toLocaleString('es-CO')}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800">
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="px-2 py-1 text-slate-400 hover:text-white"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-amber-400">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                className="px-2 py-1 text-slate-400 hover:text-white"
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleCreateOrder} className="space-y-3 pt-4 border-t border-slate-800">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Nombre del Cliente *</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Andrés Pérez"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Notas de Cocina</label>
                      <input 
                        type="text" 
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ej. Término medio, sin salsas"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1 mt-4">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Subtotal:</span>
                        <span>${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Impuestos (Consumo):</span>
                        <span>$0 (Exento)</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold border-t border-slate-800 pt-1.5 mt-1 text-slate-200">
                        <span>Total a Pagar:</span>
                        <span className="text-amber-500">${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString('es-CO')} COP</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={cart.length === 0}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all mt-3 ${
                        cart.length === 0 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/10 hover:-translate-y-0.5'
                      }`}
                    >
                      Enviar a Cocina e Imprimir
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MÓDULO: COLA DE COCINA (KANBAN DE PEDIDOS)
           ========================================================= */}
        {activeTab === 'cocina' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold">Monitor de Cocina y Despacho</h2>
              <p className="text-xs text-slate-400">Monitorea y avanza los estados de las comandas en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Columna: PENDIENTES */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col h-[600px]">
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/30 mb-4">
                  <h3 className="font-extrabold text-xs text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Por Preparar ({orders.filter(o => o.status === 'Pendiente').length})
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {orders.filter(o => o.status === 'Pendiente').map(order => (
                    <div key={order.id} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-100 text-sm">{order.id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-300 mt-1">Cliente: {order.customer}</p>
                      
                      <div className="mt-2.5 bg-slate-950/60 p-2 rounded-lg space-y-1">
                        {order.items.map((item, idx) => {
                          const prod = products.find(p => p.id === item.productId);
                          return (
                            <p key={idx} className="text-xs text-slate-300">
                              <span className="text-amber-400 font-bold">{item.quantity}x</span> {prod ? prod.name : 'Producto'}
                            </p>
                          );
                        })}
                      </div>
                      
                      {order.notes && (
                        <p className="text-[10px] text-orange-300 italic mt-2 bg-orange-950/30 py-1 px-2 rounded">
                          Nota: {order.notes}
                        </p>
                      )}

                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'En Cocina')}
                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-lg transition-all"
                        >
                          Iniciar Cocción
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Cancelado')}
                          className="px-2 py-1.5 bg-slate-900 text-red-400 hover:bg-slate-850 rounded-lg text-xs"
                          title="Cancelar Pedido"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'Pendiente').length === 0 && (
                    <p className="text-center text-slate-600 text-xs py-12">Sin comandas en espera.</p>
                  )}
                </div>
              </div>

              {/* Columna: EN COCINA */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col h-[600px]">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/30 mb-4">
                  <h3 className="font-extrabold text-xs text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    En Cocina ({orders.filter(o => o.status === 'En Cocina').length})
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {orders.filter(o => o.status === 'En Cocina').map(order => (
                    <div key={order.id} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-100 text-sm">{order.id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-300 mt-1">Cliente: {order.customer}</p>

                      <div className="mt-2.5 bg-slate-950/60 p-2 rounded-lg space-y-1">
                        {order.items.map((item, idx) => {
                          const prod = products.find(p => p.id === item.productId);
                          return (
                            <p key={idx} className="text-xs text-slate-300">
                              <span className="text-indigo-400 font-bold">{item.quantity}x</span> {prod ? prod.name : 'Producto'}
                            </p>
                          );
                        })}
                      </div>

                      {order.notes && (
                        <p className="text-[10px] text-orange-300 italic mt-2 bg-orange-950/30 py-1 px-2 rounded">
                          Nota: {order.notes}
                        </p>
                      )}

                      <div className="mt-4">
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Entregado')}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg transition-all"
                        >
                          Marcar como Entregado
                        </button>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'En Cocina').length === 0 && (
                    <p className="text-center text-slate-600 text-xs py-12">No hay platos en preparación.</p>
                  )}
                </div>
              </div>

              {/* Columna: ENTREGADOS / COMPLETADOS */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col h-[600px]">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30 mb-4">
                  <h3 className="font-extrabold text-xs text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Entregados ({orders.filter(o => o.status === 'Entregado').length})
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {orders.filter(o => o.status === 'Entregado').map(order => (
                    <div key={order.id} className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 opacity-80">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-300 text-sm">{order.id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-bold mt-1">Cliente: {order.customer}</p>
                      <p className="text-xs text-emerald-400 font-bold mt-1">Venta total: ${order.total.toLocaleString('es-CO')}</p>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'Entregado').length === 0 && (
                    <p className="text-center text-slate-600 text-xs py-12">No se han realizado entregas en esta sesión.</p>
                  )}
                </div>
              </div>

              {/* Columna: HISTORIAL DE COMPRAS (DASHBOARD RAPIDO) */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col h-[600px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Historial Completo ({orders.length})
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {orders.map(order => (
                    <div key={order.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-200">{order.id}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          order.status === 'Cancelado' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-slate-400 font-semibold">{order.customer}</p>
                      <p className="text-amber-500 font-bold mt-1">${order.total.toLocaleString('es-CO')} COP</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            MÓDULO: MENÚ / RECETAS (CREAR Y EDITAR PLATOS)
           ========================================================= */}
        {activeTab === 'productos' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold">Catálogo del Menú & Fórmulas de Receta</h2>
                <p className="text-xs text-slate-400">Modifica ingredientes y proporciones de consumo para descuentos automatizados.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setIsProdModalOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Agregar Producto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                        {product.category}
                      </span>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProdModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Editar producto"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-100 text-lg mt-3">{product.name}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{product.description}</p>

                    {/* Ficha de ingredientes */}
                    <div className="mt-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Receta Consumo</span>
                      <div className="mt-2 space-y-1.5">
                        {product.recipe.map((recipeItem, index) => {
                          const ing = ingredients.find(i => i.id === recipeItem.ingredientId);
                          return (
                            <div key={index} className="flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-medium">{ing ? ing.name : 'Ingrediente eliminado'}</span>
                              <span className="text-amber-400 font-bold">{recipeItem.quantity} {ing ? ing.unit : ''}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-850 pt-4 flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-semibold">Precio Venta</span>
                    <span className="text-lg font-extrabold text-amber-500">${product.price.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL: REGISTRAR / EDITAR PRODUCTO */}
            {isProdModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3.5 mb-5">
                    <h3 className="font-extrabold text-lg text-slate-100">
                      {editingProduct ? 'Editar Producto del Menú' : 'Crear Nuevo Producto'}
                    </h3>
                    <button 
                      onClick={() => {
                        setIsProdModalOpen(false);
                        setEditingProduct(null);
                      }}
                      className="text-slate-400 hover:text-slate-200 font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Nombre del Producto *</label>
                        <input 
                          type="text" 
                          name="name" 
                          defaultValue={editingProduct ? editingProduct.name : ''}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                          placeholder="Ej. Salchipapa Llanera"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Precio de Venta (COP) *</label>
                        <input 
                          type="number" 
                          name="price" 
                          defaultValue={editingProduct ? editingProduct.price : ''}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                          placeholder="Ej. 15000"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Categoría *</label>
                        <select 
                          name="category"
                          defaultValue={editingProduct ? editingProduct.category : 'Hamburguesas'}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Hamburguesas">Hamburguesas</option>
                          <option value="Perros Calientes">Perros Calientes</option>
                          <option value="Mazorcas">Mazorcas</option>
                          <option value="Acompañamientos">Acompañamientos</option>
                          <option value="Bebidas">Bebidas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Descripción</label>
                        <input 
                          type="text" 
                          name="description" 
                          defaultValue={editingProduct ? editingProduct.description : ''}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                          placeholder="Breve descripción del plato"
                        />
                      </div>
                    </div>

                    {/* CONFIGURACIÓN DE RECETA DINÁMICA */}
                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Composición de Receta (Ingredientes Requeridos)</h4>
                      <p className="text-[10px] text-slate-500 mb-3">Indica la cantidad requerida para preparar UNA sola porción de este producto. Deja en 0 los ingredientes que no apliquen.</p>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                        {ingredients.map(ing => {
                          const existingRecipeItem = editingProduct?.recipe?.find(r => r.ingredientId === ing.id);
                          return (
                            <div key={ing.id} className="flex items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-lg text-xs">
                              <span className="font-semibold text-slate-300">{ing.name} ({ing.unit})</span>
                              <input 
                                type="number" 
                                step="any"
                                name={`recipe_${ing.id}`}
                                defaultValue={existingRecipeItem ? existingRecipeItem.quantity : 0}
                                className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center font-bold text-amber-400 focus:outline-none focus:border-amber-500 text-xs"
                                placeholder="0"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsProdModalOpen(false);
                          setEditingProduct(null);
                        }}
                        className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="px-6 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl"
                      >
                        {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            MÓDULO: INVENTARIO DE INGREDIENTES
           ========================================================= */}
        {activeTab === 'inventario' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold">Gestión de Stock de Materias Primas</h2>
                <p className="text-xs text-slate-400">Controla cantidades disponibles, configura el punto de reorden y agrega nuevos insumos.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingIngredient(null);
                  setIsIngModalOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Nuevo Ingrediente
              </button>
            </div>

            {/* TABLA DE INVENTARIO */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Ingrediente</th>
                      <th className="px-6 py-4 text-center">Stock Actual</th>
                      <th className="px-6 py-4 text-center">Unidad de Medida</th>
                      <th className="px-6 py-4 text-center">Mínimo de Alerta</th>
                      <th className="px-6 py-4 text-center">Estado de Stock</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {ingredients.map(ing => {
                      const isLow = ing.stock <= ing.minStock;
                      return (
                        <tr key={ing.id} className="hover:bg-slate-850/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-200">{ing.name}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-extrabold text-md ${isLow ? 'text-red-400' : 'text-slate-100'}`}>
                              {ing.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-slate-400 font-semibold">{ing.unit}</td>
                          <td className="px-6 py-4 text-center text-slate-400">{ing.minStock}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 text-[10px] font-extrabold rounded-lg ${
                              isLow 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {isLow ? 'Abastecer Urgente' : 'Suficiente'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button 
                                onClick={() => {
                                  setEditingIngredient(ing);
                                  setIsIngModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-all"
                                title="Editar ingrediente"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteIngredient(ing.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all"
                                title="Eliminar ingrediente"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODAL: REGISTRAR / EDITAR INGREDIENTE */}
            {isIngModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <h3 className="font-extrabold text-md text-slate-100">
                      {editingIngredient ? 'Editar Ingrediente' : 'Añadir Insumo al Inventario'}
                    </h3>
                    <button 
                      onClick={() => {
                        setIsIngModalOpen(false);
                        setEditingIngredient(null);
                      }}
                      className="text-slate-400 hover:text-slate-200 font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleSaveIngredient} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Nombre del Ingrediente *</label>
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={editingIngredient ? editingIngredient.name : ''}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                        placeholder="Ej. Queso Siete Cueros Rallado"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Stock Inicial *</label>
                        <input 
                          type="number" 
                          step="any"
                          name="stock" 
                          defaultValue={editingIngredient ? editingIngredient.stock : ''}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                          placeholder="Ej. 1000"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Unidad de Medida *</label>
                        <select 
                          name="unit"
                          defaultValue={editingIngredient ? editingIngredient.unit : 'g'}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="g">Gramos (g)</option>
                          <option value="Und">Unidad (Und)</option>
                          <option value="Porciones">Porciones</option>
                          <option value="ml">Mililitros (ml)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Alerta de Stock Mínimo *</label>
                      <input 
                        type="number" 
                        step="any"
                        name="minStock" 
                        defaultValue={editingIngredient ? editingIngredient.minStock : ''}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                        placeholder="Ej. 200"
                        required
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsIngModalOpen(false);
                          setEditingIngredient(null);
                        }}
                        className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-755 rounded-xl"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl"
                      >
                        {editingIngredient ? 'Actualizar Insumo' : 'Guardar Insumo'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-500 text-center py-6 border-t border-slate-850/60 mt-auto text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 SaborGlow POS - Prototipo Desarrollado para Formulación de Proyectos.</p>
          <p className="text-[10px] text-slate-600">Autores: Cardenas, Guevara, Sánchez, Tovar | UniMeta</p>
        </div>
      </footer>

    </div>
  );
}