import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Eye, Edit, Trash2, MoreHorizontal, Star } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AdminProduct, AdminOrder, AdminCustomer } from '../../contexts/AdminContextFixed';

// Responsive Table Component
interface Column {
  header: string;
  accessor: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  actions?: (item: any) => React.ReactNode;
}

export function ResponsiveTable({ data, columns, actions }: ResponsiveTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th key={column.accessor} className="text-left py-3 px-4 font-medium text-gray-600">
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.accessor} className="py-3 px-4">
                    {column.render 
                      ? column.render(item[column.accessor], item)
                      : item[column.accessor]
                    }
                  </td>
                ))}
                {actions && (
                  <td className="py-3 px-4">
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              {columns.map((column) => (
                <div key={column.accessor} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{column.header}:</span>
                  <span className="font-medium">
                    {column.render 
                      ? column.render(item[column.accessor], item)
                      : item[column.accessor]
                    }
                  </span>
                </div>
              ))}
              {actions && (
                <div className="pt-2 border-t">
                  {actions(item)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Mobile Product Card
export function MobileProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  getStatusColor, 
  getStockStatus 
}: {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStockStatus: (stock: number) => { color: string; status: string; bgColor: string };
}) {
  const stockStatus = getStockStatus(product.stock);
  
  return (
    <Card className="mb-4 border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 capitalize">{product.category}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(product.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-semibold text-lg">${product.price}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Stock</p>
                <p className={`font-semibold ${stockStatus.color}`}>{product.stock}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sales</p>
                <p className="font-semibold">{product.sales}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge className={getStatusColor(product.status)} size="sm">
                  {product.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile Order Card
export function MobileOrderCard({ 
  order, 
  onView, 
  onStatusUpdate, 
  getStatusColor 
}: {
  order: AdminOrder;
  onView: (order: AdminOrder) => void;
  onStatusUpdate: (orderId: string, status: AdminOrder['status']) => void;
  getStatusColor: (status: string) => string;
}) {
  return (
    <Card className="mb-4 border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{order.id}</h3>
            <p className="text-gray-600">{order.customer}</p>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView(order)}>
              <Eye className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'processing')}>
                  Mark Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'shipped')}>
                  Mark Shipped
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'completed')}>
                  Mark Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-bold text-xl">${order.total}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500 mb-1">Items</p>
          <div className="text-sm">
            {order.items.map((item, index) => (
              <p key={index} className="text-gray-700">
                {item.quantity}x {item.productName} ({item.size}, {item.color})
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile Customer Card
export function MobileCustomerCard({ 
  customer, 
  onView, 
  getStatusColor 
}: {
  customer: AdminCustomer;
  onView: (customer: AdminCustomer) => void;
  getStatusColor: (status: string) => string;
}) {
  return (
    <Card className="mb-4 border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.email}</p>
                <p className="text-xs text-gray-500">Joined {customer.joinDate}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onView(customer)}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-500">Orders</p>
                <p className="font-semibold text-lg">{customer.orders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="font-semibold text-lg">${customer.totalSpent}</p>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <Badge className={
                customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' :
                customer.status === 'Regular' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }>
                {customer.status === 'VIP' && <Star className="w-3 h-3 mr-1" />}
                {customer.status}
              </Badge>
              <p className="text-xs text-gray-500">
                Avg: ${(customer.totalSpent / customer.orders).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}