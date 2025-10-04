import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import emailNotifications from "./email-notifications.tsx";
import { createHash } from "node:crypto";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: false,
  }),
);

// Health check endpoint
app.get("/make-server-7f3098dc/health", (c) => {
  return c.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "Rain by Nurain API",
    version: "1.0.0"
  });
});

// Simple test endpoint
app.get("/make-server-7f3098dc/test", (c) => {
  return c.json({ 
    message: "Server is working correctly",
    timestamp: new Date().toISOString()
  });
});

// Test KV store functionality
app.post("/make-server-7f3098dc/test-kv", async (c) => {
  try {
    const testData = {
      id: `TEST-${Date.now()}`,
      test: true,
      timestamp: new Date().toISOString()
    };
    
    console.log("🧪 Testing KV store with data:", testData);
    
    // Test write
    await kv.set(`test:${testData.id}`, testData);
    console.log("✅ KV write successful");
    
    // Test read
    const retrieved = await kv.get(`test:${testData.id}`);
    console.log("📖 KV read result:", retrieved);
    
    // Test prefix search
    const prefixResults = await kv.getByPrefix("test:");
    console.log("🔍 KV prefix search results:", prefixResults?.length || 0);
    
    return c.json({ 
      success: true,
      message: "KV store test successful",
      testData,
      retrieved,
      prefixCount: prefixResults?.length || 0
    });
  } catch (error) {
    console.log("❌ KV store test failed:", error);
    return c.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Debug endpoint to check all orders
app.get("/make-server-7f3098dc/debug-orders", async (c) => {
  try {
    console.log("🔍 Debug: Checking all order-related data...");
    
    // Get all data to see what's in the store
    const allData = await kv.getByPrefix("");
    console.log("📊 Total items in KV store:", allData?.length || 0);
    
    // Filter for orders
    const orderData = allData?.filter(item => 
      (item.id && item.id.toString().includes('order:')) ||
      (item.key && item.key.toString().includes('order:'))
    ) || [];
    
    console.log("📦 Order items found:", orderData.length);
    
    // Get orders using the normal method
    const orders = await kv.getByPrefix("order:");
    console.log("📋 Orders via getByPrefix:", orders?.length || 0);
    
    return c.json({
      debug: true,
      totalItems: allData?.length || 0,
      orderItemsFound: orderData.length,
      ordersViaPrefix: orders?.length || 0,
      sampleOrderData: orderData.slice(0, 3),
      sampleOrders: orders?.slice(0, 3) || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log("❌ Debug orders failed:", error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Handle OPTIONS requests explicitly
app.options("/*", (c) => {
  return c.text("", 200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
});

// Health check endpoint
app.get("/make-server-7f3098dc/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
      hasServiceRoleKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    }
  });
});

// Database connection test endpoint
app.get("/make-server-7f3098dc/test-db", async (c) => {
  try {
    // Test basic KV store functionality
    const testKey = "test:connection";
    const testValue = { test: true, timestamp: new Date().toISOString() };
    
    console.log("Testing database connection...");
    
    // Try to set a test value
    await kv.set(testKey, testValue);
    console.log("Test value set successfully");
    
    // Try to get the test value
    const retrieved = await kv.get(testKey);
    console.log("Test value retrieved:", retrieved);
    
    // Clean up
    await kv.del(testKey);
    console.log("Test value deleted");
    
    return c.json({
      status: "ok",
      message: "Database connection test successful",
      testValue: retrieved
    });
  } catch (error) {
    console.log("Database connection test failed:", error);
    return c.json({
      status: "error",
      message: "Database connection test failed",
      error: error.message,
      stack: error.stack
    }, 500);
  }
});

// Product Management Routes
app.get("/make-server-7f3098dc/products", async (c) => {
  try {
    console.log("Attempting to fetch products from KV store...");
    const products = await kv.getByPrefix("product:");
    console.log("Fetched products count:", products?.length || 0);
    console.log("Fetched products:", products);
    return c.json({ products: products || [] });
  } catch (error) {
    console.log("Error fetching products:", error);
    console.log("Error details:", error.message);
    console.log("Error stack:", error.stack);
    return c.json({ 
      error: "Failed to fetch products", 
      details: error.message,
      stack: error.stack 
    }, 500);
  }
});

app.get("/make-server-7f3098dc/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.log("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product", details: error.message }, 500);
  }
});

app.post("/make-server-7f3098dc/products", async (c) => {
  try {
    const body = await c.req.json();
    const product = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sales: 0,
      revenue: 0
    };
    
    await kv.set(`product:${product.id}`, product);
    console.log("Created product:", product);
    return c.json({ product });
  } catch (error) {
    console.log("Error creating product:", error);
    return c.json({ error: "Failed to create product", details: error.message }, 500);
  }
});

app.put("/make-server-7f3098dc/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    const updatedProduct = {
      ...existingProduct,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`product:${id}`, updatedProduct);
    console.log("Updated product:", updatedProduct);
    return c.json({ product: updatedProduct });
  } catch (error) {
    console.log("Error updating product:", error);
    return c.json({ error: "Failed to update product", details: error.message }, 500);
  }
});

