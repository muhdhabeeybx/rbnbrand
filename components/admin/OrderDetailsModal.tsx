import React, { useState } from 'react';
import { Package, Truck, User, MapPin, CreditCard, Clock, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { useAdmin, AdminOrder } from '../../contexts/AdminContextFixed';
import { toast } from 'sonner@2.0.3';

export function OrderDetailsModal() {
  const { modals, setModal, updateOrderStatus } = useAdmin();
  const [trackingInput, setTrackingInput] = useState('');

  const isOpen = modals.orderDetails?.isOpen || false;
  const order = modals.orderDetails?.order;

  const onClose = () => setModal('orderDetails', { isOpen: false });

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

  const handleStatusUpdate = async (newStatus: AdminOrder['status']) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto m-0 md:m-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details - {order.id}
          </DialogTitle>
          <DialogDescription>
            View and manage order information, update status, and track shipments.
          </DialogDescription>
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
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span>{typeof order.customer === 'string' ? order.customer : order.customer?.name || 'Unknown Customer'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span>{order.customer?.email || order.customerEmail}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span>{order.phone || (typeof order.customer === 'object' ? order.customer?.phone : '') || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Order Total:</span>
                  <span className="text-lg font-bold">₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span>{order.shippingAddress?.name || (typeof order.customer === 'string' ? order.customer : order.customer?.name) || 'Unknown Customer'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Address:</span>
                  <span>{order.shippingAddress?.street || order.shippingAddress?.address || 'Address not provided'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">City/State:</span>
                  <span>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Country:</span>
                  <span>{order.shippingAddress?.country || 'Nigeria'}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name || item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {item.size && `Size: ${item.size}`} {item.size && item.color && '•'} {item.color && `Color: ${item.color}`} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">₦{item.price} each</p>
                  </div>
                </div>
              )) || (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  No items found
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{order.subtotal?.toFixed(2) || (order.total - (order.deliveryFee || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₦{order.deliveryFee?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tracking & Timeline */}
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
                <Button 
                  onClick={async () => {
                    if (trackingInput.trim()) {
                      try {
                        await updateOrderStatus(order.id, order.status, trackingInput.trim());
                        setTrackingInput('');
                        toast.success('Tracking number added successfully');
                      } catch (error) {
                        toast.error('Failed to add tracking number');
                      }
                    }
                  }} 
                  disabled={!trackingInput.trim()}
                >
                  Add Tracking
                </Button>
              </div>
            )}

            {/* Order Timeline */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Order Timeline</h4>
                <div className="space-y-3">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(event.status)} variant="secondary">
                            {event.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}