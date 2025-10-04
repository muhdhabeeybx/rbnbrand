import { projectId, publicAnonKey } from './supabase/info';

export async function testServerConnection() {
  console.log('🔍 Testing server connection...');
  
  try {
    // Test 1: Health check
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
    
    // Test 2: Simple test endpoint
    const testResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/test`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Test endpoint passed:', testData);
    } else {
      console.log('❌ Test endpoint failed:', testResponse.status);
    }
    
    // Test 3: Test order creation
    const testOrderResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/test-order`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    if (testOrderResponse.ok) {
      const testOrderData = await testOrderResponse.json();
      console.log('✅ Test order creation passed:', testOrderData);
    } else {
      const errorText = await testOrderResponse.text();
      console.log('❌ Test order creation failed:', testOrderResponse.status, errorText);
    }
    
  } catch (error) {
    console.log('❌ Server connection test failed:', error);
  }
}

// Run this in browser console: await testServerConnection()
(window as any).testServerConnection = testServerConnection;