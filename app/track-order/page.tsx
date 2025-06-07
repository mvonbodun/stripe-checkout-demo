'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface OrderInfo {
  id: string;
  status: string;
  estimated_delivery: string;
  tracking_number?: string;
  carrier?: string;
  items: Array<{
    name: string;
    quantity: number;
    image?: string;
  }>;
  shipping_address?: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  timeline: Array<{
    status: string;
    date: string;
    description: string;
  }>;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    setOrderInfo(null);

    // Simulate order lookup
    setTimeout(() => {
      // Mock order data for demo purposes
      if (orderId.toLowerCase().includes('demo') || orderId.toLowerCase().includes('test')) {
        setOrderInfo({
          id: orderId,
          status: 'shipped',
          estimated_delivery: '2025-06-10',
          tracking_number: 'TRK123456789',
          carrier: 'UPS',
          items: [
            {
              name: 'Demo Product',
              quantity: 1,
              image: '/api/placeholder/100/100'
            }
          ],
          shipping_address: {
            line1: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94105',
            country: 'US'
          },
          timeline: [
            {
              status: 'Order Placed',
              date: '2025-06-05',
              description: 'Your order has been confirmed'
            },
            {
              status: 'Processing',
              date: '2025-06-06',
              description: 'Your order is being prepared for shipment'
            },
            {
              status: 'Shipped',
              date: '2025-06-07',
              description: 'Your order has been shipped and is on its way'
            }
          ]
        });
      } else if (orderId) {
        setError('Order not found. Please check your order ID and email address.');
      } else {
        setError('Please enter an order ID.');
      }
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-600">
            Enter your order information to track your package
          </p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID *
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your order ID (try 'demo123')"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                You can find your order ID in your confirmation email
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the email used for this order"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </div>
              ) : (
                'Track Order'
              )}
            </button>
          </form>
        </div>

        {/* Order Information */}
        {orderInfo && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order #{orderInfo.id}</h2>
                <p className="text-gray-600">Estimated delivery: {new Date(orderInfo.estimated_delivery).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  orderInfo.status === 'delivered' 
                    ? 'bg-green-100 text-green-800'
                    : orderInfo.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {orderInfo.status.charAt(0).toUpperCase() + orderInfo.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Tracking Information */}
            {orderInfo.tracking_number && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-mono text-lg text-gray-900">{orderInfo.tracking_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carrier</p>
                    <p className="text-lg text-gray-900">{orderInfo.carrier}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(`https://www.ups.com/track?tracknum=${orderInfo.tracking_number}`, '_blank')}
                  className="mt-4 bg-brown-600 text-white px-4 py-2 rounded-lg hover:bg-brown-700 transition-colors"
                >
                  Track on {orderInfo.carrier} Website
                </button>
              </div>
            )}

            {/* Order Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {orderInfo.timeline.map((event, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-4 h-4 rounded-full mt-1 mr-4 ${
                      index === orderInfo.timeline.length - 1 
                        ? 'bg-blue-600' 
                        : 'bg-green-600'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{event.status}</h4>
                        <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items in this Order</h3>
              <div className="space-y-4">
                {orderInfo.items.map((item, index: number) => (
                  <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">📦</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {orderInfo.shipping_address && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-700">
                    <p>{orderInfo.shipping_address.line1}</p>
                    <p>
                      {orderInfo.shipping_address.city}, {orderInfo.shipping_address.state} {orderInfo.shipping_address.postal_code}
                    </p>
                    <p>{orderInfo.shipping_address.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can&apos;t find your order?</h3>
              <p className="text-gray-600 mb-4">
                If you&apos;re having trouble locating your order, check your email for the confirmation message 
                or contact our support team for assistance.
              </p>
              <Link 
                href="/help" 
                className="text-blue-600 hover:underline"
              >
                Contact Support →
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Issues?</h3>
              <p className="text-gray-600 mb-4">
                If there&apos;s an issue with your order or delivery, our customer service team is here to help 
                resolve any problems quickly.
              </p>
              <a 
                href="mailto:support@example.com" 
                className="text-blue-600 hover:underline"
              >
                Email Support →
              </a>
            </div>
          </div>
        </div>

        {/* Back to Store */}
        <div className="text-center mt-12">
          <Link 
            href="/" 
            className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