app.delete("/make-server-7f3098dc/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    await kv.del(`product:${id}`);
    console.log("Deleted product:", id);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting product:", error);
    return c.json({ error: "Failed to delete product", details: error.message }, 500);
  }
});

// Initialize with sample products if none exist
app.post("/make-server-7f3098dc/init-products", async (c) => {
  try {
    const existingProducts = await kv.getByPrefix("product:");
    
    if (existingProducts && existingProducts.length > 0) {
      return c.json({ message: "Products already exist", count: existingProducts.length });
    }
    
    const sampleProducts = [
      {
        id: "1",
        name: "Essential Hoodie - Black",
        price: 45000,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop",
        category: "hoodies",
        description: "Premium cotton hoodie with minimalist design",
        colors: ["#000000", "#FFFFFF", "#808080"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        stock: 45,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Streetwear Tee - White",
        price: 18000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
        category: "tees",
        description: "Classic streetwear t-shirt with premium fabric",
        colors: ["#FFFFFF", "#000000", "#808080"],
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 23,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Urban Jacket - Grey",
        price: 75000,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop",
        category: "outerwear",
        description: "Urban-inspired jacket for all weather",
        colors: ["#808080", "#000000", "#000080"],
        sizes: ["S", "M", "L", "XL"],
        stock: 12,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "4",
        name: "Cargo Pants - Olive",
        price: 35000,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=600&fit=crop",
        category: "pants",
        description: "Functional cargo pants with multiple pockets",
        stock: 35,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "5",
        name: "Oversized Hoodie - Navy",
        price: 50000,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
        category: "hoodies",
        description: "Oversized fit hoodie for ultimate comfort",
        stock: 28,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "6",
        name: "Graphic Tee - Black",
        price: 22000,
        image: "https://images.unsplash.com/photo-1583743814966-8936f37f7378?w=500&h=600&fit=crop",
        category: "tees",
        description: "Bold graphic design on premium cotton",
        stock: 42,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "7",
        name: "Bomber Jacket - Black",
        price: 85000,
        image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop",
        category: "outerwear",
        description: "Classic bomber jacket with modern fit",
        stock: 18,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "8",
        name: "Track Pants - Black",
        price: 32000,
        image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop",
        category: "pants",
        description: "Comfortable track pants for everyday wear",
        stock: 31,
        sales: 0,
        revenue: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Store all sample products
    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    
    console.log("Initialized sample products");
    return c.json({ message: "Sample products initialized", count: sampleProducts.length });
  } catch (error) {
    console.log("Error initializing products:", error);
    return c.json({ error: "Failed to initialize products", details: error.message }, 500);
  }
});

// Order Management Routes
app.get("/make-server-7f3098dc/orders", async (c) => {
  try {
    console.log("🔍 Fetching orders from KV store...");
    
    // First, let's try to get all keys with order prefix
    const orders = await kv.getByPrefix("order:");
    console.log("📊 Raw KV store response:", orders);
    console.log("📦 Fetched orders count:", orders?.length || 0);
    
    if (orders && orders.length > 0) {
      console.log("📋 Sample order structure:", orders[0]);
      orders.forEach((order, index) => {
        console.log(`Order ${index + 1} details:`, {
          id: order.id,
          hasCustomer: !!order.customer,
          hasItems: !!order.items,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        });
      });
    } else {
      console.log("📭 No orders found in KV store");
      
      // Let's check if there are any keys at all
      try {
        const allKeys = await kv.getByPrefix("");
        console.log("🔑 Total keys in KV store:", allKeys?.length || 0);
        if (allKeys && allKeys.length > 0) {
          const orderKeys = allKeys.filter(item => item.id?.includes('order:') || item.key?.includes('order:'));
          console.log("🔑 Order-related keys found:", orderKeys.length);
        }
      } catch (keyError) {
        console.log("⚠️ Could not check KV store keys:", keyError);
      }
    }
    
    return c.json({ 
      orders: orders || [],
      debug: {
        count: orders?.length || 0,
        timestamp: new Date().toISOString(),
        success: true
      }
    });
  } catch (error) {
    console.log("❌ Error fetching orders:", error);
    return c.json({ 
      error: "Failed to fetch orders", 
      details: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        timestamp: new Date().toISOString(),
        success: false
      }
    }, 500);
  }
});

app.get("/make-server-7f3098dc/orders/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const order = await kv.get(`order:${id}`);
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    return c.json({ order });
  } catch (error) {
    console.log("Error fetching order:", error);
    return c.json({ error: "Failed to fetch order", details: error.message }, 500);
  }
});

