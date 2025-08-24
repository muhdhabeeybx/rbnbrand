import React, { useState } from 'react';
import { Package, Truck, User, MapPin, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { useAdmin, AdminOrder } from '../../contexts/AdminContext';
import { toast } from 'sonner@2.0.3';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: AdminOrder;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  const { updateOrderStatus, addTrackingNumber } = useAdmin();
  const [trackingInput, setTrackingInput] = useState('');

  if (!order) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (newStatus: AdminOrder['status']) => {
    updateOrderStatus(order.id, newStatus);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleAddTracking = () => {
    if (trackingInput.trim()) {
      addTrackingNumber(order.id, trackingInput.trim());
      setTrackingInput('');
      toast.success('Tracking number added successfully');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details - {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">Order Date: {order.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="status">Update Status:</Label>
              <Select value={order.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {order.customer}</p>
                <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                <p><span className="font-medium">Total:</span> <span className="text-lg font-bold">${order.total}</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} • Color: {item.color} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tracking Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping & Tracking
            </h3>
            
            {order.trackingNumber ? (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">Tracking Number: {order.trackingNumber}</p>
                <p className="text-sm text-gray-600">Customer has been notified via email</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter tracking number"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                />
                <Button onClick={handleAddTracking} disabled={!trackingInput.trim()}>
                  Add Tracking
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Refund Order
              </Button>
              <Button variant="outline">
                Print Invoice
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