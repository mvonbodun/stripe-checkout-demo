/**
 * Price Component - Professional currency formatting using built-in Intl.NumberFormat
 * 
 * Features:
 * - Automatic currency symbol placement
 * - Proper thousands separators and decimal handling
 * - Locale-aware formatting
 * - TypeScript safe
 * - No external dependencies
 */

interface PriceProps {
  /** The price amount to format */
  amount: number;
  /** Currency code (e.g., 'USD', 'EUR', 'GBP') */
  currency?: string;
  /** Locale for formatting (e.g., 'en-US', 'de-DE', 'fr-FR') */
  locale?: string;
  /** Additional CSS classes */
  className?: string;
  /** Show currency code instead of symbol */
  showCode?: boolean;
}

export const Price = ({ 
  amount, 
  currency = 'USD', 
  locale = 'en-US',
  className = '',
  showCode = false
}: PriceProps) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: showCode ? 'code' : 'symbol',
  }).format(amount);

  // Debug output for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Price component: amount=${amount}, formatted=${formatted}`);
  }

  return <span className={className}>{formatted}</span>;
};

/**
 * Custom hook for price formatting - useful when you need the formatted string
 * without rendering a component
 */
export const usePrice = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Utility function for price formatting in non-React contexts
 */
export const formatPrice = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default Price;
