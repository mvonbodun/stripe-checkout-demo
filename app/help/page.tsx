'use client';

import React from 'react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-lg text-gray-600">
            Find answers to your questions or get in touch with our support team
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 mb-4">Find quick answers to common questions</p>
            <Link 
              href="#faq" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse FAQ
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Get help via email</p>
            <a 
              href="mailto:support@example.com" 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Send Email
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team</p>
            <button 
              onClick={() => alert('Live chat would open here')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I track my order?</h3>
              <p className="text-gray-600">
                You can track your order by visiting our <Link href="/track-order" className="text-blue-600 hover:underline">Track Order page</Link> 
                and entering your order ID. You&apos;ll also receive tracking information via email once your order ships.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express), debit cards, Apple Pay, Google Pay, and Link by Stripe.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
              <p className="text-gray-600">
                Shipping times vary by location and selected shipping method. Standard shipping typically takes 5-7 business days, 
                while expedited options are available for faster delivery.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is your return policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day return policy for most items. Items must be in original condition with tags attached. 
                Some restrictions apply to certain product categories.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I contact customer service?</h3>
              <p className="text-gray-600">
                You can reach us via email at support@example.com, through our live chat feature, or by calling 1-800-SUPPORT.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
              <p className="text-gray-600">
                Yes, we use Stripe for secure payment processing. All payment information is encrypted and we never store your 
                full credit card details on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Support</h3>
              <div className="space-y-2 text-gray-600">
                <p>📧 support@example.com</p>
                <p>📞 1-800-SUPPORT</p>
                <p>🕒 Monday - Friday: 9AM - 6PM EST</p>
                <p>🕒 Saturday: 10AM - 4PM EST</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Address</h3>
              <div className="space-y-1 text-gray-600">
                <p>Demo Store Inc.</p>
                <p>123 Commerce Street</p>
                <p>San Francisco, CA 94105</p>
                <p>United States</p>
              </div>
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
