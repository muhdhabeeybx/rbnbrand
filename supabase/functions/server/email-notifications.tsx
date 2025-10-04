import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Generic email sending function using Resend
const sendEmailWithResend = async (emailData: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.log('⚠️ RESEND_API_KEY not found, email not sent');
      return { success: false, error: 'No API key configured' };
    }
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RainbyNurain <noreply@rainbynurain.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email sent via Resend:', result.id);
      return { success: true, id: result.id };
    } else {
      const error = await response.text();
      console.log('❌ Resend API error:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.log('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Email template functions
function createOrderEmailTemplate(order: any, emailType: 'admin' | 'confirmation' | 'shipped' | 'delivered' = 'confirmation') {
  let subject = '';
  let htmlContent = '';
  let textContent = '';

  const customerName = order.customer?.name || 'Customer';
  const orderId = order.id;
  const customerEmail = order.customer?.email || order.email;
  const customerPhone = order.customer?.phone || 'Not provided';
  const deliveryMethod = order.deliveryMethod || 'Standard Delivery';
  const deliveryAddress = order.shippingAddress ? 
    `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 
    'Address not provided';
  const state = order.shippingAddress?.state || 'Not provided';
  const trackingNumber = order.trackingNumber || 'TRK-' + Date.now();

  // Order items formatting
  const orderItems = order.items?.map(item => 
    `${item.name} (${item.quantity}x)${item.size ? ` - Size: ${item.size}` : ''}${item.color ? ` - Color: ${item.color}` : ''}`
  ).join(', ') || 'Items not listed';

  const baseStyle = `
    body { font-family: 'Rubik', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #030213; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; }
    .order-details { background: #f8f8f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
    .label { font-weight: 600; color: #030213; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    .tagline { font-style: italic; color: #666; margin-top: 10px; }
  `;

  if (emailType === 'admin') {
    subject = `🔔 New Order Received – Order #${orderId}`;
    
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>${baseStyle}</style>
      </head>
      <body>
        <div class="header">
          <h1>RainbyNurain</h1>
          <p>Left Home to Feed Home</p>
        </div>
        
        <div class="content">
          <h2>🔔 New Order Received</h2>
          
          <p>Hello Team,</p>
          
          <p>A new order has just been placed on RainbyNurain.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            
            <div class="detail-row">
              <span class="label">Order ID:</span> ${orderId}
            </div>
            
            <div class="detail-row">
              <span class="label">Customer Name:</span> ${customerName}
            </div>
            
            <div class="detail-row">
              <span class="label">Email:</span> ${customerEmail}
            </div>
            
            <div class="detail-row">
              <span class="label">Phone:</span> ${customerPhone}
            </div>
            
            <div class="detail-row">
              <span class="label">Delivery Method:</span> ${deliveryMethod}
            </div>
            
            <div class="detail-row">
              <span class="label">Delivery Address:</span> ${deliveryAddress}
            </div>
            
            <div class="detail-row">
              <span class="label">State:</span> ${state}
            </div>
          </div>
          
          <p><strong>Next Step:</strong> Please review and process this order.</p>
          
          <p>Best,<br>RainbyNurain System</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 RainbyNurain. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    textContent = `New Order Received – Order #${orderId}

Hello Team,

A new order has just been placed on RainbyNurain.

Order Details:
Order ID: ${orderId}
Customer Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Delivery Method: ${deliveryMethod}
Delivery Address: ${deliveryAddress}
State: ${state}

Next Step: Please review and process this order.

Best,
RainbyNurain System`;

  } else if (emailType === 'confirmation') {
    subject = `✨ Order #${orderId} Confirmed – We're On It!`;
    
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>${baseStyle}</style>
      </head>
      <body>
        <div class="header">
          <h1>RainbyNurain</h1>
          <p class="tagline">Left Home to Feed Home</p>
        </div>
        
        <div class="content">
          <h2>✨ Order Confirmed – We're On It!</h2>
          
          <p>Hey ${customerName},</p>
          
          <p>Thanks for shopping with RainbyNurain. We've received your order and it's now being processed.<br>
          We'll notify you once it's shipped.</p>
          
          <div class="order-details">
            <h3>Your Order:</h3>
            
            <div class="detail-row">
              <span class="label">Order ID:</span> ${orderId}
            </div>
            
            <div class="detail-row">
              <span class="label">Items:</span> ${orderItems}
            </div>
            
            <div class="detail-row">
              <span class="label">Delivery Method:</span> ${deliveryMethod}
            </div>
            
            <div class="detail-row">
              <span class="label">Address:</span> ${deliveryAddress}, ${state}
            </div>
          </div>
          
          <p>If you have questions, reach us via Instagram @rainbynurain</p>
          
          <p>Stay stylish,<br>RainbyNurain Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 RainbyNurain. All rights reserved.</p>
          <p class="tagline">Left Home to Feed Home</p>
        </div>
      </body>
      </html>
    `;

    textContent = `Order #${orderId} Confirmed – We're On It!

Hey ${customerName},

Thanks for shopping with RainbyNurain. We've received your order and it's now being processed.
We'll notify you once it's shipped.

Your Order:
Order ID: ${orderId}
Items: ${orderItems}
Delivery Method: ${deliveryMethod}
Address: ${deliveryAddress}, ${state}

If you have questions, reach us via Instagram @rainbynurain

Stay stylish,
RainbyNurain Team`;

  } else if (emailType === 'shipped') {
    subject = `🚚 Order #${orderId} Is On The Way!`;
    
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>${baseStyle}</style>
      </head>
      <body>
        <div class="header">
          <h1>RainbyNurain</h1>
          <p class="tagline">Left Home to Feed Home</p>
        </div>
        
        <div class="content">
          <h2>🚚 Order Is On The Way!</h2>
          
          <p>Hi ${customerName},</p>
          
          <p>Great news — your order has been shipped. Get ready to rock your RainbyNurain drip.</p>
          
          <div class="order-details">
            <h3>Delivery Details:</h3>
            
            <div class="detail-row">
              <span class="label">Order ID:</span> ${orderId}
            </div>
            
            <div class="detail-row">
              <span class="label">Tracking No:</span> ${trackingNumber}
            </div>
            
            <div class="detail-row">
              <span class="label">Delivery Address:</span> ${deliveryAddress}, ${state}
            </div>
          </div>
          
          <p>We'll update you once it's delivered.</p>
          
          <p>Respect,<br>RainbyNurain Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 RainbyNurain. All rights reserved.</p>
          <p class="tagline">Left Home to Feed Home</p>
        </div>
      </body>
      </html>
    `;

    textContent = `Order #${orderId} Is On The Way!

Hi ${customerName},

Great news — your order has been shipped. Get ready to rock your RainbyNurain drip.

Delivery Details:
Order ID: ${orderId}
Tracking No: ${trackingNumber}
Delivery Address: ${deliveryAddress}, ${state}

We'll update you once it's delivered.

Respect,
RainbyNurain Team`;

  } else if (emailType === 'delivered') {
    subject = `✅ Order #${orderId} Delivered Successfully`;
    
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>${baseStyle}</style>
      </head>
      <body>
        <div class="header">
          <h1>RainbyNurain</h1>
          <p class="tagline">Left Home to Feed Home</p>
        </div>
        
        <div class="content">
          <h2>✅ Order Delivered Successfully</h2>
          
          <p>Hi ${customerName},</p>
          
          <p>Your order has been delivered/picked up. We hope you love it as much as we loved making it.</p>
          
          <p>If you have any feedback or want to share your look, tag us on Instagram @rainbynurain.</p>
          
          <p>Thanks for being part of the movement.</p>
          
          <p>With love,<br>RainbyNurain Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 RainbyNurain. All rights reserved.</p>
          <p class="tagline">Left Home to Feed Home</p>
        </div>
      </body>
      </html>
    `;

    textContent = `Order #${orderId} Delivered Successfully

Hi ${customerName},

Your order has been delivered/picked up. We hope you love it as much as we loved making it.

If you have any feedback or want to share your look, tag us on Instagram @rainbynurain.

Thanks for being part of the movement.

With love,
RainbyNurain Team`;
  }

  return { subject, htmlContent, textContent };
}

// Contact form email template
function createInquiryEmailTemplate(inquiry: any) {
  const subject = `💬 New Customer Inquiry from ${inquiry.name}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: 'Rubik', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #030213; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .inquiry-details { background: #f8f8f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RainbyNurain</h1>
        <p>Left Home to Feed Home</p>
      </div>
      
      <div class="content">
        <h2>💬 New Customer Inquiry</h2>
        
        <div class="inquiry-details">
          <p><strong>Name:</strong> ${inquiry.name}</p>
          <p><strong>Email:</strong> ${inquiry.email}</p>
          <p><strong>Subject:</strong> ${inquiry.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${inquiry.message}</p>
        </div>
        
        <p>Please respond to this inquiry promptly.</p>
      </div>
      
      <div class="footer">
        <p>&copy; 2024 RainbyNurain. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `New Customer Inquiry from ${inquiry.name}

Name: ${inquiry.name}
Email: ${inquiry.email}
Subject: ${inquiry.subject}

Message:
${inquiry.message}

Please respond to this inquiry promptly.`;

  return { subject, htmlContent, textContent };
}

// Email notification endpoints
app.post('/make-server-7f3098dc/notifications/send-order-email', async (c) => {
  try {
    const { order, isNewOrder = true } = await c.req.json();
    
    // Admin email addresses
    const adminEmails = ['rainbynurain@gmail.com', 'rbn@sableboxx.com'];
    const customerEmail = order.customer?.email || order.email;
    
    // Get customer and admin email templates
    const customerTemplate = createOrderEmailTemplate(order, 'confirmation');
    const adminTemplate = createOrderEmailTemplate(order, 'admin');
    
    // Store notification in KV store for admin dashboard
    const notificationId = `order_notification_${order.id}_${Date.now()}`;
    await kv.set(notificationId, {
      type: isNewOrder ? 'new_order' : 'order_status_changed',
      orderId: order.id,
      subject: adminTemplate.subject,
      content: adminTemplate.textContent,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    // Send customer confirmation email (order confirmation/status update)
    if (customerEmail && isNewOrder) {
      console.log(`📧 Sending customer order confirmation to: ${customerEmail}`);
      
      const customerEmailResult = await sendEmailWithResend({
        to: customerEmail,
        subject: customerTemplate.subject,
        html: customerTemplate.htmlContent,
        text: customerTemplate.textContent
      });
      
      if (customerEmailResult.success) {
        console.log(`✅ Customer email sent successfully`);
      } else {
        console.log(`⚠️ Customer email failed: ${customerEmailResult.error}`);
      }
    }
    
    // Send admin notification emails
    if (isNewOrder) {
      for (const adminEmail of adminEmails) {
        console.log(`📧 Sending admin notification to: ${adminEmail}`);
        
        const adminEmailResult = await sendEmailWithResend({
          to: adminEmail,
          subject: adminTemplate.subject,
          html: adminTemplate.htmlContent,
          text: adminTemplate.textContent
        });
        
        if (adminEmailResult.success) {
          console.log(`✅ Admin email sent to: ${adminEmail}`);
        } else {
          console.log(`⚠️ Admin email failed for ${adminEmail}: ${adminEmailResult.error}`);
        }
      }
    }
    
    return c.json({ 
      success: true, 
      message: 'Email notifications processed successfully',
      notificationId,
      emailsSent: {
        customer: !!customerEmail,
        admin: adminEmails.length
      }
    });
  } catch (error) {
    console.error('Error sending order notification:', error);
    return c.json({ success: false, error: 'Failed to send notification' }, 500);
  }
});

// Order status update email endpoint (shipped/delivered)
app.post('/make-server-7f3098dc/notifications/send-status-email', async (c) => {
  try {
    const { order, status } = await c.req.json();
    
    if (!order || !status) {
      return c.json({ error: "Order and status are required" }, 400);
    }
    
    const customerEmail = order.customer?.email || order.email;
    
    if (!customerEmail) {
      return c.json({ error: "Customer email not found" }, 400);
    }
    
    let emailType: 'shipped' | 'delivered' = 'shipped';
    if (status === 'delivered' || status === 'completed') {
      emailType = 'delivered';
    }
    
    // Generate appropriate email template
    const emailTemplate = createOrderEmailTemplate(order, emailType);
    
    // Store notification for tracking
    const notificationId = `status_update_${order.id}_${Date.now()}`;
    await kv.set(notificationId, {
      type: 'order_status_changed',
      orderId: order.id,
      status: status,
      subject: emailTemplate.subject,
      content: emailTemplate.textContent,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    // Send email to customer
    console.log(`📧 Sending ${emailType} notification to: ${customerEmail}`);
    
    const emailResult = await sendEmailWithResend({
      to: customerEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.htmlContent,
      text: emailTemplate.textContent
    });
    
    if (emailResult.success) {
      console.log(`✅ ${emailType} email sent successfully`);
    } else {
      console.log(`⚠️ ${emailType} email failed: ${emailResult.error}`);
    }
    
    return c.json({ 
      success: true, 
      message: `${emailType} notification sent successfully`,
      notificationId,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Error sending status update email:', error);
    return c.json({ error: "Failed to send status update email", details: error.message }, 500);
  }
});

// Customer inquiry email endpoint
app.post('/make-server-7f3098dc/notifications/send-inquiry', async (c) => {
  try {
    const { inquiry } = await c.req.json();
    
    const adminEmails = ['rainbynurain@gmail.com', 'rbn@sableboxx.com'];
    const { subject, htmlContent, textContent } = createInquiryEmailTemplate(inquiry);
    
    // Store notification
    const notificationId = `inquiry_${inquiry.email.replace('@', '_at_')}_${Date.now()}`;
    await kv.set(notificationId, {
      type: 'customer_inquiry',
      customerEmail: inquiry.email,
      subject,
      content: textContent,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    // Send to both admin emails
    let emailsSent = 0;
    for (const adminEmail of adminEmails) {
      console.log(`📧 Sending customer inquiry to: ${adminEmail}`);
      
      const inquiryEmailResult = await sendEmailWithResend({
        to: adminEmail,
        subject: subject,
        html: htmlContent,
        text: textContent
      });
      
      if (inquiryEmailResult.success) {
        console.log(`✅ Inquiry email sent to: ${adminEmail}`);
        emailsSent++;
      } else {
        console.log(`⚠️ Inquiry email failed for ${adminEmail}: ${inquiryEmailResult.error}`);
      }
    }
    
    return c.json({ 
      success: true, 
      message: 'Customer inquiry notifications sent successfully',
      notificationId,
      emailsSent: emailsSent
    });
  } catch (error) {
    console.error('Error sending customer inquiry notification:', error);
    return c.json({ success: false, error: 'Failed to send notification' }, 500);
  }
});

// Get notifications for admin dashboard
app.get('/make-server-7f3098dc/notifications', async (c) => {
  try {
    const notifications = await kv.getByPrefix('order_notification_');
    const inquiries = await kv.getByPrefix('inquiry_');
    const statusUpdates = await kv.getByPrefix('status_update_');
    
    const allNotifications = [...notifications, ...inquiries, ...statusUpdates]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ success: true, notifications: allNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ success: false, error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark notification as read
app.patch('/make-server-7f3098dc/notifications/:id/read', async (c) => {
  try {
    const notificationId = c.req.param('id');
    const notification = await kv.get(notificationId);
    
    if (!notification) {
      return c.json({ success: false, error: 'Notification not found' }, 404);
    }
    
    await kv.set(notificationId, { ...notification, read: true });
    
    return c.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return c.json({ success: false, error: 'Failed to update notification' }, 500);
  }
});

export default app;