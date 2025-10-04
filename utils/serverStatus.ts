import { projectId, publicAnonKey } from './supabase/info';

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.log('Server health check failed:', error);
    return false;
  }
}

export async function initializeServerData(): Promise<void> {
  try {
    console.log('🚀 Initializing server data...');
    
    // Initialize products
    const productsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/init-products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (productsResponse.ok) {
      console.log('✅ Products initialized');
    }
    
    // Initialize orders
    const ordersResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/init-orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (ordersResponse.ok) {
      console.log('✅ Orders initialized');
    }
    
  } catch (error) {
    console.log('⚠️ Server initialization failed:', error);
  }
}