app.post("/make-server-7f3098dc/orders", async (c) => {
  try {
    console.log("�� Received order creation request");
    
    let body;
    try {
      body = await c.req.json();
      console.log("✅ Request body parsed successfully");
    } catch (parseError) {
      console.log("❌ Failed to parse request body:", parseError);
      return c.json({ 
        error: "Invalid JSON in request body", 
        details: parseError.message 
      }, 400);
    }
    
    // Validate required fields
    if (!body.customer || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      console.log("❌ Missing required fields in order data");
      return c.json({ 
        error: "Missing required order fields", 
        details: "Customer info and items are required" 
      }, 400);
    }
    
    const orderId = `RBN-${Date.now()}`;
    console.log("📝 Creating order with ID:", orderId);
    
    const order = {
      ...body,
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: body.status || 'pending',
      trackingNumber: `TRK-${Date.now()}`
    };
    
    console.log("📋 Order data prepared:", { 
      id: order.id, 
      customerEmail: order.customer?.email || order.email,
      itemCount: order.items?.length || 0,
      total: order.total 
    });
    
    // Store order with timeout protection - THIS MUST SUCCEED
    try {
      console.log("💾 Attempting to store order in KV store with key:", `order:${order.id}`);
      console.log("📦 Order data to store:", JSON.stringify(order, null, 2));
      
      const storePromise = kv.set(`order:${order.id}`, order);
      const storeTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('KV store timeout')), 5000)
      );
      
      await Promise.race([storePromise, storeTimeout]);
      console.log("✅ Order stored successfully in KV store:", order.id);
      
      // Verify the order was actually stored by retrieving it
      const verifyOrder = await kv.get(`order:${order.id}`);
      if (verifyOrder) {
        console.log("✅ Order verification successful - order exists in KV store");
      } else {
        console.log("❌ Order verification failed - order not found in KV store");
        throw new Error("Order storage verification failed");
      }
      
    } catch (storeError) {
      console.log("❌ CRITICAL: KV store error - order cannot be saved:", storeError);
      return c.json({ 
        error: "Failed to store order", 
        details: storeError instanceof Error ? storeError.message : 'Unknown storage error',
        success: false 
      }, 500);
    }
    
    // Send order confirmation email (completely non-blocking)
    setTimeout(() => {
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/email-notifications/send-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          order: order,
          type: 'new_order'
        })
      }).then(async (emailResult) => {
        if (emailResult.ok) {
          console.log("✅ Order confirmation email sent");
        } else {
          console.log("⚠️ Email failed:", await emailResult.text());
        }
      }).catch(emailError => {
        console.log("⚠️ Email error:", emailError);
      });
    }, 0);
    
    // Return immediately with success
    console.log("🎉 Order creation completed successfully:", order.id);
    return c.json({ order, success: true });
    
  } catch (error) {
    console.log("❌ Critical order creation error:", error);
    console.log("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    
    return c.json({ 
      error: "Failed to create order", 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      success: false 
    }, 500);
  }
});

