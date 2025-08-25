import React, { useState, useEffect } from 'react';
import { Loader2, Percent, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useAdmin, AdminPromotion } from '../../contexts/AdminContext';
import { toast } from 'sonner@2.0.3';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: AdminPromotion;
  mode: 'add' | 'edit';
}

export function PromotionModal({ isOpen, onClose, promotion, mode }: PromotionModalProps) {
  const { addPromotion, updatePromotion } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrder: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (promotion && mode === 'edit') {
      setFormData({
        name: promotion.name,
        code: promotion.code,
        type: promotion.type,
        value: promotion.value.toString(),
        minOrder: promotion.minOrder?.toString() || '',
        usageLimit: promotion.usageLimit?.toString() || '',
        startDate: promotion.startDate,
        endDate: promotion.endDate || '',
        description: promotion.description,
        isActive: promotion.isActive
      });
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'percentage',
        value: '',
        minOrder: '',
        usageLimit: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: '',
        isActive: true
      });
    }
  }, [promotion, mode, isOpen]);

  const generateCode = () => {
    const randomCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, code: randomCode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const promotionData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        minOrder: formData.minOrder ? parseFloat(formData.minOrder) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        description: formData.description,
        isActive: formData.isActive
      };

      if (mode === 'add') {
        addPromotion(promotionData);
        toast.success('Promotion created successfully!');
      } else if (promotion) {
        updatePromotion(promotion.id, promotionData);
        toast.success('Promotion updated successfully!');
      }

      onClose();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Create New Promotion' : 'Edit Promotion'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Promotion Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Summer Sale"
              required
            />
          </div>

          <div>
            <Label htmlFor="code">Promo Code *</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SUMMER25"
                required
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                Generate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Discount Type *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Percentage
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Fixed Amount
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">
                {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'} *
              </Label>
              <Input
                id="value"
                type="number"
                step={formData.type === 'percentage' ? '1' : '0.01'}
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder={formData.type === 'percentage' ? '25' : '10.00'}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minOrder">Minimum Order Amount ($)</Label>
              <Input
                id="minOrder"
                type="number"
                step="0.01"
                value={formData.minOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, minOrder: e.target.value }))}
                placeholder="100.00"
              />
            </div>
            <div>
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the promotion..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Promotion</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'add' ? 'Create Promotion' : 'Update Promotion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}