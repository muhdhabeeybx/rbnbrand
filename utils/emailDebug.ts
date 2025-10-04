import { projectId, publicAnonKey } from './supabase/info';

export async function testEmailNotifications() {
  console.log('🧪 Testing email notification system...');
  
  try {
    // Test order email notification
    const testOrder = {
      id: `TEST-${Date.now()}`,
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+234123456789'
      },
      email: 'test@example.com',
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          price: 25000,
          size: 'L',
          color: 'Black'
        }
      ],
      total: 25000,
      status: 'pending',
      date: new Date().toLocaleDateString(),
      shippingAddress: {
        street: '123 Test Street',
        state: 'Lagos',
        country: 'Nigeria'
      }
    };

    console.log('📧 Testing order email notification...');
    const orderEmailResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/email-notifications/send-order-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({
        order: testOrder,
        isNewOrder: true
      })
    });

    if (orderEmailResponse.ok) {
      const result = await orderEmailResponse.json();
      console.log('✅ Order email notification test passed:', result);
    } else {
      console.log('❌ Order email notification test failed:', orderEmailResponse.status);
    }

    // Test customer inquiry notification
    console.log('📞 Testing customer inquiry notification...');
    const inquiryResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/email-notifications/send-customer-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+234123456789',
        subject: 'Test Inquiry',
        message: 'This is a test customer inquiry message.'
      })
    });

    if (inquiryResponse.ok) {
      const result = await inquiryResponse.json();
      console.log('✅ Customer inquiry notification test passed:', result);
    } else {
      console.log('❌ Customer inquiry notification test failed:', inquiryResponse.status);
    }

    console.log('🎯 Email notification tests completed!');
    console.log('📋 Check server logs for email details');
    
  } catch (error) {
    console.log('❌ Email notification test failed:', error);
  }
}

// Add to window for browser console access
(window as any).testEmailNotifications = testEmailNotifications;