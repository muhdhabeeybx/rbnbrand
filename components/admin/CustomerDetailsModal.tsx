import React from 'react';
import { User, MapPin, Calendar, DollarSign, ShoppingBag, Star, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { useAdmin, AdminCustomer } from '../../contexts/AdminContextFixed';
import { toast } from 'sonner@2.0.3';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: AdminCustomer;
}

export function CustomerDetailsModal({ isOpen, onClose, customer }: CustomerDetailsModalProps) {
  const { updateCustomerStatus } = useAdmin();

  if (!customer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (newStatus: AdminCustomer['status']) => {
    updateCustomerStatus(customer.id, newStatus);
    toast.success(`Customer status updated to ${newStatus}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto m-0 md:m-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Details
          </DialogTitle>
          <DialogDescription>
            View comprehensive customer information, order history, and manage customer status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Overview */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">{getInitials(customer.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <p className="text-gray-600">{customer.email}</p>
                {customer.phone && (
                  <p className="text-gray-600 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status === 'VIP' && <Star className="w-3 h-3 mr-1" />}
                    {customer.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Customer since {new Date(customer.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <Select value={customer.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Total Orders</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{customer.orders}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-green-600">${customer.totalSpent.toFixed(2)}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Last Order</span>
              </div>
              <p className="text-lg font-bold text-purple-600">
                {new Date(customer.lastOrder).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Address Information */}
          {customer.address && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <p>{customer.address.street}</p>
                    <p>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</p>
                    <p>{customer.address.country}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Customer Insights */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Insights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="font-medium">Average Order Value</p>
                <p className="text-xl font-bold text-green-600">
                  ${(customer.totalSpent / customer.orders).toFixed(2)}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium">Customer Lifetime Value</p>
                <p className="text-xl font-bold text-blue-600">
                  ${(customer.totalSpent * 1.5).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Separator />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline">
                View Order History
              </Button>
              <Button variant="outline">
                Create Manual Order
              </Button>
            </div>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}