app.put("/make-server-7f3098dc/orders/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existingOrder = await kv.get(`order:${id}`);
    if (!existingOrder) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    const updatedOrder = {
      ...existingOrder,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`order:${id}`, updatedOrder);
    console.log("Updated order:", updatedOrder);
    
    // Send status update email if status changed
    if (updates.status && updates.status !== existingOrder.status) {
      try {
        const emailResult = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/email-notifications/send-order-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({
            order: updatedOrder,
            type: 'order_status_changed',
            previousStatus: existingOrder.status
          })
        });
        
        if (emailResult.ok) {
          console.log("Order status update email sent successfully");
        } else {
          console.log("Failed to send order status update email:", await emailResult.text());
        }
      } catch (emailError) {
        console.log("Error sending order status update email:", emailError);
      }
    }
    
    return c.json({ order: updatedOrder });
  } catch (error) {
    console.log("Error updating order:", error);
    return c.json({ error: "Failed to update order", details: error.message }, 500);
  }
});

app.get("/make-server-7f3098dc/customers/:email/orders", async (c) => {
  try {
    const email = c.req.param('email');
    const allOrders = await kv.getByPrefix("order:");
    const customerOrders = allOrders.filter(order => 
      order.customer?.email === email || order.email === email
    );
    
    return c.json({ orders: customerOrders || [] });
  } catch (error) {
    console.log("Error fetching customer orders:", error);
    return c.json({ error: "Failed to fetch customer orders", details: error.message }, 500);
  }
});

// Removed settings management - not needed per requirements

// Initialize with sample orders if none exist
app.post("/make-server-7f3098dc/init-orders", async (c) => {
  try {
    const existingOrders = await kv.getByPrefix("order:");
    
    if (existingOrders && existingOrders.length > 0) {
      return c.json({ message: "Orders already exist", count: existingOrders.length });
    }
    
    const sampleOrders = [
      {
        id: "RBN-001",
        customer: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+234 701 234 5678"
        },
        email: "john.doe@example.com",
        items: [
          {
            id: "1",
            name: "Essential Hoodie - Black",
            price: 45000,
            quantity: 1
          },
          {
            id: "2", 
            name: "Streetwear Tee - White",
            price: 18000,
            quantity: 2
          }
        ],
        subtotal: 81000,
        deliveryFee: 0,
        total: 81000,
        currency: "NGN",
        deliveryMethod: "pickup",
        status: "delivered",
        trackingNumber: "TRK-1704100001",
        shippingAddress: {
          street: "123 Victoria Island",
          city: "Lagos",
          state: "Lagos",
          zipCode: "101001",
          country: "Nigeria"
        },
        date: "2024-01-15",
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-18').toISOString(),
        timeline: [
          { status: "pending", timestamp: "2024-01-15T10:00:00Z", description: "Order placed" },
          { status: "processing", timestamp: "2024-01-15T14:00:00Z", description: "Order confirmed and processing" },
          { status: "shipped", timestamp: "2024-01-16T09:00:00Z", description: "Package shipped" },
          { status: "delivered", timestamp: "2024-01-18T15:30:00Z", description: "Package delivered" }
        ]
      },
      {
        id: "RBN-002",
        customer: {
          name: "Jane Smith",
          email: "jane.smith@example.com", 
          phone: "+234 802 345 6789"
        },
        email: "jane.smith@example.com",
        items: [
          {
            id: "3",
            name: "Urban Jacket - Grey",
            price: 75000,
            quantity: 1
          }
        ],
        subtotal: 75000,
        deliveryFee: 0,
        total: 75000,
        currency: "NGN",
        deliveryMethod: "delivery",
        status: "shipped",
        trackingNumber: "TRK-1704100002",
        shippingAddress: {
          street: "456 Garki Area",
          city: "Abuja",
          state: "FCT",
          zipCode: "900001",
          country: "Nigeria"
        },
        date: "2024-01-10",
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-01-12').toISOString(),
        timeline: [
          { status: "pending", timestamp: "2024-01-10T11:00:00Z", description: "Order placed" },
          { status: "processing", timestamp: "2024-01-10T16:00:00Z", description: "Order confirmed and processing" },
          { status: "shipped", timestamp: "2024-01-12T08:00:00Z", description: "Package shipped" }
        ]
      },
      {
        id: "RBN-003",
        customer: {
          name: "Michael Johnson",
          email: "michael.j@example.com",
          phone: "+234 703 456 7890"
        },
        email: "michael.j@example.com",
        items: [
          {
            id: "4",
            name: "Cargo Pants - Olive",
            price: 35000,
            quantity: 1
          },
          {
            id: "5",
            name: "Oversized Hoodie - Navy",
            price: 50000,
            quantity: 1
          }
        ],
        subtotal: 85000,
        deliveryFee: 0,
        total: 85000,
        currency: "NGN",
        deliveryMethod: "pickup",
        status: "processing",
        trackingNumber: "TRK-1704100003",
        shippingAddress: {
          street: "789 GRA Phase 2",
          city: "Port Harcourt",
          state: "Rivers",
          zipCode: "500001",
          country: "Nigeria"
        },
        date: "2024-01-05",
        createdAt: new Date('2024-01-05').toISOString(),
        updatedAt: new Date('2024-01-06').toISOString(),
        timeline: [
          { status: "pending", timestamp: "2024-01-05T13:00:00Z", description: "Order placed" },
          { status: "processing", timestamp: "2024-01-06T10:00:00Z", description: "Order confirmed and processing" }
        ]
      }
    ];
    
    // Store all sample orders
    for (const order of sampleOrders) {
      await kv.set(`order:${order.id}`, order);
    }
    
    console.log("Initialized sample orders");
    return c.json({ message: "Sample orders initialized", count: sampleOrders.length });
  } catch (error) {
    console.log("Error initializing orders:", error);
    return c.json({ error: "Failed to initialize orders", details: error.message }, 500);
  }
});

