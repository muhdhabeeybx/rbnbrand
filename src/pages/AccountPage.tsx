import React, { useState } from 'react';
import { User, Package, Heart, Settings, LogOut, Edit3 } from 'lucide-react';

export function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user data
  const user = {
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    joinDate: 'March 2024',
    totalOrders: 12,
    totalSpent: 2840
  };

  const orders = [
    {
      id: '#RBN001234',
      date: 'Dec 15, 2024',
      status: 'Delivered',
      total: 240,
      items: ['Essential Hoodie - Black', 'Logo Tee - White']
    },
    {
      id: '#RBN001235',
      date: 'Dec 10, 2024',
      status: 'In Transit',
      total: 180,
      items: ['Cargo Pants - Gray']
    },
    {
      id: '#RBN001236',
      date: 'Nov 28, 2024',
      status: 'Delivered',
      total: 160,
      items: ['Basic Tee - Black', 'RBN Cap']
    }
  ];

  const wishlist = [
    {
      id: 1,
      name: 'Premium Hoodie',
      price: 180,
      image: '/api/placeholder/300/400'
    },
    {
      id: 2,
      name: 'Utility Jacket',
      price: 280,
      image: '/api/placeholder/300/400'
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <main className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl mb-2">My Account</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <button className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl mb-1">{user.totalOrders}</div>
              <div className="text-gray-500 text-sm">Total Orders</div>
            </div>
            <div>
              <div className="text-2xl mb-1">${user.totalSpent}</div>
              <div className="text-gray-500 text-sm">Total Spent</div>
            </div>
            <div>
              <div className="text-2xl mb-1">{user.joinDate}</div>
              <div className="text-gray-500 text-sm">Member Since</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white p-6 rounded-2xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl">Profile Information</h2>
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Not provided"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white p-8 rounded-2xl">
                <h2 className="text-2xl mb-6">Order History</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="mb-1">{order.id}</h3>
                          <p className="text-gray-500 text-sm">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-3 py-1 rounded-full text-xs ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </div>
                          <p className="mt-1">${order.total}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white p-8 rounded-2xl">
                <h2 className="text-2xl mb-6">Wishlist</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">PRODUCT IMAGE</span>
                      </div>
                      <h3 className="mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">${item.price}</p>
                      <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-2xl">
                <h2 className="text-2xl mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="mb-1">Email Notifications</h3>
                      <p className="text-gray-500 text-sm">Receive updates about orders and new products</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="mb-1">SMS Updates</h3>
                      <p className="text-gray-500 text-sm">Get shipping notifications via text</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <button className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}