'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type CompletedOrder = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  items: Array<{
    id: string;
    product_id: number;
    name: string;
    attributes?: string[];
    image?: string;
    price: number;
    quantity: number;
    line_subtotal: number;
    line_tax_total: number;
    line_shipping_total: number;
    line_shipping_tax_total: number;
    line_grand_total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  shipping_tax: number;
  total: number;
  timestamp: string;
  email?: string;
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  } | null;
  expressPaymentType?: string;
  shipping_method_id?: string | null;
  shipping_method_name?: string | null;
};

export default function OrderConfirmation() {
  const [order, setOrder] = useState<CompletedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem('completed-order');
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        setOrder(parsedOrder);
        // Clear the stored order data after loading it
        localStorage.removeItem('completed-order');
      }
    } catch (error) {
      console.error('Error loading completed order:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <p className="text-gray-700 mb-4">We couldn&apos;t find your order information.</p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-700 mb-1">Thank you for your purchase</p>
          {order.email && (
            <p className="text-gray-600">
              A confirmation email has been sent to {order.email}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600">Order #{order.id}</p>
              <p className="text-sm text-gray-500">{formatDate(order.timestamp)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'succeeded' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status === 'succeeded' ? 'Paid' : 'Processing'}
              </span>
              {order.expressPaymentType && (
                <span className="ml-2 inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.expressPaymentType === 'apple_pay' ? 'Apple Pay' : 'Express Pay'}
                </span>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 mr-4">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    {item.attributes && item.attributes.length > 0 && (
                      <p className="text-sm text-gray-600">{item.attributes.join(', ')}</p>
                    )}
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${item.line_grand_total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'FREE'}</span>
              </div>
              {order.shipping_method_name && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="ml-4">via {order.shipping_method_name}</span>
                  <span></span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.shipping_tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Tax</span>
                  <span>${order.shipping_tax.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          {order.shipping_method_name && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Shipping Method</h3>
              <div className="text-gray-600">
                <p className="font-medium">{order.shipping_method_name}</p>
                <p className="text-sm">
                  Cost: {order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'FREE'}
                </p>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.address && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-gray-600">
                {order.address.line1 && <p>{order.address.line1}</p>}
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>
                  {order.address.city && `${order.address.city}, `}
                  {order.address.state && `${order.address.state} `}
                  {order.address.postal_code}
                </p>
                {order.address.country && <p>{order.address.country}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
