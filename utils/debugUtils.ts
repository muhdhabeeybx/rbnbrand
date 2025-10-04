// Debug utilities that can be loaded on demand
// Usage: import { loadDebugUtils } from './utils/debugUtils'
// Then call: loadDebugUtils() in browser console or when needed

export async function loadDebugUtils() {
  console.log('🔧 Loading debug utilities...');
  
  try {
    // Dynamically import debug modules only when needed
    const [debugServer, emailDebug, debugOrders] = await Promise.all([
      import('./debugServer'),
      import('./emailDebug'), 
      import('./debugOrders')
    ]);

    console.log('✅ Debug utilities loaded successfully!');
    console.log('Available functions:');
    console.log('- window.testServerConnection()');
    console.log('- window.testEmailNotifications()');
    console.log('- window.debugOrderSystem()');
    console.log('- window.checkOrders()');
    console.log('- window.testKVStore()');
    console.log('- window.debugAllOrders()');
    
    return {
      debugServer,
      emailDebug,
      debugOrders
    };
  } catch (error) {
    console.error('❌ Failed to load debug utilities:', error);
    return null;
  }
}

// Add to window for browser console access
(window as any).loadDebugUtils = loadDebugUtils;

// Quick order check without loading all debug utils
export async function quickOrderCheck() {
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info');
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📊 Quick order check - Total orders:', data.orders?.length || 0);
      return data.orders || [];
    } else {
      console.log('❌ Quick order check failed:', response.status);
      return [];
    }
  } catch (error) {
    console.log('❌ Quick order check error:', error);
    return [];
  }
}

(window as any).quickOrderCheck = quickOrderCheck;