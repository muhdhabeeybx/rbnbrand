import React, { useState } from 'react';
import { 
  BarChart3, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Bell,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Star,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { AdminProvider } from '../contexts/AdminContext';
import { ProductModal } from '../components/admin/ProductModal';
import { PromotionModal } from '../components/admin/PromotionModal';
import { OrderDetailsModal } from '../components/admin/OrderDetailsModal';
import { CustomerDetailsModal } from '../components/admin/CustomerDetailsModal';
import { MobileAdminNav } from '../components/admin/MobileAdminNav';
import { MobileProductCard, MobileOrderCard, MobileCustomerCard } from '../components/admin/ResponsiveTable';
import { toast } from 'sonner@2.0.3';

// Mock data for charts
const salesData = [
  { name: 'Jan', revenue: 12000, orders: 145, customers: 89 },
  { name: 'Feb', revenue: 15000, orders: 178, customers: 112 },
  { name: 'Mar', revenue: 18000, orders: 203, customers: 134 },
  { name: 'Apr', revenue: 22000, orders: 267, customers: 156 },
  { name: 'May', revenue: 25000, orders: 298, customers: 178 },
  { name: 'Jun', revenue: 28000, orders: 324, customers: 201 },
];

const categoryData = [
  { name: 'Hoodies', value: 35, sales: 1250, color: '#000000' },
  { name: 'T-Shirts', value: 28, sales: 980, color: '#404040' },
  { name: 'Outerwear', value: 20, sales: 700, color: '#808080' },
  { name: 'Pants', value: 17, sales: 595, color: '#C0C0C0' },
];

function AdminDashboard() {
  const {
    products,
    orders,
    customers,
    promotions,
    analytics,
    modals,
    setModal,
    updateOrderStatus,
    togglePromotion,
    deleteProduct,
    deletePromotion
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 10) return { color: 'text-red-600', status: 'Low Stock', bgColor: 'bg-red-50' };
    if (stock <= 25) return { color: 'text-yellow-600', status: 'Medium', bgColor: 'bg-yellow-50' };
    return { color: 'text-green-600', status: 'In Stock', bgColor: 'bg-green-50' };
  };

  const lowStockCount = products.filter(p => p.stock <= 25).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
              <div className="flex items-center mt-2">
                {trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {change}% from last month
                </span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-gray-100 rounded-full">
              <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening with RBN.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileAdminNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          lowStockCount={lowStockCount}
          pendingOrdersCount={pendingOrdersCount}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Navigation */}
          <TabsList className="hidden lg:grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="text-sm">Orders</TabsTrigger>
            <TabsTrigger value="products" className="text-sm">Products</TabsTrigger>
            <TabsTrigger value="customers" className="text-sm">Customers</TabsTrigger>
            <TabsTrigger value="inventory" className="text-sm">Inventory</TabsTrigger>
            <TabsTrigger value="promotions" className="text-sm">Promotions</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatCard
                title="Total Revenue"
                value={`$${analytics.totalRevenue.toLocaleString()}`}
                change={analytics.revenueGrowth}
                icon={DollarSign}
                trend="up"
              />
              <StatCard
                title="Total Orders"
                value={analytics.totalOrders.toLocaleString()}
                change={analytics.orderGrowth}
                icon={ShoppingCart}
                trend="up"
              />
              <StatCard
                title="New Customers"
                value={analytics.totalCustomers}
                change={analytics.customerGrowth}
                icon={Users}
                trend="up"
              />
              <StatCard
                title="Conversion Rate"
                value={`${analytics.conversionRate}%`}
                change={analytics.conversionGrowth}
                icon={TrendingUp}
                trend="up"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{ revenue: { label: "Revenue", color: "#000" } }} className="h-[250px] sm:h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area type="monotone" dataKey="revenue" stroke="#000" fill="#000" fillOpacity={0.1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-[250px] sm:h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => setModal('orderDetails', { isOpen: true, order })}>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base">{order.id}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{order.customer}</p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="font-medium text-sm sm:text-base">${order.total}</p>
                          <Badge className={`${getStatusColor(order.status)} text-xs`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Low Stock Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {products.filter(p => p.stock <= 25).map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <div key={product.id} className={`flex items-center justify-between p-3 sm:p-4 ${stockStatus.bgColor} rounded-lg`}>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">{product.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 capitalize">{product.category}</p>
                          </div>
                          <div className="text-right ml-2">
                            <p className={`font-medium ${stockStatus.color} text-sm sm:text-base`}>{product.stock} left</p>
                            <Badge className={`${stockStatus.color.includes('red') ? 'bg-red-100 text-red-800' : 
                                            stockStatus.color.includes('yellow') ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-green-100 text-green-800'} text-xs`}>
                              {stockStatus.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Order Management</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input 
                    placeholder="Search orders..." 
                    className="pl-10 w-full sm:w-64" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="hidden sm:flex">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {orders.filter(order => 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((order) => (
                <MobileOrderCard
                  key={order.id}
                  order={order}
                  onView={(order) => setModal('orderDetails', { isOpen: true, order })}
                  onStatusUpdate={updateOrderStatus}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>

            {/* Desktop Table */}
            <Card className="border-0 shadow-lg hidden lg:block">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(order => 
                      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setModal('orderDetails', { isOpen: true, order })}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                                  Mark Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>
                                  Mark Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'completed')}>
                                  Mark Completed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Product Management</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="hoodies">Hoodies</SelectItem>
                      <SelectItem value="tees">T-Shirts</SelectItem>
                      <SelectItem value="outerwear">Outerwear</SelectItem>
                      <SelectItem value="pants">Pants</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setModal('addProduct', true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Add Product</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {products.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((product) => (
                <MobileProductCard
                  key={product.id}
                  product={product}
                  onEdit={(product) => setModal('editProduct', { isOpen: true, product })}
                  onDelete={(id) => {
                    deleteProduct(id);
                    toast.success('Product deleted successfully');
                  }}
                  getStatusColor={getStatusColor}
                  getStockStatus={getStockStatus}
                />
              ))}
            </div>

            {/* Desktop Table */}
            <Card className="border-0 shadow-lg hidden lg:block">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Stock</TableHead>
                      <TableHead className="font-semibold">Sales</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.filter(product => 
                      product.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.category}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">${product.price}</TableCell>
                          <TableCell>
                            <span className={stockStatus.color}>{product.stock}</span>
                          </TableCell>
                          <TableCell>{product.sales}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setModal('editProduct', { isOpen: true, product })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  deleteProduct(product.id);
                                  toast.success('Product deleted successfully');
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Customer Management</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input 
                    placeholder="Search customers..." 
                    className="pl-10 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {customers.filter(customer => 
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((customer) => (
                <MobileCustomerCard
                  key={customer.id}
                  customer={customer}
                  onView={(customer) => setModal('customerDetails', { isOpen: true, customer })}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>

            {/* Desktop Table */}
            <Card className="border-0 shadow-lg hidden lg:block">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Orders</TableHead>
                      <TableHead className="font-semibold">Total Spent</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.filter(customer => 
                      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((customer) => (
                      <TableRow key={customer.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-600">Joined {customer.joinDate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
                        <TableCell className="font-medium">${customer.totalSpent}</TableCell>
                        <TableCell>
                          <Badge className={
                            customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' :
                            customer.status === 'Regular' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {customer.status === 'VIP' && <Star className="w-3 h-3 mr-1" />}
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setModal('customerDetails', { isOpen: true, customer })}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Promotions & Discounts</h2>
              <Button onClick={() => setModal('addPromotion', true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Active Promotions</p>
                      <p className="text-xl sm:text-2xl font-bold">{promotions.filter(p => p.isActive).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Usage</p>
                      <p className="text-xl sm:text-2xl font-bold">{promotions.reduce((sum, p) => sum + p.usageCount, 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {promotions.map((promotion) => (
                    <div key={promotion.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h4 className="font-semibold text-base sm:text-lg">{promotion.name}</h4>
                          <Badge className={promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {promotion.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm sm:text-base">{promotion.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <span>Code: <span className="font-mono font-medium">{promotion.code}</span></span>
                          <span>Used: {promotion.usageCount}{promotion.usageLimit ? `/${promotion.usageLimit}` : ''} times</span>
                          <span>Expires: {promotion.endDate || 'No expiry'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <Switch
                          checked={promotion.isActive}
                          onCheckedChange={() => {
                            togglePromotion(promotion.id);
                            toast.success(`Promotion ${promotion.isActive ? 'deactivated' : 'activated'}`);
                          }}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setModal('editPromotion', { isOpen: true, promotion })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            deletePromotion(promotion.id);
                            toast.success('Promotion deleted successfully');
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with placeholder content */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Advanced Analytics</h2>
            <div className="text-center py-20 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Advanced analytics coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Inventory Management</h2>
            <div className="text-center py-20 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Inventory management coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Settings</h2>
            <div className="text-center py-20 text-gray-500">
              <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Settings panel coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={modals.addProduct}
        onClose={() => setModal('addProduct', false)}
        mode="add"
      />
      
      <ProductModal
        isOpen={modals.editProduct.isOpen}
        onClose={() => setModal('editProduct', { isOpen: false })}
        product={modals.editProduct.product}
        mode="edit"
      />

      <PromotionModal
        isOpen={modals.addPromotion}
        onClose={() => setModal('addPromotion', false)}
        mode="add"
      />
      
      <PromotionModal
        isOpen={modals.editPromotion.isOpen}
        onClose={() => setModal('editPromotion', { isOpen: false })}
        promotion={modals.editPromotion.promotion}
        mode="edit"
      />

      <OrderDetailsModal
        isOpen={modals.orderDetails.isOpen}
        onClose={() => setModal('orderDetails', { isOpen: false })}
        order={modals.orderDetails.order}
      />

      <CustomerDetailsModal
        isOpen={modals.customerDetails.isOpen}
        onClose={() => setModal('customerDetails', { isOpen: false })}
        customer={modals.customerDetails.customer}
      />
    </div>
  );
}

export function AdminPage() {
  return (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  );
}