// Categories Management Routes
app.get("/make-server-7f3098dc/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    return c.json({ categories: categories || [] });
  } catch (error) {
    console.log("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories", details: error.message }, 500);
  }
});

app.post("/make-server-7f3098dc/categories", async (c) => {
  try {
    const { name, description } = await c.req.json();
    const category = {
      id: Date.now().toString(),
      name: name.toLowerCase(),
      displayName: name,
      description: description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`category:${category.id}`, category);
    console.log("Created category:", category);
    return c.json({ category });
  } catch (error) {
    console.log("Error creating category:", error);
    return c.json({ error: "Failed to create category", details: error.message }, 500);
  }
});

app.delete("/make-server-7f3098dc/categories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const existingCategory = await kv.get(`category:${id}`);
    
    if (!existingCategory) {
      return c.json({ error: "Category not found" }, 404);
    }
    
    await kv.del(`category:${id}`);
    console.log("Deleted category:", id);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting category:", error);
    return c.json({ error: "Failed to delete category", details: error.message }, 500);
  }
});

// Initialize default categories
app.post("/make-server-7f3098dc/init-categories", async (c) => {
  try {
    const existingCategories = await kv.getByPrefix("category:");
    
    if (existingCategories && existingCategories.length > 0) {
      return c.json({ message: "Categories already exist", count: existingCategories.length });
    }
    
    const defaultCategories = [
      { name: "hoodies", displayName: "Hoodies", description: "Comfortable hoodies and sweatshirts" },
      { name: "tees", displayName: "T-Shirts", description: "Premium t-shirts and tops" },
      { name: "outerwear", displayName: "Outerwear", description: "Jackets, coats and outer layers" },
      { name: "pants", displayName: "Pants", description: "Trousers, jeans and bottoms" },
      { name: "accessories", displayName: "Accessories", description: "Hats, bags and other accessories" }
    ];
    
    for (const cat of defaultCategories) {
      const category = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: cat.name,
        displayName: cat.displayName,
        description: cat.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await kv.set(`category:${category.id}`, category);
    }
    
    console.log("Initialized default categories");
    return c.json({ message: "Default categories initialized", count: defaultCategories.length });
  } catch (error) {
    console.log("Error initializing categories:", error);
    return c.json({ error: "Failed to initialize categories", details: error.message }, 500);
  }
});

// Admin authentication endpoint
app.post("/make-server-7f3098dc/admin/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Check credentials (in production, use proper hashing)
    if (email === "rainbynurain@gmail.com" && password === "RBNPassword10!") {
      // Generate a simple session token (in production, use JWT or proper session management)
      const sessionToken = createHash('sha256')
        .update(email + password + Date.now().toString())
        .digest('hex');
      
      // Store session with expiry (24 hours)
      const sessionData = {
        email,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      await kv.set(`admin_session:${sessionToken}`, sessionData);
      
      return c.json({ 
        success: true, 
        token: sessionToken,
        message: "Login successful" 
      });
    } else {
      return c.json({ error: "Invalid credentials" }, 401);
    }
  } catch (error) {
    console.log("Admin login error:", error);
    return c.json({ error: "Login failed", details: error.message }, 500);
  }
});

