# Stripe Checkout Demo

A comprehensive e-commerce checkout demo built with Next.js 15, React 19, TypeScript, and Stripe. This application demonstrates a complete checkout flow with advanced features including tax calculation, shipping methods, Link Authentication, and order confirmation.

## Features

### 🛒 Shopping Experience
- **Product Catalog**: Browse products with detailed information
- **Shopping Cart**: Add, remove, and update item quantities
- **Mini Cart**: Quick cart overview with slide-out interface
- **Persistent Cart**: Cart state persists across browser sessions

### 💳 Checkout & Payments
- **Stripe Payment Elements**: Modern, secure payment form
- **Payment Intent Integration**: Real-time payment processing
- **Link Authentication**: Stripe's autofill feature for returning customers
- **Address Element**: Smart address collection and validation
- **Email Validation**: Built-in email verification

### 🧾 Tax & Shipping
- **Real-time Tax Calculation**: Automatic tax computation based on location
- **Shipping Methods**: Multiple shipping options with cost calculation
- **Shipping Tax**: Tax calculation on shipping costs
- **Line Item Breakdown**: Detailed tax and shipping breakdown per item

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Built with Tailwind CSS and DaisyUI
- **Conditional Headers**: Different header layouts for checkout vs browsing
- **Order Confirmation**: Professional order summary page

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Framework**: React 19
- **Styling**: Tailwind CSS + DaisyUI
- **Payments**: Stripe Payment Elements
- **State Management**: React Context + useReducer
- **Storage**: localStorage for cart persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Stripe account for API keys

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stripe-checkout-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Add your Stripe keys to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── calculate-tax/      # Tax calculation endpoint
│   │   ├── create-payment-intent/ # Payment Intent creation
│   │   ├── stripe-webhook/     # Stripe webhook handler
│   │   └── ...
│   ├── checkout/               # Checkout page
│   ├── order-confirmation/     # Order confirmation page
│   ├── components/             # React components
│   │   ├── GlobalHeader.tsx    # Main site header
│   │   ├── MiniCart.tsx        # Shopping cart component
│   │   ├── ShippingMethods.tsx # Shipping selection
│   │   └── ...
│   ├── utils/                  # Utility functions
│   ├── cart-context.tsx        # Cart state management
│   └── layout.tsx              # Root layout
├── public/                     # Static assets
└── stripe_json_samples/        # Example Stripe API responses
```

## Key Components

### Cart Management
- **CartProvider**: Global cart state management
- **MiniCart**: Slide-out cart interface
- **CartIcon**: Header cart icon with item count

### Checkout Flow
- **Payment Elements**: Stripe's integrated payment form
- **Address Collection**: Smart address validation
- **Shipping Methods**: Dynamic shipping options
- **Tax Calculation**: Real-time tax computation

### Headers
- **GlobalHeader**: Full site header with navigation and cart
- **ConditionalHeader**: Simplified header for checkout pages

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:turbo` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

## API Endpoints

- `POST /api/create-payment-intent` - Create Stripe Payment Intent
- `POST /api/calculate-tax` - Calculate taxes for cart
- `POST /api/stripe-webhook` - Handle Stripe webhooks
- `GET /api/catalog-categories` - Get product categories
- `GET /api/promotional-offers` - Get promotional offers

## Testing

The project includes comprehensive testing utilities:

- **Test Pages**: Various test pages for checkout flow validation
- **Debug Tools**: HTML files for debugging Stripe integration
- **Validation Scripts**: JavaScript files for testing specific features

## Documentation

Additional documentation is available in the project:

- `LINK_AUTH_IMPLEMENTATION_COMPLETE.md` - Link Authentication setup
- `SHIPPING_TAX_IMPLEMENTATION.md` - Shipping and tax calculation
- `PAY_BUTTON_VALIDATION_COMPLETE.md` - Payment validation
- `TIMING_FIX_VERIFICATION.md` - Timing optimization details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for demonstration purposes. Please check Stripe's terms of service for production usage.

## Support

For questions about Stripe integration, refer to the [Stripe Documentation](https://docs.stripe.com/).

For Next.js questions, check the [Next.js Documentation](https://nextjs.org/docs).
