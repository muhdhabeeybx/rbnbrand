import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Bell,
  ChevronDown,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  LogOut,
  Home
} from 'lucide-react';

// Context and components
import { useAdmin } from '../contexts/AdminContextFixed';
import { ProductModal } from '../components/admin/ProductModal';
import { PromotionModal } from '../components/admin/PromotionModal';
import { OrderDetailsModal } from '../components/admin/OrderDetailsModal';
import { CustomerDetailsModal } from '../components/admin/CustomerDetailsModal';
import { ResponsiveTable } from '../components/admin/ResponsiveTable';
import { MobileAdminNav } from '../components/admin/MobileAdminNav';
import { MobileTabNav } from '../components/admin/MobileTabNav';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { motion } from 'motion/react';

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    products,
    orders,
    customers,
    promotions,
    analytics,
    refreshProducts,
    refreshOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    modals,
    setModal,
    updateOrderStatus,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion
  } = useAdmin();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        refreshProducts(),
        refreshOrders()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="flex items-center text-xs">
            {trend === 'up' ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : trend === 'down' ? (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            ) : null}
            <span className={`${
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {change}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const DashboardContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          change={`+${analytics.revenueGrowth}%`}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Orders"
          value={formatNumber(analytics.totalOrders)}
          change={`+${analytics.orderGrowth}%`}
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Customers"
          value={formatNumber(analytics.totalCustomers)}
          change={`+${analytics.customerGrowth}%`}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          change={`+${analytics.conversionGrowth}%`}
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Quick Actions
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setModal('addProduct', true)}
              className="h-20 flex flex-col space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span>Add Product</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setModal('addPromotion', true)}
              className="h-20 flex flex-col space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span>Add Promotion</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab('orders')}
              className="h-20 flex flex-col space-y-2"
            >
              <Eye className="h-6 w-6" />
              <span>View Orders</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-600">Order {order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <Badge variant={
                      order.status === 'completed' ? 'default' :
                      order.status === 'processing' ? 'secondary' :
                      order.status === 'shipped' ? 'outline' : 'destructive'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-gray-500 py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              {products.length === 0 && (
                <p className="text-center text-gray-500 py-4">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const ProductsContent = () => {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-gray-600">Manage your inventory</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => setModal('addProduct', true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <ResponsiveTable
          data={filteredProducts}
          columns={[
            {
              header: 'Product',
              accessor: 'name',
              render: (value: string, item: any) => (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{value}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
              )
            },
            {
              header: 'Price',
              accessor: 'price',
              render: (value: number) => formatCurrency(value)
            },
            {
              header: 'Stock',
              accessor: 'stock',
              render: (value: number) => (
                <Badge variant={value > 10 ? 'default' : value > 0 ? 'secondary' : 'destructive'}>
                  {value}
                </Badge>
              )
            },
            {
              header: 'Sales',
              accessor: 'sales'
            },
            {
              header: 'Revenue',
              accessor: 'revenue',
              render: (value: number) => formatCurrency(value)
            },
            {
              header: 'Status',
              accessor: 'status',
              render: (value: string) => (
                <Badge variant={value === 'active' ? 'default' : 'secondary'}>
                  {value}
                </Badge>
              )
            }
          ]}
          actions={(item) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setModal('editProduct', { isOpen: true, product: item })}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteProduct(item.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>
    );
  };

  const OrdersContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <ResponsiveTable
        data={orders}
        columns={[
          {
            header: 'Order ID',
            accessor: 'id'
          },
          {
            header: 'Customer',
            accessor: 'customer'
          },
          {
            header: 'Total',
            accessor: 'total',
            render: (value: number) => formatCurrency(value)
          },
          {
            header: 'Status',
            accessor: 'status',
            render: (value: string) => (
              <Badge variant={
                value === 'completed' ? 'default' :
                value === 'processing' ? 'secondary' :
                value === 'shipped' ? 'outline' : 'destructive'
              }>
                {value}
              </Badge>
            )
          },
          {
            header: 'Date',
            accessor: 'date'
          }
        ]}
        actions={(item) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModal('orderDetails', { isOpen: true, order: item })}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        )}
      />
    </motion.div>
  );

  const CustomersContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-gray-600">Manage customer relationships</p>
        </div>
      </div>

      <ResponsiveTable
        data={customers}
        columns={[
          {
            header: 'Customer',
            accessor: 'name',
            render: (value: string, item: any) => (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{value.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{value}</p>
                  <p className="text-sm text-gray-600">{item.email}</p>
                </div>
              </div>
            )
          },
          {
            header: 'Orders',
            accessor: 'orders'
          },
          {
            header: 'Total Spent',
            accessor: 'totalSpent',
            render: (value: number) => formatCurrency(value)
          },
          {
            header: 'Status',
            accessor: 'status',
            render: (value: string) => (
              <Badge variant={
                value === 'VIP' ? 'default' :
                value === 'Regular' ? 'secondary' : 'outline'
              }>
                {value}
              </Badge>
            )
          },
          {
            header: 'Join Date',
            accessor: 'joinDate'
          }
        ]}
        actions={(item) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModal('customerDetails', { isOpen: true, customer: item })}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        )}
      />
    </motion.div>
  );

  const PromotionsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Promotions</h2>
          <p className="text-gray-600">Manage discounts and offers</p>
        </div>
        <Button onClick={() => setModal('addPromotion', true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Promotion
        </Button>
      </div>

      <ResponsiveTable
        data={promotions}
        columns={[
          {
            header: 'Name',
            accessor: 'name'
          },
          {
            header: 'Code',
            accessor: 'code',
            render: (value: string) => (
              <Badge variant="outline">{value}</Badge>
            )
          },
          {
            header: 'Type',
            accessor: 'type',
            render: (value: string) => value === 'percentage' ? 'Percentage' : 'Fixed Amount'
          },
          {
            header: 'Value',
            accessor: 'value',
            render: (value: number, item: any) => 
              item.type === 'percentage' ? `${value}%` : formatCurrency(value)
          },
          {
            header: 'Usage',
            accessor: 'usageCount',
            render: (value: number, item: any) => 
              `${value}${item.usageLimit ? `/${item.usageLimit}` : ''}`
          },
          {
            header: 'Status',
            accessor: 'isActive',
            render: (value: boolean) => (
              <Badge variant={value ? 'default' : 'secondary'}>
                {value ? 'Active' : 'Inactive'}
              </Badge>
            )
          }
        ]}
        actions={(item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setModal('editPromotion', { isOpen: true, promotion: item })}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => togglePromotion(item.id)}>
                <Activity className="h-4 w-4 mr-2" />
                {item.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deletePromotion(item.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </motion.div>
  );

  const SettingsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600">Manage admin settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <Input defaultValue="Rain by Nurain" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Store Email</label>
              <Input defaultValue="admin@rainbynurain.com" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Store Currency</label>
              <Input defaultValue="NGN" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Notifications</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Order Alerts</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Low Stock Alerts</span>
              <Badge variant="default">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Home className="w-4 h-4 mr-2" />
              View Store
            </Button>
          </CardContent>
        </Card>

        {/* Admin Info */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium">Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Products</span>
              <span className="text-sm font-medium">{products.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-sm font-medium">{orders.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-lg text-black">RBN Admin</h1>
                <Badge variant="outline" className="text-xs">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="p-2"
                  title="View Store"
                >
                  <Home className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <MobileTabNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingOrdersCount={orders.filter(order => order.status === 'pending').length}
          lowStockCount={products.filter(product => product.stock <= 5).length}
        />

        {/* Content Area */}
        <div className="relative">
          <div className="p-4 pb-6">
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'products' && <ProductsContent />}
            {activeTab === 'orders' && <OrdersContent />}
            {activeTab === 'customers' && <CustomersContent />}
          </div>
        </div>

        {/* Modals */}
        <ProductModal />
        <PromotionModal />
        <OrderDetailsModal />
        <CustomerDetailsModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="font-heading text-xl sm:text-2xl text-black">RBN Admin</h1>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Dashboard
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Back to Site</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <Home className="w-4 h-4 mr-2" />
                    View Site
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <MobileTabNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingOrdersCount={orders.filter(order => order.status === 'pending').length}
        lowStockCount={products.filter(product => product.stock <= 5).length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 admin-mobile-content">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="admin-tabs-container">
          {/* Desktop Tab Navigation */}
          <TabsList className="hidden lg:grid w-full grid-cols-4 admin-desktop-tabs">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductsContent />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersContent />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <CustomersContent />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ProductModal />
      <PromotionModal />
      <OrderDetailsModal />
      <CustomerDetailsModal />
    </div>
  );
}