// Admin session verification
app.get("/make-server-7f3098dc/admin/verify", async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }
    
    const sessionData = await kv.get(`admin_session:${token}`);
    
    if (!sessionData) {
      return c.json({ error: "Invalid session" }, 401);
    }
    
    // Check if session has expired
    if (new Date() > new Date(sessionData.expiresAt)) {
      await kv.del(`admin_session:${token}`);
      return c.json({ error: "Session expired" }, 401);
    }
    
    return c.json({ 
      success: true, 
      user: { email: sessionData.email },
      message: "Session valid" 
    });
  } catch (error) {
    console.log("Admin session verification error:", error);
    return c.json({ error: "Session verification failed", details: error.message }, 500);
  }
});

// Admin logout
app.post("/make-server-7f3098dc/admin/logout", async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      await kv.del(`admin_session:${token}`);
    }
    
    return c.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Admin logout error:", error);
    return c.json({ error: "Logout failed", details: error.message }, 500);
  }
});


// Paystack payment verification endpoint
app.post("/make-server-7f3098dc/paystack/verify/:reference", async (c) => {
  try {
    const reference = c.req.param('reference');
    
    // Use test secret key
    const secretKey = 'sk_test_6c394f5eef69df4393b42b2d168138de3e56331a';
    
    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Payment verification failed');
    }
    
    const verificationData = await response.json();
    
    if (verificationData.status && verificationData.data.status === 'success') {
      console.log('Payment verification successful:', verificationData.data);
      return c.json({ 
        success: true, 
        message: 'Payment verified successfully',
        verificationData: verificationData.data
      });
    }
    
    return c.json({ 
      success: false, 
      message: 'Payment verification failed or order not found',
      verificationData 
    });
  } catch (error) {
    console.log('Payment verification error:', error);
    return c.json({ error: 'Payment verification failed', details: error.message }, 500);
  }
});

// Paystack public key endpoint
app.get("/make-server-7f3098dc/paystack/public-key", (c) => {
  try {
    // Use test public key
    const publicKey = 'pk_test_35ef25f98432ee15a89951b2fa91b80b774187d2';
    return c.json({ publicKey });
  } catch (error) {
    console.log('Error getting Paystack public key:', error);
    return c.json({ error: 'Failed to get public key' }, 500);
  }
});

// Paystack webhook for payment verification
app.post("/make-server-7f3098dc/paystack/webhook", async (c) => {
  try {
    const body = await c.req.text();
    const event = JSON.parse(body);
    
    // Verify webhook signature
    const signature = c.req.header('x-paystack-signature');
    const secretKey = 'sk_test_6c394f5eef69df4393b42b2d168138de3e56331a';
    const hash = createHash('sha512')
      .update(secretKey + body)
      .digest('hex');
    
    if (signature !== hash) {
      console.log('Invalid webhook signature');
      return c.json({ error: 'Invalid signature' }, 400);
    }
    
    // Handle successful payment
    if (event.event === 'charge.success') {
      const { reference, amount, customer } = event.data;
      
      // Find order by payment reference
      const orders = await kv.getByPrefix('order:');
      const order = orders.find(o => o.paymentReference === reference);
      
      if (order) {
        // Update order status to confirmed
        const updatedOrder = {
          ...order,
          status: 'processing',
          paymentStatus: 'paid',
          paymentVerified: true,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...order.timeline,
            {
              status: 'processing',
              timestamp: new Date().toISOString(),
              description: 'Payment confirmed, order processing'
            }
          ]
        };
        
        await kv.set(`order:${order.id}`, updatedOrder);
        console.log('Order payment confirmed:', order.id);
      }
    }
    
    return c.json({ status: 'success' });
  } catch (error) {
    console.log('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// Mount email notifications routes
app.route('/', emailNotifications);

// Global error handler
app.onError((error, c) => {
  console.error('Global error handler:', error);
  return c.json({
    error: 'Internal server error',
    message: error.message,
    stack: error.stack,
  }, 500);
});

// 404 handler
app.notFound((c) => {
  console.log('404 for path:', c.req.path);
  return c.json({ error: 'Route not found', path: c.req.path }, 404);
});

Deno.serve(app.fetch);