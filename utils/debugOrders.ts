import { projectId, publicAnonKey } from './supabase/info';

export async function debugOrderSystem() {
  console.log('🔍 Debugging order system...');
  
  try {
    // Check server health first
    console.log('🏥 Testing server health...');
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Server health:', healthData);
    } else {
      console.log('❌ Server health check failed:', healthResponse.status);
      return;
    }

    // Check server orders endpoint
    console.log('📡 Testing orders endpoint...');
    const ordersResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Orders response status:', ordersResponse.status);
    
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      console.log('✅ Orders endpoint response:', ordersData);
      console.log('📊 Total orders found:', ordersData.orders?.length || 0);
      
      if (ordersData.orders && ordersData.orders.length > 0) {
        console.log('📋 Sample orders:', ordersData.orders.slice(0, 3));
        ordersData.orders.forEach((order: any, index: number) => {
          console.log(`Order ${index + 1}:`, {
            id: order.id,
            customer: order.customer,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt
          });
        });
      } else {
        console.log('📭 No orders found in database');
      }
    } else {
      const errorText = await ordersResponse.text();
      console.log('❌ Orders endpoint failed:', ordersResponse.status, errorText);
    }

    // Test order creation
    console.log('🧪 Testing order creation...');
    const testOrder = {
      customer: {
        name: 'Debug Test Customer',
        email: 'debug@test.com',
        phone: '+234123456789'
      },
      email: 'debug@test.com',
      items: [
        {
          name: 'Debug Test Product',
          quantity: 1,
          price: 10000,
          size: 'L',
          color: 'Black'
        }
      ],
      total: 10000,
      status: 'pending',
      deliveryMethod: 'pickup',
      paymentReference: `DEBUG-${Date.now()}`,
      paymentMethod: 'paystack',
      paymentStatus: 'paid',
      paymentVerified: true,
      shippingAddress: {
        street: 'Test Street',
        state: 'Lagos',
        country: 'Nigeria'
      }
    };

    const createResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(testOrder),
    });

    console.log('🧪 Order creation response status:', createResponse.status);

    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('✅ Test order created:', createResult);
      
      // Now check if the order appears in the list
      console.log('🔄 Checking if new order appears in list...');
      setTimeout(async () => {
        const refreshResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log('🔄 Orders after creation:', refreshData.orders?.length || 0);
          const newOrder = refreshData.orders?.find((o: any) => o.id === createResult.order?.id);
          if (newOrder) {
            console.log('✅ New order found in list:', newOrder.id);
          } else {
            console.log('❌ New order NOT found in list');
          }
        }
      }, 1000);
      
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Test order creation failed:', createResponse.status, errorText);
    }

    console.log('🎯 Order system debugging completed!');
    console.log('💡 Run this again in a few seconds to see if orders appear');
    
  } catch (error) {
    console.log('❌ Order debugging failed:', error);
  }
}

// Simplified order check function
export async function checkOrders() {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📊 Current orders count:', data.orders?.length || 0);
      if (data.orders?.length > 0) {
        console.log('📋 Latest orders:', data.orders.slice(0, 5).map((o: any) => ({
          id: o.id,
          customer: o.customer?.name || o.customer,
          total: o.total,
          status: o.status
        })));
      }
      return data.orders || [];
    } else {
      console.log('❌ Failed to fetch orders:', response.status);
      return [];
    }
  } catch (error) {
    console.log('❌ Error checking orders:', error);
    return [];
  }
}

// Test KV store functionality
export async function testKVStore() {
  try {
    console.log('🧪 Testing KV store functionality...');
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/test-kv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ KV store test result:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.log('❌ KV store test failed:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.log('❌ KV store test error:', error);
    return null;
  }
}

// Debug all order data
export async function debugAllOrders() {
  try {
    console.log('🔍 Running comprehensive order debug...');
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/debug-orders`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('🔍 Comprehensive debug result:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.log('❌ Debug failed:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.log('❌ Debug error:', error);
    return null;
  }
}

// Add to window for browser console access
(window as any).debugOrderSystem = debugOrderSystem;
(window as any).checkOrders = checkOrders;
(window as any).testKVStore = testKVStore;
(window as any).debugAllOrders = debugAllOrders;